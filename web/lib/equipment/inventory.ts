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
export type InventoryItemSourceKind = InventoryItemSource | "manual";

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

export const ATTUNEMENT_LIMIT = 3;

export type BaseWeaponOption = {
  id: string;
  name: string;
  damage: string;
  group: "axes" | "bows" | "crossbows" | "daggers" | "hammers" | "polearms" | "swords" | "weapons";
};

export const BASE_WEAPON_OPTIONS: BaseWeaponOption[] = [
  { id: "club", name: "Club", damage: "1d4 bludgeoning", group: "weapons" },
  { id: "dagger", name: "Dagger", damage: "1d4 piercing", group: "daggers" },
  { id: "greatclub", name: "Greatclub", damage: "1d8 bludgeoning", group: "weapons" },
  { id: "handaxe", name: "Handaxe", damage: "1d6 slashing", group: "axes" },
  { id: "javelin", name: "Javelin", damage: "1d6 piercing", group: "weapons" },
  { id: "light-hammer", name: "Light Hammer", damage: "1d4 bludgeoning", group: "hammers" },
  { id: "mace", name: "Mace", damage: "1d6 bludgeoning", group: "weapons" },
  { id: "quarterstaff", name: "Quarterstaff", damage: "1d6 bludgeoning", group: "weapons" },
  { id: "sickle", name: "Sickle", damage: "1d4 slashing", group: "weapons" },
  { id: "spear", name: "Spear", damage: "1d6 piercing", group: "polearms" },
  { id: "battleaxe", name: "Battleaxe", damage: "1d8 slashing", group: "axes" },
  { id: "flail", name: "Flail", damage: "1d8 bludgeoning", group: "weapons" },
  { id: "glaive", name: "Glaive", damage: "1d10 slashing", group: "polearms" },
  { id: "greataxe", name: "Greataxe", damage: "1d12 slashing", group: "axes" },
  { id: "greatsword", name: "Greatsword", damage: "2d6 slashing", group: "swords" },
  { id: "halberd", name: "Halberd", damage: "1d10 slashing", group: "polearms" },
  { id: "lance", name: "Lance", damage: "1d12 piercing", group: "polearms" },
  { id: "longsword", name: "Longsword", damage: "1d8 slashing", group: "swords" },
  { id: "maul", name: "Maul", damage: "2d6 bludgeoning", group: "hammers" },
  { id: "morningstar", name: "Morningstar", damage: "1d8 piercing", group: "weapons" },
  { id: "pike", name: "Pike", damage: "1d10 piercing", group: "polearms" },
  { id: "rapier", name: "Rapier", damage: "1d8 piercing", group: "swords" },
  { id: "scimitar", name: "Scimitar", damage: "1d6 slashing", group: "swords" },
  { id: "shortsword", name: "Shortsword", damage: "1d6 piercing", group: "swords" },
  { id: "trident", name: "Trident", damage: "1d6 piercing", group: "polearms" },
  { id: "war-pick", name: "War Pick", damage: "1d8 piercing", group: "weapons" },
  { id: "warhammer", name: "Warhammer", damage: "1d8 bludgeoning", group: "hammers" },
  { id: "whip", name: "Whip", damage: "1d4 slashing", group: "weapons" },
  { id: "shortbow", name: "Shortbow", damage: "1d6 piercing", group: "bows" },
  { id: "longbow", name: "Longbow", damage: "1d8 piercing", group: "bows" },
  { id: "light-crossbow", name: "Light Crossbow", damage: "1d8 piercing", group: "crossbows" },
  { id: "heavy-crossbow", name: "Heavy Crossbow", damage: "1d10 piercing", group: "crossbows" },
  { id: "hand-crossbow", name: "Hand Crossbow", damage: "1d6 piercing", group: "crossbows" },
];

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

