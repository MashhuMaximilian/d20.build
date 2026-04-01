"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AbilityScoreEditor } from "@/components/ability-score-editor";
import { CatalogSelector, type CatalogItem } from "@/components/catalog-selector";
import { EquipmentStep } from "@/components/equipment-step";
import { LevelingStep } from "@/components/leveling-step";
import type { BuiltInBackgroundRecord } from "@/lib/builtins/backgrounds";
import type {
  BuiltInClassRecord,
  BuiltInSubclassStep,
} from "@/lib/builtins/classes";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import type { BuiltInRule } from "@/lib/builtins/types";
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
} from "@/lib/characters/types";
import { saveCharacterDraft } from "@/lib/characters/storage";
import {
  getMissingEquipmentChoiceCount,
  getStartingEquipmentPlan,
  resolveStartingEquipmentItems,
} from "@/lib/equipment/starting-equipment";

type BuilderEditorProps = {
  backgrounds: BuiltInBackgroundRecord[];
  classes: BuiltInClassRecord[];
  initialDraft?: CharacterDraft;
  races: BuiltInRaceRecord[];
};

type BuilderStepId =
  | "foundation"
  | "race"
  | "subrace"
  | "class"
  | "subclass"
  | "background"
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

const REQUIREMENT_ABILITY_MAP: Record<string, AbilityKey> = {
  str: "strength",
  dex: "dexterity",
  con: "constitution",
  int: "intelligence",
  wis: "wisdom",
  cha: "charisma",
};

