# Local development

**Purpose:** Get a developer to a running fixture demo quickly, then optional Supabase.

## Prerequisites

- Node.js ≥ 20
- npm
- Optional: Docker + Supabase CLI for integration path

## Fixture demo (default)

```bash
npm install
cp .env.example .env.local   # leave adapter as fixture
npm run dev
```

Open the app, use `/enter` to pick a role.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next dev server |
| `npm run build` | Production build |
| `npm run start` | Start built app |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next lint |
| `npm test` | Vitest unit tests |
| `npm run test:integration` | RLS tests (needs local Supabase) |

## Local Supabase

```bash
npx supabase start
npx supabase db reset   # migrations + seed
npx supabase status     # copy anon key into .env.local
```

Set `NEXT_PUBLIC_DATA_ADAPTER=supabase` and the URL/anon key. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).
