
-- ============================================
-- TYPES
-- ============================================

create type public.assignment_visibility as enum ('public','restricted');
create type public.claim_status as enum ('accepted','in_progress','finished');

-- ============================================
-- TABLES
-- ============================================

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  username text,
  avatar_url text,
  role text check (role in ('user','admin')) default 'user',
  created_at timestamptz default now()
);

-- Assignments
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  deadline timestamptz not null,
  creator_id uuid not null references auth.users(id) on delete cascade,
  visibility public.assignment_visibility not null default 'public',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Allowed users for restricted assignments
create table if not exists public.assignment_allowed_users (
  assignment_id uuid not null unique references public.assignments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  added_at timestamptz default now(),
  primary key (assignment_id)
);

-- Assignment claims (accept/decline)
create table if not exists public.assignment_claims (
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.claim_status not null,
  created_at timestamptz default now(),
  primary key (assignment_id, user_id)
);

-- dm rooms
create table public.dm_rooms (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references auth.users(id) on delete cascade,
  user_b uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.dm_rooms(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index if not exists idx_assignments_created_at on public.assignments(created_at desc);
create index if not exists idx_assignments_creator on public.assignments(creator_id);
create index if not exists idx_claims_assignment on public.assignment_claims(assignment_id);
create unique index if not exists idx_profiles_username_unique on public.profiles(lower(username)) where username is not null;
create index if not exists idx_messages_room_created_at on public.messages(room_id, created_at desc);
create unique index idx_dm_rooms_unique_pair on public.dm_rooms (least(user_a, user_b), greatest(user_a, user_b));

-- Unique constraint: only one active claim per assignment
create unique index if not exists idx_assignment_claims_unique_active 
  on public.assignment_claims(assignment_id) 
  where status in ('accepted', 'in_progress', 'finished');

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.assignments enable row level security;
alter table public.assignment_allowed_users enable row level security;
alter table public.assignment_claims enable row level security;
alter table public.profiles enable row level security;
alter table public.dm_rooms enable row level security;
alter table public.messages enable row level security;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Allow profile creation during signup
create policy profiles_insert_signup on public.profiles
  for insert with check (true);

-- All authenticated users can read all profiles (display_name, username)
create policy profiles_select_all on public.profiles
  for select using (auth.role() = 'authenticated');

-- Users can update their own profile
create policy profiles_update_self on public.profiles
  for update using (auth.uid() = id);

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

-- Read: assigned user or assignment creator
create policy allowed_users_select_self_or_creator on public.assignment_allowed_users
  for select using (
    auth.uid() = assignment_allowed_users.user_id
    or public.is_assignment_creator(assignment_allowed_users.assignment_id)
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

-- Delete: only own claim
create policy claims_delete_self on public.assignment_claims
  for delete using (
    auth.uid() = user_id
    or exists (
      select 1 from public.assignments a
      where a.id = assignment_claims.assignment_id
        and a.creator_id = auth.uid()
    )
  );

-- Read: assignment creator sees all claims; user sees own claim
create policy claims_select_owner_or_self on public.assignment_claims
  for select using (
    auth.uid() = user_id or exists (
      select 1 from public.assignments a
      where a.id = assignment_claims.assignment_id
        and a.creator_id = auth.uid()
    )
  );

-- Read: anyone can see active claims on public assignments
create policy claims_select_active_public on public.assignment_claims
  for select using (
    status in ('accepted', 'in_progress', 'finished') 
    and exists (
      select 1 from public.assignments a
      where a.id = assignment_claims.assignment_id
        and a.visibility = 'public'
    )
  );

-- ============================================
-- MESSAGES POLICIES
-- ============================================

-- room: only participants can select
create policy dm_rooms_select_participant on public.dm_rooms
  for select using (auth.uid() = user_a or auth.uid() = user_b);

-- messages: only participants can select
create policy messages_select_participant on public.messages
  for select using (
    exists (
      select 1 from public.dm_rooms r
      where r.id = messages.room_id and (auth.uid() = r.user_a or auth.uid() = r.user_b)
    )
  );

-- insert: sender must be auth.uid() and a participant of the room
create policy messages_insert_participant
on public.messages
for insert
with check (
  auth.uid() = sender_id
  and exists (
    select 1
    from public.dm_rooms r
    where r.id = room_id
      and (auth.uid() = r.user_a or auth.uid() = r.user_b)
  )
);

-- Allow users to create DM rooms with other users
create policy dm_rooms_insert_users on public.dm_rooms
  for insert with check (auth.uid() = user_a or auth.uid() = user_b);

create policy messages_update_sender on public.messages for update using (auth.uid() = sender_id);
create policy messages_delete_sender on public.messages for delete using (auth.uid() = sender_id);

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Helper to check assignment creator without RLS recursion
create or replace function public.is_assignment_creator(p_assignment_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.assignments a
    where a.id = p_assignment_id
      and a.creator_id = auth.uid()
  );
$$;

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

-- Function to get user ID by username
create or replace function get_user_id_by_username(input_username text)
returns uuid as $$
begin
  return (
    select id
    from public.profiles
    where lower(username) = lower(input_username)
    limit 1
  );
end;
$$ language plpgsql security definer;

-- Function to get email by user ID
create or replace function public.get_user_email_by_id(user_id uuid)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  return (
    select email
    from auth.users
    where id = get_user_email_by_id.user_id
    limit 1
  );
end;
$$;

-- Function to get emails by array of user IDs
create or replace function get_user_emails_by_ids(user_ids uuid[])
returns table (
  id uuid,
  email text
)
language sql
security definer
set search_path = public
as $$
  select id, email
  from auth.users
  where id = any(user_ids);
$$;

-- Function to get profile labels by array of user IDs
create or replace function get_profiles_by_ids(user_ids uuid[])
returns table (
  id uuid,
  display_name text,
  username text
)
language sql
security definer
set search_path = public
as $$
  select p.id, p.display_name, p.username
  from public.profiles p
  where p.id = any(user_ids);
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Sync avatar_url from auth.users metadata when profile is created
create or replace function sync_avatar_url_on_profile_create()
returns trigger as $$
declare
  avatar_url text;
begin
  if new.avatar_url is null then
    select raw_user_meta_data->>'avatar_url'
    into avatar_url
    from auth.users
    where id = new.id;

    if avatar_url is not null then
      new.avatar_url := avatar_url;
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_profile_insert_sync_avatar
  before insert on public.profiles
  for each row
  execute function sync_avatar_url_on_profile_create();

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

create or replace trigger on_profile_display_name_update
  after update of display_name on public.profiles
  for each row
  when (old.display_name is distinct from new.display_name)
  execute function sync_display_name_to_auth();
