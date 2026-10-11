alter table public.member_plans
  add constraint member_plans_dates_check check (end_date >= start_date),
  add constraint member_plans_status_check check (status in ('Active', 'Expired', 'Cancelled'));

alter table public.plans
  add constraint plans_duration_days_check check (duration_days > 0),
  add constraint plans_name_key unique (name),
  add constraint plans_price_check check (price >= 0);

alter table public.classes
  add constraint classes_capacity_check check (capacity > 0),
  add constraint classes_day_of_week_check check (
    day_of_week in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
  );

alter table public.class_bookings
  add constraint class_bookings_class_id_member_id_key unique (class_id, member_id),
  add constraint class_bookings_status_check check (status in ('booked', 'waitlisted'));

alter table public.profiles
  add constraint profiles_role_check check (role in ('admin', 'trainer'));

alter table public.attendance
  add constraint attendance_member_id_check_in_date_key unique (member_id, check_in_date);

alter table public.payments
  add constraint payments_amount_check check (amount > 0),
  add constraint payments_method_check check (method in ('Cash', 'Card')),
  add constraint payments_type_check check (type in ('payment', 'renewal'));