import type { BuiltInElement } from "@/lib/builtins/types";

export function normalizeSourceKey(value: string) {
  return value.trim().toLowerCase().replace(/[’']/g, "'");
}

const OFFICIAL_SOURCES = [
  "player's handbook",
  "xanathar's guide to everything",
  "tasha's cauldron of everything",
  "eberron: rising from the last war",
  "mythic odysseys of theros",
  "guildmasters' guide to ravnica",
  "explorer's guide to wildemount",
  "sword coast adventurer's guide",
  "mordenkainen presents: monsters of the multiverse",
  "monster manual",
  "dungeon master's guide",
  "fizban's treasury of dragons",
  "bigby presents: glory of the giants",
  "wayfinder's guide to eberron",
  "volo's guide to monsters",
];

export function getSourcePrecedenceScore(element: BuiltInElement) {
  const source = normalizeSourceKey(element.source);
  const isBuiltIn = element.catalogOrigin === "built-in";

  if (source.includes("system reference document 5.2") || source.includes("srd 5.2")) {
    return isBuiltIn ? 700 : 675;
  }

  if (OFFICIAL_SOURCES.some((entry) => source.includes(entry))) {
    return 600;
  }

  if (source.includes("system reference document 5.1") || source === "srd") {
    return isBuiltIn ? 550 : 525;
  }

  if (isBuiltIn) {
    return 500;
  }

  if (source.includes("unearthed arcana") || source.includes("ua")) {
    return 200;
  }

  return 350;
}
