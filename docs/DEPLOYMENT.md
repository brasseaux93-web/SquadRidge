# Deployment

**Purpose:** Production-oriented checklist grounded in current architecture.

## Prerequisites

- Node 20+
- Hosted Supabase project with migrations applied
- Frontend host (e.g. Vercel or similar) for Next.js
- Secrets manager for service role (if used by ops scripts)—never in frontend

## Frontend env (public)

- `NEXT_PUBLIC_DATA_ADAPTER=supabase`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deploy steps (outline)

1. Apply migrations to the target Supabase project
2. Verify RLS with integration tests or manual matrix
3. Build frontend: `npm run build`
4. Deploy build artifacts / Next app
5. Smoke test: login path (once Auth wired), open room, approve outcome, close room
6. Confirm DemoBanner is **off** or replaced for true pilot environments if fixture is disabled

## Rollback

- Frontend: redeploy previous build
- Database: forward-fix preferred; restore from Supabase backup if required (ops procedure partner-specific)

## Honest gap

No CI/CD config is committed yet. Treat deployment as manual until automation exists.
