import fsPromises from "node:fs/promises";
import path from "node:path";

import type PDFDocument from "pdfkit";
import type SVGtoPDF from "svg-to-pdfkit";

import type { PdfSvgAssetBundle } from "@/lib/pdf/svg-assets.server";
import type {
  PdfPageCard,
  PdfPagePlan,
  ResolvedPdfCharacter,
} from "@/lib/pdf/types";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

type TextOptions = {
  font?: "Helvetica" | "Helvetica-Bold" | "Times-Roman" | "Times-Bold" | typeof PDF_TEXT_FONT_FAMILY;
  size?: number;
  color?: string;
  align?: "left" | "center" | "right";
  lineGap?: number;
};

type PdfShapeDocument = PDFDocument & {
  rect: (x: number, y: number, width: number, height: number) => PdfShapeDocument;
  fill: (color?: string) => PdfShapeDocument;
};

type RenderedPage = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SvgFitMode = "stretch" | "contain";

type FrontEntrySummary = {
  title: string;
  body: string;
  sourceLabel: string;
  categoryLabel: string;
  hasAppendixReference: boolean;
};

const FRONT_DECK_CARD_LIMIT = 14;

const FRONT_PAGE_LAYOUT = {
  header: { x: 10, y: 10, width: 575, height: 69 },
  stats: { x: 10, y: 84, width: 570, height: 51 },
  abilities: { x: 10, y: 144, width: 384, height: 152 },
  passives: { x: 10, y: 302, width: 570, height: 51 },
  attacks: { x: 10, y: 360, width: 378, height: 92 },
  rail: { x: 394, y: 144, width: 190, height: 472 },
  features: { x: 10, y: 558, width: 575, height: 250 },
} as const;

const FRONT_PAGE_SPELLCASTING_BOXES = [
  { centerX: 423, centerY: 169, width: 42, height: 18, key: "spellcasting bonus" },
  { centerX: 488, centerY: 169, width: 42, height: 18, key: "save dc" },
  { centerX: 554, centerY: 169, width: 42, height: 18, key: "spellcasting ability" },
] as const;
const FRONT_PAGE_GROUPED = {
  rail: { x: 402, y: 196, width: 174, height: 282 },
  deck: { x: 31, y: 535, width: 532, height: 285, columns: 2, columnGap: 16 },
} as const;
const FRONT_PAGE_ANCHORS = {
  statStrip: {
    proficiencyBonus: { centerX: 40, centerY: 108, width: 34, height: 13 },
    initiative: { centerX: 92, centerY: 108, width: 34, height: 13 },
    attacks: { centerX: 144, centerY: 108, width: 34, height: 13 },
    inspiration: { centerX: 196, centerY: 108, width: 34, height: 13 },
    exhaustion: { centerX: 248, centerY: 108, width: 34, height: 13 },
    maxHp: { centerX: 304, centerY: 108, width: 40, height: 14 },
    hp: { centerX: 356, centerY: 108, width: 40, height: 14 },
    tempHp: { centerX: 406, centerY: 108, width: 36, height: 14 },
    hitDice: { centerX: 458, centerY: 108, width: 42, height: 14 },
    ac: { centerX: 508, centerY: 108, width: 31, height: 15 },
    defenses: { centerX: 560, centerY: 108, width: 34, height: 13 },
  },
  abilities: [
    { label: "STR", score: { centerX: 44, centerY: 181, width: 30, height: 13 }, modifier: { centerX: 44, centerY: 209, width: 24, height: 7 }, save: { centerX: 44, centerY: 156, width: 24, height: 6 } },
    { label: "DEX", score: { centerX: 112, centerY: 181, width: 30, height: 13 }, modifier: { centerX: 112, centerY: 209, width: 24, height: 7 }, save: { centerX: 112, centerY: 156, width: 24, height: 6 } },
    { label: "CON", score: { centerX: 180, centerY: 181, width: 30, height: 13 }, modifier: { centerX: 180, centerY: 209, width: 24, height: 7 }, save: { centerX: 180, centerY: 156, width: 24, height: 6 } },
    { label: "INT", score: { centerX: 44, centerY: 255, width: 30, height: 13 }, modifier: { centerX: 44, centerY: 283, width: 24, height: 7 }, save: { centerX: 44, centerY: 230, width: 24, height: 6 } },
    { label: "WIS", score: { centerX: 112, centerY: 255, width: 30, height: 13 }, modifier: { centerX: 112, centerY: 283, width: 24, height: 7 }, save: { centerX: 112, centerY: 230, width: 24, height: 6 } },
    { label: "CHA", score: { centerX: 180, centerY: 255, width: 30, height: 13 }, modifier: { centerX: 180, centerY: 283, width: 24, height: 7 }, save: { centerX: 180, centerY: 230, width: 24, height: 6 } },
  ],
  skillTotals: {
    athletics: { x: 227, y: 160 },
    acrobatics: { x: 227, y: 169 },
    "sleight of hand": { x: 227, y: 178 },
    stealth: { x: 227, y: 187 },
    arcana: { x: 316, y: 160 },
    history: { x: 316, y: 169 },
    investigation: { x: 316, y: 178 },
    nature: { x: 316, y: 187 },
    religion: { x: 316, y: 196 },
    "animal handling": { x: 227, y: 234 },
    insight: { x: 227, y: 243 },
    medicine: { x: 227, y: 252 },
    perception: { x: 227, y: 261 },
    survival: { x: 227, y: 270 },
    deception: { x: 316, y: 234 },
    intimidation: { x: 316, y: 243 },
    performance: { x: 316, y: 252 },
    persuasion: { x: 316, y: 261 },
  },
  passivesAndSpeeds: {
    longJump: { centerX: 23, centerY: 325, width: 24, height: 7 },
    highJump: { centerX: 52, centerY: 325, width: 24, height: 7 },
    liftDrag: { centerX: 80, centerY: 325, width: 25, height: 7 },
    darkvision: { centerX: 108, centerY: 325, width: 28, height: 7 },
    passivePerception: { centerX: 147, centerY: 325, width: 24, height: 7 },
    passiveInsight: { centerX: 176, centerY: 325, width: 24, height: 7 },
    passiveInvestigation: { centerX: 205, centerY: 325, width: 24, height: 7 },
    walking: { centerX: 253, centerY: 325, width: 27, height: 7 },
    flying: { centerX: 282, centerY: 325, width: 27, height: 7 },
    climbing: { centerX: 311, centerY: 325, width: 27, height: 7 },
    swimming: { centerX: 340, centerY: 325, width: 27, height: 7 },
    burrowing: { centerX: 369, centerY: 325, width: 27, height: 7 },
  },
  proficiencies: {
    weapons: { x: 23, y: 349, width: 55, height: 18 },
    armor: { x: 95, y: 349, width: 55, height: 18 },
    tools: { x: 165, y: 349, width: 55, height: 18 },
    vehicles: { x: 237, y: 349, width: 55, height: 18 },
    languages: { x: 309, y: 349, width: 55, height: 18 },
  },
} as const;
const PDF_TEXT_FONT_FAMILY = "Noto Sans";
let svgToPdfImpl: typeof SVGtoPDF | null = null;

