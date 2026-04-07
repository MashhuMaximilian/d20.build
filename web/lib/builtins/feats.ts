import { BUILT_IN_SRD_CLASS_ELEMENTS } from "@/lib/builtins/generated-srd-core";
import type { BuiltInElement } from "@/lib/builtins/types";

function markBuiltIn(elements: readonly BuiltInElement[]): BuiltInElement[] {
  return elements.map((element): BuiltInElement => ({
    ...element,
    catalogOrigin: "built-in" as const,
  }));
}

const BUILT_IN_SRD_FEAT_ELEMENTS: readonly BuiltInElement[] = BUILT_IN_SRD_CLASS_ELEMENTS.filter(
  (element) => element.type === "Feat" || element.type === "Feat Feature",
);

export function getBuiltInSrdFeatElements(): readonly BuiltInElement[] {
  return markBuiltIn(BUILT_IN_SRD_FEAT_ELEMENTS);
}

export function getBuiltInSrdFeats(): BuiltInElement[] {
  return markBuiltIn(BUILT_IN_SRD_FEAT_ELEMENTS);
}
