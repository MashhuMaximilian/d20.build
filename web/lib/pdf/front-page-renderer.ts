import type { PdfSvgAssetBundle } from "@/lib/pdf/svg-assets.server";
import type { PdfPageCard, ResolvedPdfCharacter } from "@/lib/pdf/types";
import {
  drawCenteredTextInRect,
  drawFittedText,
  drawSvg,
  drawText,
  fillCircle,
  insetRect,
  maskRect,
  type PdfRect,
  type PdfRenderContext,
  splitColumns,
  splitRows,
  strokeCircle,
  strokeRule,
} from "@/lib/pdf/drawing";
import { FRONT_PAGE_REGIONS, PAGE_SIZE, rectFromFractions } from "@/lib/pdf/front-page-layout";

type StatBoxSpec = {
  key: string;
  fallback?: string;
  mode?: "normal" | "wide" | "small" | "shield";
  box: PdfRect;
};

type FeatureSummary = {
  title: string;
  category: string;
  source: string;
  body: string;
};

const TOP_STATS: StatBoxSpec[] = [
  { key: "proficiency bonus", box: { x: 12, y: 4.43, width: 44.52, height: 42 } },
  { key: "initiative", box: { x: 62.52, y: 4.43, width: 44.52, height: 42 } },
  { key: "attacks / action", box: { x: 113.05, y: 4.43, width: 44.52, height: 42 } },
  { key: "inspiration", fallback: "", box: { x: 163.57, y: 4.43, width: 44.52, height: 42 } },
  { key: "exhaustion", fallback: "0", box: { x: 214.09, y: 4.43, width: 44.52, height: 42 } },
  { key: "hp", mode: "wide", box: { x: 264.61, y: 4.43, width: 36, height: 42 } },
  { key: "current hp", fallback: "", mode: "wide", box: { x: 301.61, y: 4.43, width: 62, height: 42 } },
  { key: "temp hp", fallback: "", mode: "small", box: { x: 363.61, y: 4.43, width: 35, height: 42 } },
  { key: "hit dice", mode: "wide", box: { x: 408.61, y: 4.43, width: 54.71, height: 42 } },
  { key: "ac", mode: "shield", box: { x: 469.32, y: 3.43, width: 38.38, height: 44 } },
  { key: "defenses", fallback: "", box: { x: 513.71, y: 4.43, width: 44.52, height: 42 } },
];

const ABILITY_VALUE_RECTS = [
  { label: "STR", score: { x: 25, y: 39, width: 38, height: 18 }, modifier: { x: 27, y: 64, width: 34, height: 11 } },
  { label: "DEX", score: { x: 87.7, y: 39, width: 38, height: 18 }, modifier: { x: 89.7, y: 64, width: 34, height: 11 } },
  { label: "CON", score: { x: 150.4, y: 39, width: 38, height: 18 }, modifier: { x: 152.4, y: 64, width: 34, height: 11 } },
  { label: "INT", score: { x: 25, y: 119, width: 38, height: 18 }, modifier: { x: 27, y: 144, width: 34, height: 8 } },
  { label: "WIS", score: { x: 87.7, y: 119, width: 38, height: 18 }, modifier: { x: 89.7, y: 144, width: 34, height: 8 } },
  { label: "CHA", score: { x: 150.4, y: 119, width: 38, height: 18 }, modifier: { x: 152.4, y: 144, width: 34, height: 8 } },
] as const;

const ABILITY_PANEL_VIEWBOX = { width: 384, height: 152 } as const;
const TOP_STAT_VIEWBOX = { width: 570, height: 51 } as const;

const SKILL_DOT_CENTERS = [
  { x: 231.5, ys: [23.5, 32.5, 41.5, 50.5] },
  { x: 317.5, ys: [23.5, 32.5, 41.5, 50.5, 59.5] },
  { x: 231.5, ys: [94.5, 103.5, 112.5, 121.5, 130.5] },
  { x: 317.5, ys: [94.5, 103.5, 112.5, 121.5] },
] as const;

