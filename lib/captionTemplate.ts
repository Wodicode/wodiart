import type { Project } from "./types";

/**
 * Seeds the caption template with known project data (sector, name) and
 * leaves [type] / [quality] as literal placeholders — those aren't tracked
 * fields, so they're meant to be hand-edited per post after seeding.
 */
export function buildSeedCaption(project: Pick<Project, "name" | "sector">): string {
  const sector = project.sector?.trim() || "[sector]";
  const name = project.name?.trim() || "[Client name]";

  return `There's a version of ${sector} branding that ends up looking like every other [type] on your feed. We weren't interested in that.\n\n${name} needed to feel [quality].\n\nStart a project — link in bio`;
}
