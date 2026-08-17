# Next-pass plan (2026-08-16)

## Current-state observations (inspected)

- **Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind 3, Framer Motion, Zustand.
- **Scripts present:** `dev`, `build`, `start`, `lint`, `typecheck`. **No `test` script.**
- **Data:** Client-only Zustand store seeded from `src/data/fixtures.ts`. Screens call `useAppStore` directly.
- **Authorization gap:** Mutations (`setPhase`, `setOutcomeStatus`, `closeRoom`, `sendMessage`) do not check `currentUser.role`. UI hides controls for participants, but the action layer does not reject unauthorized calls.
- **Phase transitions:** Any phase can be set; no validation of valid transitions or closed-room lock.
- **Close/purge:** Implemented in store — sets status `closed`, phase `closing`, filters messages by roomId. Outcomes retained. Not idempotent-documented; second close is a no-op on messages (already empty).
- **Tests:** None.
- **Backend:** None. No env adapter selection.

## Confirmed vs assumed

| Behavior | Status |
|----------|--------|
| Message purge on close (in-memory) | Confirmed in `store.closeRoom` |
| Outcomes survive close | Confirmed |
| Participant UI omits approve/close controls | Confirmed in `/room/[id]` |
| Action-layer rejects participant approval | **Not present** — must add |
| Real encryption / multi-client sync | Not present (documented) |
| Supabase integration | Not present |

## Milestones

1. **Domain transitions + auth helpers** — single source of status/phase constants; typed results for mutations.
2. **RoomRepository interface** + fixture implementation + Supabase skeleton (incomplete, marked).
3. **Service layer** enforcing role checks; store delegates to service/repo.
4. **Vitest** + tests for approval, purge, roles, transitions, close confirmation copy invariants where testable.
5. **UX** — information lifecycle view, post-close clarity, stronger a11y labels.
6. **Docs** — README, implementation summary, schema proposal, data lifecycle.

## Privacy / security risks and mitigations

| Risk | Mitigation this pass |
|------|----------------------|
| Client-only “purge” can be bypassed by anyone with store access | Document clearly; enforce in service; schema proposal requires server purge + RLS |
| Participant could call store methods if exposed | Service rejects non-facilitator for phase/outcome/close |
| Message content in client memory after “purge” elsewhere | Fixture purge removes from store array; no localStorage of messages |
| Fake production backend | Supabase adapter throws / returns not-implemented; never silent fixture fallback when `DATA_ADAPTER=supabase` |

## Explicit out of scope

- Live Supabase project wiring and RLS deployment
- Real IdP / email invites
- Multi-tab realtime sync
- Caucus breakout channels
- AI Facilitator Assist
- HIPAA/SOC2 claims
