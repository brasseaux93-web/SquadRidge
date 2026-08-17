# Implementation summary

**Updated:** 2026-08-16 (next-pass)  
**Source audited:** `brasseaux93-web/squadridge-astro`  
**Destination:** `brasseaux93-web/SquadRidge`

---

## Implemented behavior (this codebase)

| Capability | Status |
|------------|--------|
| Public product story + demo role entry | Yes |
| Facilitator room list and workspace | Yes |
| Participant room view (display roles) | Yes |
| Phase control (facilitator) | Yes — service-enforced |
| Dialogue send (members) | Yes — blocked when closed |
| Propose / approve / reject outcomes | Yes — approve/reject facilitator-only |
| Participant sees approved outcomes only | Yes — service + store selector |
| Close room + purge messages (fixture) | Yes — service-enforced, idempotent |
| Pathway + information lifecycle UI | Yes |
| RoomRepository + RoomService boundary | Yes |
| Fixture adapter | Yes |
| Supabase adapter | Skeleton only (throws) |
| Automated tests for invariants | Yes (`npm test`) |
| Real IdP / DB / realtime / RLS | **No** |

---

## Carried from product vision

- Private facilitated dialogue; durable approved outcomes only
- Role-based in-room identities
- Facilitator authority over phases and ledger
- No participant scoring
- Honest demo / non-production security labeling

---

## Next-pass engineering changes

1. Extracted `RoomRepository` + `RoomService` with authorization codes
2. Domain transition helpers (`canSetPhase`, `canApproveOutcome`, …)
3. Vitest suite for approval, purge, roles, phases, messaging
4. Docs: next-pass plan, data lifecycle, Supabase schema proposal
5. Information lifecycle visualization; stronger close confirmation copy
6. Async store mutations with `lastError` surfacing

---

## Production integration steps (ordered)

1. Deploy schema from `docs/supabase-schema-proposal.md` with RLS
2. Implement `close_room` and `approve_outcome` as security-definer SQL/RPC
3. Wire `SupabaseRoomRepository` via **server** routes only; keep service role server-side
4. Replace demo `enterAs` with real auth; map memberships to display roles
5. Add invite token redemption
6. Expand tests against a local Supabase test project

---

## Recommended next milestone

**Highest leverage:** implement server-side `close_room` + message DELETE under RLS and prove participant SELECT policies on `outcomes` (`status = approved` only). Until then, treat all data as non-sensitive demo content.
