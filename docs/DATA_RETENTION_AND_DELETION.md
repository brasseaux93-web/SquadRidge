# Data retention and deletion

**Purpose:** State exactly what the software does today.

---

## Implemented

- **Close room (fixture):** removes messages for that room from the in-memory store; keeps outcomes
- **Close room (Supabase RPC):** `DELETE FROM room_messages WHERE room_id = ...`; sets room closed fields; audit row
- Pilot `retention_days` column exists on `pilots` table

## Not implemented

- Automated retention jobs / scheduled deletion workers
- Guaranteed purge of backups, logs, search indexes, or CDN caches
- User self-serve “delete my account and all traces” workflow
- Cryptographic erasure

## Pilot configuration

Until jobs exist, retention is a **policy + manual operations** problem. Document partner expectations in the pilot agreement, not only in UI copy.
