"use client";

import type { StartingEquipmentPlan } from "@/lib/equipment/starting-equipment";

type EquipmentStepProps = {
  plan: StartingEquipmentPlan;
  selections: Record<string, string>;
  onSelect: (groupId: string, optionId: string) => void;
};

export function EquipmentStep({ plan, selections, onSelect }: EquipmentStepProps) {
  return (
    <div className="equipment-step">
      <div className="equipment-step__layout">
        <aside className="equipment-step__panel">
          <span className="builder-panel__label">Auto-added gear</span>
          {plan.autoItems.length ? (
            <ul className="equipment-step__itemList">
              {plan.autoItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="builder-summary__meta">No fixed starting gear is added yet.</p>
          )}

          {plan.notes.length ? (
            <div className="equipment-step__notes">
              <span className="builder-panel__label">Notes</span>
              {plan.notes.map((note) => (
                <p className="builder-summary__meta" key={note}>
                  {note}
                </p>
              ))}
            </div>
          ) : null}
        </aside>

        <div className="equipment-step__groups">
          {plan.choiceGroups.length ? (
            plan.choiceGroups.map((group) => (
              <section className="equipment-step__group" key={group.id}>
                <div className="equipment-step__groupHeader">
                  <span className="builder-panel__label">{group.title}</span>
                  <p className="builder-summary__meta">{group.description}</p>
                </div>
                <div className="choice-grid">
                  {group.options.map((option) => {
                    const active = selections[group.id] === option.id;
                    return (
                      <button
                        className={`choice-card${active ? " choice-card--active" : ""}`}
                        key={option.id}
                        type="button"
                        onClick={() => onSelect(group.id, option.id)}
                      >
                        <strong>{option.label}</strong>
                        <div className="equipment-step__optionItems">
                          {option.items.map((item) => (
                            <span key={`${option.id}-${item}`}>{item}</span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className="builder-review__card">
              <span className="builder-panel__label">No guided choices</span>
              <p className="builder-summary__meta">
                This equipment slice currently supports only the built-in starting gear packages we have modeled so far.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
