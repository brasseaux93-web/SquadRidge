# Runbook: Failed deployment

1. Capture build/deploy logs
2. Roll back frontend to last known good
3. If migration partially applied, stop and repair with DBA/Supabase support—do not improvise destructive SQL
4. Re-run smoke tests before announcing recovery
