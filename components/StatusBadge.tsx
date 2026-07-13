import { STATUS_LABELS, type ProjectStatus } from "@/lib/types";

export const STATUS_STYLES: Record<ProjectStatus, string> = {
  draft: "bg-offwhite/12 text-offwhite/70",
  caption_ready: "bg-cobalt text-offwhite",
  scheduled: "bg-amber text-offwhite",
  posted: "bg-green text-offwhite",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
