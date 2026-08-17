# Database schema

**Purpose:** Document tables and relationships from committed migrations.

**Migrations:**
- `20260817000000_squadridge_core.sql`
- `20260817000100_reject_outcome.sql`
- `20260817120000_organizations_pilots.sql`

---

## Core tables

| Table | Role |
|-------|------|
| `profiles` | 1:1 with `auth.users` |
| `rooms` | Session container; status/phase; optional `pilot_id`, `is_demo` |
| `room_memberships` | user ↔ room, `display_role`, `is_facilitator` |
| `room_messages` | Ephemeral dialogue rows |
| `outcomes` | Proposed/approved commitments |
| `room_audit_events` | Privileged action log |

## Expansion tables

| Table | Role |
|-------|------|
| `organizations` | Tenant |
| `organization_memberships` | org roles |
| `pilots` | Program config (consent language, retention_days, visibility) |
| `pilot_memberships` | pilot roles |
| `invitations` | tokenized invites |
| `safety_reports` | concern/pause records |
| `room_agreements` | opening agreements |
| `room_agreement_acknowledgements` | per-membership ack |

## RPCs

- `approve_outcome(uuid)`
- `reject_outcome(uuid)`
- `close_room(uuid)` — purges messages, closes room, audit

## Conventions

- UUIDs, `timestamptz`, RLS enabled on listed tables
- Client message DELETE not granted; purge via `close_room`
- Outcome direct UPDATE denied for clients; approval via RPC

For policy detail see [AUTHORIZATION_AND_RLS.md](./AUTHORIZATION_AND_RLS.md).
