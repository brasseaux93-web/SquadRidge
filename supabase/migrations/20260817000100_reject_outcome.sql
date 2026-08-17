-- Reject outcome RPC (facilitator-only, server-side authority)

create or replace function public.reject_outcome(p_outcome_id uuid)
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

  if v_outcome.status = 'approved' then
    raise exception 'outcome_already_approved' using errcode = 'P0001';
  end if;

  if v_outcome.status = 'rejected' then
    return v_outcome; -- idempotent
  end if;

  update public.outcomes
  set status = 'rejected'
  where id = p_outcome_id
  returning * into v_outcome;

  insert into public.room_audit_events (room_id, actor_id, action, metadata)
  values (
    v_outcome.room_id,
    v_uid,
    'outcome.rejected',
    jsonb_build_object('outcome_id', p_outcome_id)
  );

  return v_outcome;
end;
$$;

revoke all on function public.reject_outcome(uuid) from public;
grant execute on function public.reject_outcome(uuid) to authenticated;
