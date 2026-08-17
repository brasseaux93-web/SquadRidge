/**
 * RLS / RPC integration tests against local Supabase.
 *
 * These tests do NOT run in default `npm test`.
 * They require a local stack and seeded users.
 *
 *   npx supabase start
 *   npx supabase db reset
 *   # seed facilitator + participant JWTs (see docs/rls-verification.md)
 *   SUPABASE_INTEGRATION=1 npm test -- src/data/supabase.integration.test.ts
 *
 * Without SUPABASE_INTEGRATION=1 this file is skipped — do not treat skips as pass.
 */
import { describe, it } from "vitest";

const enabled = process.env.SUPABASE_INTEGRATION === "1";

describe.skipIf(!enabled)("Supabase RLS integration (local only)", () => {
  it("placeholder: facilitator can approve_outcome; participant cannot", async () => {
    // Implement with @supabase/supabase-js clients signed in as distinct users.
    // Assert: participant rpc approve_outcome fails; select proposed outcomes returns [].
    // Assert: facilitator approve_outcome succeeds; audit row without message body.
  });

  it("placeholder: close_room purges messages, keeps approved outcomes, idempotent", async () => {
    // Assert message count 0 after close; approved outcomes remain; second close already_closed true.
  });

  it("placeholder: unrelated user cannot read room", async () => {
    // Assert empty select on rooms / messages / outcomes for non-member JWT.
  });
});
