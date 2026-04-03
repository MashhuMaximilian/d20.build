import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import type {
  BuiltInElement,
  BuiltInRule,
} from "@/lib/builtins/types";
import {
  ABILITY_KEYS,
  type AbilityKey,
  type CharacterClassEntry,
} from "@/lib/characters/types";

export type SpellSelectionGroupKind =
  | "cantrip"
  | "known"
  | "spellbook"
  | "prepared"
  | "granted";

export type SpellSelectionGroup = {
  id: string;
  title: string;
  description: string;
  ownerLabel: string;
  ownerType: "race" | "subrace" | "class" | "subclass" | "feat";
  kind: SpellSelectionGroupKind;
  spellcastingAbility?: string;
  exactSelections?: number;
  minSelections: number;
  maxSelections: number;
  availableSpellIds: string[];
  grantedSpellIds: string[];
  notes: string[];
};

type DeriveSpellcastingGroupsArgs = {
  activeFeats: BuiltInElement[];
  classRecordsByEntry: Array<BuiltInClassRecord | null>;
  classEntries: CharacterClassEntry[];
  effectiveAbilities: Record<AbilityKey, number>;
  race: BuiltInRaceRecord | null;
  spellSelections: Record<string, string[]>;
  spells: BuiltInElement[];
  subrace: BuiltInElement | null;
  totalLevel: number;
};

function getSetterValue(element: BuiltInElement, name: string) {
  return element.setters.find((setter) => setter.name === name)?.value ?? "";
}

export function getSpellLevel(spell: BuiltInElement) {
  return Number(getSetterValue(spell, "level") || 0);
}

export function getSpellSchool(spell: BuiltInElement) {
  return getSetterValue(spell, "school") || "Unknown school";
}

export function getSpellRange(spell: BuiltInElement) {
  return getSetterValue(spell, "range") || "—";
}

export function getSpellDuration(spell: BuiltInElement) {
  return getSetterValue(spell, "duration") || "—";
}

export function getSpellCastingTime(spell: BuiltInElement) {
  return getSetterValue(spell, "time") || "—";
}

