"use client";

import {
  listCachedSourceSummaries,
  removeCachedSourceData,
  replaceCachedSourceData,
} from "@/lib/content-sources/cache";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type {
  CachedSourceSummary,
  ContentSource,
  ImportedElement,
  ImportedSourceFile,
  SourceSyncRun,
} from "@/lib/content-sources/types";

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

export async function listDeviceCachedSources(): Promise<CachedSourceSummary[]> {
  try {
    return await listCachedSourceSummaries();
  } catch {
    return [];
  }
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

  const normalizedIndexUrl = input.indexUrl.trim();

  const { supabase, userId } = auth;
  const { error } = await supabase.from("content_sources").insert({
    user_id: userId,
    name: input.name,
    index_url: normalizedIndexUrl,
    source_kind: "aurora-index",
    enabled: true,
    sync_status: "idle",
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false as const, error: "That source URL is already in your library." };
    }

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

  if (!error) {
    await removeCachedSourceData(id);
  }

  return !error;
}

async function listRemoteImportedSourceFiles(sourceId: string) {
  const auth = await getAuthedSupabase();

  if (!auth) {
    return [] as ImportedSourceFile[];
  }

  const { supabase } = auth;
  const { data, error } = await supabase
    .from("imported_source_files")
    .select("*")
    .eq("source_id", sourceId)
    .order("file_url", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as ImportedSourceFile[];
}

async function listRemoteImportedElements(sourceId: string) {
  const auth = await getAuthedSupabase();

  if (!auth) {
    return [] as ImportedElement[];
  }

  const { supabase } = auth;
  const pageSize = 1000;
  let from = 0;
  const rows: ImportedElement[] = [];

  while (true) {
    const { data, error } = await supabase
      .from("imported_elements")
      .select("*")
      .eq("source_id", sourceId)
      .order("element_id", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error || !data?.length) {
      break;
    }

    rows.push(...(data as ImportedElement[]));

    if (data.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return rows;
}

export async function hydrateSourceCacheFromRemote(source: ContentSource) {
  const [files, elements] = await Promise.all([
    listRemoteImportedSourceFiles(source.id),
    listRemoteImportedElements(source.id),
  ]);

  await replaceCachedSourceData({
    source,
    files,
    elements,
  });

  return {
    fileCount: files.length,
    elementCount: elements.length,
  };
}

export async function queueContentSourceSync(source: ContentSource) {
  const auth = await getAuthedSupabase();

  if (!auth) {
    return { ok: false as const, error: "You must be signed in to sync sources." };
  }

  if (!source.enabled) {
    return { ok: false as const, error: "Enable the source before syncing it." };
  }

  if (source.sync_status === "queued" || source.sync_status === "syncing") {
    return { ok: false as const, error: "That source is already syncing." };
  }

  const response = await fetch(`/api/content-sources/${source.id}/sync`, {
    method: "POST",
  });

  const payload = (await response.json()) as
    | {
        ok: true;
        discoveredFileCount: number;
        parsedFileCount: number;
        upsertedElementCount: number;
        warningCount?: number;
        warningSummary?: string | null;
      }
    | { error: string };

  if (!response.ok || !("ok" in payload)) {
    return { ok: false as const, error: "error" in payload ? payload.error : "Sync failed." };
  }

  let cacheResult = {
    fileCount: 0,
    elementCount: 0,
  };

  try {
    cacheResult = await hydrateSourceCacheFromRemote(source);
  } catch {
    cacheResult = {
      fileCount: 0,
      elementCount: 0,
    };
  }

  return {
    ...payload,
    cachedFileCount: cacheResult.fileCount,
    cachedElementCount: cacheResult.elementCount,
  };
}
