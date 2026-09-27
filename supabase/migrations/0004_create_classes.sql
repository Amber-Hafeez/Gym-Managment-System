-- Classes table
create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trainer_id uuid not null references profiles(id) on delete restrict,
  day_of_week text not null check (
    day_of_week in ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')
  ),
  start_time time not null,
  end_time time not null,
  capacity integer not null check (capacity > 0),
  created_at timestamptz not null default now()
);

-- Helpful index for trainer's "My Classes" view
create index if not exists idx_classes_trainer_id on classes(trainer_id);

-- Enable RLS
alter table classes enable row level security;