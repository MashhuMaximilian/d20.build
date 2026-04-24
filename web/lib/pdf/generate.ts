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
  font?: "Helvetica" | "Helvetica-Bold" | "Times-Roman" | "Times-Bold";
  size?: number;
  color?: string;
  align?: "left" | "center" | "right";
};

type RenderedPage = {
  x: number;
  y: number;
  width: number;
  height: number;
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

const FRONT_PAGE_RAIL_CARD = { width: 190, height: 60 };
const FRONT_PAGE_FEATURE_CARD = { width: 280, height: 78 };
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
    preserveAspectRatio: "none",
    assumePt: true,
  });
}

function textColor(doc: PDFDocument, color?: string) {
  doc.fillColor(color || "#4b2c1f");
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
  doc.font(PDF_TEXT_FONT_FAMILY);
  doc.fontSize(options.size || 8.5);
  textColor(doc, options.color);
  doc.text(text, x, y, {
    width,
    height,
    align: options.align || "left",
    lineBreak: true,
    ellipsis: true,
  });
}

function valueBoxX(index: number) {
  const columns = [20, 72, 124, 176, 228, 280, 332, 384, 436, 488, 540];
  return columns[index] ?? 20 + index * 52;
}

function renderFrontHeader(doc: PDFDocument, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter) {
  addSvg(doc, assets.frontPageHeader, FRONT_PAGE_LAYOUT.header.x, FRONT_PAGE_LAYOUT.header.y, FRONT_PAGE_LAYOUT.header.width, FRONT_PAGE_LAYOUT.header.height);

  writeText(doc, character.name, 28, 32, 215, 18, {
    font: "Times-Bold",
    size: 21,
  });
  writeText(doc, "CHARACTER NAME", 28, 57, 120, 7, {
    size: 5.5,
    color: "#8d8175",
  });

  const rightX = 238;
  const rightY = 25;
  const metaRows: Array<{ label: string; value: string; x: number; y: number; width: number }> = [
    { label: "RACE", value: [character.raceLabel, character.subraceLabel].filter(Boolean).join(" / ") || "—", x: rightX, y: rightY, width: 112 },
    { label: "CLASS & LEVEL", value: `${character.classLabel || "Character"}${character.level ? ` ${character.level}` : ""}`, x: rightX + 119, y: rightY, width: 108 },
    { label: "BACKGROUND", value: character.backgroundLabel || "—", x: rightX, y: rightY + 22, width: 112 },
    { label: "PLAYER NAME", value: character.playerName || "—", x: rightX + 119, y: rightY + 22, width: 108 },
  ];

  for (const row of metaRows) {
    writeText(doc, row.label, row.x, row.y, row.width, 6, {
      size: 5.3,
      color: "#94887d",
    });
    writeText(doc, row.value, row.x, row.y + 8, row.width, 12, {
      font: "Times-Bold",
      size: row.label === "CLASS & LEVEL" ? 9.5 : 9,
      color: "#4b2c1f",
    });
  }
}

function renderStatStrip(doc: PDFDocument, assets: PdfSvgAssetBundle, stats: ResolvedPdfCharacter["frontPage"]["stats"]) {
  addSvg(doc, assets.hpPanel, FRONT_PAGE_LAYOUT.stats.x, FRONT_PAGE_LAYOUT.stats.y, FRONT_PAGE_LAYOUT.stats.width, FRONT_PAGE_LAYOUT.stats.height);

  stats.slice(0, 11).forEach((stat, index) => {
    const x = valueBoxX(index);
    const y = 100;
    writeText(doc, safeNumberText(stat.value), x, y, 40, 13, {
      font: "Times-Bold",
      size: index === 7 ? 15 : 11,
      align: "center",
      color: "#4b2c1f",
    });
    if (stat.meta) {
      writeText(doc, safeText(stat.meta), x - 4, y + 13, 48, 11, {
        size: 5.8,
        align: "center",
        color: "#6e5a4b",
      });
    }
  });
}

