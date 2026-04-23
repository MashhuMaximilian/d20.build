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

function isMagicLikeEntry(input: {
  elementType: string;
  category?: string;
  subtype?: string;
  rarity?: string;
}) {
  return (
    input.elementType === "Magic Item" ||
    Boolean(input.rarity) ||
    input.category?.toLowerCase().includes("magic") ||
    input.subtype?.toLowerCase().includes("magic")
  );
}

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
  if (normalized.includes("shield") || /\bshield\b/i.test(fallbackName)) {
    return "shield";
  }
  if (normalized.includes("weapon")) {
    return "weapon";
  }
  if (normalized.includes("armor")) {
    return "armor";
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

  if (isMagicLikeEntry(input)) {
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
    .replace(/^INTERNAL_/, "")
    .replace(/^WEAPON_CATEGORY_/, "")
    .replace(/^WEAPON_PROPERTY_/, "")
    .replace(/^WEAPON_GROUP_/, "")
    .replace(/^DAMAGE_TYPE_/, "")
    .replace(/^ARMOR_GROUP_/, "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function humanizeMultiValue(value: string) {
  return value
    .split(/\s*(?:,|\|\|)\s*/g)
    .map((entry) => cleanValue(entry))
    .filter((entry): entry is string => Boolean(entry))
    .map(humanizeSupportTag)
    .join(", ");
}

function getWeaponBaseDetails(value: string | undefined) {
  if (!value) {
    return [];
  }

  const parts = value
    .split(/\s*(?:,|\|\|)\s*/g)
    .map((entry) => cleanValue(entry))
    .filter((entry): entry is string => Boolean(entry));

  const weaponGroups = parts
    .filter((entry) => entry.includes("WEAPON_GROUP"))
    .map(humanizeSupportTag);
  const damageTypes = parts
    .filter((entry) => entry.includes("DAMAGE_TYPE"))
    .map(humanizeSupportTag);
  const remainder = parts
    .filter((entry) => !entry.includes("WEAPON_GROUP") && !entry.includes("DAMAGE_TYPE"))
    .map(humanizeSupportTag);

  return [
    weaponGroups.length ? `Base weapon group: ${weaponGroups.join(", ")}` : "",
    damageTypes.length ? `Damage type: ${damageTypes.join(", ")}` : "",
    remainder.length ? `Base weapon: ${remainder.join(", ")}` : "",
  ].filter(Boolean);
}

function getArmorBaseDetails(value: string | undefined) {
  if (!value) {
    return [];
  }

  const normalized = value.trim();
  if (normalized === "Shield") {
    return ["Base armor: Shield"];
  }

  const humanized = humanizeMultiValue(normalized);
  return humanized ? [`Base armor: ${humanized}`] : [];
}

function getWeaponBaseDamageHint(input: {
  name?: string;
  weaponBase?: string;
  keywords?: string;
}) {
  const haystack = [input.name, input.weaponBase, input.keywords].filter(Boolean).join(" ").toLowerCase();

  if (/\blongsword\b/.test(haystack)) {
    return "Base damage: Longsword 1d8 slashing (versatile 1d10)";
  }

  if (/\bshortsword\b/.test(haystack)) {
    return "Base damage: Shortsword 1d6 piercing";
  }

  if (/\bgreatsword\b/.test(haystack)) {
    return "Base damage: Greatsword 2d6 slashing";
  }

  if (/\brapier\b/.test(haystack)) {
    return "Base damage: Rapier 1d8 piercing";
  }

  if (/\bscimitar\b/.test(haystack)) {
    return "Base damage: Scimitar 1d6 slashing";
  }

  if (/\bdagger\b/.test(haystack)) {
    return "Base damage: Dagger 1d4 piercing";
  }

  if (/\bweapon_group_swords\b|\bswords\b|\bsword\b/.test(haystack)) {
    return "Base damage: Uses the chosen sword's damage die";
  }

  if (/\bweapon_group_axes\b|\baxe\b/.test(haystack)) {
    return "Base damage: Uses the chosen axe's damage die";
  }

  if (/\bweapon_group_bows\b|\bbow\b/.test(haystack)) {
    return "Base damage: Uses the chosen bow's damage die";
  }

  if (/\bweapon\b/.test(haystack)) {
    return "Base damage: Uses the chosen base weapon's damage die";
  }

  return "";
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
  name?: string;
  setters: SetterEntry[];
  supports: string[];
  rawCategory?: string;
  rawSubtype?: string;
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
  const versatileLine = getFirstSetterValue(input.setters, "versatile");
  const enhancementLine = getFirstSetterValue(input.setters, "enhancement");
  const weaponBase = getFirstSetterValue(input.setters, "weapon");
  const armorBase = getFirstSetterValue(input.setters, "armor");
  const armorClass = getFirstSetterValue(input.setters, "armorClass");
  const keywords = getFirstSetterValue(input.setters, "keywords");
  const properties = getPropertyLines(input.supports);
  const weaponBaseDetails = getWeaponBaseDetails(weaponBase);
  const armorBaseDetails = getArmorBaseDetails(armorBase);
  const baseDamageHint = damageLine
    ? ""
    : getWeaponBaseDamageHint({
        name: input.name,
        weaponBase,
        keywords,
      });
  const isShield =
    input.rawSubtype?.toLowerCase().includes("shield") ||
    armorBase === "Shield" ||
    armorBase?.includes("ARMOR_GROUP_SHIELD") ||
    input.name?.toLowerCase().includes("shield");
  const attunementLine =
    input.attunement?.toLowerCase() === "true"
      ? "Attunement: Required"
      : input.attunement
        ? `Attunement: ${input.attunement}`
        : "";
  const shieldBonusLine = isShield && armorClass ? `Base AC bonus: ${armorClass}` : "";
  const shieldEnhancementLine =
    isShield && enhancementLine ? `Additional AC bonus: +${enhancementLine}` : "";
  const armorEnhancementLine =
    !isShield && armorBase && enhancementLine ? `Armor bonus: +${enhancementLine}` : "";

  return [
    input.rawCategory ? `Category: ${input.rawCategory}` : "",
    damageLine ? `Damage: ${damageLine}` : "",
    baseDamageHint,
    versatileLine ? `Versatile: ${versatileLine}` : "",
    rangeLine ? `Range: ${rangeLine}` : "",
    !isShield && enhancementLine ? `Enhancement: +${enhancementLine}` : "",
    ...weaponBaseDetails,
    ...armorBaseDetails,
    shieldBonusLine,
    shieldEnhancementLine,
    armorEnhancementLine,
    keywords ? `Keywords: ${keywords}` : "",
    ...properties,
    input.rarity ? `Rarity: ${input.rarity}` : "Mundane",
    input.cost ? `Cost: ${input.cost}` : "",
    input.weight ? `Weight: ${input.weight}` : "",
    input.slot ? `Slot: ${input.slot}` : "",
    attunementLine,
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
    isMagicLikeEntry({ elementType: item.type, category: rawCategory, subtype: rawSubtype, rarity }) ? "Magic Item" : "Mundane",
    equippable ? "Can equip" : "",
    attunable ? "Attunement" : "",
    attunable ? "Can attune" : "",
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
    name: item.name,
    setters: item.setters,
    supports: [...item.supports],
    rawCategory,
    rawSubtype,
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
    isMagicLikeEntry({ elementType: element.element_type, category: rawCategory, subtype: rawSubtype, rarity }) ? "Magic Item" : "Mundane",
    equippable ? "Can equip" : "",
    attunable ? "Attunement" : "",
    attunable ? "Can attune" : "",
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
    name: element.name,
    setters: setterEntries,
    supports: Array.isArray(element.supports)
      ? element.supports.filter((entry): entry is string => typeof entry === "string")
      : [],
    rawCategory,
    rawSubtype,
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

  const deduped = new Map<string, EquipmentCatalogEntry>();

  function scoreEntry(entry: EquipmentCatalogEntry) {
    return [
      entry.origin === "imported" ? 12 : 0,
      entry.mechanicsLines.length,
      entry.detailTags.length,
      entry.description.trim().length > 0 ? 2 : 0,
      entry.detailHtml?.trim().length ? 4 : 0,
    ].reduce((sum, value) => sum + value, 0);
  }

  function getEntrySignature(entry: EquipmentCatalogEntry) {
    return [
      entry.name.trim().toLowerCase(),
      entry.source.trim().toLowerCase(),
      entry.elementType.trim().toLowerCase(),
      entry.family.trim().toLowerCase(),
      entry.rawCategory?.trim().toLowerCase() ?? "",
      entry.rawSubtype?.trim().toLowerCase() ?? "",
      entry.rarity?.trim().toLowerCase() ?? "",
    ].join("::");
  }

  const entriesBySignature = new Map<string, EquipmentCatalogEntry[]>();

  [...builtInById.values(), ...importedById.values()].forEach((entry) => {
    const signature = getEntrySignature(entry);
    const current = entriesBySignature.get(signature) ?? [];
    current.push(entry);
    entriesBySignature.set(signature, current);
  });

  entriesBySignature.forEach((entries, signature) => {
    const sorted = [...entries].sort((left, right) => scoreEntry(right) - scoreEntry(left));
    const best = sorted[0];
    const builtInMatch = entries.find((entry) => entry.origin === "built-in");
    if (!best) {
      return;
    }

    if (!builtInMatch) {
      deduped.set(signature, best);
      return;
    }

    deduped.set(signature, {
      ...best,
      origin: "built-in",
      source: builtInMatch.source,
      sourceUrl: builtInMatch.sourceUrl,
    });
  });

  return [...deduped.values()].sort(
    (left, right) => left.name.localeCompare(right.name) || left.source.localeCompare(right.source),
  );
}
