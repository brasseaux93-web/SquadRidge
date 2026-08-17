# SquadRidge

A facilitator-led digital environment for structured, sensitive dialogue.

Participants speak under role-based identities. Facilitators guide phases. When the room closes, **live session messages are purged** (fixture/demo behavior); **approved outcomes** remain on the ledger.

> The conversation can end. The progress should not.

Source vision: `brasseaux93-web/squadridge-astro` (marketing site).  
Audit: [`docs/source-repository-audit.md`](docs/source-repository-audit.md)

---

## Quick start

```bash
npm install
npm run dev
```

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Vitest (domain + service invariants) |

Node >= 20.

---

## Data adapter

| Value | Behavior |
|-------|----------|
| `fixture` (default) | In-memory `FixtureRoomRepository` + demo seed data |
| `supabase` | Skeleton only — **throws** until wired (no silent fallback) |

Set `NEXT_PUBLIC_DATA_ADAPTER=fixture` (or omit). Do not set `supabase` unless server clients, RLS, and schema are actually deployed.

**Never** put `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_*` variables.

---

## Architecture

```
src/domain/          types, transitions, auth result helpers
src/data/
  repository.ts      RoomRepository interface + adapter selection
  fixture-repository.ts
  supabase-repository.ts   (incomplete skeleton)
  room-service.ts    authorization + lifecycle rules
  store.ts           Zustand UI state; delegates mutations to RoomService
src/components/      ui, room visualizations, layout
src/app/             routes
```

Screens should not bypass `RoomService` for mutations.

---

## Product routes

| Path | Role |
|------|------|
| `/` | Public |
| `/enter` | Demo role selection |
| `/app` | Facilitator rooms |
| `/app/rooms/[id]` | Facilitator room workspace |
| `/app/rooms/[id]/outcomes` | Ledger |
| `/room/[id]` | Participant |
| `/privacy`, `/security` | Design-intent pages |

---

## Tests (critical invariants)

```bash
npm test
```

Covers:

- Proposed outcomes are not participant-visible until approved
- Participants cannot approve outcomes or close rooms
- Close purges messages and retains outcomes; close is idempotent
- Phase changes blocked when closed; participants cannot set phase
- Messages blocked after close

---

## Prototype limitations (honest)

- Client-side fixture purge is **illustrative**, not a production deletion guarantee
- No real IdP, encryption service, or multi-client realtime
- No deployed Supabase/RLS
- Demo banner is always shown
- Do not claim HIPAA, SOC 2, or legal compliance

See also:

- [`docs/data-lifecycle-and-authorization.md`](docs/data-lifecycle-and-authorization.md)
- [`docs/supabase-schema-proposal.md`](docs/supabase-schema-proposal.md)
- [`docs/next-pass-plan.md`](docs/next-pass-plan.md)
- [`docs/implementation-summary.md`](docs/implementation-summary.md)

---

## License

Unlicense — see `LICENSE`.
