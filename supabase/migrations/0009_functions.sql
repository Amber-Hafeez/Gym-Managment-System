create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and lower(role) = 'admin'
  )
$$;

create or replace function public.set_member_plan_end_date()
returns trigger
language plpgsql
as $$
begin
  if new.end_date is null then
    select new.start_date + p.duration_days
      into new.end_date
      from public.plans p
     where p.id = new.plan_id;
  end if;
  return new;
end;
$$;

create or replace function public.delete_trainer(trainer_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  delete from profiles where id = trainer_id;
  delete from auth.users where id = trainer_id;
end;
$$;

create or replace function public.create_trainer(
  trainer_name text,
  trainer_email text,
  trainer_password text,
  trainer_phone text default null
)
returns uuid
language plpgsql
security definer
set search_path to 'public', 'extensions'
as $$
declare
  new_user_id uuid;
begin
  new_user_id := gen_random_uuid();

  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, aud, role
  )
  values (
    new_user_id, '00000000-0000-0000-0000-000000000000', trainer_email,
    crypt(trainer_password, gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{}', 'authenticated', 'authenticated'
  );

  insert into profiles (id, full_name, email, phone, role)
  values (new_user_id, trainer_name, trainer_email, trainer_phone, 'trainer');

  return new_user_id;
end;
$$;

create or replace function public.book_class(p_class_id uuid, p_member_id uuid)
returns text
language plpgsql
as $$
declare
  cap int;
  taken int;
  new_status text;
begin
  select capacity into cap from classes where id = p_class_id;

  select count(*) into taken
  from class_bookings
  where class_id = p_class_id
    and status = 'booked';

  if taken < cap then
    new_status := 'booked';
  else
    new_status := 'waitlisted';
  end if;

  insert into class_bookings (class_id, member_id, status)
  values (p_class_id, p_member_id, new_status);

  return new_status;
end;
$$;

create or replace function public.check_in_member(p_member_id uuid)
returns json
language plpgsql
as $$
declare
  v_end date;
begin
  select max(end_date) into v_end
  from public.member_plans
  where member_id = p_member_id;

  if v_end is null then
    raise exception 'NO_PLAN';
  end if;

  if v_end < current_date then
    raise exception 'PLAN_EXPIRED:%', v_end;
  end if;

  insert into public.attendance (member_id, check_in_date, checked_in_by)
  values (p_member_id, current_date, auth.uid());

  return json_build_object('ok', true);
exception
  when unique_violation then
    raise exception 'ALREADY_CHECKED_IN';
end;
$$;