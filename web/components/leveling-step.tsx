"use client";

import { useEffect, useMemo, useState } from "react";

import type { CharacterClassEntry } from "@/lib/characters/types";

type LevelingStepProps = {
  entries: CharacterClassEntry[];
  totalLevel: number;
  onTotalLevelChange: (level: number) => void;
  onEntryLevelChange: (index: number, level: number) => void;
  onAddClassSlot: () => void;
  onRemoveClassSlot: (index: number) => void;
};

function useNumericDraft(value: number) {
  const [draftValue, setDraftValue] = useState(String(value));

  useEffect(() => {
    setDraftValue(String(value));
  }, [value]);

  return {
    draftValue,
    setDraftValue,
  };
}

export function LevelingStep({
  entries,
  totalLevel,
  onTotalLevelChange,
  onEntryLevelChange,
  onAddClassSlot,
  onRemoveClassSlot,
}: LevelingStepProps) {
  const assignedLevels = entries.reduce((sum, entry) => sum + entry.level, 0);
  const remainingLevels = totalLevel - assignedLevels;
  const totalLevelInput = useNumericDraft(totalLevel);
  const entryInputs = useMemo(
    () => entries.map((entry) => String(entry.level)),
    [entries],
  );
  const [entryDrafts, setEntryDrafts] = useState<string[]>(entryInputs);

  useEffect(() => {
    setEntryDrafts(entryInputs);
  }, [entryInputs]);

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
            className="button button--secondary button--compact"
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
              inputMode="numeric"
              pattern="[0-9]*"
              value={totalLevelInput.draftValue}
              onChange={(event) => {
                const nextValue = event.target.value.replace(/[^\d]/g, "");
                totalLevelInput.setDraftValue(nextValue);
              }}
              onBlur={() => {
                const parsed = Number(totalLevelInput.draftValue);
                const nextLevel = Number.isFinite(parsed) && parsed > 0 ? parsed : totalLevel;
                onTotalLevelChange(nextLevel);
              }}
            />
          </label>
          <button
            className="button button--secondary button--compact"
            type="button"
            onClick={() => onTotalLevelChange(Math.min(20, totalLevel + 1))}
            disabled={totalLevel >= 20}
          >
            +1
          </button>
        </div>
        <ul className="route-shell__list">
          <li>Declare the level plan first, then choose the race and class breakdown against it.</li>
          <li>Each extra class slot becomes a multiclass track later in the wizard.</li>
          <li>Class prerequisites are checked after class selection and can block saving if unmet.</li>
        </ul>
      </article>

      <article className="builder-panel leveling-step__entries">
        <span className="builder-panel__label">Class slots</span>
        <div className="leveling-step__entryList">
          {entries.map((entry, index) => (
            <div className="leveling-step__entryCard" key={`class-slot-${index}`}>
              <div className="leveling-step__entryHeader">
                <div>
                  <strong>{index === 0 ? "Primary class" : `Multiclass ${index}`}</strong>
                  <p className="builder-summary__meta">
                    {entry.classId ? "Class chosen later in the class step." : "Unassigned class slot."}
                  </p>
                </div>
                {index > 0 ? (
                  <button
                    className="button button--secondary button--compact"
                    type="button"
                    onClick={() => onRemoveClassSlot(index)}
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
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={entryDrafts[index] ?? String(entry.level)}
                    onChange={(event) => {
                      const nextValue = event.target.value.replace(/[^\d]/g, "");
                      setEntryDrafts((current) => {
                        const next = [...current];
                        next[index] = nextValue;
                        return next;
                      });
                    }}
                    onBlur={() => {
                      const parsed = Number(entryDrafts[index]);
                      onEntryLevelChange(index, Number.isFinite(parsed) && parsed > 0 ? parsed : entry.level);
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="leveling-step__addClass">
          <button className="button button--secondary" type="button" onClick={onAddClassSlot}>
            Add class slot
          </button>
          <p className="builder-summary__meta">
            Add another class slot now if this build is multiclassed. You will assign the actual classes in the class step.
          </p>
        </div>
      </article>
    </section>
  );
}
