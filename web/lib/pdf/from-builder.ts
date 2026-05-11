import type {
  BuiltInElement,
  BuiltInRule,
} from "@/lib/builtins/types";
import type { BuiltInBackgroundRecord } from "@/lib/builtins/backgrounds";
import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import type {
  AbilityKey,
  CharacterDraft,
  CharacterManualGrant,
  CharacterInventoryItem,
} from "@/lib/characters/types";
import { ABILITY_KEYS, ABILITY_LABELS, getTotalCharacterLevel } from "@/lib/characters/types";
import { normalizeInventoryWeaponItem, resolveInventoryArmorClass } from "@/lib/equipment/inventory";
import { getImprovementBonuses } from "@/lib/progression/improvements";
import {
  deriveSpellcastingGroups,
  getSpellCastingTime,
  getSpellLevel,
  getSpellRange,
  getSpellSlotSummary,
  type SpellSelectionGroup,
} from "@/lib/progression/spellcasting";
import {
  buildProficiencyFacts,
  hasSavingThrowProficiency,
  hasSkillProficiency,
  type ProficiencyFact,
} from "@/lib/proficiencies/facts";
import { groupProficiencies } from "@/lib/proficiencies/group";

import {
  resolvePdfCharacter,
  getPassivePdfNoteTagsFromText,
  toPdfCardFromElement,
  toPdfCardFromGrant,
  toPdfCardFromInventoryItem,
  type PdfResolveSource,
  type ResolvedPdfCharacter,
} from "@/lib/pdf";
import type {
  PdfSpellListEntry,
  PdfSpellSlots,
  PdfSpellSlotLevel,
} from "@/lib/pdf/types";

// Top-level display label constants — keep inline strings out of data-building logic
const LABEL_PROFICIENCY_BONUS = "Proficiency Bonus";
const LABEL_INITIATIVE = "Initiative";
const LABEL_ATTACKS_PER_ACTION = "Attacks / Action";
const LABEL_PASSIVE_PERCEPTION = "Passive Perception";
const LABEL_SPELLCASTING_BONUS = "Spellcasting Bonus";
const LABEL_SPELLCASTING_ABILITY = "Spellcasting Ability";
const LABEL_HP = "HP";
const LABEL_AC = "AC";
const LABEL_DEFENSES = "Defenses";
const LABEL_SPEED = "Speed";
const LABEL_HIT_DICE = "Hit Dice";
const LABEL_CLASS_RESOURCE = "Class Resource";

export type BuilderPdfSourceArgs = {
  abilities: Record<AbilityKey, number>;
  allSelectedFeatElements: BuiltInElement[];
  classRecordsByEntry: Array<BuiltInClassRecord | null>;
  draft: CharacterDraft;
  effectiveAbilities: Record<AbilityKey, number>;
  manualGrantsByKind: Record<CharacterManualGrant["kind"], CharacterManualGrant[]>;
  selectedBackground: BuiltInBackgroundRecord | null;
  selectedBackgroundFeatureElements: BuiltInElement[];
  selectedClassFeatureElements: BuiltInElement[];
  selectedExpertiseIds?: string[];
  selectedExpertiseLabels: string[];
  selectedFeatElements: BuiltInElement[];
  selectedLanguageIds: string[];
  selectedLanguageNames: string[];
  selectedManualFeatureElements: BuiltInElement[];
  selectedProgressionElements: BuiltInElement[];
  selectedProficiencyIds: string[];
  selectedProficiencyNames: string[];
  selectedRace: BuiltInRaceRecord | null;
  selectedRacialTraitElements: BuiltInElement[];
  selectedSpellIds: string[];
  selectedSubrace: BuiltInElement | null;
  spellGroups: SpellSelectionGroup[];
  spells: BuiltInElement[];
  selectedElements: BuiltInElement[];
  equipmentProficiencies?: {
    armor: string[];
    weapons: string[];
  };
};

export type BuilderPdfDraftCatalogs = {
  backgrounds: BuiltInBackgroundRecord[];
  classes: BuiltInClassRecord[];
  feats: BuiltInElement[];
  progressionElements: BuiltInElement[];
  races: BuiltInRaceRecord[];
  spells: BuiltInElement[];
};

