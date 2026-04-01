import type { BuiltInElement } from "@/lib/builtins/types";

const BUILT_IN_SRD_FEAT_ELEMENTS: readonly BuiltInElement[] = [];

function markBuiltIn(elements: readonly BuiltInElement[]): BuiltInElement[] {
  return elements.map((element): BuiltInElement => ({
    ...element,
    catalogOrigin: "built-in" as const,
  }));
}

export function getBuiltInSrdFeatElements(): readonly BuiltInElement[] {
  return markBuiltIn(BUILT_IN_SRD_FEAT_ELEMENTS);
}

export function getBuiltInSrdFeats(): BuiltInElement[] {
  return markBuiltIn(BUILT_IN_SRD_FEAT_ELEMENTS);
}
