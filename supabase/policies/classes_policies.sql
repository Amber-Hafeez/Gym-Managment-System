-- Admins: full access (select, insert, update, delete)
create policy "Admins can manage all classes"
on classes
for all
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'Admin'
  )
)
with check (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'Admin'
  )
);

-- Trainers: can only SELECT classes assigned to them
create policy "Trainers can view their own classes"
on classes
for select
using (
  trainer_id = auth.uid()
);