import { BUILT_IN_SRD_CLASS_ELEMENTS } from "@/lib/builtins/srd-classes";
import type { BuiltInElement, BuiltInRule } from "@/lib/builtins/types";

export type BuiltInClassRecord = {
  class: BuiltInElement;
  features: BuiltInElement[];
  spellcastingFeatures: BuiltInElement[];
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

    return {
      class: characterClass,
      features,
      spellcastingFeatures: features.filter((feature) => Boolean(feature.spellcasting)),
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
