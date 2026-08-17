# Product overview

**Purpose:** Describe what SquadRidge is, who it serves, and the boundaries of the current pilot-stage product.

**Last verified against:** README, domain types, room flows, PROJECT_TRUTH_MATRIX (2026-08-17)

---

## One sentence

SquadRidge is pilot-stage, privacy-first infrastructure for facilitator-led dialogue in small rooms—where live conversation can end and consented next steps can remain.

## What it is

- A structured environment for mediators, ombuds teams, and institutional partners
- Facilitator-controlled room lifecycle (phases, close, purge of live messages)
- Role-based display identities inside the room (not real-name display by default)
- Outcome records that only persist after facilitator approval
- Honest demo mode with fixture data when production adapters are not configured

## What it is not

- A generic chat or collaboration app
- A social network or public forum
- A therapy or clinical product
- A surveillance, scoring, or sentiment-analysis system
- A military or command-and-control platform
- An autonomous conflict-resolution AI
- A certified compliance product (HIPAA, SOC 2, etc.)

## Core workflow (product arc)

1. **Access** — invited or demo role entry (real Auth sessions still incomplete)
2. **Private facilitated room** — assigned display roles, Dialogue Spine stages
3. **Structured dialogue** — messages under roles while room is open
4. **Safety / pause** — UI for non-punitive requests (persistence partial)
5. **Consented outcomes** — propose → approve/reject → ledger retention
6. **Close** — purge live messages; keep approved outcomes

## Differentiation

Ordinary workplace tools retain searchable transcripts by default. SquadRidge is designed around **minimized retention of live dialogue** and **facilitator authority over what becomes durable**. Progress can survive without turning the conversation into a permanent organizational archive.

## Current status

| Mode | Reality |
|------|---------|
| Default local run | Fixture (in-memory) demo |
| Supabase path | Schema + RLS + RPCs present; Auth session wiring and full UI incomplete |
| Pilot readiness | Not ready for sensitive live cases without further work and institutional review |

See [PROJECT_TRUTH_MATRIX.md](./PROJECT_TRUTH_MATRIX.md) and [ROADMAP/PILOT_READINESS.md](./ROADMAP/PILOT_READINESS.md).

## Non-goals (near term)

- End-to-end encryption of message bodies
- Global scale multi-tenant SaaS claims
- AI analysis of participant content
- Public searchable social features
- Replacement of trained human facilitation or emergency services
