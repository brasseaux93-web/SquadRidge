# API and integration guide

**Status:** There is **no supported public HTTP API** for third-party integrations.

The application talks to Supabase Data API / RPCs under RLS when configured. External partners should not build against undocumented client calls.

If a public API is introduced later, it must be versioned, authenticated, rate-limited, and documented here with explicit scopes.
