import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import type { BuiltInElement, BuiltInRule } from "@/lib/builtins/types";
import type {
  AbilityKey,
  CharacterClassEntry,
  CharacterImprovementSelection,
} from "@/lib/characters/types";

export type ImprovementOpportunity = {
  id: string;
  sourceType: "class" | "ancestry";
  classEntryIndex?: number;
  classId?: string;
  className: string;
  classLevel?: number;
  unlockLevel: number;
  featureId: string;
  featureName: string;
  supportsKey?: string;
  title: string;
  featAllowed: boolean;
  totalPoints: number;
  maxPerAbility: number;
  allowedAbilities: AbilityKey[];
  notes: string[];
};

export type FeatPrerequisiteContext = {
  effectiveAbilities: Record<AbilityKey, number>;
  selectedRaceName?: string;
  selectedSubraceName?: string;
  selectedClassNames: string[];
  selectedFeatureNames: string[];
  selectedFeatNames: string[];
  hasSpellcasting: boolean;
  totalLevel: number;
  knownRaceNames: string[];
  knownSubraceNames: string[];
  knownClassNames: string[];
};

const ALL_ABILITIES: AbilityKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

const ABILITY_NAME_MAP: Record<string, AbilityKey> = {
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

function isImprovementRule(
  rule: BuiltInRule,
): rule is Extract<BuiltInRule, { kind: "select" }> {
  if (rule.kind !== "select") {
    return false;
  }

  if (rule.type === "Ability Score Improvement") {
    return true;
  }

  return (
    rule.type === "Class Feature" &&
    (rule.supports?.includes("Improvement Option") ||
      rule.name.toLowerCase().includes("improvement option"))
  );
}

function getOpportunityId(
  sourceType: "class" | "ancestry",
  classEntryIndex: number | undefined,
  featureId: string,
  unlockLevel: number,
  supportsKey?: string,
) {
  return `${sourceType}:${classEntryIndex ?? "root"}:${featureId}:${unlockLevel}:${supportsKey ?? "default"}`;
}

function uniqueAbilityList(abilities: AbilityKey[]) {
  return [...new Set(abilities)];
}

function getAbilityChoicesFromElements(elements: BuiltInElement[]) {
  return uniqueAbilityList(
    elements.flatMap((element) =>
      element.rules.flatMap((rule) => {
        if (rule.kind !== "stat") {
          return [];
        }

        const ability = ABILITY_NAME_MAP[rule.name.toLowerCase()];
        return ability ? [ability] : [];
      }),
    ),
  );
}

export function deriveImprovementOpportunities(
  classEntries: CharacterClassEntry[],
  classRecords: Array<BuiltInClassRecord | null>,
  race?: BuiltInRaceRecord | null,
  subrace?: BuiltInElement | null,
): ImprovementOpportunity[] {
  const classOpportunities = classEntries.flatMap((entry, classEntryIndex) => {
    const classRecord = classRecords[classEntryIndex];

    if (!classRecord || !entry.classId) {
      return [];
    }

    return classRecord.features.flatMap((feature) =>
      feature.rules
        .filter(isImprovementRule)
        .filter((rule) => !rule.level || entry.level >= rule.level)
        .map((rule) => {
          const unlockLevel = rule.level ?? entry.level;

          return {
            id: getOpportunityId("class", classEntryIndex, feature.id, unlockLevel, rule.supports),
            sourceType: "class" as const,
            classEntryIndex,
            classId: classRecord.class.id,
            className: classRecord.class.name,
            classLevel: entry.level,
            unlockLevel,
            featureId: feature.id,
            featureName: feature.name,
            supportsKey: rule.supports,
            title: `${classRecord.class.name} ${unlockLevel}`,
            featAllowed: true,
            totalPoints: 2,
            maxPerAbility: 2,
            allowedAbilities: ALL_ABILITIES,
            notes: ["Spend 2 points as an ASI or choose a feat instead."],
          } satisfies ImprovementOpportunity;
        }),
    );
  });

  return [
    ...deriveAncestryImprovementOpportunities(race ?? null, subrace ?? null),
    ...classOpportunities,
  ];
}

export function deriveAncestryImprovementOpportunities(
  race: BuiltInRaceRecord | null,
  subrace: BuiltInElement | null,
): ImprovementOpportunity[] {
  if (!race) {
    return [];
  }

  const subraceChoiceIds = new Set(
    (subrace?.rules ?? [])
      .filter(
        (rule): rule is Extract<BuiltInRule, { kind: "select" }> =>
          rule.kind === "select" &&
          (rule.type === "Racial Trait" || rule.type === "Ability Score Improvement") &&
          /ability score increase|ability score improvement/i.test(rule.name),
      )
      .map((rule) => `${rule.type}:${rule.name}:${rule.supports ?? "default"}`),
  );

  const activeChoices = race.ancestryChoices.filter((choice) => {
    const isAsiChoice = /ability score increase|ability score improvement/i.test(choice.name);
    if (!isAsiChoice) {
      return false;
    }

    if (!subrace) {
      return !subraceChoiceIds.has(choice.id);
    }

    return subraceChoiceIds.has(choice.id);
  });

  const opportunities: ImprovementOpportunity[] = [];

  activeChoices.forEach((choice) => {
      const allowedAbilities = getAbilityChoicesFromElements(choice.options);
      if (!allowedAbilities.length) {
        return;
      }

      opportunities.push({
        id: getOpportunityId(
          "ancestry",
          undefined,
          subrace?.id ?? race.race.id,
          1,
          choice.id,
        ),
        sourceType: "ancestry" as const,
        className: subrace?.name ?? race.race.name,
        unlockLevel: 1,
        featureId: subrace?.id ?? race.race.id,
        featureName: choice.name,
        supportsKey: choice.id,
        title: `${subrace?.name ?? race.race.name} ability choice`,
        featAllowed: false,
        totalPoints: choice.number,
        maxPerAbility: 1,
        allowedAbilities,
        notes: [
          choice.number === 1
            ? "Choose 1 ability score to increase by 1."
            : `Choose ${choice.number} different ability scores to increase by 1.`,
        ],
      } satisfies ImprovementOpportunity);
    });

  return opportunities;
}

export function getImprovementSelectionPoints(
  selection: CharacterImprovementSelection | undefined,
) {
  if (!selection || selection.mode !== "asi") {
    return 0;
  }

  return Object.values(selection.abilityBonuses ?? {}).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0,
  );
}

