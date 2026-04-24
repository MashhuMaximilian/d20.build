import type { ResolvedPdfCharacter } from "@/lib/pdf/types";

export const PDF_EXPORT_STORAGE_PREFIX = "arcanum:pdf-export";

function getPdfExportStorageKey(token: string) {
  return `${PDF_EXPORT_STORAGE_PREFIX}:${token}`;
}

export function createPdfExportToken() {
  return crypto.randomUUID();
}

export function storePdfExportPayload(token: string, payload: ResolvedPdfCharacter) {
  window.localStorage.setItem(getPdfExportStorageKey(token), JSON.stringify(payload));
}

export function readPdfExportPayload(token: string) {
  const raw = window.localStorage.getItem(getPdfExportStorageKey(token));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ResolvedPdfCharacter;
  } catch {
    return null;
  }
}

export function clearPdfExportPayload(token: string) {
  window.localStorage.removeItem(getPdfExportStorageKey(token));
}
