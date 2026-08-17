# Project Truth Matrix

**Purpose:** Distinguish implemented capability from demo behavior, planned work, and unsupported claims. This is the authoritative reference for documentation accuracy.

**Last verified against:** repository state on 2026-08-17 (main branch), package.json, supabase/migrations/*, src/data/*, src/domain/*, src/app/*, .env.example

---

## How to read this matrix

| Status | Meaning |
|--------|---------|
| **Implemented** | Present in code and intended for real use when the relevant adapter/env is configured |
| **Demo-only** | Works in fixture mode; does not provide production guarantees |
| **Partial** | Schema, types, or UI exist; full end-to-end flow incomplete or untested |
| **Planned** | Documented intent; not yet in code |
| **Not implemented** | Explicitly absent |
| **Inaccurate if claimed** | Must never be stated as current capability |

---

## Product & workflow

| Feature / claim | Evidence | Status | Documentation action |
|-----------------|----------|--------|----------------------|
| Facilitator-led room with phases | `src/domain/types.ts`, `transitions.ts`, room UI, RoomService | Implemented (fixture); Partial (Supabase) | Document both paths |
| Message send under assigned display role | RoomService, fixtures, room pages | Implemented (fixture); Partial (Supabase RLS) | Honest adapter notes |
| Outcome propose / approve / reject | RoomService + RPCs `approve_outcome`, `reject_outcome` | Implemented (fixture + SQL); integration tests not runtime-proven in CI | Document RPC + fixture |
| Close room + purge messages | `close_room` RPC + fixture `closeAndPurge` | Implemented | Emphasize demo vs server purge |
| Dialogue Spine UI | `DialogueSpine.tsx` | Implemented (UI) | Design + facilitator guide |
| Protected Pause UI | `ProtectedPause.tsx` | Demo-only (client UI; not wired to `safety_reports`) | Label as UI prototype |
| Commitment cards | `CommitmentCard.tsx` | Implemented (presentation) | Outcomes docs |
| Privacy labels | `PrivacyLabel.tsx` | Implemented (UI disclosure) | Trust docs |
| Real identity verification | — | Not implemented | Never claim |
| Magic-link / password Auth sessions | Profiles + trigger exist; no SSR session wiring | Partial / Planned | M1 in pilot plan |
| Organization / pilot workspace UI | Schema migration exists; no full UI | Partial | Schema yes; UX planned |
| Invitation acceptance flow | `invitations` table | Partial (schema only) | Planned |
| Safety report persistence | `safety_reports` table + UI stub | Partial | Wire + document |
| Consent gate before external publish | Types support visibility; no full UX | Partial / Planned | Outcomes & consent |
| Ledger / anonymized publication | Types + schema intent | Planned | Roadmap only |
| Analytics / Insights dashboard | — | Not implemented | Roadmap |
| Edge Functions | No `supabase/functions` directory | Not implemented | Document absence |
| Upstash rate limiting | Not in package.json or code | Not implemented | Do not claim |
| End-to-end encryption | — | Not implemented | **Inaccurate if claimed** |
| AI moderation / analysis | — | Not implemented | **Inaccurate if claimed** |
| Compliance certifications (HIPAA, SOC2, etc.) | — | Not implemented | **Inaccurate if claimed** |
| Anonymity guarantee | Pseudonyms are display roles only | Not implemented as anonymity | Prefer “role-based display identity” |

---

## Data & security

| Feature / claim | Evidence | Status | Documentation action |
|-----------------|----------|--------|----------------------|
| Supabase schema (core) | `20260817000000_squadridge_core.sql` | Implemented | DATABASE_SCHEMA |
| Organizations / pilots / safety / agreements schema | `20260817120000_organizations_pilots.sql` | Implemented (SQL) | Schema docs; UI partial |
| RLS on core tables | Same migration | Implemented | AUTHORIZATION_AND_RLS |
| RLS on org/pilot tables | Expansion migration | Implemented (SQL) | Same |
| Security-definer RPCs | approve/reject/close | Implemented | Edge/RPC docs |
| Integration tests for RLS | `supabase.integration.test.ts` | Implemented (code); **not executed in agent env** | rls-verification.md |
| Service role never in client | `.env.example`, repository pattern | Implemented (convention) | SECURITY + env docs |
| Fixture adapter default | `NEXT_PUBLIC_DATA_ADAPTER=fixture` | Demo-only default | README banner |
| Supabase adapter fails closed | `requireSupabasePublicEnv` | Implemented | Architecture |
| Automated retention jobs | — | Not implemented | DATA_RETENTION |
| Audit log without message bodies | Convention in RPCs + types | Implemented (intent) | Privacy docs |

---

## Frontend & design

| Feature / claim | Evidence | Status |
|-----------------|----------|--------|
| Next.js 15 App Router | package.json, src/app | Implemented |
| Civic-grade confidentiality design system | globals.css, components | Implemented |
| Demo banner disclosure | DemoBanner.tsx | Implemented |
| Landing, enter, facilitator room, workspace | pages | Implemented |
| Participant room redesign parity | `/room/[id]` older layout | Partial |
| Dark mode only | globals.css | Implemented (single mode) |
| Reduced-motion support | globals.css | Implemented |

---

## Testing & tooling

| Item | Evidence | Status |
|------|----------|--------|
| Unit tests (RoomService, transitions) | vitest | Implemented |
| Integration tests (RLS) | present; require local Supabase | Implemented code; runtime unverified here |
| Typecheck / lint / build scripts | package.json | Implemented |
| CI configuration | none found | Not implemented |
| Edge Function tests | N/A | Not implemented |

---

## Explicit non-claims (never document as current)

- End-to-end encryption of message content
- Zero-knowledge architecture
- Legal anonymity or untraceability
- Production identity verification / IdP
- AI-driven moderation, scoring, or sentiment analysis
- HIPAA, SOC 2, ISO, FedRAMP, or equivalent certification
- Guaranteed deletion beyond application-level purge in fixture or `close_room` RPC
- Multi-region or high-availability production operations
- Public external API for third-party integration

---

## Maintenance rule

Any PR that changes user-visible behavior, schema, RLS, RPCs, environment variables, or security posture **must** update this matrix and the affected docs in the same change set.
