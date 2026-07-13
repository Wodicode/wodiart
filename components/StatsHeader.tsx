import type { Project } from "@/lib/types";

export function StatsHeader({ projects }: { projects: Project[] }) {
  const total = projects.length;
  const posted = projects.filter((p) => p.status === "posted").length;
  const scheduled = projects.filter((p) => p.status === "scheduled").length;
  const captionReady = projects.filter((p) => p.status === "caption_ready").length;

  const stats = [
    { label: "Total Projects", value: total, color: "text-charcoal" },
    { label: "Caption Ready", value: captionReady, color: "text-cobalt" },
    { label: "Scheduled", value: scheduled, color: "text-amber" },
    { label: "Posted", value: posted, color: "text-green" },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-charcoal/10 bg-charcoal/10 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-offwhite px-5 py-4">
          <div className={`text-3xl font-semibold tabular-nums ${stat.color}`}>{stat.value}</div>
          <div className="mt-1 text-xs uppercase tracking-wider text-charcoal/60">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
