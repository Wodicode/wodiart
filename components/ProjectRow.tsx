"use client";

import { useState } from "react";
import { buildSeedCaption } from "@/lib/captionTemplate";
import { STATUS_LABELS, STATUS_ORDER, type Project } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface ProjectRowProps {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (id: string, patch: Partial<Project>) => Promise<Project>;
  onDelete: (id: string) => Promise<void>;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(`${value}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ProjectRow({ project, expanded, onToggle, onUpdate, onDelete }: ProjectRowProps) {
  const [prevProject, setPrevProject] = useState(project);
  const [local, setLocal] = useState<Project>(project);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Resync local edit state when the project changes externally (our own
  // save round-trip, or a realtime update from another device). Done during
  // render, not in an effect, per https://react.dev/learn/you-might-not-need-an-effect
  if (project !== prevProject) {
    setPrevProject(project);
    setLocal(project);
  }

  async function save(patch: Partial<Project>) {
    setSaving(true);
    try {
      await onUpdate(project.id, patch);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1200);
    } finally {
      setSaving(false);
    }
  }

  function saveTextFieldIfChanged(field: "name" | "sector" | "caption" | "notes") {
    if (local[field] !== project[field]) {
      save({ [field]: local[field] } as Partial<Project>);
    }
  }

  function handleSeedCaption() {
    const seeded = buildSeedCaption({ name: local.name, sector: local.sector });
    setLocal((prev) => ({ ...prev, caption: seeded }));
    save({ caption: seeded });
  }

  function handleMarkPosted() {
    const patch = { status: "posted" as const, posted_date: todayISO() };
    setLocal((prev) => ({ ...prev, ...patch }));
    save(patch);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${project.name}"? This can't be undone.`)) return;
    await onDelete(project.id);
  }

  return (
    <div className="border-b border-offwhite/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-offwhite/[0.04] sm:grid-cols-[2fr_1.2fr_auto_auto_auto_auto]"
      >
        <div className="min-w-0">
          <div className="truncate font-medium text-offwhite">{project.name}</div>
          <div className="truncate text-xs text-offwhite/50 sm:hidden">{project.sector}</div>
        </div>
        <div className="hidden truncate text-sm text-offwhite/60 sm:block">{project.sector}</div>
        <div className="hidden sm:block">
          <StatusBadge status={project.status} />
        </div>
        <div className="hidden text-xs text-offwhite/50 sm:block">
          Sched. {formatDate(project.scheduled_date)}
        </div>
        <div className="hidden text-xs text-offwhite/50 sm:block">
          Posted {formatDate(project.posted_date)}
        </div>
        <div className="flex items-center gap-2 justify-self-end">
          <span className="sm:hidden">
            <StatusBadge status={project.status} />
          </span>
          <svg
            className={`h-4 w-4 shrink-0 text-offwhite/40 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-offwhite/10 bg-offwhite/[0.03] px-4 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project name">
              <input
                type="text"
                value={local.name}
                onChange={(e) => setLocal((prev) => ({ ...prev, name: e.target.value }))}
                onBlur={() => saveTextFieldIfChanged("name")}
                className="input"
              />
            </Field>
            <Field label="Sector">
              <input
                type="text"
                value={local.sector}
                onChange={(e) => setLocal((prev) => ({ ...prev, sector: e.target.value }))}
                onBlur={() => saveTextFieldIfChanged("sector")}
                className="input"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Status">
              <select
                value={local.status}
                onChange={(e) => {
                  const status = e.target.value as Project["status"];
                  setLocal((prev) => ({ ...prev, status }));
                  save({ status });
                }}
                className="input"
              >
                {STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Scheduled date">
              <input
                type="date"
                value={local.scheduled_date ?? ""}
                onChange={(e) => {
                  const scheduled_date = e.target.value || null;
                  setLocal((prev) => ({ ...prev, scheduled_date }));
                  save({ scheduled_date });
                }}
                className="input"
              />
            </Field>
            <Field label="Posted date">
              <input
                type="date"
                value={local.posted_date ?? ""}
                onChange={(e) => {
                  const posted_date = e.target.value || null;
                  setLocal((prev) => ({ ...prev, posted_date }));
                  save({ posted_date });
                }}
                className="input"
              />
            </Field>
          </div>

          <Field
            label="Caption"
            action={
              <button
                type="button"
                onClick={handleSeedCaption}
                className="text-xs font-medium text-cobaltLight hover:underline"
              >
                Seed caption
              </button>
            }
          >
            <textarea
              value={local.caption}
              onChange={(e) => setLocal((prev) => ({ ...prev, caption: e.target.value }))}
              onBlur={() => saveTextFieldIfChanged("caption")}
              rows={5}
              className="input font-normal leading-relaxed"
            />
          </Field>

          <Field label="Notes">
            <textarea
              value={local.notes}
              onChange={(e) => setLocal((prev) => ({ ...prev, notes: e.target.value }))}
              onBlur={() => saveTextFieldIfChanged("notes")}
              rows={2}
              className="input"
            />
          </Field>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMarkPosted}
                disabled={local.status === "posted"}
                className="rounded-md bg-green px-4 py-2 text-sm font-medium text-offwhite transition-colors hover:bg-green/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Mark as posted
              </button>
              <span className="text-xs text-offwhite/40">
                {saving ? "Saving..." : savedFlash ? "Saved" : ""}
              </span>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs font-medium text-offwhite/40 hover:text-red-400"
            >
              Delete project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-offwhite/50">{label}</span>
        {action}
      </span>
      {children}
    </label>
  );
}
