# Testing and quality

## Commands

```bash
npm test
npm run test:integration   # requires local Supabase + env
npm run typecheck
npm run lint
npm run build
```

## What exists

- Unit tests for RoomService invariants and transitions
- Integration tests for RLS/RPC behaviors (code present; must be run locally)

## Manual QA scenarios (fixture)

1. Enter as facilitator → open room → change phase → send message → propose outcome → approve → close → confirm messages gone, outcomes remain
2. Enter as participant → cannot approve/close (UI + service)
3. Demo banner visible
4. Privacy labels visible on room surfaces

## Release checklist (minimum)

- [ ] typecheck, lint, unit tests pass
- [ ] build succeeds
- [ ] truth matrix updated if behavior changed
- [ ] no new false security claims in UI copy
