import type { CharacterCurrency, CharacterInventoryItem } from "@/lib/characters/types";
import type { StartingEquipmentPlan } from "@/lib/equipment/starting-equipment";

export type EquipmentAcquisitionMode = "gear" | "gold";

export type InventoryCategory =
  | "weapon"
  | "armor"
  | "shield"
  | "focus"
  | "ammo"
  | "tool"
  | "instrument"
  | "pack"
  | "clothing"
  | "book"
  | "holy-symbol"
  | "consumable"
  | "treasure"
  | "misc";

export type InventoryItemSource = "class" | "background" | "starting-fixed" | "starting-choice" | "gold";

type ParsedItem = {
  name: string;
  quantity: number;
  currency?: keyof CharacterCurrency;
};

const CATEGORY_RULES: Array<{ match: RegExp; category: InventoryCategory }> = [
  { match: /\b(chain mail|leather armor|studded leather|scale mail|breastplate|splint|plate|armor)\b/i, category: "armor" },
  { match: /\bshield\b/i, category: "shield" },
  { match: /\b(longbow|crossbow|shortbow|rapier|sword|dagger|handaxe|axe|mace|hammer|staff|quarterstaff|weapon|bow)\b/i, category: "weapon" },
  { match: /\bbolts?\b|\barrows?\b|\bquiver\b/i, category: "ammo" },
  { match: /\bcomponent pouch\b|\barcane focus\b|\bholy symbol\b|\bdruidic focus\b/i, category: "focus" },
  { match: /\bpack\b/i, category: "pack" },
  { match: /\btool\b|\bdice\b|\bcards\b/i, category: "tool" },
  { match: /\binstrument\b/i, category: "instrument" },
  { match: /\bclothes\b|\bvestments\b/i, category: "clothing" },
  { match: /\bbook\b|\bspellbook\b|\bletter\b|\bprayer wheel\b/i, category: "book" },
  { match: /\bincense\b|\bink\b|\bquill\b/i, category: "consumable" },
  { match: /\bpouch\b|\bgp\b|\bcoin\b/i, category: "treasure" },
];

const EQUIPPABLE_CATEGORIES = new Set<InventoryCategory>([
  "weapon",
  "armor",
  "shield",
  "focus",
  "instrument",
  "tool",
  "clothing",
]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseQuantityAndCurrency(raw: string): ParsedItem {
  const trimmed = raw.trim();
  const currencyMatch = trimmed.match(/^Belt Pouch \((\d+)\s*gp\)$/i);
  if (currencyMatch) {
    return { name: "Belt Pouch", quantity: 1, currency: "gp" };
  }

  const leadingQuantity = trimmed.match(/^(\d+)\s+(.+)$/);
  if (leadingQuantity) {
    return {
      quantity: Number(leadingQuantity[1]),
      name: leadingQuantity[2].trim(),
    };
  }

  return { name: trimmed, quantity: 1 };
}

export function categorizeInventoryItem(name: string): InventoryCategory {
  const rule = CATEGORY_RULES.find((entry) => entry.match.test(name));
  return rule?.category ?? "misc";
}

export function getInventoryItemKey(name: string, sourceLabel: string) {
  return `${slugify(sourceLabel)}::${slugify(name)}`;
}

export function isInventoryItemEquippable(name: string, category: InventoryCategory) {
  if (category === "tool" && !/\b(tool|dice|cards)\b/i.test(name)) {
    return false;
  }

  return EQUIPPABLE_CATEGORIES.has(category);
}

export function createEmptyCurrency(): CharacterCurrency {
  return { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
}

export function getCurrencyTotalInGp(currency: CharacterCurrency) {
  return currency.gp + currency.pp * 10 + currency.ep * 0.5 + currency.sp * 0.1 + currency.cp * 0.01;
}

export function buildStartingInventoryFromPlan(
  plan: StartingEquipmentPlan,
  selections: Record<string, string>,
  mode: EquipmentAcquisitionMode,
  goldOverrideGp: number | null,
  existingItems: CharacterInventoryItem[],
  removedItemIds: string[],
) {
  const preservedByKey = new Map(existingItems.map((item) => [item.id, item]));
  const removed = new Set(removedItemIds);
  const items: CharacterInventoryItem[] = [];
  const currency = createEmptyCurrency();

  if (mode === "gold" && plan.goldAlternative) {
    currency.gp += goldOverrideGp ?? plan.goldAlternative.averageGp;
  }

  const allEntries: Array<{ source: InventoryItemSource; label: string; raw: string }> = [];

  for (const item of plan.autoItems) {
    if (mode === "gold" && item.source === "class") {
      continue;
    }
    allEntries.push({
      source: "starting-fixed",
      label: item.source === "class" ? "Class gear" : "Auto-added",
      raw: item.name,
    });
  }

  for (const group of plan.choiceGroups) {
    if (mode === "gold" && group.source === "class") {
      continue;
    }
    const selectedId = selections[group.id];
    const selectedOption = group.options.find((option) => option.id === selectedId);
    if (!selectedOption) {
      continue;
    }
    for (const item of selectedOption.items) {
      allEntries.push({
        source: "starting-choice",
        label: group.title,
        raw: item,
      });
    }
  }

  for (const entry of allEntries) {
    const parsed = parseQuantityAndCurrency(entry.raw);
    if (parsed.currency) {
      currency[parsed.currency] += parsed.quantity;
      continue;
    }

    const id = getInventoryItemKey(parsed.name, entry.label);
    if (removed.has(id)) {
      continue;
    }
    const previous = preservedByKey.get(id);
    const category = categorizeInventoryItem(parsed.name);
    items.push({
      id,
      name: parsed.name,
      quantity: parsed.quantity,
      category,
      source: entry.source,
      sourceLabel: entry.label,
      equippable: previous?.equippable ?? isInventoryItemEquippable(parsed.name, category),
      equipped: previous?.equipped ?? false,
      attunable: previous?.attunable ?? false,
      attuned: previous?.attuned ?? false,
      notes: previous?.notes,
    });
  }

  return {
    items,
    currency,
  };
}

export function summarizeInventory(items: CharacterInventoryItem[]) {
  const equipped = items.filter((item) => item.equipped).length;
  const attuned = items.filter((item) => item.attuned).length;
  const attunable = items.filter((item) => item.attunable).length;

  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    uniqueItems: items.length,
    equipped,
    attuned,
    attunable,
  };
}
