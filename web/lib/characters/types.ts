export type AbilityKey =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";

export type CharacterAbilities = Record<AbilityKey, number>;
export type AbilityMode = "manual" | "standard-array" | "point-buy" | "rolled";

export type CharacterSourceManifestEntry = {
  sourceId: string;
  sourceName: string;
  indexUrl: string;
  sourceKind: string;
  requiredElementIds: string[];
  fingerprint: string | null;
  status: "built-in" | "cached-on-device" | "rehydrate-required";
};

export type CharacterClassEntry = {
  classId: string;
  subclassId: string;
  level: number;
};

export type CharacterDraft = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  playerName: string;
  raceId: string;
  subraceId: string;
  level: number;
  classEntries: CharacterClassEntry[];
  backgroundId: string;
  abilityMode: AbilityMode;
  abilities: CharacterAbilities;
  equipmentSelections: Record<string, string>;
  sourceManifest: CharacterSourceManifestEntry[];
};

export const ABILITY_KEYS: AbilityKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  strength: "STR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA",
};

export function createEmptyCharacterDraft(): CharacterDraft {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    name: "",
    playerName: "",
    raceId: "",
    subraceId: "",
    level: 1,
    classEntries: [],
    backgroundId: "",
    abilityMode: "manual",
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    equipmentSelections: {},
    sourceManifest: [],
  };
}

type LegacyCharacterDraft = Partial<CharacterDraft> & {
  id: string;
  classId?: string;
  subclassId?: string;
};

function normalizeClassEntries(draft: LegacyCharacterDraft, fallbackLevel: number): CharacterClassEntry[] {
  if (draft.classEntries?.length) {
    return draft.classEntries
      .filter((entry) => entry.classId)
      .map((entry) => ({
        classId: entry.classId,
        subclassId: entry.subclassId ?? "",
        level: Math.max(1, Math.floor(entry.level ?? 1)),
      }));
  }

  if (draft.classId) {
    return [
      {
        classId: draft.classId,
        subclassId: draft.subclassId ?? "",
        level: Math.max(1, Math.floor(draft.level ?? fallbackLevel)),
      },
    ];
  }

  return [];
}

export function normalizeCharacterDraft(draft: CharacterDraft | LegacyCharacterDraft) {
  const empty = createEmptyCharacterDraft();
  const classEntries = normalizeClassEntries(draft, empty.level);
  const level = classEntries.length
    ? classEntries.reduce((sum, entry) => sum + entry.level, 0)
    : Math.max(1, Math.floor(draft.level ?? empty.level));

  return {
    ...empty,
    ...draft,
    level,
    classEntries,
    abilities: {
      ...empty.abilities,
      ...(draft.abilities ?? {}),
    },
    equipmentSelections: draft.equipmentSelections ?? {},
    sourceManifest: draft.sourceManifest ?? [],
  } satisfies CharacterDraft;
}

export function getPrimaryClassEntry(draft: CharacterDraft) {
  return draft.classEntries[0] ?? null;
}

export function getTotalCharacterLevel(draft: CharacterDraft) {
  return draft.classEntries.reduce((sum, entry) => sum + entry.level, 0);
}

export function formatAbilityModifier(score: number) {
  const modifier = Math.floor((score - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

export const POINT_BUY_COST: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export function getPointBuyTotal(abilities: CharacterAbilities) {
  return ABILITY_KEYS.reduce(
    (sum, key) => sum + (POINT_BUY_COST[abilities[key]] ?? 0),
    0,
  );
}

export function rollAbilityScore() {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => b - a);
  return rolls[0] + rolls[1] + rolls[2];
}

export function createRolledAbilities(): CharacterAbilities {
  return {
    strength: rollAbilityScore(),
    dexterity: rollAbilityScore(),
    constitution: rollAbilityScore(),
    intelligence: rollAbilityScore(),
    wisdom: rollAbilityScore(),
    charisma: rollAbilityScore(),
  };
}
