import { BUILT_IN_SRD_FEAT_ELEMENTS } from "@/lib/builtins/srd-feats";
import { attachBuiltInSheet } from "@/lib/builtins/sheets";
import type { BuiltInElement } from "@/lib/builtins/types";

function markBuiltIn(elements: readonly BuiltInElement[]): BuiltInElement[] {
  return elements.map((element): BuiltInElement => ({
    ...attachBuiltInSheet(element),
    catalogOrigin: "built-in" as const,
  }));
}

export function getBuiltInSrdFeatElements(): readonly BuiltInElement[] {
  return markBuiltIn(BUILT_IN_SRD_FEAT_ELEMENTS);
}

export function getBuiltInSrdFeats(): BuiltInElement[] {
  return markBuiltIn(BUILT_IN_SRD_FEAT_ELEMENTS);
}
