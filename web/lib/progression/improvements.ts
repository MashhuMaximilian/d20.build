import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInElement, BuiltInRule } from "@/lib/builtins/types";
import type {
  AbilityKey,
  CharacterClassEntry,
  CharacterImprovementSelection,
} from "@/lib/characters/types";

export type ImprovementOpportunity = {
  id: string;
  classEntryIndex: number;
  classId: string;
  className: string;
  classLevel: number;
  unlockLevel: number;
  featureId: string;
  featureName: string;
  supportsKey?: string;
  title: string;
};

function isImprovementRule(
  rule: BuiltInRule,
): rule is Extract<BuiltInRule, { kind: "select" }> {
  return (
    rule.kind === "select" &&
    rule.type === "Class Feature" &&
    (rule.supports?.includes("Improvement Option") ||
      rule.name.toLowerCase().includes("improvement option"))
  );
}

function getOpportunityId(
  classEntryIndex: number,
  featureId: string,
  unlockLevel: number,
  supportsKey?: string,
) {
  return `improvement:${classEntryIndex}:${featureId}:${unlockLevel}:${supportsKey ?? "default"}`;
}

export function deriveImprovementOpportunities(
  classEntries: CharacterClassEntry[],
  classRecords: Array<BuiltInClassRecord | null>,
): ImprovementOpportunity[] {
  return classEntries.flatMap((entry, classEntryIndex) => {
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
            id: getOpportunityId(classEntryIndex, feature.id, unlockLevel, rule.supports),
            classEntryIndex,
            classId: classRecord.class.id,
            className: classRecord.class.name,
            classLevel: entry.level,
            unlockLevel,
            featureId: feature.id,
            featureName: feature.name,
            supportsKey: rule.supports,
            title: `${classRecord.class.name} ${unlockLevel}`,
          } satisfies ImprovementOpportunity;
        }),
    );
  });
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
