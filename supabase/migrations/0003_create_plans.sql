create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_days integer not null,
  price numeric not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  features text[] default '{}',
  image_url text
);

create table if not exists public.member_plans (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  start_date date not null default current_date,
  end_date date not null,
  status text not null default 'Active',
  created_at timestamptz not null default now()
);

alter table public.plans enable row level security;
alter table public.member_plans enable row level security;