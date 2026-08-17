-- SquadRidge expansion: organizations, pilots, invitations, safety reports
-- Keeps existing room-centric tables. New entities sit above rooms.
-- RLS uses membership helpers. Privileged writes remain via RPCs where needed.

-- ---------------------------------------------------------------------------
-- Organizations
-- ---------------------------------------------------------------------------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles (id)
);

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('org_admin', 'facilitator', 'member')),
  active boolean not null default true,
  joined_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index organization_memberships_user_idx on public.organization_memberships (user_id);

-- ---------------------------------------------------------------------------
-- Pilots
-- ---------------------------------------------------------------------------
create table public.pilots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  purpose text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'active', 'paused', 'closed')),
  participant_criteria text not null default '',
  safety_contacts text not null default '',
  consent_language text not null default '',
  retention_days integer not null default 30 check (retention_days >= 0),
  outcome_visibility text not null default 'room_only'
    check (outcome_visibility in ('room_only', 'organization', 'anonymized_ledger')),
  max_rooms integer,
  max_participants_per_room integer,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pilots_org_status_idx on public.pilots (organization_id, status);

create table public.pilot_memberships (
  id uuid primary key default gen_random_uuid(),
  pilot_id uuid not null references public.pilots (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('facilitator', 'participant', 'observer')),
  active boolean not null default true,
  joined_at timestamptz not null default now(),
  unique (pilot_id, user_id)
);

create index pilot_memberships_user_idx on public.pilot_memberships (user_id);

-- Link rooms to pilots (nullable for legacy / demo rooms)
alter table public.rooms
  add column if not exists pilot_id uuid references public.pilots (id) on delete set null,
  add column if not exists is_demo boolean not null default false;

create index rooms_pilot_idx on public.rooms (pilot_id);

-- ---------------------------------------------------------------------------
-- Invitations
-- ---------------------------------------------------------------------------
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  pilot_id uuid references public.pilots (id) on delete cascade,
  room_id uuid references public.rooms (id) on delete cascade,
  email text not null,
  role text not null check (role in ('org_admin', 'facilitator', 'participant', 'observer')),
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'revoked', 'expired')),
  invited_by uuid references public.profiles (id),
  expires_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index invitations_token_idx on public.invitations (token);
create index invitations_email_idx on public.invitations (email);

-- ---------------------------------------------------------------------------
-- Safety reports (non-punitive)
-- ---------------------------------------------------------------------------
create table public.safety_reports (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  reporter_membership_id uuid references public.room_memberships (id) on delete set null,
  category text not null default 'concern'
    check (category in ('concern', 'pause_request', 'escalation', 'other')),
  note text not null default '',
  status text not null default 'open'
    check (status in ('open', 'acknowledged', 'resolved', 'escalated')),
  assigned_to uuid references public.profiles (id),
  resolved_at timestamptz,
  resolution_note text,
  created_at timestamptz not null default now()
);

create index safety_reports_room_status_idx on public.safety_reports (room_id, status);

-- ---------------------------------------------------------------------------
-- Room agreements (structured opening)
-- ---------------------------------------------------------------------------
create table public.room_agreements (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  body text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.room_agreement_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  agreement_id uuid not null references public.room_agreements (id) on delete cascade,
  membership_id uuid not null references public.room_memberships (id) on delete cascade,
  acknowledged_at timestamptz not null default now(),
  unique (agreement_id, membership_id)
);

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------
create or replace function public.is_org_member(p_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_memberships m
    where m.organization_id = p_org_id
      and m.user_id = auth.uid()
      and m.active = true
  );
$$;

create or replace function public.is_org_admin(p_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_memberships m
    where m.organization_id = p_org_id
      and m.user_id = auth.uid()
      and m.active = true
      and m.role = 'org_admin'
  );
$$;

create or replace function public.is_pilot_member(p_pilot_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.pilot_memberships m
    where m.pilot_id = p_pilot_id
      and m.user_id = auth.uid()
      and m.active = true
  );
$$;

create or replace function public.is_pilot_facilitator(p_pilot_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.pilot_memberships m
    where m.pilot_id = p_pilot_id
      and m.user_id = auth.uid()
      and m.active = true
      and m.role = 'facilitator'
  );
$$;

revoke all on function public.is_org_member(uuid) from public;
revoke all on function public.is_org_admin(uuid) from public;
revoke all on function public.is_pilot_member(uuid) from public;
revoke all on function public.is_pilot_facilitator(uuid) from public;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.is_org_admin(uuid) to authenticated;
grant execute on function public.is_pilot_member(uuid) to authenticated;
grant execute on function public.is_pilot_facilitator(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.pilots enable row level security;
alter table public.pilot_memberships enable row level security;
alter table public.invitations enable row level security;
alter table public.safety_reports enable row level security;
alter table public.room_agreements enable row level security;
alter table public.room_agreement_acknowledgements enable row level security;

-- Organizations: members can read
create policy orgs_select_member on public.organizations
  for select to authenticated
  using (public.is_org_member(id));

create policy orgs_update_admin on public.organizations
  for update to authenticated
  using (public.is_org_admin(id))
  with check (public.is_org_admin(id));

-- Org memberships: members of same org
create policy org_memberships_select on public.organization_memberships
  for select to authenticated
  using (public.is_org_member(organization_id));

-- Pilots: org members or pilot members
create policy pilots_select on public.pilots
  for select to authenticated
  using (
    public.is_org_member(organization_id)
    or public.is_pilot_member(id)
  );

create policy pilots_update_facilitator on public.pilots
  for update to authenticated
  using (public.is_pilot_facilitator(id) or public.is_org_admin(organization_id))
  with check (public.is_pilot_facilitator(id) or public.is_org_admin(organization_id));

-- Pilot memberships
create policy pilot_memberships_select on public.pilot_memberships
  for select to authenticated
  using (public.is_pilot_member(pilot_id) or public.is_org_member(
    (select organization_id from public.pilots where id = pilot_id)
  ));

-- Invitations: inviter / org admin / intended email (future; for now org members)
create policy invitations_select on public.invitations
  for select to authenticated
  using (
    invited_by = auth.uid()
    or (organization_id is not null and public.is_org_admin(organization_id))
  );

-- Safety reports: room members can insert; facilitators can manage
create policy safety_select_member on public.safety_reports
  for select to authenticated
  using (public.is_room_member(room_id));

create policy safety_insert_member on public.safety_reports
  for insert to authenticated
  with check (public.is_room_member(room_id));

create policy safety_update_facilitator on public.safety_reports
  for update to authenticated
  using (public.is_room_facilitator(room_id))
  with check (public.is_room_facilitator(room_id));

-- Agreements: room members
create policy agreements_select on public.room_agreements
  for select to authenticated
  using (public.is_room_member(room_id));

create policy agreement_acks_select on public.room_agreement_acknowledgements
  for select to authenticated
  using (
    exists (
      select 1 from public.room_agreements a
      where a.id = agreement_id and public.is_room_member(a.room_id)
    )
  );

create policy agreement_acks_insert on public.room_agreement_acknowledgements
  for insert to authenticated
  with check (
    membership_id in (
      select m.id from public.room_memberships m
      where m.user_id = auth.uid() and m.active = true
    )
  );

-- Note: Insert policies for orgs/pilots intentionally omitted for client;
-- creation should go through Edge Functions or service role in controlled flows.
