# Authorization and RLS

**Purpose:** Explain server-side access control as written in migrations.

**Last verified against:** core + organizations_pilots migrations; `docs/rls-verification.md`

---

## Principles

1. `auth.uid()` is the identity source
2. Membership helpers (`is_room_member`, `is_room_facilitator`, org/pilot helpers) are security definer with fixed `search_path`
3. Privileged lifecycle changes go through RPCs
4. Browser uses anon key only; service role is server/ops only

## Core policy intent

| Table | Select | Insert/Update notes |
|-------|--------|---------------------|
| profiles | self | self update |
| rooms | members | facilitator update |
| room_memberships | members of room | — |
| room_messages | members while room not closed | members insert as self membership; no client delete |
| outcomes | facilitator all; others approved only | facilitator insert; no client update policy |
| room_audit_events | facilitators of room | written by RPCs |

## Org/pilot policy intent

Members can read org/pilot context; admins/facilitators update within scope. Invitation select limited. Safety reports: members insert/select; facilitators update.

## Testing

Integration suite: `src/data/supabase.integration.test.ts`  
Run instructions: `docs/rls-verification.md`  
**Agent environment has not executed these tests against Docker Supabase.** A developer machine must record pass/fail.

## Client vs server

`RoomService` improves UX and prevents obvious misuse in fixture mode. **RLS/RPCs are the authority** in Supabase mode.
