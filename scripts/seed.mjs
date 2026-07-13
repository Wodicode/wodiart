// One-off seed script: upserts data/projects.json into the Supabase
// `projects` table. Uses the service role key (server-side only — never
// expose it to the browser) so it bypasses RLS.
//
// Usage:
//   1. Add SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL to .env.local
//   2. npm run seed

import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local before running the seed script."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const VALID_STATUSES = new Set(["draft", "caption_ready", "scheduled", "posted"]);

async function main() {
  const raw = await readFile(new URL("../data/projects.json", import.meta.url), "utf-8");
  const projects = JSON.parse(raw);

  if (!Array.isArray(projects)) {
    throw new Error("data/projects.json must contain a JSON array of project objects.");
  }

  const rows = projects.map((p, i) => {
    if (!p.name) throw new Error(`Project at index ${i} is missing "name".`);
    const status = p.status ?? "draft";
    if (!VALID_STATUSES.has(status)) {
      throw new Error(
        `Project "${p.name}" has invalid status "${status}". Must be one of: ${[...VALID_STATUSES].join(", ")}.`
      );
    }
    return {
      name: p.name,
      sector: p.sector ?? "",
      status,
      scheduled_date: p.scheduled_date ?? null,
      posted_date: p.posted_date ?? null,
      caption: p.caption ?? "",
      notes: p.notes ?? "",
    };
  });

  console.log(`Seeding ${rows.length} project(s)...`);

  const { data, error } = await supabase.from("projects").insert(rows).select("id, name");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Inserted ${data.length} project(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
