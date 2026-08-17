import {
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
  SafetyCategory,
  SafetyReport,
  SessionPhase,
  User,
} from "@/domain/types";
import type { CloseRoomSummary, RoomRepository } from "./repository";

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function isFacilitatorRole(user: User): boolean {
  return (
    user.role === "facilitator" ||
    user.role === "organization_admin" ||
    user.role === "platform_admin"
  );
}

function mapPauseIntentToCategory(
  intent: "pause" | "support" | "concern" | "step_away"
): SafetyCategory {
  switch (intent) {
    case "pause":
    case "step_away":
      return "pause_request";
    case "support":
      return "other";
    case "concern":
      return "concern";
    default:
      return "other";
  }
}

/**
 * Application service: UX validation + role checks on top of RoomRepository.
 * Server RLS/RPCs remain the authority when DATA_ADAPTER=supabase.
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

  async listOutcomesForViewer(
    roomId: string,
    viewer: User
  ): Promise<OutcomeEntry[]> {
    const all = await this.repo.listOutcomes(roomId);
    if (isFacilitatorRole(viewer)) return all;
    return all.filter((o) => o.status === "approved");
  }

  async listSafetyReports(roomId: string): Promise<SafetyReport[]> {
    return this.repo.listSafetyReports(roomId);
  }

  async reportSafety(
    actor: User,
    input: {
      roomId: string;
      intent: "pause" | "support" | "concern" | "step_away";
      note: string;
      membershipId?: string;
    }
  ): Promise<Result<SafetyReport>> {
    const room = await this.repo.getRoom(input.roomId);
    if (!room) return fail("Room not found.", "NOT_FOUND");
    if (room.status === "closed") {
      return fail("Cannot file a safety request on a closed room.", "INVALID_STATE");
    }

    const members = await this.repo.listParticipants(input.roomId);
    const membership =
      members.find((m) => m.userId === actor.id) ??
      (input.membershipId
        ? members.find((m) => m.id === input.membershipId)
        : undefined);

    if (!membership) {
      return fail("You are not a member of this room.", "UNAUTHORIZED");
    }

    const report: SafetyReport = {
      id: newId("sr"),
      roomId: input.roomId,
      reporterMembershipId: membership.id,
      category: mapPauseIntentToCategory(input.intent),
      note: input.note.trim() || `(${input.intent})`,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    try {
      const created = await this.repo.addSafetyReport(report);
      await this.repo.appendAudit({
        id: newId("aud"),
        roomId: input.roomId,
        actorId: actor.id,
        action: "safety.reported",
        metadata: {
          reportId: created.id,
          category: created.category,
          intent: input.intent,
        },
        createdAt: new Date().toISOString(),
      });

      // Soft signal: mark room paused on explicit pause requests (fixture behavior).
      if (input.intent === "pause" && room.status === "live") {
        await this.repo.updateRoom(input.roomId, { status: "paused" });
        await this.repo.appendAudit({
          id: newId("aud"),
          roomId: input.roomId,
          actorId: actor.id,
          action: "room.paused",
          metadata: { reason: "safety.pause_request" },
          createdAt: new Date().toISOString(),
        });
      }

      return ok(created);
    } catch (e) {
      return fail(
        e instanceof Error ? e.message : "Unable to record safety request.",
        "INVALID_STATE"
      );
    }
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

    try {
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
    } catch (e) {
      return fail(
        e instanceof Error ? e.message : "Unable to update phase.",
        "INVALID_STATE"
      );
    }
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
      return fail(
        "You are not a member of this room under that identity.",
        "UNAUTHORIZED"
      );
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

    try {
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
    } catch (e) {
      return fail(
        e instanceof Error ? e.message : "Unable to send message.",
        "INVALID_STATE"
      );
    }
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
      return fail(
        "Only facilitators can propose outcomes in this prototype.",
        "UNAUTHORIZED"
      );
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

    try {
      const created = await this.repo.addOutcome(entry);
      await this.repo.appendAudit({
        id: newId("aud"),
        roomId: input.roomId,
        actorId: actor.id,
        action: "outcome.proposed",
        metadata: { outcomeId: created.id },
        createdAt: new Date().toISOString(),
      });
      return ok(created);
    } catch (e) {
      return fail(
        e instanceof Error ? e.message : "Unable to propose outcome.",
        "INVALID_STATE"
      );
    }
  }

  async setOutcomeStatus(
    actor: User,
    outcomeId: string,
    status: Extract<OutcomeStatus, "approved" | "rejected">
  ): Promise<Result<OutcomeEntry>> {
    if (!isFacilitatorRole(actor)) {
      return fail("Only facilitators can approve or reject outcomes.", "UNAUTHORIZED");
    }

    try {
      if (status === "approved") {
        const updated = await this.repo.approveOutcomeAtomic(outcomeId, actor.id);
        return ok(updated);
      }
      const updated = await this.repo.rejectOutcomeAtomic(outcomeId, actor.id);
      return ok(updated);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unable to update outcome.";
      if (msg.includes("permission")) return fail(msg, "UNAUTHORIZED");
      return fail(msg, "INVALID_STATE");
    }
  }

  async closeRoom(
    actor: User,
    roomId: string
  ): Promise<Result<{ room: Room; summary: CloseRoomSummary }>> {
    if (!isFacilitatorRole(actor)) {
      return fail("Only facilitators can close a room.", "UNAUTHORIZED");
    }

    try {
      const summary = await this.repo.closeAndPurge(roomId, actor.id);
      const room = await this.repo.getRoom(roomId);
      if (!room) return fail("Room not found.", "NOT_FOUND");
      return ok({ room, summary });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unable to close room.";
      if (msg.includes("permission")) return fail(msg, "UNAUTHORIZED");
      return fail(msg, "INVALID_STATE");
    }
  }
}
