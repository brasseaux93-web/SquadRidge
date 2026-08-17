# Security and privacy review checklist

Use before accepting a bounded pilot with real institutional participants.

## Access control

- [ ] Supabase Auth sessions active (not demo role picker)
- [ ] Route guards on `/app` and room routes
- [ ] RLS policies verified against matrix in `docs/rls-verification.md`
- [ ] Service role key never in client bundle or public env
- [ ] Anon key scoped and rotatable

## Data lifecycle

- [ ] Close-room purge behavior demonstrated and documented to participants
- [ ] Retention days policy agreed in writing with partner
- [ ] Backup / log retention understood (platform defaults)
- [ ] No raw message bodies in operational logs

## Safety

- [ ] Safety report create path works end-to-end
- [ ] Facilitator visibility of open reports confirmed
- [ ] Human escalation channel defined outside the app
- [ ] Emergency services disclaimer presented

## Transparency

- [ ] Demo vs production labeling correct for the environment
- [ ] Privacy and security pages accurate vs truth matrix
- [ ] No encryption / compliance claims beyond implementation

## Operations

- [ ] Incident runbook reviewed
- [ ] Privacy request runbook reviewed
- [ ] CI green on main
- [ ] Migration rollback plan known
