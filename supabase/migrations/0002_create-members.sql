create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  join_date date default current_date,
  photo_url text,
  created_at timestamp without time zone default now(),
  email text,
  plan text default 'Monthly',
  status text default 'Active'
);

alter table public.members enable row level security;