# Implementation summary

**Updated:** 2026-08-16 (seed + reject_outcome + integration tests)

## Server-side security stack (in repo)

| Piece | Path |
|-------|------|
| Core schema + RLS + approve/close RPCs | `supabase/migrations/20260817000000_squadridge_core.sql` |
| reject_outcome RPC | `supabase/migrations/20260817000100_reject_outcome.sql` |
| Local seed (3 users, 1 room, messages, outcomes) | `supabase/seed.sql` |
| Integration tests | `src/data/supabase.integration.test.ts` |
| Supabase adapter | `src/data/supabase-repository.ts` |
| Fixture demo | `src/data/fixture-repository.ts` |

## Lifecycle RPCs

- `approve_outcome(uuid)` — facilitator, open room, approvable status, audit
- `reject_outcome(uuid)` — facilitator, open room, not already approved, idempotent if rejected
- `close_room(uuid)` — facilitator, purge messages, keep outcomes, one closure audit, idempotent

## Still required on a developer machine

1. `npx supabase start && npx supabase db reset`
2. Run `SUPABASE_INTEGRATION=1 npm test -- src/data/supabase.integration.test.ts`
3. Record results in `docs/rls-verification.md`
4. Wire Next.js session (`@supabase/ssr`) when moving off demo `enterAs`

## Highest-leverage next milestone

Execute the integration suite against local Supabase and publish pass evidence; then replace demo role picker with real auth sessions while keeping display-role separation in-room.
