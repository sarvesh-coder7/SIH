-- JH Innovation Connect: Supabase-only Auth + Challenge persistence
-- Applied to the project during this migration. Keep this file for reproducibility.

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
  elsif r in ('university_admin','student') then
    insert into public.university_profiles(user_id,institution_name,short_name,category,district,address,official_email,website,aishe_code,accreditation_grade,academic_disciplines,departments,research_areas,labs_and_facilities,incubation_centre_name,authorized_contact_person,authorized_contact_designation,authorized_contact_phone)
    values(new.id,coalesce(m->>'institution_name',org,'University'),nullif(m->>'short_name',''),coalesce(nullif(m->>'category',''),'Private University'),district,coalesce(nullif(m->>'address',''),'Jharkhand, India'),new.email,coalesce(nullif(m->>'website',''),'https://example.com'),nullif(m->>'aishe_code',''),nullif(m->>'accreditation_grade',''),coalesce(array(select jsonb_array_elements_text(coalesce(m->'academic_disciplines','[]'::jsonb))),'{}'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'departments','[]'::jsonb))),'{}'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'research_areas','[]'::jsonb))),'{}'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'labs_and_facilities','[]'::jsonb))),'{}'),nullif(m->>'incubation_centre_name',''),full_name,desig,phone)
    on conflict(user_id) do update set institution_name=excluded.institution_name,short_name=excluded.short_name,category=excluded.category,district=excluded.district,address=excluded.address,official_email=excluded.official_email,website=excluded.website,aishe_code=excluded.aishe_code,accreditation_grade=excluded.accreditation_grade,academic_disciplines=excluded.academic_disciplines,departments=excluded.departments,research_areas=excluded.research_areas,labs_and_facilities=excluded.labs_and_facilities,incubation_centre_name=excluded.incubation_centre_name,authorized_contact_person=excluded.authorized_contact_person,authorized_contact_designation=excluded.authorized_contact_designation,authorized_contact_phone=excluded.authorized_contact_phone,updated_at=now();
  elsif r in ('csr_org','industry_msme','research_institute') then
    insert into public.industry_profiles(user_id,organization_name,organization_type,official_email,contact_person,contact_designation,contact_phone,district,domain,expertise_areas,max_grant_per_project,csr_focus_sectors,technology_capabilities,mentoring_capabilities,testing_and_deployment_capabilities)
    values(new.id,coalesce(nullif(m->>'organization',''),full_name),coalesce(nullif(m->>'org_type',''),'Large Enterprise / Corporate'),new.email,full_name,desig,phone,district,coalesce(nullif(m->>'domain',''),'Innovation'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'expertise_areas','[]'::jsonb))),'{}'),nullif(m->>'max_grant_per_project',''),coalesce(array(select jsonb_array_elements_text(coalesce(m->'csr_focus_sectors','[]'::jsonb))),'{}'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'technology_capabilities','[]'::jsonb))),'{}'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'mentoring_capabilities','[]'::jsonb))),'{}'),coalesce(array(select jsonb_array_elements_text(coalesce(m->'testing_and_deployment_capabilities','[]'::jsonb))),'{}'))
    on conflict(user_id) do update set organization_name=excluded.organization_name,organization_type=excluded.organization_type,official_email=excluded.official_email,contact_person=excluded.contact_person,contact_designation=excluded.contact_designation,contact_phone=excluded.contact_phone,district=excluded.district,domain=excluded.domain,expertise_areas=excluded.expertise_areas,max_grant_per_project=excluded.max_grant_per_project,csr_focus_sectors=excluded.csr_focus_sectors,technology_capabilities=excluded.technology_capabilities,mentoring_capabilities=excluded.mentoring_capabilities,testing_and_deployment_capabilities=excluded.testing_and_deployment_capabilities,updated_at=now();
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_auth_user();

create or replace function public.handle_auth_user_email_change()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  update public.profiles set email=new.email,is_email_verified=(new.email_confirmed_at is not null),updated_at=now() where id=new.id;
  return new;
end; $$;

drop trigger if exists on_auth_user_updated_profile on auth.users;
create trigger on_auth_user_updated_profile after update of email,email_confirmed_at on auth.users for each row execute function public.handle_auth_user_email_change();

create policy "Users can insert own university profile" on public.university_profiles for insert to authenticated with check (auth.uid()=user_id);
create policy "Users can update own university profile" on public.university_profiles for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Users can insert own industry profile" on public.industry_profiles for insert to authenticated with check (auth.uid()=user_id);
create policy "Users can update own industry profile" on public.industry_profiles for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Authenticated users can select challenges" on public.challenges for select to authenticated using (true);
create policy "Owners and government can update challenges" on public.challenges for update to authenticated using (auth.uid()=submitted_by or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('govt_department','platform_admin'))) with check (auth.uid()=submitted_by or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('govt_department','platform_admin')));
create policy "Authenticated users can insert challenge tags" on public.challenge_tags for insert to authenticated with check (true);
create policy "Authenticated users can select challenge tags" on public.challenge_tags for select to authenticated using (true);
create policy "Authenticated users can insert challenge timeline" on public.challenge_timeline for insert to authenticated with check (true);
create policy "Authenticated users can select challenge timeline" on public.challenge_timeline for select to authenticated using (true);
create policy "Authenticated users can insert ai classifications" on public.ai_classifications for insert to authenticated with check (true);
create policy "Authenticated users can select ai classifications" on public.ai_classifications for select to authenticated using (true);

insert into storage.buckets(id,name,public) values('challenge-evidence','challenge-evidence',true) on conflict(id) do update set public=true;
create policy "Authenticated upload challenge evidence" on storage.objects for insert to authenticated with check(bucket_id='challenge-evidence');
create policy "Public read challenge evidence" on storage.objects for select to public using(bucket_id='challenge-evidence');
