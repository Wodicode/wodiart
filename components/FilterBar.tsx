"use client";

import { STATUS_LABELS, STATUS_ORDER, type ProjectStatus } from "@/lib/types";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ProjectStatus | "all";
  onStatusFilterChange: (value: ProjectStatus | "all") => void;
  onAddClick: () => void;
}

export function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddClick,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <FilterPill active={statusFilter === "all"} onClick={() => onStatusFilterChange("all")}>
          All
        </FilterPill>
        {STATUS_ORDER.map((status) => (
          <FilterPill
            key={status}
            active={statusFilter === status}
            onClick={() => onStatusFilterChange(status)}
          >
            {STATUS_LABELS[status]}
          </FilterPill>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name or sector..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input sm:w-64"
        />
        <button
          type="button"
          onClick={onAddClick}
          className="whitespace-nowrap rounded-md bg-cobalt px-4 py-2 text-sm font-medium text-offwhite transition-colors hover:bg-cobalt/90"
        >
          + Add Project
        </button>
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-offwhite text-charcoal" : "bg-offwhite/8 text-offwhite/60 hover:bg-offwhite/15"
      }`}
    >
      {children}
    </button>
  );
}
