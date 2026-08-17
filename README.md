# SquadRidge

Private rooms for difficult conversations — and durable next steps.

Facilitator-led digital rooms for sensitive dialogue in mediation, ombuds, and institutional pilot settings. Approved commitments persist; live messages are designed to be purged on room close.

> The conversation can end. The progress should not.

**Default mode is a local fixture demo.** Do not put real sensitive case data into this application until authentication, full RLS verification, migrations, legal review, and operational controls are complete in your environment.

This is pilot-stage infrastructure. It is not a generic chat app, therapy product, surveillance tool, or military system.

---

## Quick start (fixture demo)

```bash
npm install
npm run dev
```

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (fixture/service invariants) |
| `npm run test:integration` | RLS tests (requires local Supabase + `SUPABASE_INTEGRATION=1`) |

Copy `.env.example` to `.env.local` as needed.

---

## Adapters

| `NEXT_PUBLIC_DATA_ADAPTER` | Behavior |
|----------------------------|----------|
| `fixture` (default) | In-memory demo; client `RoomService` rules; **not** production security |
| `supabase` | Uses anon key + RLS + `approve_outcome` / `close_room` / `reject_outcome` RPCs. **Fails closed** if URL/anon key missing. Never falls back to fixtures. |

Browser env only:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Never** expose `SUPABASE_SERVICE_ROLE_KEY` to the client or `NEXT_PUBLIC_*`.

### Local Supabase

```bash
npx supabase start
npx supabase db reset   # applies all migrations in supabase/migrations
```

See `docs/rls-verification.md` for the policy matrix and what has / has not been runtime-verified.

---

## Architecture

- `src/domain` — types, transitions, result helpers
- `src/data/repository.ts` — `RoomRepository` + adapter selection
- `src/data/fixture-repository.ts` — demo store
- `src/data/supabase-repository.ts` — Supabase Data API + RPCs
- `src/data/room-service.ts` — UX validation (not a substitute for RLS)
- `supabase/migrations` — schema, RLS, RPCs (core + organizations/pilots)

---

## Documentation

- `docs/pilot-ready-implementation-plan.md` — ordered milestones toward pilot readiness
- `docs/implementation-summary.md` — current server-side stack
- `docs/source-repository-audit.md`
- `docs/rls-verification.md`
- `docs/data-lifecycle-and-authorization.md`
- `docs/supabase-schema-proposal.md`

---

## Pilot limitations (honest)

- Fixture mode is for product exploration only.
- Real identity verification, end-to-end encryption of message bodies, and compliance certifications are **not** implemented.
- Organization / pilot schema exists; full invitation UX, Edge Functions, analytics, and safety workflow UI are still in progress (see plan).
- Always treat this as pilot-stage software requiring partner, legal, and security review before any high-risk deployment.

---

## License

Unlicense — see `LICENSE`.
