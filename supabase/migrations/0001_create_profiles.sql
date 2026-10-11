create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'trainer',
  full_name text,
  email text,
  phone text,
  specialization text,
  experience_years integer,
  status text default 'approved'
);

alter table public.profiles enable row level security;