export function getImprovementBonuses(
  selections: Record<string, CharacterImprovementSelection>,
) {
  return Object.values(selections).reduce<Record<AbilityKey, number>>(
    (totals, selection) => {
      if (selection.mode !== "asi") {
        return totals;
      }

      Object.entries(selection.abilityBonuses ?? {}).forEach(([ability, amount]) => {
        const key = ability as AbilityKey;
        totals[key] += Number(amount) || 0;
      });

      return totals;
    },
    {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
  );
}

export function getAvailableFeatOptions(feats: BuiltInElement[]) {
  return feats
    .filter((feat) => feat.type === "Feat")
    .sort((left, right) => left.name.localeCompare(right.name));
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function includesNamedToken(text: string, token: string) {
  const normalizedText = normalizeText(text);
  const normalizedToken = normalizeText(token);
  return normalizedText.includes(normalizedToken);
}

export function getFeatPrerequisiteFailures(
  feat: BuiltInElement,
  context: FeatPrerequisiteContext,
) {
  const prerequisite = feat.prerequisite?.trim();

  if (!prerequisite) {
    return [];
  }

  const failures: string[] = [];
  const normalizedPrerequisite = prerequisite.toLowerCase();

  const abilityMatches = [...prerequisite.matchAll(/\b(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma|STR|DEX|CON|INT|WIS|CHA)\b[^\d]{0,10}(\d{1,2})/gi)];
  abilityMatches.forEach((match) => {
    const ability = ABILITY_NAME_MAP[match[1].toLowerCase()];
    const minimum = Number(match[2]);

    if (ability && context.effectiveAbilities[ability] < minimum) {
      failures.push(`Requires ${ability.toUpperCase()} ${minimum}.`);
    }
  });

  if (normalizedPrerequisite.includes("spellcasting") && !context.hasSpellcasting) {
    failures.push("Requires spellcasting.");
  }

  const levelMatch = prerequisite.match(/(\d+)(?:st|nd|rd|th)-level/i);
  if (levelMatch && context.totalLevel < Number(levelMatch[1])) {
    failures.push(`Requires level ${levelMatch[1]} or higher.`);
  }

  const mentionedClasses = context.knownClassNames.filter((name) => includesNamedToken(prerequisite, name));
  if (mentionedClasses.length) {
    const hasRequiredClass = mentionedClasses.some((name) =>
      context.selectedClassNames.some((selected) => normalizeText(selected) === normalizeText(name)),
    );

    if (!hasRequiredClass) {
      failures.push(`Requires ${mentionedClasses.join(" or ")}.`);
    }
  }

  const mentionedLineages = [
    ...context.knownRaceNames,
    ...context.knownSubraceNames,
  ].filter((name) => includesNamedToken(prerequisite, name));

  if (mentionedLineages.length) {
    const selectedNames = [context.selectedRaceName, context.selectedSubraceName]
      .filter((name): name is string => Boolean(name))
      .map(normalizeText);

    const hasRequiredLineage = mentionedLineages.some((name) =>
      selectedNames.includes(normalizeText(name)),
    );

    if (!hasRequiredLineage) {
      failures.push(`Requires ${mentionedLineages.join(" or ")}.`);
    }
  }

  const namedFeatureOrFeatOptions = [...prerequisite.matchAll(/([A-Z][A-Za-z' -]+?)\s+(feature|feat)/g)].map(
    (match) => ({
      name: match[1].trim(),
      kind: match[2].toLowerCase(),
    }),
  );

  if (namedFeatureOrFeatOptions.length) {
    const selectedNames = [
      ...context.selectedFeatureNames,
      ...context.selectedFeatNames,
    ].map(normalizeText);
    const hasNamedOption = namedFeatureOrFeatOptions.some((option) =>
      selectedNames.includes(normalizeText(option.name)),
    );

    if (!hasNamedOption) {
      failures.push(
        `Requires ${namedFeatureOrFeatOptions
          .map((option) => `${option.name} ${option.kind}`)
          .join(" or ")}.`,
      );
    }
  }

  return [...new Set(failures)];
}
