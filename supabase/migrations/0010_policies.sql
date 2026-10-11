-- attendance
create policy "staff view attendance" on attendance for select
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = any (array['admin','trainer'])));

create policy "staff insert attendance" on attendance for insert
with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = any (array['admin','trainer'])));

create policy "admin delete attendance" on attendance for delete
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- class_bookings
create policy "bookings_all_authenticated" on class_bookings for all to authenticated
using (true) with check (true);

-- classes
create policy "classes_all_authenticated" on classes for all to authenticated
using (true) with check (true);

create policy "Trainer reads own classes" on classes for select
using (trainer_id = auth.uid());

create policy "Admins can manage all classes" on classes for all
using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'Admin'))
with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'Admin'));

-- member_plans
create policy "member_plans authenticated access" on member_plans for all
using (true) with check (true);

-- members
create policy "members select" on members for select using (true);
create policy "members insert" on members for insert with check (true);
create policy "members update" on members for update using (true);
create policy "members delete" on members for delete using (true);

-- payments
create policy "Admin can view payments" on payments for select
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admin can insert payments" on payments for insert
with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admin can update payments" on payments for update
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- plans
create policy "Public can read plans" on plans for select using (true);

create policy "plans authenticated access" on plans for all
using (true) with check (true);

create policy "Admins can update plans" on plans for update
using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- profiles
create policy "Admin can read all profiles" on profiles for select using (is_admin());

create policy "Users can read own profile" on profiles for select using (auth.uid() = id);

create policy "Users can insert own trainer profile" on profiles for insert
with check (auth.uid() = id and lower(role) = 'trainer' and status = 'pending');

create policy "Admin can update profiles" on profiles for update
using (is_admin()) with check (is_admin());