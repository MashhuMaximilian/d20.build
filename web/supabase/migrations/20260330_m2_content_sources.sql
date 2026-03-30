alter table public.content_sources
  add column if not exists source_kind text not null default 'aurora-index',
  add column if not exists sync_status text not null default 'idle',
  add column if not exists last_synced_at timestamptz null,
  add column if not exists last_sync_error text null;

create unique index if not exists content_sources_user_index_url_key
  on public.content_sources (user_id, index_url);

create table if not exists public.imported_source_files (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.content_sources (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  file_url text not null,
  etag text null,
  content_hash text null,
  last_seen_at timestamptz not null default timezone('utc', now()),
  last_parsed_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists imported_source_files_source_file_key
  on public.imported_source_files (source_id, file_url);

create table if not exists public.imported_elements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_id uuid not null references public.content_sources (id) on delete cascade,
  element_id text not null,
  element_type text not null,
  name text not null,
  source_name text null,
  source_url text not null,
  supports jsonb not null default '[]'::jsonb,
  setters jsonb not null default '[]'::jsonb,
  rules jsonb not null default '[]'::jsonb,
  description_html text null,
  description_text text null,
  multiclass jsonb null,
  spellcasting jsonb null,
  raw_element jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists imported_elements_user_source_element_key
  on public.imported_elements (user_id, source_id, element_id);

create table if not exists public.source_sync_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_id uuid not null references public.content_sources (id) on delete cascade,
  status text not null,
  discovered_file_count integer not null default 0,
  parsed_file_count integer not null default 0,
  upserted_element_count integer not null default 0,
  started_at timestamptz not null default timezone('utc', now()),
  finished_at timestamptz null,
  error_text text null
);

alter table public.imported_source_files enable row level security;
alter table public.imported_elements enable row level security;
alter table public.source_sync_runs enable row level security;

create policy "imported_source_files_select_own"
on public.imported_source_files
for select
using (auth.uid() = user_id);

create policy "imported_source_files_insert_own"
on public.imported_source_files
for insert
with check (auth.uid() = user_id);

create policy "imported_source_files_update_own"
on public.imported_source_files
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "imported_source_files_delete_own"
on public.imported_source_files
for delete
using (auth.uid() = user_id);

create policy "imported_elements_select_own"
on public.imported_elements
for select
using (auth.uid() = user_id);

create policy "imported_elements_insert_own"
on public.imported_elements
for insert
with check (auth.uid() = user_id);

create policy "imported_elements_update_own"
on public.imported_elements
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "imported_elements_delete_own"
on public.imported_elements
for delete
using (auth.uid() = user_id);

create policy "source_sync_runs_select_own"
on public.source_sync_runs
for select
using (auth.uid() = user_id);

create policy "source_sync_runs_insert_own"
on public.source_sync_runs
for insert
with check (auth.uid() = user_id);

create policy "source_sync_runs_update_own"
on public.source_sync_runs
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "source_sync_runs_delete_own"
on public.source_sync_runs
for delete
using (auth.uid() = user_id);