async function resolvePdfFontPath() {
  const candidates = [
    path.resolve(process.cwd(), "public", "pdf-fonts", "NotoSans-Regular.ttf"),
    path.resolve(process.cwd(), "web", "public", "pdf-fonts", "NotoSans-Regular.ttf"),
  ];

  for (const candidate of candidates) {
    try {
      await fsPromises.access(candidate);
      return candidate;
    } catch {
      // Try the next candidate.
    }
  }

  throw new Error("Unable to locate the PDF font asset.");
}

async function loadPdfFontBuffer() {
  const fontPath = await resolvePdfFontPath();
  return fsPromises.readFile(fontPath);
}

function toPlainText(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>|<\/div>|<\/li>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function safeText(value: unknown, fallback = "—") {
  if (typeof value !== "string") {
    return fallback;
  }

  const cleaned = toPlainText(value);
  return cleaned.length ? cleaned : fallback;
}

function safeNumberText(value: string | number | undefined | null, fallback = "—") {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value}`;
  }

  if (typeof value === "string") {
    const cleaned = value.trim();
    if (!cleaned || cleaned.toLowerCase() === "nan") {
      return fallback;
    }
    return cleaned;
  }

  return fallback;
}

function isBlankValue(value: string | number | undefined | null) {
  if (value === null || value === undefined) {
    return true;
  }
  const cleaned = `${value}`.trim();
  return !cleaned || cleaned === "—";
}

function collectPdfBytes(doc: PDFDocument) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer | Uint8Array) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    doc.once("end", () => resolve(Buffer.concat(chunks)));
    doc.once("error", reject);
  });
}

function addSvg(
  doc: PDFDocument,
  svg: string | undefined,
  x: number,
  y: number,
  width: number,
  height: number,
  fit: SvgFitMode = "stretch",
) {
  if (!svg) {
    return;
  }

  if (!svgToPdfImpl) {
    throw new Error("SVG renderer is not initialized.");
  }

  svgToPdfImpl(doc, svg, x, y, {
    width,
    height,
    preserveAspectRatio: fit === "stretch" ? "none" : "xMidYMid meet",
    assumePt: true,
  });
}

function textColor(doc: PDFDocument, color?: string) {
  doc.fillColor(color || "#111111");
}

function resolveFontName(font?: TextOptions["font"]) {
  return font || PDF_TEXT_FONT_FAMILY;
}

function fitTextSize(
  doc: PDFDocument,
  text: string,
  width: number,
  height: number,
  options: TextOptions & { maxSize: number; minSize: number },
) {
  const step = 0.5;
  for (let size = options.maxSize; size >= options.minSize; size -= step) {
    doc.save();
    doc.font(resolveFontName(options.font));
    doc.fontSize(size);
    const measuredHeight = doc.heightOfString(text, {
      width,
      height,
      align: options.align || "left",
      lineBreak: true,
      ellipsis: true,
      lineGap: options.lineGap,
    });
    doc.restore();

    if (measuredHeight <= height) {
      return size;
    }
  }

  return options.minSize;
}

function writeText(
  doc: PDFDocument,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: TextOptions = {},
) {
  doc.font(resolveFontName(options.font));
  doc.fontSize(options.size || 8.5);
  textColor(doc, options.color);
  doc.text(text, x, y, {
    width,
    height,
    align: options.align || "left",
    lineBreak: true,
    ellipsis: true,
    lineGap: options.lineGap,
  });
}

function writeFittedText(
  doc: PDFDocument,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: TextOptions & { maxSize: number; minSize: number },
) {
  writeText(doc, text, x, y, width, height, {
    ...options,
    size: fitTextSize(doc, text, width, height, options),
  });
}

function writeCenteredText(
  doc: PDFDocument,
  text: string,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  options: TextOptions & { maxSize: number; minSize: number },
) {
  writeFittedText(doc, text, centerX - width / 2, centerY - height / 2, width, height, {
    ...options,
    align: "center",
  });
}

function writeOptionalCenteredText(
  doc: PDFDocument,
  text: string | number | undefined | null,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  options: TextOptions & { maxSize: number; minSize: number },
) {
  if (isBlankValue(text)) {
    return;
  }
  writeCenteredText(doc, safeNumberText(text, ""), centerX, centerY, width, height, options);
}

function maskRegion(doc: PDFDocument, frame: RenderedPage) {
  const shapeDoc = doc as PdfShapeDocument;
  doc.save();
  shapeDoc.rect(frame.x, frame.y, frame.width, frame.height).fill("#ffffff");
  doc.restore();
}

function formatSignedNumber(value: number) {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function normalizeAnchorKey(value: string) {
  return value.trim().toLowerCase();
}

function renderFrontHeader(doc: PDFDocument, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter, drawShell = true) {
  if (drawShell) {
    addSvg(doc, assets.frontPageHeader, FRONT_PAGE_LAYOUT.header.x, FRONT_PAGE_LAYOUT.header.y, FRONT_PAGE_LAYOUT.header.width, FRONT_PAGE_LAYOUT.header.height);
  }

  writeFittedText(doc, safeText(character.name), 30, 36, 166, 20, {
    font: "Times-Bold",
    maxSize: 18,
    minSize: 11,
  });

  const metaRows: Array<{ value: string; x: number; y: number; width: number; maxSize?: number }> = [
    { value: [character.raceLabel, character.subraceLabel].filter(Boolean).join(" / ") || "—", x: 246, y: 29, width: 86, maxSize: 6.8 },
    { value: `${character.classLabel || "Character"}${character.level ? ` ${character.level}` : ""}`, x: 368, y: 29, width: 134, maxSize: 6.8 },
    { value: character.backgroundLabel || "—", x: 246, y: 51, width: 86, maxSize: 6.6 },
    { value: "—", x: 368, y: 51, width: 54, maxSize: 6.6 },
    { value: "—", x: 452, y: 51, width: 42, maxSize: 6.6 },
    { value: character.playerName || "—", x: 509, y: 51, width: 45, maxSize: 6.6 },
  ];

  for (const row of metaRows) {
    writeFittedText(doc, safeText(row.value), row.x, row.y, row.width, 10, {
      maxSize: row.maxSize ?? 8.5,
      minSize: 5.8,
    });
  }
}

function renderStatStrip(doc: PDFDocument, assets: PdfSvgAssetBundle, stats: ResolvedPdfCharacter["frontPage"]["stats"], drawShell = true) {
  if (drawShell) {
    addSvg(doc, assets.hpPanel, FRONT_PAGE_LAYOUT.stats.x, FRONT_PAGE_LAYOUT.stats.y, FRONT_PAGE_LAYOUT.stats.width, FRONT_PAGE_LAYOUT.stats.height);
  }

  const statsByLabel = new Map(stats.map((stat) => [stat.label.toLowerCase(), stat]));
  const anchorValues = [
    [FRONT_PAGE_ANCHORS.statStrip.proficiencyBonus, statsByLabel.get("proficiency bonus")?.value || "—"],
    [FRONT_PAGE_ANCHORS.statStrip.initiative, statsByLabel.get("initiative")?.value || "—"],
    [FRONT_PAGE_ANCHORS.statStrip.attacks, statsByLabel.get("attacks / action")?.value || "—"],
    [FRONT_PAGE_ANCHORS.statStrip.inspiration, ""],
    [FRONT_PAGE_ANCHORS.statStrip.exhaustion, "0"],
    [FRONT_PAGE_ANCHORS.statStrip.maxHp, statsByLabel.get("hp")?.value || "—"],
    [FRONT_PAGE_ANCHORS.statStrip.hp, statsByLabel.get("hp")?.value || "—"],
    [FRONT_PAGE_ANCHORS.statStrip.tempHp, ""],
    [FRONT_PAGE_ANCHORS.statStrip.hitDice, statsByLabel.get("hit dice")?.value || "—"],
    [FRONT_PAGE_ANCHORS.statStrip.ac, statsByLabel.get("ac")?.value || "—"],
    [FRONT_PAGE_ANCHORS.statStrip.defenses, ""],
  ] as const;

  anchorValues.forEach(([anchor, value]) => {
    writeOptionalCenteredText(doc, value, anchor.centerX, anchor.centerY, anchor.width, anchor.height, {
      font: "Times-Bold",
      maxSize: 13.5,
      minSize: 7.5,
      color: "#000000",
    });
  });
}

function renderSpellcastingBoxes(doc: PDFDocument, stats: ResolvedPdfCharacter["frontPage"]["stats"]) {
  const statsByLabel = new Map(stats.map((stat) => [stat.label.toLowerCase(), stat.value]));

  FRONT_PAGE_SPELLCASTING_BOXES.forEach((box) => {
    const value = statsByLabel.get(box.key) || "—";
    writeOptionalCenteredText(doc, value, box.centerX, box.centerY, box.width, box.height, {
      font: box.key === "spellcasting ability" ? "Helvetica-Bold" : "Times-Bold",
      maxSize: box.key === "spellcasting ability" ? 9.5 : 14,
      minSize: 7,
    });
  });
}

function renderAbilityPanel(
  doc: PDFDocument,
  assets: PdfSvgAssetBundle,
  character: ResolvedPdfCharacter,
  drawShell = true,
) {
  if (drawShell) {
    addSvg(doc, assets.abilityPanel, FRONT_PAGE_LAYOUT.abilities.x, FRONT_PAGE_LAYOUT.abilities.y, FRONT_PAGE_LAYOUT.abilities.width, FRONT_PAGE_LAYOUT.abilities.height);
  }

  const abilityRowsByLabel = new Map(character.frontPage.abilityRows.map((row) => [row.label.toUpperCase(), row]));
  const skillRowsByLabel = new Map(character.frontPage.skillRows.map((row) => [normalizeAnchorKey(row.label), row]));

  FRONT_PAGE_ANCHORS.abilities.forEach((anchor) => {
    const row = abilityRowsByLabel.get(anchor.label);
    if (!row) {
      return;
    }
    writeCenteredText(doc, `${row.score}`, anchor.score.centerX, anchor.score.centerY, anchor.score.width, anchor.score.height, {
      font: "Times-Bold",
      maxSize: 12.5,
      minSize: 8,
      color: "#000000",
    });
    writeCenteredText(doc, formatSignedNumber(row.modifier), anchor.modifier.centerX, anchor.modifier.centerY, anchor.modifier.width, anchor.modifier.height, {
      font: "Helvetica-Bold",
      maxSize: 5.4,
      minSize: 4.2,
      color: "#000000",
    });
    if (row.saveProficient) {
      writeCenteredText(doc, formatSignedNumber(row.saveBonus), anchor.save.centerX, anchor.save.centerY, anchor.save.width, anchor.save.height, {
      font: "Helvetica-Bold",
      maxSize: 4.2,
      minSize: 3.4,
      color: "#000000",
      });
    }
  });

  Object.entries(FRONT_PAGE_ANCHORS.skillTotals).forEach(([label, anchor]) => {
    const row = skillRowsByLabel.get(label);
    if (!row) {
      return;
    }
    if (!row.proficient && !row.expertise) {
      return;
    }
    writeText(doc, formatSignedNumber(row.total), anchor.x, anchor.y, 14, 5.5, {
      font: row.expertise || row.proficient ? "Helvetica-Bold" : "Helvetica",
      size: 3.8,
      align: "right",
      color: "#000000",
    });
  });
}

function renderPassivesPanel(doc: PDFDocument, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter, drawShell = true) {
  if (drawShell) {
    addSvg(doc, assets.passivesAndSpeeds, FRONT_PAGE_LAYOUT.passives.x, FRONT_PAGE_LAYOUT.passives.y, FRONT_PAGE_LAYOUT.passives.width, FRONT_PAGE_LAYOUT.passives.height);
  }

  const abilityRowsByLabel = new Map(character.frontPage.abilityRows.map((row) => [row.label.toUpperCase(), row]));
  const skillRowsByLabel = new Map(character.frontPage.skillRows.map((row) => [normalizeAnchorKey(row.label), row]));
  const statsByLabel = new Map(character.frontPage.stats.map((stat) => [stat.label.toLowerCase(), stat.value]));
  const strength = abilityRowsByLabel.get("STR")?.score ?? 10;
  const walkingSpeed = statsByLabel.get("speed")?.replace(/\s*ft\.?/i, "") || "—";
  const passivePerception = statsByLabel.get("passive perception") || "—";
  const passiveInsight = skillRowsByLabel.has("insight") ? `${10 + (skillRowsByLabel.get("insight")?.total ?? 0)}` : "—";
  const passiveInvestigation = skillRowsByLabel.has("investigation") ? `${10 + (skillRowsByLabel.get("investigation")?.total ?? 0)}` : "—";
  const anchors = FRONT_PAGE_ANCHORS.passivesAndSpeeds;
  const values = [
    [anchors.longJump, `${strength}`],
    [anchors.highJump, `${Math.max(0, Math.floor((strength + 3) / 4))}`],
    [anchors.liftDrag, `${strength * 30}`],
    [anchors.darkvision, ""],
    [anchors.passivePerception, passivePerception],
    [anchors.passiveInsight, passiveInsight],
    [anchors.passiveInvestigation, passiveInvestigation],
    [anchors.walking, walkingSpeed],
    [anchors.flying, ""],
    [anchors.climbing, ""],
    [anchors.swimming, ""],
    [anchors.burrowing, ""],
  ] as const;

  values.forEach(([anchor, value]) => {
    writeOptionalCenteredText(doc, value, anchor.centerX, anchor.centerY, anchor.width, anchor.height, {
      font: "Helvetica-Bold",
      maxSize: 5.1,
      minSize: 3.8,
      color: "#000000",
    });
  });
}

function renderProficienciesPanel(doc: PDFDocument, character: ResolvedPdfCharacter) {
  const groups = character.frontPage.proficiencyGroups;
  const entries = [
    [FRONT_PAGE_ANCHORS.proficiencies.weapons, groups.weapons],
    [FRONT_PAGE_ANCHORS.proficiencies.armor, groups.armor],
    [FRONT_PAGE_ANCHORS.proficiencies.tools, groups.tools],
    [FRONT_PAGE_ANCHORS.proficiencies.vehicles, groups.vehicles],
    [FRONT_PAGE_ANCHORS.proficiencies.languages, groups.languages],
  ] as const;

  entries.forEach(([frame, values]) => {
    if (!values.length) {
      return;
    }
    writeFittedText(doc, values.slice(0, 3).join(", "), frame.x, frame.y, frame.width, frame.height, {
      maxSize: 3.7,
      minSize: 2.8,
      color: "#000000",
      align: "center",
      lineGap: 0,
    });
  });
}

function renderAttacksPanel(doc: PDFDocument, assets: PdfSvgAssetBundle, attacks: ResolvedPdfCharacter["frontPage"]["attackRows"], drawShell = true) {
  if (drawShell) {
    addSvg(doc, assets.weaponAttacks, FRONT_PAGE_LAYOUT.attacks.x, FRONT_PAGE_LAYOUT.attacks.y, FRONT_PAGE_LAYOUT.attacks.width, FRONT_PAGE_LAYOUT.attacks.height);
  }

  const rowYs = [404, 420, 436, 452, 468];
  attacks.slice(0, 5).forEach((attack, index) => {
    const y = rowYs[index];
    writeText(doc, safeText(attack.name), 18, y, 150, 8, {
      size: 7,
    });
    writeText(doc, safeText(attack.hit), 170, y, 36, 8, {
      size: 7,
      align: "center",
    });
    writeText(doc, safeText(attack.damage), 214, y, 92, 8, {
      size: 7,
    });
    writeText(doc, safeText(attack.type || "Weapon"), 312, y, 38, 8, {
      size: 7,
      align: "center",
    });
    writeText(doc, safeText(attack.properties || "—"), 355, y, 125, 8, {
      size: 7,
    });
  });

  if (!attacks.length) {
    return;
  }
}

function renderCardFrame(
  doc: PDFDocument,
  assets: PdfSvgAssetBundle,
  card: PdfPageCard,
  frame: RenderedPage,
  options: {
    compact?: boolean;
    summaryOnly?: boolean;
  } = {},
) {
  addSvg(doc, assets.generalContainer, frame.x, frame.y, frame.width, frame.height);

  const compact = Boolean(options.compact);
  const summaryOnly = Boolean(options.summaryOnly);
  const contentX = frame.x + 9;
  const contentW = frame.width - 18;
  const titleY = frame.y + 8;
  const bodyY = titleY + (compact ? 11 : 13);
  const sourceX = frame.x + frame.width - 84;
  const titleWidth = contentW - 64;
  const sourceLabel = card.sourceLabel ? safeText(card.sourceLabel).slice(0, compact ? 20 : 28) : "";

  writeFittedText(doc, safeText(card.title), contentX, titleY, titleWidth, compact ? 11 : 13, {
    font: "Helvetica-Bold",
    maxSize: compact ? 8.2 : 9.2,
    minSize: compact ? 5.8 : 6.8,
  });
  if (sourceLabel) {
    writeFittedText(doc, sourceLabel, sourceX, titleY + 1, 76, 7, {
      maxSize: 5.6,
      minSize: 4.5,
      align: "right",
      color: "#444444",
    });
  }
  writeFittedText(doc, safeText(card.summary), contentX, bodyY, contentW, summaryOnly ? frame.height - 24 : compact ? 25 : 30, {
    maxSize: compact ? 7.2 : 7.8,
    minSize: compact ? 5.3 : 6.0,
    color: "#111111",
    lineGap: compact ? 0 : 1,
  });
  if (!summaryOnly && card.detail) {
    writeFittedText(doc, safeText(card.detail), contentX, bodyY + (compact ? 26 : 32), contentW, compact ? 16 : 18, {
      maxSize: compact ? 6.2 : 6.8,
      minSize: compact ? 4.9 : 5.3,
      color: "#333333",
    });
  }
}

function firstSentence(text: string) {
  return text.match(/.+?[.!?](?:\s|$)/)?.[0]?.trim() ?? text;
}

function truncateText(text: string, maxLength: number) {
  const cleaned = safeText(text, "").replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function makeFrontEntrySummary(card: PdfPageCard): FrontEntrySummary {
  const rawSummary = safeText(card.summary, "");
  const rawDetail = safeText(card.detail || card.summary, "");
  const hasAppendixReference = rawDetail.length > rawSummary.length + 45 || rawDetail.length > 220;
  const brief = rawSummary.length ? rawSummary : firstSentence(rawDetail);
  const body = brief.length > 300 ? truncateText(brief, 300) : brief;

  return {
    title: safeText(card.title),
    body,
    sourceLabel: card.sourceLabel ? truncateText(card.sourceLabel, 18) : "",
    categoryLabel: getFrontCardCategory(card),
    hasAppendixReference,
  };
}

function getFrontCardCategory(card: PdfPageCard) {
  const text = frontCardText(card);
  if (card.kind === "trait" || /\b(race|racial|subrace|lineage|dragonmark)\b/.test(text)) {
    return "Race";
  }
  if (/\b(subclass|college|archetype|circle|oath|patron|domain|tradition)\b/.test(text)) {
    return "Subclass";
  }
  if (/\b(feat|ability score improvement)\b/.test(text)) {
    return "Feat";
  }
  if (card.kind === "note") {
    return "Note";
  }
  return "Class";
}

function measureEntryHeight(
  doc: PDFDocument,
  summary: FrontEntrySummary,
  width: number,
) {
  doc.save();
  doc.font(PDF_TEXT_FONT_FAMILY);
  doc.fontSize(4.6);
  const bodyHeight = doc.heightOfString(summary.body, {
    width,
    lineGap: 0,
  });
  doc.font("Helvetica-Bold");
  doc.fontSize(4.8);
  const titleHeight = doc.heightOfString(summary.title, {
    width,
  });
  doc.restore();

  return Math.ceil(Math.max(5.5, titleHeight) + bodyHeight + 6);
}

function renderSummaryEntry(
  doc: PDFDocument,
  summary: FrontEntrySummary,
  frame: RenderedPage,
  options: { withRule?: boolean } = {},
) {
  writeFittedText(doc, summary.title.toUpperCase(), frame.x, frame.y, frame.width, 6, {
    font: "Helvetica-Bold",
    maxSize: 4.8,
    minSize: 3.9,
    color: "#111111",
  });

  if (summary.categoryLabel) {
    writeFittedText(doc, summary.categoryLabel.toUpperCase(), frame.x, frame.y + 6, 42, 4, {
      font: "Helvetica-Bold",
      maxSize: 3.1,
      minSize: 2.5,
      color: "#737373",
    });
  }

  if (summary.sourceLabel) {
    writeFittedText(doc, summary.sourceLabel, frame.x + frame.width - 50, frame.y + 6, 50, 4, {
      maxSize: 3,
      minSize: 2.5,
      align: "right",
      color: "#8a8a8a",
    });
  }

  writeFittedText(doc, summary.body, frame.x, frame.y + 11, frame.width, frame.height - 13, {
    maxSize: 4.6,
    minSize: 3.4,
    color: "#000000",
    lineGap: 0,
  });

  if (options.withRule) {
    doc.save();
    doc.moveTo(frame.x, frame.y + frame.height - 1.5)
      .lineTo(frame.x + frame.width, frame.y + frame.height - 1.5)
      .strokeColor("#bdbdbd")
      .lineWidth(0.35)
      .stroke();
    doc.restore();
  }
}

function renderSummaryEntries(
  doc: PDFDocument,
  cards: PdfPageCard[],
  frame: RenderedPage,
  options: { columns: number; columnGap: number; gap: number; maxEntries?: number },
) {
  const columnWidth = (frame.width - options.columnGap * (options.columns - 1)) / options.columns;
  const cursors = Array.from({ length: options.columns }, (_, index) => ({
    x: frame.x + index * (columnWidth + options.columnGap),
    y: frame.y,
    width: columnWidth,
  }));

  cards.slice(0, options.maxEntries ?? cards.length).forEach((card) => {
    const summary = makeFrontEntrySummary(card);
    const column = cursors.sort((left, right) => left.y - right.y)[0];
    const height = measureEntryHeight(doc, summary, column.width);
    if (!column || column.y + height > frame.y + frame.height) {
      return;
    }

    renderSummaryEntry(doc, summary, {
      x: column.x,
      y: column.y,
      width: column.width,
      height,
    }, {
      withRule: true,
    });
    column.y += height + options.gap;
  });
}

function frontCardText(card: PdfPageCard) {
  return `${card.title} ${card.summary} ${card.tags.join(" ")} ${card.sourceLabel ?? ""}`.toLowerCase();
}

function isMinorFrontPageCard(card: PdfPageCard) {
  const text = frontCardText(card);
  return (
    card.kind === "language" ||
    card.kind === "proficiency" ||
    /\bproficiency option\b/.test(text) ||
    /\b(language|tool|instrument|gaming set|artisan's tools|jeweler's tools)\b/.test(text)
  );
}

function isMajorFrontPageCard(card: PdfPageCard) {
  if (isMinorFrontPageCard(card)) {
    return false;
  }

  const text = frontCardText(card);
  return (
    card.kind === "feature" ||
    card.kind === "trait" ||
    /\b(class feature|subclass|feat|race|racial|resistance|spellcasting|inspiration|college|expertise)\b/.test(text)
  );
}

function renderRailCards(doc: PDFDocument, assets: PdfSvgAssetBundle, cards: ResolvedPdfCharacter["frontPage"]["railCards"]) {
  const isSensesOrCondition = (card: PdfPageCard) =>
    card.kind === "condition" ||
    card.kind === "sense" ||
    /\b(condition|sense|vision|darkvision|resistance|resistant|immune|immunity|defense)\b/i.test(`${card.title} ${card.tags.join(" ")} ${card.summary}`);
  const frontRailCards = cards.filter((card) => !isMinorFrontPageCard(card));
  const sensesCards = frontRailCards.filter(isSensesOrCondition).slice(0, 2);
  const racialCards = frontRailCards.filter((card) => card.kind === "trait" && !isSensesOrCondition(card)).slice(0, 3);
  const otherCards = frontRailCards.filter((card) => !sensesCards.includes(card) && !racialCards.includes(card));
  const railCards = [...sensesCards, ...racialCards, ...otherCards].slice(0, 4);

  if (!railCards.length) {
    return;
  }

  maskRegion(doc, { x: 394, y: 188, width: 194, height: 310 });
  void assets;
  renderSummaryEntries(doc, railCards, {
    x: FRONT_PAGE_GROUPED.rail.x,
    y: FRONT_PAGE_GROUPED.rail.y,
    width: FRONT_PAGE_GROUPED.rail.width,
    height: FRONT_PAGE_GROUPED.rail.height,
  }, {
    columns: 1,
    columnGap: 0,
    gap: 4,
    maxEntries: 8,
  });
}

function renderFrontDeck(doc: PDFDocument, assets: PdfSvgAssetBundle, cards: ResolvedPdfCharacter["frontPage"]["deck"]) {
  const frontCards = cards.filter(isMajorFrontPageCard).slice(0, FRONT_DECK_CARD_LIMIT);

  if (!frontCards.length) {
    return;
  }

  maskRegion(doc, { x: 14, y: 518, width: 568, height: 318 });
  writeFittedText(doc, "FEATURES & TRAITS", 27, 519, FRONT_PAGE_GROUPED.deck.width, 10, {
    font: "Helvetica-Bold",
    maxSize: 5.7,
    minSize: 4.6,
    align: "center",
    color: "#222222",
  });

  void assets;
  renderSummaryEntries(doc, frontCards, {
    x: FRONT_PAGE_GROUPED.deck.x,
    y: FRONT_PAGE_GROUPED.deck.y,
    width: FRONT_PAGE_GROUPED.deck.width,
    height: FRONT_PAGE_GROUPED.deck.height,
  }, {
    columns: FRONT_PAGE_GROUPED.deck.columns,
    columnGap: FRONT_PAGE_GROUPED.deck.columnGap,
    gap: 5,
    maxEntries: FRONT_DECK_CARD_LIMIT,
  });
}

function renderFrontPage(doc: PDFDocument, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter) {
  doc.addPage({ size: [PAGE_WIDTH, PAGE_HEIGHT], margin: 0 });
  const hasFrontTemplate = Boolean(assets.frontPageTemplate);

  if (hasFrontTemplate) {
    addSvg(doc, assets.frontPageTemplate, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, "contain");
  }

  renderFrontHeader(doc, assets, character, !hasFrontTemplate);
  renderStatStrip(doc, assets, character.frontPage.stats, !hasFrontTemplate);
  renderAbilityPanel(doc, assets, character, !hasFrontTemplate);
  renderSpellcastingBoxes(doc, character.frontPage.stats);
  renderPassivesPanel(doc, assets, character, !hasFrontTemplate);
  renderProficienciesPanel(doc, character);
  renderAttacksPanel(doc, assets, character.frontPage.attackRows, !hasFrontTemplate);
  renderRailCards(doc, assets, character.frontPage.railCards);
  renderFrontDeck(doc, assets, character.frontPage.deck);
}

function renderPageHeader(doc: PDFDocument, title: string, page: PdfPagePlan, character: ResolvedPdfCharacter) {
  writeText(doc, character.name, 20, 22, 320, 18, {
    font: "Times-Bold",
    size: 23,
  });
  writeText(doc, title, 20, 43, 220, 10, {
    size: 8.5,
    color: "#7b6a5f",
  });
  writeText(doc, `Page ${page.number}`, 470, 21, 95, 12, {
    font: "Helvetica-Bold",
    size: 12,
    align: "right",
  });
  writeText(doc, safeText(page.kind.toUpperCase()), 470, 36, 95, 8, {
    size: 7.2,
    align: "right",
    color: "#7f7167",
  });
  doc.moveTo(20, 60).lineTo(575, 60).strokeColor("#d7b596").lineWidth(0.9).stroke();
}

function renderPlanSection(
  doc: PDFDocument,
  assets: PdfSvgAssetBundle,
  section: PdfPagePlan["sections"][number],
  startY: number,
) {
  writeText(doc, safeText(section.title), 20, startY, 350, 10, {
    font: "Helvetica-Bold",
    size: 12,
    color: "#5f3624",
  });
  if (section.description) {
    writeText(doc, safeText(section.description), 20, startY + 11, 430, 9, {
      size: 6.8,
      color: "#7c6b5e",
    });
  }

  const cardsPerRow = 2;
  const gap = 8;
  const cardWidth = 270;
  const cardHeight = 76;
  const rowStart = startY + 24;
  section.cards.forEach((card, index) => {
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    renderCardFrame(doc, assets, card, {
      x: 20 + col * (cardWidth + gap),
      y: rowStart + row * (cardHeight + gap),
      width: cardWidth,
      height: cardHeight,
    }, {
      compact: cardWidth < 200,
    });
  });

  return rowStart + Math.ceil(section.cards.length / cardsPerRow) * (cardHeight + gap) - gap;
}

function renderStandardPage(doc: PDFDocument, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter, page: PdfPagePlan) {
  doc.addPage({ size: [PAGE_WIDTH, PAGE_HEIGHT], margin: 0 });
  renderPageHeader(doc, page.title, page, character);

  let cursorY = 74;
  page.sections.forEach((section) => {
    cursorY = renderPlanSection(doc, assets, section, cursorY) + 12;
  });

  if (page.notes.length) {
    cursorY += 4;
    page.notes.slice(0, 3).forEach((note, index) => {
      writeText(doc, safeText(note), 20, cursorY + index * 8, 555, 7, {
        size: 6.4,
        color: "#7d6d61",
      });
    });
  }
}

export async function generatePdfBytes(character: ResolvedPdfCharacter, assets: PdfSvgAssetBundle) {
  const fontBuffer = await loadPdfFontBuffer();
  const [{ default: PDFDocument }, { default: SVGtoPDF }] = await Promise.all([
    import("pdfkit/js/pdfkit.standalone.js"),
    import("svg-to-pdfkit"),
  ]);
  svgToPdfImpl = SVGtoPDF;

  const doc = new PDFDocument({
    size: [PAGE_WIDTH, PAGE_HEIGHT],
    margin: 0,
    autoFirstPage: false,
    compress: true,
  });
  doc.registerFont(PDF_TEXT_FONT_FAMILY, fontBuffer);

  const done = collectPdfBytes(doc);

  renderFrontPage(doc, assets, character);

  character.pagePlan
    .filter((page) => page.kind !== "front")
    .forEach((page) => renderStandardPage(doc, assets, character, page));

  doc.end();

  try {
    return await done;
  } finally {
    svgToPdfImpl = null;
  }
}
