import { BUILT_IN_SRD_BACKGROUND_ELEMENTS } from "@/lib/builtins/srd-backgrounds";
import type { BuiltInElement, BuiltInRule } from "@/lib/builtins/types";

export type BuiltInBackgroundRecord = {
  background: BuiltInElement;
  features: BuiltInElement[];
  choiceCount: number;
};

function collectGrantedIds(rules: BuiltInRule[]): string[] {
  return rules.flatMap((rule) =>
    rule.kind === "grant" && rule.type === "Background Feature" ? [rule.id] : [],
  );
}

export function getBuiltInSrdBackgroundElements(): readonly BuiltInElement[] {
  return BUILT_IN_SRD_BACKGROUND_ELEMENTS;
}

export function getBuiltInSrdBackgrounds(): BuiltInBackgroundRecord[] {
  const elementsById = new Map(
    BUILT_IN_SRD_BACKGROUND_ELEMENTS.map((element) => [element.id, element]),
  );
  const backgrounds = BUILT_IN_SRD_BACKGROUND_ELEMENTS.filter(
    (element) => element.type === "Background",
  );

  return backgrounds.map((background) => {
    const featureIds = new Set(collectGrantedIds(background.rules));
    const features = [...featureIds]
      .map((id) => elementsById.get(id))
      .filter((element): element is BuiltInElement => Boolean(element));

    return {
      background,
      features,
      choiceCount: background.rules.filter((rule) => rule.kind === "select").length,
    };
  });
}

export function getBuiltInSrdBackgroundSummary() {
  const backgrounds = getBuiltInSrdBackgrounds();

  return {
    backgroundCount: backgrounds.length,
    featureCount: backgrounds.reduce((sum, entry) => sum + entry.features.length, 0),
    choiceCount: backgrounds.reduce((sum, entry) => sum + entry.choiceCount, 0),
    names: backgrounds.map((entry) => entry.background.name),
  };
}
