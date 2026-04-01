import type { BuiltInElement } from "@/lib/builtins/types";

const BUILT_IN_SRD_SPELL_ELEMENTS: readonly BuiltInElement[] = [];

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
