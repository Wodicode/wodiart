# Wodiart Content Tracker

An internal project tracker for managing Instagram content across Wodiart's client
projects — status, captions, scheduling, and notes, synced across devices via Supabase.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS**
- **Supabase** (Postgres + realtime sync)
- Deployed on **Vercel**

## Features

- Pre-loaded project list (seeded from `data/projects.json`)
- Filter by status, search by name or sector
- Expand any row to edit all fields inline (autosaves on blur / change)
- "Seed caption" button fills the brand caption template
- "Mark as posted" sets today's date automatically
- Stats header (total / caption ready / scheduled / posted) and a posted-% progress bar
- Add new projects
- Live sync across tabs and devices via Supabase Realtime

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in your Supabase project and run the contents of
   [`supabase/schema.sql`](./supabase/schema.sql). This creates the `projects` table,
   an `updated_at` trigger, and RLS policies that let the app's anon key read/write.
3. Go to **Project Settings > API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (only needed locally, to run the
     seed script — never expose this in the browser or commit it)
4. Optional: in **Database > Replication**, confirm the `projects` table has realtime
   enabled (it is by default on new Supabase projects) so edits sync live across devices.

> The table uses simple anon-key RLS policies since this is an internal tool with no
> login screen. Don't share the deployed URL publicly. If you need real authentication
> later, swap the policies in `supabase/schema.sql` for ones scoped to `auth.uid()`.

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the three values from step 1.

## 3. Install and run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 4. Seed your project list

Replace the sample entries in [`data/projects.json`](./data/projects.json) with your
real client list (same shape: `name`, `sector`, `status`, `scheduled_date`,
`posted_date`, `caption`, `notes` — only `name` is required, everything else is
optional and defaults sensibly). `status` must be one of `draft`, `caption_ready`,
`scheduled`, `posted`.

Then, with `.env.local` populated (including `SUPABASE_SERVICE_ROLE_KEY`), run:

```bash
npm run seed
```

This inserts every row in `data/projects.json` into Supabase. Re-running it will insert
duplicates, so only run it once per batch of new projects (or clear the table first).

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), **Add New Project** → import the GitHub repo.
3. Framework preset: **Next.js** (auto-detected). No build command changes needed.
4. Add environment variables under **Project Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (`SUPABASE_SERVICE_ROLE_KEY` is not needed on Vercel — the seed script is a local-only tool)
5. Deploy. Every push to the connected branch redeploys automatically.

## Caption template

The "Seed caption" button fills this template, substituting the project's sector and
name (`[type]` and `[quality]` are left as placeholders to hand-edit per post, since
they aren't tracked fields):

```
There's a version of [sector] branding that ends up looking like every other [type] on your feed. We weren't interested in that.

[Client name] needed to feel [quality].

Start a project — link in bio
```

## Project structure

```
app/                Next.js App Router pages, layout, global styles
components/         UI components (stats, filters, table/row, add modal)
lib/                Supabase client, types, data hook, caption template
data/projects.json  Seed data (replace with your real client list)
scripts/seed.mjs    One-off script to load data/projects.json into Supabase
supabase/schema.sql Database schema + RLS policies
```
