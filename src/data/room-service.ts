import {
  canApproveOutcome,
  canSendMessage,
  canSetPhase,
  fail,
  ok,
  type Result,
} from "@/domain/transitions";
import type {
  Message,
  OutcomeEntry,
  OutcomeStatus,
  Room,
  RoomParticipant,
  SessionPhase,
  User,
} from "@/domain/types";
import type { RoomRepository } from "./repository";

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function isFacilitatorRole(user: User): boolean {
  return user.role === "facilitator" || user.role === "admin";
}

/**
 * Application service: authorization + domain rules on top of RoomRepository.
 * All UI mutations should go through this layer.
 */
export class RoomService {
  constructor(private repo: RoomRepository) {}

  async listRooms(): Promise<Room[]> {
    return this.repo.listRooms();
  }

  async getRoom(id: string): Promise<Room | null> {
    return this.repo.getRoom(id);
  }

  async listParticipants(roomId: string): Promise<RoomParticipant[]> {
    return this.repo.listParticipants(roomId);
  }

  async listMessages(roomId: string): Promise<Message[]> {
    return this.repo.listMessages(roomId);
  }

  /** Participants only receive approved outcomes; facilitators receive all. */
  async listOutcomesForViewer(
    roomId: string,
    viewer: User
  ): Promise<OutcomeEntry[]> {
    const all = await this.repo.listOutcomes(roomId);
    if (isFacilitatorRole(viewer)) return all;
    return all.filter((o) => o.status === "approved");
  }

  async setPhase(
    actor: User,
    roomId: string,
    phase: SessionPhase
  ): Promise<Result<Room>> {
    if (!isFacilitatorRole(actor)) {
      return fail("Only facilitators can change the session phase.", "UNAUTHORIZED");
    }
    const room = await this.repo.getRoom(roomId);
    if (!room) return fail("Room not found.", "NOT_FOUND");
    const check = canSetPhase(room.status, phase);
    if (!check.ok) return fail(check.reason, "INVALID_STATE");

    const updated = await this.repo.updateRoom(roomId, { phase });
    if (!updated) return fail("Room not found.", "NOT_FOUND");

    await this.repo.appendAudit({
      id: newId("aud"),
      roomId,
      actorId: actor.id,
      action: "room.phase_changed",
      metadata: { phase },
      createdAt: new Date().toISOString(),
    });
    return ok(updated);
  }

  async sendMessage(
    actor: User,
    input: {
      roomId: string;
      participantId: string;
      displayRole: string;
      body: string;
      isFacilitator: boolean;
    }
  ): Promise<Result<Message>> {
    const body = input.body.trim();
    if (!body) return fail("Message cannot be empty.", "VALIDATION");

    const room = await this.repo.getRoom(input.roomId);
    if (!room) return fail("Room not found.", "NOT_FOUND");
    const check = canSendMessage(room.status);
    if (!check.ok) return fail(check.reason, "INVALID_STATE");

    const members = await this.repo.listParticipants(input.roomId);
    const membership = members.find((m) => m.id === input.participantId);
    if (!membership || membership.userId !== actor.id) {
      return fail("You are not a member of this room under that identity.", "UNAUTHORIZED");
    }

    const message: Message = {
      id: newId("m"),
      roomId: input.roomId,
      participantId: input.participantId,
      displayRole: input.displayRole,
      body,
      createdAt: new Date().toISOString(),
      isFacilitator: membership.isFacilitator,
    };
    await this.repo.addMessage(message);
    await this.repo.appendAudit({
      id: newId("aud"),
      roomId: input.roomId,
      actorId: actor.id,
      action: "message.sent",
      metadata: { messageId: message.id },
      createdAt: new Date().toISOString(),
    });
    return ok(message);
  }

  async proposeOutcome(
    actor: User,
    input: {
      roomId: string;
      body: string;
      proposedByParticipantId: string;
      ownerLabel?: string;
      dueDate?: string;
    }
  ): Promise<Result<OutcomeEntry>> {
    if (!isFacilitatorRole(actor)) {
      return fail("Only facilitators can propose outcomes in this prototype.", "UNAUTHORIZED");
    }
    const body = input.body.trim();
    if (!body) return fail("Outcome text cannot be empty.", "VALIDATION");

    const room = await this.repo.getRoom(input.roomId);
    if (!room) return fail("Room not found.", "NOT_FOUND");
    if (room.status === "closed") {
      return fail("Cannot propose outcomes on a closed room.", "INVALID_STATE");
    }

    const entry: OutcomeEntry = {
      id: newId("o"),
      roomId: input.roomId,
      status: "proposed",
      body,
      ownerLabel: input.ownerLabel,
      dueDate: input.dueDate,
      proposedBy: input.proposedByParticipantId,
      createdAt: new Date().toISOString(),
    };
    await this.repo.addOutcome(entry);
    await this.repo.appendAudit({
      id: newId("aud"),
      roomId: input.roomId,
      actorId: actor.id,
      action: "outcome.proposed",
      metadata: { outcomeId: entry.id },
      createdAt: new Date().toISOString(),
    });
    return ok(entry);
  }

  async setOutcomeStatus(
    actor: User,
    outcomeId: string,
    status: Extract<OutcomeStatus, "approved" | "rejected">
  ): Promise<Result<OutcomeEntry>> {
    if (!isFacilitatorRole(actor)) {
      return fail("Only facilitators can approve or reject outcomes.", "UNAUTHORIZED");
    }
    const outcome = await this.repo.getOutcome(outcomeId);
    if (!outcome) return fail("Outcome not found.", "NOT_FOUND");

    if (status === "approved") {
      const check = canApproveOutcome(outcome.status);
      if (!check.ok) return fail(check.reason, "INVALID_STATE");
    }

    const updated = await this.repo.updateOutcome(outcomeId, {
      status,
      approvedBy: status === "approved" ? actor.id : outcome.approvedBy,
      approvedAt:
        status === "approved" ? new Date().toISOString() : outcome.approvedAt,
    });
    if (!updated) return fail("Outcome not found.", "NOT_FOUND");

    await this.repo.appendAudit({
      id: newId("aud"),
      roomId: outcome.roomId,
      actorId: actor.id,
      action: status === "approved" ? "outcome.approved" : "outcome.rejected",
      metadata: { outcomeId },
      createdAt: new Date().toISOString(),
    });
    return ok(updated);
  }

  /**
   * Close room and purge messages. Idempotent if already closed.
   */
  async closeRoom(actor: User, roomId: string): Promise<Result<Room>> {
    if (!isFacilitatorRole(actor)) {
      return fail("Only facilitators can close a room.", "UNAUTHORIZED");
    }
    const room = await this.repo.getRoom(roomId);
    if (!room) return fail("Room not found.", "NOT_FOUND");

    if (room.status === "closed") {
      await this.repo.purgeMessages(roomId);
      return ok(room);
    }

    const updated = await this.repo.updateRoom(roomId, {
      status: "closed",
      phase: "closing",
      closedAt: new Date().toISOString(),
    });
    if (!updated) return fail("Room not found.", "NOT_FOUND");

    await this.repo.purgeMessages(roomId);
    await this.repo.appendAudit({
      id: newId("aud"),
      roomId,
      actorId: actor.id,
      action: "room.closed",
      metadata: { purged: true },
      createdAt: new Date().toISOString(),
    });
    return ok(updated);
  }
}
