# Design system — Civic-grade confidentiality

**Purpose:** Preserve the distinctive visual and interaction language.

## Philosophy

Institutional composure + precise process infrastructure + human dignity. Not generic SaaS, not consumer chat, not military cosplay, not surveillance aesthetics.

## Color semantics

| Token | Use |
|-------|-----|
| private | Room-contained |
| active / accent | In dialogue |
| progress | Agreement / retained |
| attention | Needs review / pause |
| critical | Safety seriousness |
| consented | Ledger / disclosure |

Defined in `src/app/globals.css` and mapped in `tailwind.config.ts`.

## Typography

- Display: Instrument Serif for major statements
- Interface: Satoshi / Inter
- Mono: sparse operational labels

## Components of note

- `PrivacyLabel`, `StatusMarker`, `DialogueSpine`, `CommitmentCard`, `ProtectedPause`, `EmptyState`
- Editorial transcript lines (not chat bubbles)

## Motion

Short, deliberate; reduced-motion respected globally.

## Tone of voice

Plain, precise, non-inflammatory, non-hype. Prefer “authenticated access with row-level authorization” over marketing security adjectives.
