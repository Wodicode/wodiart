"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { ProjectRow } from "./ProjectRow";

interface ProjectTableProps {
  projects: Project[];
  onUpdate: (id: string, patch: Partial<Project>) => Promise<Project>;
  onDelete: (id: string) => Promise<void>;
}

export function ProjectTable({ projects, onUpdate, onDelete }: ProjectTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-charcoal/20 px-6 py-16 text-center text-sm text-charcoal/50">
        No projects match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-charcoal/10 bg-offwhite">
      <div className="hidden grid-cols-[2fr_1.2fr_auto_auto_auto_auto] gap-3 border-b border-charcoal/10 bg-charcoal/[0.03] px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-charcoal/40 sm:grid">
        <span>Project</span>
        <span>Sector</span>
        <span>Status</span>
        <span>Scheduled</span>
        <span>Posted</span>
        <span />
      </div>
      {projects.map((project) => (
        <ProjectRow
          key={project.id}
          project={project}
          expanded={expandedId === project.id}
          onToggle={() => setExpandedId((current) => (current === project.id ? null : project.id))}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
