import type { AbilityKey } from "@/lib/characters/types";

export type ProficiencyFactTier = "proficient" | "expertise" | "unknown";

export type ProficiencyFactKind =
  | "armor"
  | "savingThrow"
  | "skill"
  | "tool"
  | "vehicle"
  | "weapon"
  | "language"
  | "other";

export type ProficiencyFact = {
  id: string;
  kind: ProficiencyFactKind;
  label: string;
  tier: ProficiencyFactTier;
  sourceId?: string;
  ability?: AbilityKey;
  skillId?: string;
};

type ProficiencyFactInput = {
  id?: string;
  label?: string;
  tier?: ProficiencyFactTier;
};

const ABILITY_BY_ID: Record<string, AbilityKey> = {
  strength: "strength",
  str: "strength",
  dexterity: "dexterity",
  dex: "dexterity",
  constitution: "constitution",
  con: "constitution",
  intelligence: "intelligence",
  int: "intelligence",
  wisdom: "wisdom",
  wis: "wisdom",
  charisma: "charisma",
  cha: "charisma",
};

const ABILITY_LABELS: Record<AbilityKey, string> = {
  strength: "Strength",
  dexterity: "Dexterity",
  constitution: "Constitution",
  intelligence: "Intelligence",
  wisdom: "Wisdom",
  charisma: "Charisma",
};

const SKILLS: Array<{ id: string; key: string; label: string }> = [
  { id: "acrobatics", key: "acrobatics", label: "Acrobatics" },
  { id: "animal-handling", key: "animalhandling", label: "Animal Handling" },
  { id: "arcana", key: "arcana", label: "Arcana" },
  { id: "athletics", key: "athletics", label: "Athletics" },
  { id: "deception", key: "deception", label: "Deception" },
  { id: "history", key: "history", label: "History" },
  { id: "insight", key: "insight", label: "Insight" },
  { id: "intimidation", key: "intimidation", label: "Intimidation" },
  { id: "investigation", key: "investigation", label: "Investigation" },
  { id: "medicine", key: "medicine", label: "Medicine" },
  { id: "nature", key: "nature", label: "Nature" },
  { id: "perception", key: "perception", label: "Perception" },
  { id: "performance", key: "performance", label: "Performance" },
  { id: "persuasion", key: "persuasion", label: "Persuasion" },
  { id: "religion", key: "religion", label: "Religion" },
  { id: "sleight-of-hand", key: "sleightofhand", label: "Sleight of Hand" },
  { id: "stealth", key: "stealth", label: "Stealth" },
  { id: "survival", key: "survival", label: "Survival" },
];

const WEAPON_LABEL_OVERRIDES: Record<string, string> = {
  CROSSBOW_HAND: "Hand Crossbow",
  MARTIAL_WEAPONS: "Martial Weapons",
  SIMPLE_WEAPONS: "Simple Weapons",
};

const TOOL_LABEL_OVERRIDES: Record<string, string> = {
  ARTISAN_TOOLS: "Artisan's Tools",
  ARTISANS_TOOLS: "Artisan's Tools",
  GAMING_SET: "Gaming Set",
  GAMING_SETS: "Gaming Sets",
  MUSICAL_INSTRUMENT: "Musical Instrument",
  MUSICAL_INSTRUMENTS: "Musical Instruments",
  THIEVES_TOOLS: "Thieves' Tools",
};

const MUSICAL_INSTRUMENT_LABELS = new Set([
  "bagpipes",
  "drum",
  "dulcimer",
  "flute",
  "guitar",
  "harp",
  "horn",
  "lute",
  "lyre",
  "panflute",
  "shawm",
  "viol",
  "violin",
]);

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function toFactId(kind: ProficiencyFactKind, value: string) {
  return `${kind}:${normalizeKey(value)}`;
}

