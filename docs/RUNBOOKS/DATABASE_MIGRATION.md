# Runbook: Database migration

1. Test migrations on local/staging (`supabase db reset` or staging project)
2. Backup production
3. Apply forward migration
4. Run RLS verification scenarios
5. Update `DATABASE_SCHEMA.md` and truth matrix
6. If failure, restore from backup per host procedures
