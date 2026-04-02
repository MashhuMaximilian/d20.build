import type { AbilityKey } from "@/lib/characters/types";

export type RequirementContext = {
  effectiveAbilities: Record<AbilityKey, number>;
  selectedRaceId?: string;
  selectedRaceName?: string;
  selectedSubraceId?: string;
  selectedSubraceName?: string;
  selectedClassIds: string[];
  selectedClassNames: string[];
  selectedFeatureIds: string[];
  selectedFeatureNames: string[];
  selectedFeatIds: string[];
  selectedFeatNames: string[];
  hasSpellcasting: boolean;
  totalLevel: number;
  classLevelsByName: Record<string, number>;
  knownRaceNames: string[];
  knownSubraceNames: string[];
  knownClassNames: string[];
};

const ABILITY_NAME_MAP: Record<string, AbilityKey> = {
  strength: "strength",
  str: "strength",
  dexterity: "dexterity",
  dex: "dexterity",
  constitution: "constitution",
  con: "constitution",
  intelligence: "intelligence",
  int: "intelligence",
  wisdom: "wisdom",
  wis: "wisdom",
  charisma: "charisma",
  cha: "charisma",
};

export function normalizeRequirementText(value: string) {
  return value.trim().toLowerCase();
}

export function includesNamedRequirementToken(text: string, token: string) {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\W)${escaped}(?=\\W|$)`, "i").test(text);
}

export function splitTopLevelRequirement(value: string, separator: "," | "||") {
  const parts: string[] = [];
  let depth = 0;
  let current = "";

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const next = value[index + 1];

    if (char === "(") {
      depth += 1;
      current += char;
      continue;
    }

    if (char === ")") {
      depth = Math.max(0, depth - 1);
      current += char;
      continue;
    }

    if (separator === "," && depth === 0 && char === ",") {
      if (current.trim()) {
        parts.push(current.trim());
      }
      current = "";
      continue;
    }

    if (separator === "||" && depth === 0 && char === "|" && next === "|") {
      if (current.trim()) {
        parts.push(current.trim());
      }
      current = "";
      index += 1;
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

export function trimOuterRequirementParens(value: string) {
  let current = value.trim();

  while (current.startsWith("(") && current.endsWith(")")) {
    const inner = current.slice(1, -1);
    let depth = 0;
    let balanced = true;

    for (const char of inner) {
      if (char === "(") {
        depth += 1;
      } else if (char === ")") {
        depth -= 1;
        if (depth < 0) {
          balanced = false;
          break;
        }
      }
    }

    if (!balanced || depth !== 0) {
      break;
    }

    current = inner.trim();
  }

  return current;
}

function normalizeRequirementKey(value: string) {
  return normalizeRequirementText(value).replace(/[_-]+/g, " ");
}

function buildSelectedIdSet(context: RequirementContext) {
  return new Set(
    [
      context.selectedRaceId,
      context.selectedSubraceId,
      ...context.selectedClassIds,
      ...context.selectedFeatureIds,
      ...context.selectedFeatIds,
    ].filter((value): value is string => Boolean(value)),
  );
}

export function extractAbilityThresholdClauses(requirements: string | undefined) {
  if (!requirements) {
    return [];
  }

  return [...requirements.matchAll(/\[([a-z]+):(\d+)\]/gi)]
    .map((match) => ({
      ability: ABILITY_NAME_MAP[match[1].toLowerCase()],
      minimum: Number(match[2]),
    }))
    .filter((entry): entry is { ability: AbilityKey; minimum: number } => Boolean(entry.ability));
}

type RequirementEvalResult = true | false | null;

function evaluateRequirementToken(
  token: string,
  context: RequirementContext,
  selectedIds: Set<string>,
): RequirementEvalResult {
  const normalized = trimOuterRequirementParens(token).trim();
  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("!")) {
    const result = evaluateRequirementToken(normalized.slice(1), context, selectedIds);
    return result === null ? null : !result;
  }

  if (normalized.includes("||")) {
    const results = splitTopLevelRequirement(normalized, "||").map((part) =>
      evaluateRequirementToken(part, context, selectedIds),
    );

    if (results.some((result) => result === true)) {
      return true;
    }

    if (results.every((result) => result === false)) {
      return false;
    }

    return null;
  }

  const bracketMatch = normalized.match(/^\[([^:\]]+):([^\]]+)\]$/i);
  if (bracketMatch) {
    const rawKey = normalizeRequirementKey(bracketMatch[1]);
    const rawValue = bracketMatch[2].trim();
    const ability = ABILITY_NAME_MAP[rawKey];

    if (ability) {
      return context.effectiveAbilities[ability] >= Number(rawValue);
    }

    if (rawKey === "type" && rawValue.toLowerCase() === "spell") {
      return context.hasSpellcasting;
    }

    if (rawKey === "level") {
      return context.totalLevel >= Number(rawValue);
    }

    const classLevel = context.classLevelsByName[rawKey];
    if (classLevel !== undefined) {
      return classLevel >= Number(rawValue);
    }

    return null;
  }

  if (/^ID_/i.test(normalized)) {
    return selectedIds.has(normalized);
  }

  return null;
}

export function evaluateRequirementExpression(
  requirements: string,
  context: RequirementContext,
) {
  const selectedIds = buildSelectedIdSet(context);
  const clauses = splitTopLevelRequirement(trimOuterRequirementParens(requirements), ",");

  if (!clauses.length) {
    return null;
  }

  let sawKnown = false;

  for (const clause of clauses) {
    const result = evaluateRequirementToken(clause, context, selectedIds);
    if (result === false) {
      return false;
    }
    if (result === true) {
      sawKnown = true;
    }
  }

  return sawKnown ? true : null;
}

export function getRequirementFailures(
  requirements: string | undefined,
  prerequisite: string | undefined,
  context: RequirementContext,
) {
  const readablePrerequisite = prerequisite?.trim() ?? "";
  const readableRequirements = requirements?.trim() ?? "";
  const fallbackText = [readablePrerequisite, readableRequirements].filter(Boolean).join(" ").trim();

  if (readableRequirements) {
    const evaluation = evaluateRequirementExpression(readableRequirements, context);

    if (evaluation === false) {
      return [readablePrerequisite ? `Requires ${readablePrerequisite}.` : "The prerequisites are not met."];
    }

    if (evaluation === true) {
      return [];
    }
  }

  if (!fallbackText) {
    return [];
  }

  const failures: string[] = [];
  const normalizedPrerequisite = fallbackText.toLowerCase();

  const abilityMatches = [...fallbackText.matchAll(/\b(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma|STR|DEX|CON|INT|WIS|CHA)\b[^\d]{0,10}(\d{1,2})/gi)];
  abilityMatches.forEach((match) => {
    const ability = ABILITY_NAME_MAP[match[1].toLowerCase()];
    const minimum = Number(match[2]);

    if (ability && context.effectiveAbilities[ability] < minimum) {
      failures.push(`Requires ${ability.toUpperCase()} ${minimum}.`);
    }
  });

  if (normalizedPrerequisite.includes("spellcasting") && !context.hasSpellcasting) {
    failures.push("Requires spellcasting.");
  }

  const levelMatch = fallbackText.match(/(\d+)(?:st|nd|rd|th)-level/i);
  if (levelMatch && context.totalLevel < Number(levelMatch[1])) {
    failures.push(`Requires level ${levelMatch[1]} or higher.`);
  }

  const mentionedClasses = context.knownClassNames.filter((name) =>
    includesNamedRequirementToken(fallbackText, name),
  );
  if (mentionedClasses.length) {
    const hasRequiredClass = mentionedClasses.some((name) =>
      context.selectedClassNames.some((selected) => normalizeRequirementText(selected) === normalizeRequirementText(name)),
    );

    if (!hasRequiredClass) {
      failures.push(`Requires ${mentionedClasses.join(" or ")}.`);
    }
  }

  mentionedClasses.forEach((name) => {
    const classLevelMatch = fallbackText.match(new RegExp(`${name}[^\\d]{0,12}(\\d+)(?:st|nd|rd|th)-level`, "i"));
    if (!classLevelMatch) {
      return;
    }

    const currentLevel = context.classLevelsByName[normalizeRequirementText(name)] ?? 0;
    const minimum = Number(classLevelMatch[1]);
    if (currentLevel < minimum) {
      failures.push(`Requires ${name} level ${minimum} or higher.`);
    }
  });

  const mentionedLineages = [...context.knownRaceNames, ...context.knownSubraceNames].filter((name) =>
    includesNamedRequirementToken(fallbackText, name),
  );

  if (mentionedLineages.length) {
    const selectedNames = [context.selectedRaceName, context.selectedSubraceName]
      .filter((name): name is string => Boolean(name))
      .map(normalizeRequirementText);

    const hasRequiredLineage = mentionedLineages.some((name) =>
      selectedNames.includes(normalizeRequirementText(name)),
    );

    if (!hasRequiredLineage) {
      failures.push(`Requires ${mentionedLineages.join(" or ")}.`);
    }
  }

  const namedFeatureOrFeatOptions = [...fallbackText.matchAll(/([A-Z][A-Za-z' -]+?)\s+(feature|feat)/g)].map(
    (match) => ({
      name: match[1].trim(),
      kind: match[2].toLowerCase(),
    }),
  );

  if (namedFeatureOrFeatOptions.length) {
    const selectedNames = [...context.selectedFeatureNames, ...context.selectedFeatNames].map(normalizeRequirementText);
    const hasNamedOption = namedFeatureOrFeatOptions.some((option) =>
      selectedNames.includes(normalizeRequirementText(option.name)),
    );

    if (!hasNamedOption) {
      failures.push(
        `Requires ${namedFeatureOrFeatOptions
          .map((option) => `${option.name} ${option.kind}`)
          .join(" or ")}.`,
      );
    }
  }

  return [...new Set(failures)];
}
