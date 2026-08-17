-- SquadRidge core schema, RLS, and lifecycle RPCs
-- Authority: database (auth.uid()), not client-supplied roles.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  email text,
  created_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null default 'live'
    check (status in ('draft', 'prepared', 'live', 'closing', 'closed')),
  phase text not null default 'opening'
    check (phase in ('opening', 'dialogue', 'caucus', 'synthesis', 'closing')),
  ground_rules jsonb not null default '[]'::jsonb,
  invite_code text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  closed_by uuid references public.profiles (id),
  constraint rooms_closed_consistency check (
    (status = 'closed' and closed_at is not null)
    or (status <> 'closed')
  )
);

create index rooms_status_idx on public.rooms (status);

create table public.room_memberships (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  display_role text not null,
  is_facilitator boolean not null default false,
  active boolean not null default true,
  joined_at timestamptz not null default now(),
  unique (room_id, user_id)
);

create index room_memberships_user_idx on public.room_memberships (user_id);
create index room_memberships_room_idx on public.room_memberships (room_id);

create table public.room_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  membership_id uuid not null references public.room_memberships (id) on delete cascade,
  display_role text not null,
  body text not null,
  is_facilitator boolean not null default false,
  created_at timestamptz not null default now()
);

create index room_messages_room_idx on public.room_messages (room_id);

