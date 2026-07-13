import { STATUS_LABELS, type ProjectStatus } from "@/lib/types";

export const STATUS_STYLES: Record<ProjectStatus, string> = {
  draft: "bg-charcoal/10 text-charcoal/70",
  caption_ready: "bg-cobalt/10 text-cobalt",
  scheduled: "bg-amber/10 text-amber",
  posted: "bg-green/10 text-green",
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
