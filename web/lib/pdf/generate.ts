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
  fillAndStroke: (fillColor?: string, strokeColor?: string) => PdfShapeDocument;
};

type RenderedPage = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SvgFitMode = "stretch" | "contain";

type BentoLane = RenderedPage & {
  cursorY: number;
  maxY: number;
};

type FrontCardSummary = {
  title: string;
  body: string;
  sourceLabel: string;
  hasAppendixReference: boolean;
};

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
  { x: 402, y: 157, width: 48, height: 28, key: "spellcasting bonus" },
  { x: 466, y: 157, width: 48, height: 28, key: "save dc" },
  { x: 529, y: 157, width: 48, height: 28, key: "spellcasting ability" },
] as const;
const FRONT_PAGE_BENTO = {
  rail: { x: 400, y: 196, width: 178, maxY: 502, gap: 6 },
  deck: { x: 24, y: 565, width: 546, maxY: 806, columns: 3, gap: 8 },
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

function valueBoxX(index: number) {
  const columns = [20, 72, 124, 176, 228, 280, 332, 384, 436, 488, 540];
  return columns[index] ?? 20 + index * 52;
}

function renderFrontHeader(doc: PDFDocument, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter, drawShell = true) {
  if (drawShell) {
    addSvg(doc, assets.frontPageHeader, FRONT_PAGE_LAYOUT.header.x, FRONT_PAGE_LAYOUT.header.y, FRONT_PAGE_LAYOUT.header.width, FRONT_PAGE_LAYOUT.header.height);
  }

  writeFittedText(doc, safeText(character.name), 26, 37, 176, 24, {
    font: "Times-Bold",
    maxSize: 24,
    minSize: 15,
  });

  const metaRows: Array<{ value: string; x: number; y: number; width: number; maxSize?: number }> = [
    { value: [character.raceLabel, character.subraceLabel].filter(Boolean).join(" / ") || "—", x: 240, y: 28, width: 95, maxSize: 8.5 },
    { value: `${character.classLabel || "Character"}${character.level ? ` ${character.level}` : ""}`, x: 349, y: 28, width: 160, maxSize: 8.5 },
    { value: character.backgroundLabel || "—", x: 240, y: 50, width: 95, maxSize: 8.2 },
    { value: "—", x: 349, y: 50, width: 66, maxSize: 8.2 },
    { value: "—", x: 430, y: 50, width: 48, maxSize: 8.2 },
    { value: character.playerName || "—", x: 489, y: 50, width: 68, maxSize: 8.2 },
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
  const values = [
    statsByLabel.get("proficiency bonus")?.value || "—",
    statsByLabel.get("initiative")?.value || "—",
    statsByLabel.get("attacks / action")?.value || "—",
    "—",
    "0",
    statsByLabel.get("hp")?.value || "—",
    statsByLabel.get("hp")?.value || "—",
    "—",
    statsByLabel.get("hit dice")?.value || "—",
    statsByLabel.get("ac")?.value || "—",
    "—",
  ];

  const widths = [40, 40, 40, 40, 40, 48, 48, 44, 44, 40, 40];

  values.forEach((value, index) => {
    const x = valueBoxX(index);
    const width = widths[index] ?? 40;
    const y = index >= 5 ? 100 : 101;
    writeFittedText(doc, safeNumberText(value), x, y, width, 16, {
      font: index === 9 ? "Helvetica-Bold" : "Times-Bold",
      align: "center",
      maxSize: index >= 5 ? 16 : 13,
      minSize: 8,
    });
  });
}

function renderSpellcastingBoxes(doc: PDFDocument, stats: ResolvedPdfCharacter["frontPage"]["stats"]) {
  const statsByLabel = new Map(stats.map((stat) => [stat.label.toLowerCase(), stat.value]));

  FRONT_PAGE_SPELLCASTING_BOXES.forEach((box) => {
    const value = statsByLabel.get(box.key) || "—";
    writeFittedText(doc, safeNumberText(value), box.x, box.y, box.width, box.height, {
      font: box.key === "spellcasting ability" ? "Helvetica-Bold" : "Times-Bold",
      align: "center",
      maxSize: box.key === "spellcasting ability" ? 10 : 16,
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

  const abilityPositions = [
    { x: 20, y: 157 },
    { x: 109, y: 157 },
    { x: 197, y: 157 },
    { x: 20, y: 231 },
    { x: 109, y: 231 },
    { x: 197, y: 231 },
  ];

  character.frontPage.abilityRows.slice(0, 6).forEach((row, index) => {
    const slot = abilityPositions[index];
    if (!slot) {
      return;
    }
    writeFittedText(doc, `${row.score}`, slot.x + 9, slot.y + 38, 50, 18, {
      font: "Times-Bold",
      maxSize: 22,
      minSize: 14,
      align: "center",
    });
    writeFittedText(doc, `${row.modifier >= 0 ? "+" : ""}${row.modifier}`, slot.x + 11, slot.y + 87, 46, 10, {
      font: "Helvetica-Bold",
      maxSize: 10,
      minSize: 7,
      align: "center",
    });
    writeFittedText(doc, `${row.saveBonus >= 0 ? "+" : ""}${row.saveBonus}`, slot.x + 12, slot.y + 7, 44, 8, {
      font: "Helvetica-Bold",
      maxSize: 7.5,
      minSize: 5.5,
      align: "center",
    });
  });

  const skillGroups = [
    { title: "STR", abilities: ["Athletics"] },
    { title: "DEX", abilities: ["Acrobatics", "Sleight of Hand", "Stealth"] },
    { title: "INT", abilities: ["Arcana", "History", "Investigation", "Nature", "Religion"] },
    { title: "WIS", abilities: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"] },
    { title: "CHA", abilities: ["Deception", "Intimidation", "Performance", "Persuasion"] },
  ];

  const skillsByLabel = new Map(character.frontPage.skillRows.map((skill) => [skill.label.toLowerCase(), skill]));
  const groupLayout = [
    { x: 138, y: 167, width: 114, height: 44 },
    { x: 257, y: 167, width: 114, height: 44 },
    { x: 138, y: 218, width: 114, height: 44 },
    { x: 257, y: 218, width: 114, height: 44 },
    { x: 138, y: 269, width: 114, height: 44 },
  ];

  skillGroups.forEach((group, index) => {
    const box = groupLayout[index];
    if (!box) {
      return;
    }

    group.abilities.forEach((skillLabel, skillIndex) => {
      const skill = skillsByLabel.get(skillLabel.toLowerCase());
      if (!skill) {
        return;
      }
      writeFittedText(doc, `${skill.total >= 0 ? "+" : ""}${skill.total}`, box.x + box.width - 23, box.y + 2 + skillIndex * 8, 20, 7, {
        font: "Helvetica-Bold",
        maxSize: 6.4,
        minSize: 5.2,
        align: "right",
      });
    });
  });
}

function renderPassivesPanel(doc: PDFDocument, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter, drawShell = true) {
  if (drawShell) {
    addSvg(doc, assets.passivesAndSpeeds, FRONT_PAGE_LAYOUT.passives.x, FRONT_PAGE_LAYOUT.passives.y, FRONT_PAGE_LAYOUT.passives.width, FRONT_PAGE_LAYOUT.passives.height);
  }

  const statsByLabel = new Map(character.frontPage.stats.map((stat) => [stat.label.toLowerCase(), stat]));
  const skillByLabel = new Map(character.frontPage.skillRows.map((skill) => [skill.label.toLowerCase(), skill]));
  const entries = [
    { value: statsByLabel.get("long jump")?.value || "—", x: 20 },
    { value: statsByLabel.get("high jump")?.value || "—", x: 67 },
    { value: statsByLabel.get("lift / drag")?.value || "—", x: 115 },
    { value: statsByLabel.get("dark vision")?.value || "—", x: 173 },
    { value: `${10 + (skillByLabel.get("perception")?.total ?? 0)}`, x: 225 },
    { value: `${10 + (skillByLabel.get("insight")?.total ?? 0)}`, x: 275 },
    { value: `${10 + (skillByLabel.get("investigation")?.total ?? 0)}`, x: 329 },
    { value: statsByLabel.get("speed")?.value || "—", x: 383 },
    { value: "—", x: 438 },
    { value: "—", x: 491 },
    { value: "—", x: 540 },
  ];

  entries.forEach((entry) => {
    writeFittedText(doc, safeNumberText(entry.value), entry.x, 316, 38, 9, {
      font: "Helvetica-Bold",
      maxSize: 7.2,
      minSize: 5.5,
      align: "center",
    });
  });
}

function renderAttacksPanel(doc: PDFDocument, assets: PdfSvgAssetBundle, attacks: ResolvedPdfCharacter["frontPage"]["attackRows"], drawShell = true) {
  if (drawShell) {
    addSvg(doc, assets.weaponAttacks, FRONT_PAGE_LAYOUT.attacks.x, FRONT_PAGE_LAYOUT.attacks.y, FRONT_PAGE_LAYOUT.attacks.width, FRONT_PAGE_LAYOUT.attacks.height);
  }

  const headerY = 388;
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
    writeText(doc, "No equipped weapons detected.", 18, headerY + 8, 320, 18, {
      size: 8,
      color: "#7b6a5f",
    });
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

function extractMechanicalBullets(card: PdfPageCard) {
  const text = safeText(card.detail || card.summary, "");
  const clauses = text
    .replace(/([.!?])\s+/g, "$1|")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  const mechanicalPattern = /\b(resistance|resistant|immune|immunity|advantage|disadvantage|proficien|speed|darkvision|vision|bonus|save|saving throw|spell|cantrip|action|reaction|attack|damage|armor|weapon|language|condition)\b/i;

  return clauses
    .filter((clause) => mechanicalPattern.test(clause))
    .slice(0, 3)
    .map((clause) => `• ${truncateText(clause.replace(/^you /i, "You "), 78)}`);
}

function makeFrontCardSummary(card: PdfPageCard): FrontCardSummary {
  const rawSummary = safeText(card.summary, "");
  const rawDetail = safeText(card.detail || card.summary, "");
  const hasAppendixReference = rawDetail.length > rawSummary.length + 45 || rawDetail.length > 220;
  const brief = rawSummary.length ? rawSummary : firstSentence(rawDetail);

  if (brief.length <= 120) {
    return {
      title: safeText(card.title),
      body: hasAppendixReference ? `${brief}\n[Ref: Appx]` : brief,
      sourceLabel: card.sourceLabel ? truncateText(card.sourceLabel, 24) : safeText(card.kind),
      hasAppendixReference,
    };
  }

  const bullets = extractMechanicalBullets(card);
  const body = bullets.length
    ? bullets.join("\n")
    : truncateText(firstSentence(brief), 118);

  return {
    title: safeText(card.title),
    body: `${body}${hasAppendixReference ? "\n[Ref: Appx]" : ""}`,
    sourceLabel: card.sourceLabel ? truncateText(card.sourceLabel, 24) : safeText(card.kind),
    hasAppendixReference,
  };
}

function measureBentoCardHeight(
  doc: PDFDocument,
  summary: FrontCardSummary,
  width: number,
  options: { minHeight: number; maxHeight: number },
) {
  const contentWidth = width - 16;
  doc.save();
  doc.font(PDF_TEXT_FONT_FAMILY);
  doc.fontSize(6.8);
  const bodyHeight = doc.heightOfString(summary.body, {
    width: contentWidth,
    lineGap: 0.4,
  });
  doc.font("Helvetica-Bold");
  doc.fontSize(7.8);
  const titleHeight = doc.heightOfString(summary.title, {
    width: contentWidth - 52,
  });
  doc.restore();

  const measured = 12 + Math.max(9, titleHeight) + 4 + bodyHeight + 9;
  return Math.max(options.minHeight, Math.min(options.maxHeight, Math.ceil(measured)));
}

function pickBentoLane(lanes: BentoLane[], cardHeight: number) {
  return lanes
    .filter((lane) => lane.cursorY + cardHeight <= lane.maxY)
    .sort((left, right) => left.cursorY - right.cursorY)[0];
}

function renderBentoCard(
  doc: PDFDocument,
  summary: FrontCardSummary,
  frame: RenderedPage,
  options: { compact?: boolean } = {},
) {
  const compact = Boolean(options.compact);
  const headerHeight = compact ? 13 : 15;
  const shapeDoc = doc as PdfShapeDocument;

  doc.save();
  shapeDoc.rect(frame.x, frame.y, frame.width, frame.height).fillAndStroke("#ffffff", "#111111");
  shapeDoc.rect(frame.x + 1, frame.y + 1, frame.width - 2, headerHeight).fill("#1d1d1d");
  doc.strokeColor("#111111").lineWidth(0.45);
  doc.moveTo(frame.x + 6, frame.y + frame.height - 3).lineTo(frame.x + frame.width - 6, frame.y + frame.height - 3).stroke();
  doc.restore();

  writeFittedText(doc, summary.title.toUpperCase(), frame.x + 7, frame.y + 3, frame.width - 62, headerHeight - 4, {
    font: "Helvetica-Bold",
    maxSize: compact ? 6.5 : 7.2,
    minSize: 5,
    color: "#ffffff",
  });

  if (summary.sourceLabel) {
    writeFittedText(doc, summary.sourceLabel, frame.x + frame.width - 55, frame.y + 4, 48, headerHeight - 5, {
      maxSize: compact ? 4.8 : 5.2,
      minSize: 4,
      align: "right",
      color: "#ffffff",
    });
  }

  writeFittedText(doc, summary.body, frame.x + 8, frame.y + headerHeight + 6, frame.width - 16, frame.height - headerHeight - 12, {
    maxSize: compact ? 6.6 : 7,
    minSize: 5.2,
    color: "#000000",
    lineGap: 0.4,
  });
}

function renderBentoSectionHeader(doc: PDFDocument, title: string, frame: RenderedPage) {
  const shapeDoc = doc as PdfShapeDocument;
  doc.save();
  shapeDoc.rect(frame.x, frame.y, frame.width, frame.height).fill("#1d1d1d");
  doc.restore();
  writeFittedText(doc, title.toUpperCase(), frame.x + 6, frame.y + 2, frame.width - 12, frame.height - 3, {
    font: "Helvetica-Bold",
    maxSize: 6.6,
    minSize: 5,
    align: "center",
    color: "#ffffff",
  });
}

function flowCardsIntoLanes(
  doc: PDFDocument,
  cards: PdfPageCard[],
  lanes: BentoLane[],
  options: {
    gap: number;
    minHeight: number;
    maxHeight: number;
    compact?: boolean;
  },
) {
  const overflow: PdfPageCard[] = [];

  cards.forEach((card) => {
    const summary = makeFrontCardSummary(card);
    const referenceWidth = lanes[0]?.width ?? 160;
    const height = measureBentoCardHeight(doc, summary, referenceWidth, {
      minHeight: options.minHeight,
      maxHeight: options.maxHeight,
    });
    const lane = pickBentoLane(lanes, height);

    if (!lane) {
      overflow.push(card);
      return;
    }

    renderBentoCard(doc, summary, {
      x: lane.x,
      y: lane.cursorY,
      width: lane.width,
      height,
    }, {
      compact: options.compact,
    });
    lane.cursorY += height + options.gap;
  });

  return overflow;
}

function renderRailCards(doc: PDFDocument, assets: PdfSvgAssetBundle, cards: ResolvedPdfCharacter["frontPage"]["railCards"]) {
  void assets;
  const isSensesOrCondition = (card: PdfPageCard) =>
    card.kind === "condition" ||
    card.kind === "sense" ||
    /\b(condition|sense|vision|darkvision|resistance|resistant|immune|immunity|defense)\b/i.test(`${card.title} ${card.tags.join(" ")} ${card.summary}`);
  const sensesCards = cards.filter(isSensesOrCondition);
  const racialCards = cards.filter((card) => card.kind === "trait" && !isSensesOrCondition(card));
  const otherCards = cards.filter((card) => !sensesCards.includes(card) && !racialCards.includes(card));

  const lane: BentoLane = {
    x: FRONT_PAGE_BENTO.rail.x,
    y: FRONT_PAGE_BENTO.rail.y,
    width: FRONT_PAGE_BENTO.rail.width,
    height: FRONT_PAGE_BENTO.rail.maxY - FRONT_PAGE_BENTO.rail.y,
    cursorY: FRONT_PAGE_BENTO.rail.y,
    maxY: FRONT_PAGE_BENTO.rail.maxY,
  };

  const renderSection = (title: string, sectionCards: PdfPageCard[]) => {
    if (!sectionCards.length || lane.cursorY + 18 > lane.maxY) {
      return;
    }

    renderBentoSectionHeader(doc, title, {
      x: lane.x,
      y: lane.cursorY,
      width: lane.width,
      height: 12,
    });
    lane.cursorY += 16;
    flowCardsIntoLanes(doc, sectionCards, [lane], {
      gap: FRONT_PAGE_BENTO.rail.gap,
      minHeight: 42,
      maxHeight: 62,
      compact: true,
    });
    lane.cursorY += 4;
  };

  renderSection("Senses & Conditions", sensesCards);
  renderSection("Racial Traits", racialCards);
  renderSection("Other Traits", otherCards.slice(0, 4));
}

function renderFrontDeck(doc: PDFDocument, assets: PdfSvgAssetBundle, cards: ResolvedPdfCharacter["frontPage"]["deck"]) {
  void assets;
  if (!cards.length) {
    return;
  }

  renderBentoSectionHeader(doc, "Features & Traits", {
    x: FRONT_PAGE_BENTO.deck.x,
    y: FRONT_PAGE_BENTO.deck.y - 16,
    width: FRONT_PAGE_BENTO.deck.width,
    height: 12,
  });

  const columnWidth =
    (FRONT_PAGE_BENTO.deck.width - FRONT_PAGE_BENTO.deck.gap * (FRONT_PAGE_BENTO.deck.columns - 1)) /
    FRONT_PAGE_BENTO.deck.columns;
  const lanes: BentoLane[] = Array.from({ length: FRONT_PAGE_BENTO.deck.columns }, (_, index) => ({
    x: FRONT_PAGE_BENTO.deck.x + index * (columnWidth + FRONT_PAGE_BENTO.deck.gap),
    y: FRONT_PAGE_BENTO.deck.y,
    width: columnWidth,
    height: FRONT_PAGE_BENTO.deck.maxY - FRONT_PAGE_BENTO.deck.y,
    cursorY: FRONT_PAGE_BENTO.deck.y,
    maxY: FRONT_PAGE_BENTO.deck.maxY,
  }));

  flowCardsIntoLanes(doc, cards, lanes, {
    gap: FRONT_PAGE_BENTO.deck.gap,
    minHeight: 46,
    maxHeight: 76,
    compact: true,
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
