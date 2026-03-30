import type { CharacterDraft } from "@/lib/characters/types";

const STORAGE_KEY = "arcanum.characterDrafts";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function listCharacterDrafts(): CharacterDraft[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as CharacterDraft[];
    return parsed.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

export function getCharacterDraft(id: string) {
  return listCharacterDrafts().find((draft) => draft.id === id) ?? null;
}

export function saveCharacterDraft(draft: CharacterDraft) {
  if (!canUseStorage()) {
    return;
  }

  const drafts = listCharacterDrafts();
  const nextDraft = {
    ...draft,
    updatedAt: new Date().toISOString(),
  };
  const index = drafts.findIndex((entry) => entry.id === nextDraft.id);

  if (index >= 0) {
    drafts[index] = nextDraft;
  } else {
    drafts.unshift(nextDraft);
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function deleteCharacterDraft(id: string) {
  if (!canUseStorage()) {
    return;
  }

  const drafts = listCharacterDrafts().filter((draft) => draft.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}
