import { BUILT_IN_SRD_SHEETS } from "@/lib/builtins/generated-srd-sheets";
import type { BuiltInElement, BuiltInSheet } from "@/lib/builtins/types";

export function attachBuiltInSheet(element: BuiltInElement): BuiltInElement {
  if (element.sheet) {
    return element;
  }

  const sheet = (BUILT_IN_SRD_SHEETS as Record<string, BuiltInSheet>)[element.id];
  return sheet ? { ...element, sheet } : element;
}
