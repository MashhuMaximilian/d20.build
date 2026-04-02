import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import type { BuiltInElement, BuiltInRule } from "@/lib/builtins/types";
import type {
  AbilityKey,
  CharacterClassEntry,
  CharacterImprovementSelection,
} from "@/lib/characters/types";
import {
  getRequirementFailures,
  type RequirementContext as FeatPrerequisiteContext,
} from "@/lib/progression/requirements";

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

export function getFeatPrerequisiteFailures(
  feat: BuiltInElement,
  context: FeatPrerequisiteContext,
) {
  return getRequirementFailures(feat.requirements, feat.prerequisite, context);
}
