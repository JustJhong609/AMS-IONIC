-- Supabase schema for AMS-IONIC
-- Paste this whole file into the Supabase SQL Editor.

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Generic updated_at trigger helper
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- Profiles: one row per Supabase auth user
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    ),
    new.email
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
drop policy if exists "Profiles are updatable by owner" on public.profiles;

create policy "Profiles are readable by owner"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ------------------------------------------------------------
-- Learners: ALS learner records
-- ------------------------------------------------------------
create table if not exists public.learners (
  id text primary key,
  created_by uuid not null default auth.uid() references public.profiles(id) on delete cascade,

  region text not null,
  division text not null,
  district text not null,
  calendar_year integer not null check (calendar_year between 2000 and 2100),
  mapped_by text not null,

  last_name text not null,
  first_name text not null,
  middle_name text not null,
  name_extension text,
  sex text not null check (sex in ('Male', 'Female')),
  civil_status text not null check (civil_status in ('Single', 'Married', 'Widow/er', 'Separated', 'Live-in')),
  birthdate date not null,
  age integer not null check (age >= 0),
  mother_tongue text not null,
  is_ip boolean not null default false,
  ip_tribe text,
  religion text,
  is_4ps_member boolean not null default false,
  four_ps_or_ip text,
  is_pwd boolean not null default false,
  pwd_type text,
  pwd_type_other text,

  barangay text not null,
  complete_address text not null,

  role_in_family text not null,
  father_name text,
  mother_name text,
  guardian_name text,
  guardian_occupation text,

  school_name text,
  currently_studying text not null,
  last_grade_completed text not null,
  reason_for_not_attending text not null,
  reason_for_not_attending_other text,

  is_blp boolean not null default false,
  occupation_type text,
  employment_status text,
  monthly_income text,
  interested_in_als text not null,
  contact_number text,

  distance_km numeric(6,2) not null check (distance_km >= 0),
  travel_time text not null,
  transport_mode text not null,
  preferred_session_time text not null,
  date_mapped date not null default current_date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint learners_currently_studying_check
    check (currently_studying in ('Yes', 'No')),
  constraint learners_interested_in_als_check
    check (interested_in_als in ('Yes', 'No')),
  constraint learners_occupation_type_check
    check (occupation_type is null or occupation_type in ('Government', 'Private', 'Self-employed', 'None')),
  constraint learners_employment_status_check
    check (employment_status is null or employment_status in ('Regular', 'Contractual', 'Casual', 'JO')),
  constraint learners_role_in_family_check
    check (
      role_in_family in (
        'Head', 'Spouse', 'Daughter/Son', 'Stepson/Stepdaughter',
        'Son-in-law/Daughter-in-law', 'Grandson/Granddaughter',
        'Father/Mother', 'Brother/Sister', 'Uncle/Aunt',
        'Nephew/Niece', 'Houseboy/Housegirl', 'Others (Non-relative/Boarder)'
      )
    ),
  constraint learners_transport_mode_check
    check (transport_mode in ('Walking', 'Tricycle', 'Habal-habal', 'Jeepney', 'Multicab', 'Private Vehicle', 'Bicycle')),
  constraint learners_preferred_session_time_check
    check (preferred_session_time in ('Morning (8:00 AM – 12:00 PM)', 'Afternoon (1:00 PM – 5:00 PM)', 'Evening (6:00 PM – 9:00 PM)', 'Weekends Only')),
  constraint learners_four_ps_or_ip_check
    check (four_ps_or_ip is null or four_ps_or_ip in ('4P''s', 'IP')),
  constraint learners_ip_tribe_required_check
    check (is_ip = false or ip_tribe is not null),
  constraint learners_pwd_type_required_check
    check (is_pwd = false or pwd_type is not null)
);

create index if not exists learners_created_by_idx on public.learners (created_by);
create index if not exists learners_name_idx on public.learners (last_name, first_name, middle_name);
create index if not exists learners_barangay_idx on public.learners (barangay);
create index if not exists learners_date_mapped_idx on public.learners (date_mapped desc);

drop trigger if exists set_learners_updated_at on public.learners;
create trigger set_learners_updated_at
  before update on public.learners
  for each row execute function public.set_updated_at();

alter table public.learners enable row level security;

drop policy if exists "Learners are readable by owner" on public.learners;
drop policy if exists "Learners are readable by authenticated users" on public.learners;
drop policy if exists "Learners are insertable by owner" on public.learners;
drop policy if exists "Learners are updatable by owner" on public.learners;
drop policy if exists "Learners are deletable by owner" on public.learners;

create policy "Learners are readable by authenticated users"
  on public.learners
  for select
  using (auth.uid() is not null);

create policy "Learners are insertable by owner"
  on public.learners
  for insert
  with check (auth.uid() = created_by);

create policy "Learners are updatable by owner"
  on public.learners
  for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "Learners are deletable by owner"
  on public.learners
  for delete
  using (auth.uid() = created_by);

do $$
begin
  alter publication supabase_realtime add table public.learners;
exception
  when duplicate_object then null;
end
$$;

-- Optional convenience view for quick dashboard counts
create or replace view public.learner_summary as
select
  created_by,
  count(*)::int as total_learners,
  count(*) filter (where sex = 'Male')::int as male_learners,
  count(*) filter (where sex = 'Female')::int as female_learners,
  count(*) filter (where is_blp)::int as blp_learners,
  count(*) filter (where is_ip)::int as ip_learners,
  count(*) filter (where is_pwd)::int as pwd_learners,
  max(date_mapped) as latest_mapping_date
from public.learners
group by created_by;
