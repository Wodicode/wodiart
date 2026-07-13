import type { Project } from "@/lib/types";

export function StatsHeader({ projects }: { projects: Project[] }) {
  const total = projects.length;
  const posted = projects.filter((p) => p.status === "posted").length;
  const scheduled = projects.filter((p) => p.status === "scheduled").length;
  const captionReady = projects.filter((p) => p.status === "caption_ready").length;

  const stats = [
    { label: "Total Projects", value: total, color: "text-offwhite" },
    { label: "Caption Ready", value: captionReady, color: "text-cobaltLight" },
    { label: "Scheduled", value: scheduled, color: "text-amber" },
    { label: "Posted", value: posted, color: "text-greenLight" },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-offwhite/10 bg-offwhite/10 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-surface px-5 py-4">
          <div className={`text-3xl font-bold tabular-nums ${stat.color}`}>{stat.value}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.15em] text-offwhite/50">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
