# Environment and configuration

**Purpose:** Document variables from `.env.example` and safe usage.

| Variable | Public? | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_DATA_ADAPTER` | Yes | `fixture` (default) or `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon/public key only |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** | Server/ops only; never `NEXT_PUBLIC_` |
| `SUPABASE_INTEGRATION` | No | Set `1` to run RLS integration tests |

## Rules

- Supabase adapter **fails closed** if URL/anon key missing
- Never commit real keys
- Never expose service role to the browser bundle
