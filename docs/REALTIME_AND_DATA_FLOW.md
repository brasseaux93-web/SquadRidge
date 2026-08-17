# Realtime and data flow

**Purpose:** Describe how data moves today.

## Fixture mode

- Zustand store mirrors an in-memory `FixtureRoomRepository`
- Mutations go through `RoomService` then repository
- No multi-tab multi-user sync server

## Supabase mode

- Client uses `@supabase/supabase-js` with anon key
- Reads/writes subject to RLS
- Lifecycle via RPC
- **Realtime subscriptions:** not a first-class implemented product feature in current UI code paths; do not document as live multi-user sync without verifying channel usage

## Failure modes

- Missing Supabase env → adapter fails closed (no silent fixture fallback when adapter is `supabase`)
- Closed room → message insert denied
- Non-facilitator → RPC raises authorization errors
