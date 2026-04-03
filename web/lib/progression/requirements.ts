import type { AbilityKey } from "@/lib/characters/types";

export type RequirementContext = {
  effectiveAbilities: Record<AbilityKey, number>;
  selectedRaceId?: string;
  selectedRaceName?: string;
  selectedSubraceId?: string;
  selectedSubraceName?: string;
  selectedSizeIds: string[];
  selectedClassIds: string[];
  selectedClassNames: string[];
  selectedFeatureIds: string[];
  selectedFeatureNames: string[];
  selectedProficiencyIds: string[];
  selectedProficiencyNames: string[];
  selectedLanguageIds: string[];
  selectedLanguageNames: string[];
  selectedFeatIds: string[];
  selectedFeatNames: string[];
  selectedSpellIds: string[];
  selectedSpellNames: string[];
  selectedCantripIds: string[];
  selectedCantripNames: string[];
  hasSpellcasting: boolean;
  totalLevel: number;
  ownerClassLevel?: number;
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

function normalizeRequirementCandidate(value: string) {
  return normalizeRequirementText(value)
    .replace(/\b(?:a|an|the)\b/g, " ")
    .replace(/\b(?:proficiency|skill|skills|tool|tools|kit|kits|armor|weapon|weapons|language|languages)\b/g, " $& ")
    .replace(/\s+/g, " ")
    .trim();
}

function humanizeRequirementId(value: string) {
  return value
    .replace(/^ID_[A-Z0-9_]+?_PROFICIENCY_/, "")
    .replace(/^ID_PROFICIENCY_/, "")
    .replace(/^ID_LANGUAGE_/, "")
    .replace(/^ID_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bTools\b/g, "Tools")
    .replace(/\bCant\b/g, "Cant");
}

function normalizeComparisonText(value: string) {
  return normalizeRequirementText(value)
    .replace(/\b(?:a|an|the)\b/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanReadablePrerequisite(value: string | undefined) {
  if (!value) {
    return "";
  }

  return value
    .replace(/^prerequisite:\s*/i, "")
    .replace(
      /\s+(Once during|When you|While you|As an action|As a bonus action|You can|You gain|You learn|During combat)\b[\s\S]*$/i,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function buildSelectedIdSet(context: RequirementContext) {
  return new Set(
    [
      context.selectedRaceId,
      context.selectedSubraceId,
      ...context.selectedSizeIds,
      ...context.selectedClassIds,
      ...context.selectedFeatureIds,
      ...context.selectedProficiencyIds,
      ...context.selectedLanguageIds,
      ...context.selectedFeatIds,
      ...context.selectedSpellIds,
      ...context.selectedCantripIds,
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
  const readablePrerequisite = cleanReadablePrerequisite(prerequisite);
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

  if (
    /(ability to cast at least one spell|ability to cast one spell|ability to cast a spell|pact magic feature)/i.test(
      fallbackText,
    ) &&
    !context.hasSpellcasting
  ) {
    failures.push("Requires spellcasting.");
  }

  const selectedProficiencyNames = new Set(
    [
      ...context.selectedProficiencyNames,
      ...context.selectedProficiencyIds.map(humanizeRequirementId),
    ].map(normalizeRequirementCandidate),
  );
  const selectedLanguageNames = new Set(
    [
      ...context.selectedLanguageNames,
      ...context.selectedLanguageIds.map(humanizeRequirementId),
    ].map(normalizeRequirementText),
  );
  const selectedSpellNames = new Set(
    [
      ...context.selectedSpellNames,
      ...context.selectedSpellIds.map(humanizeRequirementId),
    ].map(normalizeComparisonText),
  );
  const selectedCantripNames = new Set(
    [
      ...context.selectedCantripNames,
      ...context.selectedCantripIds.map(humanizeRequirementId),
    ].map(normalizeComparisonText),
  );

  if (/ability to cast at least one cantrip/i.test(fallbackText) && selectedCantripNames.size === 0) {
    failures.push("Requires the ability to cast at least one cantrip.");
  }

  const proficiencyMatches = [
    ...fallbackText.matchAll(/proficiency\s+(?:with|in)\s+([A-Za-z'’ -]+?)(?:\s+skill|\s+tool|\s+tools|\s+kit|\s+language)?(?=[,.;)]|$)/gi),
  ];
  proficiencyMatches.forEach((match) => {
    const required = normalizeRequirementCandidate(match[1].trim());
    const hasMatch = [...selectedProficiencyNames].some(
      (name) => name === required || name.includes(required) || required.includes(name),
    );

    if (!hasMatch) {
      failures.push(`Requires proficiency with ${match[1].trim()}.`);
    }
  });

  const normalizedProficiencyNames = [...selectedProficiencyNames].map(normalizeComparisonText);
  if (
    /proficiency\s+(?:with|in)\s+a?\s*martial weapon/i.test(fallbackText) &&
    !normalizedProficiencyNames.some((name) => name.includes("martial weapon"))
  ) {
    failures.push("Requires proficiency with a martial weapon.");
  }
  if (
    /proficiency\s+(?:with|in)\s+a?\s*simple weapon/i.test(fallbackText) &&
    !normalizedProficiencyNames.some((name) => name.includes("simple weapon"))
  ) {
    failures.push("Requires proficiency with a simple weapon.");
  }
  if (
    /proficiency\s+(?:with|in)\s+(?:light armor|light armour)/i.test(fallbackText) &&
    !normalizedProficiencyNames.some((name) => name.includes("light armor") || name.includes("light armour"))
  ) {
    failures.push("Requires proficiency with light armor.");
  }
  if (
    /proficiency\s+(?:with|in)\s+(?:medium armor|medium armour)/i.test(fallbackText) &&
    !normalizedProficiencyNames.some((name) => name.includes("medium armor") || name.includes("medium armour"))
  ) {
    failures.push("Requires proficiency with medium armor.");
  }
  if (
    /proficiency\s+(?:with|in)\s+(?:heavy armor|heavy armour)/i.test(fallbackText) &&
    !normalizedProficiencyNames.some((name) => name.includes("heavy armor") || name.includes("heavy armour"))
  ) {
    failures.push("Requires proficiency with heavy armor.");
  }
  if (
    /proficiency\s+(?:with|in)\s+shields?/i.test(fallbackText) &&
    !normalizedProficiencyNames.some((name) => name.includes("shield"))
  ) {
    failures.push("Requires proficiency with shields.");
  }

  const languageMatches = [
    ...fallbackText.matchAll(/(?:speak|read|write|know)\s+([A-Za-z'’ -]+?)(?:\s+language)?(?=[,.;)]|$)/gi),
  ];
  languageMatches.forEach((match) => {
    const required = normalizeRequirementText(match[1].trim());
    const hasMatch = [...selectedLanguageNames].some(
      (name) => name === required || name.includes(required) || required.includes(name),
    );

    if (!hasMatch) {
      failures.push(`Requires ${match[1].trim()} language proficiency.`);
    }
  });

  const levelMatch =
    fallbackText.match(/(\d+)(?:st|nd|rd|th)\s*-?\s*level/i) ??
    fallbackText.match(/\blevel\s*(\d+)/i);
  if (levelMatch) {
    const minimum = Number(levelMatch[1]);
    const effectiveLevel = context.ownerClassLevel ?? context.totalLevel;
    if (effectiveLevel < minimum) {
      failures.push(`Requires level ${minimum} or higher.`);
    }
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
    const classLevelMatch =
      fallbackText.match(new RegExp(`${name}[^\\d]{0,12}(\\d+)(?:st|nd|rd|th)\\s*-?\\s*level`, "i")) ??
      fallbackText.match(new RegExp(`${name}[^\\d]{0,12}level\\s*(\\d+)`, "i"));
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

  if (/small race/i.test(fallbackText) && !context.selectedSizeIds.includes("ID_SIZE_SMALL")) {
    failures.push("Requires a Small race.");
  }
  if (/medium race/i.test(fallbackText) && !context.selectedSizeIds.includes("ID_SIZE_MEDIUM")) {
    failures.push("Requires a Medium race.");
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

  const selectedNamedOptions = [...context.selectedFeatureNames, ...context.selectedFeatNames].map(normalizeComparisonText);
  const selectedNamedSpells = [...selectedSpellNames];
  const selectedNamedCantrips = [...selectedCantripNames];
  const specialNamedRequirements = [
    ...fallbackText.matchAll(/\b([A-Z][A-Za-z' -]+?)\s+patron\b/g),
    ...fallbackText.matchAll(/\b(Pact of the [A-Za-z' -]+)\b/g),
    ...fallbackText.matchAll(/\b([A-Z][A-Za-z' -]+?)\s+order\b/g),
  ]
    .map((match) => normalizeComparisonText(match[1].trim()))
    .filter(Boolean);

  specialNamedRequirements.forEach((required) => {
    const hasMatch = selectedNamedOptions.some(
      (name) => name === required || name.includes(required) || required.includes(name),
    );

    if (!hasMatch) {
      failures.push(`Requires ${required.replace(/\b\w/g, (char) => char.toUpperCase())}.`);
    }
  });

  const namedSpellRequirements = [
    ...fallbackText.matchAll(/\b([A-Z][A-Za-z'’ -]+?)\s+cantrip\b/g),
    ...fallbackText.matchAll(/\b([A-Z][A-Za-z'’ -]+?)\s+spell\b/g),
  ]
    .map((match) => normalizeComparisonText(match[1].trim()))
    .filter((required) => required !== "the" && required !== "a" && required !== "an");

  namedSpellRequirements.forEach((required) => {
    const requiresCantrip = fallbackText.toLowerCase().includes(`${required} cantrip`);
    const haystack = requiresCantrip ? selectedNamedCantrips : selectedNamedSpells;
    const hasMatch = haystack.some(
      (name) => name === required || name.includes(required) || required.includes(name),
    );

    if (!hasMatch) {
      const label = required.replace(/\b\w/g, (char) => char.toUpperCase());
      failures.push(`Requires ${label}${requiresCantrip ? " cantrip" : " spell"}.`);
    }
  });

  const classFeatureResistanceMatches = [
    ...fallbackText.matchAll(/\b([a-z]+)\s+resistance\s+from\s+a\s+class\s+feature\b/gi),
  ];
  classFeatureResistanceMatches.forEach((match) => {
    const required = normalizeComparisonText(`${match[1]} resistance`);
    const hasMatch = selectedNamedOptions.some(
      (name) => name === required || name.includes(required) || required.includes(name),
    );

    if (!hasMatch) {
      failures.push(`Requires ${match[1]} resistance from a class feature.`);
    }
  });

  const invokedAbilityMatches = [
    ...fallbackText.matchAll(/\bability to invoke (?:a |an )?([A-Za-z' -]+)\b/gi),
  ];
  invokedAbilityMatches.forEach((match) => {
    const required = normalizeComparisonText(match[1].trim());
    const hasFeatureMatch = selectedNamedOptions.some(
      (name) => name === required || name.includes(required) || required.includes(name),
    );

    if (!hasFeatureMatch) {
      failures.push(`Requires the ability to invoke ${match[1].trim()}.`);
    }
  });

  if (/hex spell or a warlock feature that curses/i.test(fallbackText)) {
    const hasHex = selectedNamedSpells.some((name) => name === "hex" || name.includes("hex"));
    const hasCurseFeature = selectedNamedOptions.some(
      (name) => name.includes("curse") || name.includes("hexblade") || name.includes("maledict"),
    );

    if (!hasHex && !hasCurseFeature) {
      failures.push("Requires hex or a warlock feature that curses.");
    }
  }

  return [...new Set(failures)];
}
