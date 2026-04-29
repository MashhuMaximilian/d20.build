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
import { ABILITY_LABELS } from "@/lib/characters/types";
import { normalizeInventoryWeaponItem } from "@/lib/equipment/inventory";
import type { SpellSelectionGroup } from "@/lib/progression/spellcasting";

import {
  resolvePdfCharacter,
  toPdfCardFromElement,
  toPdfCardFromGrant,
  toPdfCardFromInventoryItem,
  type PdfResolveSource,
  type ResolvedPdfCharacter,
} from "@/lib/pdf";

type BuilderPdfSourceArgs = {
  abilities: Record<AbilityKey, number>;
  allSelectedFeatElements: BuiltInElement[];
  classRecordsByEntry: Array<BuiltInClassRecord | null>;
  draft: CharacterDraft;
  effectiveAbilities: Record<AbilityKey, number>;
  manualGrantsByKind: Record<CharacterManualGrant["kind"], CharacterManualGrant[]>;
  selectedBackground: BuiltInBackgroundRecord | null;
  selectedBackgroundFeatureElements: BuiltInElement[];
  selectedClassFeatureElements: BuiltInElement[];
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

const ABILITY_FULL_LABELS: Record<AbilityKey, string> = {
  strength: "Strength",
  dexterity: "Dexterity",
  constitution: "Constitution",
  intelligence: "Intelligence",
  wisdom: "Wisdom",
  charisma: "Charisma",
};

function normalizeLookupLabel(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function humanizeGrantedId(value: string) {
  return value
    .replace(/^ID_[A-Z0-9_]+?_PROFICIENCY_/, "")
    .replace(/^ID_PROFICIENCY_/, "")
    .replace(/^ID_LANGUAGE_/, "")
    .replace(/^ID_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bCant\b/g, "Cant");
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
  const dexMod = getAbilityModifier(args.effectiveAbilities.dexterity);
  const equippedItems = args.draft.inventoryItems.filter((item) => item.equipped);
  const equippedArmor = equippedItems.filter((item) => item.category === "armor" && !/\bshield\b/i.test(item.name));
  const equippedShields = equippedItems.filter((item) => item.category === "shield" || /\bshield\b/i.test(item.name));

  const armorTotals = equippedArmor.map((item) => {
    const sourceName = item.baseItemName || item.name;
    const armorRules: Array<{ match: RegExp; base: number; dexCap?: number }> = [
      { match: /\bpadded\b/i, base: 11 },
      { match: /\bleather\b/i, base: 11 },
      { match: /\bstudded leather\b/i, base: 12 },
      { match: /\bhide\b/i, base: 12, dexCap: 2 },
      { match: /\bchain shirt\b/i, base: 13, dexCap: 2 },
      { match: /\bscale mail\b/i, base: 14, dexCap: 2 },
      { match: /\bbreastplate\b/i, base: 14, dexCap: 2 },
      { match: /\bhalf plate\b/i, base: 15, dexCap: 2 },
      { match: /\bring mail\b/i, base: 14, dexCap: 0 },
      { match: /\bchain mail\b/i, base: 16, dexCap: 0 },
      { match: /\bsplint\b/i, base: 17, dexCap: 0 },
      { match: /\bplate\b/i, base: 18, dexCap: 0 },
    ];
    const rule = armorRules.find((entry) => entry.match.test(sourceName));
    if (!rule) {
      return null;
    }
    const dexContribution = Math.min(dexMod, rule.dexCap ?? dexMod);
    const magic = item.attackBonus ? Number.parseInt(item.attackBonus.replace(/[^\d-]/g, ""), 10) || 0 : 0;
    return {
      item,
      total: rule.base + dexContribution + magic,
      detail: `${sourceName}: ${rule.base}${rule.dexCap === 0 ? "" : `, Dex ${dexContribution >= 0 ? "+" : ""}${dexContribution}`}${magic ? `, magic ${magic >= 0 ? "+" : ""}${magic}` : ""}`,
    };
  }).filter((entry): entry is { item: CharacterDraft["inventoryItems"][number]; total: number; detail: string } => Boolean(entry));

  const chosenArmor = armorTotals.sort((left, right) => right.total - left.total)[0];
  const shieldBonus = equippedShields.reduce((sum, item) => {
    const magic = item.attackBonus ? Number.parseInt(item.attackBonus.replace(/[^\d-]/g, ""), 10) || 0 : 0;
    return sum + 2 + magic;
  }, 0);

  if (chosenArmor) {
    return {
      value: chosenArmor.total + shieldBonus,
      meta: `${chosenArmor.item.name}${shieldBonus ? ` + shield ${shieldBonus}` : ""}`,
    };
  }

  return {
    value: 10 + dexMod + shieldBonus,
    meta: `${shieldBonus ? `10 + Dex ${dexMod >= 0 ? "+" : ""}${dexMod} + shield ${shieldBonus}` : `10 + Dex ${dexMod >= 0 ? "+" : ""}${dexMod}`}`,
  };
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

function getClassLabel(classRecordsByEntry: Array<BuiltInClassRecord | null>, draft: CharacterDraft) {
  const labels = draft.classEntries.map((entry, index) => classRecordsByEntry[index]?.class.name || entry.classId).filter(Boolean);
  return labels.join(" / ");
}

function buildAbilityRows(args: BuilderPdfSourceArgs) {
  const proficiencyBonus = getProficiencyBonus(args.draft.level);
  const proficiencyLabels = new Set(args.selectedProficiencyNames.map(normalizeLookupLabel));

  return Object.entries(ABILITY_LABELS).map(([abilityKey, label]) => {
    const ability = abilityKey as AbilityKey;
    const fullLabel = ABILITY_FULL_LABELS[ability];
    const score = Number.isFinite(args.effectiveAbilities[ability]) ? args.effectiveAbilities[ability] : 10;
    const modifier = getAbilityModifier(score);
    const saveProficient =
      proficiencyLabels.has(normalizeLookupLabel(label)) ||
      proficiencyLabels.has(normalizeLookupLabel(`${label} saving throw`)) ||
      proficiencyLabels.has(normalizeLookupLabel(fullLabel)) ||
      proficiencyLabels.has(normalizeLookupLabel(`${fullLabel} saving throw`));

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
  const proficiencyLabels = new Set(args.selectedProficiencyNames.map(normalizeLookupLabel));
  const expertiseLabels = new Set(args.selectedExpertiseLabels.map(normalizeLookupLabel));

  return SKILL_ABILITY_MAP.map((skill) => {
    const proficient = proficiencyLabels.has(normalizeLookupLabel(skill.label));
    const expertise = expertiseLabels.has(normalizeLookupLabel(skill.label));
    const tier = expertise ? 2 : proficient ? 1 : 0;
    const score = Number.isFinite(args.effectiveAbilities[skill.ability]) ? args.effectiveAbilities[skill.ability] : 10;
    const modifier = getAbilityModifier(score);
    return {
      id: `skill-${skill.id}`,
      label: skill.label,
      ability: ABILITY_LABELS[skill.ability],
      total: modifier + (proficiencyBonus * tier),
      proficient,
      expertise,
    };
  });
}

function buildAttackRows(args: BuilderPdfSourceArgs) {
  return uniqueById(
    args.draft.inventoryItems
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
      }),
  );
}

function buildProficiencyGroups(args: BuilderPdfSourceArgs) {
  const names = uniqueStrings([
    ...args.selectedProficiencyNames,
    ...args.selectedProficiencyIds.map(humanizeGrantedId),
    ...args.manualGrantsByKind.proficiency.map((grant) => grant.name),
  ]);
  const languages = uniqueStrings([
    ...args.selectedLanguageNames,
    ...args.selectedLanguageIds.map(humanizeGrantedId),
    ...args.manualGrantsByKind.language.map((grant) => grant.name),
  ]);

  const groups = {
    weapons: [] as string[],
    armor: [] as string[],
    tools: [] as string[],
    vehicles: [] as string[],
    languages,
  };

  names.forEach((name) => {
    const normalized = normalizeLookupLabel(name);
    if (/\b(weapon|sword|bow|crossbow|dagger|rapier|axe|mace|staff|spear|martial|simple)\b/.test(normalized)) {
      groups.weapons.push(name);
      return;
    }
    if (/\b(armor|armour|shield)\b/.test(normalized)) {
      groups.armor.push(name);
      return;
    }
    if (/\b(vehicle|mount|waterborne|land)\b/.test(normalized)) {
      groups.vehicles.push(name);
      return;
    }
    groups.tools.push(name);
  });

  return {
    weapons: uniqueStrings(groups.weapons),
    armor: uniqueStrings(groups.armor),
    tools: uniqueStrings(groups.tools),
    vehicles: uniqueStrings(groups.vehicles),
    languages: uniqueStrings(groups.languages),
  };
}

function buildStatCards(args: BuilderPdfSourceArgs) {
  const proficiencyBonus = getProficiencyBonus(args.draft.level);
  const vitals = deriveHitPointSummary({
    draft: args.draft,
    classRecordsByEntry: args.classRecordsByEntry,
    effectiveAbilities: args.effectiveAbilities,
    selectedElements: args.selectedElements,
  });
  const armorClass = deriveArmorClass({
    draft: args.draft,
    effectiveAbilities: args.effectiveAbilities,
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

  return [
    { id: "proficiency-bonus", label: "Proficiency Bonus", value: `+${proficiencyBonus}` },
    { id: "initiative", label: "Initiative", value: `${dexMod >= 0 ? "+" : ""}${dexMod}` },
    { id: "attacks", label: "Attacks / Action", value: `${attacksPerAction}` },
    { id: "passive-perception", label: "Passive Perception", value: `${10 + getAbilityModifier(args.effectiveAbilities.wisdom)}` },
    { id: "spellcasting-bonus", label: "Spellcasting Bonus", value: spellcastingAbility ? `${spellcastingBonus >= 0 ? "+" : ""}${spellcastingBonus}` : "" },
    { id: "spell-save-dc", label: spellcastingAbility ? "Save DC" : "Ki Save DC", value: spellcastingAbility ? `${spellSaveDc}` : kiSaveDc },
    { id: "spellcasting-ability", label: "Spellcasting Ability", value: spellcastingAbilityLabel },
    { id: "hp", label: "HP", value: vitals.value },
    { id: "ac", label: "AC", value: `${armorClass.value}` },
    { id: "speed", label: "Speed", value: `${speed.total} ft.` },
    { id: "hit-dice", label: "Hit Dice", value: deriveHitDiceSummary({ draft: args.draft, classRecordsByEntry: args.classRecordsByEntry }) },
  ];
}

function buildFeatureCards(args: BuilderPdfSourceArgs) {
  const cards = [
    ...args.selectedRacialTraitElements.map((element) => toPdfCardFromElement(element, { kind: "trait" })),
    ...args.selectedClassFeatureElements.map((element) => toPdfCardFromElement(element, { kind: "feature" })),
    ...args.selectedBackgroundFeatureElements.map((element) => toPdfCardFromElement(element, { kind: "feature" })),
    ...args.selectedFeatElements.map((element) => toPdfCardFromElement(element, { kind: "feature" })),
    ...args.selectedManualFeatureElements.map((element) => toPdfCardFromElement(element, { kind: "feature" })),
    ...args.selectedProgressionElements.map((element) => toPdfCardFromElement(element, { kind: "feature" })),
    ...args.manualGrantsByKind.feature.map((grant) => toPdfCardFromGrant(grant)),
    ...args.manualGrantsByKind.feat.map((grant) => toPdfCardFromGrant(grant)),
    ...args.manualGrantsByKind.asi.map((grant) => toPdfCardFromGrant(grant)),
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

export function buildPdfCharacterFromBuilder(args: BuilderPdfSourceArgs): ResolvedPdfCharacter {
  const source: PdfResolveSource = {
    draft: args.draft,
    identity: {
      raceLabel: args.selectedRace?.race.name || "",
      subraceLabel: args.selectedSubrace?.name || "",
      classLabel: getClassLabel(args.classRecordsByEntry, args.draft),
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
