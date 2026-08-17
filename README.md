# SquadRidge

Facilitator-led digital rooms for sensitive dialogue. Approved commitments persist; live messages are designed to be purged on room close.

> The conversation can end. The progress should not.

**Default mode is a local fixture demo.** Do not put real sensitive case data into this application until authentication, RLS, migrations, and operational review are complete in your environment.

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
| `supabase` | Uses anon key + RLS + `approve_outcome` / `close_room` RPCs. **Fails closed** if URL/anon key missing. Never falls back to fixtures. |

Browser env only:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Never** expose `SUPABASE_SERVICE_ROLE_KEY` to the client or `NEXT_PUBLIC_*`.

### Local Supabase

```bash
npx supabase start
npx supabase db reset   # applies supabase/migrations
```

See `docs/rls-verification.md` for the policy matrix and what has / has not been runtime-verified.

---

## Architecture

- `src/domain` — types, transitions
- `src/data/repository.ts` — `RoomRepository` + adapter selection
- `src/data/fixture-repository.ts` — demo store
- `src/data/supabase-repository.ts` — Supabase Data API + RPCs
- `src/data/room-service.ts` — UX validation (not a substitute for RLS)
- `supabase/migrations` — schema, RLS, RPCs

---

## Documentation

- `docs/source-repository-audit.md`
- `docs/server-side-security-milestone-plan.md`
- `docs/data-lifecycle-and-authorization.md`
- `docs/supabase-schema-proposal.md`
- `docs/rls-verification.md`
- `docs/implementation-summary.md`

---

## License

Unlicense — see `LICENSE`.
