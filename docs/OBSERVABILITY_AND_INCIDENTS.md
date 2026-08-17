# Observability and incidents

## Current state

- No dedicated APM/metrics stack in repo
- Application audit events for some privileged actions
- Browser console errors only as typical for Next apps

## Must never log

- Message bodies in operational logs
- Service role keys
- Access tokens
- Unnecessary personal data

## Incident severity (draft operational model)

| Level | Examples |
|-------|----------|
| SEV1 | Suspected unauthorized access to live pilot data |
| SEV2 | Broken close/purge; Auth misconfiguration exposing rooms |
| SEV3 | Demo/production labeling failure; non-critical UI defects |

See [RUNBOOKS/SECURITY_INCIDENT.md](./RUNBOOKS/SECURITY_INCIDENT.md).
