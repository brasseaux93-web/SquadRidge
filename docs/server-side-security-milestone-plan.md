# Server-side security milestone plan

**Date:** 2026-08-16  
**Repo state audited:** main @ ae66abd (pre-milestone tree)

## Confirmed current architecture

- **Client authority today:** `RoomService` + `FixtureRoomRepository` enforce role rules and purge **only in process memory**.
- **SupabaseRoomRepository:** throws on every method; no silent fixture fallback.
- **No** `supabase/` directory, migrations, config.toml, or env templates existed before this milestone.
- **No** Supabase project credentials available in this agent environment.
- **Unit tests:** Vitest against fixture service (authorization + purge invariants).
- **UI:** Demo banner; close confirmation discloses demo purge limits.

## What this milestone adds (in-repo)

1. Reproducible SQL migration: schema, constraints, RLS, helpers, `approve_outcome` / `close_room` RPCs.
2. `supabase/config.toml` for local CLI workflow.
3. Real `SupabaseRoomRepository` that:
   - Requires `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Uses only the anon client (RLS + RPC)
   - Calls `approve_outcome` / `close_room` RPCs for lifecycle mutations
   - **Never** falls back to fixtures
4. Repository methods `approveOutcomeAtomic` / `closeAndPurge` used by `RoomService`.
5. Integration test **harness** (skipped unless `SUPABASE_INTEGRATION=1` and local Supabase is up).
6. Docs: RLS verification matrix, updated lifecycle, README, `.env.example`.

## Authorization model (server)

Derived from `auth.uid()` only:

| Actor | Rooms | Messages | Outcomes | close_room / approve_outcome |
|-------|-------|----------|----------|------------------------------|
| Unauthenticated | deny | deny | deny | deny |
| Unrelated authenticated user | no rows | deny | deny | deny |
| Participant (active membership) | read own rooms | read/insert while room not closed | **SELECT approved only** | deny |
| Facilitator (active `is_facilitator`) | read own rooms | read/insert while open; phase update | read all statuses in room; insert proposals | allow |

## Retention / purge

- `close_room`: set status closed; **DELETE** all `room_messages` for room; keep `outcomes` (including non-approved for facilitator history); one audit event without message bodies.
- Idempotent: if already closed, return success summary; **no second** `room.closed` audit row; still ensure messages empty.

## Threats and mitigations

| Threat | Mitigation |
|--------|------------|
| Client sets `status=approved` | RLS blocks participant update; approve only via RPC that checks facilitator |
| Participant SELECT * outcomes | Policy restricts to `status = 'approved'` |
| Direct DELETE messages by participant | No DELETE policy for members; only RPC security definer |
| Service role in browser | Forbidden; only anon key documented |
| Silent fixture on Supabase failure | Explicit errors; no catch→fixture |

## Cannot validate in this agent environment

- Applying migrations to a live or local Postgres
- Running RLS integration tests against real auth JWTs
- End-to-end browser login against Supabase Auth

Developers must run: `npx supabase start` → `db reset` → integration tests with `SUPABASE_INTEGRATION=1`.
