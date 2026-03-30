export type AbilityKey =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";

export type CharacterAbilities = Record<AbilityKey, number>;

export type CharacterDraft = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  playerName: string;
  raceId: string;
  subraceId: string;
  classId: string;
  backgroundId: string;
  abilities: CharacterAbilities;
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
    classId: "",
    backgroundId: "",
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
  };
}

export function formatAbilityModifier(score: number) {
  const modifier = Math.floor((score - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}
