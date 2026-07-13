"use client";

import { useState } from "react";
import { STATUS_LABELS, STATUS_ORDER, type NewProject, type ProjectStatus } from "@/lib/types";

interface AddProjectModalProps {
  onClose: () => void;
  onAdd: (project: NewProject) => Promise<unknown>;
}

export function AddProjectModal({ onClose, onAdd }: AddProjectModalProps) {
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onAdd({ name: name.trim(), sector: sector.trim(), status });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add project.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-offwhite/10 bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-sora text-lg font-bold text-offwhite">Add project</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-offwhite/50">
              Project name
            </span>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="e.g. Amber & Oak Coffee Roasters"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-offwhite/50">
              Sector
            </span>
            <input
              type="text"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="input"
              placeholder="e.g. specialty coffee"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-offwhite/50">
              Status
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="input"
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-offwhite/60 hover:bg-offwhite/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-cobalt px-4 py-2 text-sm font-medium text-offwhite transition-colors hover:bg-cobalt/90 disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