function titleCaseIdTail(value: string) {
  return value
    .toLowerCase()
    .split(/_+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getSkillByKey(value: string) {
  const key = normalizeKey(value);
  return SKILLS.find((skill) => skill.key === key || normalizeKey(skill.label) === key) ?? null;
}

function getAbilityFromText(value: string) {
  const normalized = normalizeKey(value);
  return Object.entries(ABILITY_BY_ID).find(([key]) => normalized === key || normalized.includes(key))?.[1] ?? null;
}

function factFromId(sourceId: string): ProficiencyFact | null {
  const id = sourceId.trim().toUpperCase();

  // ID_EXPERTISE_TOOL_PROFICIENCY_*: expertise tier tool (e.g. Bard musical instrument expertise)
  const expertiseToolTail = id.match(/^ID_EXPERTISE_TOOL_PROFICIENCY_(.+)$/)?.[1];
  if (expertiseToolTail) {
    const label = TOOL_LABEL_OVERRIDES[expertiseToolTail] ?? titleCaseIdTail(expertiseToolTail);
    return { id: toFactId("tool", label), kind: "tool", label, tier: "expertise", sourceId };
  }

  // ID_EXPERTISE_SKILL_*: expertise tier skill
  const expertiseSkillTail = id.match(/^ID_EXPERTISE_SKILL_(.+)$/)?.[1];
  if (expertiseSkillTail) {
    const skill = getSkillByKey(expertiseSkillTail);
    if (!skill) {
      return null;
    }
    return {
      id: toFactId("skill", skill.id),
      kind: "skill",
      label: skill.label,
      tier: "expertise",
      sourceId,
      skillId: skill.id,
    };
  }

  // ID_PROFICIENCY_SKILL_*: proficient skill (or if label indicates expertise)
  const skillTail = id.match(/^ID_PROFICIENCY_SKILL_(.+)$/)?.[1];
  if (skillTail) {
    const skill = getSkillByKey(skillTail);
    if (!skill) {
      return null;
    }
    return {
      id: toFactId("skill", skill.id),
      kind: "skill",
      label: skill.label,
      tier: "proficient",
      sourceId,
      skillId: skill.id,
    };
  }

  const saveTail = id.match(/^ID_PROFICIENCY_SAVINGTHROW_(.+)$/)?.[1];
  if (saveTail) {
    const ability = ABILITY_BY_ID[saveTail.toLowerCase()];
    if (!ability) {
      return null;
    }
    return {
      id: toFactId("savingThrow", ability),
      kind: "savingThrow",
      label: `${ABILITY_LABELS[ability]} Saving Throw`,
      tier: "proficient",
      sourceId,
      ability,
    };
  }

  const armorTail = id.match(/^ID_PROFICIENCY_ARMOR_PROFICIENCY_(.+)$/)?.[1];
  if (armorTail) {
    const label = titleCaseIdTail(armorTail);
    return { id: toFactId("armor", label), kind: "armor", label, tier: "proficient", sourceId };
  }

  const weaponTail = id.match(/^ID_PROFICIENCY_WEAPON_PROFICIENCY_(.+)$/)?.[1];
  if (weaponTail) {
    const label = WEAPON_LABEL_OVERRIDES[weaponTail] ?? titleCaseIdTail(weaponTail);
    return { id: toFactId("weapon", label), kind: "weapon", label, tier: "proficient", sourceId };
  }

  const toolTail = id.match(/^ID_PROFICIENCY_TOOL_PROFICIENCY_(.+)$/)?.[1];
  if (toolTail) {
    if (toolTail.startsWith("VEHICLES_")) {
      const label = titleCaseIdTail(toolTail.replace(/^VEHICLES_/, ""));
      return { id: toFactId("vehicle", label), kind: "vehicle", label, tier: "proficient", sourceId };
    }

    const label = TOOL_LABEL_OVERRIDES[toolTail] ?? titleCaseIdTail(toolTail);
    return { id: toFactId("tool", label), kind: "tool", label, tier: "proficient", sourceId };
  }

  // ID_LANGUAGE_*
  const languageTail = id.match(/^ID_LANGUAGE_(.+)$/)?.[1];
  if (languageTail) {
    const label = titleCaseIdTail(languageTail);
    return { id: toFactId("language", label), kind: "language", label, tier: "proficient", sourceId };
  }

  // Map known manual/internal helper IDs to appropriate facts or silently handle them.
  const idHandlers: Record<string, () => ProficiencyFact | null> = {
    "manual-prof-armor-shields": () =>
      ({ id: toFactId("armor", "Shields"), kind: "armor", label: "Shields", tier: "proficient", sourceId }),
    "ID_INTERNAL_TOOL_MUSICAL_INSTRUMENT": () =>
      ({
        id: toFactId("tool", "Musical Instrument"),
        kind: "tool",
        label: "Musical Instrument",
        tier: "proficient",
        sourceId,
      }),
    "ID_INTERNAL_PROFICIENCY_SPELLFOCUS_GROUP_ARCANE_FOCUS": () => null, // purely internal equipment marker
  };
  const handler = idHandlers[sourceId];
  if (handler) {
    return handler();
  }

  console.warn(`[proficiencies] Unknown ID in factFromId: "${sourceId}"`);
  return null;
}

function factFromLabel(label: string, tierHint?: ProficiencyFactTier): ProficiencyFact | null {
  const cleaned = label.trim();
  if (!cleaned) {
    return null;
  }

  const skill = getSkillByKey(cleaned);
  if (skill) {
    return {
      id: toFactId("skill", skill.id),
      kind: "skill",
      label: skill.label,
      tier: tierHint ?? "proficient",
      skillId: skill.id,
    };
  }

  if (/\bsaving throw\b/i.test(cleaned)) {
    const ability = getAbilityFromText(cleaned);
    if (ability) {
      return {
        id: toFactId("savingThrow", ability),
        kind: "savingThrow",
        label: `${ABILITY_LABELS[ability]} Saving Throw`,
        tier: "proficient",
        ability,
      };
    }
  }

  if (/\b(armor|armour|shield)\b/i.test(cleaned)) {
    return { id: toFactId("armor", cleaned), kind: "armor", label: cleaned, tier: "proficient" };
  }

  if (/\b(weapon|sword|bow|crossbow|dagger|rapier|axe|mace|staff|spear|martial|simple)\b/i.test(cleaned)) {
    return { id: toFactId("weapon", cleaned), kind: "weapon", label: cleaned, tier: "proficient" };
  }

  if (/\b(vehicle|mount|waterborne|land)\b/i.test(cleaned)) {
    return { id: toFactId("vehicle", cleaned), kind: "vehicle", label: cleaned, tier: "proficient" };
  }

  if (
    MUSICAL_INSTRUMENT_LABELS.has(normalizeKey(cleaned)) ||
    /\b(tool|kit|supplies|utensils|instrument|dice|cards|chess|dragonchess|three-dragon|gaming set|artisan)\b/i.test(cleaned)
  ) {
    return { id: toFactId("tool", cleaned), kind: "tool", label: cleaned, tier: "proficient" };
  }

  if (/\b(language|tongue)\b/i.test(cleaned)) {
    return { id: toFactId("language", cleaned), kind: "language", label: cleaned, tier: "proficient" };
  }

  return { id: toFactId("other", cleaned), kind: "other", label: cleaned, tier: tierHint ?? "unknown" };
}

export function buildProficiencyFacts(inputs: ProficiencyFactInput[]) {
  const facts = inputs
    .map((input) => (input.id ? factFromId(input.id) : null) ?? (input.label ? factFromLabel(input.label, input.tier) : null))
    .filter((fact): fact is ProficiencyFact => Boolean(fact));
  const byId = new Map<string, ProficiencyFact>();

  // Deduplicate by id+tier so expertise and proficient can coexist for same skill
  facts.forEach((fact) => {
    const key = `${fact.id}::${fact.tier}`;
    byId.set(key, fact);
  });

  return [...byId.values()];
}

export function hasSavingThrowProficiency(facts: ProficiencyFact[], ability: AbilityKey, tier?: ProficiencyFactTier) {
  return facts.some(
    (fact) =>
      fact.kind === "savingThrow" &&
      fact.ability === ability &&
      (tier === undefined || fact.tier === tier),
  );
}

export function hasSkillProficiency(facts: ProficiencyFact[], skillId: string, tier?: ProficiencyFactTier) {
  return facts.some(
    (fact) =>
      fact.kind === "skill" &&
      fact.skillId === skillId &&
      (tier === undefined || fact.tier === tier),
  );
}
