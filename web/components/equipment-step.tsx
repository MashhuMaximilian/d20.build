"use client";

import { useEffect, useMemo, useState } from "react";

import { CatalogSelector, type CatalogItem } from "@/components/catalog-selector";
import { MarkdownEditor } from "@/components/markdown-editor";
import type { CharacterCurrency, CharacterEquipmentNotes, CharacterInventoryItem } from "@/lib/characters/types";
import type { EquipmentCatalogEntry } from "@/lib/equipment/catalog";
import { getMergedEquipmentCatalog } from "@/lib/equipment/catalog";
import type { EquipmentAcquisitionMode, InventoryCategory } from "@/lib/equipment/inventory";
import { getCurrencyTotalInGp, summarizeInventory } from "@/lib/equipment/inventory";
import type { StartingEquipmentPlan } from "@/lib/equipment/starting-equipment";

type EquipmentStepProps = {
  plan: StartingEquipmentPlan;
  mode: EquipmentAcquisitionMode;
  goldOverrideGp: number | null;
  selections: Record<string, string>;
  inventoryItems: CharacterInventoryItem[];
  currency: CharacterCurrency;
  equipmentNotes: CharacterEquipmentNotes;
  onModeChange: (mode: EquipmentAcquisitionMode) => void;
  onGoldOverrideChange: (value: number | null) => void;
  onSelect: (groupId: string, optionId: string) => void;
  onToggleEquipped: (itemId: string) => void;
  onToggleAttuned: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onAddManualItem: (entry: EquipmentCatalogEntry) => void;
  onAddCustomItem: (input: {
    name: string;
    category: InventoryCategory;
    quantity: number;
    attackBonus: string;
    damage: string;
    notes: string;
  }) => void;
  onEquipmentNotesChange: (notes: CharacterEquipmentNotes) => void;
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

const ITEM_BROWSER_PREFERRED_TAGS = [
  "Adventuring Gear",
  "Treasure",
  "Equipment Packs",
  "Tools",
  "Musical Instruments",
  "Armor",
  "Magic Armor",
  "Weapons",
  "Magic Weapons",
  "Ammunition",
  "Spellcasting Focus",
  "Wondrous Items",
  "Supernatural Gifts",
  "Staffs",
  "Rods",
  "Wands",
  "Rings",
  "Potions",
  "Poison",
  "Scrolls",
  "Mounts & Vehicles",
  "Alchemical Formulas",
  "Reagents",
  "Explosives",
  "Miscellaneous",
];

const CUSTOM_ITEM_CATEGORY_OPTIONS: Array<{ value: InventoryCategory; label: string }> = [
  { value: "weapon", label: "Weapon" },
  { value: "armor", label: "Armor" },
  { value: "shield", label: "Shield" },
  { value: "focus", label: "Focus" },
  { value: "ammo", label: "Ammunition" },
  { value: "tool", label: "Tool" },
  { value: "instrument", label: "Instrument" },
  { value: "pack", label: "Pack" },
  { value: "clothing", label: "Clothing" },
  { value: "book", label: "Book" },
  { value: "holy-symbol", label: "Holy symbol" },
  { value: "consumable", label: "Consumable" },
  { value: "treasure", label: "Treasure" },
  { value: "misc", label: "Miscellaneous" },
];

function getEquipmentCatalogCardId(item: EquipmentCatalogEntry) {
  return `${item.origin}::${item.sourceUrl || item.source}::${item.id}`;
}

export function EquipmentStep({
  plan,
  mode,
  goldOverrideGp,
  selections,
  inventoryItems,
  currency,
  equipmentNotes,
  onModeChange,
  onGoldOverrideChange,
  onSelect,
  onToggleEquipped,
  onToggleAttuned,
  onRemoveItem,
  onAddManualItem,
  onAddCustomItem,
  onEquipmentNotesChange,
}: EquipmentStepProps) {
  const [inventoryView, setInventoryView] = useState<InventoryView>("all");
  const [inventorySearch, setInventorySearch] = useState("");
  const [catalogItems, setCatalogItems] = useState<EquipmentCatalogEntry[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [customItemName, setCustomItemName] = useState("");
  const [customItemCategory, setCustomItemCategory] = useState<InventoryCategory>("misc");
  const [customItemQuantity, setCustomItemQuantity] = useState("1");
  const [customItemAttackBonus, setCustomItemAttackBonus] = useState("");
  const [customItemDamage, setCustomItemDamage] = useState("");
  const [customItemNotes, setCustomItemNotes] = useState("");
  const summary = useMemo(() => summarizeInventory(inventoryItems), [inventoryItems]);

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      setCatalogLoading(true);
      try {
        const entries = await getMergedEquipmentCatalog();
        if (!active) {
          return;
        }
        setCatalogItems(entries);
      } finally {
        if (active) {
          setCatalogLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      active = false;
    };
  }, []);

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

  const manualItemCounts = useMemo(() => {
    const counts = new Map<string, number>();
    inventoryItems.forEach((item) => {
      if (item.source !== "manual") {
        return;
      }
      counts.set(item.id.replace(/^manual::/, ""), item.quantity);
    });
    return counts;
  }, [inventoryItems]);

  const itemCatalogCards = useMemo<CatalogItem[]>(
    () =>
      catalogItems.map((item) => {
        const ownedCount = manualItemCounts.get(item.id) ?? 0;
        return {
          id: getEquipmentCatalogCardId(item),
          name: item.name,
          description: item.description,
          detailHtml: item.detailHtml,
          meta: item.family,
          origin: item.origin,
          source: item.source,
          filterTags: item.filterTags,
          detailTags: item.detailTags,
          summaryLines: item.summaryLines,
          impactLines: [
            ownedCount ? `Owned ${ownedCount}` : "Not owned",
            ...item.impactLines,
          ],
          mechanicsLines: item.mechanicsLines,
        };
      }),
    [catalogItems, manualItemCounts],
  );

  const parsedCustomItemQuantity = Math.max(1, Number(customItemQuantity) || 1);

  return (
    <div className="equipment-step">
      <details className="equipment-step__accordion equipment-step__accordion--wide" open>
        <summary className="equipment-step__accordionSummary">
          <span>Acquisition and snapshot</span>
          <small>{mode === "gold" ? "Gold flow active" : "Starting gear flow active"}</small>
        </summary>
        <div className="equipment-step__accordionBody">
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
        </div>
      </details>

      <details className="equipment-step__accordion equipment-step__accordion--wide" open>
        <summary className="equipment-step__accordionSummary">
          <span>Starting gear and owned inventory</span>
          <small>{summary.uniqueItems} owned entries</small>
        </summary>
        <div className="equipment-step__accordionBody">
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
                      {item.attackBonus || item.damage || item.notes ? (
                        <div className="equipment-step__inventoryNote">
                          {item.attackBonus ? <span>Hit/damage bonus: {item.attackBonus}</span> : null}
                          {item.damage ? <span>Damage: {item.damage}</span> : null}
                          {item.notes ? <span>{item.notes}</span> : null}
                        </div>
                      ) : null}
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
      </details>

      <section className="equipment-step__panel">
        <div className="equipment-step__groupHeader">
          <span className="builder-panel__label">Item browser</span>
          <p className="builder-summary__meta">
            Browse mundane gear, magic items, wondrous items, and imported equipment sources, then add what your table grants.
          </p>
        </div>
        {catalogLoading ? (
          <p className="builder-summary__meta">Loading item catalog…</p>
        ) : (
          <CatalogSelector
            actionLabel="Add to inventory"
            emptyMessage="No matching equipment entries."
            items={itemCatalogCards}
            label="Item"
            onAction={(itemId) => {
              const entry = catalogItems.find((item) => getEquipmentCatalogCardId(item) === itemId);
              if (!entry) {
                return;
              }
              onAddManualItem(entry);
            }}
            onSelect={() => {}}
            preferredTags={ITEM_BROWSER_PREFERRED_TAGS}
            selectedId=""
            tagSectionLabel="Item type"
            tagLimit={24}
            defaultDetailView="reference"
          />
        )}
      </section>

      <section className="equipment-step__panel">
        <div className="equipment-step__groupHeader">
          <span className="builder-panel__label">Manual additions</span>
          <p className="builder-summary__meta">
            Add custom table-granted items and keep lightweight notes for extra treasure or quest items that do not belong in the catalog.
          </p>
        </div>
        <div className="equipment-step__manualGrid">
          <div className="equipment-step__manualCard">
            <span className="builder-panel__label">Custom item</span>
            <label className="builder-field">
              <span className="builder-summary__meta">Item name</span>
              <input
                className="input"
                placeholder="Custom shield, relic, trophy..."
                value={customItemName}
                onChange={(event) => setCustomItemName(event.target.value)}
              />
            </label>
            <div className="equipment-step__manualRow">
              <label className="builder-field">
                <span className="builder-summary__meta">Category</span>
                <select
                  className="input"
                  value={customItemCategory}
                  onChange={(event) => setCustomItemCategory(event.target.value as InventoryCategory)}
                >
                  {CUSTOM_ITEM_CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="builder-field">
                <span className="builder-summary__meta">Qty</span>
                <input
                  className="input"
                  inputMode="numeric"
                  min={1}
                  type="number"
                  value={customItemQuantity}
                  onChange={(event) => setCustomItemQuantity(event.target.value)}
                />
              </label>
            </div>
            <div className="equipment-step__manualRow">
              <label className="builder-field">
                <span className="builder-summary__meta">Hit / damage modifier</span>
                <input
                  className="input"
                  placeholder="+1, +2, advantage, table ruling..."
                  value={customItemAttackBonus}
                  onChange={(event) => setCustomItemAttackBonus(event.target.value)}
                />
              </label>
              <label className="builder-field">
                <span className="builder-summary__meta">Damage</span>
                <input
                  className="input"
                  placeholder="1d8 slashing, +1d6 fire..."
                  value={customItemDamage}
                  onChange={(event) => setCustomItemDamage(event.target.value)}
                />
              </label>
            </div>
            <label className="builder-field">
              <span className="builder-summary__meta">Notes</span>
              <MarkdownEditor
                compact
                placeholder="Optional details, effects, provenance, or table ruling."
                slashContext="Custom item notes"
                value={customItemNotes}
                onChange={setCustomItemNotes}
              />
            </label>
            <div className="equipment-step__manualActions">
              <button
                className="button button--secondary button--compact"
                type="button"
                disabled={!customItemName.trim()}
                onClick={() => {
                  if (!customItemName.trim()) {
                    return;
                  }
                  onAddCustomItem({
                    name: customItemName.trim(),
                    category: customItemCategory,
                    quantity: parsedCustomItemQuantity,
                    attackBonus: customItemAttackBonus.trim(),
                    damage: customItemDamage.trim(),
                    notes: customItemNotes.trim(),
                  });
                  setCustomItemName("");
                  setCustomItemCategory("misc");
                  setCustomItemQuantity("1");
                  setCustomItemAttackBonus("");
                  setCustomItemDamage("");
                  setCustomItemNotes("");
                }}
              >
                Add custom item
              </button>
            </div>
          </div>

          <div className="equipment-step__manualCard">
            <span className="builder-panel__label">Treasure and quest notes</span>
            <label className="builder-field">
              <span className="builder-summary__meta">Additional treasure</span>
              <MarkdownEditor
                compact
                placeholder="Loose valuables, favors owed, future loot promises, or stash notes."
                slashContext="Additional treasure"
                value={equipmentNotes.additionalTreasure}
                onChange={(value) =>
                  onEquipmentNotesChange({
                    ...equipmentNotes,
                    additionalTreasure: value,
                  })
                }
              />
            </label>
            <label className="builder-field">
              <span className="builder-summary__meta">Quest items</span>
              <MarkdownEditor
                compact
                placeholder="Story artifacts, keys, letters, badges, and items tracked outside normal inventory."
                slashContext="Quest items"
                value={equipmentNotes.questItems}
                onChange={(value) =>
                  onEquipmentNotesChange({
                    ...equipmentNotes,
                    questItems: value,
                  })
                }
              />
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}