export function getSpellComponents(spell: BuiltInElement) {
  const parts: string[] = [];

  if (getSetterValue(spell, "hasVerbalComponent") === "true") {
    parts.push("V");
  }
  if (getSetterValue(spell, "hasSomaticComponent") === "true") {
    parts.push("S");
  }
  if (getSetterValue(spell, "hasMaterialComponent") === "true") {
    parts.push("M");
  }

  const material = getSetterValue(spell, "materialComponent")
    .replace(/<set[^>]*>[\s\S]*?<\/set>/gi, " ")
    .replace(/<set[^>]*>[\s\S]*$/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const cleanedMaterial =
    material && !/^false$/i.test(material) && !/^true$/i.test(material) ? material : "";

  return cleanedMaterial ? `${parts.join(", ")} (${cleanedMaterial})` : parts.join(", ");
}

export function isSpellRitual(spell: BuiltInElement) {
  return getSetterValue(spell, "isRitual") === "true";
}

export function isSpellConcentration(spell: BuiltInElement) {
  return getSetterValue(spell, "isConcentration") === "true";
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function activeGrantIds(rules: BuiltInRule[], type: string, currentLevel: number) {
  return rules.flatMap((rule) =>
    rule.kind === "grant" && rule.type === type && (!rule.level || rule.level <= currentLevel)
      ? [rule.id]
      : [],
  );
}

function getActiveRaceTraitElements(race: BuiltInRaceRecord | null, subrace: BuiltInElement | null) {
  if (!race) {
    return [];
  }

  const activeTraitIds = new Set([
    ...activeGrantIds(race.race.rules, "Racial Trait", Number.MAX_SAFE_INTEGER),
    ...activeGrantIds(subrace?.rules ?? [], "Racial Trait", Number.MAX_SAFE_INTEGER),
  ]);

  return race.traits.filter((trait) => activeTraitIds.has(trait.id));
}

function getUnlockedClassFeatures(record: BuiltInClassRecord | null, classLevel: number) {
  if (!record) {
    return [];
  }

  const unlockedIds = new Set(activeGrantIds(record.class.rules, "Class Feature", classLevel));
  return record.features.filter((feature) => unlockedIds.has(feature.id));
}

function getUnlockedSubclassFeatures(record: BuiltInClassRecord | null, entry: CharacterClassEntry) {
  if (!record || !entry.subclassId) {
    return [];
  }

  const option = record.subclassSteps
    .flatMap((step) => step.options)
    .find((candidate) => candidate.archetype.id === entry.subclassId);

  if (!option) {
    return [];
  }

  const unlockedIds = new Set(activeGrantIds(option.archetype.rules, "Archetype Feature", entry.level));
  return option.features.filter((feature) => unlockedIds.has(feature.id));
}

function normalizeListKey(value: string) {
  return value
    .replace(/["']/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function splitSupportKeys(value: string) {
  return value
    .split(/\|\||&&|\||,/)
    .map((token) => normalizeListKey(token))
    .filter(Boolean);
}

function splitSupportClauses(value: string) {
  const parts: string[] = [];
  let depth = 0;
  let current = "";

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const next = value[index + 1];

    if (char === "(") {
      depth += 1;
      current += char;
      continue;
    }

    if (char === ")") {
      depth = Math.max(0, depth - 1);
      current += char;
      continue;
    }

    if (depth === 0 && char === ",") {
      if (current.trim()) {
        parts.push(current.trim());
      }
      current = "";
      continue;
    }

    if (depth === 0 && char === "&" && next === "&") {
      if (current.trim()) {
        parts.push(current.trim());
      }
      current = "";
      index += 1;
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

function splitSupportAlternatives(value: string) {
  const trimmed = value.trim().replace(/^\(|\)$/g, "");
  if (!trimmed) {
    return [];
  }

  return trimmed
    .split("||")
    .map((token) => normalizeListKey(token))
    .filter(Boolean);
}

function resolveSpellSupport(
  rule: Extract<BuiltInRule, { kind: "select" }>,
  fallbackListKey: string | undefined,
  maxSpellLevel: number,
) {
  const supportsTemplate = rule.supports ?? "";
  const usesDynamicMaxLevel = /\$\(spellcasting:slots\)/i.test(supportsTemplate);
  const raw = supportsTemplate
    .replace(/\$\(spellcasting:list\)/gi, fallbackListKey ?? "")
    .replace(/\$\(spellcasting:slots\)/gi, `${maxSpellLevel}`)
    .trim();

  const parts = splitSupportClauses(raw);
  const numericPart = parts.find((part) => /^\d+$/.test(part));
  const level = numericPart ? Number(numericPart) : maxSpellLevel;
  const supportGroups = parts
    .filter((part) => part !== numericPart)
    .map((part) => splitSupportAlternatives(part))
    .filter((group) => group.length);

  if (!supportGroups.length && fallbackListKey) {
    supportGroups.push([normalizeListKey(fallbackListKey)]);
  }

  if (!supportGroups.length) {
    return null;
  }

  return {
    supportGroups,
    levelMode:
      numericPart && !usesDynamicMaxLevel ? ("exact" as const) : ("upto" as const),
    level,
  };
}

function getSpellSupportTokens(spell: BuiltInElement) {
  return new Set(
    spell.supports.flatMap((support) => splitSupportKeys(support)),
  );
}

function matchesSpellSupport(spell: BuiltInElement, supportGroups: string[][]) {
  const tokens = getSpellSupportTokens(spell);

  return supportGroups.every((group) => group.some((token) => tokens.has(token)));
}

function getAvailableSpellIdsForRule(
  spells: BuiltInElement[],
  support: { supportGroups: string[][]; levelMode: "exact" | "upto"; level: number } | null,
) {
  if (!support) {
    return [];
  }

  return spells
    .filter((spell) => matchesSpellSupport(spell, support.supportGroups))
    .filter((spell) => {
      const spellLevel = getSpellLevel(spell);
      return support.levelMode === "exact"
        ? spellLevel === support.level
        : spellLevel <= support.level;
    })
    .map((spell) => spell.id);
}

function resolveSpellStatValue(
  rule: Extract<BuiltInRule, { kind: "stat" }>,
  resolved: Map<string, number>,
) {
  const value = (rule.value || "").trim();
  if (!value) {
    return 0;
  }

  if (/^-?\d+$/.test(value)) {
    return Number(value);
  }

  const referenceMatch = value.match(/^(-)?([a-z0-9:_-]+)$/i);
  if (referenceMatch) {
    const sign = referenceMatch[1] ? -1 : 1;
    const referenced = resolved.get(referenceMatch[2]) ?? 0;
    return sign * referenced;
  }

  return 0;
}

function getMaxSpellLevel(rules: BuiltInRule[], classLevel: number) {
  const resolvedStats = new Map<string, number>();
  const counts = new Map<number, number>();

  rules.forEach((rule) => {
    if (rule.kind !== "stat" || (rule.level && rule.level > classLevel)) {
      return;
    }

    resolvedStats.set(rule.name, (resolvedStats.get(rule.name) ?? 0) + resolveSpellStatValue(rule, resolvedStats));
  });

  rules.forEach((rule) => {
    if (rule.kind !== "stat" || (rule.level && rule.level > classLevel)) {
      return;
    }

    const match = rule.name.match(/:spellcasting:slots:(\d+)$/);
    if (!match) {
      return;
    }

    const slotLevel = Number(match[1]);
    counts.set(slotLevel, resolvedStats.get(rule.name) ?? 0);
  });

  return [...counts.entries()]
    .filter(([, count]) => count > 0)
    .map(([slotLevel]) => slotLevel)
    .sort((left, right) => right - left)[0] ?? 0;
}

function getPreparationCapacity(
  rules: BuiltInRule[],
  classLevel: number,
  effectiveAbilities: Record<AbilityKey, number>,
) {
  return Math.max(
    0,
    rules.reduce((sum, rule) => {
      if (rule.kind !== "stat" || !rule.name.endsWith(":spellcasting:prepare") || (rule.level && rule.level > classLevel)) {
        return sum;
      }

      if (/^-?\d+$/.test(rule.value)) {
        return sum + Number(rule.value);
      }

      const modifierMatch = rule.value.match(/^([a-z]+):modifier$/i);
      if (modifierMatch) {
        const ability = modifierMatch[1].toLowerCase() as AbilityKey;
        if (ABILITY_KEYS.includes(ability)) {
          return sum + Math.floor(((effectiveAbilities[ability] ?? 10) - 10) / 2);
        }
      }

      const levelMatch = rule.value.match(/^level:/i);
      if (levelMatch) {
        return sum + classLevel;
      }

      return sum;
    }, 0),
  );
}

function buildExactSelectionNote(kind: SpellSelectionGroupKind, count: number) {
  switch (kind) {
    case "cantrip":
      return `Choose exactly ${count} cantrip${count === 1 ? "" : "s"}.`;
    case "spellbook":
      return `Add exactly ${count} spell${count === 1 ? "" : "s"} to the spellbook.`;
    case "known":
      return `Choose exactly ${count} spell${count === 1 ? "" : "s"}.`;
    default:
      return `Choose exactly ${count} spell${count === 1 ? "" : "s"}.`;
  }
}

function createSelectionGroupFromRules(args: {
  availableSpellIds: string[];
  classLevel: number;
  description: string;
  kind: SpellSelectionGroupKind;
  ownerLabel: string;
  ownerType: SpellSelectionGroup["ownerType"];
  rules: Extract<BuiltInRule, { kind: "select" }>[];
  spellcastingAbility?: string;
  title: string;
}) {
  const exactSelections = args.rules.reduce((sum, rule) => {
    const baseSelections = rule.number ?? 1;
    const usesDynamicSlots = /\$\(spellcasting:slots\)/i.test(rule.supports ?? "");
    const ruleLevel = rule.level ?? 1;
    const repeatsPerLevel =
      args.kind === "spellbook" &&
      usesDynamicSlots &&
      typeof rule.level === "number" &&
      ruleLevel >= 1;
    const occurrenceCount = repeatsPerLevel
      ? Math.max(0, args.classLevel - ruleLevel + 1)
      : 1;

    return sum + baseSelections * occurrenceCount;
  }, 0);

  return {
    id: `${args.ownerType}:${args.ownerLabel}:${args.kind}:${args.classLevel}:${args.title}`,
    title: args.title,
    description: args.description,
    ownerLabel: args.ownerLabel,
    ownerType: args.ownerType,
    kind: args.kind,
    spellcastingAbility: args.spellcastingAbility,
    exactSelections,
    minSelections: exactSelections,
    maxSelections: exactSelections,
    availableSpellIds: uniqueStrings(args.availableSpellIds),
    grantedSpellIds: [],
    notes: [buildExactSelectionNote(args.kind, exactSelections)],
  } satisfies SpellSelectionGroup;
}

function buildPreparedGroup(args: {
  availableSpellIds: string[];
  ability?: string;
  classLevel: number;
  ownerLabel: string;
  ownerType: SpellSelectionGroup["ownerType"];
  preparationCapacity: number;
}) {
  return {
    id: `${args.ownerType}:${args.ownerLabel}:prepared:${args.classLevel}`,
    title: `${args.ownerLabel} prepared spells`,
    description: "Choose the spells you currently have prepared. You can prepare up to this limit and revise them later.",
    ownerLabel: args.ownerLabel,
    ownerType: args.ownerType,
    kind: "prepared" as const,
    spellcastingAbility: args.ability,
    minSelections: 0,
    maxSelections: args.preparationCapacity,
    availableSpellIds: uniqueStrings(args.availableSpellIds),
    grantedSpellIds: [],
    notes: [
      `Prepare up to ${args.preparationCapacity} spell${args.preparationCapacity === 1 ? "" : "s"}.`,
      args.ability ? `${args.ability.toUpperCase()} sets the preparation formula for this source.` : "",
    ].filter(Boolean),
  };
}

type SourceDescriptor = {
  currentLevel: number;
  fallbackListKey?: string;
  ownerLabel: string;
  ownerType: SpellSelectionGroup["ownerType"];
  spellcastingAbility?: string;
  rules: BuiltInRule[];
  spellcastingRules?: BuiltInRule[];
  preparedFromSpellbook?: boolean;
  preparedFromFullList?: boolean;
};

function buildGroupsForSource(
  source: SourceDescriptor,
  spells: BuiltInElement[],
  effectiveAbilities: Record<AbilityKey, number>,
  currentSelections: Record<string, string[]>,
) {
  const selectionRules = source.rules.filter(
    (rule): rule is Extract<BuiltInRule, { kind: "select" }> =>
      rule.kind === "select" && rule.type === "Spell" && (!rule.level || rule.level <= source.currentLevel),
  );
  const spellGrantIds = activeGrantIds(source.rules, "Spell", source.currentLevel);
  const spellGrantRules = source.rules.filter(
    (rule): rule is Extract<BuiltInRule, { kind: "grant" }> =>
      rule.kind === "grant" && rule.type === "Spell" && (!rule.level || rule.level <= source.currentLevel),
  );
  const maxSpellLevel = getMaxSpellLevel(source.spellcastingRules ?? source.rules, source.currentLevel);
  const grouped = new Map<SpellSelectionGroupKind, Extract<BuiltInRule, { kind: "select" }>[]>();

  selectionRules.forEach((rule) => {
    const support = resolveSpellSupport(rule, source.fallbackListKey, maxSpellLevel);
    const kind: SpellSelectionGroupKind =
      rule.name.toLowerCase().includes("cantrip") || support?.level === 0
        ? "cantrip"
        : rule.name.toLowerCase().includes("spellbook")
          ? "spellbook"
          : "known";
    grouped.set(kind, [...(grouped.get(kind) ?? []), rule]);
  });

  const groups: SpellSelectionGroup[] = [];

  grouped.forEach((rules, kind) => {
    const availableSpellIds = rules.flatMap((rule) =>
      getAvailableSpellIdsForRule(
        spells,
        resolveSpellSupport(rule, source.fallbackListKey, maxSpellLevel),
      ),
    );
    const normalizedSpellIds = uniqueStrings(availableSpellIds).filter((spellId) => {
      const spell = spells.find((candidate) => candidate.id === spellId);
      if (!spell) {
        return false;
      }

      const spellLevel = getSpellLevel(spell);
      return kind === "cantrip" ? spellLevel === 0 : spellLevel > 0;
    });

    groups.push(
      createSelectionGroupFromRules({
        availableSpellIds: normalizedSpellIds,
        classLevel: source.currentLevel,
        description:
          kind === "cantrip"
            ? `Choose the ${source.ownerLabel.toLowerCase()} cantrips currently available.`
            : kind === "spellbook"
              ? `Add spells to ${source.ownerLabel.toLowerCase()}'s spellbook.`
              : `Choose spells granted through ${source.ownerLabel.toLowerCase()}.`,
        kind,
        ownerLabel: source.ownerLabel,
        ownerType: source.ownerType,
        rules,
        spellcastingAbility: source.spellcastingAbility,
        title:
          kind === "cantrip"
            ? `${source.ownerLabel} cantrips`
            : kind === "spellbook"
              ? `${source.ownerLabel} spellbook`
              : `${source.ownerLabel} spells`,
      }),
    );
  });

  const grantedSpellIds = uniqueStrings(spellGrantIds);
  if (grantedSpellIds.length) {
    groups.push({
      id: `${source.ownerType}:${source.ownerLabel}:granted:${source.currentLevel}`,
      title: `${source.ownerLabel} granted spells`,
      description: "These spells are granted directly by your current build and do not require a normal pick here.",
      ownerLabel: source.ownerLabel,
      ownerType: source.ownerType,
      kind: "granted",
      spellcastingAbility: source.spellcastingAbility,
      minSelections: 0,
      maxSelections: 0,
      availableSpellIds: [],
      grantedSpellIds,
      notes: spellGrantRules.some((rule) => rule.prepared)
        ? ["Some granted spells are always prepared."]
        : ["These spells are added automatically."],
    });
  }

  if (source.preparedFromSpellbook || source.preparedFromFullList) {
    const preparationCapacity = getPreparationCapacity(
      source.spellcastingRules ?? source.rules,
      source.currentLevel,
      effectiveAbilities,
    );

    if (preparationCapacity > 0) {
      const spellbookGroup = groups.find((group) => group.kind === "spellbook");
      const availableSpellIds = source.preparedFromSpellbook
        ? spellbookGroup
          ? currentSelections[spellbookGroup.id] ?? []
          : []
        : spells
            .filter(
              (spell) =>
                source.fallbackListKey &&
                matchesSpellSupport(spell, [[normalizeListKey(source.fallbackListKey)]]),
            )
            .filter((spell) => getSpellLevel(spell) <= maxSpellLevel)
            .filter((spell) => getSpellLevel(spell) > 0)
            .map((spell) => spell.id);

      groups.push(
        buildPreparedGroup({
          ability: source.spellcastingAbility,
          availableSpellIds,
          classLevel: source.currentLevel,
          ownerLabel: source.ownerLabel,
          ownerType: source.ownerType,
          preparationCapacity,
        }),
      );
    }
  }

  return groups;
}

export function deriveSpellcastingGroups({
  activeFeats,
  classRecordsByEntry,
  classEntries,
  effectiveAbilities,
  race,
  spellSelections,
  spells,
  subrace,
  totalLevel,
}: DeriveSpellcastingGroupsArgs) {
  const activeRaceTraits = getActiveRaceTraitElements(race, subrace);
  const sources: SourceDescriptor[] = [];

  activeRaceTraits.forEach((trait) => {
    if (!trait.rules.some((rule) => rule.kind === "select" && rule.type === "Spell") && !trait.rules.some((rule) => rule.kind === "grant" && rule.type === "Spell")) {
      return;
    }

    sources.push({
      currentLevel: totalLevel,
      fallbackListKey: trait.spellcasting?.name || race?.race.name,
      ownerLabel: trait.name,
      ownerType: "race",
      spellcastingAbility: trait.spellcasting?.ability?.toLowerCase(),
      rules: trait.rules,
      spellcastingRules: trait.spellcasting?.rules,
    });
  });

  activeFeats.forEach((feat) => {
    const hasSpellRules =
      Boolean(feat.spellcasting) ||
      feat.rules.some((rule) => rule.kind === "select" && rule.type === "Spell") ||
      feat.rules.some((rule) => rule.kind === "grant" && rule.type === "Spell");

    if (!hasSpellRules) {
      return;
    }

    sources.push({
      currentLevel: totalLevel,
      fallbackListKey: feat.spellcasting?.name || feat.name,
      ownerLabel: feat.name,
      ownerType: "feat",
      spellcastingAbility: feat.spellcasting?.ability?.toLowerCase(),
      rules: feat.rules,
      spellcastingRules: feat.spellcasting?.rules ?? feat.rules,
    });
  });

  classEntries.forEach((entry, index) => {
    const classRecord = classRecordsByEntry[index];
    if (!classRecord || !entry.classId) {
      return;
    }

    const unlockedFeatures = getUnlockedClassFeatures(classRecord, entry.level);
    unlockedFeatures.forEach((feature) => {
      const hasSpellRules =
        Boolean(feature.spellcasting) ||
        feature.rules.some((rule) => rule.kind === "select" && rule.type === "Spell") ||
        feature.rules.some((rule) => rule.kind === "grant" && rule.type === "Spell");

      if (!hasSpellRules) {
        return;
      }

      const preparedFromSpellbook =
        classRecord.class.name === "Wizard" && Boolean(feature.spellcasting);
      const preparedFromFullList =
        Boolean(feature.spellcasting?.name) &&
        !preparedFromSpellbook &&
        feature.rules.some((rule) => rule.kind === "stat" && rule.name.endsWith(":spellcasting:prepare"));

      sources.push({
        currentLevel: entry.level,
        fallbackListKey: feature.spellcasting?.name || classRecord.class.name,
        ownerLabel: classRecord.class.name,
        ownerType: "class",
        spellcastingAbility: feature.spellcasting?.ability?.toLowerCase(),
        rules: feature.rules,
        spellcastingRules: feature.spellcasting?.rules ?? feature.rules,
        preparedFromSpellbook,
        preparedFromFullList,
      });
    });

    const unlockedSubclassFeatures = getUnlockedSubclassFeatures(classRecord, entry);
    unlockedSubclassFeatures.forEach((feature) => {
      const hasSpellRules =
        Boolean(feature.spellcasting) ||
        feature.rules.some((rule) => rule.kind === "select" && rule.type === "Spell") ||
        feature.rules.some((rule) => rule.kind === "grant" && rule.type === "Spell");

      if (!hasSpellRules) {
        return;
      }

      sources.push({
        currentLevel: entry.level,
        fallbackListKey: feature.spellcasting?.name || classRecord.class.name,
        ownerLabel: feature.name,
        ownerType: "subclass",
        spellcastingAbility: feature.spellcasting?.ability?.toLowerCase(),
        rules: feature.rules,
        spellcastingRules: feature.spellcasting?.rules ?? feature.rules,
      });
    });
  });

  return sources.flatMap((source) =>
    buildGroupsForSource(source, spells, effectiveAbilities, spellSelections),
  );
}

export function getSpellValidationMessages(
  groups: SpellSelectionGroup[],
  selections: Record<string, string[]>,
) {
  return groups.flatMap((group) => {
    const selectedCount = selections[group.id]?.length ?? 0;

    if (group.kind === "granted") {
      return [];
    }

    if (!group.availableSpellIds.length) {
      return [`${group.title} has no spells available in the current catalog.`];
    }

    if (group.exactSelections !== undefined && selectedCount !== group.exactSelections) {
      return [`${group.title} requires exactly ${group.exactSelections} selection${group.exactSelections === 1 ? "" : "s"}.`];
    }

    if (selectedCount > group.maxSelections) {
      return [`${group.title} allows at most ${group.maxSelections} selection${group.maxSelections === 1 ? "" : "s"}.`];
    }

    return [];
  });
}
