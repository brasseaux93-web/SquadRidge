/**
 * RLS / RPC integration tests against local Supabase.
 *
 * Prerequisites:
 *   npx supabase start
 *   npx supabase db reset   # migrations + seed.sql
 *
 * Run:
 *   SUPABASE_INTEGRATION=1 \
 *   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 \
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase status> \
 *   npm test -- src/data/supabase.integration.test.ts
 *
 * Without SUPABASE_INTEGRATION=1 this file is skipped — skips are not passes.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";

const enabled = process.env.SUPABASE_INTEGRATION === "1";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const ROOM_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const PROPOSED_OUTCOME = "dddddddd-dddd-dddd-dddd-ddddddddddd1";
const APPROVED_OUTCOME = "dddddddd-dddd-dddd-dddd-ddddddddddd2";
const FAC_MEMBERSHIP = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1";

async function signIn(email: string): Promise<SupabaseClient> {
  if (!anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required for integration tests");
  }
  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await client.auth.signInWithPassword({
    email,
    password: "password123",
  });
  if (error) throw error;
  return client;
}

describe.skipIf(!enabled)("Supabase RLS integration (local only)", () => {
  let facilitator: SupabaseClient;
  let participant: SupabaseClient;
  let unrelated: SupabaseClient;

  beforeAll(async () => {
    facilitator = await signIn("facilitator@example.local");
    participant = await signIn("participant@example.local");
    unrelated = await signIn("unrelated@example.local");
  }, 30000);

  it("facilitator can read assigned room; unrelated cannot", async () => {
    const { data: facRooms, error: facErr } = await facilitator
      .from("rooms")
      .select("id, title")
      .eq("id", ROOM_ID);
    expect(facErr).toBeNull();
    expect(facRooms?.length).toBe(1);

    const { data: partRooms } = await participant
      .from("rooms")
      .select("id")
      .eq("id", ROOM_ID);
    expect(partRooms?.length).toBe(1);

    const { data: otherRooms } = await unrelated
      .from("rooms")
      .select("id")
      .eq("id", ROOM_ID);
    expect(otherRooms ?? []).toHaveLength(0);
  });

  it("participant cannot read proposed outcomes; can read approved", async () => {
    const { data: proposed } = await participant
      .from("outcomes")
      .select("id, status")
      .eq("id", PROPOSED_OUTCOME);
    expect(proposed ?? []).toHaveLength(0);

    const { data: approved } = await participant
      .from("outcomes")
      .select("id, status")
      .eq("id", APPROVED_OUTCOME);
    expect(approved?.length).toBe(1);
    expect(approved?.[0]?.status).toBe("approved");

    const { data: facProposed } = await facilitator
      .from("outcomes")
      .select("id, status")
      .eq("id", PROPOSED_OUTCOME);
    expect(facProposed?.length).toBe(1);
  });

  it("participant cannot approve_outcome; facilitator can", async () => {
    const denied = await participant.rpc("approve_outcome", {
      p_outcome_id: PROPOSED_OUTCOME,
    });
    expect(denied.error).toBeTruthy();

    // Use a fresh proposed row so seed proposed can still be used if this re-runs
    const { data: inserted, error: insErr } = await facilitator
      .from("outcomes")
      .insert({
        room_id: ROOM_ID,
        status: "proposed",
        body: "Integration approve target",
        proposed_by: FAC_MEMBERSHIP,
      })
      .select("id")
      .single();
    expect(insErr).toBeNull();
    expect(inserted?.id).toBeTruthy();

    const approved = await facilitator.rpc("approve_outcome", {
      p_outcome_id: inserted!.id,
    });
    expect(approved.error).toBeNull();
    expect(approved.data?.status).toBe("approved");

    const { data: audit } = await facilitator
      .from("room_audit_events")
      .select("action, metadata")
      .eq("action", "outcome.approved")
      .contains("metadata", { outcome_id: inserted!.id });
    expect((audit ?? []).length).toBeGreaterThanOrEqual(1);
    const meta = JSON.stringify(audit?.[0]?.metadata ?? {});
    expect(meta).not.toMatch(/Integration approve target/);
  });

  it("participant cannot close_room; facilitator close purges messages and is idempotent", async () => {
    const denied = await participant.rpc("close_room", { p_room_id: ROOM_ID });
    expect(denied.error).toBeTruthy();

    // Ensure at least one message exists before close
    const { data: beforeMsgs } = await facilitator
      .from("room_messages")
      .select("id")
      .eq("room_id", ROOM_ID);
    expect((beforeMsgs ?? []).length).toBeGreaterThan(0);

    const closed = await facilitator.rpc("close_room", { p_room_id: ROOM_ID });
    expect(closed.error).toBeNull();
    expect(closed.data?.status).toBe("closed");
    expect(closed.data?.already_closed).toBe(false);

    const { data: afterMsgs } = await facilitator
      .from("room_messages")
      .select("id")
      .eq("room_id", ROOM_ID);
    // Closed room: RLS hides messages even if any residual — expect empty
    expect(afterMsgs ?? []).toHaveLength(0);

    const { data: approvedStill } = await facilitator
      .from("outcomes")
      .select("id, status")
      .eq("id", APPROVED_OUTCOME);
    expect(approvedStill?.length).toBe(1);

    const again = await facilitator.rpc("close_room", { p_room_id: ROOM_ID });
    expect(again.error).toBeNull();
    expect(again.data?.already_closed).toBe(true);

    const { data: closeAudits } = await facilitator
      .from("room_audit_events")
      .select("id")
      .eq("room_id", ROOM_ID)
      .eq("action", "room.closed");
    expect(closeAudits?.length).toBe(1);
  });

  it("unrelated user cannot read messages or outcomes", async () => {
    const { data: msgs } = await unrelated
      .from("room_messages")
      .select("id")
      .eq("room_id", ROOM_ID);
    expect(msgs ?? []).toHaveLength(0);

    const { data: outs } = await unrelated
      .from("outcomes")
      .select("id")
      .eq("room_id", ROOM_ID);
    expect(outs ?? []).toHaveLength(0);
  });

  it("participant cannot post message after room is closed", async () => {
    const { error } = await participant.from("room_messages").insert({
      room_id: ROOM_ID,
      membership_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2",
      display_role: "Engineer A",
      body: "Should fail after close",
      is_facilitator: false,
    });
    expect(error).toBeTruthy();
  });
});
