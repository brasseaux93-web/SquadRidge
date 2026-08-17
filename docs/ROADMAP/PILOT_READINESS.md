# Pilot readiness

## Required before accepting sensitive live pilots

- [ ] Real Auth sessions + route guards
- [ ] RLS integration tests executed and recorded as passing
- [ ] Safety report persistence + facilitator notification path
- [ ] Retention policy documented and operationally owned
- [ ] Incident and privacy-request runbooks adopted by the partner
- [ ] Legal/privacy review of actual architecture
- [ ] Facilitator training on tool + program policy
- [ ] No fixture data mixed with live cases

## Required before regulated / high-risk data

- [ ] Formal security assessment
- [ ] Data processing agreement
- [ ] Encryption and key-management review (current: transport + platform at-rest only)
- [ ] Audit completeness review

## Recommended for initial bounded pilot

- Invitation flow
- Outcome acknowledgement UX
- Basic aggregated operational metrics without participant surveillance

## Explicit exclusions

E2E encryption claims, AI moderation, public social features, military use, unreviewed global multi-tenant production.