function renderAbilityPanel(
  doc: PDFDocument,
  assets: PdfSvgAssetBundle,
  character: ResolvedPdfCharacter,
) {
  addSvg(doc, assets.abilityPanel, FRONT_PAGE_LAYOUT.abilities.x, FRONT_PAGE_LAYOUT.abilities.y, FRONT_PAGE_LAYOUT.abilities.width, FRONT_PAGE_LAYOUT.abilities.height);

  const abilityPositions = [
    { row: 0, col: 0, x: 20, y: 174 },
    { row: 0, col: 1, x: 120, y: 174 },
    { row: 0, col: 2, x: 220, y: 174 },
    { row: 1, col: 0, x: 20, y: 248 },
    { row: 1, col: 1, x: 120, y: 248 },
    { row: 1, col: 2, x: 220, y: 248 },
  ];

  character.frontPage.abilityRows.slice(0, 6).forEach((row, index) => {
    const slot = abilityPositions[index];
    if (!slot) {
      return;
    }
    writeText(doc, row.label, slot.x, slot.y, 82, 10, {
      font: "Helvetica-Bold",
      size: 9,
      align: "center",
    });
    writeText(doc, `${row.score}`, slot.x, slot.y + 12, 82, 20, {
      font: "Times-Bold",
      size: 17,
      align: "center",
    });
    writeText(doc, `${row.modifier >= 0 ? "+" : ""}${row.modifier}`, slot.x, slot.y + 30, 82, 8, {
      size: 8.5,
      align: "center",
    });
    writeText(doc, `Save ${row.saveBonus >= 0 ? "+" : ""}${row.saveBonus}`, slot.x, slot.y + 38, 82, 8, {
      size: 6.8,
      align: "center",
      color: "#7a6453",
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

    writeText(doc, group.title, box.x, box.y - 9, box.width, 7, {
      size: 6.4,
      align: "center",
      color: "#968476",
    });

    group.abilities.forEach((skillLabel, skillIndex) => {
      const skill = skillsByLabel.get(skillLabel.toLowerCase());
      if (!skill) {
        return;
      }
      writeText(doc, `• ${skill.label}`, box.x + 2, box.y + skillIndex * 8, box.width - 20, 7, {
        size: 6.4,
      });
      writeText(doc, `${skill.total >= 0 ? "+" : ""}${skill.total}`, box.x + box.width - 18, box.y + skillIndex * 8, 16, 7, {
        size: 6.4,
        align: "right",
      });
    });
  });
}

function renderPassivesPanel(doc: PDFDocument, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter) {
  addSvg(doc, assets.passivesAndSpeeds, FRONT_PAGE_LAYOUT.passives.x, FRONT_PAGE_LAYOUT.passives.y, FRONT_PAGE_LAYOUT.passives.width, FRONT_PAGE_LAYOUT.passives.height);

  const statsByLabel = new Map(character.frontPage.stats.map((stat) => [stat.label.toLowerCase(), stat]));
  const skillByLabel = new Map(character.frontPage.skillRows.map((skill) => [skill.label.toLowerCase(), skill]));
  const entries = [
    { label: "Long J.", value: statsByLabel.get("long jump")?.value || "—", x: 20 },
    { label: "High J.", value: statsByLabel.get("high jump")?.value || "—", x: 67 },
    { label: "Lift / Drag", value: statsByLabel.get("lift / drag")?.value || "—", x: 115 },
    { label: "Dark Vision", value: statsByLabel.get("dark vision")?.value || "—", x: 173 },
    { label: "Perception", value: `+${10 + (skillByLabel.get("perception")?.total ?? 0)}`, x: 225 },
    { label: "Insight", value: `+${10 + (skillByLabel.get("insight")?.total ?? 0)}`, x: 275 },
    { label: "Investig.", value: `+${10 + (skillByLabel.get("investigation")?.total ?? 0)}`, x: 329 },
    { label: "Walking", value: statsByLabel.get("speed")?.value || "—", x: 383 },
    { label: "Flying", value: "—", x: 438 },
    { label: "Climbing", value: "—", x: 491 },
    { label: "Swimming", value: "—", x: 540 },
  ];

  entries.forEach((entry) => {
    writeText(doc, entry.label, entry.x, 304, 38, 7, {
      size: 5.5,
      align: "center",
      color: "#665546",
    });
    writeText(doc, safeNumberText(entry.value), entry.x, 310, 38, 8, {
      font: "Helvetica-Bold",
      size: 7.5,
      align: "center",
    });
  });
}

function renderAttacksPanel(doc: PDFDocument, assets: PdfSvgAssetBundle, attacks: ResolvedPdfCharacter["frontPage"]["attackRows"]) {
  addSvg(doc, assets.weaponAttacks, FRONT_PAGE_LAYOUT.attacks.x, FRONT_PAGE_LAYOUT.attacks.y, FRONT_PAGE_LAYOUT.attacks.width, FRONT_PAGE_LAYOUT.attacks.height);

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
  compact = false,
) {
  addSvg(doc, assets.generalContainer, frame.x, frame.y, frame.width, frame.height);

  const titleSize = compact ? 8.4 : 9.5;
  const bodySize = compact ? 6.7 : 7.4;
  const detailSize = compact ? 6.2 : 6.8;
  const contentX = frame.x + 9;
  const contentW = frame.width - 18;
  const titleY = frame.y + 8;
  const bodyY = titleY + 13;

  writeText(doc, safeText(card.title), contentX, titleY, contentW - 60, 10, {
    font: "Helvetica-Bold",
    size: titleSize,
  });
  if (card.sourceLabel) {
    writeText(doc, safeText(card.sourceLabel), frame.x + frame.width - 84, titleY + 1, 76, 7, {
      size: 5.6,
      align: "right",
      color: "#766257",
    });
  }
  if (card.tags.length) {
    writeText(doc, card.tags.join(" · "), frame.x + frame.width - 84, titleY + 9, 76, 7, {
      size: 5.3,
      align: "right",
      color: "#8b7b71",
    });
  }
  writeText(doc, safeText(card.summary), contentX, bodyY, contentW, compact ? 24 : 30, {
    size: bodySize,
    color: "#4f392d",
  });
  if (card.detail) {
    writeText(doc, safeText(card.detail), contentX, bodyY + (compact ? 26 : 32), contentW, compact ? 16 : 18, {
      size: detailSize,
      color: "#665546",
    });
  }
}

function renderRailCards(doc: PDFDocument, assets: PdfSvgAssetBundle, cards: ResolvedPdfCharacter["frontPage"]["railCards"]) {
  cards.slice(0, 8).forEach((card, index) => {
    renderCardFrame(doc, assets, card, {
      x: FRONT_PAGE_LAYOUT.rail.x,
      y: FRONT_PAGE_LAYOUT.rail.y + index * (FRONT_PAGE_RAIL_CARD.height + 6),
      width: FRONT_PAGE_RAIL_CARD.width,
      height: FRONT_PAGE_RAIL_CARD.height,
    }, true);
  });
}

function renderFrontDeck(doc: PDFDocument, assets: PdfSvgAssetBundle, cards: ResolvedPdfCharacter["frontPage"]["deck"]) {
  const startX = FRONT_PAGE_LAYOUT.features.x;
  const startY = FRONT_PAGE_LAYOUT.features.y;
  const columnGap = 8;
  const rowGap = 7;
  const colWidth = FRONT_PAGE_FEATURE_CARD.width;
  const cardHeight = FRONT_PAGE_FEATURE_CARD.height;
  cards.slice(0, 6).forEach((card, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    renderCardFrame(doc, assets, card, {
      x: startX + col * (colWidth + columnGap),
      y: startY + row * (cardHeight + rowGap),
      width: colWidth,
      height: cardHeight,
    });
  });
}

function renderFrontPage(doc: PDFDocument, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter) {
  doc.addPage({ size: [PAGE_WIDTH, PAGE_HEIGHT], margin: 0 });
  renderFrontHeader(doc, assets, character);
  renderStatStrip(doc, assets, character.frontPage.stats);
  renderAbilityPanel(doc, assets, character);
  renderPassivesPanel(doc, assets, character);
  renderAttacksPanel(doc, assets, character.frontPage.attackRows);
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
    }, cardWidth < 200);
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
  const fontPath = await resolvePdfFontPath();
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
  doc.registerFont(PDF_TEXT_FONT_FAMILY, fontPath);

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
