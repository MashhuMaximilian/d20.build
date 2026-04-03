import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInElement, BuiltInRule } from "@/lib/builtins/types";
import type { BuiltInBackgroundRecord } from "@/lib/builtins/backgrounds";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import type { CharacterClassEntry } from "@/lib/characters/types";
import type { RequirementContext } from "@/lib/progression/requirements";
import { getRequirementFailures } from "@/lib/progression/requirements";

const SYNTHETIC_OPTION_SOURCE = "Core option registry";
const SYNTHETIC_OPTION_SOURCE_URL = "internal://option-registry";

export type ProgressionChoiceOption = {
  element: BuiltInElement;
  requirementFailures: string[];
};

export type ProgressionChoiceGroup = {
  id: string;
  classEntryIndex: number;
  ownerType: "class" | "subclass" | "race" | "background" | "feat" | "nested";
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

type ProficiencyLanguageSelectRule = Extract<BuiltInRule, { kind: "select" }> & {
  type: "Proficiency" | "Language";
};

function collectGrantedIdsAtLevel(rules: BuiltInRule[], type: string, level: number) {
  return rules.flatMap((rule) =>
    rule.kind === "grant" && rule.type === type && (!rule.level || rule.level <= level) ? [rule.id] : [],
  );
}

function collectGrantedIdsFromElements(elements: BuiltInElement[], type: string, level?: number) {
  return elements.flatMap((element) =>
    element.rules.flatMap((rule) =>
      rule.kind === "grant" &&
      rule.type === type &&
      (!level || !rule.level || rule.level <= level)
        ? [rule.id]
        : [],
    ),
  );
}

function resolveNestedOwnerFeatures(entry: SelectedProgressionOptionEntry, optionPool: Map<string, BuiltInElement>) {
  const nestedGrantTypes = [
    "Class Feature",
    "Archetype Feature",
    "Racial Trait",
    "Background Feature",
    "Feat Feature",
  ];

  const grantedFeatures = nestedGrantTypes.flatMap((type) =>
    collectGrantedIdsFromElements([entry.element], type)
      .map((id) => optionPool.get(id))
      .filter((element): element is BuiltInElement => Boolean(element)),
  );

  return [entry.element, ...grantedFeatures];
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

function humanizeIdToken(value: string) {
  return value
    .replace(/^ID_[A-Z0-9_]+?_PROFICIENCY_/, "")
    .replace(/^ID_PROFICIENCY_/, "")
    .replace(/^ID_LANGUAGE_/, "")
    .replace(/^ID_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bTools\b/g, "Tools")
    .replace(/\bCant\b/g, "Cant");
}

function createSyntheticOptionElement(
  type: "Proficiency" | "Language",
  id: string,
  name: string,
  supports: string[],
): BuiltInElement {
  return {
    id,
    type,
    name,
    source: SYNTHETIC_OPTION_SOURCE,
    source_url: SYNTHETIC_OPTION_SOURCE_URL,
    catalogOrigin: "built-in" as const,
    supports,
    description: `${name} ${type.toLowerCase()} option.`,
    prerequisite: undefined,
    requirements: undefined,
    rules: [],
    setters: [],
  };
}

const SKILL_PROFICIENCY_OPTIONS = ([
  ["ID_PROFICIENCY_SKILL_ACROBATICS", "Acrobatics"],
  ["ID_PROFICIENCY_SKILL_ANIMAL_HANDLING", "Animal Handling"],
  ["ID_PROFICIENCY_SKILL_ANIMALHANDLING", "Animal Handling"],
  ["ID_PROFICIENCY_SKILL_ARCANA", "Arcana"],
  ["ID_PROFICIENCY_SKILL_ATHLETICS", "Athletics"],
  ["ID_PROFICIENCY_SKILL_DECEPTION", "Deception"],
  ["ID_PROFICIENCY_SKILL_HISTORY", "History"],
  ["ID_PROFICIENCY_SKILL_INSIGHT", "Insight"],
  ["ID_PROFICIENCY_SKILL_INTIMIDATION", "Intimidation"],
  ["ID_PROFICIENCY_SKILL_INVESTIGATION", "Investigation"],
  ["ID_PROFICIENCY_SKILL_MEDICINE", "Medicine"],
  ["ID_PROFICIENCY_SKILL_NATURE", "Nature"],
  ["ID_PROFICIENCY_SKILL_PERCEPTION", "Perception"],
  ["ID_PROFICIENCY_SKILL_PERFORMANCE", "Performance"],
  ["ID_PROFICIENCY_SKILL_PERSUASION", "Persuasion"],
  ["ID_PROFICIENCY_SKILL_RELIGION", "Religion"],
  ["ID_PROFICIENCY_SKILL_SLEIGHTOFHAND", "Sleight of Hand"],
  ["ID_PROFICIENCY_SKILL_STEALTH", "Stealth"],
  ["ID_PROFICIENCY_SKILL_SURVIVAL", "Survival"],
]) as const satisfies ReadonlyArray<readonly [string, string]>;

const SKILL_PROFICIENCY_ELEMENTS = SKILL_PROFICIENCY_OPTIONS.map(([id, name]) =>
  createSyntheticOptionElement("Proficiency", id, name, ["Skill"]),
);

const ARTISAN_TOOL_OPTIONS = ([
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_ALCHEMISTS_SUPPLIES", "Alchemist's Supplies"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_BREWERS_SUPPLIES", "Brewer's Supplies"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_CALLIGRAPHERS_SUPPLIES", "Calligrapher's Supplies"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_CARPENTERS_TOOLS", "Carpenter's Tools"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_CARTOGRAPHERS_TOOLS", "Cartographer's Tools"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_COBBLERS_TOOLS", "Cobbler's Tools"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_COOKS_UTENSILS", "Cook's Utensils"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_GLASSBLOWERS_TOOLS", "Glassblower's Tools"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_JEWELERS_TOOLS", "Jeweler's Tools"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_LEATHERWORKERS_TOOLS", "Leatherworker's Tools"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_MASONS_TOOLS", "Mason's Tools"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_PAINTERS_SUPPLIES", "Painter's Supplies"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_POTTERS_TOOLS", "Potter's Tools"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_SMITHS_TOOLS", "Smith's Tools"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_TINKERS_TOOLS", "Tinker's Tools"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_WEAVERS_TOOLS", "Weaver's Tools"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_WOODCARVERS_TOOLS", "Woodcarver's Tools"],
]) as const satisfies ReadonlyArray<readonly [string, string]>;

const ARTISAN_TOOL_ELEMENTS = ARTISAN_TOOL_OPTIONS.map(([id, name]) =>
  createSyntheticOptionElement("Proficiency", id, name, ["Tool", "Artisan tools"]),
);

const TOOL_PROFICIENCY_OPTIONS = [
  ...ARTISAN_TOOL_ELEMENTS,
  createSyntheticOptionElement("Proficiency", "ID_PROFICIENCY_TOOL_PROFICIENCY_DISGUISE_KIT", "Disguise Kit", ["Tool"]),
  createSyntheticOptionElement("Proficiency", "ID_PROFICIENCY_TOOL_PROFICIENCY_FORGERY_KIT", "Forgery Kit", ["Tool"]),
  createSyntheticOptionElement("Proficiency", "ID_PROFICIENCY_TOOL_PROFICIENCY_HERBALISM_KIT", "Herbalism Kit", ["Tool"]),
  createSyntheticOptionElement("Proficiency", "ID_PROFICIENCY_TOOL_PROFICIENCY_NAVIGATORS_TOOLS", "Navigator's Tools", ["Tool"]),
  createSyntheticOptionElement("Proficiency", "ID_PROFICIENCY_TOOL_PROFICIENCY_POISONERS_KIT", "Poisoner's Kit", ["Tool"]),
  createSyntheticOptionElement("Proficiency", "ID_PROFICIENCY_TOOL_PROFICIENCY_THIEVES_TOOLS", "Thieves' Tools", ["Tool"]),
  createSyntheticOptionElement("Proficiency", "ID_PROFICIENCY_TOOL_PROFICIENCY_VEHICLES_LAND", "Land Vehicles", ["Tool"]),
  createSyntheticOptionElement("Proficiency", "ID_PROFICIENCY_TOOL_PROFICIENCY_VEHICLES_WATER", "Water Vehicles", ["Tool"]),
];

const MUSICAL_INSTRUMENT_OPTIONS = ([
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_BAGPIPES", "Bagpipes"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_DRUM", "Drum"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_DULCIMER", "Dulcimer"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_FLUTE", "Flute"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_LUTE", "Lute"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_LYRE", "Lyre"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_HORN", "Horn"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_PAN_FLUTE", "Pan Flute"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_SHAWM", "Shawm"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_VIOL", "Viol"],
]) as const satisfies ReadonlyArray<readonly [string, string]>;

const MUSICAL_INSTRUMENT_ELEMENTS = MUSICAL_INSTRUMENT_OPTIONS.map(([id, name]) =>
  createSyntheticOptionElement("Proficiency", id, name, ["Tool", "Musical Instrument"]),
);

const GAMING_SET_OPTIONS = ([
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_DICE_SET", "Dice Set"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_DRAGONCHESS_SET", "Dragonchess Set"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_PLAYING_CARD_SET", "Playing Card Set"],
  ["ID_PROFICIENCY_TOOL_PROFICIENCY_THREE_DRAGON_ANTE_SET", "Three-Dragon Ante Set"],
]) as const satisfies ReadonlyArray<readonly [string, string]>;

const GAMING_SET_ELEMENTS = GAMING_SET_OPTIONS.map(([id, name]) =>
  createSyntheticOptionElement("Proficiency", id, name, ["Tool", "Gaming Set"]),
);

const LANGUAGE_OPTIONS = ([
  ["ID_LANGUAGE_COMMON", "Common", ["Standard"]],
  ["ID_LANGUAGE_DWARVISH", "Dwarvish", ["Standard"]],
  ["ID_LANGUAGE_ELVISH", "Elvish", ["Standard"]],
  ["ID_LANGUAGE_GIANT", "Giant", ["Standard"]],
  ["ID_LANGUAGE_GNOMISH", "Gnomish", ["Standard"]],
  ["ID_LANGUAGE_GOBLIN", "Goblin", ["Standard"]],
  ["ID_LANGUAGE_HALFLING", "Halfling", ["Standard"]],
  ["ID_LANGUAGE_ORC", "Orc", ["Standard"]],
  ["ID_LANGUAGE_ABYSSAL", "Abyssal", ["Exotic"]],
  ["ID_LANGUAGE_CELESTIAL", "Celestial", ["Exotic"]],
  ["ID_LANGUAGE_DEEPSPEECH", "Deep Speech", ["Exotic"]],
  ["ID_LANGUAGE_DRACONIC", "Draconic", ["Exotic"]],
  ["ID_LANGUAGE_INFERNAL", "Infernal", ["Exotic"]],
  ["ID_LANGUAGE_PRIMORDIAL", "Primordial", ["Exotic"]],
  ["ID_LANGUAGE_SYLVAN", "Sylvan", ["Exotic"]],
  ["ID_LANGUAGE_UNDERCOMMON", "Undercommon", ["Exotic"]],
  ["ID_LANGUAGE_DRUIDIC", "Druidic", ["Secret"]],
  ["ID_LANGUAGE_THIEVES_CANT", "Thieves' Cant", ["Secret"]],
]) as const satisfies ReadonlyArray<readonly [string, string, readonly string[]]>;

const LANGUAGE_ELEMENTS = LANGUAGE_OPTIONS.map(([id, name, supports]) =>
  createSyntheticOptionElement("Language", id, name, ["Language", ...supports]),
);

const SYNTHETIC_PROFICIENCY_OPTIONS = [
  ...SKILL_PROFICIENCY_ELEMENTS,
  ...TOOL_PROFICIENCY_OPTIONS,
  ...MUSICAL_INSTRUMENT_ELEMENTS,
  ...GAMING_SET_ELEMENTS,
];

function collectExplicitIdTokens(value: string | undefined) {
  if (!value) {
    return [];
  }

  return [...value.matchAll(/ID_[A-Z0-9_]+/g)].map((match) => match[0]);
}

function resolveSyntheticProficiencyLanguageOptions(
  rule: ProficiencyLanguageSelectRule,
  allOptions: BuiltInElement[],
) {
  const explicitIds = new Set(collectExplicitIdTokens(rule.supports));
  const directExplicitMatches = allOptions.filter((element) => explicitIds.has(element.id));
  const syntheticPool = rule.type === "Language" ? LANGUAGE_ELEMENTS : SYNTHETIC_PROFICIENCY_OPTIONS;
  const syntheticExplicitMatches = syntheticPool.filter((element) => explicitIds.has(element.id));

  const familyTokens = splitSupportTokens(rule.supports);
  const hasCategoryToken = (needle: string) => familyTokens.some((token) => token.includes(needle));

  const syntheticCategoryMatches =
    rule.type === "Language"
      ? LANGUAGE_ELEMENTS.filter((element) => {
          if (!familyTokens.length) {
            return true;
          }

          return familyTokens.some((token) => {
            if (token === "standard" || token === "exotic" || token === "secret") {
              return element.supports.map((support) => normalizeToken(support)).includes(token);
            }

            return false;
          });
        })
      : SYNTHETIC_PROFICIENCY_OPTIONS.filter((element) => {
          if (!familyTokens.length) {
            return true;
          }

          const supportTokens = element.supports.map((support) => normalizeToken(support));
          return (
            (hasCategoryToken("skill") && supportTokens.includes("skill")) ||
            (hasCategoryToken("artisan tools") && supportTokens.includes("artisan tools")) ||
            (hasCategoryToken("musical instrument") && supportTokens.includes("musical instrument")) ||
            (hasCategoryToken("gaming set") && supportTokens.includes("gaming set")) ||
            (hasCategoryToken("tool") && supportTokens.includes("tool"))
          );
        });

  const syntheticChoiceMatches =
    rule.choices?.map((choice) =>
      createSyntheticOptionElement(
        rule.type,
        choice.id || `${rule.type}:${choice.value}`,
        choice.value,
        [rule.type],
      ),
    ) ?? [];

  return [
    ...new Map(
      [
        ...directExplicitMatches,
        ...syntheticExplicitMatches,
        ...syntheticCategoryMatches,
        ...syntheticChoiceMatches,
      ].map((element) => [element.id, element]),
    ).values(),
  ];
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

function isNarrativeBackstoryRule(rule: Extract<BuiltInRule, { kind: "select" }>) {
  const normalizedName = normalizeToken(rule.name);

  return (
    normalizeToken(rule.type) === "list" ||
    normalizedName === "personality trait" ||
    normalizedName === "ideal" ||
    normalizedName === "bond" ||
    normalizedName === "flaw"
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

function normalizeSourceKey(value: string) {
  return normalizeToken(value).replace(/[’']/g, "'");
}

function getSourcePrecedenceScore(element: BuiltInElement) {
  const source = normalizeSourceKey(element.source);

  if (element.catalogOrigin === "built-in") {
    return 500;
  }

  if (source.includes("system reference document") || source === "srd") {
    return 450;
  }

  const officialSources = [
    "player's handbook",
    "xanathar's guide to everything",
    "tasha's cauldron of everything",
    "eberron: rising from the last war",
    "mythic odysseys of theros",
    "guildmasters' guide to ravnica",
    "explorer's guide to wildemount",
    "sword coast adventurer's guide",
    "mordenkainen presents: monsters of the multiverse",
  ];

  if (officialSources.some((entry) => source.includes(entry))) {
    return 400;
  }

  if (source.includes("unearthed arcana") || source.includes("ua")) {
    return 200;
  }

  return 300;
}

function getOptionPreferenceScore(
  element: BuiltInElement,
  explicitIds: Set<string>,
  familyTokens: string[],
) {
  let score = getSourcePrecedenceScore(element);
  const optionTokens = buildElementTokenSet(element);

  if (explicitIds.has(element.id)) {
    score += 1000;
  }

  const overlapCount = familyTokens.filter((token) => optionTokens.has(token)).length;
  score += overlapCount * 25;

  if (element.catalogOrigin === "built-in") {
    score += 50;
  }

  return score;
}

function dedupeResolvedOptions(
  options: BuiltInElement[],
  explicitIds: Set<string>,
  familyTokens: string[],
) {
  const groups = new Map<string, BuiltInElement[]>();

  options.forEach((element) => {
    const key = [
      normalizeToken(element.type),
      normalizeToken(element.name),
      normalizeToken(element.prerequisite ?? ""),
      normalizeToken(element.requirements ?? ""),
    ].join("|");

    const current = groups.get(key) ?? [];
    current.push(element);
    groups.set(key, current);
  });

  return [...groups.values()].map((group) =>
    [...group].sort(
      (left, right) =>
        getOptionPreferenceScore(right, explicitIds, familyTokens) -
          getOptionPreferenceScore(left, explicitIds, familyTokens) ||
        left.name.localeCompare(right.name) ||
        left.source.localeCompare(right.source) ||
        left.id.localeCompare(right.id),
    )[0],
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
  const explicitIds = new Set(collectExplicitIdTokens(rule.supports));

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

  const registryMatches =
    rule.type === "Proficiency" || rule.type === "Language"
      ? resolveSyntheticProficiencyLanguageOptions(rule as ProficiencyLanguageSelectRule, allOptions)
      : [];

  const resolvedOptions = [
    ...new Map([...deduped, ...registryMatches].map((element) => [element.id, element])).values(),
  ];
  const canonicalOptions = dedupeResolvedOptions(resolvedOptions, explicitIds, familyTokens);

  return canonicalOptions.map((element) => ({
    element,
    requirementFailures: getRequirementFailures(element.requirements, element.prerequisite, context),
  }));
}

function buildGroupId(
  classEntryIndex: number,
  ownerType: "class" | "subclass" | "race" | "background" | "feat" | "nested",
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
      rule.type !== "Sub Race" &&
      !isNarrativeBackstoryRule(rule) &&
      !isGenericSpellcastingRule(rule) &&
      (rule.type !== "Spell" || isSpecialProgressionSpellRule(rule)) &&
      !isImprovementRule(rule) &&
      (!rule.level || rule.level <= entryLevel),
  );
}

function buildGroupsFromFeatures(args: {
  classEntryIndex: number;
  ownerType: "class" | "subclass" | "race" | "background" | "feat" | "nested";
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
  optionPool: Map<string, BuiltInElement>,
): RequirementContext {
  if (!selectedEntries.length) {
    return context;
  }

  const grantedFeatureIds = selectedEntries.flatMap((entry) =>
    [
      ...collectGrantedIdsFromElements([entry.element], "Class Feature"),
      ...collectGrantedIdsFromElements([entry.element], "Archetype Feature"),
      ...collectGrantedIdsFromElements([entry.element], "Racial Trait"),
      ...collectGrantedIdsFromElements([entry.element], "Background Feature"),
      ...collectGrantedIdsFromElements([entry.element], "Feat Feature"),
    ].filter(Boolean),
  );
  const grantedFeatureNames = grantedFeatureIds
    .map((id) => optionPool.get(id)?.name)
    .filter((name): name is string => Boolean(name));

  return {
    ...context,
    selectedFeatureIds: [
      ...context.selectedFeatureIds,
      ...selectedEntries.map((entry) => entry.element.id),
      ...grantedFeatureIds,
    ],
    selectedFeatureNames: [
      ...context.selectedFeatureNames,
      ...selectedEntries.map((entry) => entry.element.name),
      ...grantedFeatureNames,
    ],
    selectedSizeIds: [
      ...context.selectedSizeIds,
      ...selectedEntries.flatMap((entry) => collectGrantedIdsFromElements([entry.element], "Size")),
    ],
    selectedProficiencyIds: [
      ...context.selectedProficiencyIds,
      ...selectedEntries.flatMap((entry) =>
        entry.element.type === "Proficiency" ? [entry.element.id] : collectGrantedIdsFromElements([entry.element], "Proficiency"),
      ),
    ],
    selectedProficiencyNames: [
      ...context.selectedProficiencyNames,
      ...selectedEntries.flatMap((entry) =>
        entry.element.type === "Proficiency" ? [entry.element.name] : [],
      ),
    ],
    selectedLanguageIds: [
      ...context.selectedLanguageIds,
      ...selectedEntries.flatMap((entry) =>
        entry.element.type === "Language" ? [entry.element.id] : collectGrantedIdsFromElements([entry.element], "Language"),
      ),
    ],
    selectedLanguageNames: [
      ...context.selectedLanguageNames,
      ...selectedEntries.flatMap((entry) =>
        entry.element.type === "Language" ? [entry.element.name] : [],
      ),
    ],
    selectedSpellIds: [
      ...context.selectedSpellIds,
      ...selectedEntries.flatMap((entry) =>
        entry.element.type === "Spell" ? [entry.element.id] : collectGrantedIdsFromElements([entry.element], "Spell"),
      ),
    ],
    selectedSpellNames: [
      ...context.selectedSpellNames,
      ...selectedEntries.flatMap((entry) => (entry.element.type === "Spell" ? [entry.element.name] : [])),
    ],
  };
}

export function deriveProgressionChoiceGroups(args: {
  activeClassRecords: Array<BuiltInClassRecord | null>;
  activeBackground: BuiltInBackgroundRecord | null;
  activeFeats: BuiltInElement[];
  activeRace: BuiltInRaceRecord | null;
  classEntries: CharacterClassEntry[];
  feats: BuiltInElement[];
  progressionElements: BuiltInElement[];
  selectedSubrace: BuiltInElement | null;
  selections: Record<string, string[]>;
  spells: BuiltInElement[];
  context: RequirementContext;
}) {
  const optionPool = collectOptionPool(args.progressionElements, args.feats, args.spells);

  const classGroups = args.activeClassRecords.flatMap((record, classEntryIndex) => {
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
        features: [record.class, ...unlockedClassFeatures],
        optionPool,
        context: args.context,
      }),
      ...buildGroupsFromFeatures({
        classEntryIndex,
        ownerType: "subclass",
        ownerLabel: selectedSubclass?.archetype.name ?? record.class.name,
        entryLevel: entry.level,
        features: selectedSubclass ? [selectedSubclass.archetype, ...unlockedSubclassFeatures] : unlockedSubclassFeatures,
        optionPool,
        context: args.context,
      }),
    ];
  });

  const raceGroups = args.activeRace
    ? buildGroupsFromFeatures({
        classEntryIndex: -1,
        ownerType: "race",
        ownerLabel: args.activeRace.race.name,
        entryLevel: Math.max(args.context.totalLevel, 1),
        features: [
          args.activeRace.race,
          ...(args.selectedSubrace ? [args.selectedSubrace] : []),
          ...args.activeRace.traits,
        ],
        optionPool,
        context: args.context,
      })
    : [];

  const backgroundGroups = args.activeBackground
    ? buildGroupsFromFeatures({
        classEntryIndex: -1,
        ownerType: "background",
        ownerLabel: args.activeBackground.background.name,
        entryLevel: Math.max(args.context.totalLevel, 1),
        features: [args.activeBackground.background, ...args.activeBackground.features],
        optionPool,
        context: args.context,
      })
    : [];

  const featGroups = args.activeFeats.flatMap((feat) =>
    buildGroupsFromFeatures({
      classEntryIndex: -1,
      ownerType: "feat",
      ownerLabel: feat.name,
      entryLevel: Math.max(args.context.totalLevel, 1),
      features: [feat],
      optionPool,
      context: args.context,
    }),
  );

  const groups = [...raceGroups, ...backgroundGroups, ...featGroups, ...classGroups];
  const processedSelectedKeys = new Set<string>();
  let frontier = getSelectedProgressionOptionEntries(groups, args.selections);

  while (frontier.length) {
    const contextWithSelections = extendRequirementContext(args.context, frontier, optionPool);
    const nestedGroups = frontier.flatMap((entry) =>
      buildGroupsFromFeatures({
        classEntryIndex: entry.classEntryIndex,
        ownerType: "nested",
        ownerLabel: entry.ownerLabel,
        entryLevel:
          entry.classEntryIndex >= 0
            ? Math.max(args.classEntries[entry.classEntryIndex]?.level ?? 1, 1)
            : Math.max(args.context.totalLevel, 1),
        features: resolveNestedOwnerFeatures(entry, optionPool),
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

  const finalContext = extendRequirementContext(
    args.context,
    getSelectedProgressionOptionEntries(groups, args.selections),
    optionPool,
  );

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
