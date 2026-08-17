# RLS / RPC verification matrix

## Unit tests (fixture) — `npm test`

| Invariant | Test file | Status |
|-----------|-----------|--------|
| Proposed not participant-visible until approve | `src/data/room-service.test.ts` | Implemented (run locally) |
| Participant cannot approve/close | same | Implemented |
| Close purges messages, keeps outcomes, idempotent | same | Implemented |
| Phase blocked when closed | same | Implemented |
| Messages blocked after close | same | Implemented |

## Database / RLS integration — local Supabase

Seed accounts (password `password123`):

| Email | Role in seed room |
|-------|-------------------|
| `facilitator@example.local` | Facilitator |
| `participant@example.local` | Participant |
| `unrelated@example.local` | No membership |

Room id: `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`

### Commands

```bash
npx supabase start
npx supabase db reset          # migrations + seed.sql
npx supabase status            # copy anon key

SUPABASE_INTEGRATION=1 \
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 \
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key> \
npm test -- src/data/supabase.integration.test.ts
```

### Matrix

| Scenario | Expected | Test case | Executed in agent? |
|----------|----------|-----------|--------------------|
| Facilitator reads assigned room | Allowed | facilitator can read… | **No** (no Docker/Supabase) |
| Participant reads enrolled room | Allowed | same | No |
| Unrelated user reads room | No rows | same | No |
| Participant reads proposed outcome | No rows | participant cannot read proposed… | No |
| Participant reads approved outcome | Allowed | same | No |
| Participant calls approve_outcome | Denied | participant cannot approve… | No |
| Facilitator approve_outcome | Approved + audit (no body) | same | No |
| Participant calls close_room | Denied | participant cannot close… | No |
| Facilitator close_room | Purge + retain approved + 1 audit | same | No |
| Repeat close_room | Idempotent | same | No |
| Unrelated reads messages/outcomes | No rows | unrelated user cannot read… | No |
| Participant posts after close | Denied | participant cannot post… | No |
| reject_outcome RPC | Facilitator only | SQL present; add assertion when extending suite | No |

**Honest status:** Integration tests are **implemented and committed**. They have **not** been executed in the agent environment because Docker and the Supabase CLI are unavailable here. A developer machine with `supabase start` must run the suite and update this table with pass/fail timestamps.
