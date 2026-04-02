import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInElement, BuiltInRule } from "@/lib/builtins/types";
import type { CharacterClassEntry } from "@/lib/characters/types";
import type { RequirementContext } from "@/lib/progression/requirements";
import { getRequirementFailures } from "@/lib/progression/requirements";

export type ProgressionChoiceOption = {
  element: BuiltInElement;
  requirementFailures: string[];
};

export type ProgressionChoiceGroup = {
  id: string;
  classEntryIndex: number;
  ownerType: "class" | "subclass" | "nested";
  ownerLabel: string;
  featureId: string;
  featureName: string;
  title: string;
  familyLabel: string;
  optionType: string;
  unlockLevel: number;
  exactSelections: number;
  optional: boolean;
  supportsKey?: string;
  description: string;
  options: ProgressionChoiceOption[];
};

function collectGrantedIdsAtLevel(rules: BuiltInRule[], type: string, level: number) {
  return rules.flatMap((rule) =>
    rule.kind === "grant" && rule.type === type && (!rule.level || rule.level <= level) ? [rule.id] : [],
  );
}

function isImprovementRule(rule: BuiltInRule) {
  return (
    rule.kind === "select" &&
    (rule.type === "Ability Score Improvement" ||
      (rule.type === "Class Feature" &&
        (rule.supports?.includes("Improvement Option") ||
          rule.name.toLowerCase().includes("improvement option"))))
  );
}

function normalizeToken(value: string) {
  return value.trim().toLowerCase();
}

function splitSupportTokens(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(/\|\||&&|\||,/)
    .map((token) => normalizeToken(token))
    .filter(Boolean);
}

function collectOptionPool(
  classRecords: BuiltInClassRecord[],
  feats: BuiltInElement[],
  spells: BuiltInElement[],
) {
  const classFeatures = classRecords.flatMap((record) => record.features);
  const subclassFeatures = classRecords.flatMap((record) =>
    record.subclassSteps.flatMap((step) => step.options.flatMap((option) => option.features)),
  );

  return [...classFeatures, ...subclassFeatures, ...feats, ...spells].reduce<Map<string, BuiltInElement>>(
    (map, element) => {
      if (!map.has(element.id)) {
        map.set(element.id, element);
      }
      return map;
    },
    new Map(),
  );
}

function resolveRuleOptions(
  rule: Extract<BuiltInRule, { kind: "select" }>,
  optionPool: Map<string, BuiltInElement>,
  context: RequirementContext,
) {
  const allOptions = [...optionPool.values()].filter((element) => element.type === rule.type);

  const byChoices = rule.choices?.length
    ? rule.choices
        .flatMap((choice) => {
          const byId = optionPool.get(choice.id);
          if (byId && byId.type === rule.type) {
            return [byId];
          }

          const byValue = allOptions.find(
            (element) =>
              normalizeToken(element.name) === normalizeToken(choice.value) ||
              normalizeToken(element.id) === normalizeToken(choice.id),
          );
          return byValue ? [byValue] : [];
        })
    : [];

  const directMatches = splitSupportTokens(rule.supports).length
    ? allOptions.filter((element) => {
        const tokens = splitSupportTokens(rule.supports);
        return tokens.some(
          (token) =>
            normalizeToken(element.id) === token ||
            element.supports.some((support) => normalizeToken(support) === token),
        );
      })
    : [];

  const deduped = [...new Map([...byChoices, ...directMatches].map((element) => [element.id, element])).values()];

  return deduped.map((element) => ({
    element,
    requirementFailures: getRequirementFailures(element.requirements, element.prerequisite, context),
  }));
}

function buildGroupId(
  classEntryIndex: number,
  ownerType: "class" | "subclass" | "nested",
  featureId: string,
  rule: Extract<BuiltInRule, { kind: "select" }>,
) {
  return [
    "progression",
    classEntryIndex,
    ownerType,
    featureId,
    rule.type,
    rule.name,
    rule.level ?? 0,
    rule.supports ?? "default",
  ].join(":");
}

function collectSelectableRules(feature: BuiltInElement, entryLevel: number) {
  return feature.rules.filter(
    (rule): rule is Extract<BuiltInRule, { kind: "select" }> =>
      rule.kind === "select" &&
      rule.type !== "Archetype" &&
      rule.type !== "Spell" &&
      !isImprovementRule(rule) &&
      (!rule.level || rule.level <= entryLevel),
  );
}

