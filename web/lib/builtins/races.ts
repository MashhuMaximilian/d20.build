import { BUILT_IN_SRD_RACE_ELEMENTS } from "@/lib/builtins/srd-races";
import type { BuiltInElement, BuiltInRule } from "@/lib/builtins/types";

export type BuiltInRaceRecord = {
  race: BuiltInElement;
  subraces: BuiltInElement[];
  traits: BuiltInElement[];
};

function markBuiltIn(elements: readonly BuiltInElement[]): BuiltInElement[] {
  return elements.map((element): BuiltInElement => ({
    ...element,
    catalogOrigin: "built-in" as const,
  }));
}

function collectGrantedIds(rules: BuiltInRule[]): string[] {
  return rules.flatMap((rule) =>
    rule.kind === "grant" && rule.type === "Racial Trait" ? [rule.id] : [],
  );
}

export function getBuiltInSrdRaceElements(): readonly BuiltInElement[] {
  return markBuiltIn(BUILT_IN_SRD_RACE_ELEMENTS);
}

export function getBuiltInSrdRaces(): BuiltInRaceRecord[] {
  const elements = markBuiltIn(BUILT_IN_SRD_RACE_ELEMENTS);
  const elementsById = new Map(
    elements.map((element) => [element.id, element]),
  );
  const races = elements.filter(
    (element) => element.type === "Race",
  );

  return races.map((race) => {
    const subraces = elements.filter(
      (element) =>
        element.type === "Sub Race" && element.supports.includes(race.name),
    );

    const traitIds = new Set([
      ...collectGrantedIds(race.rules),
      ...subraces.flatMap((subrace) => collectGrantedIds(subrace.rules)),
    ]);

    const traits = [...traitIds]
      .map((id) => elementsById.get(id))
      .filter((element): element is BuiltInElement => Boolean(element));

    return {
      race,
      subraces,
      traits,
    };
  });
}

export function getBuiltInSrdRaceSummary() {
  const races = getBuiltInSrdRaces();

  return {
    raceCount: races.length,
    subraceCount: races.reduce((sum, entry) => sum + entry.subraces.length, 0),
    traitCount: races.reduce((sum, entry) => sum + entry.traits.length, 0),
    names: races.map((entry) => entry.race.name),
  };
}
