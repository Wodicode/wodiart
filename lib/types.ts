export type ProjectStatus = "draft" | "caption_ready" | "scheduled" | "posted";

export interface Project {
  id: string;
  name: string;
  sector: string;
  status: ProjectStatus;
  scheduled_date: string | null;
  posted_date: string | null;
  caption: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type NewProject = Pick<Project, "name" | "sector"> &
  Partial<Pick<Project, "status" | "scheduled_date" | "posted_date" | "caption" | "notes">>;

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: "Draft",
  caption_ready: "Caption Ready",
  scheduled: "Scheduled",
  posted: "Posted",
};

export const STATUS_ORDER: ProjectStatus[] = [
  "draft",
  "caption_ready",
  "scheduled",
  "posted",
];
