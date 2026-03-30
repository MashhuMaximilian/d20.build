"use client";

import { useEffect, useState } from "react";

import {
  createContentSource,
  deleteContentSource,
  listContentSources,
  listSourceSyncRuns,
  queueContentSourceSync,
  toggleContentSource,
} from "@/lib/content-sources/repository";
import {
  SUGGESTED_SOURCE_INDEXES,
  type ContentSource,
  type SourceSyncRun,
} from "@/lib/content-sources/types";

type ContentSourcesSettingsProps = {
  isAuthenticated: boolean;
};

export function ContentSourcesSettings({
  isAuthenticated,
}: ContentSourcesSettingsProps) {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [syncRuns, setSyncRuns] = useState<SourceSyncRun[]>([]);
  const [name, setName] = useState("");
  const [indexUrl, setIndexUrl] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function refresh() {
    const [nextSources, nextRuns] = await Promise.all([
      listContentSources(),
      listSourceSyncRuns(),
    ]);
    setSources(nextSources);
    setSyncRuns(nextRuns);
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

    const result = await createContentSource({
      name: name.trim() || "Aurora Source",
      indexUrl: indexUrl.trim(),
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setStatus(result.error);
      return;
    }

    setName("");
    setIndexUrl("");
    setStatus("Source added.");
    await refresh();
  }

  async function handleQueueSync(source: ContentSource) {
    setStatus("");
    const result = await queueContentSourceSync(source);

    if (!result.ok) {
      setStatus(result.error);
      return;
    }

    setStatus(`Queued sync for ${source.name}.`);
    await refresh();
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
        {status ? <p className="auth-card__status">{status}</p> : null}
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
                  <strong>{source.name}</strong>
                  <span>{source.index_url}</span>
                  <span>
                    Status: {source.sync_status}
                    {source.last_synced_at
                      ? ` · Last synced ${new Date(source.last_synced_at).toLocaleString()}`
                      : ""}
                  </span>
                  {source.last_sync_error ? <span>Error: {source.last_sync_error}</span> : null}
                </div>
                <div className="draft-card__actions">
                  <button
                    className="button button--secondary button--compact"
                    type="button"
                    onClick={() => handleQueueSync(source)}
                  >
                    Sync now
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
            No sync runs yet. The first M2 slice only queues sync intent and records status.
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
        </ul>
      </section>
    </div>
  );
}
