import { NextResponse, type NextRequest } from "next/server";

import {
  discoverAuroraFileUrls,
  fetchAuroraXmlFile,
  parseAuroraElements,
} from "@/lib/content-sources/aurora";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: source, error: sourceError } = await supabase
    .from("content_sources")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (sourceError || !source) {
    return NextResponse.json({ error: "Source not found" }, { status: 404 });
  }

  if (!source.enabled) {
    return NextResponse.json({ error: "Enable this source before syncing it." }, { status: 400 });
  }

  if (!source.index_url.endsWith(".index")) {
    return NextResponse.json(
      { error: "Only Aurora-compatible .index sources can be synced." },
      { status: 400 },
    );
  }

  if (source.sync_status === "queued" || source.sync_status === "syncing") {
    return NextResponse.json(
      { error: "This source already has an active sync." },
      { status: 409 },
    );
  }

  const startedAt = new Date().toISOString();
  const { data: syncRun, error: runInsertError } = await supabase
    .from("source_sync_runs")
    .insert({
      user_id: user.id,
      source_id: source.id,
      status: "syncing",
      started_at: startedAt,
    })
    .select("id")
    .single();

  if (runInsertError || !syncRun) {
    return NextResponse.json({ error: "Could not start sync run" }, { status: 500 });
  }

  await supabase
    .from("content_sources")
    .update({
      sync_status: "syncing",
      last_sync_error: null,
      updated_at: startedAt,
    })
    .eq("id", source.id);

  try {
    const fileUrls = await discoverAuroraFileUrls(source.index_url);
    let parsedFileCount = 0;
    let upsertedElementCount = 0;

    for (const fileUrl of fileUrls) {
      const { xml, etag, contentHash } = await fetchAuroraXmlFile(fileUrl);

      await supabase.from("imported_source_files").upsert(
        {
          user_id: user.id,
          source_id: source.id,
          file_url: fileUrl,
          etag,
          content_hash: contentHash,
          last_seen_at: new Date().toISOString(),
          last_parsed_at: new Date().toISOString(),
        },
        { onConflict: "source_id,file_url" },
      );

      const elements = parseAuroraElements(fileUrl, xml);

      if (elements.length) {
        const rows = elements.map((element) => ({
          user_id: user.id,
          source_id: source.id,
          element_id: element.elementId,
          element_type: element.elementType,
          name: element.name,
          source_name: element.sourceName,
          source_url: element.sourceUrl,
          supports: element.supports,
          setters: element.setters,
          rules: element.rules,
          description_html: element.descriptionHtml,
          description_text: element.descriptionText,
          multiclass: element.multiclass,
          spellcasting: element.spellcasting,
          raw_element: element.rawElement,
          updated_at: new Date().toISOString(),
        }));

        const { error: elementError } = await supabase
          .from("imported_elements")
          .upsert(rows, { onConflict: "user_id,source_id,element_id" });

        if (elementError) {
          throw new Error(elementError.message);
        }

        upsertedElementCount += rows.length;
      }

      parsedFileCount += 1;
    }

    const finishedAt = new Date().toISOString();

    await supabase
      .from("source_sync_runs")
      .update({
        status: "completed",
        discovered_file_count: fileUrls.length,
        parsed_file_count: parsedFileCount,
        upserted_element_count: upsertedElementCount,
        finished_at: finishedAt,
      })
      .eq("id", syncRun.id);

    await supabase
      .from("content_sources")
      .update({
        sync_status: "idle",
        last_synced_at: finishedAt,
        last_sync_error: null,
        updated_at: finishedAt,
      })
      .eq("id", source.id);

    return NextResponse.json({
      ok: true,
      discoveredFileCount: fileUrls.length,
      parsedFileCount,
      upsertedElementCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync error";
    const finishedAt = new Date().toISOString();

    await supabase
      .from("source_sync_runs")
      .update({
        status: "error",
        finished_at: finishedAt,
        error_text: message,
      })
      .eq("id", syncRun.id);

    await supabase
      .from("content_sources")
      .update({
        sync_status: "error",
        last_sync_error: message,
        updated_at: finishedAt,
      })
      .eq("id", source.id);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
