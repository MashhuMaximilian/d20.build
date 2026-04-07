"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AbilityScoreEditor } from "@/components/ability-score-editor";
import { BackstoryStep } from "@/components/backstory-step";
import { CatalogSelector, type CatalogItem } from "@/components/catalog-selector";
import { EquipmentStep } from "@/components/equipment-step";
import { FeatsAsiStep } from "@/components/feats-asi-step";
import { LevelingStep } from "@/components/leveling-step";
import { getMarkdownPreview, hasMarkdownContent } from "@/components/markdown-editor";
import { ProgressionChoicesStep } from "@/components/progression-choices-step";
import { SpellcastingStep } from "@/components/spellcasting-step";
import type { BuiltInBackgroundRecord } from "@/lib/builtins/backgrounds";
import type {
  BuiltInClassRecord,
  BuiltInSubclassStep,
} from "@/lib/builtins/classes";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import type { BuiltInElement, BuiltInRule } from "@/lib/builtins/types";
import { saveRemoteCharacterDraft } from "@/lib/characters/repository";
import {
  ABILITY_KEYS,
  createEmptyCharacterDraft,
  getPrimaryClassEntry,
  getPointBuyTotal,
  getTotalCharacterLevel,
  STANDARD_ARRAY,
  type AbilityKey,
  type CharacterDraft,
  type CharacterImprovementSelection,
} from "@/lib/characters/types";
import { saveCharacterDraft } from "@/lib/characters/storage";
import {
  getMissingEquipmentChoiceCount,
  getStartingEquipmentPlan,
  resolveStartingEquipmentItems,
} from "@/lib/equipment/starting-equipment";
import {
  deriveImprovementOpportunities,
  getFeatPrerequisiteFailures,
  getImprovementBonuses,
  getImprovementSelectionPoints,
} from "@/lib/progression/improvements";
import {
  deriveProgressionChoiceGroups,
  getProgressionValidationMessages,
  getSelectedProgressionOptionElements,
} from "@/lib/progression/choices";
import {
  extractAbilityThresholdClauses,
  type RequirementContext,
} from "@/lib/progression/requirements";
import {
  deriveSpellcastingGroups,
  getSpellLevel,
  getSpellValidationMessages,
} from "@/lib/progression/spellcasting";

type BuilderEditorProps = {
  backgrounds: BuiltInBackgroundRecord[];
  classes: BuiltInClassRecord[];
  feats: BuiltInElement[];
  initialDraft?: CharacterDraft;
  progressionElements: BuiltInElement[];
  races: BuiltInRaceRecord[];
  spells: BuiltInElement[];
};

type BuilderStepId =
  | "foundation"
  | "race"
  | "subrace"
  | "class"
  | "subclass"
  | "progression"
  | "background"
  | "backstory"
  | "feats"
  | "spellcasting"
  | "equipment"
  | "review";

type BuilderStep = {
  id: string;
  kind: BuilderStepId;
  label: string;
  description: string;
  classEntryIndex?: number;
};

function rebalanceClassEntries(totalLevel: number, entries: CharacterDraft["classEntries"]) {
  const safeTotal = Math.max(1, Math.min(20, Math.floor(totalLevel || 1)));
  const normalizedEntries = entries.length
    ? entries.map((entry) => ({
        classId: entry.classId ?? "",
        subclassId: entry.subclassId ?? "",
        level: Math.max(1, Math.floor(entry.level || 1)),
      }))
    : [{ classId: "", subclassId: "", level: safeTotal }];

  const extraEntries = normalizedEntries.slice(1).map((entry) => ({
    ...entry,
    level: Math.max(1, Math.floor(entry.level || 1)),
  }));
  const extraLevelTotal = extraEntries.reduce((sum, entry) => sum + entry.level, 0);
  const primaryLevel = Math.max(1, safeTotal - extraLevelTotal);

  return [
    {
      ...normalizedEntries[0],
      level: primaryLevel,
    },
    ...extraEntries,
  ];
}

function getStatBonuses(values: string[]) {
  return values.reduce<Record<string, number>>((accumulator, value) => {
    const [name, amount] = value.split(":");
    accumulator[name] = (accumulator[name] ?? 0) + Number(amount);
    return accumulator;
  }, {});
}

function collectGrantedIds(rules: BuiltInRule[], type: string) {
  return rules.flatMap((rule) =>
    rule.kind === "grant" && rule.type === type ? [rule.id] : [],
  );
}

function collectGrantedIdsAtLevel(rules: BuiltInRule[], type: string, level: number) {
  return rules.flatMap((rule) =>
    rule.kind === "grant" && rule.type === type && (!rule.level || rule.level <= level) ? [rule.id] : [],
  );
}

