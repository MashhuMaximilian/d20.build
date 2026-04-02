"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { hasMarkdownContent, MarkdownRenderer } from "@/components/markdown-editor";
import { getBuiltInSrdBackgrounds } from "@/lib/builtins/backgrounds";
import { getBuiltInSrdClasses } from "@/lib/builtins/classes";
import { getBuiltInSrdRaces } from "@/lib/builtins/races";
import type { BuiltInRule } from "@/lib/builtins/types";
import { getRemoteCharacterDraft } from "@/lib/characters/repository";
import { getCharacterDraft } from "@/lib/characters/storage";
import {
  ABILITY_KEYS,
  ABILITY_LABELS,
  formatAbilityModifier,
  getPrimaryClassEntry,
  type AbilityKey,
  type CharacterDraft,
} from "@/lib/characters/types";
import { getImprovementBonuses } from "@/lib/progression/improvements";

type CharacterSheetProps = {
  draftId: string;
  editable?: boolean;
};

function getStatBonuses(values: string[]) {
  return values.reduce<Record<string, number>>((accumulator, value) => {
    const [name, amount] = value.split(":");
    accumulator[name] = (accumulator[name] ?? 0) + Number(amount);
    return accumulator;
  }, {});
}

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
  const primaryClassEntry = getPrimaryClassEntry(draft);
  const selectedClass = classes.find((entry) => entry.class.id === primaryClassEntry?.classId) ?? null;
  const background =
    backgrounds.find((entry) => entry.background.id === draft.backgroundId) ?? null;
  const racialBonuses = (() => {
    const statRules = [
      ...(race?.race.rules ?? []),
      ...(subrace?.rules ?? []),
    ].filter(
      (rule): rule is Extract<BuiltInRule, { kind: "stat" }> =>
        rule.kind === "stat" && ABILITY_KEYS.includes(rule.name as AbilityKey),
    );

    return getStatBonuses(statRules.map((rule) => `${rule.name}:${rule.value}`));
  })();
  const improvementBonuses = getImprovementBonuses(draft.improvementSelections);
  const filledBackstoryEntries = Object.entries(draft.backstory).filter(([, value]) =>
    hasMarkdownContent(value),
  );

  return (
    <div className="builder-shell">
      <section className="builder-hero">
        <div className="builder-hero__copy">
          <span className="route-shell__tag">{editable ? "Builder draft" : "Character sheet"}</span>
          <h2 className="route-shell__title">{draft.name || "Untitled Adventurer"}</h2>
          <p className="route-shell__copy">
            {draft.playerName || "Unknown player"} · {race?.race.name ?? "No race"}{" "}
            {subrace ? `(${subrace.name})` : ""} · {selectedClass?.class.name ?? "No class"} ·{" "}
            {background?.background.name ?? "No background"} · Level {draft.level}
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
                <strong className="summary-card__value">
                  {draft.abilities[ability] + (racialBonuses[ability] ?? 0) + (improvementBonuses[ability] ?? 0)}
                </strong>
                <span className="ability-card__meta">
                  {formatAbilityModifier(
                    draft.abilities[ability] + (racialBonuses[ability] ?? 0) + (improvementBonuses[ability] ?? 0),
                  )}
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
            <li>Class split: {draft.classEntries.length
              ? draft.classEntries
                  .flatMap((entry) => {
                    if (!entry.classId) {
                      return [];
                    }
                    const classRecord = classes.find((candidate) => candidate.class.id === entry.classId);
                    return [`${classRecord?.class.name ?? entry.classId} ${entry.level}`];
                  })
                  .join(" / ") || "Not chosen"
              : "Not chosen"}</li>
            <li>Background: {background?.background.name ?? "Not chosen"}</li>
            <li>
              Improvements: {Object.values(draft.improvementSelections).length
                ? Object.values(draft.improvementSelections)
                    .map((selection) =>
                      selection.mode === "feat"
                        ? selection.featName ?? "Selected feat"
                        : Object.entries(selection.abilityBonuses)
                            .map(([ability, amount]) => `${amount >= 0 ? "+" : ""}${amount} ${ability.toUpperCase()}`)
                            .join(", "),
                    )
                    .join(" / ")
                : "None chosen"}
            </li>
            <li>
              Spell selections: {Object.values(draft.spellSelections).reduce((sum, spellIds) => sum + spellIds.length, 0)
                ? `${Object.values(draft.spellSelections).reduce((sum, spellIds) => sum + spellIds.length, 0)} selected`
                : "None chosen"}
            </li>
          </ul>
        </section>

        <section className="builder-panel">
          <span className="builder-panel__label">Backstory</span>
          {filledBackstoryEntries.length ? (
            <div className="backstory-step__sheetGrid">
              {filledBackstoryEntries.map(([key, value]) => (
                <article className="backstory-step__sheetCard" key={key}>
                  <strong className="builder-summary__name backstory-step__sheetTitle">
                    {key === "alliesAndOrganizations"
                      ? "Allies and organizations"
                      : key === "additionalFeatures"
                        ? "Additional features"
                        : key.charAt(0).toUpperCase() + key.slice(1)}
                  </strong>
                  <MarkdownRenderer compact value={value} />
                </article>
              ))}
            </div>
          ) : (
            <p className="builder-summary__meta">No backstory notes yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
