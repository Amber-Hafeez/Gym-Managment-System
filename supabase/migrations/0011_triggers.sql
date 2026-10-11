create trigger trg_member_plan_end_date
before insert on public.member_plans
for each row execute function set_member_plan_end_date();

create trigger trg_promote_on_delete
after delete on public.class_bookings
for each row
when (old.status = 'booked')
execute function promote_waitlist();

create trigger trg_promote_on_cancel
after update of status on public.class_bookings
for each row
when (old.status = 'booked' and new.status is distinct from 'booked')
execute function promote_waitlist();