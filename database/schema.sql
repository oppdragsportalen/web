
-- ============================================
-- TYPES
-- ============================================

create type public.assignment_visibility as enum ('public','restricted');
create type public.claim_status as enum ('accepted','declined');

-- ============================================
-- TABLES
-- ============================================

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text check (role in ('user','admin')) default 'user',
  created_at timestamptz default now()
);

-- Assignments
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  deadline date not null,
  creator_id uuid not null references auth.users(id) on delete cascade,
  visibility public.assignment_visibility not null default 'public',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Allowed users for restricted assignments
create table if not exists public.assignment_allowed_users (
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  added_at timestamptz default now(),
  primary key (assignment_id, user_id)
);

-- Assignment claims (accept/decline)
create table if not exists public.assignment_claims (
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.claim_status not null,
  created_at timestamptz default now(),
  primary key (assignment_id, user_id)
);

-- ============================================
-- INDEXES
-- ============================================

create index if not exists idx_assignments_created_at on public.assignments(created_at desc);
create index if not exists idx_assignments_creator on public.assignments(creator_id);
create index if not exists idx_claims_assignment on public.assignment_claims(assignment_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.assignments enable row level security;
alter table public.assignment_allowed_users enable row level security;
alter table public.assignment_claims enable row level security;
alter table public.profiles enable row level security;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can read and update their own profile
create policy profiles_select_self on public.profiles
  for select using (auth.uid() = id);

create policy profiles_update_self on public.profiles
  for update using (auth.uid() = id);

create policy profiles_insert_self on public.profiles
  for insert with check (auth.uid() = id);

-- ============================================
-- ASSIGNMENTS POLICIES
-- ============================================

-- Read: public assignments, own assignments, or where user is allowed
create policy assignments_select_accessible on public.assignments
  for select using (
    visibility = 'public'
    or creator_id = auth.uid()
    or exists (
      select 1 from public.assignment_allowed_users au
      where au.assignment_id = assignments.id
        and au.user_id = auth.uid()
    )
  );

-- Insert: only authenticated users can create
create policy assignments_insert_creator on public.assignments
  for insert with check (auth.uid() = creator_id);

-- Update: only assignment creator
create policy assignments_update_owner on public.assignments
  for update using (creator_id = auth.uid());

-- Delete: only assignment creator
create policy assignments_delete_owner on public.assignments
  for delete using (creator_id = auth.uid());

-- ============================================
-- ALLOWED USERS POLICIES
-- ============================================

-- Read: assignment creator or the user themselves
create policy allowed_users_select_owner_or_self on public.assignment_allowed_users
  for select using (
    auth.uid() in (
      select creator_id from public.assignments where id = assignment_allowed_users.assignment_id
    )
    or auth.uid() = assignment_allowed_users.user_id
  );

-- Insert: only assignment creator
create policy allowed_users_insert_owner on public.assignment_allowed_users
  for insert with check (
    auth.uid() in (
      select creator_id from public.assignments where id = assignment_allowed_users.assignment_id
    )
  );

-- Delete: only assignment creator
create policy allowed_users_delete_owner on public.assignment_allowed_users
  for delete using (
    exists (
      select 1 from public.assignments a
      where a.id = assignment_allowed_users.assignment_id
        and a.creator_id = auth.uid()
    )
  );

-- ============================================
-- CLAIMS POLICIES
-- ============================================

-- Accept/decline: only if assignment is public or user is allowed
create policy claims_insert_allowed on public.assignment_claims
  for insert with check (
    auth.uid() = user_id and (
      exists (
        select 1 from public.assignments a
        where a.id = assignment_claims.assignment_id
          and a.visibility = 'public'
      )
      or exists (
        select 1 from public.assignment_allowed_users au
        where au.assignment_id = assignment_claims.assignment_id
          and au.user_id = auth.uid()
      )
    )
  );

-- Update: only own claim
create policy claims_update_self on public.assignment_claims
  for update using (auth.uid() = user_id);

-- Read: assignment creator sees all claims; user sees own claim
create policy claims_select_owner_or_self on public.assignment_claims
  for select using (
    auth.uid() = user_id or exists (
      select 1 from public.assignments a
      where a.id = assignment_claims.assignment_id
        and a.creator_id = auth.uid()
    )
  );

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to get user ID by email
create or replace function get_user_id_by_email(email text)
returns uuid as $$
begin
  return (
    select id
    from auth.users
    where lower(auth.users.email) = lower(get_user_id_by_email.email)
    limit 1
  );
end;
$$ language plpgsql security definer;

-- ============================================
-- TRIGGERS
-- ============================================

-- Sync display_name from profiles to auth.users metadata
create or replace function sync_display_name_to_auth()
returns trigger as $$
begin
  update auth.users
  set raw_user_meta_data = jsonb_set(
    coalesce(raw_user_meta_data, '{}'::jsonb),
    '{display_name}',
    to_jsonb(new.display_name)
  )
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_display_name_update
  after update of display_name on public.profiles
  for each row
  when (old.display_name is distinct from new.display_name)
  execute function sync_display_name_to_auth();
