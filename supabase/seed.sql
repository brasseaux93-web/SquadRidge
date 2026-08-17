-- Deterministic local seed for RLS integration tests.
-- Applied by: npx supabase db reset (if configured in config.toml)
-- Passwords are local-only: password123

-- Fixed UUIDs used by integration tests
-- facilitator: 11111111-1111-1111-1111-111111111111
-- participant: 22222222-2222-2222-2222-222222222222
-- unrelated:   33333333-3333-3333-3333-333333333333
-- room:        aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa

create extension if not exists "pgcrypto";

-- Auth users (local Supabase)
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) values
(
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'facilitator@example.local',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Facilitator Alex"}',
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'participant@example.local',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Participant Jordan"}',
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000000',
  '33333333-3333-3333-3333-333333333333',
  'authenticated',
  'authenticated',
  'unrelated@example.local',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Unrelated User"}',
  now(),
  now()
)
on conflict (id) do nothing;

-- identities required for email login in some Supabase versions
insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) values
(
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  format('{"sub":"%s","email":"facilitator@example.local"}', '11111111-1111-1111-1111-111111111111')::jsonb,
  'email',
  '11111111-1111-1111-1111-111111111111',
  now(), now(), now()
),
(
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  format('{"sub":"%s","email":"participant@example.local"}', '22222222-2222-2222-2222-222222222222')::jsonb,
  'email',
  '22222222-2222-2222-2222-222222222222',
  now(), now(), now()
),
(
  '33333333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-333333333333',
  format('{"sub":"%s","email":"unrelated@example.local"}', '33333333-3333-3333-3333-333333333333')::jsonb,
  'email',
  '33333333-3333-3333-3333-333333333333',
  now(), now(), now()
)
on conflict do nothing;

-- Profiles (trigger may already insert; upsert safely)
insert into public.profiles (id, display_name, email) values
  ('11111111-1111-1111-1111-111111111111', 'Facilitator Alex', 'facilitator@example.local'),
  ('22222222-2222-2222-2222-222222222222', 'Participant Jordan', 'participant@example.local'),
  ('33333333-3333-3333-3333-333333333333', 'Unrelated User', 'unrelated@example.local')
on conflict (id) do update set display_name = excluded.display_name;

insert into public.rooms (
  id, title, status, phase, ground_rules, invite_code, created_by
) values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Seeded integration room',
  'live',
  'dialogue',
  '["Speak under role labels","Facilitator approves commitments"]'::jsonb,
  'SEED01',
  '11111111-1111-1111-1111-111111111111'
) on conflict (id) do nothing;

insert into public.room_memberships (id, room_id, user_id, display_role, is_facilitator) values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Facilitator', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Engineer A', false)
on conflict (room_id, user_id) do nothing;

insert into public.room_messages (id, room_id, membership_id, display_role, body, is_facilitator) values
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Engineer A', 'Seed dialogue message to be purged on close.', false)
on conflict (id) do nothing;

insert into public.outcomes (id, room_id, status, body, proposed_by) values
  ('dddddddd-dddd-dddd-dddd-ddddddddddd1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'proposed', 'Proposed commitment — must not be visible to participants until approved.', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1'),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'approved', 'Already-approved commitment retained after close.', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1')
on conflict (id) do nothing;

update public.outcomes
set approved_by = '11111111-1111-1111-1111-111111111111',
    approved_at = now()
where id = 'dddddddd-dddd-dddd-dddd-ddddddddddd2';
