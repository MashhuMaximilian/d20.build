"use client";

import { useMemo } from "react";

import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { CharacterClassEntry } from "@/lib/characters/types";

type LevelingStepProps = {
  classes: BuiltInClassRecord[];
  entries: CharacterClassEntry[];
  totalLevel: number;
  onTotalLevelChange: (level: number) => void;
  onEntryLevelChange: (classId: string, level: number) => void;
  onAddClass: (classId: string) => void;
  onRemoveClass: (classId: string) => void;
};

export function LevelingStep({
  classes,
  entries,
  totalLevel,
  onTotalLevelChange,
  onEntryLevelChange,
  onAddClass,
  onRemoveClass,
}: LevelingStepProps) {
  const assignedLevels = entries.reduce((sum, entry) => sum + entry.level, 0);
  const remainingLevels = totalLevel - assignedLevels;
  const availableClasses = useMemo(
    () => classes.filter((entry) => !entries.some((classEntry) => classEntry.classId === entry.class.id)),
    [classes, entries],
  );

  return (
    <section className="leveling-step">
      <article className="builder-panel leveling-step__summary">
        <span className="builder-panel__label">Level plan</span>
        <strong className="builder-summary__name">Level {totalLevel}</strong>
        <p className="builder-summary__meta">
          Assigned: {assignedLevels} · Remaining: {remainingLevels}
        </p>
        <div className="leveling-step__totalControl">
          <button
            className="button button--secondary"
            type="button"
            onClick={() => onTotalLevelChange(Math.max(1, totalLevel - 1))}
            disabled={totalLevel <= 1}
          >
            -1
          </button>
          <label className="builder-field">
            <span>Total level</span>
            <input
              className="input"
              type="number"
              min={1}
              max={20}
              value={totalLevel}
              onChange={(event) => {
                const value = Number(event.target.value);
                onTotalLevelChange(Number.isFinite(value) ? value : totalLevel);
              }}
            />
          </label>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => onTotalLevelChange(Math.min(20, totalLevel + 1))}
            disabled={totalLevel >= 20}
          >
            +1
          </button>
        </div>
        <ul className="route-shell__list">
          <li>Use this step to distribute levels across classes before feats, ASIs, and spells exist.</li>
          <li>Subclass timing follows the primary class level, not total character level.</li>
          <li>Multiclass prerequisites are planned next, not enforced in this first foundation slice.</li>
        </ul>
      </article>

      <article className="builder-panel leveling-step__entries">
        <span className="builder-panel__label">Class breakdown</span>
        <div className="leveling-step__entryList">
          {entries.map((entry, index) => {
            const classRecord = classes.find((candidate) => candidate.class.id === entry.classId) ?? null;
            const subclassStep = classRecord?.subclassSteps[0] ?? null;
            const subclassReady =
              subclassStep && subclassStep.level ? entry.level >= subclassStep.level : Boolean(subclassStep);

            return (
              <div className="leveling-step__entryCard" key={entry.classId || `entry-${index}`}>
                <div className="leveling-step__entryHeader">
                  <div>
                    <strong>{classRecord?.class.name ?? "Choose class"}</strong>
                    <p className="builder-summary__meta">
                      {index === 0 ? "Primary class" : "Multiclass"} ·{" "}
                      {subclassStep
                        ? subclassReady
                          ? subclassStep.timingLabel
                          : `Subclass unlocks at class level ${subclassStep.level ?? 1}`
                        : "No subclass step available yet"}
                    </p>
                  </div>
                  {index > 0 ? (
                    <button
                      className="button button--secondary"
                      type="button"
                      onClick={() => onRemoveClass(entry.classId)}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <div className="leveling-step__entryControls">
                  <label className="builder-field">
                    <span>Class level</span>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      max={20}
                      value={entry.level}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        onEntryLevelChange(entry.classId, Number.isFinite(value) ? value : entry.level);
                      }}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <div className="leveling-step__addClass">
          <label className="builder-field">
            <span>Add another class</span>
            <select
              className="input"
              defaultValue=""
              onChange={(event) => {
                if (event.target.value) {
                  onAddClass(event.target.value);
                  event.target.value = "";
                }
              }}
            >
              <option value="">Select a class</option>
              {availableClasses.map((entry) => (
                <option key={entry.class.id} value={entry.class.id}>
                  {entry.class.name}
                </option>
              ))}
            </select>
          </label>
          <p className="builder-summary__meta">
            Add a second class only when you want to split levels. The draft keeps one primary class and any number of additional class entries.
          </p>
        </div>
      </article>
    </section>
  );
}
