# Threat model (draft)

**Purpose:** Investor- and partner-facing security boundary statement for SquadRidge pilot stage.

**Status:** Draft operational model. Not a formal penetration test or certification.

**Last updated:** 2026-08-17

---

## Assets

| Asset | Sensitivity |
|-------|-------------|
| Live room messages | High while open; intended temporary |
| Approved outcomes | Medium–high; durable process records |
| Safety reports | High; limited visibility |
| Profiles / memberships | Medium |
| Service role key | Critical |
| Audit events | Medium |

## Trust boundaries

1. Browser client (untrusted)
2. Supabase Data API + RLS (primary enforcement when adapter=supabase)
3. Security-definer RPCs (privileged lifecycle)
4. Fixture adapter (demo only — not a security boundary)
5. Hosting platform / operator access

## Primary threats

| Threat | Mitigation today | Residual risk |
|--------|------------------|---------------|
| Unauthorized room read/write | RLS + membership checks (Supabase); client checks (fixture) | Misconfigured policies; demo role picker |
| Client privilege escalation | RPCs for approve/reject/close; no service role in browser | Incomplete Auth sessions |
| Data retained beyond intent | `close_room` purge of messages | Backups, screenshots, logs |
| Credential leak | Env separation; no service role in `NEXT_PUBLIC_*` | Operator error |
| Demo data mistaken for production | Demo banner, `is_demo`, docs truth matrix | Partner process failure |

## Explicit non-claims

- No application-layer end-to-end encryption
- No formal anonymity guarantee
- No SOC 2 / HIPAA certification
- No automated intrusion detection

## Required before sensitive pilots

- Real Auth sessions + route guards
- Recorded RLS integration test results
- Safety report notify path verified
- Partner DPA / privacy review
