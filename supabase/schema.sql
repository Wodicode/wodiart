-- Wodiart Content Tracker — Supabase schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'caption_ready', 'scheduled', 'posted')),
  scheduled_date date,
  posted_date date,
  caption text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every row change.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row
  execute function set_updated_at();

create index if not exists projects_status_idx on projects (status);
create index if not exists projects_name_idx on projects (lower(name));
create index if not exists projects_sector_idx on projects (lower(sector));

-- Row Level Security
alter table projects enable row level security;

-- This is an internal single-tenant tool with no login screen: the anon
-- key (used by the browser) is granted full read/write access to the
-- projects table. Do not put anything sensitive in this table, and don't
-- publish the app URL publicly. If you need real per-user auth later,
-- replace these policies with ones scoped to auth.uid().
drop policy if exists "projects_select_anon" on projects;
create policy "projects_select_anon" on projects
  for select to anon using (true);

drop policy if exists "projects_insert_anon" on projects;
create policy "projects_insert_anon" on projects
  for insert to anon with check (true);

drop policy if exists "projects_update_anon" on projects;
create policy "projects_update_anon" on projects
  for update to anon using (true) with check (true);

drop policy if exists "projects_delete_anon" on projects;
create policy "projects_delete_anon" on projects
  for delete to anon using (true);
