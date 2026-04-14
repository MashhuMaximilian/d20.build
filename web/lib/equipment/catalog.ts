import { getBuiltInSrdItems, type BuiltInItemElement } from "@/lib/builtins/items";
import { listCachedElements } from "@/lib/content-sources/cache";
import type { ImportedElement } from "@/lib/content-sources/types";
import {
  categorizeInventoryItem,
  isInventoryItemAttunable,
  isInventoryItemEquippable,
  type InventoryCategory,
} from "@/lib/equipment/inventory";

export type EquipmentCatalogOrigin = "built-in" | "imported";

export type EquipmentCatalogEntry = {
  id: string;
  name: string;
  elementType: string;
  origin: EquipmentCatalogOrigin;
  source: string;
  sourceUrl: string;
  description: string;
  detailHtml?: string;
  category: InventoryCategory;
  family: string;
  rawCategory?: string;
  rawSubtype?: string;
  rarity?: string;
  cost?: string;
  weight?: string;
  slot?: string;
  attunement?: string;
  equippable: boolean;
  attunable: boolean;
  filterTags: string[];
  detailTags: string[];
  summaryLines: string[];
  impactLines: string[];
  mechanicsLines: string[];
};

const ITEM_ELEMENT_TYPES = new Set(["Item", "Weapon", "Armor", "Magic Item"]);

function cleanValue(value?: string | null) {
  return value?.trim() || undefined;
}

type SetterEntry = {
  name: string;
  value: string;
  type?: string;
  modifier?: string;
  alt?: string;
};

function categoryFromText(value: string | undefined, fallbackName: string) {
  if (!value) {
    return categorizeInventoryItem(fallbackName);
  }

  const normalized = value.toLowerCase();
  if (normalized.includes("weapon")) {
    return "weapon";
  }
  if (normalized.includes("armor")) {
    return "armor";
  }
  if (normalized.includes("shield")) {
    return "shield";
  }
  if (normalized.includes("instrument")) {
    return "instrument";
  }
  if (normalized.includes("tool")) {
    return "tool";
  }
  if (normalized.includes("pack")) {
    return "pack";
  }
  if (normalized.includes("potion") || normalized.includes("poison") || normalized.includes("consumable")) {
    return "consumable";
  }
  if (normalized.includes("holy symbol")) {
    return "holy-symbol";
  }
  if (normalized.includes("focus")) {
    return "focus";
  }
  if (normalized.includes("ammunition")) {
    return "ammo";
  }
  if (normalized.includes("clothing")) {
    return "clothing";
  }
  if (normalized.includes("book")) {
    return "book";
  }
  if (normalized.includes("treasure")) {
    return "treasure";
  }

  return categorizeInventoryItem(fallbackName);
}

function familyFromEntry(input: {
  elementType: string;
  category?: string;
  subtype?: string;
  rarity?: string;
  name: string;
}) {
  const category = input.category?.toLowerCase() ?? "";
  const subtype = input.subtype?.toLowerCase() ?? "";
  const rarity = input.rarity?.toLowerCase() ?? "";
  const name = input.name.toLowerCase();

  if (input.elementType === "Magic Item" || rarity) {
    if (category.includes("wondrous") || subtype.includes("wondrous")) {
      return "Wondrous Items";
    }
    if (category.includes("ring")) {
      return "Rings";
    }
    if (category.includes("rod")) {
      return "Rods";
    }
    if (category.includes("staff")) {
      return "Staffs";
    }
    if (category.includes("wand")) {
      return "Wands";
    }
    if (category.includes("potion")) {
      return "Potions";
    }
    if (category.includes("poison")) {
      return "Poison";
    }
    if (category.includes("weapon")) {
      return "Magic Weapons";
    }
    if (category.includes("armor")) {
      return "Magic Armor";
    }
    if (category.includes("scroll")) {
      return "Scrolls";
    }
    if (category.includes("gift")) {
      return "Supernatural Gifts";
    }
    return "Magic Items";
  }

  if (category.includes("adventuring gear")) {
    return "Adventuring Gear";
  }
  if (category.includes("treasure")) {
    return "Treasure";
  }
  if (category.includes("equipment pack")) {
    return "Equipment Packs";
  }
  if (category.includes("tool")) {
    return "Tools";
  }
  if (category.includes("musical instrument")) {
    return "Musical Instruments";
  }
  if (category.includes("armor")) {
    return "Armor";
  }
  if (category.includes("weapon")) {
    return "Weapons";
  }
  if (category.includes("ammunition")) {
    return "Ammunition";
  }
  if (category.includes("mount") || category.includes("vehicle") || name.includes("saddle")) {
    return "Mounts & Vehicles";
  }
  if (category.includes("focus")) {
    return "Spellcasting Focus";
  }
  if (category.includes("alchemical")) {
    return "Alchemical Formulas";
  }
  if (category.includes("reagent")) {
    return "Reagents";
  }
  if (category.includes("explosive")) {
    return "Explosives";
  }

  return "Miscellaneous";
}

