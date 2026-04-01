"use client";

import type { CharacterClassEntry } from "@/lib/characters/types";

type LevelingStepProps = {
  entries: CharacterClassEntry[];
  totalLevel: number;
  primaryLevel: number;
  onTotalLevelChange: (level: number) => void;
  onEntryLevelChange: (index: number, level: number) => void;
  onAddClassSlot: () => void;
  onRemoveClassSlot: (index: number) => void;
};

export function LevelingStep({
  entries,
  totalLevel,
  primaryLevel,
  onTotalLevelChange,
  onEntryLevelChange,
  onAddClassSlot,
  onRemoveClassSlot,
}: LevelingStepProps) {
  const extraEntries = entries.slice(1);
  const assignedExtraLevels = extraEntries.reduce((sum, entry) => sum + entry.level, 0);

  return (
    <section className="leveling-step">
      <article className="builder-panel leveling-step__summary">
        <span className="builder-panel__label">Level plan</span>
        <strong className="builder-summary__name">Level {totalLevel}</strong>
        <p className="builder-summary__meta">
          Primary class: {primaryLevel} · Multiclassed levels: {assignedExtraLevels}
        </p>
        <div className="leveling-step__totalControl">
          <button
            className="button button--secondary button--compact"
            type="button"
            onClick={() => onTotalLevelChange(Math.max(1, totalLevel - 1))}
            disabled={totalLevel <= 1}
          >
            -
          </button>
          <div className="builder-field">
            <span>Total level</span>
            <div className="numeric-stepper__value numeric-stepper__value--wide" aria-live="polite">
              {totalLevel}
            </div>
          </div>
          <button
            className="button button--secondary button--compact"
            type="button"
            onClick={() => onTotalLevelChange(Math.min(20, totalLevel + 1))}
            disabled={totalLevel >= 20}
          >
            +
          </button>
        </div>
        <ul className="route-shell__list">
          <li>Set the total character level first, then add multiclass slots only if the build actually branches.</li>
          <li>The primary class automatically receives the remaining levels after multiclass levels are assigned.</li>
          <li>Class prerequisites are checked after class selection and can block saving if unmet.</li>
        </ul>
      </article>

      <article className="builder-panel leveling-step__entries">
        <span className="builder-panel__label">Multiclass plan</span>
        <div className="leveling-step__entryCard leveling-step__entryCard--derived">
          <div className="leveling-step__entryHeader">
            <div>
              <strong>Primary class</strong>
              <p className="builder-summary__meta">
                This class gets the remaining levels automatically after multiclass levels are assigned.
              </p>
            </div>
          </div>
          <div className="leveling-step__derivedValue">
            <span>Derived level</span>
            <strong>{primaryLevel}</strong>
          </div>
        </div>
        <div className="leveling-step__entryList">
          {extraEntries.map((entry, index) => (
            <div className="leveling-step__entryCard" key={`class-slot-${index + 1}`}>
              <div className="leveling-step__entryHeader">
                <div>
                  <strong>{`Multiclass ${index + 1}`}</strong>
                  <p className="builder-summary__meta">
                    {entry.classId ? "Class chosen later in the class step." : "Unassigned class slot."}
                  </p>
                </div>
                <button
                  className="button button--secondary button--compact"
                  type="button"
                  onClick={() => onRemoveClassSlot(index + 1)}
                >
                  Remove
                </button>
              </div>
              <div className="leveling-step__entryControls">
                <div className="builder-field">
                  <span>Class level</span>
                  <div className="numeric-stepper">
                    <button
                      className="button button--secondary button--compact numeric-stepper__button"
                      type="button"
                      onClick={() => onEntryLevelChange(index + 1, Math.max(1, entry.level - 1))}
                      disabled={entry.level <= 1}
                    >
                      -
                    </button>
                    <div className="numeric-stepper__value" aria-live="polite">
                      {entry.level}
                    </div>
                    <button
                      className="button button--secondary button--compact numeric-stepper__button"
                      type="button"
                      onClick={() => onEntryLevelChange(index + 1, Math.min(20, entry.level + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="leveling-step__addClass">
          <button className="button button--secondary" type="button" onClick={onAddClassSlot}>
            Add multiclass slot
          </button>
          <p className="builder-summary__meta">
            Only add extra slots if this build is multiclassed. You will choose the actual classes in the class step.
          </p>
        </div>
      </article>
    </section>
  );
}
