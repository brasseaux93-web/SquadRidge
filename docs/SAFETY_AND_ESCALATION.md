# Safety and escalation

**Purpose:** Describe the non-punitive pause/concern model and its current limits.

**Emergency disclaimer:** SquadRidge does not provide emergency services. If someone is in immediate danger, contact local emergency services or appropriate institutional crisis resources.

---

## Design intent

Participants should be able to request a pause or flag a concern **without shame or adversarial escalation theater**. Facilitators receive a structured signal, not a public alarm.

## Implemented today

- **UI:** `ProtectedPause` component offers: request pause, need facilitator support, raise a concern, step away briefly
- **Schema:** `safety_reports` table with category, status, assignment, resolution fields
- **Wiring:** Client UI is largely local/demo; durable write path and facilitator inbox are **not complete**

## Not implemented

- Guaranteed delivery of safety signals to on-call staff
- Automated escalation to external systems
- Clinical triage
- Mandatory-reporting automation

## Facilitator expectations (pilot practice)

Even before full product wiring, pilot programs should define:

1. Who receives safety signals
2. Response time expectations
3. When to pause vs end a room
4. When to involve institutional safeguarding or legal channels
5. What is recorded in audit vs kept minimal

## Status labels for docs and UI

Label Protected Pause as **UI prototype / partial** until `safety_reports` create + notify + resolve paths are verified.