function collectGrantedIdsFromElements(elements: BuiltInElement[], type: string) {
  return elements.flatMap((element) => collectGrantedIds(element.rules, type));
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

function collectStatBonusesFromElements(elements: BuiltInElement[]) {
  const values = elements.flatMap((element) =>
    element.rules.flatMap((rule) =>
      rule.kind === "stat" && ABILITY_KEYS.includes(rule.name as AbilityKey) ? [`${rule.name}:${rule.value}`] : [],
    ),
  );

  return getStatBonuses(values);
}

function countSelectRules(rules: BuiltInRule[]) {
  return rules.filter((rule) => rule.kind === "select").length;
}

function getAbilityBonusSummary(rules: BuiltInRule[]) {
  const totals = new Map<string, number>();

  rules.forEach((rule) => {
    if (
      rule.kind === "stat" &&
      ABILITY_KEYS.includes(rule.name as AbilityKey) &&
      Number.isFinite(Number(rule.value))
    ) {
      totals.set(rule.name, (totals.get(rule.name) ?? 0) + Number(rule.value));
    }
  });

  return [...totals.entries()]
    .sort((left, right) => ABILITY_KEYS.indexOf(left[0] as AbilityKey) - ABILITY_KEYS.indexOf(right[0] as AbilityKey))
    .map(([ability, amount]) => `${amount >= 0 ? "+" : ""}${amount} ${ability.toUpperCase()}`);
}

function getFirstLevelGrantSummary(rules: BuiltInRule[]) {
  const counts = new Map<string, number>();

  rules.forEach((rule) => {
    if (rule.kind === "grant" && (!rule.level || rule.level <= 1)) {
      counts.set(rule.type, (counts.get(rule.type) ?? 0) + 1);
    }
  });

  return [...counts.entries()]
    .map(([type, count]) => `${count} ${type.toLowerCase()}${count === 1 ? "" : "s"}`)
    .slice(0, 4);
}

function normalizeSummaryLines(lines: string[]) {
  return lines.filter(Boolean).slice(0, 4);
}

function buildFeatureDetails(features: Array<{ name: string; description: string; descriptionHtml?: string; source?: string }>) {
  return features
    .filter((feature) => feature.name && feature.description.trim())
    .map((feature) => ({
      name: feature.name,
      description: feature.description,
      detailHtml: feature.descriptionHtml,
      source: feature.source,
    }));
}

function getMulticlassRequirementFailures(rulesText: string | undefined, abilities: CharacterDraft["abilities"]) {
  return extractAbilityThresholdClauses(rulesText).filter(
    (entry) => abilities[entry.ability] < entry.minimum,
  );
}

function isStandardArrayValid(draft: CharacterDraft) {
  const assigned = Object.values(draft.abilities).sort((a, b) => a - b);
  const standard = [...STANDARD_ARRAY].sort((a, b) => a - b);

  return assigned.every((value, index) => value === standard[index]);
}

function getAbilityValidationMessage(draft: CharacterDraft) {
  if (ABILITY_KEYS.some((ability) => !Number.isFinite(draft.abilities[ability]))) {
    return "Ability scores must all be valid numbers before you save.";
  }

  if (draft.abilityMode === "point-buy") {
    if (ABILITY_KEYS.some((ability) => draft.abilities[ability] < 8 || draft.abilities[ability] > 15)) {
      return "Point buy scores must stay between 8 and 15.";
    }

    const total = getPointBuyTotal(draft.abilities);
    if (total > 27) {
      return `Point buy is over budget at ${total}/27. Lower one or more scores before saving.`;
    }
  }

  if (draft.abilityMode === "standard-array" && !isStandardArrayValid(draft)) {
    return "Standard array must use exactly 15, 14, 13, 12, 10, and 8.";
  }

  if (
    draft.abilityMode !== "point-buy" &&
    ABILITY_KEYS.some((ability) => draft.abilities[ability] < 3 || draft.abilities[ability] > 20)
  ) {
    return "Ability scores must stay between 3 and 20 in this mode.";
  }

  return "";
}

function buildRaceCatalogItems(races: BuiltInRaceRecord[]): CatalogItem[] {
  return races.map((entry) => {
    const bonusSummary = getAbilityBonusSummary(entry.race.rules);
    const traitSummary = entry.traits.slice(0, 2).map((trait) => trait.name).join(" • ");
    const impactLines = normalizeSummaryLines([
      entry.subraces.length
        ? `${entry.subraces.length} subrace option${entry.subraces.length === 1 ? "" : "s"}`
        : "No subrace branch",
      entry.traits.length ? `Grants ${entry.traits.length} racial traits` : "",
      countSelectRules(entry.race.rules) ? `Introduces ${countSelectRules(entry.race.rules)} choice nodes` : "",
    ]);

    return {
      id: entry.race.id,
      name: entry.race.name,
      description: entry.race.description,
      detailHtml: entry.race.descriptionHtml,
      origin: entry.race.catalogOrigin,
      source: entry.race.source,
      meta: `${entry.subraces.length} subraces · ${entry.traits.length} related traits`,
      summaryLines: normalizeSummaryLines([
        bonusSummary.join(", "),
        traitSummary,
      ]),
      impactLines,
      mechanicsLines: normalizeSummaryLines([
        bonusSummary.length ? `Ability bonuses: ${bonusSummary.join(", ")}` : "",
        entry.subraces.length
          ? `Subrace branch available: ${entry.subraces.length} option${entry.subraces.length === 1 ? "" : "s"}`
          : "No subrace choice required",
        entry.traits.length ? `Core racial traits: ${entry.traits.length}` : "",
        countSelectRules(entry.race.rules) ? `Choice nodes introduced: ${countSelectRules(entry.race.rules)}` : "",
      ]),
      filterTags: [
        ...bonusSummary,
        ...entry.subraces.slice(0, 6).map((subrace) => subrace.name),
        ...entry.traits.slice(0, 6).map((trait) => trait.name),
      ],
      detailTags: [
        ...bonusSummary,
        ...entry.traits.slice(0, 6).map((trait) => trait.name),
      ],
      featureDetails: buildFeatureDetails(entry.traits),
    };
  });
}

function buildSubraceCatalogItems(race: BuiltInRaceRecord | null): CatalogItem[] {
  if (!race) {
    return [];
  }

  return race.subraces.map((subrace) => {
    const bonusSummary = getAbilityBonusSummary(subrace.rules);
    const grantedTraitIds = new Set(collectGrantedIds(subrace.rules, "Racial Trait"));
    const grantedTraits = race.traits.filter((trait) => grantedTraitIds.has(trait.id));
    const traitSummary = grantedTraits.slice(0, 2).map((trait) => trait.name).join(" • ");

    return {
      id: subrace.id,
      name: subrace.name,
      description: subrace.description,
      detailHtml: subrace.descriptionHtml,
      origin: subrace.catalogOrigin,
      source: subrace.source,
      meta: `${grantedTraits.length} granted traits`,
      summaryLines: normalizeSummaryLines([
        bonusSummary.join(", "),
        traitSummary,
      ]),
      impactLines: normalizeSummaryLines([
        grantedTraits.length ? `Grants ${grantedTraits.length} subrace traits` : "",
        countSelectRules(subrace.rules) ? `Introduces ${countSelectRules(subrace.rules)} choice nodes` : "",
      ]),
      mechanicsLines: normalizeSummaryLines([
        bonusSummary.length ? `Ability bonuses: ${bonusSummary.join(", ")}` : "",
        grantedTraits.length ? `Granted traits: ${grantedTraits.length}` : "",
        countSelectRules(subrace.rules) ? `Choice nodes introduced: ${countSelectRules(subrace.rules)}` : "",
      ]),
      filterTags: [
        ...bonusSummary,
        ...grantedTraits.slice(0, 6).map((trait) => trait.name),
      ],
      detailTags: [...bonusSummary, ...grantedTraits.slice(0, 8).map((trait) => trait.name)],
      featureDetails: buildFeatureDetails(grantedTraits),
    };
  });
}

function buildClassCatalogItems(classes: BuiltInClassRecord[]): CatalogItem[] {
  return classes.map((entry) => {
    const pendingChoices =
      countSelectRules(entry.class.rules) +
      entry.features.reduce((count, feature) => count + countSelectRules(feature.rules), 0);

    const grantSummary = getFirstLevelGrantSummary(entry.class.rules);
    const subclassSummary = entry.subclassSteps[0]?.timingLabel ?? "";
    const spellcastingLine = entry.class.spellcasting
      ? `Spellcasting: ${entry.class.spellcasting.name ?? entry.class.spellcasting.ability ?? "Yes"}`
      : entry.spellcastingFeatures.length
        ? `Spellcasting features: ${entry.spellcastingFeatures.length}`
        : "";
    const featureSummary = entry.features.slice(0, 2).map((feature) => feature.name).join(" • ");

    return {
      id: entry.class.id,
      name: entry.class.name,
      description: entry.class.description,
      detailHtml: entry.class.descriptionHtml,
      origin: entry.class.catalogOrigin,
      source: entry.class.source,
      meta: `${entry.features.length} class features`,
      summaryLines: normalizeSummaryLines([
        spellcastingLine,
        featureSummary,
      ]),
      impactLines: normalizeSummaryLines([
        `Grants ${entry.features.length} class features`,
        subclassSummary,
        pendingChoices ? `Adds ${pendingChoices} builder choices` : "",
        ...grantSummary,
      ]),
      mechanicsLines: normalizeSummaryLines([
        spellcastingLine,
        subclassSummary,
        pendingChoices ? `Builder choices introduced: ${pendingChoices}` : "",
        ...grantSummary,
      ]),
      filterTags: [
        ...entry.features.slice(0, 8).map((feature) => feature.name),
        ...(spellcastingLine ? ["Spellcasting"] : []),
        ...(subclassSummary ? ["Subclass step"] : []),
      ],
      detailTags: [
        ...(spellcastingLine ? [spellcastingLine.replace("Spellcasting: ", "")] : []),
        ...entry.features.slice(0, 6).map((feature) => feature.name),
      ],
      featureDetails: buildFeatureDetails(entry.features),
    };
  });
}

function buildSubclassCatalogItems(step: BuiltInSubclassStep | null): CatalogItem[] {
  if (!step) {
    return [];
  }

  return step.options.map((option) => ({
    id: option.archetype.id,
    name: option.archetype.name,
    description: option.archetype.description,
    detailHtml: option.archetype.descriptionHtml,
    origin: option.archetype.catalogOrigin,
    source: option.archetype.source,
    meta: `${option.features.length} subclass features · ${step.timingLabel}`,
    summaryLines: normalizeSummaryLines([
      option.features.slice(0, 2).map((feature) => feature.name).join(" • "),
    ]),
    impactLines: normalizeSummaryLines([
      `Adds ${option.features.length} subclass features`,
      step.timingLabel,
      countSelectRules(option.archetype.rules)
        ? `Introduces ${countSelectRules(option.archetype.rules)} subclass choices`
        : "",
    ]),
    mechanicsLines: normalizeSummaryLines([
      step.timingLabel,
      option.features.length ? `Granted subclass features: ${option.features.length}` : "",
      countSelectRules(option.archetype.rules)
        ? `Choice nodes introduced: ${countSelectRules(option.archetype.rules)}`
        : "",
    ]),
    filterTags: [
      step.label,
      ...option.features.slice(0, 8).map((feature) => feature.name),
    ],
    detailTags: option.features.slice(0, 6).map((feature) => feature.name),
    featureDetails: buildFeatureDetails(option.features),
  }));
}

function buildCompletionChecklist(draft: CharacterDraft, flags: {
  needsSubrace: boolean;
  needsSubclass: boolean;
  subclassesComplete: boolean;
  progressionValidationMessages: string[];
  abilityValidationMessage: string;
  improvementValidationMessages: string[];
  spellSelectionEnabled: boolean;
  spellValidationMessages: string[];
  missingEquipmentChoices: number;
  levelingValidationMessage: string;
}) {
  return [
    { label: "Name draft", done: Boolean(draft.name.trim()) },
    { label: "Choose race", done: Boolean(draft.raceId) },
    { label: "Choose subrace", done: !flags.needsSubrace || Boolean(draft.subraceId) },
    { label: "Choose classes", done: draft.classEntries.every((entry) => Boolean(entry.classId)) },
    { label: "Distribute levels", done: !flags.levelingValidationMessage },
    { label: "Choose subclass", done: !flags.needsSubclass || flags.subclassesComplete },
    { label: "Resolve choices", done: flags.progressionValidationMessages.length === 0 },
    { label: "Choose background", done: Boolean(draft.backgroundId) },
    { label: "Finalize abilities", done: !flags.abilityValidationMessage },
    { label: "Resolve feats / ASI", done: flags.improvementValidationMessages.length === 0 },
    ...(flags.spellSelectionEnabled
      ? [{ label: "Resolve spellcasting", done: flags.spellValidationMessages.length === 0 }]
      : []),
    { label: "Choose starting equipment", done: flags.missingEquipmentChoices === 0 },
  ];
}

function buildBackgroundCatalogItems(backgrounds: BuiltInBackgroundRecord[]): CatalogItem[] {
  return backgrounds.map((entry) => ({
    id: entry.background.id,
    name: entry.background.name,
    description: entry.background.description,
    detailHtml: entry.background.descriptionHtml,
    origin: entry.background.catalogOrigin,
    source: entry.background.source,
    meta: `${entry.features.length} background feature · ${entry.choiceCount} choice nodes`,
    summaryLines: normalizeSummaryLines([
      entry.features.slice(0, 2).map((feature) => feature.name).join(" • "),
      getFirstLevelGrantSummary(entry.background.rules).slice(0, 2).join(" • "),
    ]),
    impactLines: normalizeSummaryLines([
      `Grants ${entry.features.length} background feature${entry.features.length === 1 ? "" : "s"}`,
      entry.choiceCount ? `Adds ${entry.choiceCount} background choices` : "",
      ...getFirstLevelGrantSummary(entry.background.rules),
    ]),
    mechanicsLines: normalizeSummaryLines([
      entry.choiceCount ? `Guided choices introduced: ${entry.choiceCount}` : "No extra choice nodes",
      ...getFirstLevelGrantSummary(entry.background.rules),
    ]),
    filterTags: entry.features.slice(0, 8).map((feature) => feature.name),
    detailTags: entry.features.slice(0, 6).map((feature) => feature.name),
    featureDetails: buildFeatureDetails(entry.features),
  }));
}

function addAbilityBonusMaps(...maps: Array<Record<AbilityKey, number>>) {
  return ABILITY_KEYS.reduce<Record<AbilityKey, number>>(
    (totals, ability) => {
      totals[ability] = maps.reduce(
        (sum, current) => sum + (current[ability] ?? 0),
        0,
      );
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

function formatAbilityBonus(amount: number, ability: AbilityKey) {
  return `${amount >= 0 ? "+" : ""}${amount} ${ability.toUpperCase()}`;
}

function getImprovementValidationMessages(
  opportunities: ReturnType<typeof deriveImprovementOpportunities>,
  selections: Record<string, CharacterImprovementSelection>,
  availableFeatIds: Set<string>,
  featFailuresById: Record<string, string[]>,
) {
  const messages = opportunities.flatMap((opportunity) => {
    const selection = selections[opportunity.id];
    const opportunityLabel =
      opportunity.sourceType === "ancestry"
        ? opportunity.title
        : `${opportunity.className} level ${opportunity.unlockLevel}`;

    if (!selection) {
      return [
        `Resolve ${opportunityLabel} by choosing ${
          opportunity.featAllowed ? "an ASI or a feat" : "the required ability score increase"
        }.`,
      ];
    }

    if (selection.mode === "asi") {
      const totalPoints = getImprovementSelectionPoints(selection);
      return totalPoints === opportunity.totalPoints
        ? []
        : [
            `Spend exactly ${opportunity.totalPoints} ASI point${
              opportunity.totalPoints === 1 ? "" : "s"
            } for ${opportunityLabel}.`,
          ];
    }

    if (!opportunity.featAllowed) {
      return [`${opportunityLabel} only allows an ability score choice, not a feat.`];
    }

    if (!selection.featId) {
      return [`Choose a feat for ${opportunityLabel}.`];
    }

    if (!availableFeatIds.has(selection.featId)) {
      return [`The selected feat for ${opportunityLabel} is no longer available in the current catalog.`];
    }

    return (featFailuresById[selection.featId] ?? []).map(
      (failure) => `${opportunityLabel}: ${failure}`,
    );
  });

  const ancestrySelections = opportunities
    .filter(
      (opportunity) =>
        opportunity.sourceType === "ancestry" && opportunity.selectionPattern === "single-ability",
    )
    .map((opportunity) => {
      const selection = selections[opportunity.id];
      if (!selection || selection.mode !== "asi") {
        return null;
      }

      const chosenAbilities = Object.entries(selection.abilityBonuses ?? {})
        .filter(([, amount]) => Number(amount) > 0)
        .map(([ability]) => ability as AbilityKey);

      if (chosenAbilities.length > 1) {
        messages.push(`${opportunity.title} must assign its bonus to exactly one ability.`);
        return null;
      }

      return chosenAbilities[0] ?? null;
    })
    .filter((ability): ability is AbilityKey => Boolean(ability));

  const duplicateAbilities = ancestrySelections.filter(
    (ability, index, values) => values.indexOf(ability) !== index,
  );

  if (duplicateAbilities.length) {
    messages.push(
      `Customized origin increases must apply to different abilities (${[...new Set(duplicateAbilities)]
        .map((ability) => ability.toUpperCase())
        .join(", ")} selected more than once).`,
    );
  }

  return messages;
}

export function BuilderEditor({
  backgrounds,
  classes,
  feats,
  initialDraft,
  progressionElements,
  races,
  spells,
}: BuilderEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<CharacterDraft>(() => {
    const baseDraft = initialDraft ?? createEmptyCharacterDraft();
    return {
      ...baseDraft,
      classEntries: rebalanceClassEntries(baseDraft.level, baseDraft.classEntries),
    };
  });
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState<"error" | "success">("success");
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState("foundation");
  const [showNavigationWarnings, setShowNavigationWarnings] = useState(false);
  const [activeClassEntryIndex, setActiveClassEntryIndex] = useState(0);
  const primaryClassEntry = useMemo(() => getPrimaryClassEntry(draft), [draft]);
  const totalCharacterLevel = useMemo(() => getTotalCharacterLevel(draft), [draft]);
  const primaryClassLevel = primaryClassEntry?.level ?? draft.level;
  const classRecordsByEntry = useMemo(
    () =>
      draft.classEntries.map((entry) => classes.find((candidate) => candidate.class.id === entry.classId) ?? null),
    [classes, draft.classEntries],
  );
  const activeClassEntry = draft.classEntries[activeClassEntryIndex] ?? null;

  const selectedRace = useMemo(
    () => races.find((entry) => entry.race.id === draft.raceId) ?? null,
    [draft.raceId, races],
  );
  const selectedSubrace = useMemo(
    () => selectedRace?.subraces.find((entry) => entry.id === draft.subraceId) ?? null,
    [draft.subraceId, selectedRace],
  );
  const selectedClass = useMemo(
    () => classes.find((entry) => entry.class.id === primaryClassEntry?.classId) ?? null,
    [classes, primaryClassEntry?.classId],
  );
  const primarySubclassStep = useMemo(
    () => selectedClass?.subclassSteps[0] ?? null,
    [selectedClass],
  );
  const subclassEntryIndexes = useMemo(
    () =>
      draft.classEntries.flatMap((entry, index) =>
        entry.classId && classRecordsByEntry[index]?.subclassSteps[0] ? [index] : [],
      ),
    [classRecordsByEntry, draft.classEntries],
  );
  const unlockedSubclassEntryIndexes = useMemo(
    () =>
      subclassEntryIndexes.filter((index) => {
        const entry = draft.classEntries[index];
        const step = classRecordsByEntry[index]?.subclassSteps[0];
        return Boolean(step && entry && (!step.level || entry.level >= step.level));
      }),
    [classRecordsByEntry, draft.classEntries, subclassEntryIndexes],
  );
  const selectedBackground = useMemo(
    () => backgrounds.find((entry) => entry.background.id === draft.backgroundId) ?? null,
    [backgrounds, draft.backgroundId],
  );
  const selectedFeatElements = useMemo(
    () =>
      Object.values(draft.improvementSelections).flatMap((selection) => {
        if (selection.mode !== "feat" || !selection.featId) {
          return [];
        }

        const feat = feats.find((candidate) => candidate.id === selection.featId);
        return feat ? [feat] : [];
      }),
    [draft.improvementSelections, feats],
  );
  const availableFeatIds = useMemo(
    () => new Set(feats.map((feat) => feat.id)),
    [feats],
  );
  const improvementOpportunities = useMemo(
    () =>
      deriveImprovementOpportunities(
        draft.classEntries,
        classRecordsByEntry,
        selectedRace,
        selectedSubrace,
        draft.useTashasCustomizedOrigin,
      ),
    [classRecordsByEntry, draft.classEntries, draft.useTashasCustomizedOrigin, selectedRace, selectedSubrace],
  );
  const equipmentPlan = useMemo(
    () =>
      getStartingEquipmentPlan({
        classId: primaryClassEntry?.classId ?? "",
        backgroundId: draft.backgroundId,
      }),
    [draft.backgroundId, primaryClassEntry?.classId],
  );
  const selectedEquipmentItems = useMemo(
    () => resolveStartingEquipmentItems(equipmentPlan, draft.equipmentSelections),
    [draft.equipmentSelections, equipmentPlan],
  );
  const missingEquipmentChoices = useMemo(
    () => getMissingEquipmentChoiceCount(equipmentPlan, draft.equipmentSelections),
    [draft.equipmentSelections, equipmentPlan],
  );

  const racialBonuses = useMemo(() => {
    if (draft.useTashasCustomizedOrigin) {
      return {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      };
    }

    const statRules = [
      ...(selectedRace?.race.rules ?? []),
      ...(selectedSubrace?.rules ?? []),
    ].filter(
      (rule): rule is Extract<BuiltInRule, { kind: "stat" }> =>
        rule.kind === "stat" && ABILITY_KEYS.includes(rule.name as AbilityKey),
    );

    return getStatBonuses(
      statRules.map((rule) => `${rule.name}:${rule.value}`),
    );
  }, [draft.useTashasCustomizedOrigin, selectedRace, selectedSubrace]);
  const improvementBonuses = useMemo(
    () => getImprovementBonuses(draft.improvementSelections),
    [draft.improvementSelections],
  );
  const selectedFeatBonuses = useMemo(
    () => collectStatBonusesFromElements(selectedFeatElements),
    [selectedFeatElements],
  );
  const ancestryImprovementBonuses = useMemo(
    () =>
      getImprovementBonuses(
        Object.fromEntries(
          Object.entries(draft.improvementSelections).filter(([id]) =>
            improvementOpportunities.find((opportunity) => opportunity.id === id)?.sourceType === "ancestry",
          ),
        ),
      ),
    [draft.improvementSelections, improvementOpportunities],
  );
  const classImprovementBonuses = useMemo(
    () =>
      getImprovementBonuses(
        Object.fromEntries(
          Object.entries(draft.improvementSelections).filter(([id]) =>
            improvementOpportunities.find((opportunity) => opportunity.id === id)?.sourceType === "class",
          ),
        ),
      ),
    [draft.improvementSelections, improvementOpportunities],
  );
  const totalAppliedBonuses = useMemo(
    () =>
      addAbilityBonusMaps(
        ABILITY_KEYS.reduce<Record<AbilityKey, number>>(
          (totals, ability) => {
            totals[ability] = racialBonuses[ability] ?? 0;
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
        ),
        improvementBonuses,
        ABILITY_KEYS.reduce<Record<AbilityKey, number>>(
          (totals, ability) => {
            totals[ability] = selectedFeatBonuses[ability] ?? 0;
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
        ),
      ),
    [improvementBonuses, racialBonuses, selectedFeatBonuses],
  );
  const effectiveAbilities = useMemo(
    () =>
      ABILITY_KEYS.reduce<Record<AbilityKey, number>>((totals, ability) => {
        totals[ability] = draft.abilities[ability] + totalAppliedBonuses[ability];
        return totals;
      }, {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      }),
    [draft.abilities, totalAppliedBonuses],
  );
  const spellGroups = useMemo(
    () =>
      deriveSpellcastingGroups({
        activeFeats: selectedFeatElements,
        classRecordsByEntry,
        classEntries: draft.classEntries,
        effectiveAbilities,
        race: selectedRace,
        spellSelections: draft.spellSelections,
        spells,
        subrace: selectedSubrace,
        totalLevel: totalCharacterLevel,
      }),
    [classRecordsByEntry, draft.classEntries, draft.spellSelections, effectiveAbilities, selectedFeatElements, selectedRace, selectedSubrace, spells, totalCharacterLevel],
  );
  const abilityBonusBreakdown = useMemo(() => {
    const breakdown: Partial<Record<AbilityKey, string[]>> = {};

    ABILITY_KEYS.forEach((ability) => {
      const parts: string[] = [];
      const racialBonus = racialBonuses[ability] ?? 0;
      const ancestryChoiceBonus = ancestryImprovementBonuses[ability] ?? 0;
      const asiBonus = classImprovementBonuses[ability] ?? 0;
      const featBonus = selectedFeatBonuses[ability] ?? 0;

      if (racialBonus) {
        parts.push(`Ancestry ${racialBonus >= 0 ? "+" : ""}${racialBonus}`);
      }

      if (ancestryChoiceBonus) {
        parts.push(
          `${draft.useTashasCustomizedOrigin ? "Customized origin" : "Ancestry choice"} ${
            ancestryChoiceBonus >= 0 ? "+" : ""
          }${ancestryChoiceBonus}`,
        );
      }

      if (asiBonus) {
        parts.push(`ASI ${asiBonus >= 0 ? "+" : ""}${asiBonus}`);
      }

      if (featBonus) {
        parts.push(`Feat ${featBonus >= 0 ? "+" : ""}${featBonus}`);
      }

      if (parts.length) {
        breakdown[ability] = parts;
      }
    });

    return breakdown;
  }, [ancestryImprovementBonuses, classImprovementBonuses, draft.useTashasCustomizedOrigin, racialBonuses, selectedFeatBonuses]);

  const selectedRacialTraitNames = useMemo(() => {
    if (!selectedRace) {
      return [];
    }

    const traitIds = new Set([
      ...collectGrantedIds(selectedRace.race.rules, "Racial Trait"),
      ...(selectedSubrace ? collectGrantedIds(selectedSubrace.rules, "Racial Trait") : []),
    ]);

    return selectedRace.traits
      .filter((trait) => traitIds.has(trait.id))
      .map((trait) => trait.name);
  }, [selectedRace, selectedSubrace]);
  const selectedRacialTraitIds = useMemo(() => {
    if (!selectedRace) {
      return [];
    }

    return [
      ...collectGrantedIds(selectedRace.race.rules, "Racial Trait"),
      ...(selectedSubrace ? collectGrantedIds(selectedSubrace.rules, "Racial Trait") : []),
    ];
  }, [selectedRace, selectedSubrace]);
  const selectedClassFeatureNames = useMemo(
    () =>
      classRecordsByEntry.flatMap((record, index) => {
        const entry = draft.classEntries[index];
        if (!record || !entry?.classId) {
          return [];
        }

        const classFeatureIds = new Set(collectGrantedIdsAtLevel(record.class.rules, "Class Feature", entry.level));
        const baseFeatures = record.features
          .filter((feature) => classFeatureIds.has(feature.id))
          .map((feature) => feature.name);

        const selectedSubclass =
          record.subclassSteps
            .flatMap((step) => step.options)
            .find((option) => option.archetype.id === entry.subclassId) ?? null;
        const subclassFeatureIds = new Set(
          selectedSubclass
            ? collectGrantedIdsAtLevel(selectedSubclass.archetype.rules, "Archetype Feature", entry.level)
            : [],
        );
        const subclassFeatures =
          selectedSubclass?.features
            .filter((feature) => subclassFeatureIds.has(feature.id))
            .map((feature) => feature.name) ?? [];

        return [...baseFeatures, ...subclassFeatures];
      }),
    [classRecordsByEntry, draft.classEntries],
  );
  const selectedClassFeatureIds = useMemo(
    () =>
      classRecordsByEntry.flatMap((record, index) => {
        const entry = draft.classEntries[index];
        if (!record || !entry?.classId) {
          return [];
        }

        const classFeatureIds = collectGrantedIdsAtLevel(record.class.rules, "Class Feature", entry.level);
        const selectedSubclass =
          record.subclassSteps
            .flatMap((step) => step.options)
            .find((option) => option.archetype.id === entry.subclassId) ?? null;
        const subclassFeatureIds =
          selectedSubclass
            ? selectedSubclass.features
                .filter((feature) =>
                  collectGrantedIdsAtLevel(selectedSubclass.archetype.rules, "Archetype Feature", entry.level).includes(feature.id),
                )
                .map((feature) => feature.id)
            : [];

        return [...classFeatureIds, ...subclassFeatureIds];
      }),
    [classRecordsByEntry, draft.classEntries],
  );
  const selectedBackgroundFeatureIds = useMemo(
    () =>
      selectedBackground
        ? collectGrantedIds(selectedBackground.background.rules, "Background Feature")
        : [],
    [selectedBackground],
  );
  const selectedBackgroundFeatureNames = useMemo(
    () =>
      selectedBackground
        ? selectedBackground.features
            .filter((feature) => selectedBackgroundFeatureIds.includes(feature.id))
            .map((feature) => feature.name)
        : [],
    [selectedBackground, selectedBackgroundFeatureIds],
  );
  const selectedFeatFeatureIds = useMemo(
    () => collectGrantedIdsFromElements(selectedFeatElements, "Feat Feature"),
    [selectedFeatElements],
  );
  const selectedFeatFeatureNames = useMemo(
    () =>
      selectedFeatElements.flatMap((feat) => {
        const grantedIds = new Set(collectGrantedIds(feat.rules, "Feat Feature"));
        return feats
          .filter((candidate) => grantedIds.has(candidate.id))
          .map((candidate) => candidate.name);
      }),
    [feats, selectedFeatElements],
  );
  const selectedBaseProficiencyIds = useMemo(() => {
    const raceTraitIds = new Set(selectedRacialTraitIds);
    const selectedRaceTraitElements =
      selectedRace?.traits.filter((trait) => raceTraitIds.has(trait.id)) ?? [];
    const classGrantedFeatureIds = new Set(selectedClassFeatureIds);
    const selectedClassFeatureElements = classRecordsByEntry.flatMap((record, index) => {
      const entry = draft.classEntries[index];
      if (!record || !entry?.classId) {
        return [];
      }

      const selectedSubclass =
        record.subclassSteps
          .flatMap((step) => step.options)
          .find((option) => option.archetype.id === entry.subclassId) ?? null;

      return [
        record.class,
        ...record.features.filter((feature) => classGrantedFeatureIds.has(feature.id)),
        ...(selectedSubclass ? [selectedSubclass.archetype] : []),
        ...(selectedSubclass?.features.filter((feature) => classGrantedFeatureIds.has(feature.id)) ?? []),
      ];
    });

    const selectedBackgroundFeatureElements =
      selectedBackground?.features.filter((feature) => selectedBackgroundFeatureIds.includes(feature.id)) ?? [];

    return [
      ...(selectedRace ? collectGrantedIds(selectedRace.race.rules, "Proficiency") : []),
      ...(selectedSubrace ? collectGrantedIds(selectedSubrace.rules, "Proficiency") : []),
      ...collectGrantedIdsFromElements(selectedRaceTraitElements, "Proficiency"),
      ...classRecordsByEntry.flatMap((record, index) => {
        const entry = draft.classEntries[index];
        return record && entry?.classId
          ? collectGrantedIdsAtLevel(record.class.rules, "Proficiency", entry.level)
          : [];
      }),
      ...collectGrantedIdsFromElements(classGrantedFeatureIds.size ? selectedClassFeatureElements : [], "Proficiency"),
      ...(selectedBackground ? collectGrantedIds(selectedBackground.background.rules, "Proficiency") : []),
      ...collectGrantedIdsFromElements(selectedBackgroundFeatureElements, "Proficiency"),
      ...collectGrantedIdsFromElements(selectedFeatElements, "Proficiency"),
    ];
  }, [
    classRecordsByEntry,
    draft.classEntries,
    selectedBackground,
    selectedBackgroundFeatureIds,
    selectedClassFeatureIds,
    selectedFeatElements,
    selectedRace,
    selectedRacialTraitIds,
    selectedSubrace,
  ]);
  const selectedBaseLanguageIds = useMemo(
    () => [
      ...(selectedRace ? collectGrantedIds(selectedRace.race.rules, "Language") : []),
      ...(selectedSubrace ? collectGrantedIds(selectedSubrace.rules, "Language") : []),
      ...(selectedBackground ? collectGrantedIds(selectedBackground.background.rules, "Language") : []),
      ...collectGrantedIdsFromElements(selectedFeatElements, "Language"),
    ],
    [selectedBackground, selectedFeatElements, selectedRace, selectedSubrace],
  );
  const selectedSubclassNames = useMemo(
    () =>
      classRecordsByEntry.flatMap((record, index) => {
        const entry = draft.classEntries[index];
        if (!record || !entry?.subclassId) {
          return [];
        }

        const selectedSubclass =
          record.subclassSteps
            .flatMap((step) => step.options)
            .find((option) => option.archetype.id === entry.subclassId) ?? null;

        return selectedSubclass ? [selectedSubclass.archetype.name] : [];
      }),
    [classRecordsByEntry, draft.classEntries],
  );
  const selectedSubclassIds = useMemo(
    () =>
      classRecordsByEntry.flatMap((record, index) => {
        const entry = draft.classEntries[index];
        if (!record || !entry?.subclassId) {
          return [];
        }

        const selectedSubclass =
          record.subclassSteps
            .flatMap((step) => step.options)
            .find((option) => option.archetype.id === entry.subclassId) ?? null;

        return selectedSubclass ? [selectedSubclass.archetype.id] : [];
      }),
    [classRecordsByEntry, draft.classEntries],
  );
  const selectedSizeIds = useMemo(
    () => [
      ...(selectedRace ? collectGrantedIds(selectedRace.race.rules, "Size") : []),
      ...(selectedSubrace ? collectGrantedIds(selectedSubrace.rules, "Size") : []),
      ...collectGrantedIdsFromElements(selectedFeatElements, "Size"),
    ],
    [selectedFeatElements, selectedRace, selectedSubrace],
  );
  const selectedSpellIds = useMemo(
    () =>
      Object.values(draft.spellSelections)
        .flat()
        .filter((id, index, values): id is string => Boolean(id) && values.indexOf(id) === index),
    [draft.spellSelections],
  );
  const selectedSpellNames = useMemo(
    () =>
      selectedSpellIds
        .map((id) => spells.find((spell) => spell.id === id)?.name)
        .filter((name): name is string => Boolean(name)),
    [selectedSpellIds, spells],
  );
  const selectedCantripIds = useMemo(
    () =>
      selectedSpellIds.filter((id) => {
        const spell = spells.find((candidate) => candidate.id === id);
        return spell ? getSpellLevel(spell) === 0 : false;
      }),
    [selectedSpellIds, spells],
  );
  const selectedCantripNames = useMemo(
    () =>
      selectedCantripIds
        .map((id) => spells.find((spell) => spell.id === id)?.name)
        .filter((name): name is string => Boolean(name)),
    [selectedCantripIds, spells],
  );
  const requirementContext = useMemo<RequirementContext>(
    () => ({
      effectiveAbilities,
      selectedRaceId: selectedRace?.race.id,
      selectedRaceName: selectedRace?.race.name,
      selectedSubraceId: selectedSubrace?.id,
      selectedSubraceName: selectedSubrace?.name,
      selectedSizeIds,
      selectedClassIds: draft.classEntries.map((entry) => entry.classId).filter(Boolean),
      selectedClassNames: classRecordsByEntry.flatMap((record) => (record ? [record.class.name] : [])),
      selectedFeatureIds: [
        ...selectedSubclassIds,
        ...selectedRacialTraitIds,
        ...selectedBackgroundFeatureIds,
        ...selectedClassFeatureIds,
        ...selectedFeatFeatureIds,
      ],
      selectedFeatureNames: [
        ...selectedSubclassNames,
        ...selectedRacialTraitNames,
        ...selectedBackgroundFeatureNames,
        ...selectedClassFeatureNames,
        ...selectedFeatFeatureNames,
      ],
      selectedProficiencyIds: selectedBaseProficiencyIds,
      selectedProficiencyNames: selectedBaseProficiencyIds.map(humanizeGrantedId),
      selectedLanguageIds: selectedBaseLanguageIds,
      selectedLanguageNames: selectedBaseLanguageIds.map(humanizeGrantedId),
      selectedFeatIds: selectedFeatElements.map((feat) => feat.id),
      selectedFeatNames: selectedFeatElements.map((feat) => feat.name),
      selectedSpellIds,
      selectedSpellNames,
      selectedCantripIds,
      selectedCantripNames,
      hasSpellcasting: spellGroups.length > 0 || selectedFeatElements.some((feat) => Boolean(feat.spellcasting)),
      totalLevel: totalCharacterLevel,
      classLevelsByName: Object.fromEntries(
        classRecordsByEntry.flatMap((record, index) => {
          const entry = draft.classEntries[index];
          return record && entry?.classId ? [[record.class.name.trim().toLowerCase(), entry.level] as const] : [];
        }),
      ),
      knownRaceNames: races.map((entry) => entry.race.name),
      knownSubraceNames: races.flatMap((entry) => entry.subraces.map((subrace) => subrace.name)),
      knownClassNames: classes.map((entry) => entry.class.name),
    }),
    [
      classRecordsByEntry,
      classes,
      draft.classEntries,
      effectiveAbilities,
      races,
      selectedBackgroundFeatureIds,
      selectedBackgroundFeatureNames,
      selectedClassFeatureIds,
      selectedClassFeatureNames,
      selectedBaseLanguageIds,
      selectedBaseProficiencyIds,
      selectedFeatElements,
      selectedFeatFeatureIds,
      selectedFeatFeatureNames,
      selectedCantripIds,
      selectedCantripNames,
      selectedSpellIds,
      selectedSpellNames,
      selectedRace,
      selectedRacialTraitIds,
      selectedRacialTraitNames,
      selectedSubrace,
      selectedSizeIds,
      selectedSubclassIds,
      selectedSubclassNames,
      spellGroups.length,
      totalCharacterLevel,
    ],
  );
  const progressionGroups = useMemo(
    () =>
      deriveProgressionChoiceGroups({
        activeClassRecords: classRecordsByEntry,
        activeBackground: selectedBackground ?? null,
        activeFeats: selectedFeatElements,
        activeRace: selectedRace ?? null,
        classEntries: draft.classEntries,
        feats,
        progressionElements,
        selectedSubrace: selectedSubrace ?? null,
        selections: draft.progressionSelections,
        spells,
        context: requirementContext,
      }),
    [
      classRecordsByEntry,
      draft.classEntries,
      draft.progressionSelections,
      feats,
      progressionElements,
      requirementContext,
      selectedBackground,
      selectedFeatElements,
      selectedRace,
      selectedSubrace,
      spells,
    ],
  );
  const selectedProgressionElements = useMemo(
    () => getSelectedProgressionOptionElements(progressionGroups, draft.progressionSelections),
    [draft.progressionSelections, progressionGroups],
  );
  const selectedProficiencyIds = useMemo(
    () => [
      ...selectedBaseProficiencyIds,
      ...selectedProgressionElements.flatMap((element) =>
        element.type === "Proficiency" ? [element.id] : collectGrantedIds(element.rules, "Proficiency"),
      ),
    ],
    [selectedBaseProficiencyIds, selectedProgressionElements],
  );
  const selectedProficiencyNames = useMemo(
    () =>
      selectedProgressionElements
        .filter((element) => element.type === "Proficiency")
        .map((element) => element.name),
    [selectedProgressionElements],
  );
  const selectedLanguageIds = useMemo(
    () => [
      ...selectedBaseLanguageIds,
      ...selectedProgressionElements.flatMap((element) =>
        element.type === "Language" ? [element.id] : collectGrantedIds(element.rules, "Language"),
      ),
    ],
    [selectedBaseLanguageIds, selectedProgressionElements],
  );
  const selectedLanguageNames = useMemo(
    () =>
      selectedProgressionElements
        .filter((element) => element.type === "Language")
        .map((element) => element.name),
    [selectedProgressionElements],
  );
  const progressionValidationMessages = useMemo(
    () => getProgressionValidationMessages(progressionGroups, draft.progressionSelections),
    [draft.progressionSelections, progressionGroups],
  );
  const featPrerequisiteFailuresById = useMemo(() => {
    const selectedFeatNames = Object.values(draft.improvementSelections)
      .filter((selection) => selection.mode === "feat" && selection.featName)
      .map((selection) => selection.featName as string);
    const selectedFeatIds = Object.values(draft.improvementSelections)
      .filter((selection) => selection.mode === "feat" && selection.featId)
      .map((selection) => selection.featId);
    const selectedFeatFeatureIds = selectedFeatIds.flatMap((featId) => {
      const feat = feats.find((candidate) => candidate.id === featId);
      return feat ? collectGrantedIds(feat.rules, "Feat Feature") : [];
    });
    const classLevelsByName = Object.fromEntries(
      classRecordsByEntry
        .flatMap((record, index) => {
          const entry = draft.classEntries[index];
          return record && entry?.classId
            ? [[record.class.name.trim().toLowerCase(), entry.level] as const]
            : [];
        }),
    );

    return Object.fromEntries(
      feats.map((feat) => [
        feat.id,
        getFeatPrerequisiteFailures(feat, {
          effectiveAbilities,
          selectedRaceId: selectedRace?.race.id,
          selectedRaceName: selectedRace?.race.name,
          selectedSubraceId: selectedSubrace?.id,
          selectedSubraceName: selectedSubrace?.name,
          selectedSizeIds,
          selectedClassIds: draft.classEntries.map((entry) => entry.classId).filter(Boolean),
          selectedClassNames: classRecordsByEntry.flatMap((record) => (record ? [record.class.name] : [])),
          selectedFeatureIds: [
            ...selectedSubclassIds,
            ...selectedRacialTraitIds,
            ...selectedBackgroundFeatureIds,
            ...selectedClassFeatureIds,
            ...selectedFeatFeatureIds,
            ...selectedProgressionElements.map((element) => element.id),
          ],
          selectedFeatureNames: [
            ...selectedSubclassNames,
            ...selectedRacialTraitNames,
            ...selectedBackgroundFeatureNames,
            ...selectedClassFeatureNames,
            ...selectedProgressionElements.map((element) => element.name),
          ],
          selectedProficiencyIds,
          selectedProficiencyNames,
          selectedLanguageIds,
          selectedLanguageNames,
          selectedFeatIds,
          selectedFeatNames,
          selectedSpellIds,
          selectedSpellNames,
          selectedCantripIds,
          selectedCantripNames,
          hasSpellcasting: spellGroups.length > 0,
          totalLevel: totalCharacterLevel,
          classLevelsByName,
          knownRaceNames: races.map((entry) => entry.race.name),
          knownSubraceNames: races.flatMap((entry) => entry.subraces.map((subrace) => subrace.name)),
          knownClassNames: classes.map((entry) => entry.class.name),
        }),
      ]),
    ) as Record<string, string[]>;
  }, [
    classes,
    classRecordsByEntry,
    draft.improvementSelections,
    draft.classEntries,
    effectiveAbilities,
    feats,
    races,
    selectedBackgroundFeatureIds,
    selectedBackgroundFeatureNames,
    selectedClassFeatureIds,
    selectedRacialTraitIds,
    selectedRacialTraitNames,
    selectedRace,
    selectedSizeIds,
    selectedSubrace,
    selectedSubclassIds,
    selectedSubclassNames,
    selectedClassFeatureNames,
    selectedLanguageNames,
    selectedProgressionElements,
    selectedProficiencyNames,
    selectedProficiencyIds,
    selectedCantripIds,
    selectedCantripNames,
    selectedSpellIds,
    selectedSpellNames,
    selectedLanguageIds,
    spellGroups.length,
    totalCharacterLevel,
  ]);

  const abilityValidationMessage = useMemo(() => getAbilityValidationMessage(draft), [draft]);
  const levelingValidationMessage = useMemo(() => {
    if (draft.classEntries.slice(1).some((entry) => entry.level < 1)) {
      return "Every multiclass slot must keep at least one level.";
    }

    const multiclassLevelTotal = draft.classEntries
      .slice(1)
      .reduce((sum, entry) => sum + entry.level, 0);

    if (multiclassLevelTotal >= draft.level) {
      return "Leave at least 1 level for the primary class after multiclass levels are assigned.";
    }

    return "";
  }, [draft.classEntries, draft.level]);
  const multiclassValidationMessages = useMemo(() => {
    return draft.classEntries.flatMap((entry, index) => {
      if (index === 0 || !entry.classId) {
        return [];
      }

      const classRecord = classRecordsByEntry[index];
      const failures = getMulticlassRequirementFailures(classRecord?.class.multiclass?.requirements, effectiveAbilities);

      if (!failures.length) {
        return [];
      }

      const requirementsText =
        classRecord?.class.multiclass?.requirementsDescription ??
        failures
          .map((failure) => `${failure.ability.toUpperCase()} ${failure.minimum}`)
          .join(" and ");

      return [`${classRecord?.class.name ?? "This class"} requires ${requirementsText} for multiclassing.`];
    });
  }, [classRecordsByEntry, draft.classEntries, effectiveAbilities]);
  const improvementValidationMessages = useMemo(
    () =>
      getImprovementValidationMessages(
        improvementOpportunities,
        draft.improvementSelections,
        availableFeatIds,
        featPrerequisiteFailuresById,
      ),
    [availableFeatIds, draft.improvementSelections, featPrerequisiteFailuresById, improvementOpportunities],
  );
  const spellValidationMessages = useMemo(
    () => getSpellValidationMessages(spellGroups, draft.spellSelections),
    [draft.spellSelections, spellGroups],
  );
  const pendingChoices = useMemo(() => {
    const subracePending = selectedRace && selectedRace.subraces.length > 0 && !draft.subraceId ? 1 : 0;
    const subclassPending = classRecordsByEntry.reduce((count, record, index) => {
      const step = record?.subclassSteps[0];
      const entry = draft.classEntries[index];
      if (!step || !entry) {
        return count;
      }

      const unlocked = !step.level || entry.level >= step.level;
      return count + (unlocked && !entry.subclassId ? 1 : 0);
    }, 0);

    return (
      subracePending +
      subclassPending +
      missingEquipmentChoices +
      improvementValidationMessages.length +
      progressionValidationMessages.length +
      spellValidationMessages.length
    );
  }, [
    classRecordsByEntry,
    draft.classEntries,
    draft.subraceId,
    improvementValidationMessages.length,
    missingEquipmentChoices,
    selectedRace,
    progressionValidationMessages.length,
    spellValidationMessages.length,
  ]);
  const selectionValidationMessage =
    selectedRace?.subraces.length && !draft.subraceId
      ? "Choose a subrace before saving this draft."
      : levelingValidationMessage
        ? levelingValidationMessage
      : draft.classEntries.some((entry) => !entry.classId)
        ? "Choose a class for every declared class slot before saving this draft."
      : multiclassValidationMessages[0]
        ? multiclassValidationMessages[0]
      : classRecordsByEntry.some((record, index) => {
            const step = record?.subclassSteps[0];
            const entry = draft.classEntries[index];
            return Boolean(step && entry && (!step.level || entry.level >= step.level) && !entry.subclassId);
          })
        ? "Choose every unlocked subclass before saving this draft."
      : progressionValidationMessages[0]
        ? progressionValidationMessages[0]
      : improvementValidationMessages[0]
        ? improvementValidationMessages[0]
      : spellValidationMessages[0]
        ? spellValidationMessages[0]
      : missingEquipmentChoices
          ? `Finish the remaining starting equipment choices before saving this draft.`
      : "";
  const saveValidationMessage = abilityValidationMessage || selectionValidationMessage;

  const raceItems = useMemo(() => buildRaceCatalogItems(races), [races]);
  const subraceItems = useMemo(() => buildSubraceCatalogItems(selectedRace), [selectedRace]);
  const classItems = useMemo(() => buildClassCatalogItems(classes), [classes]);
  const backgroundItems = useMemo(() => buildBackgroundCatalogItems(backgrounds), [backgrounds]);
  const completionChecklist = useMemo(
    () =>
      buildCompletionChecklist(draft, {
        needsSubrace: Boolean(selectedRace?.subraces.length),
        needsSubclass: classRecordsByEntry.some((record, index) => {
          const step = record?.subclassSteps[0];
          const entry = draft.classEntries[index];
          return Boolean(step && entry && (!step.level || entry.level >= step.level));
        }),
        subclassesComplete: classRecordsByEntry.every((record, index) => {
          const step = record?.subclassSteps[0];
          const entry = draft.classEntries[index];
          if (!step || !entry || (step.level && entry.level < step.level)) {
            return true;
          }
          return Boolean(entry.subclassId);
        }),
        progressionValidationMessages,
        abilityValidationMessage,
        improvementValidationMessages,
        spellSelectionEnabled: spellGroups.length > 0,
        spellValidationMessages,
        missingEquipmentChoices,
        levelingValidationMessage,
      }),
    [abilityValidationMessage, classRecordsByEntry, draft, improvementValidationMessages, levelingValidationMessage, missingEquipmentChoices, progressionValidationMessages, selectedRace, spellGroups.length, spellValidationMessages],
  );

  const steps = useMemo<BuilderStep[]>(() => {
    const base: BuilderStep[] = [
      {
        id: "foundation",
        kind: "foundation",
        label: "Foundation",
        description: "Set identity, abilities, total level, and only the extra multiclass levels first.",
      },
      {
        id: "race",
        kind: "race",
        label: "Race",
        description: "Choose ancestry, compare traits, and see the immediate build impact.",
      },
    ];

    if (selectedRace?.subraces.length) {
      base.push({
        kind: "subrace",
        id: "subrace",
        label: "Subrace",
        description: "Refine the race choice with its branching traits and bonus changes.",
      });
    }

    base.push(
      {
        id: "class",
        kind: "class",
        label: "Class",
        description: "Assign the primary and multiclass tracks, then check multiclass requirements before moving on.",
      },
      ...(unlockedSubclassEntryIndexes.length
        ? [
            {
              id: "subclass",
              kind: "subclass" as const,
              label: "Subclass",
              description: "Resolve subclass choices across every class track that exposes one.",
            },
          ]
        : []),
      ...(progressionGroups.length
        ? [
            {
              id: "progression",
              kind: "progression" as const,
              label: "Choices",
              description: "Resolve invocations, disciplines, proficiencies, fighting styles, and other unlocked nested families.",
            },
          ]
        : []),
      {
        id: "background",
        kind: "background",
        label: "Background",
        description: "Choose the story scaffold that grants proficiencies, features, and choices.",
      },
      {
        id: "feats",
        kind: "feats",
        label: "Feats / ASI",
        description: "Resolve every unlocked class-based improvement opportunity before gear and review.",
      },
      ...(spellGroups.length
        ? [
            {
              id: "spellcasting",
              kind: "spellcasting" as const,
              label: "Spellcasting",
              description: "Pick cantrips, spellbook entries, prepared spells, and other spell grants from the current build.",
            },
          ]
        : []),
      {
        id: "equipment",
        kind: "equipment",
        label: "Equipment",
        description: "Choose starting gear packages and auto-add the fixed gear from class and background.",
      },
      {
        id: "backstory",
        kind: "backstory",
        label: "Backstory",
        description: "Write ideals, flaws, allies, and history in freeform notes instead of forcing table-roll lists.",
      },
      {
        id: "review",
        kind: "review",
        label: "Review",
        description: "Confirm the build summary and save the draft once everything looks right.",
      },
    );

    return base;
  }, [progressionGroups.length, selectedRace, spellGroups.length, unlockedSubclassEntryIndexes.length]);

  const currentStepIndex = Math.max(
    steps.findIndex((step) => step.id === currentStep),
    0,
  );
  const activeStep = steps[currentStepIndex] ?? steps[0];
  const previousStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;
  const nextStep = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  useEffect(() => {
    if (!steps.some((step) => step.id === currentStep)) {
      setCurrentStep(steps[0]?.id ?? "foundation");
    }
  }, [currentStep, steps]);

  useEffect(() => {
    setShowNavigationWarnings(false);
  }, [currentStep]);

  useEffect(() => {
    if (activeClassEntryIndex >= draft.classEntries.length) {
      setActiveClassEntryIndex(Math.max(0, draft.classEntries.length - 1));
    }
  }, [activeClassEntryIndex, draft.classEntries.length]);

  useEffect(() => {
    if (currentStep !== "subclass" || !unlockedSubclassEntryIndexes.length) {
      return;
    }

    if (!unlockedSubclassEntryIndexes.includes(activeClassEntryIndex)) {
      setActiveClassEntryIndex(unlockedSubclassEntryIndexes[0]);
    }
  }, [activeClassEntryIndex, currentStep, unlockedSubclassEntryIndexes]);

  useEffect(() => {
    const validGroupIds = new Set(progressionGroups.map((group) => group.id));
    const validOptionIds = new Map(
      progressionGroups.map((group) => [
        group.id,
        new Set(
          group.options
            .filter((option) => option.requirementFailures.length === 0)
            .map((option) => option.element.id),
        ),
      ]),
    );
    const hasStaleSelections = Object.entries(draft.progressionSelections).some(([groupId, optionIds]) => {
      if (!validGroupIds.has(groupId)) {
        return true;
      }

      const allowed = validOptionIds.get(groupId);
      return (optionIds ?? []).some((optionId) => !allowed?.has(optionId));
    });

    if (!hasStaleSelections) {
      return;
    }

    const nextSelections = Object.fromEntries(
      Object.entries(draft.progressionSelections)
        .filter(([groupId]) => validGroupIds.has(groupId))
        .map(([groupId, optionIds]) => [
          groupId,
          (optionIds ?? []).filter((optionId) => validOptionIds.get(groupId)?.has(optionId)),
        ]),
    );

    setDraft((current) => ({
      ...current,
      progressionSelections: nextSelections,
    }));
  }, [draft.progressionSelections, progressionGroups]);

  useEffect(() => {
    const validIds = new Set(improvementOpportunities.map((opportunity) => opportunity.id));
    const hasStaleSelections = Object.keys(draft.improvementSelections).some((key) => !validIds.has(key));

    if (!hasStaleSelections) {
      return;
    }

    const nextSelections = Object.fromEntries(
      Object.entries(draft.improvementSelections).filter(([key]) => validIds.has(key)),
    );

    setDraft((current) => ({
      ...current,
      improvementSelections: nextSelections,
    }));
  }, [draft.improvementSelections, improvementOpportunities]);

  useEffect(() => {
    const validGroupIds = new Set(spellGroups.map((group) => group.id));
    const validSpellIds = new Map(
      spellGroups.map((group) => [group.id, new Set([...group.availableSpellIds, ...group.grantedSpellIds])]),
    );
    const hasStaleSelections = Object.entries(draft.spellSelections).some(([groupId, spellIds]) => {
      if (!validGroupIds.has(groupId)) {
        return true;
      }

      const allowed = validSpellIds.get(groupId);
      return (spellIds ?? []).some((spellId) => !allowed?.has(spellId));
    });

    if (!hasStaleSelections) {
      return;
    }

    const nextSelections = Object.fromEntries(
      Object.entries(draft.spellSelections)
        .filter(([groupId]) => validGroupIds.has(groupId))
        .map(([groupId, spellIds]) => [
          groupId,
          (spellIds ?? []).filter((spellId) => validSpellIds.get(groupId)?.has(spellId)),
        ]),
    );

    setDraft((current) => ({
      ...current,
      spellSelections: nextSelections,
    }));
  }, [draft.spellSelections, spellGroups]);

  function updateDraft(patch: Partial<CharacterDraft>) {
    if (status) {
      setStatus("");
    }
    setStatusTone("success");

    setDraft((current) => {
      const nextDraft = { ...current, ...patch };

      if (patch.level !== undefined || patch.classEntries !== undefined) {
        nextDraft.classEntries = rebalanceClassEntries(
          nextDraft.level,
          patch.classEntries ?? current.classEntries,
        );
      }

      return nextDraft;
    });
  }

  async function handleSave() {
    if (saveValidationMessage) {
      setStatusTone("error");
      setStatus(saveValidationMessage);
      return;
    }

    const name = draft.name.trim() || "Untitled Adventurer";
    const nextDraft = {
      ...draft,
      name,
      subraceId: selectedRace?.subraces.length ? draft.subraceId : "",
      classEntries: draft.classEntries.map((entry, index) => ({
        ...entry,
        subclassId: (() => {
          const classRecord = classRecordsByEntry[index];
          const subclassStep = classRecord?.subclassSteps[0];
          const unlocked = Boolean(subclassStep && (!subclassStep.level || entry.level >= subclassStep.level));
          return unlocked ? entry.subclassId : "";
        })(),
      })),
      level: totalCharacterLevel || draft.level,
      updatedAt: new Date().toISOString(),
    };

    setIsSaving(true);
    saveCharacterDraft(nextDraft);
    const savedRemote = await saveRemoteCharacterDraft(nextDraft);
    setDraft(nextDraft);
    setStatusTone("success");
    setStatus(savedRemote ? "Draft saved locally and to your account." : "Draft saved locally.");
    setIsSaving(false);
    router.push(`/builder/${nextDraft.id}`);
    router.refresh();
  }

  const canSave = Boolean(
    draft.raceId && primaryClassEntry?.classId && draft.backgroundId && !saveValidationMessage,
  );

  const getStepWarnings = useCallback((step: BuilderStep) => {
    switch (step.kind) {
      case "foundation":
        return [
          !draft.name.trim() ? "Enter a character name before continuing." : "",
          abilityValidationMessage,
          levelingValidationMessage,
        ].filter(Boolean);
      case "race":
        return [];
      case "subrace":
        return selectedRace?.subraces.length && !draft.subraceId
          ? ["Choose a subrace to continue."]
          : [];
      case "class": {
        const warnings = [...multiclassValidationMessages];

        if (draft.classEntries.some((entry) => !entry.classId)) {
          warnings.push("Choose a class for every declared class track before continuing.");
        }

        return warnings;
      }
      case "subclass": {
        if (!unlockedSubclassEntryIndexes.length) {
          return [];
        }
        const warnings = unlockedSubclassEntryIndexes
          .filter((index) => !draft.classEntries[index]?.subclassId)
          .map((index) => {
            const className = classRecordsByEntry[index]?.class.name ?? `Class ${index + 1}`;
            return `Choose a subclass for ${className} before continuing.`;
          });

        if (!warnings.length && activeClassEntryIndex !== 0) {
          const activeRecord = classRecordsByEntry[activeClassEntryIndex];
          const activeSubclassStep = activeRecord?.subclassSteps[0];
          const activeEntry = draft.classEntries[activeClassEntryIndex];
          if (activeRecord && activeSubclassStep && activeEntry && activeSubclassStep.level && activeEntry.level < activeSubclassStep.level) {
            warnings.push(
              `${activeRecord.class.name} subclass normally unlocks at class level ${activeSubclassStep.level}.`,
            );
          }
        }

        return warnings;
      }
      case "background":
        return draft.backgroundId ? [] : ["Choose a background to continue."];
      case "backstory":
        return [];
      case "progression":
        return progressionValidationMessages;
      case "feats":
        return improvementValidationMessages;
      case "spellcasting":
        return spellValidationMessages;
      case "equipment":
        return missingEquipmentChoices
          ? [
              `Finish the remaining ${missingEquipmentChoices} starting equipment choice${
                missingEquipmentChoices === 1 ? "" : "s"
              } before continuing.`,
            ]
          : [];
      case "review":
        return saveValidationMessage ? [saveValidationMessage] : [];
      default:
        return [];
    }
  }, [
    abilityValidationMessage,
    activeClassEntryIndex,
    classRecordsByEntry,
    draft.backgroundId,
    draft.classEntries,
    draft.name,
    draft.subraceId,
    improvementValidationMessages,
    levelingValidationMessage,
    missingEquipmentChoices,
    multiclassValidationMessages,
    progressionValidationMessages,
    saveValidationMessage,
    selectedRace,
    spellValidationMessages,
    unlockedSubclassEntryIndexes,
  ]);

  const currentStepWarnings = useMemo(() => getStepWarnings(activeStep), [activeStep, getStepWarnings]);

  const unresolvedStepWarnings = useMemo(
    () =>
      steps
        .filter((step) => step.id !== activeStep.id)
        .flatMap((step) =>
          getStepWarnings(step).map((warning) => ({
            step: step.label,
            message: warning,
          })),
        ),
    [activeStep.id, getStepWarnings, steps],
  );

  const navigationWarnings = useMemo(() => {
    if (currentStepWarnings.length) {
      return currentStepWarnings;
    }

    return unresolvedStepWarnings.map(({ step, message }) => `${step}: ${message}`);
  }, [currentStepWarnings, unresolvedStepWarnings]);

  const canAdvance = (() => {
    switch (activeStep.kind) {
      case "foundation":
        return Boolean(draft.name.trim()) && !abilityValidationMessage && !levelingValidationMessage;
      case "race":
        return Boolean(draft.raceId);
      case "subrace":
        return selectedRace?.subraces.length ? Boolean(draft.subraceId) : true;
      case "class":
        return draft.classEntries.every((entry) => Boolean(entry.classId));
      case "subclass": {
        return unlockedSubclassEntryIndexes.every((index) => Boolean(draft.classEntries[index]?.subclassId));
      }
      case "background":
        return Boolean(draft.backgroundId);
      case "backstory":
        return true;
      case "progression":
        return progressionValidationMessages.length === 0;
      case "feats":
        return improvementValidationMessages.length === 0;
      case "spellcasting":
        return spellValidationMessages.length === 0;
      case "equipment":
        return missingEquipmentChoices === 0;
      case "review":
        return canSave;
      default:
        return true;
    }
  })();

  function isStepComplete(step: BuilderStep) {
    switch (step.kind) {
      case "foundation":
        return Boolean(draft.name.trim() || draft.playerName.trim()) && !abilityValidationMessage && !levelingValidationMessage;
      case "race":
        return Boolean(draft.raceId);
      case "subrace":
        return !selectedRace?.subraces.length || Boolean(draft.subraceId);
      case "class":
        return draft.classEntries.every((entry) => Boolean(entry.classId));
      case "subclass": {
        return unlockedSubclassEntryIndexes.every((index) => Boolean(draft.classEntries[index]?.subclassId));
      }
      case "background":
        return Boolean(draft.backgroundId);
      case "backstory":
        return true;
      case "progression":
        return progressionValidationMessages.length === 0;
      case "feats":
        return improvementValidationMessages.length === 0;
      case "spellcasting":
        return spellValidationMessages.length === 0;
      case "equipment":
        return missingEquipmentChoices === 0;
      case "review":
        return canSave;
      default:
        return false;
    }
  }

  const firstBlockedIndex = steps.findIndex((step) => !isStepComplete(step));
  const furthestUnlockedIndex =
    firstBlockedIndex === -1 ? steps.length - 1 : Math.min(firstBlockedIndex + 1, steps.length - 1);

  useEffect(() => {
    const activeIndex = steps.findIndex((step) => step.id === currentStep);
    if (activeIndex > furthestUnlockedIndex) {
      setCurrentStep(steps[furthestUnlockedIndex]?.id ?? "foundation");
    }
  }, [currentStep, furthestUnlockedIndex, steps]);

  function renderStepBody() {
    switch (activeStep.kind) {
      case "foundation":
        return (
          <section className="builder-stepPanel">
            <div className="builder-stepPanel__intro">
              <span className="route-shell__tag">Step 1</span>
              <h2 className="route-shell__title">Frame the character before the rules branch</h2>
              <p className="route-shell__copy">
                Set identity, ability scores, total level, and optional multiclass slots first. The primary class automatically receives the remaining levels after those extra tracks are allocated.
              </p>
            </div>

            <div className="builder-panel__fields">
              <label className="builder-field">
                <span>Name</span>
                <input
                  className="input"
                  value={draft.name}
                  onChange={(event) => updateDraft({ name: event.target.value })}
                  placeholder="Alyra Dawnshield"
                />
              </label>
              <label className="builder-field">
                <span>Player</span>
                <input
                  className="input"
                  value={draft.playerName}
                  onChange={(event) => updateDraft({ playerName: event.target.value })}
                  placeholder="Max"
                />
              </label>
            </div>
            <article className="builder-panel builder-panel--compact">
              <div className="builder-panel__headerRow">
                <div>
                  <span className="builder-panel__label">Origin rules</span>
                  <strong className="builder-summary__name">Ability score customization</strong>
                </div>
                <button
                  className={`button button--secondary button--compact${draft.useTashasCustomizedOrigin ? " ability-mode__tab--active" : ""}`}
                  type="button"
                  onClick={() =>
                    updateDraft({
                      useTashasCustomizedOrigin: !draft.useTashasCustomizedOrigin,
                      improvementSelections: Object.fromEntries(
                        Object.entries(draft.improvementSelections).filter(([id]) => {
                          const opportunity = improvementOpportunities.find((candidate) => candidate.id === id);
                          return opportunity?.sourceType !== "ancestry";
                        }),
                      ),
                    })
                  }
                >
                  {draft.useTashasCustomizedOrigin ? "Using Tasha's" : "Legacy ancestry bonuses"}
                </button>
              </div>
              <p className="builder-summary__meta">
                When enabled, ancestry ability increases are reassigned in Feats / ASI using Tasha&apos;s customized origin rule.
              </p>
            </article>
            <AbilityScoreEditor
              abilities={draft.abilities}
              mode={draft.abilityMode}
              onAbilitiesChange={(abilities) => updateDraft({ abilities })}
              onModeChange={(abilityMode, abilities) => updateDraft({ abilityMode, abilities })}
              appliedBonuses={totalAppliedBonuses}
              bonusBreakdown={abilityBonusBreakdown}
              validationMessage={abilityValidationMessage}
            />
            <LevelingStep
              entries={draft.classEntries}
              totalLevel={draft.level}
              primaryLevel={primaryClassLevel}
              onTotalLevelChange={(level) => {
                const nextLevel = Math.max(1, Math.min(20, Math.floor(level || 1)));
                const nextEntries = [...draft.classEntries];
                const extraEntries = nextEntries.slice(1);
                const extraLevelTotal = extraEntries.reduce((sum, entry) => sum + entry.level, 0);

                if (extraLevelTotal >= nextLevel) {
                  let overflow = extraLevelTotal - (nextLevel - 1);

                  for (let index = nextEntries.length - 1; index >= 1 && overflow > 0; index -= 1) {
                    const reducible = Math.max(0, nextEntries[index].level - 1);
                    const reduction = Math.min(reducible, overflow);
                    nextEntries[index] = {
                      ...nextEntries[index],
                      level: nextEntries[index].level - reduction,
                    };
                    overflow -= reduction;
                  }
                }

                updateDraft({ level: nextLevel, classEntries: nextEntries });
              }}
              onEntryLevelChange={(index, level) => {
                const nextEntries = draft.classEntries.map((entry, entryIndex) =>
                  entryIndex === index
                    ? { ...entry, level: Math.max(1, Math.min(20, Math.floor(level || 1))) }
                    : entry,
                );

                updateDraft({ classEntries: nextEntries });
              }}
              onAddClassSlot={() => {
                const nextEntries = [...draft.classEntries];
                updateDraft({
                  classEntries: [...nextEntries, { classId: "", subclassId: "", level: 1 }],
                });
              }}
              onRemoveClassSlot={(index) => {
                const removed = draft.classEntries[index];
                if (!removed || index === 0) {
                  return;
                }

                const nextEntries = draft.classEntries.filter((_, entryIndex) => entryIndex !== index);

                updateDraft({
                  classEntries: nextEntries,
                });
              }}
            />
            {levelingValidationMessage ? (
              <p className="auth-card__status auth-card__status--error">{levelingValidationMessage}</p>
            ) : null}
          </section>
        );
      case "race":
        return (
          <section className="builder-stepPanel">
            <div className="builder-stepPanel__intro">
              <span className="route-shell__tag">Step 1</span>
              <h2 className="route-shell__title">Pick a race with the consequences visible</h2>
              <p className="route-shell__copy">
                Use the filters to narrow the library, scan fast in the center list, and use the right panel to see the traits,
                bonuses, and future subrace consequences before committing.
              </p>
            </div>
            <CatalogSelector
              items={raceItems}
              label="Race"
              onSelect={(id) => {
                const nextRace = races.find((entry) => entry.race.id === id);
                updateDraft({
                  raceId: id,
                  subraceId: nextRace?.subraces.length === 1 ? nextRace.subraces[0].id : "",
                });
              }}
              selectedId={draft.raceId}
            />
          </section>
        );
      case "subrace":
        return (
          <section className="builder-stepPanel">
            <div className="builder-stepPanel__intro">
              <span className="route-shell__tag">Step 2</span>
              <h2 className="route-shell__title">Refine the race choice with a subrace</h2>
              <p className="route-shell__copy">
                The subrace workbench shows exactly which extra traits and bonus changes the branch adds to the selected race.
              </p>
            </div>
            {selectedRace ? (
              <CatalogSelector
                items={subraceItems}
                label="Subrace"
                onSelect={(id) => updateDraft({ subraceId: id })}
                selectedId={draft.subraceId}
              />
            ) : (
              <p className="route-shell__copy">Choose a race first to unlock subrace options.</p>
            )}
          </section>
        );
      case "class":
        return (
          <section className="builder-stepPanel">
            <div className="builder-stepPanel__intro">
              <span className="route-shell__tag">Class</span>
              <h2 className="route-shell__title">Assign each class slot against the level plan</h2>
              <p className="route-shell__copy">
                The level plan decides how many class tracks exist. Here you choose the class for each track and see multiclass requirement warnings before saving.
              </p>
            </div>
            <div className="builder-classSlots">
              {draft.classEntries.map((entry, index) => {
                const classRecord = classRecordsByEntry[index];
                const failures =
                  index > 0
                    ? getMulticlassRequirementFailures(classRecord?.class.multiclass?.requirements, effectiveAbilities)
                    : [];
                return (
                  <button
                    key={`class-slot-picker-${index}`}
                    className={`builder-classSlot${index === activeClassEntryIndex ? " builder-classSlot--active" : ""}${
                      failures.length ? " builder-classSlot--warning" : ""
                    }`}
                    type="button"
                    onClick={() => setActiveClassEntryIndex(index)}
                  >
                    <strong>{index === 0 ? "Primary" : `Multiclass ${index}`}</strong>
                    <span>{classRecord?.class.name ?? "Choose class"}</span>
                    <small>Level {entry.level}</small>
                  </button>
                );
              })}
            </div>
            {activeClassEntry ? (
              <p className="builder-summary__meta">
                Editing {activeClassEntryIndex === 0 ? "Primary class" : `Multiclass ${activeClassEntryIndex}`} at class level {activeClassEntry.level}.
              </p>
            ) : null}
            {multiclassValidationMessages.length ? (
              <div className="builder-warnings">
                {multiclassValidationMessages.map((message) => (
                  <p className="auth-card__status auth-card__status--error" key={message}>
                    {message}
                  </p>
                ))}
              </div>
            ) : null}
            <CatalogSelector
              items={classItems.filter((item) => {
                const usedElsewhere = draft.classEntries.some(
                  (entry, index) => index !== activeClassEntryIndex && entry.classId === item.id,
                );
                return !usedElsewhere;
              })}
              label="Class"
              onSelect={(id) =>
                updateDraft({
                  classEntries: draft.classEntries.map((entry, index) =>
                    index === activeClassEntryIndex
                      ? { ...entry, classId: id, subclassId: "" }
                      : entry,
                  ),
                  equipmentSelections: activeClassEntryIndex === 0 ? {} : draft.equipmentSelections,
                })
              }
              selectedId={activeClassEntry?.classId ?? ""}
            />
          </section>
        );
      case "subclass":
        {
          const subclassEntry = draft.classEntries[activeClassEntryIndex] ?? null;
          const subclassClass = classRecordsByEntry[activeClassEntryIndex] ?? null;
          const subclassStep = subclassClass?.subclassSteps[0] ?? null;
          const subclassItems = buildSubclassCatalogItems(subclassStep);
          const unlocked = Boolean(subclassStep && subclassEntry && (!subclassStep.level || subclassEntry.level >= subclassStep.level));
        return (
          <section className="builder-stepPanel">
            <div className="builder-stepPanel__intro">
              <span className="route-shell__tag">Subclass</span>
              <h2 className="route-shell__title">
                {subclassStep?.label ?? "Resolve subclass choices across the selected class tracks"}
              </h2>
              <p className="route-shell__copy">
                Use the class tabs to switch between subclass-bearing tracks. Save validation only requires subclasses for the tracks that are unlocked at their current class levels.
              </p>
            </div>
            {unlockedSubclassEntryIndexes.length ? (
              <div className="builder-classSlots">
                {unlockedSubclassEntryIndexes.map((index) => {
                  const entry = draft.classEntries[index];
                  const record = classRecordsByEntry[index];
                  const step = record?.subclassSteps[0];
                  const isUnlocked = Boolean(step && entry && (!step.level || entry.level >= step.level));
                  const isSelected = activeClassEntryIndex === index;

                  return (
                    <button
                      key={`subclass-slot-picker-${index}`}
                      className={`builder-classSlot${isSelected ? " builder-classSlot--active" : ""}${
                        isUnlocked && !entry?.subclassId ? " builder-classSlot--warning" : ""
                      }`}
                      type="button"
                      onClick={() => {
                        if (!isUnlocked) {
                          return;
                        }
                        setActiveClassEntryIndex(index);
                      }}
                    >
                      <strong>{index === 0 ? "Primary" : `Multiclass ${index}`}</strong>
                      <span>{record?.class.name ?? "Choose class"}</span>
                      <small>
                        Level {entry?.level ?? 1}
                        {step?.level ? ` · subclass ${entry && entry.level >= step.level ? "unlocked" : `at ${step.level}`}` : ""}
                      </small>
                    </button>
                  );
                })}
              </div>
            ) : null}
            {subclassClass && subclassStep ? (
              subclassStep.options.length ? (
                <CatalogSelector
                  items={subclassItems}
                  label="Subclass"
                  onSelect={(id) => {
                    if (!unlocked) {
                      return;
                    }
                    updateDraft({
                      classEntries: draft.classEntries.map((entry, index) =>
                        index === activeClassEntryIndex ? { ...entry, subclassId: id } : entry,
                      ),
                    });
                  }}
                  selectedId={subclassEntry?.subclassId ?? ""}
                />
              ) : (
                <div className="builder-review__card">
                  <span className="builder-panel__label">Subclass timing</span>
                  <strong className="builder-summary__name">{subclassStep.label}</strong>
                  <p className="builder-summary__meta">{subclassStep.timingLabel}</p>
                  <p className="builder-summary__meta">
                    This class has a subclass choice node, but no subclass options are currently available from built-in or imported content.
                  </p>
                </div>
              )
            ) : (
              <p className="route-shell__copy">Choose a class first to unlock subclass planning.</p>
            )}
            {subclassStep && !unlocked ? (
              <p className="builder-summary__meta">
                This subclass normally unlocks at class level {subclassStep.level ?? 1}. You can inspect it now, but it will not be required for save validation until that class level is reached.
              </p>
            ) : null}
          </section>
        );
      }
      case "background":
        return (
          <section className="builder-stepPanel">
            <div className="builder-stepPanel__intro">
              <span className="route-shell__tag">Background</span>
              <h2 className="route-shell__title">Pick the background that shapes proficiencies and flavor</h2>
              <p className="route-shell__copy">
                The workbench highlights feature grants and pending choice nodes so you can see the practical effect before saving the step.
              </p>
            </div>
            <CatalogSelector
              items={backgroundItems}
              label="Background"
              onSelect={(id) => updateDraft({ backgroundId: id, equipmentSelections: {} })}
              selectedId={draft.backgroundId}
            />
          </section>
        );
      case "backstory":
        return (
          <section className="builder-stepPanel">
            <BackstoryStep
              onChange={(backstory) => updateDraft({ backstory })}
              value={draft.backstory}
            />
          </section>
        );
      case "progression":
        return (
          <section className="builder-stepPanel">
            <ProgressionChoicesStep
              groups={progressionGroups}
              elements={progressionElements}
              selections={draft.progressionSelections}
              onSelectionChange={(groupId, optionIds) =>
                updateDraft({
                  progressionSelections: {
                    ...draft.progressionSelections,
                    [groupId]: optionIds,
                  },
                })
              }
            />
          </section>
        );
      case "feats":
        return (
          <section className="builder-stepPanel">
            <FeatsAsiStep
              effectiveAbilitiesBeforeImprovements={effectiveAbilities}
              featFailuresById={featPrerequisiteFailuresById}
              feats={feats}
              opportunities={improvementOpportunities}
              selections={draft.improvementSelections}
              onSelectionChange={(opportunityId, selection) =>
                updateDraft({
                  improvementSelections: {
                    ...draft.improvementSelections,
                    [opportunityId]: selection,
                  },
                })
              }
            />
          </section>
        );
      case "spellcasting":
        return (
          <section className="builder-stepPanel">
            <SpellcastingStep
              groups={spellGroups}
              selections={draft.spellSelections}
              spells={spells}
              onSelectionChange={(groupId, spellIds) =>
                updateDraft({
                  spellSelections: {
                    ...draft.spellSelections,
                    [groupId]: spellIds,
                  },
                })
              }
            />
          </section>
        );
      case "equipment":
        return (
          <section className="builder-stepPanel">
            <div className="builder-stepPanel__intro">
              <span className="route-shell__tag">Equipment</span>
              <h2 className="route-shell__title">Choose the starting gear package</h2>
              <p className="route-shell__copy">
                This first pass focuses on guided starting equipment: fixed items are auto-added, and package choices are kept explicit
                so the build stays readable.
              </p>
            </div>
            <EquipmentStep
              plan={equipmentPlan}
              selections={draft.equipmentSelections}
              onSelect={(groupId, optionId) =>
                updateDraft({
                  equipmentSelections: {
                    ...draft.equipmentSelections,
                    [groupId]: optionId,
                  },
                })}
            />
          </section>
        );
      case "review":
        return (
          <section className="builder-stepPanel builder-review">
            <div className="builder-stepPanel__intro">
              <span className="route-shell__tag">Review</span>
              <h2 className="route-shell__title">Finalize the draft with a real readiness check</h2>
              <p className="route-shell__copy">
                Review should feel like the finish surface, not a blank summary. This pass checks what is complete, what still needs attention,
                and whether the draft is ready to save.
              </p>
            </div>

            <div className="builder-review__layout">
              <article className="builder-review__card builder-review__card--summary">
                <span className="builder-panel__label">Readiness</span>
                <strong className="builder-summary__name">{canSave ? "Ready to save" : "Needs attention"}</strong>
                <p className="builder-summary__meta">
                  {canSave
                    ? "All required guided selections are in place for this draft shell."
                    : saveValidationMessage || "Complete the missing steps below before saving."}
                </p>
                <ul className="builder-review__checklist">
                  {completionChecklist.map((item) => (
                    <li className={item.done ? "is-complete" : "is-pending"} key={item.label}>
                      <span>{item.done ? "Done" : "Pending"}</span>
                      <strong>{item.label}</strong>
                    </li>
                  ))}
                </ul>
              </article>

              <div className="builder-review__stack">
                <article className="builder-review__card">
                  <span className="builder-panel__label">Identity</span>
                  <strong className="builder-summary__name">{draft.name || "Untitled Adventurer"}</strong>
                  <p className="builder-summary__meta">Player: {draft.playerName || "Unassigned"}</p>
                </article>

                <article className="builder-review__card">
                  <span className="builder-panel__label">Selections</span>
                  <p className="builder-summary__meta">Race: {selectedRace?.race.name ?? "Missing"}</p>
                  <p className="builder-summary__meta">Subrace: {selectedSubrace?.name ?? (selectedRace?.subraces.length ? "Missing" : "Not required")}</p>
                  <p className="builder-summary__meta">Primary class: {selectedClass?.class.name ?? "Missing"}</p>
                  <p className="builder-summary__meta">Character level: {draft.level}</p>
                  <p className="builder-summary__meta">
                    Class split:{" "}
                    {draft.classEntries.some((entry) => entry.classId)
                      ? draft.classEntries
                          .flatMap((entry) => {
                            if (!entry.classId) {
                              return [];
                            }
                            const classRecord = classes.find((candidate) => candidate.class.id === entry.classId);
                            return [`${classRecord?.class.name ?? entry.classId} ${entry.level}`];
                          })
                          .join(" / ")
                      : "Missing"}
                  </p>
                  <p className="builder-summary__meta">
                    Subclasses:{" "}
                    {draft.classEntries.some((entry) => entry.classId)
                      ? draft.classEntries
                          .flatMap((entry, index) => {
                            if (!entry.classId) {
                              return [];
                            }
                            const classRecord = classRecordsByEntry[index];
                            const subclassStep = classRecord?.subclassSteps[0];
                            if (!classRecord) {
                              return ["Missing class"];
                            }
                            if (!subclassStep) {
                              return [`${classRecord.class.name}: none`];
                            }
                            if (subclassStep.level && entry.level < subclassStep.level) {
                              return [`${classRecord.class.name}: unlocks at ${subclassStep.level}`];
                            }
                            const selected = subclassStep.options.find((option) => option.archetype.id === entry.subclassId);
                            return [`${classRecord.class.name}: ${selected?.archetype.name ?? "Missing"}`];
                          })
                          .join(" / ")
                      : "No class yet"}
                  </p>
                  <p className="builder-summary__meta">Background: {selectedBackground?.background.name ?? "Missing"}</p>
                  <p className="builder-summary__meta">
                    Backstory notes:{" "}
                    {Object.values(draft.backstory).filter((value) => hasMarkdownContent(value)).length
                      ? `${Object.values(draft.backstory).filter((value) => hasMarkdownContent(value)).length} section${
                          Object.values(draft.backstory).filter((value) => hasMarkdownContent(value)).length === 1 ? "" : "s"
                        } filled`
                      : "None yet"}
                  </p>
                  <p className="builder-summary__meta">
                    Improvements: {improvementOpportunities.length
                      ? improvementValidationMessages.length
                        ? `${improvementOpportunities.length - improvementValidationMessages.length}/${improvementOpportunities.length} resolved`
                        : `${improvementOpportunities.length} resolved`
                      : "None unlocked yet"}
                  </p>
                  <p className="builder-summary__meta">
                    Spellcasting: {spellGroups.length
                      ? spellValidationMessages.length
                        ? `${spellGroups.length - spellValidationMessages.length}/${spellGroups.length} groups resolved`
                        : `${spellGroups.length} groups resolved`
                      : "No spell selections unlocked yet"}
                  </p>
                  <p className="builder-summary__meta">
                    Equipment: {selectedEquipmentItems.length ? `${selectedEquipmentItems.length} starting items selected` : "Missing"}
                  </p>
                </article>
              </div>

              <article className="builder-review__card">
                <span className="builder-panel__label">Build impact</span>
                <p className="builder-summary__meta">
                  Racial bonuses:{" "}
                  {Object.entries(racialBonuses).length
                    ? Object.entries(racialBonuses)
                        .map(([ability, amount]) => `${amount >= 0 ? "+" : ""}${amount} ${ability.toUpperCase()}`)
                        .join(", ")
                    : "None yet"}
                </p>
                <p className="builder-summary__meta">
                  Feats / ASI bonuses:{" "}
                  {Object.values(improvementBonuses).some((amount) => amount > 0)
                    ? ABILITY_KEYS
                        .filter((ability) => improvementBonuses[ability] > 0)
                        .map((ability) => formatAbilityBonus(improvementBonuses[ability], ability))
                        .join(", ")
                    : "None yet"}
                </p>
                <p className="builder-summary__meta">
                  Traits: {selectedRacialTraitNames.length ? selectedRacialTraitNames.join(", ") : "None yet"}
                </p>
                <p className="builder-summary__meta">
                  Subclass timing: {primarySubclassStep?.timingLabel ?? "No subclass step available"}
                </p>
                <p className="builder-summary__meta">Total level: {draft.level}</p>
                <p className="builder-summary__meta">
                  Equipment choices remaining: {missingEquipmentChoices}
                </p>
                <p className="builder-summary__meta">
                  Spell groups pending: {spellValidationMessages.length}
                </p>
                <p className="builder-summary__meta">Pending builder choices: {pendingChoices}</p>
              </article>

              <article className="builder-review__card">
                <span className="builder-panel__label">Feats / ASI</span>
                {improvementOpportunities.length ? (
                  <ul className="route-shell__list">
                    {improvementOpportunities.map((opportunity) => {
                      const selection = draft.improvementSelections[opportunity.id];

                      if (!selection) {
                        return (
                          <li key={opportunity.id}>
                            {opportunity.className} {opportunity.unlockLevel}: pending
                          </li>
                        );
                      }

                      if (selection.mode === "feat") {
                        return (
                          <li key={opportunity.id}>
                            {opportunity.className} {opportunity.unlockLevel}: {selection.featName ?? "Selected feat"}
                          </li>
                        );
                      }

                      const bonusText = ABILITY_KEYS
                        .filter((ability) => (selection.abilityBonuses[ability] ?? 0) > 0)
                        .map((ability) => formatAbilityBonus(selection.abilityBonuses[ability] ?? 0, ability))
                        .join(", ");

                      return (
                        <li key={opportunity.id}>
                          {opportunity.className} {opportunity.unlockLevel}: {bonusText || "pending"}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="builder-summary__meta">No improvements unlocked yet.</p>
                )}
              </article>

              <article className="builder-review__card">
                <span className="builder-panel__label">Starting gear</span>
                {selectedEquipmentItems.length ? (
                  <ul className="equipment-step__itemList">
                    {selectedEquipmentItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="builder-summary__meta">No starting gear selected yet.</p>
                )}
              </article>

              <article className="builder-review__card">
                <span className="builder-panel__label">Backstory</span>
                {Object.entries(draft.backstory).some(([, value]) => hasMarkdownContent(value)) ? (
                  <ul className="route-shell__list">
                    {Object.entries(draft.backstory)
                      .filter(([, value]) => hasMarkdownContent(value))
                      .map(([key, value]) => (
                        <li key={key}>
                          {key === "alliesAndOrganizations"
                            ? "Allies and organizations"
                            : key === "additionalFeatures"
                              ? "Additional features"
                              : key.charAt(0).toUpperCase() + key.slice(1)}
                          : {getMarkdownPreview(value, 100)}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="builder-summary__meta">No backstory notes yet.</p>
                )}
              </article>
            </div>
          </section>
        );
      default:
        return null;
    }
  }

  return (
    <div className="builder-shell">
      <section className="builder-hero">
        <div className="builder-hero__copy">
          <span className="route-shell__tag">Character Builder</span>
          <h2 className="route-shell__title">Build the character in guided steps</h2>
          <p className="route-shell__copy">
            This builder now uses a guided workbench: wizard progression on the outside, structured comparison on the inside.
          </p>
        </div>
        <div className="builder-summary">
          <span className="builder-summary__label">Current draft</span>
          <strong className="builder-summary__name">{draft.name || "Untitled Adventurer"}</strong>
          <p className="builder-summary__meta">
            {selectedRace?.race.name ?? "No race"} / {selectedClass?.class.name ?? "No class"} /{" "}
            {selectedBackground?.background.name ?? "No background"}
          </p>
          <p className="builder-summary__meta">Level {draft.level}</p>
          <p className="builder-summary__meta">Pending builder choices: {pendingChoices}</p>
          <div className="builder-summary__actions">
            <button
              className="button"
              type="button"
              disabled={!canSave || isSaving}
              onClick={handleSave}
            >
              {isSaving ? "Saving..." : "Save draft"}
            </button>
            <Link className="button button--secondary" href="/characters">
              View saved drafts
            </Link>
          </div>
          {status ? (
            <p
              className={`auth-card__status${
                statusTone === "error" ? " auth-card__status--error" : " auth-card__status--success"
              }`}
            >
              {status}
            </p>
          ) : null}
        </div>
      </section>

      <section className="builder-stepper">
        {steps.map((step, index) => {
          const isComplete = isStepComplete(step);
          const isLocked = index > furthestUnlockedIndex;
          const state =
            step.id === activeStep.id
              ? "active"
              : isLocked
                ? "locked"
                : isComplete
                  ? "complete"
                  : "available";

          return (
            <button
              key={step.id}
              className={`builder-stepper__item builder-stepper__item--${state}`}
              type="button"
              disabled={isLocked}
              onClick={() => setCurrentStep(step.id)}
            >
              <span className="builder-stepper__index">{index + 1}</span>
              <span className="builder-stepper__text">
                <strong>{step.label}</strong>
                <span>{step.description}</span>
              </span>
            </button>
          );
        })}
      </section>

      {renderStepBody()}

      <section className="builder-navigation">
        <div className="builder-navigation__meta">
          <span className="builder-panel__label">Current step</span>
          <div className={`builder-navigation__summary${navigationWarnings.length ? " builder-navigation__summary--warning" : ""}`}>
            <strong>{activeStep.label}</strong>
            <p>{activeStep.description}</p>
            {showNavigationWarnings && navigationWarnings.length ? (
              <div className="builder-navigation__warningList">
                {navigationWarnings.map((warning) => (
                  <p className="auth-card__status auth-card__status--error builder-navigation__warningItem" key={warning}>
                    {warning}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="builder-navigation__actions">
          {previousStep ? (
            <button
              className="button button--secondary"
              type="button"
              onClick={() => {
                setShowNavigationWarnings(false);
                setCurrentStep(previousStep.id);
              }}
            >
              Back to {previousStep.label}
            </button>
          ) : null}
          {nextStep ? (
            <button
              className="button"
              type="button"
              onClick={() => {
                const nextStepIndex = steps.findIndex((step) => step.id === nextStep.id);
                const isNextUnlocked = nextStepIndex <= furthestUnlockedIndex;

                if (!canAdvance || !isNextUnlocked) {
                  setShowNavigationWarnings(true);
                  return;
                }

                setShowNavigationWarnings(false);
                setCurrentStep(nextStep.id);
              }}
            >
              Continue to {nextStep.label}
            </button>
          ) : (
            <button
              className="button"
              type="button"
              disabled={!canSave || isSaving}
              onClick={handleSave}
            >
              {isSaving ? "Saving..." : "Save draft"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
