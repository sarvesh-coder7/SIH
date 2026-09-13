-- =========================================================================
-- JH INNOVATION CONNECT / SIH 2026
-- Supabase Migration: Role-Aware RLS, Table Grants, and Storage Configuration
-- =========================================================================

-- 1. SCHEMA GRANTS
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to authenticated;
grant select on public.challenges to anon, authenticated;
grant select on public.challenge_media to anon, authenticated;
grant select on public.challenge_timeline to anon, authenticated;
grant select on public.challenge_tags to anon, authenticated;
grant select on public.ai_classifications to anon, authenticated;
grant all on all sequences in schema public to authenticated;

-- 2. CHALLENGES TABLE RLS
alter table public.challenges enable row level security;

drop policy if exists "Public and authenticated can view challenges" on public.challenges;
create policy "Public and authenticated can view challenges"
on public.challenges for select
using (
  true
);

drop policy if exists "Citizens can insert challenges" on public.challenges;
create policy "Citizens can insert challenges"
on public.challenges for insert
to authenticated
with check (
  auth.uid() = submitted_by or auth.uid() is not null
);

drop policy if exists "Owners and stakeholders can update challenges" on public.challenges;
create policy "Owners and stakeholders can update challenges"
on public.challenges for update
to authenticated
using (
  auth.uid() = submitted_by
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role in ('govt_department', 'platform_admin', 'university_admin', 'faculty_mentor', 'industry_msme', 'csr_org')
  )
)
with check (
  auth.uid() = submitted_by
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role in ('govt_department', 'platform_admin', 'university_admin', 'faculty_mentor', 'industry_msme', 'csr_org')
  )
);

-- 3. CHALLENGE MEDIA TABLE RLS
alter table public.challenge_media enable row level security;

drop policy if exists "Public and authenticated can view challenge media" on public.challenge_media;
create policy "Public and authenticated can view challenge media"
on public.challenge_media for select
using (true);

drop policy if exists "Authenticated users can upload challenge media" on public.challenge_media;
create policy "Authenticated users can upload challenge media"
on public.challenge_media for insert
to authenticated
with check (true);

-- 4. CHALLENGE TIMELINE TABLE RLS
alter table public.challenge_timeline enable row level security;

drop policy if exists "Public and authenticated can view challenge timeline" on public.challenge_timeline;
create policy "Public and authenticated can view challenge timeline"
on public.challenge_timeline for select
using (true);

drop policy if exists "Authenticated users can insert challenge timeline" on public.challenge_timeline;
create policy "Authenticated users can insert challenge timeline"
on public.challenge_timeline for insert
to authenticated
with check (true);

-- 5. NOTIFICATIONS TABLE RLS
alter table public.notifications enable row level security;

drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications"
on public.notifications for select
to authenticated
using (
  auth.uid()::text = user_id::text or auth.uid() is not null
);

drop policy if exists "Users can insert notifications" on public.notifications;
create policy "Users can insert notifications"
on public.notifications for insert
to authenticated
with check (true);

drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications"
on public.notifications for update
to authenticated
using (
  auth.uid()::text = user_id::text or auth.uid() is not null
);

-- 6. CONVERSATIONS & MESSAGES RLS
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Authenticated users can view conversations" on public.conversations;
create policy "Authenticated users can view conversations"
on public.conversations for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert or update conversations" on public.conversations;
create policy "Authenticated users can insert or update conversations"
on public.conversations for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can view messages" on public.messages;
create policy "Authenticated users can view messages"
on public.messages for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert messages" on public.messages;
create policy "Authenticated users can insert messages"
on public.messages for insert
to authenticated
with check (true);

-- 7. STORAGE BUCKETS CONFIGURATION
insert into storage.buckets (id, name, public)
values ('challenge-evidence', 'challenge-evidence', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read challenge-evidence" on storage.objects;
create policy "Public read challenge-evidence"
on storage.objects for select
using (bucket_id in ('challenge-evidence', 'media'));

drop policy if exists "Authenticated upload challenge-evidence" on storage.objects;
create policy "Authenticated upload challenge-evidence"
on storage.objects for insert
to authenticated
with check (bucket_id in ('challenge-evidence', 'media'));

drop policy if exists "Authenticated update challenge-evidence" on storage.objects;
create policy "Authenticated update challenge-evidence"
on storage.objects for update
to authenticated
using (bucket_id in ('challenge-evidence', 'media'));