export function isInventoryItemAttunable(
  attunement?: string | null,
  rarity?: string | null,
  name?: string,
) {
  if (attunement && attunement.trim()) {
    return true;
  }

  if (!name) {
    return false;
  }

  return /\brequires attunement\b/i.test(name) || /\battunement\b/i.test(rarity ?? "");
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

function parseNumericBonus(value?: string) {
  const match = value?.match(/\+?\s*(\d+)/);
  return match ? Number(match[1]) : 0;
}

export function inferItemEnhancementBonus(item: Pick<CharacterInventoryItem, "name" | "attackBonus">) {
  return parseNumericBonus(item.attackBonus) || parseNumericBonus(item.name.match(/,\s*\+(\d+)/)?.[0]);
}

function isWeaponLike(item: CharacterInventoryItem) {
  return (
    item.category === "weapon" ||
    item.family?.toLowerCase().includes("magic weapon") ||
    /\b(weapon|sword|blade|axe|bow|crossbow|dagger|hammer|staff|mace|spear|lance|pike|glaive|halberd|whip)\b/i.test(item.name)
  );
}

export function getBaseWeaponOptionsForInventoryItem(item: CharacterInventoryItem) {
  if (!isWeaponLike(item)) {
    return [];
  }

  const haystack = `${item.name} ${item.family ?? ""} ${item.itemType ?? ""} ${item.damage ?? ""}`.toLowerCase();
  const groups = new Set<BaseWeaponOption["group"]>();

  if (/\b(sword|blade|scimitar|rapier)\b/.test(haystack)) {
    groups.add("swords");
  }
  if (/\baxe\b/.test(haystack)) {
    groups.add("axes");
  }
  if (/\bbow\b/.test(haystack)) {
    groups.add("bows");
  }
  if (/\bcrossbow\b/.test(haystack)) {
    groups.add("crossbows");
  }
  if (/\bdagger\b/.test(haystack)) {
    groups.add("daggers");
  }
  if (/\bhammer|maul\b/.test(haystack)) {
    groups.add("hammers");
  }
  if (/\bstaff|spear|lance|pike|glaive|halberd\b/.test(haystack)) {
    groups.add("polearms");
  }

  if (!groups.size) {
    groups.add("weapons");
    groups.add("swords");
    groups.add("axes");
    groups.add("bows");
    groups.add("crossbows");
  }

  return BASE_WEAPON_OPTIONS.filter((option) => groups.has(option.group));
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
  const manualItems = existingItems.filter(
    (item) => item.source === "manual" || item.source === "gold",
  );

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
      sourceName: previous?.sourceName,
      sourceUrl: previous?.sourceUrl,
      rarity: previous?.rarity,
      cost: previous?.cost,
      weight: previous?.weight,
      slot: previous?.slot,
      family: previous?.family,
      itemType: previous?.itemType,
      equippable: previous?.equippable ?? isInventoryItemEquippable(parsed.name, category),
      equipped: previous?.equipped ?? false,
      attunable: previous?.attunable ?? false,
      attuned: previous?.attuned ?? false,
      attackBonus: previous?.attackBonus,
      baseItemId: previous?.baseItemId,
      baseItemName: previous?.baseItemName,
      baseDamage: previous?.baseDamage,
      damage: previous?.damage,
      notes: previous?.notes,
      detailHtml: previous?.detailHtml,
    });
  }

  for (const item of manualItems) {
    if (removed.has(item.id)) {
      continue;
    }

    items.push(item);
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
    attunementLimit: ATTUNEMENT_LIMIT,
    attunementOverLimit: Math.max(0, attuned - ATTUNEMENT_LIMIT),
  };
}

function getArmorShieldAcLine(item: CharacterInventoryItem) {
  if (!item.equipped || !["armor", "shield"].includes(item.category)) {
    return "";
  }

  if (item.attunable && !item.attuned) {
    return `${item.name}: equipped, attunement required before magic effects apply`;
  }

  if (item.category === "shield" || /\bshield\b/i.test(item.name)) {
    const enhancement = inferItemEnhancementBonus(item);
    const total = 2 + enhancement;
    return `${item.name}: +${total} AC while equipped${enhancement ? ` (+2 shield, +${enhancement} magic)` : ""}`;
  }

  const enhancement = inferItemEnhancementBonus(item);
  return enhancement
    ? `${item.name}: +${enhancement} armor bonus while equipped`
    : `${item.name}: armor equipped; final AC formula resolves on the sheet`;
}

function getWeaponEffectLine(item: CharacterInventoryItem) {
  if (!item.equipped || !isWeaponLike(item)) {
    return "";
  }

  if (item.attunable && !item.attuned) {
    return `${item.name}: equipped, attunement required before magic effects apply`;
  }

  const enhancement = inferItemEnhancementBonus(item);
  const baseName = item.baseItemName ? ` (${item.baseItemName})` : "";
  const damage = item.damage || item.baseDamage;
  const pieces = [
    `${item.name}${baseName}`,
    enhancement ? `+${enhancement} attack/damage` : "",
    damage ? damage : "damage die unresolved",
  ].filter(Boolean);

  return pieces.join(": ");
}

export function getInventoryEffectSummary(items: CharacterInventoryItem[]) {
  const attunedItems = items.filter((item) => item.attuned);
  const equippedItems = items.filter((item) => item.equipped);
  const acLines = items.map(getArmorShieldAcLine).filter(Boolean);
  const weaponLines = items.map(getWeaponEffectLine).filter(Boolean);
  const warnings = [
    attunedItems.length > ATTUNEMENT_LIMIT
      ? `Attunement limit exceeded: ${attunedItems.length}/${ATTUNEMENT_LIMIT}.`
      : "",
    ...items
      .filter((item) => item.equipped && item.attunable && !item.attuned)
      .map((item) => `${item.name} is equipped but not attuned; its attunement-gated effects should stay inactive.`),
    ...items
      .filter((item) => item.equipped && isWeaponLike(item) && !item.damage && !item.baseDamage)
      .map((item) => `${item.name} needs a base weapon or damage value before sheet/PDF attack rows can be complete.`),
  ].filter(Boolean);

  return {
    attunementLimit: ATTUNEMENT_LIMIT,
    attunedCount: attunedItems.length,
    equippedCount: equippedItems.length,
    acLines,
    weaponLines,
    warnings,
  };
}
