import type {
  CharacterBackstory,
  CharacterCurrency,
  CharacterDraft,
  CharacterInventoryItem,
  CharacterManualGrant,
} from "@/lib/characters/types";

export type PdfContentKind = "summary" | "table" | "detail" | "appendix";

export type PdfPageKind = "front" | "companion" | "inventory" | "spells" | "backstory" | "appendix";

export type PdfCardKind =
  | "feature"
  | "trait"
  | "condition"
  | "sense"
  | "proficiency"
  | "language"
  | "item"
  | "spell"
  | "note";

export type PdfPageCard = {
  id: string;
  title: string;
  kind: PdfCardKind;
  contentKind: PdfContentKind;
  summary: string;
  detail?: string;
  sourceLabel?: string;
  tags: string[];
  priority: number;
  pageHint?: PdfPageKind | "front-rail";
  widthHint?: "small" | "medium" | "wide";
};

export type PdfStatBlock = {
  id: string;
  label: string;
  value: string;
  meta?: string;
};

export type PdfPageSection = {
  id: string;
  title: string;
  cards: PdfPageCard[];
  description?: string;
};

export type PdfFrontPageComposition = {
  stats: PdfStatBlock[];
  deck: PdfPageCard[];
  deckOverflow: PdfPageCard[];
  railCards: PdfPageCard[];
  notes: string[];
  capacity: number;
};

export type PdfPagePlan = {
  number: number;
  kind: PdfPageKind;
  title: string;
  sections: PdfPageSection[];
  notes: string[];
};

export type PdfAppendixEntry = {
  id: string;
  title: string;
  kind: Exclude<PdfPageKind, "front"> | "appendix";
  body: string;
  sourceLabel?: string;
  tags: string[];
};

export type PdfResolveSource = {
  draft: CharacterDraft;
  stats: PdfStatBlock[];
  featureCards?: PdfPageCard[];
  companionCards?: PdfPageCard[];
  inventoryCards?: PdfPageCard[];
  spellCards?: PdfPageCard[];
  backstoryCards?: PdfPageCard[];
  appendixEntries?: PdfAppendixEntry[];
  notes?: string[];
  backstory?: CharacterBackstory;
  currency?: CharacterCurrency;
  extraItems?: CharacterInventoryItem[];
  manualGrants?: CharacterManualGrant[];
  identity?: {
    raceLabel?: string;
    subraceLabel?: string;
    classLabel?: string;
    backgroundLabel?: string;
  };
};

export type ResolvedPdfCharacter = {
  id: string;
  name: string;
  playerName: string;
  level: number;
  raceLabel: string;
  subraceLabel: string;
  classLabel: string;
  backgroundLabel: string;
  stats: PdfStatBlock[];
  frontPage: PdfFrontPageComposition;
  companionCards: PdfPageCard[];
  inventoryCards: PdfPageCard[];
  spellCards: PdfPageCard[];
  backstoryCards: PdfPageCard[];
  appendixEntries: PdfAppendixEntry[];
  notes: string[];
  currency?: CharacterCurrency;
  backstory?: CharacterBackstory;
  source: CharacterDraft;
  pagePlan: PdfPagePlan[];
};
