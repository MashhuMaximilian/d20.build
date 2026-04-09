import { BUILT_IN_SRD_RACE_ELEMENTS } from "@/lib/builtins/srd-races";
import type { BuiltInElement, BuiltInRule } from "@/lib/builtins/types";

export type BuiltInRaceRecord = {
  race: BuiltInElement;
  subraces: BuiltInElement[];
  traits: BuiltInElement[];
  ancestryChoices: {
    id: string;
    name: string;
    number: number;
    optionType: "Racial Trait" | "Ability Score Improvement";
    options: BuiltInElement[];
  }[];
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

function splitSupportTokens(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(/\|\||\||,/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function resolveSelectableElements(elements: BuiltInElement[], rules: BuiltInRule[]) {
  return rules
    .filter(
      (rule): rule is Extract<BuiltInRule, { kind: "select" }> =>
        rule.kind === "select" &&
        (rule.type === "Racial Trait" || rule.type === "Ability Score Improvement"),
    )
    .map((rule) => {
      const tokens = splitSupportTokens(rule.supports);
      const options = elements.filter((element) => {
        if (element.type !== rule.type) {
          return false;
        }

        if (!tokens.length) {
          return false;
        }

        return tokens.some(
          (token) =>
            element.id === token ||
            element.name === token ||
            element.supports.includes(token),
        );
      });

      return {
        id: `${rule.type}:${rule.name}:${rule.supports ?? "default"}`,
        name: rule.name,
        number: rule.number ?? 1,
        optionType: rule.type as "Racial Trait" | "Ability Score Improvement",
        options,
      };
    })
    .filter((choice) => choice.options.length > 0);
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
        (element.type === "Sub Race" || element.type === "Race Variant") &&
        element.supports.includes(race.name),
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
      ancestryChoices: resolveSelectableElements(elements, [
        ...race.rules,
        ...subraces.flatMap((subrace) => subrace.rules),
      ]),
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
