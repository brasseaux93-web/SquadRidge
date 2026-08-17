# SquadRidge

A facilitator-led digital environment for structured, sensitive dialogue and conflict de-escalation.

Participants speak under role-based identities. Facilitators guide phases and private process. When the room closes, **live session messages are purged**; only **approved commitments** remain on the outcome ledger.

> The conversation can end. The progress should not.

This repository implements a **production-oriented prototype** informed by an audit of the marketing source at `brasseaux93-web/squadridge-astro`. See [`docs/source-repository-audit.md`](docs/source-repository-audit.md).

---

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** with a centralized design-token system
- **Framer Motion** (respects `prefers-reduced-motion`)
- **Zustand** in-memory store with typed fixtures (swap-ready data boundary)

No production backend, IdP, or encryption service is wired in this prototype. Demo mode is labeled in the UI.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

**Node:** >= 20

---

## Product surfaces

| Path | Audience |
|------|----------|
| `/` | Public product overview |
| `/enter` | Demo role selection (facilitator / participant) |
| `/app` | Facilitator room list |
| `/app/rooms/[id]` | Facilitator room: phases, dialogue, outcomes, close & purge |
| `/app/rooms/[id]/outcomes` | Outcome ledger detail |
| `/room/[id]` | Participant room view |
| `/privacy` | Privacy design intent |
| `/security` | Security overview (honest prototype limits) |

---

## Architecture

```
src/
  app/                 # Routes (App Router)
  components/
    ui/                # Primitives (Button, Card, Badge)
    layout/            # Shell pieces (DemoBanner)
    room/              # PathwayMap and room-specific UI
  data/
    fixtures.ts        # Demo users, rooms, messages, outcomes
    store.ts           # Zustand store + domain operations
  domain/
    types.ts           # Strict domain types & status unions
  lib/
    utils.ts           # cn(), formatDate()
```

### Data access boundary

Screens depend on `useAppStore` and typed domain models—not on raw fixtures. Replacing the store with API calls should not require rewriting page layout. Room close **filters messages** out of state to demonstrate minimized retention.

### Design tokens

CSS variables in `src/app/globals.css` and Tailwind theme extension in `tailwind.config.ts`:

- Deep neutrals (`--bg-deep`, `--bg-surface`, `--bg-elevated`)
- Sage accent (`#6A8A83`) from the source brand
- Instrument Serif + Satoshi/Inter
- Focus rings, radii, and soft shadows for calm institutional UI

---

## Privacy principles (product)

Implemented in UX and data behavior:

1. **Role-based in-room identity** — real names are not the primary label in dialogue.
2. **Facilitator authority** — phases and outcome approval are facilitator-controlled.
3. **Minimized retention** — closing a room purges session messages in the demo store.
4. **No participant scoring** — no ranking, emotion scores, or cooperation labels.
5. **Honest limits** — demo banner states that encryption and identity verification are not live.

Do not treat this prototype as HIPAA/SOC2/certified infrastructure.

---

## Known limitations & next integration steps

| Area | Current state | Suggested next step |
|------|---------------|---------------------|
| Auth | Demo role switcher | Real IdP; separate verification from room display role |
| Realtime | Local Zustand only | WebSocket / Supabase Realtime for multi-client rooms |
| Persistence | In-memory + fixtures | Postgres; encrypt at rest for any retained ledger data |
| Invites | Static invite codes on fixtures | Tokenized invite links with expiry |
| Caucuses | Phase flag only | Private breakout channels |
| Facilitator Assist | Manual outcome drafting | Optional local draft helper under human approval |
| Org tenancy | Single demo org | Multi-tenant org model + RLS |
| Tests | Not yet added | Priority: close/purge, outcome approval, role gates |

---

## Documentation

- [`docs/source-repository-audit.md`](docs/source-repository-audit.md) — full audit of the Astro source
- [`docs/implementation-summary.md`](docs/implementation-summary.md) — what was carried over, improved, and deferred

---

## License

Unlicense (see `LICENSE`).
