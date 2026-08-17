# Supabase setup

**Purpose:** Apply the schema and prepare Auth for development.

## Steps

1. Create a Supabase project or use local CLI
2. Apply migrations (`supabase db reset` locally or migration deploy to hosted)
3. Confirm seed users if using `supabase/seed.sql` (local)
4. Configure Auth providers as needed (email magic link/password)—**product session wiring still incomplete**
5. Copy **anon** key to frontend env only
6. Store service role only in server-side secrets managers
7. Run integration tests and record results in `rls-verification.md`

## Auth note

`profiles` auto-create trigger exists on `auth.users`. The Next.js app still needs full `@supabase/ssr` session integration before claiming production login.
