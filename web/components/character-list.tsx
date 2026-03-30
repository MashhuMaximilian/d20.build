"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteCharacterDraft, listCharacterDrafts } from "@/lib/characters/storage";
import type { CharacterDraft } from "@/lib/characters/types";

export function CharacterList() {
  const [drafts, setDrafts] = useState<CharacterDraft[]>([]);

  useEffect(() => {
    setDrafts(listCharacterDrafts());
  }, []);

  function handleDelete(id: string) {
    deleteCharacterDraft(id);
    setDrafts(listCharacterDrafts());
  }

  if (!drafts.length) {
    return (
      <section className="builder-panel">
        <span className="builder-panel__label">Saved drafts</span>
        <p className="route-shell__copy">
          No saved local characters yet. Start a character in the builder and save the
          draft to see it here.
        </p>
        <Link className="button" href="/builder/new">
          Start a character
        </Link>
      </section>
    );
  }

  return (
    <section className="builder-panel">
      <span className="builder-panel__label">Saved drafts</span>
      <div className="draft-list">
        {drafts.map((draft) => (
          <article className="draft-card" key={draft.id}>
            <div className="draft-card__meta">
              <strong>{draft.name || "Untitled Adventurer"}</strong>
              <span>
                {draft.playerName || "Unknown player"} · Updated{" "}
                {new Date(draft.updatedAt).toLocaleString()}
              </span>
            </div>
            <div className="draft-card__actions">
              <Link className="button button--secondary button--compact" href={`/builder/${draft.id}`}>
                Edit
              </Link>
              <Link className="button button--secondary button--compact" href={`/characters/${draft.id}`}>
                View
              </Link>
              <button
                className="button button--secondary button--compact"
                type="button"
                onClick={() => handleDelete(draft.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
