/** Core domain types for SquadRidge — pilot-oriented model. */

export type UserRole = "platform_admin" | "organization_admin" | "facilitator" | "participant" | "observer";

export type RoomStatus =
  | "draft"
  | "scheduled"
  | "waiting"
  | "prepared"
  | "live"
  | "paused"
  | "safety_review"
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

export type PilotStatus = "draft" | "active" | "paused" | "closed";

export type OutcomeVisibility = "room_only" | "organization" | "anonymized_ledger";

export type SafetyCategory = "concern" | "pause_request" | "escalation" | "other";
export type SafetyStatus = "open" | "acknowledged" | "resolved" | "escalated";

export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";

export interface User {
  id: string;
  name: string;
  email: string;
  organization?: string;
  role: UserRole;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  createdBy?: string;
}

export interface OrganizationMembership {
  id: string;
  organizationId: string;
  userId: string;
  role: "org_admin" | "facilitator" | "member";
  active: boolean;
  joinedAt: string;
}

export interface Pilot {
  id: string;
  organizationId: string;
  title: string;
  purpose: string;
  status: PilotStatus;
  participantCriteria: string;
  safetyContacts: string;
  consentLanguage: string;
  retentionDays: number;
  outcomeVisibility: OutcomeVisibility;
  maxRooms?: number;
  maxParticipantsPerRoom?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PilotMembership {
  id: string;
  pilotId: string;
  userId: string;
  role: "facilitator" | "participant" | "observer";
  active: boolean;
  joinedAt: string;
}

export interface Invitation {
  id: string;
  organizationId?: string;
  pilotId?: string;
  roomId?: string;
  email: string;
  role: string;
  token: string;
  status: InvitationStatus;
  invitedBy?: string;
  expiresAt?: string;
  acceptedAt?: string;
  createdAt: string;
}

export interface RoomParticipant {
  id: string;
  roomId: string;
  userId: string;
  /** Facilitator-assigned in-room identity, e.g. "Engineer A" — never real name in room context */
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
  pilotId?: string;
  isDemo: boolean;
  createdBy: string;
  createdAt: string;
  scheduledAt?: string;
  closedAt?: string;
  groundRules: string[];
  /** Invite code for participants (demo / simple join) */
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
  /** Structured fields for mediation artifact */
  sharedUnderstanding?: string;
  pointsOfAgreement?: string;
  unresolvedIssues?: string;
  commitments?: string;
  reviewDate?: string;
  visibility?: OutcomeVisibility;
}

export interface SafetyReport {
  id: string;
  roomId: string;
  reporterMembershipId?: string;
  category: SafetyCategory;
  note: string;
  status: SafetyStatus;
  assignedTo?: string;
  resolvedAt?: string;
  resolutionNote?: string;
  createdAt: string;
}

export interface RoomAgreement {
  id: string;
  roomId: string;
  body: string;
  sortOrder: number;
  createdAt: string;
}

export interface AgreementAcknowledgement {
  id: string;
  agreementId: string;
  membershipId: string;
  acknowledgedAt: string;
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
  | "room.paused"
  | "message.sent"
  | "outcome.proposed"
  | "outcome.approved"
  | "outcome.rejected"
  | "safety.reported"
  | "safety.resolved"
  | "invitation.created"
  | "pilot.created";

export interface AuditEvent {
  id: string;
  roomId?: string;
  actorId: string;
  action: AuditAction;
  /** Must not include raw message bodies or sensitive free text */
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: string;
}

/** Anonymized, consented ledger entry for pilot impact (never raw chat) */
export interface LedgerEntry {
  id: string;
  pilotId: string;
  category: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  regionBroad?: string;
  status: "completed" | "in_review" | "withdrawn";
  consentVisibility: string;
  summary: string;
  createdAt: string;
}
