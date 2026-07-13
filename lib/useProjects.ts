"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "./supabaseClient";
import type { NewProject, Project } from "./types";

const NOT_CONFIGURED_MESSAGE =
  "Supabase isn't configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see README).";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(
    isSupabaseConfigured ? null : NOT_CONFIGURED_MESSAGE
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;

    async function load() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: true });

        if (!active) return;
        if (error) {
          setError(error.message);
        } else {
          setProjects((data ?? []) as Project[]);
          setError(null);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to reach Supabase.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    // Keep every open tab/device in sync as rows change anywhere.
    const channel = supabase
      .channel("projects-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        (payload) => {
          setProjects((current) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as Project;
              return current.some((p) => p.id === row.id) ? current : [...current, row];
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as Project;
              return current.map((p) => (p.id === row.id ? row : p));
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as Partial<Project>;
              return current.filter((p) => p.id !== row.id);
            }
            return current;
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const addProject = useCallback(async (project: NewProject) => {
    if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED_MESSAGE);
    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: project.name,
        sector: project.sector ?? "",
        status: project.status ?? "draft",
        scheduled_date: project.scheduled_date ?? null,
        posted_date: project.posted_date ?? null,
        caption: project.caption ?? "",
        notes: project.notes ?? "",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    const row = data as Project;
    setProjects((current) => (current.some((p) => p.id === row.id) ? current : [...current, row]));
    return row;
  }, []);

  const updateProject = useCallback(async (id: string, patch: Partial<Project>) => {
    if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED_MESSAGE);
    const { data, error } = await supabase
      .from("projects")
      .update(patch)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const row = data as Project;
    setProjects((current) => current.map((p) => (p.id === id ? row : p)));
    return row;
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED_MESSAGE);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
    setProjects((current) => current.filter((p) => p.id !== id));
  }, []);

  return { projects, loading, error, addProject, updateProject, deleteProject };
}
