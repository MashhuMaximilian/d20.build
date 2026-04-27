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
  hasAppendixReference: boolean;
};

const ABILITY_ORDER = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;
const FRONT_DECK_CARD_LIMIT = 8;

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
const FRONT_PAGE_GROUPED = {
  rail: { x: 402, y: 196, width: 174, height: 282 },
  deck: { x: 31, y: 535, width: 532, height: 270, columns: 2, columnGap: 16 },
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

function maskRegion(doc: PDFDocument, frame: RenderedPage) {
  const shapeDoc = doc as PdfShapeDocument;
  doc.save();
  shapeDoc.rect(frame.x, frame.y, frame.width, frame.height).fill("#ffffff");
  doc.restore();
}

function valueBoxX(index: number) {
  const columns = [20, 72, 124, 176, 228, 280, 332, 384, 436, 488, 540];
  return columns[index] ?? 20 + index * 52;
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

  const abilityAnchors = [
    { scoreX: 45, scoreY: 184, modX: 45, modY: 214 },
    { scoreX: 113, scoreY: 184, modX: 113, modY: 214 },
    { scoreX: 181, scoreY: 184, modX: 181, modY: 214 },
    { scoreX: 45, scoreY: 258, modX: 45, modY: 288 },
    { scoreX: 113, scoreY: 258, modX: 113, modY: 288 },
    { scoreX: 181, scoreY: 258, modX: 181, modY: 288 },
  ];

  const abilityRowsByLabel = new Map(character.frontPage.abilityRows.map((row) => [row.label.toUpperCase(), row]));

  ABILITY_ORDER.forEach((label, index) => {
    const row = abilityRowsByLabel.get(label);
    const anchor = abilityAnchors[index];
    if (!anchor || !row) {
      return;
    }
    writeFittedText(doc, `${row.score}`, anchor.scoreX - 18, anchor.scoreY - 8, 36, 14, {
      font: "Times-Bold",
      maxSize: 14,
      minSize: 10,
      align: "center",
    });
    writeFittedText(doc, `${row.modifier >= 0 ? "+" : ""}${row.modifier}`, anchor.modX - 14, anchor.modY - 4, 28, 7, {
      font: "Helvetica-Bold",
      maxSize: 6,
      minSize: 4.8,
      align: "center",
    });
  });

  // Saves and skill micro-values need exact per-line calibration; leaving the template clean is better than noisy misalignment.
}

function renderPassivesPanel(doc: PDFDocument, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter, drawShell = true) {
  if (drawShell) {
    addSvg(doc, assets.passivesAndSpeeds, FRONT_PAGE_LAYOUT.passives.x, FRONT_PAGE_LAYOUT.passives.y, FRONT_PAGE_LAYOUT.passives.width, FRONT_PAGE_LAYOUT.passives.height);
  }

  void character;
  // Passive/speed widgets remain visually present from the SVG shell until their exact centers are mapped.
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
    writeText(doc, "No equipped weapons detected.", 20, headerY + 9, 250, 14, {
      size: 6.5,
      color: "#8a8a8a",
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
    hasAppendixReference,
  };
}

function measureEntryHeight(
  doc: PDFDocument,
  summary: FrontEntrySummary,
  width: number,
) {
  doc.save();
  doc.font(PDF_TEXT_FONT_FAMILY);
  doc.fontSize(4.9);
  const bodyHeight = doc.heightOfString(summary.body, {
    width,
    lineGap: 0.15,
  });
  doc.font("Helvetica-Bold");
  doc.fontSize(5.3);
  const titleHeight = doc.heightOfString(summary.title, {
    width,
  });
  doc.restore();

  return Math.ceil(Math.max(6, titleHeight) + bodyHeight + 7);
}

function renderSummaryEntry(
  doc: PDFDocument,
  summary: FrontEntrySummary,
  frame: RenderedPage,
  options: { withRule?: boolean } = {},
) {
  writeFittedText(doc, summary.title.toUpperCase(), frame.x, frame.y, frame.width, 6, {
    font: "Helvetica-Bold",
    maxSize: 5.3,
    minSize: 4.2,
    color: "#111111",
  });

  if (summary.sourceLabel) {
    writeFittedText(doc, summary.sourceLabel, frame.x + frame.width - 50, frame.y + 1, 50, 5, {
      maxSize: 3,
      minSize: 2.5,
      align: "right",
      color: "#8a8a8a",
    });
  }

  writeFittedText(doc, summary.body, frame.x, frame.y + 8, frame.width, frame.height - 10, {
    maxSize: 4.9,
    minSize: 3.6,
    color: "#000000",
    lineGap: 0.15,
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
