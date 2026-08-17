# User roles and permissions

**Purpose:** Describe capability boundaries as implemented in domain types, RoomService, and RLS policies.

**Last verified against:** `src/domain/types.ts`, `src/data/room-service.ts`, core + org/pilot migrations (2026-08-17)

---

## Domain roles (application model)

| Role | Typical use |
|------|-------------|
| `platform_admin` | Reserved; minimal product surface today |
| `organization_admin` | Org-level administration (schema-supported) |
| `facilitator` | Room process control |
| `participant` | Dialogue contribution under display role |
| `observer` | Limited; not fully productized |

In **fixture demo mode**, the enter screen only offers facilitator and participant. Role is selected client-side for UX exploration and is **not** a security boundary.

In **Supabase mode**, authorization is intended to come from `auth.uid()` + membership tables + RLS + security-definer RPCs. Client role claims must not elevate privileges.

## Room-level capabilities (intended)

| Action | Facilitator | Participant |
|--------|-------------|-------------|
| View open room messages | Yes (member) | Yes (member) |
| Send message (open room) | Yes | Yes (own membership) |
| Change phase | Yes | No |
| Propose outcome | Yes (service) | No (current service rule) |
| Approve / reject outcome | Yes (RPC / service) | No |
| Close room / purge messages | Yes | No |
| View proposed outcomes | Yes | No (approved only via policy intent) |
| Request pause (UI) | Yes | Yes |

Exact enforcement differs by adapter:

- **Fixture:** `RoomService.isFacilitatorRole` + transition checks
- **Supabase:** RLS + `is_room_facilitator` / `is_room_member` + RPCs

## Membership flags

- `room_memberships.is_facilitator` — process authority in a room
- `display_role` — in-room identity string
- Org/pilot membership roles: `org_admin`, `facilitator`, `member` / pilot `facilitator`, `participant`, `observer`

## Important boundary

**Demo role picker is not authentication.** Do not treat fixture role selection as proof of identity or authorization for real cases.
