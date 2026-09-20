-- =========================================================================
-- JH INNOVATION CONNECT / SIH 2026 - MASTER SUPABASE SCHEMA
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- =========================================================================

-- 1. EXTENSIONS
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- 2. PUBLIC TABLES

-- Profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  phone text,
  role text default 'citizen',
  organization text,
  district text default 'Ranchi',
  designation text,
  verified boolean default true,
  is_email_verified boolean default false,
  joined_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Citizen Profiles
create table if not exists public.citizen_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  district text,
  block text,
  village text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- University Profiles
create table if not exists public.university_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  institution_name text not null,
  short_name text,
  category text default 'Private University',
  district text,
  address text,
  official_email text,
  website text,
  aishe_code text,
  accreditation_grade text,
  academic_disciplines text[] default '{}',
  departments text[] default '{}',
  research_areas text[] default '{}',
  labs_and_facilities text[] default '{}',
  incubation_centre_name text,
  authorized_contact_person text,
  authorized_contact_designation text,
  authorized_contact_phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Industry Profiles
create table if not exists public.industry_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  organization_name text not null,
  organization_type text default 'Large Enterprise / Corporate',
  official_email text,
  contact_person text,
  contact_designation text,
  contact_phone text,
  district text,
  domain text default 'Innovation',
  expertise_areas text[] default '{}',
  max_grant_per_project text,
  csr_focus_sectors text[] default '{}',
  technology_capabilities text[] default '{}',
  mentoring_capabilities text[] default '{}',
  testing_and_deployment_capabilities text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Challenges
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  tracking_id text unique,
  title text not null,
  description text not null,
  problem_summary text,
  category text not null,
  sub_category text,
  district text not null,
  block text,
  village text,
  latitude numeric,
  longitude numeric,
  submitted_by uuid references auth.users(id) on delete set null,
  submitter_name text,
  submitter_role text,
  submitter_phone text,
  submitter_organization text,
  affected_population integer default 1,
  frequency text default 'Daily',
  urgency text default 'Medium',
  expected_impact text,
  additional_information text,
  submitted_at timestamptz default now(),
  status text default 'Submitted',
  current_stage text default 'Challenge Submitted',
  assigned_university_id text,
  endorsements_count integer default 1,
  views_count integer default 1,
  trust_status text default 'Evidence Submitted',
  latest_update text,
  is_reopened boolean default false,
  reopened_reason text,
  open_for_solutions boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Challenge Media
create table if not exists public.challenge_media (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.challenges(id) on delete cascade,
  media_type text,
  public_url text,
  storage_path text,
  caption text,
  latitude numeric,
  longitude numeric,
  geotag_location text,
  accuracy numeric,
  is_geotagged boolean default false,
  metadata_available boolean default false,
  source text,
  file_name text,
  file_size text,
  created_at timestamptz default now()
);

-- Challenge Tags
create table if not exists public.challenge_tags (
  id serial primary key,
  challenge_id uuid references public.challenges(id) on delete cascade,
  tag text not null,
  created_at timestamptz default now()
);

-- Challenge Timeline
create table if not exists public.challenge_timeline (
  id serial primary key,
  challenge_id uuid references public.challenges(id) on delete cascade,
  stage text not null,
  description text,
  actor_user_id uuid,
  actor_name text,
  date timestamptz default now(),
  created_at timestamptz default now()
);

-- AI Classifications
create table if not exists public.ai_classifications (
  id serial primary key,
  challenge_id uuid references public.challenges(id) on delete cascade,
  category text,
  sub_category text,
  priority text,
  priority_score numeric,
  reasoning text,
  similar_challenges_count integer default 0,
  similar_challenge_ids text[] default '{}',
  recommended_disciplines text[] default '{}',
  potential_impact_assessment text,
  estimated_budget_range text,
  confidence_score numeric,
  created_at timestamptz default now()
);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  message text not null,
  type text default 'info',
  read boolean default false,
  is_read boolean default false,
  target_id text,
  link text,
  created_at timestamptz default now()
);

-- Conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  participant_ids text[] default '{}',
  subject text,
  challenge_id text,
  project_id text,
  last_message text,
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id text not null,
  sender_name text,
  sender_role text,
  content text not null,
  attachments jsonb default '[]'::jsonb,
  read_by text[] default '{}',
  created_at timestamptz default now()
);

-- 3. AUTOMATIC AUTH TRIGGER (Creates profile when user registers via Supabase Auth)
create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path=public as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  r text := coalesce(m->>'role', 'citizen');
  full_name text := coalesce(m->>'full_name', m->>'first_name', 'User');
  phone text := coalesce(m->>'phone', '');
  district text := coalesce(m->>'district', 'Ranchi');
  org text := coalesce(m->>'organization', '');
  desig text := coalesce(m->>'designation', '');
begin
  insert into public.profiles (id,name,email,phone,role,organization,district,designation,verified,is_email_verified,joined_date)
  values (new.id,full_name,new.email,phone,r,nullif(org,''),district,nullif(desig,''),true,new.email_confirmed_at is not null,coalesce(new.created_at,now()))
  on conflict (id) do update set name=excluded.name,email=excluded.email,phone=excluded.phone,role=excluded.role,
    organization=excluded.organization,district=excluded.district,designation=excluded.designation,
    is_email_verified=excluded.is_email_verified,updated_at=now();

  if r='citizen' then
    insert into public.citizen_profiles(user_id,full_name,email,phone,district,block,village)
    values(new.id,full_name,new.email,phone,district,nullif(m->>'block',''),nullif(m->>'village',''))
    on conflict(user_id) do update set full_name=excluded.full_name,email=excluded.email,phone=excluded.phone,
      district=excluded.district,block=excluded.block,village=excluded.village,updated_at=now();
  elsif r in ('university_admin','student','faculty_mentor') then
    insert into public.university_profiles(user_id,institution_name,short_name,category,district,address,official_email,website,aishe_code,accreditation_grade,academic_disciplines,departments,research_areas,labs_and_facilities,incubation_centre_name,authorized_contact_person,authorized_contact_designation,authorized_contact_phone)
    values(new.id,coalesce(m->>'institution_name',org,'University'),nullif(m->>'short_name',''),coalesce(nullif(m->>'category',''),'Private University'),district,coalesce(nullif(m->>'address',''),'Jharkhand, India'),new.email,coalesce(nullif(m->>'website',''),'https://example.com'),nullif(m->>'aishe_code',''),nullif(m->>'accreditation_grade',''),coalesce(array(select jsonb_array_elements_text(coalesce(m->'academic_disciplines','[]'::jsonb))),'{}'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'departments','[]'::jsonb))),'{}'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'research_areas','[]'::jsonb))),'{}'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'labs_and_facilities','[]'::jsonb))),'{}'),nullif(m->>'incubation_centre_name',''),full_name,desig,phone)
    on conflict(user_id) do update set institution_name=excluded.institution_name,updated_at=now();
  elsif r in ('csr_org','industry_msme','research_institute') then
    insert into public.industry_profiles(user_id,organization_name,organization_type,official_email,contact_person,contact_designation,contact_phone,district,domain,expertise_areas,max_grant_per_project,csr_focus_sectors,technology_capabilities,mentoring_capabilities,testing_and_deployment_capabilities)
    values(new.id,coalesce(nullif(m->>'organization',''),full_name),coalesce(nullif(m->>'org_type',''),'Large Enterprise / Corporate'),new.email,full_name,desig,phone,district,coalesce(nullif(m->>'domain',''),'Innovation'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'expertise_areas','[]'::jsonb))),'{}'),nullif(m->>'max_grant_per_project',''),coalesce(array(select jsonb_array_elements_text(coalesce(m->'csr_focus_sectors','[]'::jsonb))),'{}'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'technology_capabilities','[]'::jsonb))),'{}'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'mentoring_capabilities','[]'::jsonb))),'{}'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'testing_and_deployment_capabilities','[]'::jsonb))),'{}'))
    on conflict(user_id) do update set organization_name=excluded.organization_name,updated_at=now();
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_auth_user();

