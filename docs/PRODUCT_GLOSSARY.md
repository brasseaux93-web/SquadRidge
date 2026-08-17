# Product glossary

**Purpose:** Shared vocabulary for code, docs, and pilot conversations.

| Term | Definition in SquadRidge |
|------|---------------------------|
| **Organization** | Tenant-like entity that owns pilots (schema present; full admin UX partial) |
| **Pilot** | Bounded program under an organization (purpose, consent language, retention settings) |
| **Facilitator** | Role with authority to change phase, approve outcomes, close room |
| **Participant** | Room member under an assigned display role; limited write/visibility |
| **Observer** | Read-oriented role in domain model; limited product surface today |
| **Display role / pseudonym** | Facilitator-assigned in-room label (e.g. “Engineer A”). Not a guarantee of anonymity |
| **Room** | Facilitated session container with status, phase, memberships, messages, outcomes |
| **Room membership** | Link of user ↔ room with `display_role` and `is_facilitator` |
| **Session phase** | opening, dialogue, caucus, synthesis, closing |
| **Room status** | draft, scheduled, waiting, prepared, live, paused, safety_review, closing, closed |
| **Agreement** | Working ground rule or opening acknowledgement (schema for room_agreements exists) |
| **Commitment / outcome** | Proposed durable next step; becomes ledger-worthy only when approved |
| **Outcome ledger** | Set of approved (and related) outcome records retained after close |
| **Consent gate** | Conceptual boundary before external visibility (UI partial) |
| **Safety report** | Non-punitive concern / pause request record (table exists; UI mostly client-side) |
| **Audit event** | Privileged action log; must not store raw message bodies |
| **Retention** | Policy for how long data remains; automated jobs not implemented |
| **Fixture / demo mode** | In-memory adapter; default local experience |
| **Dialogue Spine** | UI progression of facilitated stages |
| **Protected Pause** | UI for requesting pause/support without escalation theater |
