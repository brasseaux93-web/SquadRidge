# Trust and limitations

**Purpose:** Give security, legal, privacy, and institutional reviewers an accurate boundary statement.

**Last verified against:** PROJECT_TRUTH_MATRIX, migrations, DemoBanner, README (2026-08-17)

---

## Intended use

SquadRidge is intended for **trained facilitators** running **bounded, consented dialogue** in mediation, ombuds, or carefully scoped institutional pilots.

It is **not** a substitute for:

- Emergency services or crisis hotlines
- Legal counsel or formal investigation processes
- Clinical mental-health care
- Institutional safeguarding or mandatory-reporting workflows
- Production security review for high-risk deployments

## Capabilities that exist today

- Fixture-backed demo of room phases, messaging under display roles, outcome propose/approve/reject, and close-with-purge
- Supabase schema with RLS helpers and security-definer RPCs for approve/reject/close
- Client application service layer that rejects unauthorized mutations in fixture mode
- Explicit demo disclosure in the UI
- Design language that surfaces privacy scope labels

## Limitations (must read)

| Topic | Reality |
|-------|---------|
| **Authentication** | Demo uses role picker (`enterAs`). Real Supabase Auth session + route guards incomplete |
| **Encryption** | Transport relies on normal HTTPS to hosting/Supabase. **No application-layer E2E encryption of message bodies** |
| **Anonymity** | Display roles are not anonymity. Operators with database access can correlate identities via memberships |
| **Verification** | No production identity verification |
| **Deletion** | Fixture purge and `close_room` RPC delete messages from application tables. This is not a certified erasure program; backups, logs, and screenshots are outside control |
| **Safety workflow** | UI exists; durable `safety_reports` path not fully wired |
| **Rate limiting** | Not implemented via Upstash or equivalent |
| **Compliance** | No HIPAA, SOC 2, ISO, or similar certification |
| **AI** | No content analysis, scoring, or automated moderation |

## Prohibited / out-of-scope uses

- High-risk cases without institutional governance and security review
- Covert surveillance of participants
- Automated credibility or psychological scoring
- Representation of demo data as live pilot evidence

## Required before sensitive pilots

See [ROADMAP/PILOT_READINESS.md](./ROADMAP/PILOT_READINESS.md).

Minimum expectations include: real Auth, verified RLS runtime tests, retention policy clarity, facilitator training, legal review, and incident/privacy request processes.

## Reporting security issues

See root [SECURITY.md](../SECURITY.md).
