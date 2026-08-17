# Privacy and data boundaries

**Purpose:** Describe data scopes without over-claiming anonymity or encryption.

---

## Data categories

| Category | Examples | Typical visibility |
|----------|----------|--------------------|
| Account | email, display_name on profiles | self / system |
| Membership | room/pilot/org links, display_role | members of that scope |
| Live dialogue | room_messages body | room members while open |
| Working proposals | non-approved outcomes | facilitators |
| Retained outcomes | approved outcomes | members per policy; facilitators |
| Safety reports | notes, category | room members / facilitators (policy) |
| Audit | action metadata without message bodies | facilitators |

## What operators can still see

Anyone with database or service-role access can correlate `user_id` with memberships. Display roles are **not** anonymity.

## What the product cannot prevent

Screenshots, copy/paste, external note-taking, compromised endpoints, or forced legal disclosure processes outside the application.

## Minimized retention intent

Live dialogue is designed to be purged on close at the application layer. Approved commitments are the durable artifact.
