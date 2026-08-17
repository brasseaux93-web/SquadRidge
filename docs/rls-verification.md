# RLS / RPC verification matrix

## Unit tests (fixture) — executed via `npm test`

| Invariant | Test file | Executed in agent? |
|-----------|-----------|--------------------|
| Proposed not participant-visible until approve | `src/data/room-service.test.ts` | Not run in agent (no local npm); code present |
| Participant cannot approve/close | same | same |
| Close purges messages, keeps outcomes, idempotent | same | same |
| Phase blocked when closed | same | same |
| Messages blocked after close | same | same |

## Database / RLS integration — require local Supabase

| Scenario | Expected | Status |
|----------|----------|--------|
| Facilitator reads assigned room | Allowed | **Not executed** — no local Supabase in agent |
| Participant reads enrolled room | Allowed | Not executed |
| Unrelated user reads room | No rows | Not executed |
| Participant reads proposed outcome | No rows | Not executed |
| Participant reads approved outcome | Allowed | Not executed |
| Participant calls approve_outcome | Denied | Not executed |
| Participant calls close_room | Denied | Not executed |
| Facilitator approve_outcome | Approved + audit | Not executed |
| Facilitator close_room | Purge + retain approved + 1 audit | Not executed |
| Repeat close_room | Idempotent, no duplicate closure audit | Not executed |
| Direct REST update outcomes status | Denied (no UPDATE policy) | Not executed |

### Commands for developers

```bash
npx supabase start
npx supabase db reset   # applies supabase/migrations/*
# Create two auth users; insert profiles + room_memberships seed
SUPABASE_INTEGRATION=1 npm test -- src/data/supabase.integration.test.ts
```

Fill in the placeholder tests once seed users exist. Until then, treat server-side enforcement as **implemented in SQL, unverified at runtime in this environment**.
