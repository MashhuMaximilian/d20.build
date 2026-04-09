"use client";

import { useMemo, useState } from "react";

import type { CharacterCurrency, CharacterInventoryItem } from "@/lib/characters/types";
import type { EquipmentAcquisitionMode } from "@/lib/equipment/inventory";
import { getCurrencyTotalInGp, summarizeInventory } from "@/lib/equipment/inventory";
import type { StartingEquipmentPlan } from "@/lib/equipment/starting-equipment";

type EquipmentStepProps = {
  plan: StartingEquipmentPlan;
  mode: EquipmentAcquisitionMode;
  goldOverrideGp: number | null;
  selections: Record<string, string>;
  inventoryItems: CharacterInventoryItem[];
  currency: CharacterCurrency;
  onModeChange: (mode: EquipmentAcquisitionMode) => void;
  onGoldOverrideChange: (value: number | null) => void;
  onSelect: (groupId: string, optionId: string) => void;
  onToggleEquipped: (itemId: string) => void;
  onToggleAttuned: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
};

type InventoryView = "all" | "equipped" | "attuned";

function formatCurrency(currency: CharacterCurrency) {
  return (["pp", "gp", "ep", "sp", "cp"] as const)
    .filter((key) => currency[key] > 0)
    .map((key) => `${currency[key]} ${key}`)
    .join(" • ");
}

