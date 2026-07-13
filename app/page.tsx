"use client";

import { useMemo, useState } from "react";
import { AddProjectModal } from "@/components/AddProjectModal";
import { FilterBar } from "@/components/FilterBar";
import { ProgressBar } from "@/components/ProgressBar";
import { ProjectTable } from "@/components/ProjectTable";
import { StatsHeader } from "@/components/StatsHeader";
import { useProjects } from "@/lib/useProjects";
import type { ProjectStatus } from "@/lib/types";

export default function Home() {
  const { projects, loading, error, addProject, updateProject, deleteProject } = useProjects();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesSearch =
        query === "" ||
        p.name.toLowerCase().includes(query) ||
        p.sector.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [projects, search, statusFilter]);

  const postedCount = projects.filter((p) => p.status === "posted").length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-cobalt">Wodiart</p>
        <h1 className="mt-1 text-3xl font-semibold text-charcoal sm:text-4xl">Content Tracker</h1>
        <p className="mt-1.5 text-sm text-charcoal/60">
          Instagram content status across all client projects.
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-8 space-y-6">
        <StatsHeader projects={projects} />
        <ProgressBar posted={postedCount} total={projects.length} />
      </div>

      <div className="mb-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onAddClick={() => setShowAddModal(true)}
        />
      </div>

      {loading ? (
        <div className="rounded-lg border border-charcoal/10 px-6 py-16 text-center text-sm text-charcoal/50">
          Loading projects...
        </div>
      ) : (
        <ProjectTable projects={filteredProjects} onUpdate={updateProject} onDelete={deleteProject} />
      )}

      {showAddModal && (
        <AddProjectModal onClose={() => setShowAddModal(false)} onAdd={addProject} />
      )}
    </main>
  );
}
