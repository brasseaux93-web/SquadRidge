# Pilot partner guide

**Purpose:** Help institutions evaluate whether and how to run a **bounded** pilot.

---

## Fit

SquadRidge is a candidate for mediation/ombuds/HR programs that need structured digital rooms with minimized transcript retention—not for unrestricted enterprise chat replacement.

## Prerequisites for a responsible pilot

1. Written purpose, participant criteria, and consent language
2. Named facilitators trained on the tool **and** on program policy
3. Security and privacy review of actual architecture (see Trust docs)
4. Real authentication path (not demo role picker) before sensitive cases
5. Clear retention and export rules
6. Human escalation path for safety concerns
7. Agreement that demo fixtures are never mixed with live case data

## Technical preparation

- Hosted Supabase project with migrations applied
- RLS verification executed and recorded
- Environment secrets handled server-side only
- Frontend deployed with `NEXT_PUBLIC_DATA_ADAPTER=supabase` and public keys only

## Evaluation boundaries

Measure process usefulness (clarity of stages, outcome quality, facilitator load)—not engagement maximization metrics. Do not use participant-level surveillance analytics.

## Status honesty

Until items in [ROADMAP/PILOT_READINESS.md](./ROADMAP/PILOT_READINESS.md) are complete, treat the software as **prototype / pre-pilot infrastructure** requiring partner oversight.
