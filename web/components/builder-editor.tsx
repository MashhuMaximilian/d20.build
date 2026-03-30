"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { BuiltInBackgroundRecord } from "@/lib/builtins/backgrounds";
import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import type { BuiltInRule } from "@/lib/builtins/types";
import {
  ABILITY_KEYS,
  ABILITY_LABELS,
  createEmptyCharacterDraft,
  formatAbilityModifier,
  type AbilityKey,
  type CharacterDraft,
} from "@/lib/characters/types";
import { saveCharacterDraft } from "@/lib/characters/storage";

type BuilderEditorProps = {
  backgrounds: BuiltInBackgroundRecord[];
  classes: BuiltInClassRecord[];
  initialDraft?: CharacterDraft;
  races: BuiltInRaceRecord[];
};

function getStatBonuses(values: string[]) {
  return values.reduce<Record<string, number>>((accumulator, value) => {
    const [name, amount] = value.split(":");
    accumulator[name] = (accumulator[name] ?? 0) + Number(amount);
    return accumulator;
  }, {});
}

export function BuilderEditor({
  backgrounds,
  classes,
  initialDraft,
  races,
}: BuilderEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<CharacterDraft>(initialDraft ?? createEmptyCharacterDraft());
  const [status, setStatus] = useState("");

  const selectedRace = useMemo(
    () => races.find((entry) => entry.race.id === draft.raceId) ?? null,
    [draft.raceId, races],
  );
  const selectedSubrace = useMemo(
    () => selectedRace?.subraces.find((entry) => entry.id === draft.subraceId) ?? null,
    [draft.subraceId, selectedRace],
  );
  const selectedClass = useMemo(
    () => classes.find((entry) => entry.class.id === draft.classId) ?? null,
    [classes, draft.classId],
  );
  const selectedBackground = useMemo(
    () => backgrounds.find((entry) => entry.background.id === draft.backgroundId) ?? null,
    [backgrounds, draft.backgroundId],
  );

  const racialBonuses = useMemo(() => {
    const statRules = [
      ...(selectedRace?.race.rules ?? []),
      ...(selectedSubrace?.rules ?? []),
    ].filter(
      (rule): rule is Extract<BuiltInRule, { kind: "stat" }> =>
        rule.kind === "stat" && ABILITY_KEYS.includes(rule.name as AbilityKey),
    );

    return getStatBonuses(
      statRules.map((rule) => `${rule.name}:${rule.value}`),
    );
  }, [selectedRace, selectedSubrace]);

  const pendingChoices = useMemo(() => {
    const subracePending = selectedRace && selectedRace.subraces.length > 0 && !draft.subraceId ? 1 : 0;
    const backgroundPending =
      selectedBackground?.background.rules.filter((rule) => rule.kind === "select").length ?? 0;
    const classPending = selectedClass
      ? selectedClass.features.reduce(
          (count, feature) =>
            count + feature.rules.filter((rule) => rule.kind === "select").length,
          selectedClass.class.rules.filter((rule) => rule.kind === "select").length,
        )
      : 0;

    return subracePending + backgroundPending + classPending;
  }, [draft.subraceId, selectedBackground, selectedClass, selectedRace]);

  function updateDraft(patch: Partial<CharacterDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function updateAbility(key: AbilityKey, value: number) {
    setDraft((current) => ({
      ...current,
      abilities: {
        ...current.abilities,
        [key]: value,
      },
    }));
  }

  function handleSave() {
    const name = draft.name.trim() || "Untitled Adventurer";
    const nextDraft = {
      ...draft,
      name,
      subraceId: selectedRace?.subraces.length ? draft.subraceId : "",
    };

    saveCharacterDraft(nextDraft);
    setDraft(nextDraft);
    setStatus("Draft saved locally.");
    router.push(`/builder/${nextDraft.id}`);
    router.refresh();
  }

  const canSave = Boolean(draft.raceId && draft.classId && draft.backgroundId);

  return (
    <div className="builder-shell">
      <section className="builder-hero">
        <div className="builder-hero__copy">
          <span className="route-shell__tag">Character Builder</span>
          <h2 className="route-shell__title">Start a real draft</h2>
          <p className="route-shell__copy">
            Pick an SRD race, class, and background, set ability scores, and save a
            local draft you can reopen from the builder or character list.
          </p>
        </div>
        <div className="builder-summary">
          <span className="builder-summary__label">Current draft</span>
          <strong className="builder-summary__name">
            {draft.name || "Untitled Adventurer"}
          </strong>
          <p className="builder-summary__meta">
            {selectedRace?.race.name ?? "No race"} / {selectedClass?.class.name ?? "No class"} /{" "}
            {selectedBackground?.background.name ?? "No background"}
          </p>
          <p className="builder-summary__meta">
            Pending builder choices: {pendingChoices}
          </p>
          <div className="builder-summary__actions">
            <button className="button" type="button" disabled={!canSave} onClick={handleSave}>
              Save draft
            </button>
            <Link className="button button--secondary" href="/characters">
              View saved drafts
            </Link>
          </div>
          {status ? <p className="auth-card__status">{status}</p> : null}
        </div>
      </section>

      <div className="builder-grid">
        <section className="builder-panel">
          <span className="builder-panel__label">Identity</span>
          <div className="builder-panel__fields">
            <label className="builder-field">
              <span>Name</span>
              <input
                className="input"
                value={draft.name}
                onChange={(event) => updateDraft({ name: event.target.value })}
                placeholder="Alyra Dawnshield"
              />
            </label>
            <label className="builder-field">
              <span>Player</span>
              <input
                className="input"
                value={draft.playerName}
                onChange={(event) => updateDraft({ playerName: event.target.value })}
                placeholder="Max"
              />
            </label>
          </div>
        </section>

        <section className="builder-panel">
          <span className="builder-panel__label">Race</span>
          <div className="choice-grid">
            {races.map((entry) => {
              const active = draft.raceId === entry.race.id;
              return (
                <button
                  key={entry.race.id}
                  className={`choice-card${active ? " choice-card--active" : ""}`}
                  type="button"
                  onClick={() =>
                    updateDraft({
                      raceId: entry.race.id,
                      subraceId:
                        entry.subraces.length === 1 ? entry.subraces[0].id : "",
                    })
                  }
                >
                  <strong>{entry.race.name}</strong>
                  <span>{entry.race.description}</span>
                </button>
              );
            })}
          </div>
          {selectedRace?.subraces.length ? (
            <div className="builder-subsection">
              <span className="builder-subsection__label">Subrace</span>
              <div className="choice-grid">
                {selectedRace.subraces.map((subrace) => (
                  <button
                    key={subrace.id}
                    className={`choice-card${draft.subraceId === subrace.id ? " choice-card--active" : ""}`}
                    type="button"
                    onClick={() => updateDraft({ subraceId: subrace.id })}
                  >
                    <strong>{subrace.name}</strong>
                    <span>{subrace.description}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="builder-panel">
          <span className="builder-panel__label">Class</span>
          <div className="choice-grid">
            {classes.map((entry) => (
              <button
                key={entry.class.id}
                className={`choice-card${draft.classId === entry.class.id ? " choice-card--active" : ""}`}
                type="button"
                onClick={() => updateDraft({ classId: entry.class.id })}
              >
                <strong>{entry.class.name}</strong>
                <span>{entry.class.description}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="builder-panel">
          <span className="builder-panel__label">Background</span>
          <div className="choice-grid">
            {backgrounds.map((entry) => (
              <button
                key={entry.background.id}
                className={`choice-card${draft.backgroundId === entry.background.id ? " choice-card--active" : ""}`}
                type="button"
                onClick={() => updateDraft({ backgroundId: entry.background.id })}
              >
                <strong>{entry.background.name}</strong>
                <span>{entry.background.description}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="builder-panel">
          <span className="builder-panel__label">Ability scores</span>
          <div className="ability-grid">
            {ABILITY_KEYS.map((ability) => {
              const baseScore = draft.abilities[ability];
              const bonus = racialBonuses[ability] ?? 0;
              const total = baseScore + bonus;

              return (
                <label className="ability-card" key={ability}>
                  <span className="ability-card__label">{ABILITY_LABELS[ability]}</span>
                  <input
                    className="input"
                    type="number"
                    min={3}
                    max={20}
                    value={baseScore}
                    onChange={(event) => updateAbility(ability, Number(event.target.value))}
                  />
                  <span className="ability-card__meta">
                    Total {total} ({formatAbilityModifier(total)})
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
