"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AbilityScoreEditor } from "@/components/ability-score-editor";
import { CatalogSelector } from "@/components/catalog-selector";
import type { BuiltInBackgroundRecord } from "@/lib/builtins/backgrounds";
import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import type { BuiltInRule } from "@/lib/builtins/types";
import { saveRemoteCharacterDraft } from "@/lib/characters/repository";
import {
  ABILITY_KEYS,
  createEmptyCharacterDraft,
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
  const [isSaving, setIsSaving] = useState(false);

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

  async function handleSave() {
    const name = draft.name.trim() || "Untitled Adventurer";
    const nextDraft = {
      ...draft,
      name,
      subraceId: selectedRace?.subraces.length ? draft.subraceId : "",
      updatedAt: new Date().toISOString(),
    };

    setIsSaving(true);
    saveCharacterDraft(nextDraft);
    const savedRemote = await saveRemoteCharacterDraft(nextDraft);
    setDraft(nextDraft);
    setStatus(savedRemote ? "Draft saved locally and to your account." : "Draft saved locally.");
    setIsSaving(false);
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
            Pick an SRD race, class, and background, choose an ability-score mode,
            and save a draft you can reopen from the builder or character list.
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
            <button
              className="button"
              type="button"
              disabled={!canSave || isSaving}
              onClick={handleSave}
            >
              {isSaving ? "Saving..." : "Save draft"}
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
          <CatalogSelector
            items={races.map((entry) => ({
              id: entry.race.id,
              name: entry.race.name,
              description: entry.race.description,
              meta: `${entry.subraces.length} subraces · ${entry.traits.length} related traits`,
            }))}
            label="Race"
            onSelect={(id) => {
              const nextRace = races.find((entry) => entry.race.id === id);
              updateDraft({
                raceId: id,
                subraceId: nextRace?.subraces.length === 1 ? nextRace.subraces[0].id : "",
              });
            }}
            selectedId={draft.raceId}
          />
          {selectedRace?.subraces.length ? (
            <div className="builder-subsection">
              <span className="builder-subsection__label">Subrace</span>
              <div className="chip-grid">
                {selectedRace.subraces.map((subrace) => (
                  <button
                    key={subrace.id}
                    className={`choice-chip${draft.subraceId === subrace.id ? " choice-chip--active" : ""}`}
                    type="button"
                    onClick={() => updateDraft({ subraceId: subrace.id })}
                  >
                    {subrace.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="builder-panel">
          <span className="builder-panel__label">Class</span>
          <CatalogSelector
            items={classes.map((entry) => ({
              id: entry.class.id,
              name: entry.class.name,
              description: entry.class.description,
              meta: `${entry.features.length} class features`,
            }))}
            label="Class"
            onSelect={(id) => updateDraft({ classId: id })}
            selectedId={draft.classId}
          />
        </section>

        <section className="builder-panel">
          <span className="builder-panel__label">Background</span>
          <CatalogSelector
            items={backgrounds.map((entry) => ({
              id: entry.background.id,
              name: entry.background.name,
              description: entry.background.description,
              meta: `${entry.features.length} background feature · ${entry.choiceCount} choice nodes`,
            }))}
            label="Background"
            onSelect={(id) => updateDraft({ backgroundId: id })}
            selectedId={draft.backgroundId}
          />
        </section>

        <AbilityScoreEditor
          abilities={draft.abilities}
          mode={draft.abilityMode}
          onAbilitiesChange={(abilities) => updateDraft({ abilities })}
          onModeChange={(abilityMode, abilities) => updateDraft({ abilityMode, abilities })}
          racialBonuses={racialBonuses}
        />
      </div>
    </div>
  );
}
