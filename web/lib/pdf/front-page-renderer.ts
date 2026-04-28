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
  mode?: "normal" | "wide" | "small";
};

type FeatureSummary = {
  title: string;
  category: string;
  source: string;
  body: string;
};

const TOP_STATS: StatBoxSpec[] = [
  { key: "proficiency bonus" },
  { key: "initiative" },
  { key: "attacks / action" },
  { key: "inspiration", fallback: "" },
  { key: "exhaustion", fallback: "0" },
  { key: "hp", mode: "wide" },
  { key: "hp", mode: "wide" },
  { key: "temp hp", fallback: "", mode: "small" },
  { key: "hit dice", mode: "wide" },
  { key: "ac", mode: "normal" },
  { key: "defenses", fallback: "" },
];

const TOP_STAT_TRACKS = [
  { x: 0.010, width: 0.085 },
  { x: 0.098, width: 0.085 },
  { x: 0.187, width: 0.085 },
  { x: 0.276, width: 0.085 },
  { x: 0.365, width: 0.085 },
  { x: 0.457, width: 0.060 },
  { x: 0.526, width: 0.095 },
  { x: 0.620, width: 0.065 },
  { x: 0.700, width: 0.090 },
  { x: 0.800, width: 0.070 },
  { x: 0.895, width: 0.085 },
] as const;

const ABILITY_ORDER = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;

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

function drawValueOnlyStatBox(ctx: PdfRenderContext, rect: PdfRect, value: string, mode: StatBoxSpec["mode"] = "normal") {
  if (!value) {
    return;
  }

  const valueRect = rectFromFractions(rect, {
    x: mode === "wide" ? 0.08 : 0.14,
    y: mode === "wide" ? 0.18 : 0.17,
    width: mode === "wide" ? 0.84 : 0.72,
    height: 0.34,
  });
  drawCenteredTextInRect(ctx, value, valueRect, {
    font: "Times-Bold",
    maxSize: mode === "small" ? 11 : 13,
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

  const cells = TOP_STAT_TRACKS.map((track) => rectFromFractions(FRONT_PAGE_REGIONS.statStrip, {
    x: track.x,
    y: 0,
    width: track.width,
    height: 1,
  }));
  TOP_STATS.forEach((spec, index) => {
    const value = statValue(character, spec.key, spec.fallback);
    drawValueOnlyStatBox(ctx, cells[index], value, spec.mode);
  });
}

function renderSpellcasting(ctx: PdfRenderContext, character: ResolvedPdfCharacter) {
  const boxes = splitColumns(FRONT_PAGE_REGIONS.spellcasting, 3, 8);
  const stats = [
    statValue(character, "spellcasting bonus"),
    statValue(character, "save dc"),
    statValue(character, "spellcasting ability"),
  ];

  stats.forEach((value, index) => {
    if (!value) {
      return;
    }
    drawCenteredTextInRect(ctx, value, insetRect(boxes[index], 8, 8), {
      font: index === 2 ? "Helvetica-Bold" : "Times-Bold",
      maxSize: index === 2 ? 9 : 14,
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
  const abilityArea = { x: FRONT_PAGE_REGIONS.abilities.x + 2, y: FRONT_PAGE_REGIONS.abilities.y + 2, width: 202, height: FRONT_PAGE_REGIONS.abilities.height - 4 };
  const rows = splitRows(abilityArea, 2, 12);
  const abilityCells = rows.flatMap((row) => splitColumns(row, 3, 8));

  ABILITY_ORDER.forEach((label, index) => {
    const row = abilityRowsByLabel.get(label);
    const cell = abilityCells[index];
    if (!row || !cell) {
      return;
    }

    drawCenteredTextInRect(ctx, `${row.score}`, rectFromFractions(cell, { x: 0.28, y: 0.44, width: 0.44, height: 0.18 }), {
      font: "Times-Bold",
      maxSize: 11.5,
      minSize: 8,
      color: "#000000",
    });
    drawCenteredTextInRect(ctx, signed(row.modifier), rectFromFractions(cell, { x: 0.32, y: 0.81, width: 0.36, height: 0.11 }), {
      font: "Helvetica-Bold",
      maxSize: 4.8,
      minSize: 3.8,
      color: "#000000",
    });
  });
}

function renderSkillDots(ctx: PdfRenderContext, character: ResolvedPdfCharacter) {
  const skillRows = new Map(character.frontPage.skillRows.map((row) => [normalizeKey(row.label), row]));
  const blockArea = { x: 221, y: 152, width: 166, height: 130 };
  const blocks = splitRows(blockArea, 2, 15).flatMap((row) => splitColumns(row, 2, 17));
  const rowGap = 8.75;

  SKILL_GROUPS.forEach((skills, blockIndex) => {
    const block = blocks[blockIndex];
    skills.forEach((skill, skillIndex) => {
      const row = skillRows.get(normalizeKey(skill));
      if (!row?.proficient && !row?.expertise) {
        return;
      }

      const centerX = block.x + 9.3;
      const centerY = block.y + 8.3 + skillIndex * rowGap;
      if (row.expertise) {
        strokeCircle(ctx, centerX, centerY, 2.05, "#000000", 0.45);
        fillCircle(ctx, centerX, centerY, 1.15, "#000000");
      } else {
        fillCircle(ctx, centerX, centerY, 1.55, "#000000");
      }
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
    drawCenteredTextInRect(ctx, value, rectFromFractions(cells[index], { x: 0.15, y: 0.40, width: 0.70, height: 0.20 }), {
      font: "Helvetica-Bold",
      maxSize: 4.2,
      minSize: 3.2,
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
    drawCenteredTextInRect(ctx, items.slice(0, 3).join(", "), rectFromFractions(cells[index], { x: 0.06, y: 0.30, width: 0.88, height: 0.36 }), {
      maxSize: 3.2,
      minSize: 2.5,
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