function getMulticlassRequirementFailures(rulesText: string | undefined, abilities: CharacterDraft["abilities"]) {
  if (!rulesText) {
    return [];
  }

  const clauses = [...rulesText.matchAll(/\[([a-z]+):(\d+)\]/gi)].map((match) => ({
    ability: REQUIREMENT_ABILITY_MAP[match[1].toLowerCase()],
    minimum: Number(match[2]),
  })).filter((entry): entry is { ability: AbilityKey; minimum: number } => Boolean(entry.ability));

  return clauses.filter((entry) => abilities[entry.ability] < entry.minimum);
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
  abilityValidationMessage: string;
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
    { label: "Choose background", done: Boolean(draft.backgroundId) },
    { label: "Finalize abilities", done: !flags.abilityValidationMessage },
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

export function BuilderEditor({
  backgrounds,
  classes,
  initialDraft,
  races,
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
  const selectedBackground = useMemo(
    () => backgrounds.find((entry) => entry.background.id === draft.backgroundId) ?? null,
    [backgrounds, draft.backgroundId],
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
  }, [selectedRace, selectedSubrace]);

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
    const backgroundPending =
      selectedBackground?.background.rules.filter((rule) => rule.kind === "select").length ?? 0;
    const classPending = classRecordsByEntry.reduce((sum, record) => {
      if (!record) {
        return sum;
      }

      return (
        sum +
        record.features.reduce(
          (count, feature) => count + feature.rules.filter((rule) => rule.kind === "select").length,
          record.class.rules.filter((rule) => rule.kind === "select").length,
        )
      );
    }, 0);

    return subracePending + subclassPending + backgroundPending + classPending + missingEquipmentChoices;
  }, [
    classRecordsByEntry,
    draft.classEntries,
    draft.subraceId,
    missingEquipmentChoices,
    selectedBackground,
    selectedRace,
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
      const failures = getMulticlassRequirementFailures(classRecord?.class.multiclass?.requirements, draft.abilities);

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
  }, [classRecordsByEntry, draft.abilities, draft.classEntries]);
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
        abilityValidationMessage,
        missingEquipmentChoices,
        levelingValidationMessage,
      }),
    [abilityValidationMessage, classRecordsByEntry, draft, levelingValidationMessage, missingEquipmentChoices, selectedRace],
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
      ...draft.classEntries.flatMap((entry, index) => {
        const classRecord = classRecordsByEntry[index];
        const subclassStep = classRecord?.subclassSteps[0];

        if (!classRecord || !subclassStep) {
          return [];
        }

        return [
          {
            id: `subclass-${index}`,
            kind: "subclass" as const,
            classEntryIndex: index,
            label: `${classRecord.class.name} subclass`,
            description: subclassStep.level
              ? `Subclass normally chosen at class level ${subclassStep.level}.`
              : subclassStep.timingLabel,
          },
        ];
      }),
      {
        id: "background",
        kind: "background",
        label: "Background",
        description: "Choose the story scaffold that grants proficiencies, features, and choices.",
      },
      {
        id: "equipment",
        kind: "equipment",
        label: "Equipment",
        description: "Choose starting gear packages and auto-add the fixed gear from class and background.",
      },
      {
        id: "review",
        kind: "review",
        label: "Review",
        description: "Confirm the build summary and save the draft once everything looks right.",
      },
    );

    return base;
  }, [classRecordsByEntry, draft.classEntries, selectedRace]);

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
    if (activeClassEntryIndex >= draft.classEntries.length) {
      setActiveClassEntryIndex(Math.max(0, draft.classEntries.length - 1));
    }
  }, [activeClassEntryIndex, draft.classEntries.length]);

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

  const currentStepWarnings = useMemo(() => {
    switch (activeStep.kind) {
      case "foundation":
        return [abilityValidationMessage, levelingValidationMessage].filter(Boolean);
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
        const entry = typeof activeStep.classEntryIndex === "number" ? draft.classEntries[activeStep.classEntryIndex] : null;
        const classRecord = typeof activeStep.classEntryIndex === "number" ? classRecordsByEntry[activeStep.classEntryIndex] : null;
        const subclassStep = classRecord?.subclassSteps[0] ?? null;

        if (!entry || !subclassStep) {
          return [];
        }

        const unlocked = !subclassStep.level || entry.level >= subclassStep.level;
        return unlocked && !entry.subclassId ? ["Choose a subclass to continue."] : [];
      }
      case "background":
        return draft.backgroundId ? [] : ["Choose a background to continue."];
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
    activeStep,
    classRecordsByEntry,
    draft.backgroundId,
    draft.classEntries,
    draft.subraceId,
    levelingValidationMessage,
    missingEquipmentChoices,
    multiclassValidationMessages,
    saveValidationMessage,
    selectedRace,
  ]);

  const canAdvance = (() => {
    switch (activeStep.kind) {
      case "foundation":
        return !abilityValidationMessage && !levelingValidationMessage;
      case "race":
        return Boolean(draft.raceId);
      case "subrace":
        return selectedRace?.subraces.length ? Boolean(draft.subraceId) : true;
      case "class":
        return draft.classEntries.every((entry) => Boolean(entry.classId));
      case "subclass": {
        const entry = typeof activeStep.classEntryIndex === "number" ? draft.classEntries[activeStep.classEntryIndex] : null;
        const classRecord = typeof activeStep.classEntryIndex === "number" ? classRecordsByEntry[activeStep.classEntryIndex] : null;
        const subclassStep = classRecord?.subclassSteps[0] ?? null;
        if (!entry || !subclassStep) {
          return true;
        }
        const unlocked = !subclassStep.level || entry.level >= subclassStep.level;
        return !unlocked || Boolean(entry.subclassId);
      }
      case "background":
        return Boolean(draft.backgroundId);
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
        const entry = typeof step.classEntryIndex === "number" ? draft.classEntries[step.classEntryIndex] : null;
        const classRecord = typeof step.classEntryIndex === "number" ? classRecordsByEntry[step.classEntryIndex] : null;
        const subclassStep = classRecord?.subclassSteps[0] ?? null;
        if (!entry || !subclassStep) {
          return true;
        }
        const unlocked = !subclassStep.level || entry.level >= subclassStep.level;
        return !unlocked || Boolean(entry.subclassId);
      }
      case "background":
        return Boolean(draft.backgroundId);
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
            <AbilityScoreEditor
              abilities={draft.abilities}
              mode={draft.abilityMode}
              onAbilitiesChange={(abilities) => updateDraft({ abilities })}
              onModeChange={(abilityMode, abilities) => updateDraft({ abilityMode, abilities })}
              racialBonuses={racialBonuses}
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
                    ? getMulticlassRequirementFailures(classRecord?.class.multiclass?.requirements, draft.abilities)
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
          const subclassEntry = typeof activeStep.classEntryIndex === "number" ? draft.classEntries[activeStep.classEntryIndex] : null;
          const subclassClass = typeof activeStep.classEntryIndex === "number" ? classRecordsByEntry[activeStep.classEntryIndex] : null;
          const subclassStep = subclassClass?.subclassSteps[0] ?? null;
          const subclassItems = buildSubclassCatalogItems(subclassStep);
          const unlocked = Boolean(subclassStep && subclassEntry && (!subclassStep.level || subclassEntry.level >= subclassStep.level));
        return (
          <section className="builder-stepPanel">
            <div className="builder-stepPanel__intro">
              <span className="route-shell__tag">Subclass</span>
              <h2 className="route-shell__title">
                {subclassStep?.label ?? "Pick the subclass that shapes the class identity"}
              </h2>
              <p className="route-shell__copy">
                This step is generated for each chosen class that exposes subclass content. If the class level is below the normal unlock point, you can still inspect the options here before later progression work lands.
              </p>
            </div>
            {subclassClass && subclassStep ? (
              subclassStep.options.length ? (
                <CatalogSelector
                  items={subclassItems}
                  label="Subclass"
                  onSelect={(id) =>
                    updateDraft({
                      classEntries: draft.classEntries.map((entry, index) =>
                        index === activeStep.classEntryIndex ? { ...entry, subclassId: id } : entry,
                      ),
                    })
                  }
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
                  Traits: {selectedRacialTraitNames.length ? selectedRacialTraitNames.join(", ") : "None yet"}
                </p>
                <p className="builder-summary__meta">
                  Subclass timing: {primarySubclassStep?.timingLabel ?? "No subclass step available"}
                </p>
                <p className="builder-summary__meta">Total level: {draft.level}</p>
                <p className="builder-summary__meta">
                  Equipment choices remaining: {missingEquipmentChoices}
                </p>
                <p className="builder-summary__meta">Pending builder choices: {pendingChoices}</p>
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
          <div className={`builder-navigation__summary${currentStepWarnings.length ? " builder-navigation__summary--warning" : ""}`}>
            <strong>{activeStep.label}</strong>
            <p>{activeStep.description}</p>
            {currentStepWarnings.length ? (
              <div className="builder-navigation__warningList">
                {currentStepWarnings.map((warning) => (
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
              onClick={() => setCurrentStep(previousStep.id)}
            >
              Back to {previousStep.label}
            </button>
          ) : null}
          {nextStep ? (
            <button
              className="button"
              type="button"
              disabled={!canAdvance}
              onClick={() => setCurrentStep(nextStep.id)}
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
