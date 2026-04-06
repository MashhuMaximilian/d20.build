"use client";

import { useEffect, useState } from "react";

import {
  createContentSource,
  deleteContentSource,
  hydrateSourceCacheFromRemote,
  listDeviceCachedSources,
  listContentSources,
  listSourceSyncRuns,
  queueContentSourceSync,
  toggleContentSource,
} from "@/lib/content-sources/repository";
import { listCachedElements } from "@/lib/content-sources/cache";
import {
  SUGGESTED_SOURCE_INDEXES,
  type CachedSourceSummary,
  type ContentSource,
  type SourceSyncRun,
} from "@/lib/content-sources/types";

type ContentSourcesSettingsProps = {
  isAuthenticated: boolean;
};

type SourceTypeCounts = Record<string, Record<string, number>>;

const DIAGNOSTIC_TYPES = ["Class", "Archetype", "Race", "Sub Race"] as const;

function formatTypeCounts(counts: Record<string, number> | undefined) {
  if (!counts) {
    return "";
  }

  return DIAGNOSTIC_TYPES.map((type) => {
    const label =
      type === "Class"
        ? "Classes"
        : type === "Archetype"
          ? "Subclasses"
          : type === "Sub Race"
            ? "Subraces"
            : `${type}s`;
    return `${label}: ${counts[type] ?? 0}`;
  }).join(" · ");
}

