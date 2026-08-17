# Authentication status

**Honest status (2026-08-17):** Demo role picker (`enterAs`) is the primary entry path. Supabase Auth schema (`profiles` + trigger) exists; full Next.js session integration (`@supabase/ssr`, middleware route guards, login UI) is **not complete**.

## Investor-relevant implication

Until Auth is live:

- Do not present the product as production-authenticated
- Keep `NEXT_PUBLIC_DATA_ADAPTER=fixture` for public demos unless a controlled Supabase project is configured
- Treat any “sign in” language in the demo as exploration only

## Implementation path (next engineering milestone)

1. Add `@supabase/ssr`
2. Browser + server clients under `src/lib/supabase/`
3. Middleware session refresh
4. Login / magic-link pages
5. Replace `enterAs` for non-demo environments; keep fixture path for local UX
6. Map `auth.uid()` to room membership checks already expressed in RLS

## Current code

- Fixture users in `src/data/fixtures.ts`
- Store `enterAs` / `signOut` in `src/data/store.ts`
- Supabase public env required only when adapter is `supabase`
