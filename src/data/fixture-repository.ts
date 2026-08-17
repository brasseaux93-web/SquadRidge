import type {
  AuditEvent,
  Message,
  OutcomeEntry,
  Room,
  RoomParticipant,
  User,
} from "@/domain/types";
import type { CloseRoomSummary, RoomRepository } from "./repository";
import {
  DEMO_MESSAGES,
  DEMO_OUTCOMES,
  DEMO_PARTICIPANTS,
  DEMO_ROOMS,
  DEMO_USERS,
} from "./fixtures";

export interface FixtureState {
  users: User[];
  rooms: Room[];
  participants: RoomParticipant[];
  messages: Message[];
  outcomes: OutcomeEntry[];
  audit: AuditEvent[];
}

export function createInitialFixtureState(): FixtureState {
  return {
    users: structuredClone(DEMO_USERS),
    rooms: structuredClone(DEMO_ROOMS),
    participants: structuredClone(DEMO_PARTICIPANTS),
    messages: structuredClone(DEMO_MESSAGES),
    outcomes: structuredClone(DEMO_OUTCOMES),
    audit: [],
  };
}

export class FixtureRoomRepository implements RoomRepository {
  constructor(private state: FixtureState = createInitialFixtureState()) {}

  getState(): FixtureState {
    return this.state;
  }

  reset(state?: FixtureState) {
    this.state = state ?? createInitialFixtureState();
  }

  async listUsers() {
    return [...this.state.users];
  }

  async getUser(id: string) {
    return this.state.users.find((u) => u.id === id) ?? null;
  }

  async listRooms() {
    return [...this.state.rooms];
  }

  async getRoom(id: string) {
    return this.state.rooms.find((r) => r.id === id) ?? null;
  }

  async updateRoom(
    id: string,
    patch: Partial<Pick<Room, "status" | "phase" | "closedAt">>
  ) {
    const idx = this.state.rooms.findIndex((r) => r.id === id);
    if (idx < 0) return null;
    this.state.rooms[idx] = { ...this.state.rooms[idx], ...patch };
    return this.state.rooms[idx];
  }

  async listParticipants(roomId: string) {
    return this.state.participants.filter((p) => p.roomId === roomId);
  }

  async listMessages(roomId: string) {
    return this.state.messages.filter((m) => m.roomId === roomId);
  }

  async addMessage(message: Message) {
    this.state.messages.push(message);
    return message;
  }

  async purgeMessages(roomId: string) {
    const before = this.state.messages.length;
    this.state.messages = this.state.messages.filter((m) => m.roomId !== roomId);
    return before - this.state.messages.length;
  }

  async listOutcomes(roomId: string) {
    return this.state.outcomes.filter((o) => o.roomId === roomId);
  }

  async getOutcome(id: string) {
    return this.state.outcomes.find((o) => o.id === id) ?? null;
  }

  async addOutcome(entry: OutcomeEntry) {
    this.state.outcomes.push(entry);
    return entry;
  }

  async updateOutcome(
    id: string,
    patch: Partial<
      Pick<OutcomeEntry, "status" | "approvedBy" | "approvedAt" | "body" | "notes">
    >
  ) {
    const idx = this.state.outcomes.findIndex((o) => o.id === id);
    if (idx < 0) return null;
    this.state.outcomes[idx] = { ...this.state.outcomes[idx], ...patch };
    return this.state.outcomes[idx];
  }

  async approveOutcomeAtomic(outcomeId: string, actorId: string) {
    const o = await this.getOutcome(outcomeId);
    if (!o) throw new Error("outcome_not_found");
    if (!['proposed', 'under_review', 'revised'].includes(o.status)) {
      throw new Error("outcome_not_approvable");
    }
    const room = await this.getRoom(o.roomId);
    if (!room || room.status === "closed") throw new Error("room_closed");
    const updated = await this.updateOutcome(outcomeId, {
      status: "approved",
      approvedBy: actorId,
      approvedAt: new Date().toISOString(),
    });
    if (!updated) throw new Error("outcome_not_found");
    await this.appendAudit({
      id: `aud-${crypto.randomUUID().slice(0, 8)}`,
      roomId: o.roomId,
      actorId,
      action: "outcome.approved",
      metadata: { outcomeId },
      createdAt: new Date().toISOString(),
    });
    return updated;
  }

  async closeAndPurge(roomId: string, actorId: string): Promise<CloseRoomSummary> {
    const room = await this.getRoom(roomId);
    if (!room) throw new Error("room_not_found");

    let alreadyClosed = room.status === "closed";
    if (!alreadyClosed) {
      await this.updateRoom(roomId, {
        status: "closed",
        phase: "closing",
        closedAt: new Date().toISOString(),
      });
      await this.appendAudit({
        id: `aud-${crypto.randomUUID().slice(0, 8)}`,
        roomId,
        actorId,
        action: "room.closed",
        metadata: { purged: true },
        createdAt: new Date().toISOString(),
      });
    }

    const purged = await this.purgeMessages(roomId);
    const approved = (await this.listOutcomes(roomId)).filter(
      (o) => o.status === "approved"
    ).length;
    const closed = await this.getRoom(roomId);

    return {
      roomId,
      status: "closed",
      alreadyClosed,
      closedAt: closed?.closedAt ?? null,
      purgedMessageCount: purged,
      retainedApprovedOutcomeCount: approved,
    };
  }

  async appendAudit(event: AuditEvent) {
    this.state.audit.push(event);
  }

  async listAudit(roomId?: string) {
    if (!roomId) return [...this.state.audit];
    return this.state.audit.filter((a) => a.roomId === roomId);
  }
}
