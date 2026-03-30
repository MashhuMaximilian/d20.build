"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ContentSource, SourceSyncRun } from "@/lib/content-sources/types";

async function getAuthedSupabase() {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    supabase,
    userId: user.id,
  };
}

export async function listContentSources(): Promise<ContentSource[]> {
  const auth = await getAuthedSupabase();

  if (!auth) {
    return [];
  }

  const { supabase } = auth;
  const { data, error } = await supabase
    .from("content_sources")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as ContentSource[];
}

export async function listSourceSyncRuns(): Promise<SourceSyncRun[]> {
  const auth = await getAuthedSupabase();

  if (!auth) {
    return [];
  }

  const { supabase } = auth;
  const { data, error } = await supabase
    .from("source_sync_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(10);

  if (error || !data) {
    return [];
  }

  return data as SourceSyncRun[];
}

export async function createContentSource(input: {
  name: string;
  indexUrl: string;
}) {
  const auth = await getAuthedSupabase();

  if (!auth) {
    return { ok: false as const, error: "You must be signed in to add a source." };
  }

  const { supabase, userId } = auth;
  const { error } = await supabase.from("content_sources").insert({
    user_id: userId,
    name: input.name,
    index_url: input.indexUrl,
    source_kind: "aurora-index",
    enabled: true,
    sync_status: "idle",
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const };
}

export async function toggleContentSource(id: string, enabled: boolean) {
  const auth = await getAuthedSupabase();

  if (!auth) {
    return false;
  }

  const { supabase } = auth;
  const { error } = await supabase
    .from("content_sources")
    .update({
      enabled,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  return !error;
}

export async function deleteContentSource(id: string) {
  const auth = await getAuthedSupabase();

  if (!auth) {
    return false;
  }

  const { supabase } = auth;
  const { error } = await supabase.from("content_sources").delete().eq("id", id);

  return !error;
}

export async function queueContentSourceSync(source: ContentSource) {
  const auth = await getAuthedSupabase();

  if (!auth) {
    return { ok: false as const, error: "You must be signed in to sync sources." };
  }

  const { supabase, userId } = auth;
  const now = new Date().toISOString();

  const { error: sourceError } = await supabase
    .from("content_sources")
    .update({
      sync_status: "queued",
      last_sync_error: null,
      updated_at: now,
    })
    .eq("id", source.id);

  if (sourceError) {
    return { ok: false as const, error: sourceError.message };
  }

  const { error: runError } = await supabase.from("source_sync_runs").insert({
    user_id: userId,
    source_id: source.id,
    status: "queued",
    started_at: now,
  });

  if (runError) {
    return { ok: false as const, error: runError.message };
  }

  return { ok: true as const };
}
