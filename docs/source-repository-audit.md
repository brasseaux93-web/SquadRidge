# Source Repository Audit: brasseaux93-web/squadridge-astro

**Audit date:** 2026-08-16  
**Source SHA:** d9b1b61a0aea3718189d6c5fa578bc9a87be7ed7  
**Destination:** brasseaux93-web/SquadRidge

---

## 1. Product purpose and primary user problems

**SquadRidge** is a private, facilitator-led digital room for high-stakes and sensitive dialogue.

### Primary problems it addresses
- Standard workplace tools (Slack, Teams, Zoom, email) **preserve, search, and index** conversation by default. In conflict, mediation, and ombuds settings this creates liability anxiety and reduces candor.
- Participants fear that candid statements become permanent organizational records.
- Facilitators lack purpose-built controls for phases, private caucuses, ground rules, and outcome governance.
- Existing tools do not separate **verified identity** (needed for accountability) from **in-room identity** (needed for psychological safety).
- There is no clean path from ephemeral dialogue to a durable, approved set of commitments without retaining a full transcript.

### Core product thesis (from source copy)
> “The conversation can end. The progress should not.”  
> Facilitators guide private dialogue; only approved commitments, timelines, and unresolved items carry forward. Live session text is deleted when the room closes.

### Primary audiences (from pilot form + footer)
- Mediators / Facilitators
- Ombuds offices
- HR / Employee Relations
- Community peacebuilders

Secondary: public agencies, schools, nonprofits, and civic partners handling sensitive human situations.

---

## 2. Essential features and expected behavior

Extracted from Hero, HowItWorks demo, Capabilities, PrivacyArchitecture, ComparisonTable, and Footer.

| Feature | Expected behavior |
|--------|-------------------|
| **Identity separation** | Participants are verified before entry. Inside the room they appear under facilitator-assigned roles (e.g. “Engineer A”, “Participant 2”). Real names are not displayed in the live room context. |
| **Facilitator process control** | Facilitator sets phases, ground rules, opens/closes private caucuses, and decides what becomes a proposed outcome. |
| **Ephemeral live dialogue** | Chat exists only for the duration of the session. On room close, session text is purged. UI must communicate “Chat deletes on close.” |
| **Outcome ledger** | Only facilitator-approved commitments, owners, timelines, and unresolved items are retained. |
| **Optional Facilitator Assist (AI)** | Can draft privacy-conscious outcome language from discussion themes. Never decides outcomes. Every draft requires human review/approval/edit/reject. Explicitly: no participant scoring, no emotion/credibility/intent ranking, no session-text training. |
| **Pilot / intake CTA** | Public request form (name, work email, role, optional org) with human review messaging—not automated sales sequences. |
| **Privacy architecture messaging** | Encrypted live-room communication, minimized retention, separate identity and room context, outcome-focused recordkeeping, limited operational audit info. Honest disclaimer that screenshots/external notes cannot be prevented. |

**Not present in source (must not invent as if they existed):**
- Real authentication system
- Database schemas or migrations
- Live multi-user rooms
- Scheduling / calendar integration
- Safety screening / eligibility workflows
- Organization admin surfaces
- Reporting dashboards
- Notification systems
- Actual encryption implementation (only described)

---

## 3. User roles, permissions, and role-specific experiences

Source implies (does not implement) three primary roles:

| Role | Responsibilities | Visibility |
|------|------------------|------------|
| **Facilitator** | Create/manage rooms, assign in-room roles, control phases, open caucuses, review/approve outcomes, close & purge session | Full process control; sees proposed outcomes and can approve/reject |
| **Participant** | Enter verified, appear under assigned role, contribute to dialogue, propose commitments | Sees only room context + their role; does not see other real identities by default |
| **Organization / program contact** (pilot form) | Request access, understand fit for practice | Public/marketing only in source |

**Platform administrator** is not described. Keep out of v1 UI unless needed for demo role-switching.

**Decision (conservative):** Implement role boundaries in UI architecture and typed domain models. Use a demo auth adapter that allows switching among Facilitator / Participant views without claiming real identity verification or encryption.

---

## 4. Route inventory (source)

Source is a single-page marketing site:

| Surface | Source location | Notes |
|---------|-----------------|-------|
| Public landing | `/` (index.astro) | Hero, How it works interactive demo, comparison, capabilities, privacy, founder note, pilot form, footer |
| Anchor: `#demo` / how-it-works | HowItWorks.astro | 3-step interactive concept demo |
| Anchor: `#capabilities` | Capabilities.astro | Feature cards + Facilitator Assist safety grid |
| Anchor: `#privacy` | PrivacyArchitecture.astro | Minimized retention messaging |
| Anchor: `#pilot` | Footer.astro | Request form |
| Anchor: `#founder` | PrivacyArchitecture.astro | Founder note |
| Legal modals (placeholders) | Footer links | Privacy Policy, Terms, Security overview — no real content |

**No authenticated routes exist in source.**

### Destination route model (product-aligned extension)

| Area | Routes | Role |
|------|--------|------|
| Public | `/`, `/privacy`, `/security` | Anyone |
| Auth (demo) | `/enter` | Demo role selection |
| Facilitator | `/app`, `/app/rooms`, `/app/rooms/[id]`, `/app/rooms/[id]/outcomes` | Facilitator |
| Participant | `/room/[id]` | Participant (join via invite token in future) |
| Shared | `/app/settings` (minimal) | Authenticated |

---

