"use client";

import { useEffect, useMemo, useState } from "react";

import { CatalogSelector, type CatalogItem } from "@/components/catalog-selector";
import { MarkdownEditor } from "@/components/markdown-editor";
import type { AbilityKey, CharacterCurrency, CharacterEquipmentNotes, CharacterInventoryItem } from "@/lib/characters/types";
import type { EquipmentCatalogEntry } from "@/lib/equipment/catalog";
import { getMergedEquipmentCatalog } from "@/lib/equipment/catalog";
import type { EquipmentAcquisitionMode, InventoryCategory } from "@/lib/equipment/inventory";
import {
  BASE_WEAPON_OPTIONS,
  getBaseWeaponOptionsForInventoryItem,
  getCurrencyTotalInGp,
  getInventoryEffectSummary,
  isGenericDamageValue,
  needsBaseWeaponChoice,
  needsBaseWeaponResolution,
  summarizeInventory,
} from "@/lib/equipment/inventory";
import type { StartingEquipmentPlan } from "@/lib/equipment/starting-equipment";

type EquipmentStepProps = {
  plan: StartingEquipmentPlan;
  mode: EquipmentAcquisitionMode;
  goldOverrideGp: number | null;
  selections: Record<string, string>;
  inventoryItems: CharacterInventoryItem[];
  currency: CharacterCurrency;
  equipmentNotes: CharacterEquipmentNotes;
  effectiveAbilities: Record<AbilityKey, number>;
  attunementLimit: number;
  onModeChange: (mode: EquipmentAcquisitionMode) => void;
  onGoldOverrideChange: (value: number | null) => void;
  onSelect: (groupId: string, optionId: string) => void;
  onToggleEquipped: (itemId: string) => void;
  onToggleAttuned: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (
    itemId: string,
    patch: {
      name: string;
      category: InventoryCategory;
      quantity: number;
      attackBonus: string;
      baseItemId: string;
      baseItemName: string;
      baseDamage: string;
      damage: string;
      notes: string;
    },
  ) => void;
  onAddManualItem: (entry: EquipmentCatalogEntry) => void;
  onAddCustomItem: (input: {
    name: string;
    category: InventoryCategory;
    quantity: number;
    attackBonus: string;
    baseItemId: string;
    baseItemName: string;
    baseDamage: string;
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
  "Requires attunement",
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

const DM_GRANT_ROWS: Array<{
  key: keyof Pick<
    CharacterEquipmentNotes,
    | "additionalSpells"
    | "additionalProficiencies"
    | "additionalLanguages"
    | "additionalFeats"
    | "additionalFeatures"
    | "additionalAbilityScores"
  >;
  title: string;
  description: string;
  nextSurface: string;
}> = [
  {
    key: "additionalSpells",
    title: "Additional spells",
    description: "DM-granted spells, item spells, boons, and table exceptions.",
    nextSurface: "Spell picker with cantrip/leveled filters and source-aware detail preview.",
  },
  {
    key: "additionalProficiencies",
    title: "Additional proficiencies",
    description: "Skills, tools, weapons, armor, saves, expertise, and conditional proficiencies.",
    nextSurface: "Proficiency picker using the same family resolver as class, race, and background choices.",
  },
  {
    key: "additionalLanguages",
    title: "Additional languages",
    description: "Learned, granted, temporary, or campaign-specific languages.",
    nextSurface: "Language picker with custom-language support for table-specific settings.",
  },
  {
    key: "additionalFeats",
    title: "Additional feats",
    description: "Bonus feats, feat-like boons, and DM-approved prerequisite exceptions.",
    nextSurface: "Feat browser with prerequisites, source filters, and explicit manual-grant provenance.",
  },
  {
    key: "additionalFeatures",
    title: "Additional features",
    description: "Blessings, charms, curses, faction benefits, custom class features, and item traits.",
    nextSurface: "Feature browser plus custom feature cards that flow into review/sheet/PDF.",
  },
  {
    key: "additionalAbilityScores",
    title: "Additional ASIs / ability changes",
    description: "Permanent ASIs, temporary score setters, penalties, and training rewards.",
    nextSurface: "ASI editor that distinguishes score increases, set-to values, and conditional effects.",
  },
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
  effectiveAbilities,
  attunementLimit,
  onModeChange,
  onGoldOverrideChange,
  onSelect,
  onToggleEquipped,
  onToggleAttuned,
  onRemoveItem,
  onUpdateItem,
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
  const [customItemBaseId, setCustomItemBaseId] = useState("");
  const [customItemDamage, setCustomItemDamage] = useState("");
  const [customItemNotes, setCustomItemNotes] = useState("");
  const [editingItemId, setEditingItemId] = useState("");
  const [editingItemName, setEditingItemName] = useState("");
  const [editingItemCategory, setEditingItemCategory] = useState<InventoryCategory>("misc");
  const [editingItemQuantity, setEditingItemQuantity] = useState("1");
  const [editingItemAttackBonus, setEditingItemAttackBonus] = useState("");
  const [editingItemBaseId, setEditingItemBaseId] = useState("");
  const [editingItemBaseName, setEditingItemBaseName] = useState("");
  const [editingItemBaseDamage, setEditingItemBaseDamage] = useState("");
  const [editingItemDamage, setEditingItemDamage] = useState("");
  const [editingItemNotes, setEditingItemNotes] = useState("");
  const summary = useMemo(() => summarizeInventory(inventoryItems, attunementLimit), [attunementLimit, inventoryItems]);
  const effectSummary = useMemo(
    () => getInventoryEffectSummary(inventoryItems, { abilities: effectiveAbilities, attunementLimit }),
    [attunementLimit, effectiveAbilities, inventoryItems],
  );

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
        const needsBaseWeapon = item.mechanicsLines.some((line) => isGenericDamageValue(line));
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
            needsBaseWeapon ? "Needs base weapon after adding" : "",
            item.attunable ? "Requires attunement" : "",
            ...item.impactLines,
          ].filter(Boolean),
          mechanicsLines: item.mechanicsLines,
        };
      }),
    [catalogItems, manualItemCounts],
  );

  const parsedCustomItemQuantity = Math.max(1, Number(customItemQuantity) || 1);
  const parsedEditingItemQuantity = Math.max(1, Number(editingItemQuantity) || 1);
  const selectedCustomBaseWeapon = BASE_WEAPON_OPTIONS.find((option) => option.id === customItemBaseId);
  const currentEquipmentWarnings = useMemo(
    () =>
      Array.from(
        new Set([
          ...inventoryItems
            .filter(needsBaseWeaponChoice)
            .map((item) => `${item.name} needs a base weapon choice before sheet/PDF attack rows can be complete.`),
          ...effectSummary.warnings,
        ]),
      ),
    [effectSummary.warnings, inventoryItems],
  );

  function startEditingItem(item: CharacterInventoryItem) {
    setEditingItemId(item.id);
    setEditingItemName(item.name);
    setEditingItemCategory((item.category as InventoryCategory) ?? "misc");
    setEditingItemQuantity(String(item.quantity || 1));
    setEditingItemAttackBonus(item.attackBonus ?? "");
    setEditingItemBaseId(item.baseItemId ?? "");
    setEditingItemBaseName(item.baseItemName ?? "");
    setEditingItemBaseDamage(item.baseDamage ?? "");
    setEditingItemDamage(item.damage ?? "");
    setEditingItemNotes(item.notes ?? "");
  }

  function clearEditingItem() {
    setEditingItemId("");
    setEditingItemName("");
    setEditingItemCategory("misc");
    setEditingItemQuantity("1");
    setEditingItemAttackBonus("");
    setEditingItemBaseId("");
    setEditingItemBaseName("");
    setEditingItemBaseDamage("");
    setEditingItemDamage("");
    setEditingItemNotes("");
  }

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
              <span>
                {summary.attunable} attunable, limit {summary.attunementLimit}
              </span>
            </article>
          </div>
          <div className="equipment-step__effects">
            <span className="builder-panel__label">Equipment effects</span>
            {effectSummary.acLines.length ||
            effectSummary.weaponLines.length ||
            effectSummary.itemGrantLines.length ? (
              <ul className="equipment-step__effectList">
                {effectSummary.acLines.map((line) => (
                  <li key={`ac-${line}`}>{line}</li>
                ))}
                {effectSummary.weaponLines.map((line) => (
                  <li key={`weapon-${line}`}>{line}</li>
                ))}
                {effectSummary.itemGrantLines.map((line) => (
                  <li key={`grant-${line}`}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="builder-summary__meta">
                Equip gear to preview AC, weapon, and attunement-sensitive effects.
              </p>
            )}
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
          <span>Starting gear builder</span>
          <small>
            {mode === "gold"
              ? "Class gear collapsed while using gold"
              : `${availableClassGroups.length + availableBackgroundGroups.length} sections`}
          </small>
        </summary>
        <div className="equipment-step__accordionBody">
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

      <details className="equipment-step__accordion equipment-step__accordion--wide" open>
        <summary className="equipment-step__accordionSummary">
          <span>Owned inventory</span>
          <small>{summary.uniqueItems} owned entries</small>
        </summary>
        <div className="equipment-step__accordionBody">
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

          {currentEquipmentWarnings.length ? (
            <div className="equipment-step__localWarnings" role="status">
              <span className="builder-panel__label">Inventory attention</span>
              <ul>
                {currentEquipmentWarnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}

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
                  visibleInventoryItems.map((item) => {
                    const baseWeaponOptions = getBaseWeaponOptionsForInventoryItem(item);
                    const baseWeaponRequired =
                      baseWeaponOptions.length > 0 &&
                      !editingItemBaseId &&
                      (needsBaseWeaponResolution(item) ||
                        isGenericDamageValue(editingItemDamage) ||
                        isGenericDamageValue(item.damage));
                    const attunementBlocked =
                      item.attunable &&
                      !item.attuned &&
                      effectSummary.attunedCount >= effectSummary.attunementLimit;

                    return (
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
                            aria-label={item.equipped ? `Unequip ${item.name}` : `Equip ${item.name}`}
                            className={`choice-chip equipment-step__actionButton${item.equipped ? " choice-chip--active" : ""}`}
                            title={item.equipped ? "Unequip" : "Equip"}
                            type="button"
                            onClick={() => onToggleEquipped(item.id)}
                          >
                            <span aria-hidden="true">{item.equipped ? "✓" : "□"}</span>
                            <span>{item.equipped ? "Equipped" : "Equip"}</span>
                          </button>
                        ) : null}
                        {item.attunable ? (
                          <button
                            aria-label={item.attuned ? `Unattune ${item.name}` : `Attune ${item.name}`}
                            className={`choice-chip equipment-step__actionButton${item.attuned ? " choice-chip--active" : ""}`}
                            type="button"
                            disabled={attunementBlocked}
                            onClick={() => onToggleAttuned(item.id)}
                            title={attunementBlocked ? `Attunement limit is ${effectSummary.attunementLimit}.` : item.attuned ? "Unattune" : "Attune"}
                          >
                            <span aria-hidden="true">{item.attuned ? "✦" : "◇"}</span>
                            <span>{item.attuned ? "Attuned" : "Attune"}</span>
                          </button>
                        ) : null}
                        {attunementBlocked ? (
                          <span className="equipment-step__actionWarning">
                            Limit {effectSummary.attunedCount}/{effectSummary.attunementLimit}
                          </span>
                        ) : null}
                        {item.source === "manual" ? (
                          <button
                            aria-label={`Edit ${item.name}`}
                            className="choice-chip equipment-step__actionButton"
                            title="Edit"
                            type="button"
                            onClick={() => startEditingItem(item)}
                          >
                            <span aria-hidden="true">✎</span>
                            <span>Edit</span>
                          </button>
                        ) : null}
                        <button
                          aria-label={`Delete ${item.name}`}
                          className="choice-chip equipment-step__actionButton"
                          title="Delete"
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <span aria-hidden="true">×</span>
                          <span>Delete</span>
                        </button>
                      </div>
                      {item.attackBonus || item.baseItemName || item.baseDamage || item.damage || item.notes ? (
                        <div className="equipment-step__inventoryNote">
                          {item.attackBonus ? <span>Modifier: {item.attackBonus}</span> : null}
                          {item.baseItemName ? <span>Base: {item.baseItemName}</span> : null}
                          {item.baseDamage ? <span>Base damage: {item.baseDamage}</span> : null}
                          {item.damage ? <span>Damage: {item.damage}</span> : null}
                          {item.notes ? <span>{item.notes}</span> : null}
                        </div>
                      ) : null}
                      {editingItemId === item.id ? (
                        <div className="equipment-step__editPanel">
                          <div className="equipment-step__manualRow equipment-step__manualRow--balanced">
                            <label className="builder-field">
                              <span className="builder-summary__meta">Item name</span>
                              <input
                                className="input"
                                value={editingItemName}
                                onChange={(event) => setEditingItemName(event.target.value)}
                              />
                            </label>
                            <label className="builder-field">
                              <span className="builder-summary__meta">Qty</span>
                              <input
                                className="input"
                                inputMode="numeric"
                                min={1}
                                type="number"
                                value={editingItemQuantity}
                                onChange={(event) => setEditingItemQuantity(event.target.value)}
                              />
                            </label>
                          </div>
                          <div className="equipment-step__manualRow equipment-step__manualRow--balanced">
                            <label className="builder-field">
                              <span className="builder-summary__meta">Category</span>
                              <select
                                className="input"
                                value={editingItemCategory}
                                onChange={(event) => setEditingItemCategory(event.target.value as InventoryCategory)}
                              >
                                {CUSTOM_ITEM_CATEGORY_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="builder-field">
                              <span className="builder-summary__meta">Modifier</span>
                              <input
                                className="input"
                                placeholder="+1, +2..."
                                value={editingItemAttackBonus}
                                onChange={(event) => setEditingItemAttackBonus(event.target.value)}
                              />
                            </label>
                          </div>
                          {baseWeaponOptions.length ? (
                            <label className="builder-field">
                              <span className="builder-summary__meta">
                                Base weapon for sheet/PDF damage{baseWeaponRequired ? " (required)" : ""}
                              </span>
                              <select
                                className="input"
                                value={editingItemBaseId}
                                onChange={(event) => {
                                  const option = baseWeaponOptions.find((candidate) => candidate.id === event.target.value);
                                  setEditingItemBaseId(option?.id ?? "");
                                  setEditingItemBaseName(option?.name ?? "");
                                  setEditingItemBaseDamage(option?.damage ?? "");
                                  if (
                                    option &&
                                    (!editingItemDamage ||
                                      editingItemDamage === editingItemBaseDamage ||
                                      isGenericDamageValue(editingItemDamage))
                                  ) {
                                    setEditingItemDamage(option.damage);
                                  }
                                }}
                              >
                                <option value="">Choose base weapon...</option>
                                {baseWeaponOptions.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.name} - {option.damage}
                                  </option>
                                ))}
                              </select>
                              {baseWeaponRequired ? (
                                <span className="builder-summary__meta builder-summary__meta--warning">
                                  Pick the underlying weapon so attacks and PDF damage can resolve.
                                </span>
                              ) : null}
                            </label>
                          ) : null}
                          <label className="builder-field">
                            <span className="builder-summary__meta">Damage</span>
                            <input
                              className="input"
                              placeholder="1d8 slashing, +1d6 fire..."
                              value={editingItemDamage}
                              onChange={(event) => setEditingItemDamage(event.target.value)}
                            />
                          </label>
                          <label className="builder-field">
                            <span className="builder-summary__meta">Notes</span>
                            <MarkdownEditor
                              compact
                              placeholder="Optional details, effects, provenance, or table ruling."
                              slashContext="Inventory item notes"
                              value={editingItemNotes}
                              onChange={setEditingItemNotes}
                            />
                          </label>
                          <div className="equipment-step__manualActions">
                            <button
                              className="button button--secondary button--compact"
                              type="button"
                              disabled={!editingItemName.trim() || baseWeaponRequired}
                              onClick={() => {
                                if (!editingItemName.trim() || baseWeaponRequired) {
                                  return;
                                }
                                onUpdateItem(item.id, {
                                  name: editingItemName.trim(),
                                  category: editingItemCategory,
                                  quantity: parsedEditingItemQuantity,
                                  attackBonus: editingItemAttackBonus.trim(),
                                  baseItemId: editingItemBaseId,
                                  baseItemName: editingItemBaseName,
                                  baseDamage: editingItemBaseDamage,
                                  damage: editingItemDamage.trim(),
                                  notes: editingItemNotes.trim(),
                                });
                                clearEditingItem();
                              }}
                            >
                              Save item
                            </button>
                            <button
                              className="button button--ghost button--compact"
                              type="button"
                              onClick={clearEditingItem}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })
                ) : (
                  <p className="builder-summary__meta">No inventory entries match the current view.</p>
                )}
              </div>
            </div>
          </div>
            </aside>
        </div>
      </details>

      <details className="equipment-step__accordion equipment-step__accordion--wide" open>
        <summary className="equipment-step__accordionSummary">
          <span>Item browser</span>
          <small>{itemCatalogCards.length} entries</small>
        </summary>
        <div className="equipment-step__accordionBody">
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
        </div>
      </details>

      <details className="equipment-step__accordion equipment-step__accordion--wide" open>
        <summary className="equipment-step__accordionSummary">
          <span>Manual additions</span>
          <small>Items, notes, and DM grants</small>
        </summary>
        <div className="equipment-step__accordionBody">
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
            <div className="equipment-step__manualRow equipment-step__manualRow--balanced">
              <label className="builder-field">
                <span className="builder-summary__meta">Modifier</span>
                <input
                  className="input"
                  placeholder="+1, +2, advantage, table ruling..."
                  value={customItemAttackBonus}
                  onChange={(event) => setCustomItemAttackBonus(event.target.value)}
                />
              </label>
              <span aria-hidden="true" />
            </div>
            {customItemCategory === "weapon" ? (
              <label className="builder-field">
                <span className="builder-summary__meta">Base weapon for sheet/PDF damage</span>
                <select
                  className="input"
                  value={customItemBaseId}
                  onChange={(event) => {
                    const option = BASE_WEAPON_OPTIONS.find((candidate) => candidate.id === event.target.value);
                    setCustomItemBaseId(option?.id ?? "");
                    if (option && !customItemDamage) {
                      setCustomItemDamage(option.damage);
                    }
                  }}
                >
                  <option value="">Choose base weapon...</option>
                  {BASE_WEAPON_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} - {option.damage}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="builder-field">
              <span className="builder-summary__meta">Damage</span>
              <input
                className="input"
                placeholder="1d8 slashing, +1d6 fire..."
                value={customItemDamage}
                onChange={(event) => setCustomItemDamage(event.target.value)}
              />
            </label>
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
                    baseItemId: selectedCustomBaseWeapon?.id ?? "",
                    baseItemName: selectedCustomBaseWeapon?.name ?? "",
                    baseDamage: selectedCustomBaseWeapon?.damage ?? "",
                    damage: customItemDamage.trim(),
                    notes: customItemNotes.trim(),
                  });
                  setCustomItemName("");
                  setCustomItemCategory("misc");
                  setCustomItemQuantity("1");
                  setCustomItemAttackBonus("");
                  setCustomItemBaseId("");
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
      </details>

      <details className="equipment-step__accordion equipment-step__accordion--wide" open>
        <summary className="equipment-step__accordionSummary">
          <span>Manual / DM-granted extras</span>
          <small>M4.4 picker surface</small>
        </summary>
        <div className="equipment-step__accordionBody">
          <section className="equipment-step__panel">
            <div className="equipment-step__groupHeader">
              <span className="builder-panel__label">Additional build grants</span>
              <p className="builder-summary__meta">
                These grants should be selected from proper catalogs, not typed as loose notes. This card is now the M4.4 landing zone: each row gets a workbench/table picker, and selected grants will live in a separate additional-inventory list that is always active unless deleted.
              </p>
            </div>
            <div className="equipment-step__grantRows">
              {DM_GRANT_ROWS.map((row) => {
                const legacyValue = equipmentNotes[row.key]?.trim();
                return (
                  <details className="equipment-step__grantRow" key={row.key}>
                    <summary className="equipment-step__grantSummary">
                      <span>{row.title}</span>
                      <small>{legacyValue ? "Legacy note saved" : "No additions yet"}</small>
                    </summary>
                    <div className="equipment-step__grantBody">
                      <p>{row.description}</p>
                      <p className="builder-summary__meta">{row.nextSurface}</p>
                      {legacyValue ? (
                        <div className="equipment-step__legacyGrant">
                          <span className="builder-panel__label">Existing placeholder note</span>
                          <p>{legacyValue}</p>
                        </div>
                      ) : null}
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
        </div>
      </details>
    </div>
  );
}
