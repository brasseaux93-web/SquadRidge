# SquadRidge

Private rooms for difficult conversations — and durable next steps.

SquadRidge is pilot-stage, privacy-first infrastructure for facilitator-led dialogue. Mediators, ombuds teams, and institutional partners run small rooms where participants appear under assigned roles, live exchange is temporary, and only approved commitments are meant to remain.

> The conversation can end. The progress should not.

## Current status (honest)

**Default mode is a local fixture demo.**  
Messages are purged when a room closes in the application store. Real identity verification, end-to-end encryption, compliance certifications, and production Auth sessions are **not** complete. See [docs/PROJECT_TRUTH_MATRIX.md](docs/PROJECT_TRUTH_MATRIX.md) and [docs/TRUST_AND_LIMITATIONS.md](docs/TRUST_AND_LIMITATIONS.md).

Do not put real sensitive case data into this application until authentication, RLS verification, retention operations, and institutional review are complete in your environment.

## What works today

- Facilitator and participant demo journeys
- Room phases (Dialogue Spine), messaging under display roles
- Outcome propose / approve / reject
- Close room with application-level message purge; retain approved outcomes
- Supabase migrations with RLS helpers and lifecycle RPCs
- Unit tests for service invariants; integration tests present for local Supabase

## What it is not

Generic chat, social network, therapy product, surveillance tool, military command system, or autonomous conflict-resolution AI.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind · Zustand · Supabase (Postgres, Auth primitives, RLS, RPCs) · Vitest

No dedicated Node API server. No Edge Functions in repo yet.

## Quick start (fixture demo)

```bash
npm install
cp .env.example .env.local
npm run dev
```

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Unit tests |
| `npm run test:integration` | RLS tests (local Supabase required) |

## Environment

See `.env.example`:

- `NEXT_PUBLIC_DATA_ADAPTER` — `fixture` (default) or `supabase`
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required for supabase adapter
- `SUPABASE_SERVICE_ROLE_KEY` — server/ops only; never expose to the browser

## Documentation

Full index: [docs/README.md](docs/README.md)

| Need | Document |
|------|----------|
| Capability truth | [docs/PROJECT_TRUTH_MATRIX.md](docs/PROJECT_TRUTH_MATRIX.md) |
| Local setup | [docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md) |
| Architecture | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Trust boundaries | [docs/TRUST_AND_LIMITATIONS.md](docs/TRUST_AND_LIMITATIONS.md) |
| Facilitator use | [docs/FACILITATOR_GUIDE.md](docs/FACILITATOR_GUIDE.md) |
| Pilot readiness | [docs/ROADMAP/PILOT_READINESS.md](docs/ROADMAP/PILOT_READINESS.md) |

## Security

Report vulnerabilities per [SECURITY.md](SECURITY.md). Do not file public issues with exploit details that expose live pilot data.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Documentation must stay synchronized with behavior, schema, and security claims.

## License

Unlicense — public domain dedication. See [LICENSE](LICENSE).
