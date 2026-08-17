import type { OutcomeStatus, RoomStatus, SessionPhase } from "./types";

export const SESSION_PHASES: readonly SessionPhase[] = [
  "opening",
  "dialogue",
  "caucus",
  "synthesis",
  "closing",
] as const;

export const ROOM_STATUSES: readonly RoomStatus[] = [
  "draft",
  "scheduled",
  "waiting",
  "prepared",
  "live",
  "paused",
  "safety_review",
  "closing",
  "closed",
] as const;

export const OUTCOME_STATUSES: readonly OutcomeStatus[] = [
  "proposed",
  "under_review",
  "approved",
  "rejected",
  "revised",
] as const;

const OPEN_FOR_DIALOGUE: ReadonlySet<RoomStatus> = new Set([
  "prepared",
  "live",
  "paused",
  "waiting",
]);

/** Facilitator may set any phase while room is not closed. */
export function canSetPhase(
  currentStatus: RoomStatus,
  nextPhase: SessionPhase
): { ok: true } | { ok: false; reason: string } {
  if (currentStatus === "closed") {
    return { ok: false, reason: "Cannot change phase on a closed room." };
  }
  if (!SESSION_PHASES.includes(nextPhase)) {
    return { ok: false, reason: `Invalid phase: ${nextPhase}` };
  }
  return { ok: true };
}

export function canApproveOutcome(
  status: OutcomeStatus
): { ok: true } | { ok: false; reason: string } {
  if (status === "approved") {
    return { ok: false, reason: "Outcome is already approved." };
  }
  if (status === "rejected") {
    return { ok: false, reason: "Rejected outcomes cannot be approved without revision." };
  }
  return { ok: true };
}

export function canSendMessage(
  roomStatus: RoomStatus
): { ok: true } | { ok: false; reason: string } {
  if (roomStatus === "closed") {
    return { ok: false, reason: "Room is closed; messages cannot be sent." };
  }
  if (roomStatus === "safety_review") {
    return { ok: false, reason: "Room is in safety review; dialogue is paused." };
  }
  if (!OPEN_FOR_DIALOGUE.has(roomStatus) && roomStatus !== "closing") {
    return { ok: false, reason: `Messages are not accepted while room is ${roomStatus}.` };
  }
  return { ok: true };
}

export function canRaiseSafetyConcern(
  roomStatus: RoomStatus
): { ok: true } | { ok: false; reason: string } {
  if (roomStatus === "closed") {
    return { ok: false, reason: "Room is closed." };
  }
  return { ok: true };
}

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: AuthErrorCode };

export type AuthErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "INVALID_STATE"
  | "VALIDATION"
  | "NOT_IMPLEMENTED";

export function fail<T = never>(
  error: string,
  code: AuthErrorCode
): Result<T> {
  return { success: false, error, code };
}

export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}
