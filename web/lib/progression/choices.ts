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

type SelectedProgressionOptionEntry = {
  classEntryIndex: number;
  ownerLabel: string;
  element: BuiltInElement;
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

function hasSupportTokenOverlap(left: string[], right: string[]) {
  if (!left.length || !right.length) {
    return false;
  }

  const rightSet = new Set(right);
  return left.some((token) => rightSet.has(token));
}

function buildElementTokenSet(element: BuiltInElement) {
  return new Set(
    [
      normalizeToken(element.id),
      normalizeToken(element.name),
      ...element.supports.map((support) => normalizeToken(support)),
      ...element.supports.flatMap((support) => splitSupportTokens(support)),
    ].filter(Boolean),
  );
}

function buildRuleFamilyTokens(
  feature: BuiltInElement,
  rule: Extract<BuiltInRule, { kind: "select" }>,
) {
  return [
    ...splitSupportTokens(rule.supports),
    ...splitSupportTokens(rule.name),
    normalizeToken(rule.name),
    normalizeToken(feature.name),
  ].filter(Boolean);
}

function isGenericSpellcastingRule(rule: Extract<BuiltInRule, { kind: "select" }>) {
  if (rule.type !== "Spell") {
    return false;
  }

  const normalizedName = normalizeToken(rule.name);
  const supportString = normalizeToken(rule.supports ?? "");
  return (
    normalizedName.includes("cantrip") ||
    normalizedName.includes("spellbook") ||
    supportString.includes("$(spellcasting:list)") ||
    supportString.includes("$(spellcasting:slots)") ||
    supportString.includes(",0") ||
    supportString.startsWith("0,")
  );
}

function isSpecialProgressionSpellRule(rule: Extract<BuiltInRule, { kind: "select" }>) {
  if (rule.type !== "Spell") {
    return false;
  }

  const tokens = [
    ...splitSupportTokens(rule.supports),
    ...splitSupportTokens(rule.name),
    normalizeToken(rule.name),
  ];
  return tokens.some(
    (token) =>
      token.includes("discipline") ||
      token.includes("psionic") ||
      token.includes("mystic order") ||
      token.includes("talent"),
  );
}

function collectOptionPool(
  progressionElements: BuiltInElement[],
  feats: BuiltInElement[],
  spells: BuiltInElement[],
) {
  return [...progressionElements, ...feats, ...spells].reduce<Map<string, BuiltInElement>>(
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
  feature: BuiltInElement,
  rule: Extract<BuiltInRule, { kind: "select" }>,
  optionPool: Map<string, BuiltInElement>,
  context: RequirementContext,
) {
  const allOptions = [...optionPool.values()].filter((element) => element.type === rule.type);
  const familyTokens = buildRuleFamilyTokens(feature, rule);

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

  const directMatches = familyTokens.length
    ? allOptions.filter((element) => {
        const optionTokens = buildElementTokenSet(element);
        const matchesFamily = familyTokens.some((token) => optionTokens.has(token));

        if (!matchesFamily) {
          return false;
        }

        const isShellElement =
          element.id === feature.id ||
          normalizeToken(element.name) === normalizeToken(rule.name) ||
          normalizeToken(element.name) === normalizeToken(feature.name) ||
          element.rules.some(
            (childRule) =>
              childRule.kind === "select" &&
              childRule.type === rule.type &&
              (normalizeToken(childRule.name) === normalizeToken(rule.name) ||
                hasSupportTokenOverlap(buildRuleFamilyTokens(element, childRule), familyTokens)),
          );

        return !isShellElement;
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
      !isGenericSpellcastingRule(rule) &&
      (rule.type !== "Spell" || isSpecialProgressionSpellRule(rule)) &&
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
        options: resolveRuleOptions(feature, rule, optionPool, context),
      } satisfies ProgressionChoiceGroup)),
  );
}

function getSelectedProgressionOptionEntries(
  groups: ProgressionChoiceGroup[],
  selections: Record<string, string[]>,
) {
  return groups.flatMap((group) =>
    (selections[group.id] ?? []).flatMap((id) => {
      const option = group.options.find((candidate) => candidate.element.id === id);
      return option
        ? [
            {
              classEntryIndex: group.classEntryIndex,
              ownerLabel: group.ownerLabel,
              element: option.element,
            } satisfies SelectedProgressionOptionEntry,
          ]
        : [];
    }),
  );
}

export function getSelectedProgressionOptionElements(
  groups: ProgressionChoiceGroup[],
  selections: Record<string, string[]>,
) {
  return getSelectedProgressionOptionEntries(groups, selections).map((entry) => entry.element);
}

function extendRequirementContext(
  context: RequirementContext,
  selectedEntries: SelectedProgressionOptionEntry[],
): RequirementContext {
  if (!selectedEntries.length) {
    return context;
  }

  return {
    ...context,
    selectedFeatureIds: [...context.selectedFeatureIds, ...selectedEntries.map((entry) => entry.element.id)],
    selectedFeatureNames: [...context.selectedFeatureNames, ...selectedEntries.map((entry) => entry.element.name)],
  };
}

export function deriveProgressionChoiceGroups(args: {
  activeClassRecords: Array<BuiltInClassRecord | null>;
  classEntries: CharacterClassEntry[];
  feats: BuiltInElement[];
  progressionElements: BuiltInElement[];
  selections: Record<string, string[]>;
  spells: BuiltInElement[];
  context: RequirementContext;
}) {
  const optionPool = collectOptionPool(args.progressionElements, args.feats, args.spells);

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

  const groups = [...baseGroups];
  const processedSelectedKeys = new Set<string>();
  let frontier = getSelectedProgressionOptionEntries(baseGroups, args.selections);

  while (frontier.length) {
    const contextWithSelections = extendRequirementContext(args.context, frontier);
    const nestedGroups = frontier.flatMap((entry) =>
      buildGroupsFromFeatures({
        classEntryIndex: entry.classEntryIndex,
        ownerType: "nested",
        ownerLabel: entry.ownerLabel,
        entryLevel: Math.max(args.classEntries[entry.classEntryIndex]?.level ?? 1, 1),
        features: [entry.element],
        optionPool,
        context: contextWithSelections,
      }),
    );

    const uniqueNestedGroups = nestedGroups.filter((group) => !groups.some((existing) => existing.id === group.id));
    if (!uniqueNestedGroups.length) {
      break;
    }

    groups.push(...uniqueNestedGroups);

    frontier = getSelectedProgressionOptionEntries(uniqueNestedGroups, args.selections).filter((entry) => {
      const key = `${entry.classEntryIndex}:${entry.element.id}`;
      if (processedSelectedKeys.has(key)) {
        return false;
      }

      processedSelectedKeys.add(key);
      return true;
    });
  }

  const finalContext = extendRequirementContext(args.context, getSelectedProgressionOptionEntries(groups, args.selections));

  return groups.map((group) => ({
    ...group,
    options: group.options.map((option) => ({
      ...option,
      requirementFailures: getRequirementFailures(option.element.requirements, option.element.prerequisite, finalContext),
    })),
  }));
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
