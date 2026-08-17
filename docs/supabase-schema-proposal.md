# Supabase schema proposal (not deployed)

This is a **design artifact**. It is not applied to any project. Do not treat the prototype as enforcing these policies.

## Design goals

1. Separate **verified identity** (`profiles`) from **in-room display role** (`room_memberships.display_role`).
2. Ephemeral messages: hard-delete on room close (or scheduled purge); never train on content.
3. Outcomes require facilitator approval; history of approval actions in `audit_events`.
4. RLS for all tenant data; service role only on trusted server routes.

---

## Tables

### `organizations`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | |
| created_at | timestamptz | |

**RLS intent:** members of org can read; org admins write.

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK = auth.users.id | |
| display_name | text | Real name — **not** shown in room by default |
| email | text | |
| created_at | timestamptz | |

### `org_memberships`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| org_id | uuid FK | |
| user_id | uuid FK | |
| role | text | `facilitator` \| `participant` \| `admin` |
| unique(org_id, user_id) | | |

### `rooms`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| org_id | uuid FK | |
| title | text | |
| status | text | draft/prepared/live/closing/closed |
| phase | text | opening/dialogue/caucus/synthesis/closing |
| ground_rules | jsonb | string[] |
| invite_code_hash | text | store hash only |
| created_by | uuid | |
| created_at | timestamptz | |
| closed_at | timestamptz nullable | |

**Indexes:** `(org_id, status)`, `(status)` for ops.

**RLS:** read if room member; write phase/status if facilitator membership.

### `room_memberships`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| room_id | uuid FK | |
| user_id | uuid FK | |
| display_role | text | e.g. Engineer A |
| is_facilitator | boolean | |
| joined_at | timestamptz | |
| unique(room_id, user_id) | | |

**RLS:** members of room can read **display_role** of others; cannot read other users’ profile emails via this table.

### `room_phase_history`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| room_id | uuid FK | |
| phase | text | |
| changed_by | uuid | |
| changed_at | timestamptz | |

### `messages`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| room_id | uuid FK | |
| membership_id | uuid FK | |
| body | text | |
| created_at | timestamptz | |

**Retention:** On room close, **DELETE FROM messages WHERE room_id = $1** in a security-definer function callable only by facilitator or service role. Optional short soft-delete window is a product decision; default proposal is hard delete.

**RLS:** SELECT/INSERT only if room status is not `closed` and user is member. No SELECT after close (rows gone).

### `outcomes`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| room_id | uuid FK | |
| status | text | proposed/under_review/approved/rejected/revised |
| body | text | |
| owner_label | text | |
| due_date | date | |
| proposed_by | uuid | membership or user |
| approved_by | uuid nullable | |
| approved_at | timestamptz | |
| created_at | timestamptz | |

**RLS:** Facilitators full read/write for status transitions; participants SELECT where `status = 'approved'` only.

### `invitations`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| room_id | uuid FK | |
| token_hash | text | |
| expires_at | timestamptz | |
| created_by | uuid | |
| redeemed_at | timestamptz nullable | |

### `audit_events`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| org_id | uuid | |
| room_id | uuid nullable | |
| actor_id | uuid | |
| action | text | e.g. outcome.approved, room.closed |
| metadata | jsonb | **no raw message bodies** |
| created_at | timestamptz | |

**RLS:** org facilitators/admins read; insert via security-definer on sensitive actions.

---

## Server functions (required before real data)

1. `close_room(room_id)` — verify facilitator; set closed; delete messages; insert audit_event; idempotent if already closed.
2. `approve_outcome(outcome_id)` — verify facilitator; set approved; audit.
3. `redeem_invite(token)` — create membership with assigned display_role.

## Client env (Next.js)

- `NEXT_PUBLIC_SUPABASE_URL` — public
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, RLS-enforced only
- `SUPABASE_SERVICE_ROLE_KEY` — **server-only**, never `NEXT_PUBLIC_`

## Adapter selection

- `DATA_ADAPTER=fixture` (default) — local demo
- `DATA_ADAPTER=supabase` — uses server routes; must fail closed if misconfigured
