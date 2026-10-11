create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  member_plan_id uuid,
  plan_id uuid,
  amount numeric not null,
  method text not null,
  payment_date date not null default current_date,
  type text not null default 'payment',
  notes text,
  received_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;