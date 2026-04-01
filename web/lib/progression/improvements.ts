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
  selectionPattern?: "flex" | "single-ability";
  allowedAbilities: AbilityKey[];
  notes: string[];
};

export type FeatPrerequisiteContext = {
  effectiveAbilities: Record<AbilityKey, number>;
  selectedRaceId?: string;
  selectedRaceName?: string;
  selectedSubraceId?: string;
  selectedSubraceName?: string;
  selectedClassIds: string[];
  selectedClassNames: string[];
  selectedFeatureIds: string[];
  selectedFeatureNames: string[];
  selectedFeatIds: string[];
  selectedFeatNames: string[];
  hasSpellcasting: boolean;
  totalLevel: number;
  classLevelsByName: Record<string, number>;
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

function clampPositiveInteger(value: number) {
  return Math.max(0, Math.floor(value || 0));
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
  useTashasCustomizedOrigin = false,
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
            selectionPattern: "flex",
            allowedAbilities: ALL_ABILITIES,
            notes: ["Spend 2 points as an ASI or choose a feat instead."],
          } satisfies ImprovementOpportunity;
        }),
    );
  });

  return [
    ...deriveAncestryImprovementOpportunities(race ?? null, subrace ?? null, useTashasCustomizedOrigin),
    ...classOpportunities,
  ];
}

export function deriveAncestryImprovementOpportunities(
  race: BuiltInRaceRecord | null,
  subrace: BuiltInElement | null,
  useTashasCustomizedOrigin = false,
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

  if (useTashasCustomizedOrigin) {
    const ancestryStatRules = [...race.race.rules, ...(subrace?.rules ?? [])].filter(
      (rule): rule is Extract<BuiltInRule, { kind: "stat" }> =>
        rule.kind === "stat" &&
        ABILITY_NAME_MAP[rule.name.toLowerCase()] !== undefined &&
        Number(rule.value) > 0,
    );

    ancestryStatRules.forEach((rule, index) => {
      const points = clampPositiveInteger(Number(rule.value));
      if (!points) {
        return;
      }

      opportunities.push({
        id: getOpportunityId(
          "ancestry",
          undefined,
          subrace?.id ?? race.race.id,
          1,
          `tashas:${index}:${rule.name}:${points}`,
        ),
        sourceType: "ancestry",
        className: subrace?.name ?? race.race.name,
        unlockLevel: 1,
        featureId: subrace?.id ?? race.race.id,
        featureName: "Customized origin ability score increase",
        supportsKey: `tashas:${index}:${rule.name}:${points}`,
        title: `${subrace?.name ?? race.race.name} customized origin`,
        featAllowed: false,
        totalPoints: points,
        maxPerAbility: points,
        selectionPattern: "single-ability",
        allowedAbilities: ALL_ABILITIES,
        notes: [
          `Assign this +${points} ancestry bonus to one ability score of your choice.`,
          "Tasha's rule: separate ancestry increases must apply to different abilities.",
        ],
      });
    });
  }

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
        selectionPattern: "flex",
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
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\W)${escaped}(?=\\W|$)`, "i").test(text);
}

function splitTopLevel(value: string, separator: "," | "||") {
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

    if (separator === "," && depth === 0 && char === ",") {
      if (current.trim()) {
        parts.push(current.trim());
      }
      current = "";
      continue;
    }

    if (separator === "||" && depth === 0 && char === "|" && next === "|") {
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

function trimOuterParens(value: string) {
  let current = value.trim();

  while (current.startsWith("(") && current.endsWith(")")) {
    const inner = current.slice(1, -1);
    let depth = 0;
    let balanced = true;

    for (const char of inner) {
      if (char === "(") {
        depth += 1;
      } else if (char === ")") {
        depth -= 1;
        if (depth < 0) {
          balanced = false;
          break;
        }
      }
    }

    if (!balanced || depth !== 0) {
      break;
    }

    current = inner.trim();
  }

  return current;
}

function normalizeKey(value: string) {
  return normalizeText(value).replace(/[_-]+/g, " ");
}

function buildSelectedIdSet(context: FeatPrerequisiteContext) {
  return new Set(
    [
      context.selectedRaceId,
      context.selectedSubraceId,
      ...context.selectedClassIds,
      ...context.selectedFeatureIds,
      ...context.selectedFeatIds,
    ].filter((value): value is string => Boolean(value)),
  );
}

type RequirementEvalResult = true | false | null;

function evaluateRequirementToken(
  token: string,
  context: FeatPrerequisiteContext,
  selectedIds: Set<string>,
): RequirementEvalResult {
  const normalized = trimOuterParens(token).trim();
  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("!")) {
    const result = evaluateRequirementToken(normalized.slice(1), context, selectedIds);
    return result === null ? null : !result;
  }

  if (normalized.includes("||")) {
    const results = splitTopLevel(normalized, "||").map((part) =>
      evaluateRequirementToken(part, context, selectedIds),
    );

    if (results.some((result) => result === true)) {
      return true;
    }

    if (results.every((result) => result === false)) {
      return false;
    }

    return null;
  }

  const bracketMatch = normalized.match(/^\[([^:\]]+):([^\]]+)\]$/i);
  if (bracketMatch) {
    const rawKey = normalizeKey(bracketMatch[1]);
    const rawValue = bracketMatch[2].trim();
    const ability = ABILITY_NAME_MAP[rawKey];

    if (ability) {
      return context.effectiveAbilities[ability] >= Number(rawValue);
    }

    if (rawKey === "type" && rawValue.toLowerCase() === "spell") {
      return context.hasSpellcasting;
    }

    if (rawKey === "level") {
      return context.totalLevel >= Number(rawValue);
    }

    const classLevel = context.classLevelsByName[rawKey];
    if (classLevel !== undefined) {
      return classLevel >= Number(rawValue);
    }

    return null;
  }

  if (/^ID_/i.test(normalized)) {
    return selectedIds.has(normalized);
  }

  return null;
}

function evaluateRequirementExpression(
  requirements: string,
  context: FeatPrerequisiteContext,
) {
  const selectedIds = buildSelectedIdSet(context);
  const clauses = splitTopLevel(trimOuterParens(requirements), ",");

  if (!clauses.length) {
    return null;
  }

  let sawKnown = false;

  for (const clause of clauses) {
    const result = evaluateRequirementToken(clause, context, selectedIds);
    if (result === false) {
      return false;
    }
    if (result === true) {
      sawKnown = true;
    }
  }

  return sawKnown ? true : null;
}

export function getFeatPrerequisiteFailures(
  feat: BuiltInElement,
  context: FeatPrerequisiteContext,
) {
  const prerequisite = feat.prerequisite?.trim() ?? "";
  const requirements = feat.requirements?.trim() ?? "";

  if (requirements) {
    const evaluation = evaluateRequirementExpression(requirements, context);

    if (evaluation === false) {
      return [prerequisite ? `Requires ${prerequisite}.` : "The feat prerequisites are not met."];
    }

    if (evaluation === true) {
      return [];
    }
  }

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
