import type {
  AuditEvent,
  Message,
  OutcomeEntry,
  OutcomeStatus,
  Room,
  RoomParticipant,
  RoomStatus,
  SessionPhase,
  User,
} from "@/domain/types";

/**
 * Data-access boundary. UI and services depend on this interface,
 * not on Zustand or Supabase client details.
 */
export interface RoomRepository {
  listUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | null>;

  listRooms(): Promise<Room[]>;
  getRoom(id: string): Promise<Room | null>;
  updateRoom(
    id: string,
    patch: Partial<Pick<Room, "status" | "phase" | "closedAt">>
  ): Promise<Room | null>;

  listParticipants(roomId: string): Promise<RoomParticipant[]>;
  listMessages(roomId: string): Promise<Message[]>;
  addMessage(message: Message): Promise<Message>;
  /** Hard-delete all messages for a room (fixture purge / production DELETE). */
  purgeMessages(roomId: string): Promise<number>;

  listOutcomes(roomId: string): Promise<OutcomeEntry[]>;
  getOutcome(id: string): Promise<OutcomeEntry | null>;
  addOutcome(entry: OutcomeEntry): Promise<OutcomeEntry>;
  updateOutcome(
    id: string,
    patch: Partial<
      Pick<OutcomeEntry, "status" | "approvedBy" | "approvedAt" | "body" | "notes">
    >
  ): Promise<OutcomeEntry | null>;

  appendAudit(event: AuditEvent): Promise<void>;
  listAudit(roomId?: string): Promise<AuditEvent[]>;
}

export type DataAdapterName = "fixture" | "supabase";

export function getConfiguredAdapterName(): DataAdapterName {
  const raw =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_DATA_ADAPTER) ||
    (typeof process !== "undefined" && process.env.DATA_ADAPTER) ||
    "fixture";
  return raw === "supabase" ? "supabase" : "fixture";
}
