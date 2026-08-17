# Implementation summary

**Updated:** 2026-08-16 (server-side security milestone)

## Completed this milestone

| Deliverable | Location |
|-------------|----------|
| Security plan | `docs/server-side-security-milestone-plan.md` |
| SQL migration (tables, RLS, helpers, RPCs) | `supabase/migrations/20260817000000_squadridge_core.sql` |
| Local Supabase config | `supabase/config.toml` |
| `approve_outcome` / `close_room` RPCs | migration (SECURITY DEFINER, auth.uid checks, fixed search_path) |
| `SupabaseRoomRepository` | `src/data/supabase-repository.ts` |
| Atomic close/approve on repository + service | `closeAndPurge`, `approveOutcomeAtomic` |
| Fixture unit tests updated | `src/data/room-service.test.ts` |
| Integration harness (skipped by default) | `src/data/supabase.integration.test.ts` |
| RLS verification matrix | `docs/rls-verification.md` |
| `.env.example` | repo root |

## Fixture vs server behavior

| Concern | Fixture | Supabase (when configured) |
|---------|---------|----------------------------|
| Authorization | `RoomService` role checks | RLS + RPC `auth.uid()` |
| Approve outcome | `approveOutcomeAtomic` in memory | `rpc('approve_outcome')` |
| Close + purge | in-memory delete messages | transactional `close_room` |
| Participant outcome visibility | filtered in service | RLS `status = approved` |

## Deferred / not verified in agent environment

- Applying migrations to a running Postgres
- Seeding auth users and memberships
- Executing RLS integration tests against real JWTs
- Supabase Auth UI / session wiring in Next.js
- `reject_outcome` RPC (reject still fixture-oriented; Supabase blocks direct UPDATE)

## Highest-leverage next milestone

Wire Next.js Supabase Auth session, seed script for local facilitator/participant users, and **run** the RLS integration suite until every row in `docs/rls-verification.md` is marked executed with pass/fail evidence.