function titleCaseCategory(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export function EquipmentStep({
  plan,
  mode,
  goldOverrideGp,
  selections,
  inventoryItems,
  currency,
  onModeChange,
  onGoldOverrideChange,
  onSelect,
  onToggleEquipped,
  onToggleAttuned,
  onRemoveItem,
}: EquipmentStepProps) {
  const [inventoryView, setInventoryView] = useState<InventoryView>("all");
  const [inventorySearch, setInventorySearch] = useState("");
  const summary = useMemo(() => summarizeInventory(inventoryItems), [inventoryItems]);

  const visibleInventoryItems = useMemo(() => {
    const query = inventorySearch.trim().toLowerCase();
    return inventoryItems.filter((item) => {
      if (inventoryView === "equipped" && !item.equipped) {
        return false;
      }
      if (inventoryView === "attuned" && !item.attuned) {
        return false;
      }
      if (!query) {
        return true;
      }
      return item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
    });
  }, [inventoryItems, inventorySearch, inventoryView]);

  const availableClassGroups = plan.choiceGroups.filter((group) => group.source === "class");
  const availableBackgroundGroups = plan.choiceGroups.filter((group) => group.source === "background");

  return (
    <div className="equipment-step">
      <div className="equipment-step__hero">
        <section className="equipment-step__panel equipment-step__panel--mode">
          <span className="builder-panel__label">Acquisition mode</span>
          <div className="equipment-step__modeToggle">
            <button
              className={`choice-chip${mode === "gear" ? " choice-chip--active" : ""}`}
              type="button"
              onClick={() => onModeChange("gear")}
            >
              Starting gear
            </button>
            <button
              className={`choice-chip${mode === "gold" ? " choice-chip--active" : ""}`}
              type="button"
              onClick={() => onModeChange("gold")}
              disabled={!plan.goldAlternative}
              title={plan.goldAlternative ? undefined : "Gold alternative is not modeled yet for this class."}
            >
              Gold instead
            </button>
          </div>
          {mode === "gold" && plan.goldAlternative ? (
            <div className="equipment-step__goldCard">
              <strong>{plan.goldAlternative.formula}</strong>
              <p className="builder-summary__meta">
                Defaulting to the average: {plan.goldAlternative.averageGp} gp
              </p>
              <label className="builder-field">
                <span className="builder-panel__label">Override starting gold</span>
                <input
                  className="input"
                  inputMode="numeric"
                  min={0}
                  placeholder={`${plan.goldAlternative.averageGp}`}
                  type="number"
                  value={goldOverrideGp ?? ""}
                  onChange={(event) =>
                    onGoldOverrideChange(event.target.value === "" ? null : Math.max(0, Number(event.target.value)))
                  }
                />
              </label>
              <p className="builder-summary__meta">
                Leave blank to keep the suggested average.
              </p>
              {plan.goldAlternative.notes.map((note) => (
                <p className="builder-summary__meta" key={note}>
                  {note}
                </p>
              ))}
            </div>
          ) : (
            <p className="builder-summary__meta">
              Use guided starting gear to keep class and background packages explicit.
            </p>
          )}
        </section>

        <section className="equipment-step__panel equipment-step__panel--summary">
          <span className="builder-panel__label">Inventory snapshot</span>
          <div className="equipment-step__stats">
            <article className="equipment-step__statCard">
              <span className="builder-panel__label">Owned</span>
              <strong>{summary.uniqueItems}</strong>
              <span>{summary.totalItems} total pieces</span>
            </article>
            <article className="equipment-step__statCard">
              <span className="builder-panel__label">Equipped</span>
              <strong>{summary.equipped}</strong>
              <span>active gear</span>
            </article>
            <article className="equipment-step__statCard">
              <span className="builder-panel__label">Attuned</span>
              <strong>{summary.attuned}</strong>
              <span>{summary.attunable} attunable</span>
            </article>
          </div>
          <div className="equipment-step__currency">
            <span className="builder-panel__label">Currency</span>
            <strong>{formatCurrency(currency) || "0 gp"}</strong>
            <span>{getCurrencyTotalInGp(currency).toFixed(2)} gp total value</span>
          </div>
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
        </section>
      </div>

      <div className="equipment-step__layout">
        <details className="equipment-step__accordion equipment-step__accordion--root" open>
          <summary className="equipment-step__accordionSummary">
            <span>Starting gear builder</span>
            <small>
              {mode === "gold"
                ? "Class gear collapsed while using gold"
                : `${availableClassGroups.length + availableBackgroundGroups.length} sections`}
            </small>
          </summary>
          <div className="equipment-step__accordionBody equipment-step__accordionBody--root">
            <div className="equipment-step__groups">
              {availableClassGroups.length ? (
                <details className="equipment-step__accordion" open>
                  <summary className="equipment-step__accordionSummary">
                    <span>Class starting gear</span>
                    <small>{mode === "gold" ? "Skipped while using gold" : `${availableClassGroups.length} groups`}</small>
                  </summary>
                  <div className="equipment-step__accordionBody">
                    {mode === "gold" ? (
                      <p className="builder-summary__meta">
                        Class package choices are skipped while the gold alternative is active.
                      </p>
                    ) : (
                      availableClassGroups.map((group) => (
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
                    )}
                  </div>
                </details>
              ) : null}

              {availableBackgroundGroups.length ? (
                <details className="equipment-step__accordion" open>
                  <summary className="equipment-step__accordionSummary">
                    <span>Background gear</span>
                    <small>{availableBackgroundGroups.length} groups</small>
                  </summary>
                  <div className="equipment-step__accordionBody">
                    {availableBackgroundGroups.map((group) => (
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
                    ))}
                  </div>
                </details>
              ) : null}
            </div>
          </div>
        </details>

        <aside className="equipment-step__panel equipment-step__panel--inventory">
          <div className="equipment-step__inventoryHeader">
            <div>
              <span className="builder-panel__label">Inventory</span>
              <strong className="equipment-step__inventoryTitle">Owned gear and state</strong>
            </div>
            <div className="chip-grid">
              <button
                className={`choice-chip${inventoryView === "all" ? " choice-chip--active" : ""}`}
                type="button"
                onClick={() => setInventoryView("all")}
              >
                All
              </button>
              <button
                className={`choice-chip${inventoryView === "equipped" ? " choice-chip--active" : ""}`}
                type="button"
                onClick={() => setInventoryView("equipped")}
              >
                Equipped
              </button>
              <button
                className={`choice-chip${inventoryView === "attuned" ? " choice-chip--active" : ""}`}
                type="button"
                onClick={() => setInventoryView("attuned")}
              >
                Attuned
              </button>
            </div>
          </div>

          <label className="builder-field">
            <span className="builder-panel__label">Search inventory</span>
            <input
              className="input"
              value={inventorySearch}
              onChange={(event) => setInventorySearch(event.target.value)}
              placeholder="Search item or category"
            />
          </label>

          <div className="equipment-step__inventoryTableWrap">
            <div className="equipment-step__inventoryTable">
              <div className="equipment-step__inventoryHead">
                <span>Name</span>
                <span>Category</span>
                <span>Qty</span>
                <span>State</span>
              </div>
              <div className="equipment-step__inventoryBody">
                {visibleInventoryItems.length ? (
                  visibleInventoryItems.map((item) => (
                    <div className="equipment-step__inventoryRow" key={item.id}>
                      <div className="equipment-step__inventoryName">
                        <strong>{item.name}</strong>
                        <span>{item.sourceLabel}</span>
                      </div>
                      <span>{titleCaseCategory(item.category)}</span>
                      <span>{item.quantity}</span>
                      <div className="equipment-step__inventoryActions">
                        {item.equippable ? (
                          <button
                            className={`choice-chip${item.equipped ? " choice-chip--active" : ""}`}
                            type="button"
                            onClick={() => onToggleEquipped(item.id)}
                          >
                            {item.equipped ? "Equipped" : "Equip"}
                          </button>
                        ) : null}
                        {item.attunable ? (
                          <button
                            className={`choice-chip${item.attuned ? " choice-chip--active" : ""}`}
                            type="button"
                            onClick={() => onToggleAttuned(item.id)}
                          >
                            {item.attuned ? "Attuned" : "Attune"}
                          </button>
                        ) : null}
                        <button className="choice-chip" type="button" onClick={() => onRemoveItem(item.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="builder-summary__meta">No inventory entries match the current view.</p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
