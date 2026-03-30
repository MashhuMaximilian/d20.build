"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getBuiltInSrdBackgrounds } from "@/lib/builtins/backgrounds";
import { getBuiltInSrdClasses } from "@/lib/builtins/classes";
import { getBuiltInSrdRaces } from "@/lib/builtins/races";
import { getRemoteCharacterDraft } from "@/lib/characters/repository";
import { getCharacterDraft } from "@/lib/characters/storage";
import {
  ABILITY_KEYS,
  ABILITY_LABELS,
  formatAbilityModifier,
  type CharacterDraft,
} from "@/lib/characters/types";

type CharacterSheetProps = {
  draftId: string;
  editable?: boolean;
};

export function CharacterSheet({ draftId, editable = false }: CharacterSheetProps) {
  const [draft, setDraft] = useState<CharacterDraft | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDraft() {
      const localDraft = getCharacterDraft(draftId);

      if (localDraft) {
        if (!cancelled) {
          setDraft(localDraft);
        }
        return;
      }

      const remoteDraft = await getRemoteCharacterDraft(draftId);

      if (!cancelled) {
        setDraft(remoteDraft);
      }
    }

    void loadDraft();

    return () => {
      cancelled = true;
    };
  }, [draftId]);

  const races = useMemo(() => getBuiltInSrdRaces(), []);
  const classes = useMemo(() => getBuiltInSrdClasses(), []);
  const backgrounds = useMemo(() => getBuiltInSrdBackgrounds(), []);

  if (!draft) {
    return (
      <section className="builder-panel">
        <span className="builder-panel__label">Draft not found</span>
        <p className="route-shell__copy">
          This draft was not found locally or in your signed-in account.
        </p>
        <Link className="button" href="/builder/new">
          Start a new draft
        </Link>
      </section>
    );
  }

  const race = races.find((entry) => entry.race.id === draft.raceId) ?? null;
  const subrace = race?.subraces.find((entry) => entry.id === draft.subraceId) ?? null;
  const selectedClass = classes.find((entry) => entry.class.id === draft.classId) ?? null;
  const background =
    backgrounds.find((entry) => entry.background.id === draft.backgroundId) ?? null;

  return (
    <div className="builder-shell">
      <section className="builder-hero">
        <div className="builder-hero__copy">
          <span className="route-shell__tag">{editable ? "Builder draft" : "Character sheet"}</span>
          <h2 className="route-shell__title">{draft.name || "Untitled Adventurer"}</h2>
          <p className="route-shell__copy">
            {draft.playerName || "Unknown player"} · {race?.race.name ?? "No race"}{" "}
            {subrace ? `(${subrace.name})` : ""} · {selectedClass?.class.name ?? "No class"} ·{" "}
            {background?.background.name ?? "No background"}
          </p>
        </div>
        <div className="builder-summary">
          <span className="builder-summary__label">Actions</span>
          <div className="builder-summary__actions">
            {editable ? null : (
              <Link className="button" href={`/builder/${draft.id}`}>
                Edit draft
              </Link>
            )}
            <Link className="button button--secondary" href="/characters">
              Back to list
            </Link>
          </div>
        </div>
      </section>

      <div className="builder-grid">
        <section className="builder-panel">
          <span className="builder-panel__label">Ability scores</span>
          <div className="ability-grid">
            {ABILITY_KEYS.map((ability) => (
              <div className="ability-card" key={ability}>
                <span className="ability-card__label">{ABILITY_LABELS[ability]}</span>
                <strong className="summary-card__value">{draft.abilities[ability]}</strong>
                <span className="ability-card__meta">
                  {formatAbilityModifier(draft.abilities[ability])}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="builder-panel">
          <span className="builder-panel__label">Selections</span>
          <ul className="route-shell__list">
            <li>Race: {race?.race.name ?? "Not chosen"}</li>
            <li>Subrace: {subrace?.name ?? "Not chosen"}</li>
            <li>Class: {selectedClass?.class.name ?? "Not chosen"}</li>
            <li>Background: {background?.background.name ?? "Not chosen"}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
