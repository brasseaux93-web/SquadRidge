# Security policy

## Supported versions

This repository is pilot-stage software (0.x). Security fixes are applied on a best-effort basis to the default branch.

## Reporting a vulnerability

Please report suspected security issues privately to the repository owner via GitHub Security Advisories (preferred) or a private channel agreed with the maintainers.

Include:

- Description of the issue
- Steps to reproduce
- Impact assessment (data exposure, privilege escalation, etc.)
- Whether any real pilot data was accessed (if applicable)

Do **not** open a public issue with exploit details for vulnerabilities that could affect live deployments.

## Security boundaries (current)

- Browser uses only public anon keys when Supabase adapter is enabled
- Service role keys must never appear in `NEXT_PUBLIC_*` variables or client bundles
- Authorization for Supabase mode is intended to be enforced by RLS and security-definer RPCs
- Fixture mode is **not** a security boundary—demo only

## Non-claims

This project does **not** currently claim:

- End-to-end encryption of message content
- Formal compliance certifications
- Guaranteed anonymity
- Production identity verification
- Automated intrusion detection

See [docs/TRUST_AND_LIMITATIONS.md](docs/TRUST_AND_LIMITATIONS.md) and [docs/PROJECT_TRUTH_MATRIX.md](docs/PROJECT_TRUTH_MATRIX.md).

## Secret handling

- Never commit `.env.local` or real keys
- Rotate keys if exposure is suspected
- Prefer platform secret stores for service role credentials used by ops scripts