const SPELLCASTING_BOXES = [
  { x: 397, y: 145, width: 53, height: 44 },
  { x: 465, y: 145, width: 53, height: 44 },
  { x: 532, y: 145, width: 53, height: 44 },
] as const;

const SKILL_GROUPS = [
  ["Athletics", "Acrobatics", "Sleight of Hand", "Stealth"],
  ["Arcana", "History", "Investigation", "Nature", "Religion"],
  ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
  ["Deception", "Intimidation", "Performance", "Persuasion"],
] as const;

function cleanText(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

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
    .trim() || fallback;
}

function truncateText(value: string, maxLength: number) {
  const cleaned = cleanText(value).replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  return `${cleaned.slice(0, maxLength - 3).trim()}...`;
}

function signed(value: number) {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function statValue(character: ResolvedPdfCharacter, key: string, fallback = "") {
  const stat = character.frontPage.stats.find((candidate) => normalizeKey(candidate.label) === key);
  return cleanText(stat?.value, fallback);
}

function componentRect(region: PdfRect, viewBox: { width: number; height: number }, rect: PdfRect): PdfRect {
  const scaleX = region.width / viewBox.width;
  const scaleY = region.height / viewBox.height;
  return {
    x: region.x + rect.x * scaleX,
    y: region.y + rect.y * scaleY,
    width: rect.width * scaleX,
    height: rect.height * scaleY,
  };
}

function drawValueOnlyStatBox(ctx: PdfRenderContext, rect: PdfRect, value: string, mode: StatBoxSpec["mode"] = "normal") {
  if (!value) {
    return;
  }

  const valueRect = rectFromFractions(rect, {
    x: mode === "shield" ? 0.13 : mode === "wide" ? 0.07 : 0.12,
    y: mode === "shield" ? 0.20 : mode === "wide" ? 0.17 : 0.16,
    width: mode === "shield" ? 0.74 : mode === "wide" ? 0.86 : 0.76,
    height: mode === "shield" ? 0.36 : 0.36,
  });
  drawCenteredTextInRect(ctx, value, valueRect, {
    font: "Times-Bold",
    maxSize: mode === "small" ? 11 : mode === "shield" ? 12 : 13.5,
    minSize: 7,
    color: "#000000",
  });
}

function renderHeader(ctx: PdfRenderContext, character: ResolvedPdfCharacter) {
  drawFittedText(ctx, cleanText(character.name, "Unnamed character"), { x: 30, y: 37, width: 166, height: 17 }, {
    font: "Times-Bold",
    maxSize: 17,
    minSize: 10,
    color: "#000000",
  });

  const race = [character.raceLabel, character.subraceLabel].filter(Boolean).join(" / ");
  const classLabel = `${character.classLabel || "Character"}${character.level ? ` ${character.level}` : ""}`;
  const meta = [
    { text: race, rect: { x: 246, y: 29, width: 92, height: 9 } },
    { text: classLabel, rect: { x: 371, y: 29, width: 130, height: 9 } },
    { text: character.backgroundLabel, rect: { x: 246, y: 51, width: 92, height: 9 } },
    { text: character.playerName, rect: { x: 508, y: 51, width: 48, height: 9 } },
  ];

  meta.forEach((entry) => {
    if (!entry.text) {
      return;
    }
    drawFittedText(ctx, cleanText(entry.text), entry.rect, {
      maxSize: 6.3,
      minSize: 4.8,
      color: "#000000",
    });
  });
}

function renderStatStrip(ctx: PdfRenderContext, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter, drawShell: boolean) {
  if (drawShell) {
    drawSvg(ctx, assets.hpPanel, FRONT_PAGE_REGIONS.statStrip);
  }

  TOP_STATS.forEach((spec) => {
    const value = statValue(character, spec.key, spec.fallback);
    drawValueOnlyStatBox(ctx, componentRect(FRONT_PAGE_REGIONS.statStrip, TOP_STAT_VIEWBOX, spec.box), value, spec.mode);
  });
}

function renderSpellcasting(ctx: PdfRenderContext, character: ResolvedPdfCharacter) {
  const stats = [
    statValue(character, "spellcasting bonus"),
    statValue(character, "save dc"),
    statValue(character, "spellcasting ability"),
  ];

  stats.forEach((value, index) => {
    if (!value) {
      return;
    }
    drawCenteredTextInRect(ctx, value, rectFromFractions(SPELLCASTING_BOXES[index], { x: 0.14, y: 0.18, width: 0.72, height: 0.34 }), {
      font: index === 2 ? "Helvetica-Bold" : "Times-Bold",
      maxSize: index === 2 ? 9.8 : 14.5,
      minSize: 6,
      color: "#000000",
    });
  });
}

function renderAbilities(ctx: PdfRenderContext, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter, drawShell: boolean) {
  if (drawShell) {
    drawSvg(ctx, assets.abilityPanel, FRONT_PAGE_REGIONS.abilities);
  }

  const abilityRowsByLabel = new Map(character.frontPage.abilityRows.map((row) => [row.label.toUpperCase(), row]));

  ABILITY_VALUE_RECTS.forEach((slot) => {
    const row = abilityRowsByLabel.get(slot.label);
    if (!row) {
      return;
    }

    drawCenteredTextInRect(ctx, `${row.score}`, componentRect(FRONT_PAGE_REGIONS.abilities, ABILITY_PANEL_VIEWBOX, slot.score), {
      font: "Times-Bold",
      maxSize: 14.5,
      minSize: 8,
      color: "#000000",
    });
    drawCenteredTextInRect(ctx, signed(row.modifier), componentRect(FRONT_PAGE_REGIONS.abilities, ABILITY_PANEL_VIEWBOX, slot.modifier), {
      font: "Helvetica-Bold",
      maxSize: 6.6,
      minSize: 3.8,
      color: "#000000",
    });
  });
}

function renderSkillDots(ctx: PdfRenderContext, character: ResolvedPdfCharacter) {
  const skillRows = new Map(character.frontPage.skillRows.map((row) => [normalizeKey(row.label), row]));

  SKILL_GROUPS.forEach((skills, blockIndex) => {
    const centers = SKILL_DOT_CENTERS[blockIndex];
    skills.forEach((skill, skillIndex) => {
      const row = skillRows.get(normalizeKey(skill));
      if (!row) {
        return;
      }

      const center = componentRect(FRONT_PAGE_REGIONS.abilities, ABILITY_PANEL_VIEWBOX, {
        x: centers.x,
        y: centers.ys[skillIndex],
        width: 0,
        height: 0,
      });
      const centerX = center.x;
      const centerY = center.y;
      if (row.expertise) {
        strokeCircle(ctx, centerX, centerY, 1.8, "#000000", 0.4);
        fillCircle(ctx, centerX, centerY, 0.95, "#000000");
      } else if (row.proficient) {
        fillCircle(ctx, centerX, centerY, 1.25, "#000000");
      }

      drawCenteredTextInRect(ctx, signed(row.total), {
        x: centerX + 4.7,
        y: centerY - 3,
        width: 10,
        height: 5.8,
      }, {
        font: row.proficient || row.expertise ? "Helvetica-Bold" : "Helvetica",
        maxSize: 3.7,
        minSize: 2.6,
        color: "#000000",
      });
    });
  });
}

function renderPassives(ctx: PdfRenderContext, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter, drawShell: boolean) {
  if (drawShell) {
    drawSvg(ctx, assets.passivesAndSpeeds, FRONT_PAGE_REGIONS.passives);
  }

  const cells = splitColumns(FRONT_PAGE_REGIONS.passives, 12, 0);
  const abilityRows = new Map(character.frontPage.abilityRows.map((row) => [row.label.toUpperCase(), row]));
  const skillRows = new Map(character.frontPage.skillRows.map((row) => [normalizeKey(row.label), row]));
  const strength = abilityRows.get("STR")?.score ?? 10;
  const values = [
    `${strength}`,
    `${Math.max(0, Math.floor((strength + 3) / 4))}`,
    `${strength * 30}`,
    "",
    statValue(character, "passive perception"),
    skillRows.has("insight") ? `${10 + (skillRows.get("insight")?.total ?? 0)}` : "",
    skillRows.has("investigation") ? `${10 + (skillRows.get("investigation")?.total ?? 0)}` : "",
    statValue(character, "speed").replace(/\s*ft\.?/i, ""),
    "",
    "",
    "",
    "",
  ];

  values.forEach((value, index) => {
    if (!value) {
      return;
    }
    drawCenteredTextInRect(ctx, value, rectFromFractions(cells[index], { x: 0.10, y: 0.36, width: 0.80, height: 0.28 }), {
      font: "Helvetica-Bold",
      maxSize: 6.9,
      minSize: 3.6,
      color: "#000000",
    });
  });
}

function renderProficiencies(ctx: PdfRenderContext, character: ResolvedPdfCharacter) {
  const cells = splitColumns(insetRect(FRONT_PAGE_REGIONS.proficiencies, 8, 0), 5, 13);
  const groups = character.frontPage.proficiencyGroups;
  const values = [groups.weapons, groups.armor, groups.tools, groups.vehicles, groups.languages];

  values.forEach((items, index) => {
    if (!items.length) {
      return;
    }
    drawCenteredTextInRect(ctx, items.slice(0, 3).join(", "), rectFromFractions(cells[index], { x: 0.05, y: 0.20, width: 0.86, height: 0.50 }), {
      maxSize: 4.8,
      minSize: 2.8,
      align: "right",
      color: "#000000",
      lineGap: 0,
    });
  });
}

function renderAttacks(ctx: PdfRenderContext, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter, drawShell: boolean) {
  if (drawShell) {
    drawSvg(ctx, assets.weaponAttacks, FRONT_PAGE_REGIONS.attacks);
  }

  const rows = splitRows({ x: 18, y: 409, width: 360, height: 50 }, 5, 1);
  character.frontPage.attackRows.slice(0, 5).forEach((attack, index) => {
    const row = rows[index];
    drawFittedText(ctx, cleanText(attack.name), { x: row.x, y: row.y, width: 105, height: row.height }, { maxSize: 5.5, minSize: 4, color: "#000000" });
    drawCenteredTextInRect(ctx, cleanText(attack.hit), { x: row.x + 110, y: row.y, width: 30, height: row.height }, { maxSize: 5.5, minSize: 4, color: "#000000" });
    drawFittedText(ctx, cleanText(attack.damage), { x: row.x + 148, y: row.y, width: 72, height: row.height }, { maxSize: 5.5, minSize: 4, color: "#000000" });
    drawFittedText(ctx, cleanText(attack.properties), { x: row.x + 230, y: row.y, width: 130, height: row.height }, { maxSize: 5.5, minSize: 4, color: "#000000" });
  });
}

function cardCategory(card: PdfPageCard) {
  const text = `${card.title} ${card.summary} ${card.tags.join(" ")} ${card.sourceLabel ?? ""}`.toLowerCase();
  if (card.kind === "trait" || /\b(race|racial|subrace|lineage|dragonmark)\b/.test(text)) {
    return "Race";
  }
  if (/\b(subclass|college|archetype|circle|oath|patron|domain|tradition)\b/.test(text)) {
    return "Subclass";
  }
  if (/\b(feat|ability score improvement)\b/.test(text)) {
    return "Feat";
  }
  if (card.kind === "proficiency" || card.kind === "language") {
    return "Proficiency";
  }
  return "Class";
}

function summarizeCard(card: PdfPageCard): FeatureSummary {
  return {
    title: cleanText(card.title, "Feature"),
    category: cardCategory(card),
    source: truncateText(cleanText(card.sourceLabel), 16),
    body: truncateText(cleanText(card.summary || card.detail), 220),
  };
}

function renderFeatureList(ctx: PdfRenderContext, cards: PdfPageCard[], rect: PdfRect, columns: number) {
  const summaries = cards.map(summarizeCard);
  const columnRects = splitColumns(rect, columns, 16);
  const cursors = columnRects.map((column) => ({ ...column, y: column.y }));

  summaries.forEach((summary) => {
    const column = cursors.sort((left, right) => left.y - right.y)[0];
    const entryHeight = Math.max(18, Math.min(42, 12 + Math.ceil(summary.body.length / 55) * 6));
    if (column.y + entryHeight > rect.y + rect.height) {
      return;
    }

    drawFittedText(ctx, summary.title.toUpperCase(), { x: column.x, y: column.y, width: column.width, height: 5.5 }, {
      font: "Helvetica-Bold",
      maxSize: 4.9,
      minSize: 3.8,
      color: "#000000",
    });
    drawFittedText(ctx, summary.category.toUpperCase(), { x: column.x, y: column.y + 6, width: 48, height: 4 }, {
      font: "Helvetica-Bold",
      maxSize: 3,
      minSize: 2.4,
      color: "#777777",
    });
    if (summary.source) {
      drawFittedText(ctx, summary.source, { x: column.x + column.width - 54, y: column.y + 6, width: 54, height: 4 }, {
        maxSize: 2.8,
        minSize: 2.2,
        align: "right",
        color: "#8a8a8a",
      });
    }
    drawFittedText(ctx, summary.body, { x: column.x, y: column.y + 11, width: column.width, height: entryHeight - 13 }, {
      maxSize: 4.5,
      minSize: 3.2,
      color: "#000000",
      lineGap: 0,
    });
    strokeRule(ctx, column.x, column.y + entryHeight - 1.5, column.width);
    column.y += entryHeight + 5;
  });
}

function renderRail(ctx: PdfRenderContext, character: ResolvedPdfCharacter) {
  const railCards = character.frontPage.railCards.filter((card) => card.kind !== "proficiency" && card.kind !== "language");
  if (!railCards.length) {
    return;
  }

  maskRect(ctx, { x: 394, y: 190, width: 194, height: 300 });
  renderFeatureList(ctx, railCards, insetRect(FRONT_PAGE_REGIONS.rail, 8, 4), 1);
}

function renderFeatureDeck(ctx: PdfRenderContext, character: ResolvedPdfCharacter) {
  const cards = [
    ...character.frontPage.deck,
    ...character.frontPage.deckOverflow,
  ].filter((card) => card.kind !== "proficiency" && card.kind !== "language");

  if (!cards.length) {
    return;
  }

  maskRect(ctx, { x: 14, y: 518, width: 568, height: 318 });
  drawCenteredTextInRect(ctx, "FEATURES & TRAITS", { x: 28, y: 520, width: 530, height: 9 }, {
    font: "Helvetica-Bold",
    maxSize: 5.5,
    minSize: 4.3,
    color: "#222222",
  });
  renderFeatureList(ctx, cards, { x: 31, y: 542, width: 532, height: 274 }, 2);
}

export function renderFrontPage(ctx: PdfRenderContext, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter) {
  ctx.doc.addPage({ size: [PAGE_SIZE.width, PAGE_SIZE.height], margin: 0 });
  const hasTemplate = Boolean(assets.frontPageTemplate);

  if (hasTemplate) {
    drawSvg(ctx, assets.frontPageTemplate, { x: 0, y: 0, width: PAGE_SIZE.width, height: PAGE_SIZE.height }, "contain");
  }

  renderHeader(ctx, character);
  renderStatStrip(ctx, assets, character, !hasTemplate);
  renderAbilities(ctx, assets, character, !hasTemplate);
  renderSkillDots(ctx, character);
  renderSpellcasting(ctx, character);
  renderPassives(ctx, assets, character, !hasTemplate);
  renderProficiencies(ctx, character);
  renderAttacks(ctx, assets, character, !hasTemplate);
  renderRail(ctx, character);
  renderFeatureDeck(ctx, character);
}
