# Data lifecycle and authorization (prototype)

Based on inspected code in `src/domain/types.ts`, `src/data/store.ts`, and room routes. This document describes **current fixture behavior** and what **must** move server-side before real user data.

---

## Entities and retention

| Entity | Created when | Visible to | Retained after room close? |
|--------|--------------|------------|----------------------------|
| **User** (demo) | Role selection | Self (name shown in facilitator chrome only) | N/A (session) |
| **Room** | Fixture seed / future create | Facilitator list; participants with access | Yes |
| **RoomParticipant** | Fixture | Facilitator sees display roles; participant sees own display role | Yes |
| **Message** | Send while room not closed | All room members while open | **No — purged on close** (fixture filters array) |
| **OutcomeEntry** | Propose | Facilitator: all statuses; Participant: **approved only** | Yes if approved; rejected/proposed may remain for facilitator review history in fixture |
| **AuditEvent** | Not implemented in UI yet; domain supports via service logging in-memory for tests | Facilitator (future) | Yes (production requirement) |

---

## Room lifecycle

```
draft → prepared → live → closing → closed
```

Phases while open: `opening | dialogue | caucus | synthesis | closing`

**Close operation (fixture):**
1. Actor must be facilitator (enforced in service layer this pass).
2. Room `status` → `closed`, `phase` → `closing`, `closedAt` set.
3. All `Message` rows for that `roomId` removed from store.
4. `OutcomeEntry` rows unchanged.
5. Repeat close is safe: already closed → no-op success.

**Production requirement:** Server must perform message delete (or soft-delete + hard-delete job) under RLS; clients must not be trusted to “forget.”

---

## Outcome lifecycle

```
proposed → under_review (optional) → approved | rejected
revised may return to proposed
```

- **Propose:** Facilitator (and optionally participant in future — currently facilitator UI path; service allows any room member to propose text but only facilitator can approve).
- **Approve / reject:** Facilitator only.
- Approved outcomes are the only commitments shown on participant ledger views.

---

## Authorization matrix (prototype service)

| Action | Facilitator | Participant |
|--------|-------------|-------------|
| List rooms | Yes | Limited (own memberships — demo uses room-1) |
| Change phase | Yes | No |
| Send message (open room) | Yes | Yes |
| Propose outcome | Yes | No (prototype: facilitator-only propose to match UI) |
| Approve/reject outcome | Yes | No |
| Close & purge | Yes | No |
| Read all outcome statuses | Yes | Approved only |
| Read messages (open) | Yes | Yes |
| Read messages (closed) | Empty (purged) | Empty |

---

## What is NOT enforced yet (must be before production)

- Network-level authn/authz
- RLS on Postgres
- Server-side purge job and proof of deletion
- Encryption at rest for retained ledger fields
- Invite token binding
- Rate limiting and audit export

Demo mode banner and README must continue to state that client-side purge is **illustrative only**.
