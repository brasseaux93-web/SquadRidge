# Data lifecycle and authorization

## Fixture mode (default demo)

| Entity | Retention on close |
|--------|--------------------|
| Messages | Removed from in-memory store |
| Outcomes | Retained |
| Audit | In-memory list (fixture) |

Authorization is enforced in `RoomService` (facilitator role on demo user). **Not** network-safe.

## Supabase mode (migrations + RLS)

### Lifecycle

1. Room open (`status` ≠ `closed`): members may read/insert messages per RLS.
2. `close_room(room_id)` (facilitator only, SECURITY DEFINER):
   - If already closed: ensure messages deleted; **no duplicate** `room.closed` audit; return `already_closed: true`.
   - Else: set `status=closed`, `phase=closing`, `closed_at`, `closed_by`; DELETE all `room_messages`; insert one audit event with purge count (no message bodies).
3. Outcomes rows are **not** deleted; participants may only SELECT `status='approved'`.

### Authorization (server)

| Actor | Mechanism |
|-------|-----------|
| Caller identity | `auth.uid()` only |
| Membership | `room_memberships.active` |
| Facilitator | `is_facilitator = true` |
| Approve | RPC `approve_outcome` |
| Close | RPC `close_room` |
| Direct outcome UPDATE | No policy → denied for clients |

See `supabase/migrations/20260817000000_squadridge_core.sql` and `docs/rls-verification.md`.