export function ContentSourcesSettings({
  isAuthenticated,
}: ContentSourcesSettingsProps) {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [cachedSources, setCachedSources] = useState<Record<string, CachedSourceSummary>>({});
  const [cachedTypeCounts, setCachedTypeCounts] = useState<SourceTypeCounts>({});
  const [syncRuns, setSyncRuns] = useState<SourceSyncRun[]>([]);
  const [name, setName] = useState("");
  const [indexUrl, setIndexUrl] = useState("");
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState<"error" | "success">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncingSourceIds, setSyncingSourceIds] = useState<string[]>([]);
  const [cachingSourceIds, setCachingSourceIds] = useState<string[]>([]);

  function isIndexUrl(value: string) {
    try {
      const url = new URL(value.trim());
      return url.pathname.endsWith(".index");
    } catch {
      return false;
    }
  }

  async function refresh() {
    const [nextSources, nextRuns, localCache, cachedElements] = await Promise.all([
      listContentSources(),
      listSourceSyncRuns(),
      listDeviceCachedSources(),
      listCachedElements().catch(() => []),
    ]);
    setSources(nextSources);
    setSyncRuns(nextRuns);
    setCachedSources(
      Object.fromEntries(localCache.map((entry) => [entry.sourceId, entry])),
    );
    setCachedTypeCounts(
      cachedElements.reduce<SourceTypeCounts>((accumulator, element) => {
        const sourceId = "sourceId" in element ? String(element.sourceId) : "";
        if (!sourceId) {
          return accumulator;
        }

        const type = "element_type" in element ? String(element.element_type) : "";
        if (!type) {
          return accumulator;
        }

        accumulator[sourceId] ??= {};
        accumulator[sourceId][type] = (accumulator[sourceId][type] ?? 0) + 1;
        return accumulator;
      }, {}),
    );
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void refresh();
  }, [isAuthenticated]);

  async function handleAddSource(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    setStatusTone("success");

    if (!isIndexUrl(indexUrl)) {
      setIsSubmitting(false);
      setStatusTone("error");
      setStatus("Content sources must point to an Aurora-compatible .index URL.");
      return;
    }

    const result = await createContentSource({
      name: name.trim() || "Aurora Source",
      indexUrl: indexUrl.trim(),
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setStatusTone("error");
      setStatus(result.error);
      return;
    }

    setName("");
    setIndexUrl("");
    setStatusTone("success");
    setStatus("Source added.");
    await refresh();
  }

  async function handleQueueSync(source: ContentSource) {
    if (!source.enabled) {
      setStatusTone("error");
      setStatus(`Enable ${source.name} before syncing it.`);
      return;
    }

    if (source.sync_status === "queued" || source.sync_status === "syncing") {
      setStatusTone("error");
      setStatus(`${source.name} already has an active sync.`);
      return;
    }

    setStatus("");
    setStatusTone("success");
    setSyncingSourceIds((current) =>
      current.includes(source.id) ? current : [...current, source.id],
    );
    const result = await queueContentSourceSync(source);
    setSyncingSourceIds((current) => current.filter((entry) => entry !== source.id));

    if (!result.ok) {
      if ("status" in result && result.status === 409) {
        await refresh();
      }
      setStatusTone("error");
      setStatus(result.error);
      return;
    }

    setStatus(
      result.warningCount
        ? `Synced ${source.name} with warnings: ${result.discoveredFileCount} files discovered, ${result.parsedFileCount} parsed, ${result.upsertedElementCount} elements imported, ${result.cachedElementCount} cached on this device. ${result.warningSummary ?? ""}`.trim()
        : `Synced ${source.name}: ${result.discoveredFileCount} files discovered, ${result.parsedFileCount} parsed, ${result.upsertedElementCount} elements imported, ${result.cachedElementCount} cached on this device.`,
    );
    await refresh();
  }

  async function handleCacheOnDevice(source: ContentSource) {
    setStatus("");
    setStatusTone("success");
    setCachingSourceIds((current) =>
      current.includes(source.id) ? current : [...current, source.id],
    );

    try {
      const result = await hydrateSourceCacheFromRemote(source);
      setStatus(
        `Cached ${source.name} on this device: ${result.fileCount} files and ${result.elementCount} elements.`,
      );
      await refresh();
    } catch (error) {
      setStatusTone("error");
      setStatus(error instanceof Error ? error.message : "Could not cache source on this device.");
    } finally {
      setCachingSourceIds((current) => current.filter((entry) => entry !== source.id));
    }
  }

  async function handleToggle(source: ContentSource) {
    await toggleContentSource(source.id, !source.enabled);
    await refresh();
  }

  async function handleDelete(id: string) {
    await deleteContentSource(id);
    await refresh();
  }

  if (!isAuthenticated) {
    return (
      <section className="builder-panel">
        <span className="builder-panel__label">Content Sources</span>
        <p className="route-shell__copy">
          Sign in to manage private Aurora-compatible content sources and imported
          elements.
        </p>
      </section>
    );
  }

  return (
    <div className="builder-shell">
      <section className="builder-panel">
        <span className="builder-panel__label">Add source</span>
        <form className="builder-panel__fields" onSubmit={handleAddSource}>
          <label className="builder-field">
            <span>Display name</span>
            <input
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Aurora Core"
            />
          </label>
          <label className="builder-field">
            <span>Index URL</span>
            <input
              className="input"
              type="url"
              value={indexUrl}
              onChange={(event) => setIndexUrl(event.target.value)}
              placeholder="https://raw.githubusercontent.com/aurorabuilder/elements/master/core.index"
              required
            />
          </label>
          <div className="builder-summary__actions">
            <button className="button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add source"}
            </button>
          </div>
        </form>
        {status ? (
          <p
            className={`auth-card__status${
              statusTone === "error" ? " auth-card__status--error" : " auth-card__status--success"
            }`}
          >
            {status}
          </p>
        ) : null}
      </section>

      <section className="builder-panel">
        <span className="builder-panel__label">Suggested indexes</span>
        <div className="draft-list">
          {SUGGESTED_SOURCE_INDEXES.map((entry) => (
            <article className="draft-card" key={entry.indexUrl}>
              <div className="draft-card__meta">
                <strong>{entry.name}</strong>
                <span>{entry.indexUrl}</span>
              </div>
              <button
                className="button button--secondary button--compact"
                type="button"
                onClick={() => {
                  setName(entry.name);
                  setIndexUrl(entry.indexUrl);
                }}
              >
                Use
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="builder-panel">
        <span className="builder-panel__label">Your sources</span>
        {!sources.length ? (
          <p className="route-shell__copy">
            No sources added yet. Imported content will stay private to your account.
          </p>
        ) : (
          <div className="draft-list">
            {sources.map((source) => (
              <article className="draft-card" key={source.id}>
                <div className="draft-card__meta">
                  {cachedSources[source.id] ? (
                    <span>
                      Cached on this device · {cachedSources[source.id].elementCount} elements ·{" "}
                      {new Date(cachedSources[source.id].cachedAt).toLocaleString()}
                    </span>
                  ) : (
                    <span>Not cached on this device</span>
                  )}
                  <strong>{source.name}</strong>
                  <span>{source.index_url}</span>
                  <span>
                    Status: {source.sync_status}
                    {source.last_synced_at
                      ? ` · Last synced ${new Date(source.last_synced_at).toLocaleString()}`
                      : ""}
                  </span>
                  {cachedTypeCounts[source.id] ? (
                    <span>Cached types · {formatTypeCounts(cachedTypeCounts[source.id])}</span>
                  ) : null}
                  {source.last_sync_error ? <span>Error: {source.last_sync_error}</span> : null}
                </div>
                <div className="draft-card__actions">
                  <button
                    className="button button--secondary button--compact"
                    type="button"
                    disabled={
                      !source.enabled ||
                      syncingSourceIds.includes(source.id) ||
                      source.sync_status === "queued" ||
                      source.sync_status === "syncing"
                    }
                    onClick={() => handleQueueSync(source)}
                  >
                    {syncingSourceIds.includes(source.id) ||
                    source.sync_status === "queued" ||
                    source.sync_status === "syncing"
                      ? "Syncing..."
                      : "Sync now"}
                  </button>
                  <button
                    className="button button--secondary button--compact"
                    type="button"
                    disabled={cachingSourceIds.includes(source.id)}
                    onClick={() => handleCacheOnDevice(source)}
                  >
                    {cachingSourceIds.includes(source.id) ? "Caching..." : "Cache on this device"}
                  </button>
                  <button
                    className="button button--secondary button--compact"
                    type="button"
                    onClick={() => handleToggle(source)}
                  >
                    {source.enabled ? "Disable" : "Enable"}
                  </button>
                  <button
                    className="button button--secondary button--compact"
                    type="button"
                    onClick={() => handleDelete(source.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="builder-panel">
        <span className="builder-panel__label">Recent sync activity</span>
        {!syncRuns.length ? (
          <p className="route-shell__copy">
            No sync runs yet. Once a source sync starts, you will see discovered files, parsed files,
            and imported element counts here.
          </p>
        ) : (
          <div className="draft-list">
            {syncRuns.map((run) => (
              <article className="draft-card" key={run.id}>
                <div className="draft-card__meta">
                  <strong>{run.status}</strong>
                  <span>Started {new Date(run.started_at).toLocaleString()}</span>
                  <span>
                    Files {run.discovered_file_count} · Parsed {run.parsed_file_count} · Upserted{" "}
                    {run.upserted_element_count}
                  </span>
                  {run.error_text ? <span>Error: {run.error_text}</span> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="builder-panel">
        <span className="builder-panel__label">Privacy and licensing</span>
        <ul className="route-shell__list">
          <li>Built-in SRD content ships with the app.</li>
          <li>Imported Aurora-compatible sources remain private to your account by default.</li>
          <li>Non-SRD imported content is not intended to become a public shared library by default.</li>
          <li>Adding third-party or non-SRD sources is your choice and should respect the rights of their original publishers.</li>
        </ul>
      </section>
    </div>
  );
}
