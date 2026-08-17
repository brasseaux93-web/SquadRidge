# Implementation summary

**Updated:** 2026-08-17

## Server-side security stack (in repo)

| Piece | Path |
|-------|------|
| Core schema + RLS + approve/close RPCs | `supabase/migrations/20260817000000_squadridge_core.sql` |
| reject_outcome RPC | `supabase/migrations/20260817000100_reject_outcome.sql` |
| Organizations, pilots, invitations, safety reports, agreements | `supabase/migrations/20260817120000_organizations_pilots.sql` |
| Local seed (3 users, 1 room, messages, outcomes) | `supabase/seed.sql` |
| Integration tests | `src/data/supabase.integration.test.ts` |
| Supabase adapter | `src/data/supabase-repository.ts` |
| Fixture demo | `src/data/fixture-repository.ts` |

## Domain expansion (2026-08-17)

- `UserRole` now includes `platform_admin`, `organization_admin`, `facilitator`, `participant`, `observer`
- `RoomStatus` expanded with `scheduled`, `waiting`, `paused`, `safety_review`
- New types: Organization, Pilot, Invitation, SafetyReport, RoomAgreement, LedgerEntry
- `Room.isDemo` flag to distinguish demo vs pilot rooms
- Transition helpers updated for safety_review and expanded open states

## Lifecycle RPCs (existing)

- `approve_outcome(uuid)` — facilitator, open room, approvable status, audit
- `reject_outcome(uuid)` — facilitator, open room, not already approved, idempotent if rejected
- `close_room(uuid)` — facilitator, purge messages, keep outcomes, one closure audit, idempotent

## Still required on a developer machine

1. `npx supabase start && npx supabase db reset` (applies both migrations)
2. Run `SUPABASE_INTEGRATION=1 npm test -- src/data/supabase.integration.test.ts`
3. Record results in `docs/rls-verification.md`
4. Wire Next.js session (`@supabase/ssr`) when moving off demo `enterAs`
5. Implement Edge Functions for invitation issuance and rate-limited privileged actions
6. Build pilot dashboard UI on top of new schema (currently fixture-backed room list)

## Highest-leverage next milestones

See `docs/pilot-ready-implementation-plan.md` for the full ordered plan (M0–M7).

Immediate: execute integration suite, then M1 auth foundation while keeping fixture demo mode.
