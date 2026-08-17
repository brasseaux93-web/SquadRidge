import type { RoomRepository } from "./repository";

/**
 * Skeleton only — not wired to a live Supabase project.
 * Selecting DATA_ADAPTER=supabase must not silently fall back to fixtures.
 */
export class SupabaseRoomRepository implements RoomRepository {
  private notReady(): never {
    throw new Error(
      "Supabase adapter is not configured. Set up server-side Supabase clients, RLS, and env vars before using DATA_ADAPTER=supabase. See docs/supabase-schema-proposal.md."
    );
  }

  listUsers() {
    this.notReady();
  }
  getUser() {
    this.notReady();
  }
  listRooms() {
    this.notReady();
  }
  getRoom() {
    this.notReady();
  }
  updateRoom() {
    this.notReady();
  }
  listParticipants() {
    this.notReady();
  }
  listMessages() {
    this.notReady();
  }
  addMessage() {
    this.notReady();
  }
  purgeMessages() {
    this.notReady();
  }
  listOutcomes() {
    this.notReady();
  }
  getOutcome() {
    this.notReady();
  }
  addOutcome() {
    this.notReady();
  }
  updateOutcome() {
    this.notReady();
  }
  appendAudit() {
    this.notReady();
  }
  listAudit() {
    this.notReady();
  }
}
