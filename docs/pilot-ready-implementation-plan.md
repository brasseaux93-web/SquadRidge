# SquadRidge Pilot-Ready Implementation Plan

**Date:** 2026-08-17  
**Status:** Living plan — execute in order. Do not claim features until code + tests + docs are consistent.

## Current state (inspected 2026-08-17)

### What exists and works (fixture mode)
- Next.js 15 App Router + React 19 + TypeScript + Tailwind + Framer Motion + Zustand
- Domain types: Room, Message, OutcomeEntry, RoomParticipant, AuditEvent, phases/statuses
- Fixture repository + RoomService with role checks, phase transitions, close/purge, approve/reject
- Unit tests for service invariants
- Supabase core migration: profiles, rooms, memberships, messages, outcomes, audit + RLS + `approve_outcome` / `close_room` / `reject_outcome` RPCs
- Integration test suite (not yet executed in this environment)
- Demo enter flow (role picker), facilitator `/app` dashboard, room UI with phases, messages, outcomes
- Honest DemoBanner and copy stating fixture / not production security
- Public landing, privacy, security pages

### Gaps vs pilot-ready requirements
1. **No real Supabase Auth session** — still demo `enterAs` role switcher
2. **No organizations / pilots / invitations** — schema is single-room-centric
3. **No safety_reports, structured agreements, outcome versions, ledger_entries, retention jobs**
4. **No Edge Functions** for privileged ops or rate limiting (Upstash not wired)
5. **Participant vs facilitator surfaces** partially separated; no invitation flow or pseudonym creation UX
6. **Analytics / aggregated impact ledger** absent
7. **Design system** partial (good tokens, but not every state finished)
8. **Trust center** thin; no formal threat model or retention configuration UI
9. **RLS not fully expanded** for multi-tenant org/pilot boundaries
10. **No production build validation recorded** in recent commits

## Guiding principles (non-negotiable)
- Honest trust boundaries: never claim encryption, verification, compliance, or AI moderation that is not implemented and tested.
- Server-side authority only (RLS + security-definer RPCs / Edge Functions). Client is UX, not security boundary.
- Fail closed when `NEXT_PUBLIC_DATA_ADAPTER=supabase` and credentials missing.
- Demo content never masquerades as production data.
- Prefer maintainable typed code over new packages.
- Every visible action works, explains why unavailable, or is removed.

## Milestone sequence

### M0 — Baseline integrity (immediate)
- [ ] Confirm `npm run typecheck`, `lint`, `test`, `build` pass on fixture mode
- [ ] Update README with accurate pilot limitations and env vars
- [ ] Record that integration tests require local Supabase (already documented)

### M1 — Auth foundation + profile model
- [ ] Add `@supabase/ssr` for cookie-based sessions
- [ ] Replace `/enter` demo picker with magic-link / password forms (keep demo mode behind clear flag)
- [ ] Server components / middleware route guards for `/app/*`
- [ ] Profiles table already exists; ensure trigger + minimal fields only
- [ ] Role is derived from memberships, never trusted from client claims alone

### M2 — Organization & Pilot workspace
- Expand schema:
  - `organizations`, `organization_memberships` (role: org_admin | facilitator | member)
  - `pilots` (purpose, consent language, retention_days, capacity, status)
  - `pilot_memberships`, `invitations` (token, email, role, expires)
- Facilitator/org-admin dashboard: list pilots, create pilot, invite, assign facilitators, room list by status
- Clear empty states and onboarding copy

### M3 — Facilitated dialogue room hardening
- Room lifecycle already partially modeled; align statuses with product (scheduled / waiting / active / paused / safety_review / closing / closed)
- Structured opening: agreements acknowledgement before dialogue
- Safety pathway: `safety_reports` table + non-punitive UI (raise concern → facilitator notify → resolve/escalate)
- Turn-taking optional queue (lightweight)
- Distinguish demo rooms (`is_demo` flag) from pilot rooms
- Read-only after close per retention

### M4 — Structured outcomes + consent
- Expand outcomes: shared understanding, agreements, unresolved, commitments with owner/target/review dates
- `outcome_versions` + `outcome_acknowledgements`
- Consent gate before any external visibility
- Version history view for facilitator

### M5 — Ledger & privacy-preserving analytics
- `ledger_entries` (anonymized, consented only)
- Internal analytics views: completion rates, session duration aggregates, safety counts (suppress n<5)
- No participant-level surveillance metrics

### M6 — Security baseline completion
- Full RLS for new tables
- Edge Functions for invite creation, export, safety notify (with Upstash rate limit where available)
- Audit events for privileged actions
- `.env.example` complete; no secrets in client
- Threat model + non-goals document

### M7 — Design polish & trust surfaces
- Finish all loading / empty / error / denied / confirmation states
- Accessibility pass (focus, contrast, reduced-motion)
- Expand Trust Center: security approach, data lifecycle, pilot limitations, responsible use
- Landing page refinement only after core workflow is coherent

## Explicit non-goals for this pilot build
- End-to-end encryption of message bodies (state transport + at-rest infrastructure protections only)
- Global scale / multi-region claims
- AI analysis of content or participant scoring
- Public searchable social features
- Military / command-and-control use cases
- Automated legal compliance certifications

## Validation gates (must pass before calling pilot-ready)
1. Typecheck + lint + unit tests green
2. Integration tests executed against local Supabase and results recorded
3. Production build succeeds
4. Unauthorized user cannot read/write outside membership scope (RLS proven)
5. Close room purges messages, retains only approved outcomes, writes audit
6. Every user-facing string accurate about current protections
7. README + Trust Center describe exact threat model and remaining work

## Execution order for the next agent/developer session
1. Push this plan (done)
2. Run baseline validation commands and fix any breakage
3. Implement M1 (auth) carefully so fixture mode remains usable for demos
4. Schema expansion for orgs/pilots in a new migration
5. UI for pilot dashboard before deep room polish
6. Iterate on safety + outcomes
7. Analytics last (needs data)

Keep commits small, messages descriptive, and documentation synchronized with code.
