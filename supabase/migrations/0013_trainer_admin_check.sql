create or replace function public.delete_trainer(trainer_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if not public.is_admin() then
    raise exception 'Not allowed';
  end if;

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
  if not public.is_admin() then
    raise exception 'Not allowed';
  end if;

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