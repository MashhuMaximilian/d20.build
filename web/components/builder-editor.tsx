"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AbilityScoreEditor } from "@/components/ability-score-editor";
import { CatalogSelector, type CatalogItem } from "@/components/catalog-selector";
import { EquipmentStep } from "@/components/equipment-step";
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
  getPointBuyTotal,
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
  | "identity"
  | "race"
  | "subrace"
  | "class"
  | "subclass"
  | "background"
  | "abilities"
  | "equipment"
  | "review";

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
  abilityValidationMessage: string;
  missingEquipmentChoices: number;
}) {
  return [
    { label: "Name draft", done: Boolean(draft.name.trim()) },
    { label: "Choose race", done: Boolean(draft.raceId) },
    { label: "Choose subrace", done: !flags.needsSubrace || Boolean(draft.subraceId) },
    { label: "Choose class", done: Boolean(draft.classId) },
    { label: "Choose subclass", done: !flags.needsSubclass || Boolean(draft.subclassId) },
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
  const [draft, setDraft] = useState<CharacterDraft>(initialDraft ?? createEmptyCharacterDraft());
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState<"error" | "success">("success");
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState<BuilderStepId>("identity");

  const selectedRace = useMemo(
    () => races.find((entry) => entry.race.id === draft.raceId) ?? null,
    [draft.raceId, races],
  );
  const selectedSubrace = useMemo(
    () => selectedRace?.subraces.find((entry) => entry.id === draft.subraceId) ?? null,
    [draft.subraceId, selectedRace],
  );
  const selectedClass = useMemo(
    () => classes.find((entry) => entry.class.id === draft.classId) ?? null,
    [classes, draft.classId],
  );
  const activeSubclassStep = useMemo(
    () => selectedClass?.subclassSteps[0] ?? null,
    [selectedClass],
  );
  const selectedSubclass = useMemo(
    () =>
      activeSubclassStep?.options.find((entry) => entry.archetype.id === draft.subclassId) ?? null,
    [activeSubclassStep, draft.subclassId],
  );
  const selectedBackground = useMemo(
    () => backgrounds.find((entry) => entry.background.id === draft.backgroundId) ?? null,
    [backgrounds, draft.backgroundId],
  );
  const equipmentPlan = useMemo(
    () => getStartingEquipmentPlan({ classId: draft.classId, backgroundId: draft.backgroundId }),
    [draft.backgroundId, draft.classId],
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
    const subclassPending = activeSubclassStep && activeSubclassStep.options.length > 0 && !draft.subclassId ? 1 : 0;
    const backgroundPending =
      selectedBackground?.background.rules.filter((rule) => rule.kind === "select").length ?? 0;
    const classPending = selectedClass
      ? selectedClass.features.reduce(
          (count, feature) =>
            count + feature.rules.filter((rule) => rule.kind === "select").length,
          selectedClass.class.rules.filter((rule) => rule.kind === "select").length,
        )
      : 0;

    return subracePending + subclassPending + backgroundPending + classPending + missingEquipmentChoices;
  }, [
    activeSubclassStep,
    draft.subclassId,
    draft.subraceId,
    missingEquipmentChoices,
    selectedBackground,
    selectedClass,
    selectedRace,
  ]);

  const abilityValidationMessage = useMemo(() => getAbilityValidationMessage(draft), [draft]);
  const selectionValidationMessage =
    selectedRace?.subraces.length && !draft.subraceId
      ? "Choose a subrace before saving this draft."
      : activeSubclassStep?.options.length && !draft.subclassId
        ? `Choose a subclass before saving this draft.`
        : missingEquipmentChoices
          ? `Finish the remaining starting equipment choices before saving this draft.`
      : "";
  const saveValidationMessage = abilityValidationMessage || selectionValidationMessage;

  const raceItems = useMemo(() => buildRaceCatalogItems(races), [races]);
  const subraceItems = useMemo(() => buildSubraceCatalogItems(selectedRace), [selectedRace]);
  const classItems = useMemo(() => buildClassCatalogItems(classes), [classes]);
  const subclassItems = useMemo(() => buildSubclassCatalogItems(activeSubclassStep), [activeSubclassStep]);
  const backgroundItems = useMemo(() => buildBackgroundCatalogItems(backgrounds), [backgrounds]);
  const completionChecklist = useMemo(
    () =>
      buildCompletionChecklist(draft, {
        needsSubrace: Boolean(selectedRace?.subraces.length),
        needsSubclass: Boolean(activeSubclassStep?.options.length),
        abilityValidationMessage,
        missingEquipmentChoices,
      }),
    [activeSubclassStep, abilityValidationMessage, draft, missingEquipmentChoices, selectedRace],
  );

  const steps = useMemo(() => {
    const base: { id: BuilderStepId; label: string; description: string }[] = [
      {
        id: "identity",
        label: "Identity",
        description: "Set the character and player names before rules choices start stacking.",
      },
      {
        id: "race",
        label: "Race",
        description: "Choose ancestry, compare traits, and see the immediate build impact.",
      },
    ];

    if (selectedRace?.subraces.length) {
      base.push({
        id: "subrace",
        label: "Subrace",
        description: "Refine the race choice with its branching traits and bonus changes.",
      });
    }

    base.push(
      {
        id: "class",
        label: "Class",
        description: "Compare class features, spellcasting, and future choice complexity.",
      },
      ...(activeSubclassStep?.options.length
        ? [
            {
              id: "subclass" as const,
              label: "Subclass",
              description: activeSubclassStep.timingLabel,
            },
          ]
        : []),
      {
        id: "background",
        label: "Background",
        description: "Choose the story scaffold that grants proficiencies, features, and choices.",
      },
      {
        id: "abilities",
        label: "Abilities",
        description: "Set base ability scores and see racial bonuses update in real time.",
      },
      {
        id: "equipment",
        label: "Equipment",
        description: "Choose starting gear packages and auto-add the fixed gear from class and background.",
      },
      {
        id: "review",
        label: "Review",
        description: "Confirm the build summary and save the draft once everything looks right.",
      },
    );

    return base;
  }, [activeSubclassStep, selectedRace]);

  const currentStepIndex = Math.max(
    steps.findIndex((step) => step.id === currentStep),
    0,
  );
  const activeStep = steps[currentStepIndex] ?? steps[0];
  const previousStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;
  const nextStep = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  useEffect(() => {
    if (!steps.some((step) => step.id === currentStep)) {
      setCurrentStep(steps[0]?.id ?? "identity");
    }
  }, [currentStep, steps]);

  function updateDraft(patch: Partial<CharacterDraft>) {
    if (status) {
      setStatus("");
    }
    setStatusTone("success");

    setDraft((current) => ({ ...current, ...patch }));
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
      subclassId: activeSubclassStep?.options.length ? draft.subclassId : "",
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
    draft.raceId && draft.classId && draft.backgroundId && !saveValidationMessage,
  );

  const canAdvance = (() => {
    switch (activeStep.id) {
      case "identity":
        return true;
      case "race":
        return Boolean(draft.raceId);
      case "subrace":
        return selectedRace?.subraces.length ? Boolean(draft.subraceId) : true;
      case "class":
        return Boolean(draft.classId);
      case "background":
        return Boolean(draft.backgroundId);
      case "abilities":
        return !abilityValidationMessage;
      case "equipment":
        return missingEquipmentChoices === 0;
      case "review":
        return canSave;
      default:
        return true;
    }
  })();

  function isStepComplete(stepId: BuilderStepId) {
    switch (stepId) {
      case "identity":
        return Boolean(draft.name.trim() || draft.playerName.trim());
      case "race":
        return Boolean(draft.raceId);
      case "subrace":
        return !selectedRace?.subraces.length || Boolean(draft.subraceId);
      case "class":
        return Boolean(draft.classId);
      case "subclass":
        return !activeSubclassStep?.options.length || Boolean(draft.subclassId);
      case "background":
        return Boolean(draft.backgroundId);
      case "abilities":
        return !abilityValidationMessage;
      case "equipment":
        return missingEquipmentChoices === 0;
      case "review":
        return canSave;
      default:
        return false;
    }
  }

  const firstBlockedIndex = steps.findIndex((step) => !isStepComplete(step.id));
  const furthestUnlockedIndex =
    firstBlockedIndex === -1 ? steps.length - 1 : Math.min(firstBlockedIndex + 1, steps.length - 1);

  useEffect(() => {
    const activeIndex = steps.findIndex((step) => step.id === currentStep);
    if (activeIndex > furthestUnlockedIndex) {
      setCurrentStep(steps[furthestUnlockedIndex]?.id ?? "identity");
    }
  }, [currentStep, furthestUnlockedIndex, steps]);

  function renderStepBody() {
    switch (activeStep.id) {
      case "identity":
        return (
          <section className="builder-stepPanel">
            <div className="builder-stepPanel__intro">
              <span className="route-shell__tag">Identity</span>
              <h2 className="route-shell__title">Name the character before the rules stack up</h2>
              <p className="route-shell__copy">
                Give the draft a character name and player name now so every later choice has a clear anchor.
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
              <span className="route-shell__tag">Step {selectedRace?.subraces.length ? "3" : "2"}</span>
              <h2 className="route-shell__title">Compare classes by impact, not by walls of text</h2>
              <p className="route-shell__copy">
                The class browser focuses on feature count, spellcasting presence, and future choice complexity so the tradeoffs are visible.
              </p>
            </div>
            <CatalogSelector
              items={classItems}
              label="Class"
              onSelect={(id) => updateDraft({ classId: id, subclassId: "", equipmentSelections: {} })}
              selectedId={draft.classId}
            />
          </section>
        );
      case "subclass":
        return (
          <section className="builder-stepPanel">
            <div className="builder-stepPanel__intro">
              <span className="route-shell__tag">Subclass</span>
              <h2 className="route-shell__title">
                {activeSubclassStep?.label ?? "Pick the subclass that shapes the class identity"}
              </h2>
              <p className="route-shell__copy">
                This step appears only when the selected class opens a supported subclass choice. The workbench shows the timing, features,
                and identity of each available archetype.
              </p>
            </div>
            {selectedClass && activeSubclassStep ? (
              activeSubclassStep.options.length ? (
                <CatalogSelector
                  items={subclassItems}
                  label="Subclass"
                  onSelect={(id) => updateDraft({ subclassId: id })}
                  selectedId={draft.subclassId}
                />
              ) : (
                <div className="builder-review__card">
                  <span className="builder-panel__label">Subclass timing</span>
                  <strong className="builder-summary__name">{activeSubclassStep.label}</strong>
                  <p className="builder-summary__meta">{activeSubclassStep.timingLabel}</p>
                  <p className="builder-summary__meta">
                    This class has a subclass choice node, but no subclass options are currently available from built-in or imported content.
                  </p>
                </div>
              )
            ) : (
              <p className="route-shell__copy">Choose a class first to unlock subclass planning.</p>
            )}
          </section>
        );
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
      case "abilities":
        return (
          <div className="builder-stepPanel">
            <div className="builder-stepPanel__intro">
              <span className="route-shell__tag">Abilities</span>
              <h2 className="route-shell__title">Set the base scores with the bonuses visible</h2>
              <p className="route-shell__copy">
                Ability-score mode is still part of the guided flow, but it updates immediately using the race and subrace bonuses you already picked.
              </p>
            </div>
            <AbilityScoreEditor
              abilities={draft.abilities}
              mode={draft.abilityMode}
              onAbilitiesChange={(abilities) => updateDraft({ abilities })}
              onModeChange={(abilityMode, abilities) => updateDraft({ abilityMode, abilities })}
              racialBonuses={racialBonuses}
              validationMessage={abilityValidationMessage}
            />
          </div>
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
                  <p className="builder-summary__meta">Class: {selectedClass?.class.name ?? "Missing"}</p>
                  <p className="builder-summary__meta">
                    Subclass:{" "}
                    {activeSubclassStep?.options.length
                      ? selectedSubclass?.archetype.name ?? "Missing"
                      : selectedClass
                        ? "Not available"
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
                  Subclass timing: {activeSubclassStep?.timingLabel ?? "No subclass step available"}
                </p>
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
          const isComplete = isStepComplete(step.id);
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
          <div className="builder-navigation__summary">
            <strong>{activeStep.label}</strong>
            <p>{activeStep.description}</p>
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