function getSetterEntriesMap(setters: SetterEntry[]) {
  const grouped = new Map<string, SetterEntry[]>();
  setters.forEach((setter) => {
    if (!setter.name) {
      return;
    }
    const current = grouped.get(setter.name) ?? [];
    current.push(setter);
    grouped.set(setter.name, current);
  });
  return grouped;
}

function getFirstSetterValue(setters: SetterEntry[], name: string) {
  return cleanValue(setters.find((setter) => setter.name === name)?.value);
}

function humanizeSupportTag(tag: string) {
  return tag
    .replace(/^ID_INTERNAL_/, "")
    .replace(/^ID_PROFICIENCY_/, "")
    .replace(/^WEAPON_CATEGORY_/, "")
    .replace(/^WEAPON_PROPERTY_/, "")
    .replace(/^WEAPON_GROUP_/, "")
    .replace(/^DAMAGE_TYPE_/, "")
    .replace(/^ARMOR_GROUP_/, "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function getPropertyLines(supports: string[]) {
  return supports
    .filter(
      (tag) =>
        tag.includes("WEAPON_PROPERTY") ||
        tag.includes("WEAPON_CATEGORY") ||
        tag.includes("DAMAGE_TYPE"),
    )
    .map(humanizeSupportTag);
}

function getMechanicalBreakdown(input: {
  elementType: string;
  setters: SetterEntry[];
  supports: string[];
  rawCategory?: string;
  rarity?: string;
  cost?: string;
  weight?: string;
  slot?: string;
  attunement?: string;
}) {
  const grouped = getSetterEntriesMap(input.setters);
  const damageEntries = grouped.get("damage") ?? [];
  const damageLine = damageEntries.length
    ? damageEntries
        .map((entry) => `${entry.value}${entry.type ? ` ${entry.type}` : ""}`.trim())
        .join(" / ")
    : "";
  const rangeLine = getFirstSetterValue(input.setters, "range");
  const enhancementLine = getFirstSetterValue(input.setters, "enhancement");
  const weaponBase = getFirstSetterValue(input.setters, "weapon");
  const armorBase = getFirstSetterValue(input.setters, "armor");
  const keywords = getFirstSetterValue(input.setters, "keywords");
  const properties = getPropertyLines(input.supports);

  return [
    input.rawCategory ? `Category: ${input.rawCategory}` : "",
    damageLine ? `Damage: ${damageLine}` : "",
    rangeLine ? `Range: ${rangeLine}` : "",
    enhancementLine ? `Enhancement: +${enhancementLine}` : "",
    weaponBase ? `Base weapon: ${weaponBase}` : "",
    armorBase ? `Base armor: ${humanizeSupportTag(armorBase)}` : "",
    keywords ? `Keywords: ${keywords}` : "",
    ...properties,
    input.rarity ? `Rarity: ${input.rarity}` : "Mundane",
    input.cost ? `Cost: ${input.cost}` : "",
    input.weight ? `Weight: ${input.weight}` : "",
    input.slot ? `Slot: ${input.slot}` : "",
    input.attunement ? `Attunement: ${input.attunement}` : "",
    input.elementType ? `Item type: ${input.elementType}` : "",
  ].filter(Boolean);
}

function getReferenceMarkup(input: {
  descriptionHtml?: string;
  description: string;
  mechanicsLines: string[];
}) {
  const mechanicsMarkup = input.mechanicsLines.length
    ? `<ul>${input.mechanicsLines.map((line) => `<li>${line}</li>`).join("")}</ul>`
    : "";

  if (input.descriptionHtml?.trim()) {
    return `${mechanicsMarkup}${input.descriptionHtml}`;
  }

  if (input.description.trim()) {
    return `${mechanicsMarkup}<p>${input.description}</p>`;
  }

  return mechanicsMarkup;
}

function normalizeBuiltInItem(item: BuiltInItemElement): EquipmentCatalogEntry {
  const rawCategory = cleanValue(item.category);
  const rawSubtype = cleanValue(item.subtype);
  const rarity = cleanValue(item.rarity);
  const cost = cleanValue(item.cost);
  const weight = cleanValue(item.weight);
  const slot = cleanValue(item.slot);
  const attunement = cleanValue(item.attunement);
  const category = categoryFromText(rawCategory, item.name);
  const family = familyFromEntry({
    elementType: item.type,
    category: rawCategory,
    subtype: rawSubtype,
    rarity,
    name: item.name,
  });
  const equippable = isInventoryItemEquippable(item.name, category);
  const attunable = isInventoryItemAttunable(attunement, rarity, item.name);
  const filterTags = [
    family,
    rawCategory || "",
    rawSubtype || "",
    category.replace(/-/g, " "),
    item.type,
    rarity ? `Rarity: ${rarity}` : "Mundane",
    attunable ? "Attunement" : "",
  ].filter(Boolean);
  const detailTags = [
    family,
    item.type,
    rarity || "Mundane",
    slot ? `Slot: ${slot}` : "",
    cost ? `Cost: ${cost}` : "",
    weight ? `Weight: ${weight}` : "",
    attunable ? "Requires attunement" : "",
  ].filter(Boolean);
  const summaryLines = [rawCategory, rawSubtype, cost, weight].filter(Boolean) as string[];
  const impactLines = [
    equippable ? "Can equip" : "",
    attunable ? "Can attune" : "",
    rarity ? `Magic: ${rarity}` : "Mundane gear",
  ].filter(Boolean);
  const mechanicsLines = getMechanicalBreakdown({
    elementType: item.type,
    setters: item.setters,
    supports: [...item.supports],
    rawCategory,
    rarity,
    cost,
    weight,
    slot,
    attunement,
  });

  return {
    id: item.id,
    name: item.name,
    elementType: item.type,
    origin: "built-in",
    source: item.source,
    sourceUrl: item.sourceUrl,
    description: item.description,
    detailHtml: getReferenceMarkup({
      descriptionHtml: item.descriptionHtml,
      description: item.description,
      mechanicsLines,
    }),
    category,
    family,
    rawCategory,
    rawSubtype,
    rarity,
    cost,
    weight,
    slot,
    attunement,
    equippable,
    attunable,
    filterTags,
    detailTags,
    summaryLines,
    impactLines,
    mechanicsLines,
  };
}

function getImportedSetterMap(element: ImportedElement) {
  const entries = Array.isArray(element.setters)
    ? element.setters.flatMap((setter) => {
        if (!setter || typeof setter !== "object") {
          return [];
        }
        const candidate = setter as Record<string, unknown>;
        if (typeof candidate.name !== "string" || typeof candidate.value !== "string") {
          return [];
        }
        return [[candidate.name, candidate.value] as const];
      })
    : [];

  return Object.fromEntries(entries);
}

function getImportedSetterEntries(element: ImportedElement): SetterEntry[] {
  return Array.isArray(element.setters)
    ? element.setters.flatMap((setter) => {
        if (!setter || typeof setter !== "object") {
          return [];
        }
        const candidate = setter as Record<string, unknown>;
        if (typeof candidate.name !== "string" || typeof candidate.value !== "string") {
          return [];
        }
        return [
          {
            name: candidate.name,
            value: candidate.value,
            type: typeof candidate.type === "string" ? candidate.type : undefined,
            modifier: typeof candidate.modifier === "string" ? candidate.modifier : undefined,
            alt: typeof candidate.alt === "string" ? candidate.alt : undefined,
          } satisfies SetterEntry,
        ];
      })
    : [];
}

function normalizeImportedItem(element: ImportedElement): EquipmentCatalogEntry | null {
  if (!ITEM_ELEMENT_TYPES.has(element.element_type)) {
    return null;
  }

  const setterEntries = getImportedSetterEntries(element);
  const setters = getImportedSetterMap(element);
  const rawCategory = cleanValue(setters.category);
  const rawSubtype = cleanValue(setters.type);
  const rarity = cleanValue(setters.rarity);
  const cost = cleanValue(setters.cost);
  const weight = cleanValue(setters.weight);
  const slot = cleanValue(setters.slot);
  const attunement = cleanValue(setters.attunement);
  const category = categoryFromText(rawCategory, element.name);
  const family = familyFromEntry({
    elementType: element.element_type,
    category: rawCategory,
    subtype: rawSubtype,
    rarity,
    name: element.name,
  });
  const equippable = isInventoryItemEquippable(element.name, category);
  const attunable = isInventoryItemAttunable(attunement, rarity, element.name);
  const filterTags = [
    family,
    rawCategory || "",
    rawSubtype || "",
    category.replace(/-/g, " "),
    element.element_type,
    rarity ? `Rarity: ${rarity}` : "Mundane",
    attunable ? "Attunement" : "",
  ].filter(Boolean);
  const detailTags = [
    family,
    element.element_type,
    rarity || "Mundane",
    slot ? `Slot: ${slot}` : "",
    cost ? `Cost: ${cost}` : "",
    weight ? `Weight: ${weight}` : "",
    attunable ? "Requires attunement" : "",
  ].filter(Boolean);
  const mechanicsLines = getMechanicalBreakdown({
    elementType: element.element_type,
    setters: setterEntries,
    supports: Array.isArray(element.supports)
      ? element.supports.filter((entry): entry is string => typeof entry === "string")
      : [],
    rawCategory,
    rarity,
    cost,
    weight,
    slot,
    attunement,
  });

  return {
    id: element.element_id,
    name: element.name,
    elementType: element.element_type,
    origin: "imported",
    source: element.source_name ?? "Imported source",
    sourceUrl: element.source_url,
    description: element.description_text ?? "",
    detailHtml: getReferenceMarkup({
      descriptionHtml: element.description_html ?? undefined,
      description: element.description_text ?? "",
      mechanicsLines,
    }),
    category,
    family,
    rawCategory,
    rawSubtype,
    rarity,
    cost,
    weight,
    slot,
    attunement,
    equippable,
    attunable,
    filterTags,
    detailTags,
    summaryLines: [rawCategory, rawSubtype, cost, weight].filter(Boolean) as string[],
    impactLines: [
      equippable ? "Can equip" : "",
      attunable ? "Can attune" : "",
      rarity ? `Magic: ${rarity}` : "Mundane gear",
    ].filter(Boolean),
    mechanicsLines,
  };
}

export function getBuiltInEquipmentCatalog() {
  return getBuiltInSrdItems().map(normalizeBuiltInItem);
}

export async function getMergedEquipmentCatalog() {
  const imported = (await listCachedElements())
    .map((element) => normalizeImportedItem(element))
    .filter((item): item is EquipmentCatalogEntry => Boolean(item));

  const builtIn = getBuiltInEquipmentCatalog();
  const builtInById = new Map<string, EquipmentCatalogEntry>();
  builtIn.forEach((item) => {
    builtInById.set(item.id, item);
  });

  const importedById = new Map<string, EquipmentCatalogEntry>();
  imported.forEach((item) => {
    importedById.set(item.id, item);
  });

  return [...builtInById.values(), ...importedById.values()].sort(
    (left, right) => left.name.localeCompare(right.name) || left.source.localeCompare(right.source),
  );
}
