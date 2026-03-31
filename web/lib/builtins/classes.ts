import { BUILT_IN_SRD_CLASS_ELEMENTS } from "@/lib/builtins/srd-classes";
import type { BuiltInElement, BuiltInRule } from "@/lib/builtins/types";

export type BuiltInSubclassOption = {
  archetype: BuiltInElement;
  features: BuiltInElement[];
};

export type BuiltInSubclassStep = {
  feature: BuiltInElement;
  label: string;
  level?: number;
  timingLabel: string;
  supportsKey?: string;
  options: BuiltInSubclassOption[];
};

export type BuiltInClassRecord = {
  class: BuiltInElement;
  features: BuiltInElement[];
  spellcastingFeatures: BuiltInElement[];
  subclassSteps: BuiltInSubclassStep[];
};

function markBuiltIn(elements: readonly BuiltInElement[]): BuiltInElement[] {
  return elements.map((element): BuiltInElement => ({
    ...element,
    catalogOrigin: "built-in" as const,
  }));
}

function collectGrantedIds(rules: BuiltInRule[]): string[] {
  return rules.flatMap((rule) =>
    rule.kind === "grant" && rule.type === "Class Feature" ? [rule.id] : [],
  );
}

function collectGrantedArchetypeFeatureIds(rules: BuiltInRule[]): string[] {
  return rules.flatMap((rule) =>
    rule.kind === "grant" && rule.type === "Archetype Feature" ? [rule.id] : [],
  );
}

export function getBuiltInSrdClassElements(): readonly BuiltInElement[] {
  return markBuiltIn(BUILT_IN_SRD_CLASS_ELEMENTS);
}

export function getBuiltInSrdClasses(): BuiltInClassRecord[] {
  const elements = markBuiltIn(BUILT_IN_SRD_CLASS_ELEMENTS);
  const elementsById = new Map(
    elements.map((element) => [element.id, element]),
  );
  const classes = elements.filter(
    (element) => element.type === "Class",
  );

  return classes.map((characterClass) => {
    const featureIds = new Set(collectGrantedIds(characterClass.rules));
    const features = [...featureIds]
      .map((id) => elementsById.get(id))
      .filter((element): element is BuiltInElement => Boolean(element));
    const archetypes = elements.filter((element) => element.type === "Archetype");

    const subclassSteps = features.flatMap((feature) =>
      feature.rules
        .filter(
          (rule): rule is Extract<BuiltInRule, { kind: "select" }> =>
            rule.kind === "select" && rule.type === "Archetype",
        )
        .map((rule) => {
          const options = archetypes
            .filter((archetype) => (rule.supports ? archetype.supports.includes(rule.supports) : true))
            .map((archetype) => {
              const archetypeFeatureIds = collectGrantedArchetypeFeatureIds(archetype.rules);
              const archetypeFeatures = archetypeFeatureIds
                .map((id) => elementsById.get(id))
                .filter((element): element is BuiltInElement => Boolean(element));

              return {
                archetype,
                features: archetypeFeatures,
              };
            });

          return {
            feature,
            label: rule.name,
            level: rule.level,
            timingLabel: rule.level ? `Subclass choice at level ${rule.level}` : "Subclass choice",
            supportsKey: rule.supports,
            options,
          };
        }),
    );

    return {
      class: characterClass,
      features,
      spellcastingFeatures: features.filter((feature) => Boolean(feature.spellcasting)),
      subclassSteps,
    };
  });
}

export function getBuiltInSrdClassSummary() {
  const classes = getBuiltInSrdClasses();

  return {
    classCount: classes.length,
    featureCount: classes.reduce((sum, entry) => sum + entry.features.length, 0),
    spellcastingFeatureCount: classes.reduce(
      (sum, entry) => sum + entry.spellcastingFeatures.length,
      0,
    ),
    names: classes.map((entry) => entry.class.name),
  };
}
