# Design system architecture

**Purpose:** Scalable UI foundation for SquadRidge with honest privacy differentiators.

**Last verified against:** `tailwind.config.ts`, `src/components/ui/*`, `docs/PROJECT_TRUTH_MATRIX.md` (2026-08-17)

---

## Non-negotiable trust rule

UI differentiators must **not** claim capabilities that are not implemented:

| Claim | Product reality | UI treatment |
|-------|-----------------|--------------|
| Zero-knowledge / server cannot read text | Not implemented | **Forbidden** |
| End-to-end encryption | Not implemented | **Forbidden** |
| Empathic AI / sentiment engine | Not implemented | **Forbidden** |
| Live dialogue is temporary (app purge on close) | Implemented (fixture + `close_room`) | Allowed |
| Room-scoped visibility intent | RLS + product model | Allowed as access boundary, not anonymity |
| Approved commitments retained | Implemented | Allowed |

---

## Token architecture

1. **Source of truth:** CSS variables in `src/app/globals.css`
2. **Tailwind maps names → variables** in `tailwind.config.ts`
3. **Components use semantic classes only** (`bg-ephemeral-muted`, `text-ink`) — no hex in component files

Semantic families:

- `ephemeral` — live, temporary dialogue
- `secure` — room-scoped / access-controlled (not ZK)
- `progress` / `consented` — approved retention
- `attention` / `critical` — review and safety seriousness

---

## Differentiator components

| Component | Intent |
|-----------|--------|
| `EphemeralStateBadge` | Persistent, calm state: live temporary · room scoped · retained · demo |
| `DissolveDialogue` | Close sequence: dialogue dissolves; commitments remain |
| `ApprovedCommitmentCard` | Strict post-session artifact presentation |
| `FacilitatorCue` | Human process cues (phase/pause/balance props) — **no AI** |
| `PrivacyLabel` | Scope disclosure chips |

---

## CVA + class merging

- Variants via `class-variance-authority`
- Merge via `cn()` (`clsx` + `tailwind-merge`) in `src/lib/utils.ts`
- Focus-visible required on interactive primitives

---

## Testing

- Vitest + jsdom + React Testing Library
- `src/**/*.test.{ts,tsx}`
- Badge tests assert **honest copy** and absence of encrypt/ZK language in default labels

```bash
npm test
```
