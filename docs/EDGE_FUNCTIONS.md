# Edge Functions

**Purpose:** Document serverless functions.

**Status:** **Not implemented.** There is no `supabase/functions` directory in the repository.

Planned uses (from product plan, not code): invitation issuance, rate-limited privileged actions, export, safety notify.

Until functions exist, privileged operations that are implemented use Postgres security-definer RPCs (`approve_outcome`, `reject_outcome`, `close_room`).