-- 4. PERMISSIONS & GRANTS
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.citizen_profiles enable row level security;
alter table public.university_profiles enable row level security;
alter table public.industry_profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_media enable row level security;
alter table public.challenge_tags enable row level security;
alter table public.challenge_timeline enable row level security;
alter table public.ai_classifications enable row level security;
alter table public.notifications enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Profiles policies
drop policy if exists "Public read profiles" on public.profiles;
create policy "Public read profiles" on public.profiles for select using (true);
drop policy if exists "Authenticated update own profile" on public.profiles;
create policy "Authenticated update own profile" on public.profiles for update to authenticated using (auth.uid() = id);
drop policy if exists "Authenticated insert own profile" on public.profiles;
create policy "Authenticated insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- Sub-profiles policies
drop policy if exists "Public read citizen profiles" on public.citizen_profiles;
create policy "Public read citizen profiles" on public.citizen_profiles for select using (true);
drop policy if exists "Public read university profiles" on public.university_profiles;
create policy "Public read university profiles" on public.university_profiles for select using (true);
drop policy if exists "Public read industry profiles" on public.industry_profiles;
create policy "Public read industry profiles" on public.industry_profiles for select using (true);

-- Challenges policies
drop policy if exists "Public and authenticated can view challenges" on public.challenges;
create policy "Public and authenticated can view challenges" on public.challenges for select using (true);
drop policy if exists "Anyone can insert challenges" on public.challenges;
create policy "Anyone can insert challenges" on public.challenges for insert with check (true);
drop policy if exists "Owners and stakeholders can update challenges" on public.challenges;
create policy "Owners and stakeholders can update challenges" on public.challenges for update using (true);

-- Child tables policies
drop policy if exists "Public read challenge media" on public.challenge_media;
create policy "Public read challenge media" on public.challenge_media for select using (true);
drop policy if exists "Insert challenge media" on public.challenge_media;
create policy "Insert challenge media" on public.challenge_media for insert with check (true);

drop policy if exists "Public read challenge tags" on public.challenge_tags;
create policy "Public read challenge tags" on public.challenge_tags for select using (true);
drop policy if exists "Insert challenge tags" on public.challenge_tags;
create policy "Insert challenge tags" on public.challenge_tags for insert with check (true);

drop policy if exists "Public read challenge timeline" on public.challenge_timeline;
create policy "Public read challenge timeline" on public.challenge_timeline for select using (true);
drop policy if exists "Insert challenge timeline" on public.challenge_timeline;
create policy "Insert challenge timeline" on public.challenge_timeline for insert with check (true);

drop policy if exists "Public read ai classifications" on public.ai_classifications;
create policy "Public read ai classifications" on public.ai_classifications for select using (true);
drop policy if exists "Insert ai classifications" on public.ai_classifications;
create policy "Insert ai classifications" on public.ai_classifications for insert with check (true);

-- Notifications policies
drop policy if exists "Read notifications" on public.notifications;
create policy "Read notifications" on public.notifications for select using (true);
drop policy if exists "Insert notifications" on public.notifications;
create policy "Insert notifications" on public.notifications for insert with check (true);
drop policy if exists "Update notifications" on public.notifications;
create policy "Update notifications" on public.notifications for update using (true);

-- Conversations & Messages policies
drop policy if exists "All access conversations" on public.conversations;
create policy "All access conversations" on public.conversations for all using (true) with check (true);
drop policy if exists "All access messages" on public.messages;
create policy "All access messages" on public.messages for all using (true) with check (true);

-- 6. STORAGE BUCKETS
insert into storage.buckets (id, name, public)
values ('challenge-evidence', 'challenge-evidence', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read challenge-evidence" on storage.objects;
create policy "Public read challenge-evidence" on storage.objects for select using (bucket_id in ('challenge-evidence', 'media'));

drop policy if exists "Upload challenge-evidence" on storage.objects;
create policy "Upload challenge-evidence" on storage.objects for insert with check (bucket_id in ('challenge-evidence', 'media'));

drop policy if exists "Update challenge-evidence" on storage.objects;
create policy "Update challenge-evidence" on storage.objects for update using (bucket_id in ('challenge-evidence', 'media'));
