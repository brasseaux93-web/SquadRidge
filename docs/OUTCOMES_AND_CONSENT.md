# Outcomes and consent

**Purpose:** Explain how durable next steps are created and what “consent” means today.

**Last verified against:** outcomes table, approve/reject RPCs, CommitmentCard, domain types (2026-08-17)

---

## Outcome statuses

`proposed` → `under_review` / `revised` → `approved` | `rejected`

## Who can do what

- **Propose:** Facilitator (RoomService rule in fixture; insert policy targets facilitators in SQL)
- **Approve / reject:** Facilitator via `approve_outcome` / `reject_outcome` RPCs (or fixture equivalents)
- **Participant visibility:** Intended to see **approved** outcomes only (RLS policy on outcomes)

## What is retained after close

Approved outcomes remain. Live messages do not (application purge).

## Consent gate (current reality)

| Aspect | Status |
|--------|--------|
| Visibility field on outcome types | Present in domain model |
| Explicit multi-party acknowledgement UI | Not fully implemented |
| Anonymized public ledger publication | Planned / not implemented |
| Privacy labels in UI | Implemented as disclosure markers |

Until acknowledgement and publication flows are complete, treat approved outcomes as **room/organization process records under facilitator control**, not as publicly publishable artifacts.

## Commitment presentation

`CommitmentCard` presents: status, privacy scope label, body, owner label, due date, approve/return actions for moderators.