## 5. Domain entities, data-model assumptions, relationships, lifecycle states

Source contains **no code-level data models**. The following are inferred from product language and treated as extensible interfaces.

### Entities

- **User** — real identity (name, email, org role); used for verification & audit, not displayed in-room by default
- **Room** — facilitated session container
- **RoomParticipant** — link of User → Room with assigned **displayRole** (e.g. “Engineer A”)
- **Message** — ephemeral in-session message (not persisted after close)
- **ProposedOutcome** — draft commitment/timeline/unresolved item
- **OutcomeEntry** — facilitator-approved ledger item (commitment, owner, due date, status)
- **SessionPhase** — facilitator-controlled phase label (e.g. Opening, Dialogue, Caucus, Closing)

### Room lifecycle (inferred)

```
Draft → Prepared (participants verified / roles assigned)
  → Live (dialogue open)
  → Closing (outcome review)
  → Closed (chat purged; ledger retained)
```

### Outcome lifecycle

```
Proposed → Under facilitator review → Approved (ledger) | Rejected | Revised
```

### Status transitions that must be explicit in UI
- Room phase changes (owned by facilitator)
- Outcome approval (owned by facilitator)
- Room close + purge (consequential; confirm)
- “Awaiting participant” vs “Awaiting facilitator” handoffs

---

## 6. Privacy, consent, safety, auditability, and moderation requirements

From source (must preserve spirit):

- **Minimized retention** of live dialogue; purge on close
- **No session-text AI training**
- **No participant scoring / profiling / ranking**
- **Human authority over all outcomes**
- **Honest limits**: software cannot prevent screenshots or external notes
- **Limited operational audit information** (what was approved, by whom, when — not full chat replay)
- Pilot form: human review, no third-party sharing of request data (stated intent)

**Do not claim in UI or README:** HIPAA, SOC 2, government certification, specific encryption algorithms, or legal compliance unless infrastructure demonstrably supports it.

**Safety posture for v1:**
- Role-gated views
- Consequential actions (close room, approve outcome, purge) require explicit confirmation with plain-language summary
- Sensitive content kept out of URLs and notification previews
- Demo mode clearly labeled so users never mistake fixtures for production security

---

## 7. Workflows and UX patterns that must be preserved

1. **Three-step conceptual arc** (from HowItWorks demo):
   - Prepare the room (verify + role assignment)
   - Guide the conversation (structured, facilitator-led)
   - Approve the outcome (ledger only; then purge)

2. **Outcome-first framing** — progress survives; conversation does not become a searchable archive.

3. **Facilitator Assist constraints** — drafts only; edit/reject/rewrite always available; no automated decisions.

4. **Calm, institutional visual language** — deep neutrals, sage/teal accent (`#6A8A83`), Instrument Serif + clean sans, restrained motion, no gamification, no surveillance metaphors.

5. **Plain language** about what is retained vs deleted.

6. **Pilot request path** with human-touch messaging.

---

## 8. Ambiguities, missing requirements, and product-aligned decisions

| Ambiguity | Decision |
|-----------|----------|
| No real auth or identity verification | Demo auth adapter with role switcher; clear “Demo mode” banner. Interfaces shaped so a real IdP can replace the adapter. |
| No backend / realtime | Typed local fixtures + in-memory store for rooms/messages/outcomes. Data-access boundary isolated for later API swap. |
| “Encrypted room” claimed in marketing | UI language: “Private room · Session text not retained after close.” No false encryption claims in product chrome. |
| Private caucuses mentioned but not specified | Support a simple “caucus” phase flag and side-panel note for facilitator; full multi-breakout deferred. |
| Scheduling / invitations | Room has optional `scheduledAt` and invite codes in model; full calendar UX deferred. |
| Organization multi-tenancy | Single-org demo data; `organizationId` on entities for future tenancy. |
| Legal modal content missing | Minimal honest Privacy / Security pages stating design intent and current prototype limits. |
| AI Facilitator Assist | Optional UI path that produces a deterministic draft from selected messages (local, no external model call in v1) requiring approval. |

---

## 9. Mapping: source functionality → destination implementation

| Source element | Destination |
|----------------|-------------|
| Marketing landing (Hero, How it works, Capabilities, Privacy, Pilot) | Evolved public `/` + supporting pages; same product story, improved IA |
| Interactive 3-step demo | Real (fixture-backed) room flow under `/app/rooms/[id]` |
| Role-based participation concept | `RoomParticipant.displayRole` + facilitator assignment UI |
| Outcome ledger concept | `OutcomeEntry` model + approval workflow + ledger view |
| “Chat deletes on close” | Explicit close-room action that clears messages in store and locks room |
| Facilitator Assist safety rules | Documented + UI that only proposes drafts under facilitator control |
| Design tokens (deep bg, sage accent, serif headings) | Centralized design-token system in CSS / Tailwind theme |
| Founder note / trust language | Preserved in spirit on public site; product UI stays operational and calm |

---

## Technical notes on source

- **Stack:** Astro 7, minimal deps, no React/Vue runtime components in use for product logic
- **Styling:** Large global CSS block in `Layout.astro` with CSS variables
- **Interactivity:** Vanilla JS in `<script>` tags for demo steps and form success state
- **No tests, no env vars, no API routes, no auth**
- README still default Astro starter text — product intent lives entirely in components

---

*This audit is the source of truth for what SquadRidge must preserve. Implementation may improve architecture, IA, and resilience, but must not invent features that conflict with the privacy and facilitator-authority principles above.*
