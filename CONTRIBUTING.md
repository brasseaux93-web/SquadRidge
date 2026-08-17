# Contributing

## Principles

1. Prefer honest incomplete features over misleading polish
2. Server-side authorization over client-only checks
3. Update documentation in the same change as behavior

## Development

Follow [docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md).

Run before opening a PR:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

If you touch RLS, RPCs, or schema, run integration tests against local Supabase when possible and update `docs/rls-verification.md` / the truth matrix.

## Documentation maintenance (required)

Update docs when your change affects:

- User-visible behavior or copy that implies security/privacy properties
- Schema, RLS policies, or RPCs
- Environment variables
- Room lifecycle, outcomes, or safety flows
- Design tokens or trust markers

At minimum update:

1. [docs/PROJECT_TRUTH_MATRIX.md](docs/PROJECT_TRUTH_MATRIX.md)
2. Any specialized doc in `docs/` that describes the changed area
3. README status section if capability class changes

## Code of conduct

Be respectful. This product domain involves sensitive human situations—contribution discussion should model the same care.

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
