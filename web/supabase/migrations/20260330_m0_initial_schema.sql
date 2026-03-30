-- M0.3 minimal persistence schema.
-- Assumptions:
-- 1. auth.users remains the source of truth for application users.
-- 2. user_id is populated from auth.uid() by the application layer.
-- 3. RLS is enforced strictly by user_id ownership; there is no admin bypass here.
-- 4. Anonymous drafts remain local-only in M0 and do not get persisted.
-- Deferred on purpose:
-- - import/parser tables
-- - built-in SRD storage
-- - account/profile tables
-- - any normalized builder or rules-engine projections

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.content_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  index_url text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.characters enable row level security;
alter table public.content_sources enable row level security;

create policy "characters_select_own"
on public.characters
for select
using (auth.uid() = user_id);

create policy "characters_insert_own"
on public.characters
for insert
with check (auth.uid() = user_id);

create policy "characters_update_own"
on public.characters
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "characters_delete_own"
on public.characters
for delete
using (auth.uid() = user_id);

create policy "content_sources_select_own"
on public.content_sources
for select
using (auth.uid() = user_id);

create policy "content_sources_insert_own"
on public.content_sources
for insert
with check (auth.uid() = user_id);

create policy "content_sources_update_own"
on public.content_sources
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "content_sources_delete_own"
on public.content_sources
for delete
using (auth.uid() = user_id);