function uniqueById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function splitFreeTextList(value: string | undefined) {
  return (value ?? "")
    .split(/[\n,;]+/)
    .map((entry) => entry.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

const MUSICAL_INSTRUMENT_NAMES = new Set([
  "bagpipes",
  "drum",
  "dulcimer",
  "flute",
  "guitar",
  "harp",
  "horn",
  "lute",
  "lyre",
  "pan flute",
  "panflute",
  "shawm",
  "viol",
  "violin",
]);

const TOOL_LIKE_TEXT_RE = /\b(instrument|tool|set|kit|supplies|utensils|dice|cards|chess|dragonchess|three\s*dragon|artisan)\b/i;
const NON_TOOL_EQUIPMENT_RE = /\b(weapon|armor|armour|shield|vehicle|pack|clothing|clothes|book|treasure|pouch|focus|symbol|ammo|ammunition|consumable)\b/i;

function isToolLikeValue(rawValue: string, label = normalizeLabel(rawValue)) {
  const raw = rawValue.toLowerCase().replace(/[-_]+/g, " ");
  const normalizedLabel = label.toLowerCase();
  return TOOL_LIKE_TEXT_RE.test(raw) || TOOL_LIKE_TEXT_RE.test(normalizedLabel) || MUSICAL_INSTRUMENT_NAMES.has(normalizedLabel);
}

function collectInventoryToolLabels(draft: CharacterDraft) {
  const removedIds = new Set(draft.removedInventoryItemIds);
  const inventoryLabels = draft.inventoryItems
    .filter((item) => !removedIds.has(item.id))
    .filter((item) => {
      const haystack = `${item.category} ${item.family ?? ""} ${item.itemType ?? ""} ${item.name}`.toLowerCase();
      if (NON_TOOL_EQUIPMENT_RE.test(haystack) && !isToolLikeValue(haystack, item.name)) {
        return false;
      }
      return isToolLikeValue(haystack, item.name);
    })
    .map((item) => normalizeLabel(item.baseItemName || item.name));
  const selectionLabels = Object.values(draft.equipmentSelections)
    .map((value) => normalizeLabel(value))
    .filter((label) => {
      const haystack = label.toLowerCase();
      if (NON_TOOL_EQUIPMENT_RE.test(haystack) && !isToolLikeValue(haystack, label)) {
        return false;
      }
      return isToolLikeValue(haystack, label);
    });

  return uniqueStrings([...inventoryLabels, ...selectionLabels]);
}

function collectChoiceToolLabels(args: BuilderPdfSourceArgs) {
  const rawChoiceValues = [
    ...Object.values(args.draft.progressionSelections).flat(),
    ...args.selectedProficiencyIds,
    ...args.selectedProficiencyNames,
    ...args.selectedProgressionElements.flatMap((element) =>
      element.type === "Proficiency" && isToolLikeValue(`${element.id} ${element.name} ${element.supports.join(" ")}`)
        ? [element.id, element.name]
        : [],
    ),
  ];

  return uniqueStrings(
    rawChoiceValues
      .filter((value) => isToolLikeValue(value))
      .map((value) => normalizeLabel(value)),
  );
}

function emptyAbilityMap() {
  return {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  } satisfies Record<AbilityKey, number>;
}

function addAbilityBonusMaps(...maps: Array<Record<AbilityKey, number>>) {
  return ABILITY_KEYS.reduce<Record<AbilityKey, number>>((totals, ability) => {
    totals[ability] = maps.reduce((sum, current) => sum + (current[ability] ?? 0), 0);
    return totals;
  }, emptyAbilityMap());
}

function getStatBonuses(values: string[]) {
  return values.reduce<Record<AbilityKey, number>>((accumulator, value) => {
    const [name, amount] = value.split(":");
    if (ABILITY_KEYS.includes(name as AbilityKey)) {
      accumulator[name as AbilityKey] += Number(amount) || 0;
    }
    return accumulator;
  }, emptyAbilityMap());
}

function getAbilityModifier(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.floor((value - 10) / 2);
}

function getAverageHitDieGain(hitDie: number) {
  return Math.floor(hitDie / 2) + 1;
}

const SKILL_ABILITY_MAP: Array<{ id: string; label: string; ability: AbilityKey }> = [
  { id: "acrobatics", label: "Acrobatics", ability: "dexterity" },
  { id: "animal-handling", label: "Animal Handling", ability: "wisdom" },
  { id: "arcana", label: "Arcana", ability: "intelligence" },
  { id: "athletics", label: "Athletics", ability: "strength" },
  { id: "deception", label: "Deception", ability: "charisma" },
  { id: "history", label: "History", ability: "intelligence" },
  { id: "insight", label: "Insight", ability: "wisdom" },
  { id: "intimidation", label: "Intimidation", ability: "charisma" },
  { id: "investigation", label: "Investigation", ability: "intelligence" },
  { id: "medicine", label: "Medicine", ability: "wisdom" },
  { id: "nature", label: "Nature", ability: "intelligence" },
  { id: "perception", label: "Perception", ability: "wisdom" },
  { id: "performance", label: "Performance", ability: "charisma" },
  { id: "persuasion", label: "Persuasion", ability: "charisma" },
  { id: "religion", label: "Religion", ability: "intelligence" },
  { id: "sleight-of-hand", label: "Sleight of Hand", ability: "dexterity" },
  { id: "stealth", label: "Stealth", ability: "dexterity" },
  { id: "survival", label: "Survival", ability: "wisdom" },
];

const EXPERTISE_SKILL_LABELS: Record<string, string> = {
  acrobatics: "Acrobatics",
  animalhandling: "Animal Handling",
  arcana: "Arcana",
  athletics: "Athletics",
  deception: "Deception",
  history: "History",
  insight: "Insight",
  intimidation: "Intimidation",
  investigation: "Investigation",
  medicine: "Medicine",
  nature: "Nature",
  perception: "Perception",
  performance: "Performance",
  persuasion: "Persuasion",
  religion: "Religion",
  sleightofhand: "Sleight of Hand",
  stealth: "Stealth",
  survival: "Survival",
};

function normalizeLookupLabel(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function humanizeGrantedId(value: string) {
  // Strip category prefixes at the start; never use the category word for presentation.
  return value
    .replace(/^ID_PROFICIENCY_(?:SAVINGTHROW|SKILL|WEAPON|ARMOR|TOOL)_(?:PROFICIENCY_)?/, "")
    .replace(/^ID_LANGUAGE_/, "")
    .replace(/^ID_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bCant\b/g, "Cant");
}

function collectGrantedIds(rules: BuiltInRule[], type: string) {
  return rules
    .filter((rule): rule is Extract<BuiltInRule, { kind: "grant" }> => rule.kind === "grant" && rule.type === type)
    .map((rule) => rule.id)
    .filter(Boolean);
}

function collectGrantedIdsAtLevel(rules: BuiltInRule[], type: string, level: number) {
  return rules
    .filter(
      (rule): rule is Extract<BuiltInRule, { kind: "grant" }> =>
        rule.kind === "grant" && rule.type === type && (!rule.level || rule.level <= level),
    )
    .map((rule) => rule.id)
    .filter(Boolean);
}

function collectGrantedIdsFromElements(elements: BuiltInElement[], type: string) {
  return elements.flatMap((element) => collectGrantedIds(element.rules, type));
}

function isRawProficiencySelection(value: string) {
  const normalized = value.trim().toUpperCase();
  return (
    normalized.startsWith("ID_PROFICIENCY_") ||
    normalized.startsWith("ID_EXPERTISE_") ||
    normalized.startsWith("ID_INTERNAL_TOOL_") ||
    /^PROFICIENCY\s*[:_-]/i.test(value)
  );
}

function isRawLanguageSelection(value: string) {
  return value.trim().toUpperCase().startsWith("ID_LANGUAGE_") || /^LANGUAGE\s*[:_-]/i.test(value);
}

function selectionLabelFromId(value: string) {
  const customChoice = value.match(/^(?:Proficiency|Language)\s*[:_-]\s*(.+)$/i)?.[1];
  return customChoice ? normalizeLabel(customChoice) : humanizeGrantedId(value);
}

function collectAllGrantedIdsFromElements(elements: BuiltInElement[]) {
  return elements.flatMap((element) =>
    element.rules.flatMap((rule) => (rule.kind === "grant" ? [rule.id] : [])),
  );
}

function collectAllNestedGrantedElements(
  elementPool: Map<string, BuiltInElement>,
  elements: BuiltInElement[],
) {
  const visited = new Set<string>();
  const queue = collectAllGrantedIdsFromElements(elements);
  const collected: BuiltInElement[] = [];

  while (queue.length) {
    const currentId = queue.shift();
    if (!currentId || visited.has(currentId)) {
      continue;
    }

    visited.add(currentId);
    const grantedElement = elementPool.get(currentId);
    if (grantedElement) {
      collected.push(grantedElement);
      queue.push(...collectAllGrantedIdsFromElements([grantedElement]));
    }
  }

  return collected;
}

function collectStatBonusesFromElements(elements: BuiltInElement[]) {
  return getStatBonuses(
    elements.flatMap((element) =>
      element.rules.flatMap((rule) =>
        rule.kind === "stat" && ABILITY_KEYS.includes(rule.name as AbilityKey)
          ? [`${rule.name}:${rule.value}`]
          : [],
      ),
    ),
  );
}

function extractExpertiseLabelsFromElement(element: BuiltInElement) {
  const labels = new Set<string>();
  const directMatch = element.name.match(/(?:skill\s+)?expertise\s*\(([^)]+)\)/i);
  if (directMatch?.[1]) {
    labels.add(directMatch[1].trim());
  }

  element.rules.forEach((rule) => {
    if (rule.kind !== "stat" || rule.bonus !== "double" || !rule.name.endsWith(":proficiency")) {
      return;
    }
    const baseName = rule.name.slice(0, -":proficiency".length).replace(/[^a-z]/gi, "").toLowerCase();
    const skillLabel = EXPERTISE_SKILL_LABELS[baseName];
    if (skillLabel) {
      labels.add(skillLabel);
    }
  });

  return [...labels];
}

function getProficiencyBonus(level: number) {
  return 2 + Math.floor((Math.max(1, level) - 1) / 4);
}

function resolveClassName(record: BuiltInClassRecord | null, entry: CharacterDraft["classEntries"][number]) {
  return record?.class.name || entry.classId || "";
}

function resolveHitDie(className: string) {
  const normalized = className.toLowerCase().replace(/\s+/g, "");
  const hitDieByClassName: Record<string, number> = {
    artificer: 8,
    barbarian: 12,
    bard: 8,
    bloodhunter: 10,
    blood_hunter: 10,
    cleric: 8,
    druid: 8,
    fighter: 10,
    monk: 8,
    mystic: 8,
    paladin: 10,
    psion: 6,
    pugilist: 8,
    ranger: 10,
    rogue: 8,
    sorcerer: 6,
    warlock: 8,
    wizard: 6,
  };

  return hitDieByClassName[normalized] ?? 8;
}

function getNumericRuleBonus(element: BuiltInElement, matcher: RegExp) {
  const ruleTotals = element.rules
    .filter((rule): rule is Extract<BuiltInRule, { kind: "stat" }> => rule.kind === "stat" && matcher.test(rule.name))
    .reduce((sum, rule) => {
      const amount = Number.parseInt(rule.value, 10);
      return Number.isFinite(amount) ? sum + amount : sum;
    }, 0);

  const setterTotals = element.setters
    .filter((setter) => matcher.test(setter.name))
    .reduce((sum, setter) => {
      const amount = Number.parseInt(setter.value, 10);
      return Number.isFinite(amount) ? sum + amount : sum;
    }, 0);

  return ruleTotals + setterTotals;
}

function parseWalkingSpeed(text: string) {
  const match =
    text.match(/\bbase walking speed is (\d+) feet\b/i) ||
    text.match(/\byour speed is (\d+) feet\b/i) ||
    text.match(/\bwalking speed of (\d+) feet\b/i);
  return match ? Number.parseInt(match[1], 10) : null;
}

function deriveWalkingSpeed(args: {
  selectedRace: BuiltInRaceRecord | null;
  selectedSubrace: BuiltInElement | null;
  selectedElements: BuiltInElement[];
}) {
  const textSources = [
    args.selectedSubrace?.descriptionHtml,
    args.selectedSubrace?.description,
    args.selectedRace?.race.descriptionHtml,
    args.selectedRace?.race.description,
    ...args.selectedElements.flatMap((element) => [element.descriptionHtml, element.description]),
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) =>
      value
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<\/p>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    );

  const parsedSpeed = textSources.map(parseWalkingSpeed).find((value) => value !== null);
  const raceName = args.selectedRace?.race.name.toLowerCase() ?? "";
  const defaultBase =
    parsedSpeed ??
    (/gnome|halfling|dwarf/.test(raceName) ? 25 : 30);

  const bonus = args.selectedElements.reduce(
    (sum, element) => sum + getNumericRuleBonus(element, /^speed(?::|$)/i),
    0,
  );

  return {
    base: defaultBase,
    total: defaultBase + bonus,
    bonus,
  };
}

function deriveArmorClass(args: {
  draft: CharacterDraft;
  effectiveAbilities: Record<AbilityKey, number>;
}) {
  return resolveInventoryArmorClass(args.draft.inventoryItems, {
    abilities: args.effectiveAbilities,
  });
}

function deriveHitPointSummary(args: {
  draft: CharacterDraft;
  classRecordsByEntry: Array<BuiltInClassRecord | null>;
  effectiveAbilities: Record<AbilityKey, number>;
  selectedElements: BuiltInElement[];
}) {
  const constitutionMod = getAbilityModifier(args.effectiveAbilities.constitution);
  let hp = 0;
  let usedStartingLevel = false;

  args.draft.classEntries.forEach((entry, index) => {
    if (!entry.classId || entry.level <= 0) {
      return;
    }

    const className = resolveClassName(args.classRecordsByEntry[index], entry);
    const hitDie = resolveHitDie(className);
    const averageGain = getAverageHitDieGain(hitDie);

    for (let levelIndex = 0; levelIndex < entry.level; levelIndex += 1) {
      const isFirstCharacterLevel = !usedStartingLevel && levelIndex === 0;
      hp += isFirstCharacterLevel ? hitDie : averageGain;
      hp += constitutionMod;
    }

    usedStartingLevel = true;
  });

  if (args.selectedElements.some((element) => /^tough$/i.test(element.name))) {
    hp += args.draft.level * 2;
  }

  hp += args.selectedElements.reduce((sum, element) => sum + getNumericRuleBonus(element, /^hp$/i), 0);

  return {
    value: `${hp}`,
    meta: "Average max HP from class hit dice",
  };
}

function deriveHitDiceSummary(args: {
  draft: CharacterDraft;
  classRecordsByEntry: Array<BuiltInClassRecord | null>;
}) {
  const parts = args.draft.classEntries.flatMap((entry, index) => {
    if (!entry.classId || entry.level <= 0) {
      return [];
    }
    const className = resolveClassName(args.classRecordsByEntry[index], entry);
    const hitDie = resolveHitDie(className);
    return [`${entry.level}d${hitDie}`];
  });

  return parts.join(" • ") || "—";
}

function getPrimarySpellcastingAbility(spellGroups: SpellSelectionGroup[]) {
  return spellGroups.find((group) => Boolean(group.spellcastingAbility))?.spellcastingAbility?.toUpperCase() || "";
}

function getSubclassLabel(classRecordsByEntry: Array<BuiltInClassRecord | null>, draft: CharacterDraft) {
  return draft.classEntries
    .flatMap((entry, index) => {
      const record = classRecordsByEntry[index];
      if (!record || !entry?.subclassId) {
        return [];
      }

      const selectedSubclass =
        record.subclassSteps
          .flatMap((step) => step.options)
          .find((option) => option.archetype.id === entry.subclassId) ?? null;

      return selectedSubclass ? [selectedSubclass.archetype.name] : [];
    })
    .join(" / ");
}

function normalizeLabel(value: string): string {
  let cleaned = value.trim();
  if (!cleaned) {
    return "";
  }

  cleaned = cleaned
    .replace(/^ID_/, "")
    .replace(/[-_]/g, " ")
    .replace(/\bINTERNAL\b/gi, "")
    .replace(/\bPROFICIENCY\b/gi, "")
    .replace(/\bLANGUAGE\b/gi, "")
    .replace(/\bSAVINGTHROW\b/gi, "Saving Throw ")
    .replace(/\bSAVING THROW\b/gi, "Saving Throw ")
    .replace(/\bSKILL\b/gi, "")
    .replace(/\bTOOL\b/gi, "")
    .replace(/\bWEAPON\b/gi, "")
    .replace(/\bARMOR\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  // Apply title case to match Review step normalization
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

function getSelectedProficiencyFacts(args: BuilderPdfSourceArgs): ProficiencyFact[] {
  return buildProficiencyFacts([
    // Proficient sources — mark as "proficient" tier
    ...(args.selectedProficiencyIds ?? []).map((id) => ({ id, tier: "proficient" as const })),
    ...(args.selectedProficiencyNames ?? []).map((label) => ({ label: normalizeLabel(label), tier: "proficient" as const })),
    ...(args.manualGrantsByKind.proficiency ?? []).map((grant) => ({
      id: grant.refId,
      label: normalizeLabel(grant.name),
      tier: "proficient" as const,
    })),
    ...splitFreeTextList(args.draft.equipmentNotes.additionalProficiencies).map((label) => ({
      label: normalizeLabel(label),
      tier: "proficient" as const,
    })),
    // Equipment-tab grants (armor + weapons from gear) — also proficient tier
    ...(args.equipmentProficiencies?.armor ?? []).map((label) => ({ label: normalizeLabel(label), tier: "proficient" as const })),
    ...(args.equipmentProficiencies?.weapons ?? []).map((label) => ({ label: normalizeLabel(label), tier: "proficient" as const })),
    // Expertise sources — explicitly "expertise" tier (higher than proficient, distinct layer)
    ...(args.selectedExpertiseIds ?? []).map((id) => ({ id, tier: "expertise" as const })),
    ...(args.selectedExpertiseLabels ?? []).map((label) => ({ label: normalizeLabel(label), tier: "expertise" as const })),
  ]);
}

function isLowSignalFeatureElement(element: BuiltInElement) {
  const title = element.name.trim();
  const haystack = `${element.name} ${element.type} ${element.description ?? ""}`.toLowerCase();

  if (
    /\b(proficiency|language)\b/.test(element.type) ||
    /(language|proficiency) option/i.test(title) ||
    /\b(tool|instrument|language)\s+proficiency\b/i.test(haystack)
  ) {
    return true;
  }

  if (/^ability score improvement$/i.test(title)) {
    return true;
  }

  if (
    /^(bard college|roguish archetype|sacred oath|divine domain|druid circle|martial archetype|arcane tradition|primal path|otherworldly patron)$/i.test(
      title,
    )
  ) {
    return true;
  }

  return false;
}

function withPdfGroupTag(card: ReturnType<typeof toPdfCardFromElement> | ReturnType<typeof toPdfCardFromGrant>, group: string) {
  return {
    ...card,
    tags: [...card.tags, `pdf-group:${group}`],
  };
}

function withPdfTags<T extends { tags: string[] }>(card: T, tags: string[]) {
  return {
    ...card,
    tags: uniqueStrings([...card.tags, ...tags]),
  };
}

const FEATURE_ACTION_RULES: Array<{
  match: RegExp;
  timing: string;
  summary: string;
  cost?: string;
}> = [
  { match: /^Action Surge$/i, timing: "Free action", summary: "Take one additional action on your turn.", cost: "1 use" },
  { match: /^Second Wind$/i, timing: "Bonus action", summary: "Regain hit points using your fighter recovery.", cost: "1 use" },
  { match: /^Flurry of Blows$/i, timing: "Bonus action", summary: "After Attack, make two unarmed strikes.", cost: "1 ki" },
  { match: /^Stunning Strike$/i, timing: "On hit", summary: "Force a Constitution save or stun the target until your next turn.", cost: "1 ki" },
  { match: /^Rage$/i, timing: "Bonus action", summary: "Enter a rage with damage and resilience benefits." },
  { match: /^Wild Shape$/i, timing: "Action", summary: "Transform into a beast form using your druid training.", cost: "1 use" },
  { match: /^Channel Divinity$/i, timing: "Action / feature", summary: "Spend one Channel Divinity use on a subclass option.", cost: "1 use" },
  { match: /^Bardic Inspiration$/i, timing: "Bonus action", summary: "Grant an inspiration die to an ally within range.", cost: "1 use" },
  { match: /^Lay on Hands$/i, timing: "Action", summary: "Restore hit points from the Lay on Hands pool.", cost: "Pool spend" },
];

function getPlaySurfaceSummary(element: BuiltInElement) {
  const rule = FEATURE_ACTION_RULES.find((entry) => entry.match.test(element.name));
  if (!rule) {
    return undefined;
  }

  return [rule.timing, rule.cost, rule.summary].filter(Boolean).join(" | ");
}

function getPassiveNoteTags(element: BuiltInElement) {
  return uniqueStrings(getPassivePdfNoteTagsFromText(element.name, `${element.descriptionHtml ?? ""} ${element.description ?? ""}`));
}

function getKiSaveDc(args: BuilderPdfSourceArgs, proficiencyBonus: number) {
  const hasMonkKi = args.draft.classEntries.some((entry, index) => {
    const className = resolveClassName(args.classRecordsByEntry[index], entry);
    return /monk/i.test(className) && entry.level >= 2;
  }) || args.selectedElements.some((element) => /\b(ki|monk'?s focus|focus points)\b/i.test(`${element.name} ${element.description ?? ""}`));

  if (!hasMonkKi) {
    return "";
  }

  return `${8 + proficiencyBonus + getAbilityModifier(args.effectiveAbilities.wisdom)}`;
}

function getBardicInspirationDie(level: number) {
  if (level >= 15) {
    return 12;
  }
  if (level >= 10) {
    return 10;
  }
  if (level >= 5) {
    return 8;
  }
  return 6;
}

function getBarbarianRageUses(level: number) {
  if (level >= 20) {
    return "Unlimited";
  }
  if (level >= 17) {
    return "6 uses";
  }
  if (level >= 12) {
    return "5 uses";
  }
  if (level >= 6) {
    return "4 uses";
  }
  if (level >= 3) {
    return "3 uses";
  }
  return "2 uses";
}

function getChannelDivinityUses(level: number) {
  if (level >= 18) {
    return "3 uses";
  }
  if (level >= 6) {
    return "2 uses";
  }
  return "1 use";
}

function getSuperiorityDiceSummary(level: number) {
  const die = level >= 18 ? 12 : level >= 10 ? 10 : 8;
  const count = level >= 15 ? 6 : level >= 7 ? 5 : 4;
  return `${count} d${die}`;
}

function getClassResourcePriority(label: string) {
  const normalized = label.toLowerCase();
  if (normalized === "superiority dice") {
    return 15;
  }
  if (normalized === "starry form") {
    return 25;
  }
  if (normalized === "bardic inspiration") {
    return 10;
  }
  if (normalized === "wild shape") {
    return 20;
  }
  if (normalized === "ki points") {
    return 30;
  }
  if (normalized === "sorcery points") {
    return 40;
  }
  if (normalized === "lay on hands") {
    return 50;
  }
  if (normalized === "channel divinity") {
    return 60;
  }
  if (normalized === "action surge") {
    return 70;
  }
  if (normalized === "second wind") {
    return 80;
  }
  if (normalized === "rage") {
    return 90;
  }
  return 999;
}

function getClassResources(args: BuilderPdfSourceArgs) {
  const featureNames = new Set(args.selectedClassFeatureElements.map((feature) => feature.name.toLowerCase()));
  const resources: Array<{ label: string; value: string; cadence?: string }> = [];
  const pushResource = (label: string, value: string, cadence?: string) => {
    if (!value || resources.some((resource) => resource.label === label)) {
      return;
    }
    resources.push({ label, value, cadence });
  };

  for (let index = 0; index < args.classRecordsByEntry.length; index += 1) {
    const record = args.classRecordsByEntry[index];
    const entry = args.draft.classEntries[index];
    if (!record || !entry?.classId) {
      continue;
    }

    const className = record.class.name;

    if (/bard/i.test(className) && featureNames.has("bardic inspiration")) {
      const uses = Math.max(1, getAbilityModifier(args.effectiveAbilities.charisma));
      const die = getBardicInspirationDie(entry.level);
      pushResource("Bardic Inspiration", `${uses} d${die}`, entry.level >= 5 ? "SR" : "LR");
    }

    if (/fighter/i.test(className) && (featureNames.has("combat superiority") || featureNames.has("superiority dice"))) {
      pushResource("Superiority Dice", getSuperiorityDiceSummary(entry.level), "SR");
    }

    if (/druid/i.test(className) && featureNames.has("wild shape")) {
      pushResource("Wild Shape", "2 uses", "SR");
    }

    if (/druid/i.test(className) && featureNames.has("starry form")) {
      pushResource("Starry Form", "Uses Wild Shape", "SR");
    }

    if (/monk/i.test(className) && featureNames.has("ki")) {
      pushResource("Ki Points", `${entry.level}`);
    }

    if (/sorcerer/i.test(className) && (featureNames.has("font of magic") || featureNames.has("sorcery points"))) {
      pushResource("Sorcery Points", `${entry.level}`);
    }

    if (/paladin/i.test(className) && featureNames.has("lay on hands")) {
      pushResource("Lay on Hands", `${entry.level * 5}`);
    }

    if (/cleric|paladin/i.test(className) && featureNames.has("channel divinity")) {
      pushResource("Channel Divinity", getChannelDivinityUses(entry.level), "SR");
    }

    if (/fighter/i.test(className) && featureNames.has("action surge")) {
      pushResource("Action Surge", "1 use", "SR");
    }

    if (/fighter/i.test(className) && featureNames.has("second wind")) {
      pushResource("Second Wind", "1 use", "SR");
    }

    if (/barbarian/i.test(className) && featureNames.has("rage")) {
      pushResource("Rage", getBarbarianRageUses(entry.level));
    }

    if (/wizard/i.test(className) && featureNames.has("arcane recovery")) {
      pushResource("Arcane Recovery", "1 use", "LR");
    }
  }

  return resources.sort((left, right) => {
    const priorityDelta = getClassResourcePriority(left.label) - getClassResourcePriority(right.label);
    if (priorityDelta !== 0) {
      return priorityDelta;
    }
    return left.label.localeCompare(right.label);
  });
}

function getClassLabel(classRecordsByEntry: Array<BuiltInClassRecord | null>, draft: CharacterDraft) {
  const labels = draft.classEntries.map((entry, index) => classRecordsByEntry[index]?.class.name || entry.classId).filter(Boolean);
  return labels.join(" / ");
}

function buildAbilityRows(args: BuilderPdfSourceArgs) {
  const proficiencyBonus = getProficiencyBonus(args.draft.level);
  const proficiencyFacts = getSelectedProficiencyFacts(args);

  return Object.entries(ABILITY_LABELS).map(([abilityKey, label]) => {
    const ability = abilityKey as AbilityKey;
    const score = Number.isFinite(args.effectiveAbilities[ability]) ? args.effectiveAbilities[ability] : 10;
    const modifier = getAbilityModifier(score);
    const saveProficient = hasSavingThrowProficiency(proficiencyFacts, ability);

    return {
      id: `ability-${ability}`,
      label,
      score,
      modifier,
      saveBonus: modifier + (saveProficient ? proficiencyBonus : 0),
      saveProficient,
    };
  });
}

function buildSkillRows(args: BuilderPdfSourceArgs) {
  const proficiencyBonus = getProficiencyBonus(args.draft.level);
  const proficiencyFacts = getSelectedProficiencyFacts(args);
  const expertiseLabels = new Set(args.selectedExpertiseLabels.map((value) => normalizeLookupLabel(value)));
  const hasJackOfAllTrades = args.selectedClassFeatureElements.some((feature) => /jack of all trades/i.test(feature.name));

  const rows = SKILL_ABILITY_MAP.map((skill) => {
    const expertise = expertiseLabels.has(normalizeLookupLabel(skill.label)) ||
      hasSkillProficiency(proficiencyFacts, skill.id, "expertise");
    const proficient = expertise || hasSkillProficiency(proficiencyFacts, skill.id, "proficient");
    const score = Number.isFinite(args.effectiveAbilities[skill.ability]) ? args.effectiveAbilities[skill.ability] : 10;
    const modifier = getAbilityModifier(score);
    const jackBonus = !proficient && hasJackOfAllTrades ? Math.floor(proficiencyBonus / 2) : 0;
    const tier = expertise ? 2 : proficient ? 1 : 0;
    return {
      id: `skill-${skill.id}`,
      label: skill.label,
      ability: ABILITY_LABELS[skill.ability],
      total: modifier + (proficiencyBonus * tier) + jackBonus,
      proficient,
      expertise,
    };
  });

  console.info("[pdf/skills] Ability check rows", {
    strDex: rows.filter((row) => ["STR", "DEX"].includes(row.ability)).map((row) => ({ label: row.label, proficient: row.proficient, expertise: row.expertise, total: row.total })),
    int: rows.filter((row) => row.ability === "INT").map((row) => ({ label: row.label, proficient: row.proficient, expertise: row.expertise, total: row.total })),
    wis: rows.filter((row) => row.ability === "WIS").map((row) => ({ label: row.label, proficient: row.proficient, expertise: row.expertise, total: row.total })),
    cha: rows.filter((row) => row.ability === "CHA").map((row) => ({ label: row.label, proficient: row.proficient, expertise: row.expertise, total: row.total })),
  });

  return rows;
}

function buildAttackRows(args: BuilderPdfSourceArgs) {
  const weaponRows = args.draft.inventoryItems
      .map(normalizeInventoryWeaponItem)
      .filter((item): item is CharacterInventoryItem => Boolean(item.equipped && item.category === "weapon"))
      .map((item) => {
        const hit = item.attackBonus?.trim() || "—";
        const damage = item.damage || item.baseDamage || "—";
        const type = item.family || item.itemType || item.category || "";
        const properties = [item.slot, item.rarity, item.notes].filter(Boolean).join(" · ");
        return {
          id: `attack-${item.id}`,
          name: item.baseItemName || item.name,
          hit,
          damage,
          type,
          properties: properties || undefined,
        };
      });

  const featureActionRows = uniqueById(
    args.selectedElements.flatMap((element) => {
      const rule = FEATURE_ACTION_RULES.find((entry) => entry.match.test(element.name));
      if (!rule) {
        return [];
      }

      return [
        {
          id: `feature-action-${element.id}`,
          name: element.name,
          hit: rule.timing,
          damage: rule.cost || "At will",
          type: "Feature",
          properties: rule.summary,
        },
      ];
    }),
  );

  const spellsById = new Map(args.spells.map((spell) => [spell.id, spell]));
  const selectedSpellIds = uniqueStrings([
    ...args.selectedSpellIds,
    ...args.manualGrantsByKind.spell.map((grant) => grant.refId).filter((id): id is string => Boolean(id)),
  ]);
  const cantripRows = uniqueById(
    selectedSpellIds
      .map((id) => spellsById.get(id))
      .filter((spell): spell is BuiltInElement => {
        if (!spell) {
          return false;
        }
        return spell.type === "Spell" && getSpellLevel(spell) === 0;
      })
      .slice(0, 2)
      .map((spell) => ({
        id: `spell-action-${spell.id}`,
        name: spell.name,
        hit: getSpellCastingTime(spell) || "Action",
        damage: "Cantrip",
        type: "Spell",
        properties: getSpellRange(spell) || undefined,
      })),
  );

  const leveledSpellRows = uniqueById(
    selectedSpellIds
      .map((id) => spellsById.get(id))
      .filter((spell): spell is BuiltInElement => {
        if (!spell) {
          return false;
        }
        return spell.type === "Spell" && getSpellLevel(spell) > 0;
      })
      .slice(0, 1)
      .map((spell) => ({
        id: `spell-action-level-${spell.id}`,
        name: spell.name,
        hit: getSpellCastingTime(spell) || "Action",
        damage: `L${getSpellLevel(spell)}`,
        type: "Spell",
        properties: getSpellRange(spell) || undefined,
      })),
  );

  const prioritizedRows = [
    ...weaponRows.slice(0, 2),
    ...featureActionRows.slice(0, 2),
    ...cantripRows.slice(0, 1),
    ...leveledSpellRows,
    ...weaponRows.slice(2),
    ...cantripRows.slice(1),
    ...featureActionRows.slice(2),
  ];

  return uniqueById(prioritizedRows).slice(0, 5);
}

function buildProficiencyGroups(args: BuilderPdfSourceArgs) {
  const facts = getSelectedProficiencyFacts(args);
  const languages = uniqueStrings([
    ...args.selectedLanguageNames,
    ...args.selectedLanguageIds.map(humanizeGrantedId),
    ...args.manualGrantsByKind.language.map((grant) => grant.name),
    ...splitFreeTextList(args.draft.equipmentNotes.additionalLanguages),
  ]);

  const grouped = groupProficiencies(facts);
  const proficiencyTools = grouped.tools.map((f) => f.label);
  const equipmentTools = collectInventoryToolLabels(args.draft);
  const choiceTools = collectChoiceToolLabels(args);
  const tools = uniqueStrings([...proficiencyTools, ...equipmentTools, ...choiceTools]);

  console.info("[pdf/proficiencies] Tools & Instr.", {
    tools,
    sources: {
      proficiencies: proficiencyTools,
      equipment: equipmentTools,
      choices: choiceTools,
    },
  });

  return {
    weapons: uniqueStrings(grouped.weapons.map((f) => f.label)),
    armor: uniqueStrings(grouped.armor.map((f) => f.label)),
    tools,
    vehicles: uniqueStrings(grouped.vehicles.map((f) => f.label)),
    languages,
  };
}

function buildStatCards(args: BuilderPdfSourceArgs) {
  const proficiencyBonus = getProficiencyBonus(args.draft.level);
  const acData = deriveArmorClass({
    draft: args.draft,
    effectiveAbilities: args.effectiveAbilities,
  });
  const defenses: string[] = [];

  // One row per AC contributor, no bold/wrapping — just small readable lines
  acData.traces.forEach((trace) => {
    // trace.label already formatted as "Name | Value" by formatAcTraceLabel in inventory.ts
    if (trace.label) {
      defenses.push(trace.label.trim());
    }
  });
  const vitals = deriveHitPointSummary({
    draft: args.draft,
    classRecordsByEntry: args.classRecordsByEntry,
    effectiveAbilities: args.effectiveAbilities,
    selectedElements: args.selectedElements,
  });
  const speed = deriveWalkingSpeed({
    selectedRace: args.selectedRace,
    selectedSubrace: args.selectedSubrace,
    selectedElements: args.selectedElements,
  });
  const dexMod = getAbilityModifier(args.effectiveAbilities.dexterity);
  const attacksPerAction = args.selectedElements.some((element) => /extra attack/i.test(`${element.name} ${element.description ?? ""}`)) ? 2 : 1;
  const spellcastingAbility = getPrimarySpellcastingAbility(args.spellGroups);
  const spellcastingAbilityLabel = spellcastingAbility
    ? ABILITY_LABELS[spellcastingAbility.toLowerCase() as AbilityKey]
    : "";
  const spellcastingScore = spellcastingAbility
    ? getAbilityModifier(args.effectiveAbilities[spellcastingAbility.toLowerCase() as AbilityKey])
    : 0;
  const spellcastingBonus = spellcastingAbility ? proficiencyBonus + spellcastingScore : 0;
  const spellSaveDc = spellcastingAbility ? 8 + proficiencyBonus + spellcastingScore : 0;
  const kiSaveDc = getKiSaveDc(args, proficiencyBonus);
  const classResources = getClassResources(args);

  return [
    { id: "proficiency-bonus", label: "Proficiency Bonus", value: `+${proficiencyBonus}` },
    { id: "initiative", label: "Initiative", value: `${dexMod >= 0 ? "+" : ""}${dexMod}` },
    { id: "attacks", label: "Attacks / Action", value: `${attacksPerAction}` },
    { id: "passive-perception", label: "Passive Perception", value: `${10 + getAbilityModifier(args.effectiveAbilities.wisdom)}` },
    { id: "spellcasting-bonus", label: "Spellcasting Bonus", value: spellcastingAbility ? `${spellcastingBonus >= 0 ? "+" : ""}${spellcastingBonus}` : "" },
    { id: "spell-save-dc", label: spellcastingAbility ? "Save DC" : "Ki Save DC", value: spellcastingAbility ? `${spellSaveDc}` : kiSaveDc },
    { id: "spellcasting-ability", label: "Spellcasting Ability", value: spellcastingAbilityLabel },
    { id: "hp", label: "HP", value: vitals.value },
    { id: "ac", label: "AC", value: `${acData.value}` },
    { id: "defenses", label: "Defenses", value: defenses.join("\n") },
    { id: "speed", label: "Speed", value: `${speed.total} ft.` },
    { id: "hit-dice", label: "Hit Dice", value: deriveHitDiceSummary({ draft: args.draft, classRecordsByEntry: args.classRecordsByEntry }) },
    ...classResources.map((resource, index) => ({
      id: `class-resource-${index + 1}`,
      label: "Class Resource",
      value: resource.value,
      meta: resource.cadence ? `${resource.label}\n${resource.cadence}` : resource.label,
    })),
  ];
}

function buildFeatureCards(args: BuilderPdfSourceArgs) {
  const raceGrantedTraitIds = new Set(args.selectedRace ? collectGrantedIds(args.selectedRace.race.rules, "Racial Trait") : []);
  const subraceGrantedTraitIds = new Set(args.selectedSubrace ? collectGrantedIds(args.selectedSubrace.rules, "Racial Trait") : []);
  const racialTraits = args.selectedRacialTraitElements.filter((element) => raceGrantedTraitIds.has(element.id));
  const subracialTraits = args.selectedRacialTraitElements.filter((element) => subraceGrantedTraitIds.has(element.id));
  const unscopedTraits = args.selectedRacialTraitElements.filter(
    (element) => !raceGrantedTraitIds.has(element.id) && !subraceGrantedTraitIds.has(element.id),
  );
  const classFeatures = args.selectedClassFeatureElements.filter((element) => !/archetype/i.test(element.type) && !isLowSignalFeatureElement(element));
  const subclassFeatures = args.selectedClassFeatureElements.filter((element) => /archetype/i.test(element.type) && !isLowSignalFeatureElement(element));
  const backgroundFeatures = args.selectedBackgroundFeatureElements.filter((element) => !isLowSignalFeatureElement(element));
  const featFeatures = args.selectedFeatElements.filter((element) => !isLowSignalFeatureElement(element));
  const manualFeatures = args.selectedManualFeatureElements.filter((element) => !isLowSignalFeatureElement(element));
  const progressionFeatures = args.selectedProgressionElements.filter((element) => !isLowSignalFeatureElement(element));

  const cards = [
    ...racialTraits.map((element) =>
      withPdfGroupTag(withPdfTags(toPdfCardFromElement(element, { kind: "trait" }), getPassiveNoteTags(element)), "race"),
    ),
    ...subracialTraits.map((element) =>
      withPdfGroupTag(withPdfTags(toPdfCardFromElement(element, { kind: "trait" }), getPassiveNoteTags(element)), "subrace"),
    ),
    ...unscopedTraits.map((element) =>
      withPdfGroupTag(withPdfTags(toPdfCardFromElement(element, { kind: "trait" }), getPassiveNoteTags(element)), "race"),
    ),
    ...classFeatures.map((element) =>
      withPdfGroupTag(
        withPdfTags(toPdfCardFromElement(element, { kind: "feature", summary: getPlaySurfaceSummary(element) }), getPassiveNoteTags(element)),
        "class",
      ),
    ),
    ...subclassFeatures.map((element) =>
      withPdfGroupTag(
        withPdfTags(toPdfCardFromElement(element, { kind: "feature", summary: getPlaySurfaceSummary(element) }), getPassiveNoteTags(element)),
        "subclass",
      ),
    ),
    ...backgroundFeatures.map((element) =>
      withPdfGroupTag(
        withPdfTags(toPdfCardFromElement(element, { kind: "feature", summary: getPlaySurfaceSummary(element) }), getPassiveNoteTags(element)),
        "additional",
      ),
    ),
    ...featFeatures.map((element) =>
      withPdfGroupTag(
        withPdfTags(toPdfCardFromElement(element, { kind: "feature", summary: getPlaySurfaceSummary(element) }), getPassiveNoteTags(element)),
        "feat",
      ),
    ),
    ...manualFeatures.map((element) =>
      withPdfGroupTag(
        withPdfTags(toPdfCardFromElement(element, { kind: "feature", summary: getPlaySurfaceSummary(element) }), getPassiveNoteTags(element)),
        "additional",
      ),
    ),
    ...progressionFeatures.map((element) =>
      withPdfGroupTag(
        withPdfTags(toPdfCardFromElement(element, { kind: "feature", summary: getPlaySurfaceSummary(element) }), getPassiveNoteTags(element)),
        "other",
      ),
    ),
    ...args.manualGrantsByKind.feature.map((grant) => withPdfGroupTag(toPdfCardFromGrant(grant), "additional")),
    ...args.manualGrantsByKind.feat.map((grant) => withPdfGroupTag(toPdfCardFromGrant(grant), "feat")),
    ...args.manualGrantsByKind.asi.map((grant) => withPdfGroupTag(toPdfCardFromGrant(grant), "other")),
  ];

  return uniqueById(cards);
}

function buildCompanionCards(args: BuilderPdfSourceArgs) {
  return uniqueById(
    args.selectedProgressionElements
      .filter((element) => /companion/i.test(element.type) || /companion/i.test(element.name) || /companion/i.test(element.description))
      .map((element) => toPdfCardFromElement(element, { kind: "feature", pageHint: "companion" })),
  );
}

function buildInventoryCards(args: BuilderPdfSourceArgs) {
  return uniqueById(args.draft.inventoryItems.map((item) => toPdfCardFromInventoryItem(item)));
}

function buildSpellCards(args: BuilderPdfSourceArgs) {
  const spellsById = new Map(args.spells.map((spell) => [spell.id, spell]));
  const selectedIds = uniqueStrings([
    ...args.selectedSpellIds,
    ...args.manualGrantsByKind.spell.map((grant) => grant.refId).filter((id): id is string => Boolean(id)),
  ]);

  return uniqueById(
    selectedIds
      .map((id) => spellsById.get(id))
      .filter((spell): spell is BuiltInElement => Boolean(spell))
      .map((spell) => toPdfCardFromElement(spell, { kind: "spell" })),
  );
}

function buildSpellSlots(args: BuilderPdfSourceArgs): PdfSpellSlots | undefined {
  // Check if any class is a spellcaster
  const casterGroups = args.spellGroups.filter((g) => g.spellcastingAbility);
  if (!casterGroups.length) {
    return undefined;
  }

  // Determine caster type from the primary spellcaster class
  const primaryGroup = casterGroups[0];
  const ownerLabel = primaryGroup.ownerLabel.toLowerCase();

  const isFullCaster = /bard|cleric|druid|sorcerer|wizard/.test(ownerLabel);
  const isHalfCaster = /artificer|paladin|ranger/.test(ownerLabel);
  const isWarlock = /warlock/.test(ownerLabel);

  // Calculate total caster level across all spellcasting classes
  let totalCasterLevel = 0;
  args.classRecordsByEntry.forEach((record, index) => {
    const entry = args.draft.classEntries[index];
    if (!record || !entry?.classId) return;

    const className = record.class.name.toLowerCase();
    const entryLevel = entry.level ?? 0;

    // Only count levels from classes that contribute to spell slots
    if (/bard|cleric|druid|sorcerer|wizard/.test(className)) {
      totalCasterLevel += entryLevel;
    } else if (/artificer|paladin|ranger/.test(className)) {
      totalCasterLevel += entryLevel;
    } else if (/warlock/.test(className)) {
      // Warlock uses Pact Magic separately, but we still track it
      totalCasterLevel += entryLevel;
    }
  });

  if (totalCasterLevel === 0) {
    return undefined;
  }

  // For warlocks, use their pact slot level
  const effectiveLevel = isWarlock ? Math.min(totalCasterLevel, 20) : Math.min(totalCasterLevel, 20);

  // Get slot counts from explicit rules, or use fallback tables
  let slotEntries: { slotLevel: number; count: number }[] = [];

  // Try to get slots from the primary caster's rules
  const primaryRecord = args.classRecordsByEntry.find(
    (r) => r?.class.name.toLowerCase() === primaryGroup.ownerLabel.toLowerCase(),
  );
  if (primaryRecord) {
    const primaryEntry = args.draft.classEntries.find((e) => e?.classId === primaryRecord.class.id);
    if (primaryEntry) {
      slotEntries = getSpellSlotSummary(primaryRecord.class.rules, primaryEntry.level ?? 1);
    }
  }

  // If no explicit slots, use fallback tables
  if (!slotEntries.length) {
    if (isWarlock) {
      // Warlock Pact Magic: simplified table
      const pactLevel = Math.min(Math.ceil(effectiveLevel / 2), 5);
      const pactSlots = effectiveLevel >= 11 ? 3 : effectiveLevel >= 5 ? 2 : 1;
      if (pactLevel > 0) {
        slotEntries = [{ slotLevel: pactLevel, count: pactSlots }];
      }
    } else if (isHalfCaster) {
      // Half caster: PALADIN/RANGER table from review-sheet-step.tsx
      const HALF_CASTER_SLOT_TABLE: Record<number, number[]> = {
        1: [], 2: [2], 3: [3], 4: [3], 5: [4, 2], 6: [4, 2], 7: [4, 3], 8: [4, 3], 9: [4, 3, 2],
        10: [4, 3, 2], 11: [4, 3, 3], 12: [4, 3, 3], 13: [4, 3, 3, 1], 14: [4, 3, 3, 1], 15: [4, 3, 3, 2],
        16: [4, 3, 3, 2], 17: [4, 3, 3, 3, 1], 18: [4, 3, 3, 3, 1], 19: [4, 3, 3, 3, 2], 20: [4, 3, 3, 3, 2],
      };
      const slots = HALF_CASTER_SLOT_TABLE[effectiveLevel] ?? [];
      slotEntries = slots.map((count, i) => ({ slotLevel: i + 1, count }));
    } else {
      // Full caster table from review-sheet-step.tsx
      const FULL_CASTER_SLOT_TABLE: Record<number, number[]> = {
        1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1], 8: [4, 3, 3, 2],
        9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1], 12: [4, 3, 3, 3, 2, 1],
        13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1], 15: [4, 3, 3, 3, 2, 1, 1, 1],
        16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1], 18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
      };
      const slots = FULL_CASTER_SLOT_TABLE[effectiveLevel] ?? [];
      slotEntries = slots.map((count, i) => ({ slotLevel: i + 1, count }));
    }
  }

  const maxLevel = slotEntries.length > 0 ? Math.max(...slotEntries.map((e) => e.slotLevel)) : 0;

  const slots: PdfSpellSlotLevel[] = slotEntries.map(({ slotLevel, count }) => ({
    level: slotLevel,
    slots: count,
  }));

  return {
    maxLevel,
    slots,
    isFullCaster,
    isHalfCaster,
    isWarlock,
    hasPactMagic: isWarlock,
  };
}

function buildSpellList(args: BuilderPdfSourceArgs): PdfSpellListEntry[] {
  const spellsById = new Map(args.spells.map((spell) => [spell.id, spell]));
  const selectedIds = uniqueStrings([
    ...args.selectedSpellIds,
    ...args.manualGrantsByKind.spell.map((grant) => grant.refId).filter((id): id is string => Boolean(id)),
  ]);

  // Build source label map from spell groups
  const spellSourceMap = new Map<string, string>();
  args.spellGroups.forEach((group) => {
    const sourceLabel = group.ownerType === "race" ? "Racial" : group.ownerType === "subrace" ? "Subracial" : group.ownerLabel;
    group.grantedSpellIds.forEach((id) => {
      if (!spellSourceMap.has(id)) {
        spellSourceMap.set(id, sourceLabel);
      }
    });
  });

  // Also track source from manual grants
  args.manualGrantsByKind.spell.forEach((grant) => {
    if (grant.refId) {
      spellSourceMap.set(grant.refId, grant.name || "Additional");
    }
  });

  return uniqueStrings(selectedIds)
    .map((id) => spellsById.get(id))
    .filter((spell): spell is BuiltInElement => Boolean(spell))
    .map((spell) => {
      const spellLevel = getSpellLevel(spell);
      const sourceLabel = spellSourceMap.get(spell.id) ?? spell.source?.replace(/\([^)]*\)\s*$/, "").trim() ?? undefined;
      return {
        id: spell.id,
        name: spell.name,
        level: spellLevel,
        sourceLabel,
      };
    });
}

