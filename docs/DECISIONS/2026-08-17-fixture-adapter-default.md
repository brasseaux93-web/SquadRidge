# Fixture adapter as default local mode

- **Status:** accepted
- **Context:** Developers and reviewers need a runnable product narrative without requiring Docker/Supabase
- **Decision:** Default `NEXT_PUBLIC_DATA_ADAPTER=fixture`; Supabase mode fails closed if misconfigured; never silent fallback from supabase→fixture
- **Consequences:** Demo disclosures required in UI; docs must separate demo vs server guarantees
