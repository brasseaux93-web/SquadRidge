# Supabase + RLS as authorization authority

- **Status:** accepted
- **Context:** Need server-enforced boundaries without a custom Node API
- **Decision:** Use Supabase Postgres RLS and security-definer RPCs for privileged lifecycle actions; keep a repository interface for fixture/supabase adapters
- **Alternatives:** Custom backend; client-only trust (rejected)
- **Consequences:** Strong dependency on correct policies; integration tests mandatory before pilots