function buildGroupsFromFeatures(args: {
  classEntryIndex: number;
  ownerType: "class" | "subclass" | "nested";
  ownerLabel: string;
  entryLevel: number;
  features: BuiltInElement[];
  optionPool: Map<string, BuiltInElement>;
  context: RequirementContext;
}) {
  const { classEntryIndex, ownerType, ownerLabel, entryLevel, features, optionPool, context } = args;

  return features.flatMap((feature) =>
    collectSelectableRules(feature, entryLevel)
      .filter((rule) => !rule.requirements || getRequirementFailures(rule.requirements, undefined, context).length === 0)
      .map((rule) => ({
        id: buildGroupId(classEntryIndex, ownerType, feature.id, rule),
        classEntryIndex,
        ownerType,
        ownerLabel,
        featureId: feature.id,
        featureName: feature.name,
        title: rule.name,
        familyLabel: rule.supports ?? rule.type,
        optionType: rule.type,
        unlockLevel: rule.level ?? entryLevel,
        exactSelections: Math.max(1, rule.number ?? 1),
        optional: rule.optional === true,
        supportsKey: rule.supports,
        description: feature.description,
        options: resolveRuleOptions(rule, optionPool, context),
      } satisfies ProgressionChoiceGroup)),
  );
}

export function getSelectedProgressionOptionElements(
  groups: ProgressionChoiceGroup[],
  selections: Record<string, string[]>,
) {
  const optionMap = new Map(
    groups.flatMap((group) => group.options.map((option) => [option.element.id, option.element] as const)),
  );

  return groups.flatMap((group) =>
    (selections[group.id] ?? []).flatMap((id) => {
      const element = optionMap.get(id);
      return element ? [element] : [];
    }),
  );
}

export function deriveProgressionChoiceGroups(args: {
  allClassRecords: BuiltInClassRecord[];
  activeClassRecords: Array<BuiltInClassRecord | null>;
  classEntries: CharacterClassEntry[];
  feats: BuiltInElement[];
  selections: Record<string, string[]>;
  spells: BuiltInElement[];
  context: RequirementContext;
}) {
  const optionPool = collectOptionPool(args.allClassRecords, args.feats, args.spells);

  const baseGroups = args.activeClassRecords.flatMap((record, classEntryIndex) => {
    const entry = args.classEntries[classEntryIndex];
    if (!record || !entry?.classId) {
      return [];
    }

    const classFeatureIds = new Set(collectGrantedIdsAtLevel(record.class.rules, "Class Feature", entry.level));
    const unlockedClassFeatures = record.features.filter((feature) => classFeatureIds.has(feature.id));
    const selectedSubclass = record.subclassSteps
      .flatMap((step) => step.options)
      .find((option) => option.archetype.id === entry.subclassId);
    const subclassFeatureIds = new Set(
      selectedSubclass
        ? collectGrantedIdsAtLevel(selectedSubclass.archetype.rules, "Archetype Feature", entry.level)
        : [],
    );
    const unlockedSubclassFeatures =
      selectedSubclass?.features.filter((feature) => subclassFeatureIds.has(feature.id)) ?? [];

    return [
      ...buildGroupsFromFeatures({
        classEntryIndex,
        ownerType: "class",
        ownerLabel: record.class.name,
        entryLevel: entry.level,
        features: unlockedClassFeatures,
        optionPool,
        context: args.context,
      }),
      ...buildGroupsFromFeatures({
        classEntryIndex,
        ownerType: "subclass",
        ownerLabel: selectedSubclass?.archetype.name ?? record.class.name,
        entryLevel: entry.level,
        features: unlockedSubclassFeatures,
        optionPool,
        context: args.context,
      }),
    ];
  });

  const selectedBaseOptions = getSelectedProgressionOptionElements(baseGroups, args.selections);
  const nestedGroups = buildGroupsFromFeatures({
    classEntryIndex: -1,
    ownerType: "nested",
    ownerLabel: "Selected feature",
    entryLevel: Math.max(...args.classEntries.map((entry) => entry.level), 1),
    features: selectedBaseOptions,
    optionPool,
    context: args.context,
  });

  return [...baseGroups, ...nestedGroups];
}

export function getProgressionValidationMessages(
  groups: ProgressionChoiceGroup[],
  selections: Record<string, string[]>,
) {
  return groups.flatMap((group) => {
    const validOptionIds = new Set(
      group.options.filter((option) => option.requirementFailures.length === 0).map((option) => option.element.id),
    );
    const selectedIds = (selections[group.id] ?? []).filter((id) => validOptionIds.has(id));

    if (!group.options.length && !group.optional) {
      return [`${group.title} has no options available in the current catalog.`];
    }

    if (!group.optional && selectedIds.length !== group.exactSelections) {
      return [
        `${group.title} requires exactly ${group.exactSelections} selection${
          group.exactSelections === 1 ? "" : "s"
        }.`,
      ];
    }

    return [];
  });
}