function buildBackstoryCards(args: BuilderPdfSourceArgs) {
  const backstory = args.draft.backstory;
  return [
    ...(backstory.personalityTraits ? [{ id: "personality-traits", title: "Personality traits", kind: "note" as const, contentKind: "detail" as const, summary: backstory.personalityTraits, detail: backstory.personalityTraits, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
    ...(backstory.ideals ? [{ id: "ideals", title: "Ideals", kind: "note" as const, contentKind: "detail" as const, summary: backstory.ideals, detail: backstory.ideals, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
    ...(backstory.bonds ? [{ id: "bonds", title: "Bonds", kind: "note" as const, contentKind: "detail" as const, summary: backstory.bonds, detail: backstory.bonds, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
    ...(backstory.flaws ? [{ id: "flaws", title: "Flaws", kind: "note" as const, contentKind: "detail" as const, summary: backstory.flaws, detail: backstory.flaws, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
    ...(backstory.alliesAndOrganizations ? [{ id: "allies-and-organizations", title: "Allies and organizations", kind: "note" as const, contentKind: "detail" as const, summary: backstory.alliesAndOrganizations, detail: backstory.alliesAndOrganizations, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
    ...(backstory.backstory ? [{ id: "backstory", title: "Backstory", kind: "note" as const, contentKind: "detail" as const, summary: backstory.backstory, detail: backstory.backstory, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
    ...(backstory.additionalFeatures ? [{ id: "additional-features", title: "Additional features", kind: "note" as const, contentKind: "detail" as const, summary: backstory.additionalFeatures, detail: backstory.additionalFeatures, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
  ];
}

export function buildPdfCharacterFromDraft(args: BuilderPdfDraftCatalogs & { draft: CharacterDraft }) {
  const { backgrounds, classes, draft, feats, progressionElements, races, spells } = args;
  const selectedRace = races.find((entry) => entry.race.id === draft.raceId) ?? null;
  const selectedSubrace = selectedRace?.subraces.find((entry) => entry.id === draft.subraceId) ?? null;
  const selectedBackground = backgrounds.find((entry) => entry.background.id === draft.backgroundId) ?? null;
  const classRecordsByEntry = draft.classEntries.map(
    (entry) => classes.find((candidate) => candidate.class.id === entry.classId) ?? null,
  );
  const selectedFeatElements = Object.values(draft.improvementSelections)
    .filter((selection) => selection.mode === "feat" && selection.featId)
    .map((selection) => feats.find((feat) => feat.id === selection.featId))
    .filter((feat): feat is BuiltInElement => Boolean(feat));
  const elementPool = new Map(
    [
      ...progressionElements,
      ...feats,
      ...spells,
      ...races.flatMap((entry) => [entry.race, ...entry.subraces, ...entry.traits]),
      ...classes.flatMap((entry) => [
        entry.class,
        ...entry.features,
        ...entry.subclassSteps.flatMap((step) =>
          step.options.flatMap((option) => [option.archetype, ...option.features]),
        ),
      ]),
      ...backgrounds.flatMap((entry) => [entry.background, ...entry.features]),
    ].map((element) => [element.id, element] as const),
  );
  const selectedManualFeatElements = draft.manualGrants
    .filter((grant) => grant.kind === "feat" && grant.refId)
    .map((grant) => elementPool.get(grant.refId ?? ""))
    .filter((entry): entry is BuiltInElement => Boolean(entry));
  const selectedManualFeatureElements = draft.manualGrants
    .filter((grant) => grant.kind === "feature" && grant.refId)
    .map((grant) => elementPool.get(grant.refId ?? ""))
    .filter((entry): entry is BuiltInElement => Boolean(entry));
  const allSelectedFeatElements = uniqueById([...selectedFeatElements, ...selectedManualFeatElements]);
  const selectedRacialTraitIds = [
    ...(selectedRace ? collectGrantedIds(selectedRace.race.rules, "Racial Trait") : []),
    ...(selectedSubrace ? collectGrantedIds(selectedSubrace.rules, "Racial Trait") : []),
  ];
  const selectedRacialTraitElements =
    selectedRace?.traits.filter((trait) => selectedRacialTraitIds.includes(trait.id)) ?? [];
  const selectedClassFeatureElements = classRecordsByEntry.flatMap((record, index) => {
    const entry = draft.classEntries[index];
    if (!record || !entry?.classId) {
      return [];
    }

    const classFeatureIds = collectGrantedIdsAtLevel(record.class.rules, "Class Feature", entry.level);
    const selectedSubclass =
      record.subclassSteps.flatMap((step) => step.options).find((option) => option.archetype.id === entry.subclassId) ?? null;
    const subclassFeatureIds = selectedSubclass
      ? collectGrantedIdsAtLevel(selectedSubclass.archetype.rules, "Archetype Feature", entry.level)
      : [];
    const grantedFeatureIds = new Set([...classFeatureIds, ...subclassFeatureIds]);

    return [
      ...record.features.filter((feature) => grantedFeatureIds.has(feature.id)),
      ...(selectedSubclass?.features.filter((feature) => grantedFeatureIds.has(feature.id)) ?? []),
    ];
  });
  const selectedBackgroundFeatureIds = selectedBackground
    ? collectGrantedIds(selectedBackground.background.rules, "Background Feature")
    : [];
  const selectedBackgroundFeatureElements =
    selectedBackground?.features.filter((feature) => selectedBackgroundFeatureIds.includes(feature.id)) ?? [];
  const directProgressionElements = Object.values(draft.progressionSelections)
    .flat()
    .map((id) => elementPool.get(id))
    .filter((entry): entry is BuiltInElement => Boolean(entry));
  const rawProgressionSelectionIds = uniqueStrings(Object.values(draft.progressionSelections).flat());
  const rawProficiencySelectionIds = rawProgressionSelectionIds.filter(isRawProficiencySelection);
  const rawLanguageSelectionIds = rawProgressionSelectionIds.filter(isRawLanguageSelection);
  const selectedProgressionGrantElements = collectAllNestedGrantedElements(elementPool, [
    ...(selectedRace ? [selectedRace.race] : []),
    ...(selectedSubrace ? [selectedSubrace] : []),
    ...selectedRacialTraitElements,
    ...selectedClassFeatureElements,
    ...selectedBackgroundFeatureElements,
    ...allSelectedFeatElements,
    ...selectedManualFeatureElements,
    ...directProgressionElements,
  ]);
  const selectedProgressionElements = uniqueById([
    ...directProgressionElements,
    ...selectedProgressionGrantElements,
  ]);
  const racialBonuses = draft.useTashasCustomizedOrigin
    ? emptyAbilityMap()
    : getStatBonuses(
        [
          ...(selectedRace?.race.rules ?? []),
          ...(selectedSubrace?.rules ?? []),
        ].flatMap((rule) =>
          rule.kind === "stat" && ABILITY_KEYS.includes(rule.name as AbilityKey)
            ? [`${rule.name}:${rule.value}`]
            : [],
        ),
      );
  const improvementBonuses = getImprovementBonuses(draft.improvementSelections);
  const manualAbilityBonuses = draft.manualGrants.reduce<Record<AbilityKey, number>>((totals, grant) => {
    if (grant.kind === "asi" && grant.mode === "increase" && grant.ability && Number.isFinite(grant.amount)) {
      totals[grant.ability] += grant.amount ?? 0;
    }
    return totals;
  }, emptyAbilityMap());
  const effectiveAbilities = addAbilityBonusMaps(
    draft.abilities,
    racialBonuses,
    improvementBonuses,
    collectStatBonusesFromElements([...allSelectedFeatElements, ...selectedManualFeatureElements]),
    manualAbilityBonuses,
  );
  const selectedSpellIds = Object.values(draft.spellSelections)
    .flat()
    .filter((id, index, values): id is string => Boolean(id) && values.indexOf(id) === index);
  const activeSpellGroups = deriveSpellcastingGroups({
    activeFeats: allSelectedFeatElements,
    activeProgressionOptions: selectedProgressionElements,
    classRecordsByEntry,
    classEntries: draft.classEntries,
    effectiveAbilities,
    race: selectedRace,
    spellSelections: draft.spellSelections,
    spells,
    subrace: selectedSubrace,
    hasSpellcastingAccess: selectedProgressionElements.some((element) => Boolean(element.spellcasting)),
    totalLevel: getTotalCharacterLevel(draft),
  });
  const selectedProficiencyIds = uniqueStrings([
    ...(selectedRace ? collectGrantedIds(selectedRace.race.rules, "Proficiency") : []),
    ...(selectedSubrace ? collectGrantedIds(selectedSubrace.rules, "Proficiency") : []),
    ...collectGrantedIdsFromElements(selectedRacialTraitElements, "Proficiency"),
    ...classRecordsByEntry.flatMap((record, index) => {
      const entry = draft.classEntries[index];
      return record && entry?.classId
        ? collectGrantedIdsAtLevel(record.class.rules, "Proficiency", entry.level)
        : [];
    }),
    ...collectGrantedIdsFromElements(selectedClassFeatureElements, "Proficiency"),
    ...(selectedBackground ? collectGrantedIds(selectedBackground.background.rules, "Proficiency") : []),
    ...collectGrantedIdsFromElements(selectedBackgroundFeatureElements, "Proficiency"),
    ...collectGrantedIdsFromElements(allSelectedFeatElements, "Proficiency"),
    ...collectGrantedIdsFromElements(selectedManualFeatureElements, "Proficiency"),
    ...rawProficiencySelectionIds.filter((id) => id.trim().toUpperCase().startsWith("ID_")),
    ...selectedProgressionElements.flatMap((element) =>
      element.type === "Proficiency" ? [element.id] : collectGrantedIds(element.rules, "Proficiency"),
    ),
  ]);
  const selectedLanguageIds = uniqueStrings([
    ...(selectedRace ? collectGrantedIds(selectedRace.race.rules, "Language") : []),
    ...(selectedSubrace ? collectGrantedIds(selectedSubrace.rules, "Language") : []),
    ...(selectedBackground ? collectGrantedIds(selectedBackground.background.rules, "Language") : []),
    ...collectGrantedIdsFromElements(allSelectedFeatElements, "Language"),
    ...collectGrantedIdsFromElements(selectedManualFeatureElements, "Language"),
    ...rawLanguageSelectionIds.filter((id) => id.trim().toUpperCase().startsWith("ID_")),
    ...selectedProgressionElements.flatMap((element) =>
      element.type === "Language" ? [element.id] : collectGrantedIds(element.rules, "Language"),
    ),
  ]);
  const manualGrantsByKind = draft.manualGrants.reduce<Record<CharacterManualGrant["kind"], CharacterManualGrant[]>>(
    (groups, grant) => {
      groups[grant.kind].push(grant);
      return groups;
    },
    {
      spell: [],
      proficiency: [],
      language: [],
      feat: [],
      feature: [],
      asi: [],
    },
  );

  return buildPdfCharacterFromBuilder({
    abilities: draft.abilities,
    allSelectedFeatElements,
    classRecordsByEntry,
    draft,
    effectiveAbilities,
    manualGrantsByKind,
    selectedBackground,
    selectedBackgroundFeatureElements,
    selectedClassFeatureElements,
    selectedExpertiseIds: [
      ...new Set(
        [
          ...selectedProgressionElements,
          ...selectedClassFeatureElements,
          ...allSelectedFeatElements,
          ...selectedBackgroundFeatureElements,
          ...selectedRacialTraitElements,
          ...selectedManualFeatureElements,
        ].flatMap((e) => collectGrantedIds(e.rules, "Expertise")),
      ),
    ],
    selectedExpertiseLabels: [
      ...new Set(
        [
          ...selectedProgressionElements,
          ...selectedClassFeatureElements,
          ...allSelectedFeatElements,
          ...selectedBackgroundFeatureElements,
          ...selectedRacialTraitElements,
          ...selectedManualFeatureElements,
        ].flatMap(extractExpertiseLabelsFromElement),
      ),
    ],
    selectedFeatElements: allSelectedFeatElements,
    selectedLanguageIds,
    selectedLanguageNames: [
      ...selectedLanguageIds.map(humanizeGrantedId),
      ...rawLanguageSelectionIds.map(selectionLabelFromId),
      ...manualGrantsByKind.language.map((grant) => grant.name),
    ],
    selectedManualFeatureElements,
    selectedProgressionElements,
    selectedProficiencyIds,
    selectedProficiencyNames: [
      ...selectedProficiencyIds.map(humanizeGrantedId),
      ...rawProficiencySelectionIds.map(selectionLabelFromId),
      ...manualGrantsByKind.proficiency.map((grant) => grant.name),
    ],
    selectedRace,
    selectedRacialTraitElements,
    selectedSpellIds,
    selectedSubrace,
    spellGroups: activeSpellGroups,
    spells,
    selectedElements: [
      ...selectedClassFeatureElements,
      ...selectedProgressionElements,
      ...allSelectedFeatElements,
      ...selectedRacialTraitElements,
      ...selectedBackgroundFeatureElements,
      ...selectedManualFeatureElements,
    ],
  });
}

export function buildPdfCharacterFromBuilder(args: BuilderPdfSourceArgs): ResolvedPdfCharacter {
  const source: PdfResolveSource = {
    draft: args.draft,
    identity: {
      raceLabel: args.selectedRace?.race.name || "",
      subraceLabel: args.selectedSubrace?.name || "",
      classLabel: getClassLabel(args.classRecordsByEntry, args.draft),
      subclassLabel: getSubclassLabel(args.classRecordsByEntry, args.draft),
      backgroundLabel: args.selectedBackground?.background.name || "",
    },
    stats: buildStatCards(args),
    abilityRows: buildAbilityRows(args),
    skillRows: buildSkillRows(args),
    attackRows: buildAttackRows(args),
    proficiencyGroups: buildProficiencyGroups(args),
    featureCards: buildFeatureCards(args),
    companionCards: buildCompanionCards(args),
    inventoryCards: buildInventoryCards(args),
    spellCards: buildSpellCards(args),
    spellSlots: buildSpellSlots(args),
    spellList: buildSpellList(args),
    backstoryCards: buildBackstoryCards(args),
    backstory: args.draft.backstory,
    currency: args.draft.inventoryCurrency,
    manualGrants: args.draft.manualGrants,
    notes: [
      "Export derived from the current review-step resolved model.",
      ...(args.selectedExpertiseLabels.length ? [`Expertise: ${args.selectedExpertiseLabels.join(", ")}`] : []),
      ...(args.selectedProficiencyNames.length ? [`Proficiencies: ${args.selectedProficiencyNames.join(", ")}`] : []),
      ...(args.selectedLanguageNames.length ? [`Languages: ${args.selectedLanguageNames.join(", ")}`] : []),
      ...(args.selectedSpellIds.length ? [`Selected spells: ${args.selectedSpellIds.length}`] : []),
    ],
  };

  return resolvePdfCharacter(source);
}