create table public.outcomes (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  status text not null default 'proposed'
    check (status in ('proposed', 'under_review', 'approved', 'rejected', 'revised')),
  body text not null,
  owner_label text,
  due_date date,
  proposed_by uuid references public.room_memberships (id),
  approved_by uuid references public.profiles (id),
  approved_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index outcomes_room_status_idx on public.outcomes (room_id, status);

create table public.room_audit_events (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.rooms (id) on delete set null,
  actor_id uuid references public.profiles (id),
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index room_audit_events_room_idx on public.room_audit_events (room_id);

-- ---------------------------------------------------------------------------
-- Membership helpers (security definer, fixed search_path)
-- ---------------------------------------------------------------------------
create or replace function public.is_room_member(p_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.room_memberships m
    where m.room_id = p_room_id
      and m.user_id = auth.uid()
      and m.active = true
  );
$$;

create or replace function public.is_room_facilitator(p_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.room_memberships m
    where m.room_id = p_room_id
      and m.user_id = auth.uid()
      and m.active = true
      and m.is_facilitator = true
  );
$$;

revoke all on function public.is_room_member(uuid) from public;
revoke all on function public.is_room_facilitator(uuid) from public;
grant execute on function public.is_room_member(uuid) to authenticated;
grant execute on function public.is_room_facilitator(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_memberships enable row level security;
alter table public.room_messages enable row level security;
alter table public.outcomes enable row level security;
alter table public.room_audit_events enable row level security;

-- profiles: users read/update self only
create policy profiles_select_self on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- rooms: members only
create policy rooms_select_member on public.rooms
  for select to authenticated
  using (public.is_room_member(id));

create policy rooms_update_facilitator on public.rooms
  for update to authenticated
  using (public.is_room_facilitator(id))
  with check (public.is_room_facilitator(id));

-- memberships: members can read roster display roles for their rooms
create policy memberships_select_member on public.room_memberships
  for select to authenticated
  using (public.is_room_member(room_id));

-- messages: members read/insert only while room not closed
create policy messages_select_member_open on public.room_messages
  for select to authenticated
  using (
    public.is_room_member(room_id)
    and exists (
      select 1 from public.rooms r
      where r.id = room_id and r.status <> 'closed'
    )
  );

create policy messages_insert_member_open on public.room_messages
  for insert to authenticated
  with check (
    public.is_room_member(room_id)
    and exists (
      select 1 from public.rooms r
      where r.id = room_id and r.status <> 'closed'
    )
    and membership_id in (
      select m.id from public.room_memberships m
      where m.room_id = room_messages.room_id
        and m.user_id = auth.uid()
        and m.active = true
    )
  );

-- No direct DELETE/UPDATE on messages for clients (purge via close_room only)

-- outcomes: participants see approved only; facilitators see all in room
create policy outcomes_select_visibility on public.outcomes
  for select to authenticated
  using (
    public.is_room_member(room_id)
    and (
      public.is_room_facilitator(room_id)
      or status = 'approved'
    )
  );

create policy outcomes_insert_facilitator on public.outcomes
  for insert to authenticated
  with check (
    public.is_room_facilitator(room_id)
    and exists (
      select 1 from public.rooms r
      where r.id = room_id and r.status <> 'closed'
    )
  );

-- Direct client UPDATE on outcomes is denied (approval via RPC only)
-- (no update policy = no updates for authenticated via Data API)

-- audit: facilitators of room only; no message bodies in metadata by convention
create policy audit_select_facilitator on public.room_audit_events
  for select to authenticated
  using (
    room_id is not null and public.is_room_facilitator(room_id)
  );

-- ---------------------------------------------------------------------------
-- RPC: approve_outcome
-- ---------------------------------------------------------------------------
create or replace function public.approve_outcome(p_outcome_id uuid)
returns public.outcomes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_outcome public.outcomes;
  v_room public.rooms;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  select * into v_outcome
  from public.outcomes
  where id = p_outcome_id
  for update;

  if not found then
    raise exception 'outcome_not_found' using errcode = 'P0002';
  end if;

  select * into v_room
  from public.rooms
  where id = v_outcome.room_id
  for update;

  if not public.is_room_facilitator(v_outcome.room_id) then
    raise exception 'not_facilitator' using errcode = '42501';
  end if;

  if v_room.status = 'closed' then
    raise exception 'room_closed' using errcode = 'P0001';
  end if;

  if v_outcome.status not in ('proposed', 'under_review', 'revised') then
    raise exception 'outcome_not_approvable' using errcode = 'P0001';
  end if;

  update public.outcomes
  set status = 'approved',
      approved_by = v_uid,
      approved_at = now()
  where id = p_outcome_id
  returning * into v_outcome;

  insert into public.room_audit_events (room_id, actor_id, action, metadata)
  values (
    v_outcome.room_id,
    v_uid,
    'outcome.approved',
    jsonb_build_object('outcome_id', p_outcome_id)
  );

  return v_outcome;
end;
$$;

revoke all on function public.approve_outcome(uuid) from public;
grant execute on function public.approve_outcome(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- RPC: close_room (idempotent)
-- ---------------------------------------------------------------------------
create or replace function public.close_room(p_room_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_room public.rooms;
  v_purged int := 0;
  v_approved int := 0;
  v_already boolean := false;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  select * into v_room
  from public.rooms
  where id = p_room_id
  for update;

  if not found then
    raise exception 'room_not_found' using errcode = 'P0002';
  end if;

  if not public.is_room_facilitator(p_room_id) then
    raise exception 'not_facilitator' using errcode = '42501';
  end if;

  if v_room.status = 'closed' then
    v_already := true;
    delete from public.room_messages where room_id = p_room_id;
    get diagnostics v_purged = row_count;
  else
    update public.rooms
    set status = 'closed',
        phase = 'closing',
        closed_at = now(),
        closed_by = v_uid
    where id = p_room_id
    returning * into v_room;

    delete from public.room_messages where room_id = p_room_id;
    get diagnostics v_purged = row_count;

    insert into public.room_audit_events (room_id, actor_id, action, metadata)
    values (
      p_room_id,
      v_uid,
      'room.closed',
      jsonb_build_object('purged_messages', v_purged)
    );
  end if;

  select count(*) into v_approved
  from public.outcomes
  where room_id = p_room_id and status = 'approved';

  return jsonb_build_object(
    'room_id', p_room_id,
    'status', 'closed',
    'already_closed', v_already,
    'closed_at', v_room.closed_at,
    'purged_message_count', v_purged,
    'retained_approved_outcome_count', v_approved
  );
end;
$$;

revoke all on function public.close_room(uuid) from public;
grant execute on function public.close_room(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Optional: auto profile on signup (local/dev convenience)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
