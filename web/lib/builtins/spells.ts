import { BUILT_IN_SRD_SPELL_ELEMENTS } from "@/lib/builtins/srd-spells";
import type { BuiltInElement } from "@/lib/builtins/types";

function markBuiltIn(elements: readonly BuiltInElement[]): BuiltInElement[] {
  return elements.map((element): BuiltInElement => ({
    ...element,
    catalogOrigin: "built-in" as const,
  }));
}

export function getBuiltInSrdSpellElements(): readonly BuiltInElement[] {
  return markBuiltIn(BUILT_IN_SRD_SPELL_ELEMENTS);
}

export function getBuiltInSrdSpells(): BuiltInElement[] {
  return markBuiltIn(BUILT_IN_SRD_SPELL_ELEMENTS);
}
