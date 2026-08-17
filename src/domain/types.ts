/** Core domain types for SquadRidge — derived from source product vision. */

export type UserRole = "facilitator" | "participant" | "admin";

export type RoomStatus =
  | "draft"
  | "prepared"
  | "live"
  | "closing"
  | "closed";

export type OutcomeStatus =
  | "proposed"
  | "under_review"
  | "approved"
  | "rejected"
  | "revised";

export type SessionPhase =
  | "opening"
  | "dialogue"
  | "caucus"
  | "synthesis"
  | "closing";

export interface User {
  id: string;
  name: string;
  email: string;
  organization?: string;
  role: UserRole;
}

export interface RoomParticipant {
  id: string;
  roomId: string;
  userId: string;
  /** Facilitator-assigned in-room identity, e.g. "Engineer A" */
  displayRole: string;
  isFacilitator: boolean;
  joinedAt?: string;
}

export interface Room {
  id: string;
  title: string;
  status: RoomStatus;
  phase: SessionPhase;
  organizationId?: string;
  createdBy: string;
  createdAt: string;
  scheduledAt?: string;
  closedAt?: string;
  groundRules: string[];
  /** Invite code for participants (demo) */
  inviteCode: string;
}

export interface Message {
  id: string;
  roomId: string;
  participantId: string;
  /** Display role at time of send — never real name in room context */
  displayRole: string;
  body: string;
  createdAt: string;
  isFacilitator: boolean;
}

export interface OutcomeEntry {
  id: string;
  roomId: string;
  status: OutcomeStatus;
  body: string;
  ownerLabel?: string;
  dueDate?: string;
  proposedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  notes?: string;
}

export interface RoomSummary {
  room: Room;
  participantCount: number;
  openOutcomes: number;
  approvedOutcomes: number;
}

export type AuditAction =
  | "room.phase_changed"
  | "room.closed"
  | "message.sent"
  | "outcome.proposed"
  | "outcome.approved"
  | "outcome.rejected";

export interface AuditEvent {
  id: string;
  roomId?: string;
  actorId: string;
  action: AuditAction;
  /** Must not include raw message bodies */
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: string;
}
