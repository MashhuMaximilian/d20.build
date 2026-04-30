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

type RailNote = {
  title: string;
  value: string;
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

const STAT_BLOCKS = [
  { label: "STR", x: 3, y: 0 },
  { label: "DEX", x: 63, y: 0 },
  { label: "CON", x: 123, y: 0 },
  { label: "INT", x: 3, y: 80 },
  { label: "WIS", x: 63, y: 80 },
  { label: "CHA", x: 123, y: 80 },
] as const;

const ABILITY_PANEL_VIEWBOX = { width: 384, height: 152 } as const;
const PASSIVES_VIEWBOX = { width: 378, height: 40 } as const;
const SKILL_BLOCK_VIEWBOX = { width: 78, height: 63 } as const;
const STAT_BLOCK_VIEWBOX = { width: 55, height: 72 } as const;
const TOP_STAT_VIEWBOX = { width: 570, height: 51 } as const;

const SKILL_BLOCKS = [
  { x: 196, y: 8, width: 88, height: 70, ability: "STR + DEX", skills: ["Athletics", "Acrobatics", "Sleight of Hand", "Stealth"] },
  { x: 290, y: 8, width: 88, height: 70, ability: "INT", skills: ["Arcana", "History", "Investigation", "Nature", "Religion"] },
  { x: 196, y: 82, width: 88, height: 70, ability: "WIS", skills: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"] },
  { x: 290, y: 82, width: 88, height: 70, ability: "CHA", skills: ["Deception", "Intimidation", "Performance", "Persuasion"] },
] as const;

const STAT_ROW_BACKGROUNDS = [
  { x: -1, y: 9, width: 184, height: 54 },
  { x: -1, y: 89, width: 184, height: 54 },
] as const;

const STAT_VALUE_SLOTS = {
  save: { x: 11, y: 7.2, width: 33, height: 9.2 },
  score: { x: 10.5, y: 26.8, width: 34, height: 15.5 },
  labelMask: { x: 14, y: 44.4, width: 28, height: 6.8 },
  label: { x: 10, y: 45, width: 35, height: 8 },
  modifier: { x: 12, y: 57.2, width: 31, height: 10.6 },
} as const;

const SKILL_ROW_SLOTS = {
  circleX: 11.5,
  firstCenterY: 9.5,
  rowGap: 9,
  bonusMask: { x: 16, yOffset: -2.5, width: 6.15, height: 5 },
  bonusValue: { x: 14.8, yOffset: -2.7, width: 10.4, height: 5.4 },
  line: { x: 9, width: 57, height: 5 },
  lineLabelMask: { x: 14, width: 43, height: 5 },
  label: { x: 26.4, yOffset: -3.35, width: 46.6, height: 6.7 },
} as const;

const PASSIVE_BOXES = [
  { x: 0, y: 6.04, width: 28.14, height: 33.96 },
  { x: 29.14, y: 6.04, width: 28.14, height: 33.96 },
  { x: 58.28, y: 6.04, width: 28.14, height: 33.96 },
  { x: 87.42, y: 6.04, width: 28.14, height: 33.96 },
  { x: 131.22, y: 6.04, width: 28.14, height: 33.96 },
  { x: 160.36, y: 6.04, width: 28.14, height: 33.96 },
  { x: 189.5, y: 6.04, width: 28.14, height: 33.96 },
  { x: 233.3, y: 6.04, width: 28.14, height: 33.96 },
  { x: 262.44, y: 6.04, width: 28.14, height: 33.96 },
  { x: 291.58, y: 6.04, width: 28.14, height: 33.96 },
  { x: 320.72, y: 6.04, width: 28.14, height: 33.96 },
  { x: 349.86, y: 6.04, width: 28.14, height: 33.96 },
] as const;

const SPELLCASTING_BOXES = [
  { x: 397, y: 145, width: 53, height: 44 },
  { x: 465, y: 145, width: 53, height: 44 },
  { x: 532, y: 145, width: 53, height: 44 },
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

function findStat(character: ResolvedPdfCharacter, key: string) {
  return character.frontPage.stats.find((candidate) => normalizeKey(candidate.label) === key);
}

function findStatsByIdPrefix(character: ResolvedPdfCharacter, prefix: string) {
  const normalizedPrefix = normalizeKey(prefix);
  return character.frontPage.stats.filter((candidate) => normalizeKey(candidate.id).startsWith(normalizedPrefix));
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

function componentPoint(region: PdfRect, viewBox: { width: number; height: number }, point: { x: number; y: number }) {
  return {
    x: region.x + point.x * (region.width / viewBox.width),
    y: region.y + point.y * (region.height / viewBox.height),
  };
}

function componentRadius(region: PdfRect, viewBox: { width: number; height: number }, radius: number) {
  return radius * Math.min(region.width / viewBox.width, region.height / viewBox.height);
}

function fitSingleLineSize(
  ctx: PdfRenderContext,
  text: string,
  rect: PdfRect,
  options: { font?: string; maxSize: number; minSize: number },
) {
  for (let size = options.maxSize; size >= options.minSize; size -= 0.25) {
    ctx.doc.save();
    ctx.doc.font(options.font || ctx.bodyFont).fontSize(size);
    const width = ctx.doc.widthOfString(text);
    ctx.doc.restore();
    if (width <= rect.width && size * 0.95 <= rect.height) {
      return size;
    }
  }

  return options.minSize;
}

function drawSocketText(
  ctx: PdfRenderContext,
  text: string,
  rect: PdfRect,
  options: { font?: string; maxSize: number; minSize: number; color?: string },
) {
  if (!text.trim()) {
    return;
  }

  const font = options.font || ctx.bodyFont;
  const size = fitSingleLineSize(ctx, text, rect, options);
  ctx.doc.save();
  ctx.doc.font(font).fontSize(size);
  const width = ctx.doc.widthOfString(text);
  const x = rect.x + Math.max(0, (rect.width - width) / 2);
  const y = rect.y + Math.max(0, (rect.height - size * 0.82) / 2) - size * 0.05;
  ctx.doc.fillColor(options.color || "#000000");
  ctx.doc.text(text, x, y, {
    width,
    height: rect.height,
    lineBreak: false,
  });
  ctx.doc.restore();
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
    font: "Helvetica-Bold",
    maxSize: mode === "small" ? 11 : mode === "shield" ? 12 : 13.5,
    minSize: 7,
    color: "#000000",
  });
}

function renderHeader(ctx: PdfRenderContext, character: ResolvedPdfCharacter, drawShell: boolean) {
  drawFittedText(ctx, cleanText(character.name, "Unnamed character"), { x: 30, y: 37, width: 166, height: 17 }, {
    font: "Times-Bold",
    maxSize: 17,
    minSize: 10,
    color: "#000000",
  });

  const classLevel = [
    character.level ? `Lvl ${character.level}` : "",
    character.subclassLabel,
    character.classLabel || "Character",
  ]
    .filter(Boolean)
    .join(" ");
  const headerFields = [
    {
      label: "RACE",
      value: character.raceLabel,
      labelRect: { x: 250, y: 22.8, width: 54, height: 3.5 },
      valueRect: { x: 246, y: 30.0, width: 64, height: 7.2 },
    },
    {
      label: "LINEAGE",
      value: character.subraceLabel,
      labelRect: { x: 315, y: 22.8, width: 82, height: 3.5 },
      valueRect: { x: 311, y: 30.0, width: 90, height: 7.2 },
    },
    {
      label: "CLASS & LEVEL",
      value: classLevel,
      labelRect: { x: 406, y: 22.8, width: 92, height: 3.5 },
      valueRect: { x: 401, y: 30.0, width: 112, height: 7.2 },
    },
    {
      label: "PLAYER",
      value: character.playerName,
      labelRect: { x: 502, y: 22.8, width: 52, height: 3.5 },
      valueRect: { x: 498, y: 30.0, width: 58, height: 7.2 },
    },
    {
      label: "BACKGROUND",
      value: character.backgroundLabel,
      labelRect: { x: 250, y: 44.7, width: 74, height: 3.5 },
      valueRect: { x: 246, y: 52.0, width: 84, height: 7.0 },
    },
    {
      label: "EXP",
      value: "",
      labelRect: { x: 350, y: 44.7, width: 36, height: 3.5 },
      valueRect: { x: 346, y: 52.0, width: 64, height: 7.0 },
    },
  ];

  headerFields.forEach((field) => {
    if (drawShell) {
      drawCenteredTextInRect(ctx, field.label, field.labelRect, {
        font: "Helvetica-Bold",
        maxSize: 2.6,
        minSize: 3,
        color: "#9a9a9a",
      });
    } else if (field.label === "EXP") {
      drawCenteredTextInRect(ctx, field.label, field.labelRect, {
        font: "Helvetica-Bold",
        maxSize: 2.6,
        minSize: 3,
        color: "#9a9a9a",
      });
    }
    if (!field.value) {
      return;
    }
    drawCenteredTextInRect(ctx, cleanText(field.value), field.valueRect, {
      font: "Helvetica",
      maxSize: field.label === "CLASS & LEVEL" ? 3.8 : 4.4,
      minSize: 4,
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

function renderSpellcasting(ctx: PdfRenderContext, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter) {
  const stats = [
    statValue(character, "spellcasting bonus"),
    statValue(character, "save dc"),
    statValue(character, "spellcasting ability"),
  ];
  const kiSaveDc = statValue(character, "ki save dc");
  const classResources = findStatsByIdPrefix(character, "class-resource-")
    .map((resource) => ({
      label: cleanText(resource.meta, "Class Resource"),
      value: cleanText(resource.value, ""),
    }))
    .filter((resource) => resource.value);
  const hasSpellcasting = stats.some(Boolean);
  const hasKiDc = Boolean(kiSaveDc);
  const hasClassResource = classResources.length > 0;

  if (!hasSpellcasting && !hasKiDc && !hasClassResource) {
    maskRect(ctx, { x: 393, y: 142, width: 194, height: 49 });
    return;
  }

  if (!hasSpellcasting && hasKiDc) {
    maskRect(ctx, { x: 393, y: 142, width: 194, height: 49 });
    const leftBox = { x: hasClassResource ? 405 : 431, y: 145, width: hasClassResource ? 82 : 116, height: 40 };
    drawSvg(ctx, assets.proficiencyBox, leftBox);
    drawCenteredTextInRect(ctx, kiSaveDc, rectFromFractions(leftBox, { x: 0.14, y: 0.17, width: 0.72, height: 0.38 }), {
      font: "Helvetica-Bold",
      maxSize: 14.5,
      minSize: 6,
      color: "#000000",
    });
    drawCenteredTextInRect(ctx, "KI SAVE DC", rectFromFractions(leftBox, { x: 0.10, y: 0.70, width: 0.80, height: 0.16 }), {
      font: "Helvetica",
      maxSize: 5,
      minSize: 3.5,
      color: "#000000",
    });

    if (hasClassResource) {
      const resource = classResources[0];
      const rightBox = { x: 495, y: 145, width: 82, height: 40 };
      drawSvg(ctx, assets.generalContainer, rightBox);
      drawCenteredTextInRect(ctx, resource.value, rectFromFractions(rightBox, { x: 0.12, y: 0.18, width: 0.76, height: 0.34 }), {
        font: "Helvetica-Bold",
        maxSize: 13.4,
        minSize: 6,
        color: "#000000",
      });
      drawCenteredTextInRect(ctx, resource.label.toUpperCase(), rectFromFractions(rightBox, { x: 0.10, y: 0.65, width: 0.80, height: 0.22 }), {
        font: "Helvetica",
        maxSize: 4.4,
        minSize: 3.1,
        color: "#000000",
      });
    }
    return;
  }

  if (!hasSpellcasting && hasClassResource) {
    maskRect(ctx, { x: 393, y: 142, width: 194, height: 49 });
    const resourceBoxes =
      classResources.length > 1
        ? [
            { x: 405, y: 145, width: 82, height: 40 },
            { x: 495, y: 145, width: 82, height: 40 },
          ]
        : [{ x: 431, y: 145, width: 116, height: 40 }];
    classResources.slice(0, resourceBoxes.length).forEach((resource, index) => {
      const resourceBox = resourceBoxes[index];
      drawSvg(ctx, assets.generalContainer, resourceBox);
      drawCenteredTextInRect(ctx, resource.value, rectFromFractions(resourceBox, { x: 0.10, y: 0.16, width: 0.80, height: 0.34 }), {
        font: "Helvetica-Bold",
        maxSize: resourceBox.width > 100 ? 13.8 : 12.2,
        minSize: 6,
        color: "#000000",
      });
      drawCenteredTextInRect(ctx, resource.label.toUpperCase(), rectFromFractions(resourceBox, { x: 0.08, y: 0.62, width: 0.84, height: 0.24 }), {
        font: "Helvetica",
        maxSize: resourceBox.width > 100 ? 4.8 : 3.9,
        minSize: 2.8,
        color: "#000000",
      });
    });
    return;
  }

  if (!hasSpellcasting) {
    return;
  }

  maskRect(ctx, { x: 393, y: 142, width: 194, height: 49 });

  const spellBox = { x: 398, y: 145, width: hasClassResource ? 120 : 178, height: 40 };
  drawSvg(ctx, assets.proficiencyBox, spellBox);
  maskRect(ctx, rectFromFractions(spellBox, { x: 0.16, y: 0.64, width: 0.68, height: 0.30 }));
  const thirds = splitColumns(insetRect(spellBox, 10, 6), 3, 8);
  const labels = ["BONUS", "SAVE DC", "ABILITY"];

  stats.forEach((value, index) => {
    if (!value) {
      return;
    }
    drawCenteredTextInRect(ctx, value, rectFromFractions(thirds[index], { x: 0.05, y: 0.14, width: 0.90, height: 0.38 }), {
      font: "Helvetica-Bold",
      maxSize: index === 1 ? 10.5 : 13.6,
      minSize: 6,
      color: "#000000",
    });
    drawCenteredTextInRect(ctx, labels[index], rectFromFractions(thirds[index], { x: 0.02, y: 0.68, width: 0.96, height: 0.18 }), {
      font: "Helvetica",
      maxSize: index === 1 ? 3.9 : 4.5,
      minSize: 2.8,
      color: "#000000",
    });
  });

  drawCenteredTextInRect(ctx, "SPELLCASTING", rectFromFractions(spellBox, { x: 0.15, y: 0.73, width: 0.70, height: 0.11 }), {
    font: "Helvetica-Bold",
    maxSize: 3.4,
    minSize: 2.4,
    color: "#000000",
  });

  if (hasClassResource) {
    const primaryResource = classResources[0];
    const rightBox = { x: 523, y: 145, width: 54, height: 40 };
    drawSvg(ctx, assets.generalContainer, rightBox);
    drawCenteredTextInRect(ctx, primaryResource.value, rectFromFractions(rightBox, { x: 0.08, y: 0.18, width: 0.84, height: 0.34 }), {
      font: "Helvetica-Bold",
      maxSize: 12.4,
      minSize: 5,
      color: "#000000",
    });
    drawCenteredTextInRect(ctx, primaryResource.label.toUpperCase(), rectFromFractions(rightBox, { x: 0.06, y: 0.60, width: 0.88, height: 0.18 }), {
      font: "Helvetica",
      maxSize: 3.6,
      minSize: 2.3,
      color: "#000000",
    });
  }
}

function cardHasGroup(card: PdfPageCard, group: string) {
  return card.tags.includes(`pdf-group:${group}`);
}

function extractRailNotes(cards: PdfPageCard[]) {
  const lines: RailNote[] = [];
  const seen = new Set<string>();
  const pushLine = (title: string, value: string) => {
    const normalized = value.trim();
    if (!normalized) {
      return;
    }
    const key = `${title.toLowerCase()}::${normalized.toLowerCase()}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    lines.push({ title, value: normalized });
  };

  cards.forEach((card) => {
    card.tags
      .filter((tag) => tag.startsWith("pdf-note:"))
      .forEach((tag) => {
        const [, title, ...rest] = tag.split(":");
        if (!title || !rest.length) {
          return;
        }
        const value = rest.join(":").trim();
        const titleMap: Record<string, string> = {
          resistance: "Resistance",
          vulnerability: "Vulnerability",
          immunity: "Immunity",
          condition: "Condition",
          "condition-edge": "Condition Edge",
          rest: "Rest",
          sense: "Sense",
          speed: "Speed",
        };
        pushLine(titleMap[title] ?? title, value);
      });

    const body = cleanText(card.detail || card.summary || "");
    const source = `${card.title} ${body}`.toLowerCase();

    if (/resistance to poison damage|poison resistance/.test(source)) {
      pushLine("Resistance", "Poison");
    }
    const resistanceMatch = body.match(/resistance to ([a-z ,/-]+?) damage/i);
    if (resistanceMatch) {
      pushLine("Resistance", resistanceMatch[1].replace(/\b\w/g, (char) => char.toUpperCase()));
    }
    const vulnerabilityMatch = body.match(/vulnerab(?:le|ility) to ([a-z ,/-]+?) damage/i);
    if (vulnerabilityMatch) {
      pushLine("Vulnerability", vulnerabilityMatch[1].replace(/\b\w/g, (char) => char.toUpperCase()));
    }
    const immunityMatch = body.match(/immune to ([a-z ,/-]+?)(?: damage|\b)/i);
    if (immunityMatch && !/disease/i.test(immunityMatch[1])) {
      pushLine("Immunity", immunityMatch[1].replace(/\b\w/g, (char) => char.toUpperCase()));
    }
    if (/immune to disease/.test(source)) {
      pushLine("Immunity", "Disease");
    }
    if (/don'?t need to sleep|sentry'?s rest/.test(source)) {
      pushLine("Rest", "Sentry's Rest");
    }
    if (/advantage on saving throws against being poisoned|advantage .* poisoned/.test(source)) {
      pushLine("Condition Edge", "Adv. vs Poisoned");
    }
    const darkvisionMatch = body.match(/darkvision(?:\s+out\s+to|\s+to|\s+of)?\s+(\d+)\s*feet?/i);
    if (darkvisionMatch) {
      pushLine("Sense", `Darkvision ${darkvisionMatch[1]} ft`);
    }
    const conditionImmunityMatch = body.match(/immune to the ([a-z-]+) condition/i);
    if (conditionImmunityMatch) {
      pushLine("Condition", `Immune ${conditionImmunityMatch[1]}`);
    }
    const speedMatch = body.match(/walking speed is increased by (\d+) feet?/i);
    if (speedMatch) {
      pushLine("Speed", `+${speedMatch[1]} ft`);
    }
    if (/flying speed of (\d+) feet|you have a flying speed of (\d+) feet/i.test(body)) {
      const match = body.match(/flying speed of (\d+) feet|you have a flying speed of (\d+) feet/i);
      const value = match?.[1] || match?.[2];
      if (value) {
        pushLine("Speed", `Fly ${value} ft`);
      }
    }
  });

  return lines.slice(0, 8);
}

function drawSkillMarker(ctx: PdfRenderContext, center: { x: number; y: number }, row: { proficient: boolean; expertise: boolean }) {
  if (row.expertise) {
    strokeCircle(ctx, center.x, center.y, 1.95, "#000000", 0.65);
    fillCircle(ctx, center.x, center.y, 0.78, "#000000");
    return;
  }

  if (row.proficient) {
    fillCircle(ctx, center.x, center.y, 1.92, "#000000");
  }
}

function renderAbilities(ctx: PdfRenderContext, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter, drawShell: boolean) {
  const canRecompose = Boolean(assets.statBlock && assets.generalContainer);
  const abilityRegion = canRecompose
    ? { ...FRONT_PAGE_REGIONS.abilities, y: 136 }
    : FRONT_PAGE_REGIONS.abilities;
  if (canRecompose) {
    maskRect(ctx, { x: 0, y: 136, width: 394, height: 164 });
  } else if (drawShell && (!assets.statBlock || !assets.skillBlock)) {
    drawSvg(ctx, assets.abilityPanel, abilityRegion);
  }

  const hasPrintedTemplate = !drawShell && !canRecompose;
  const abilityRowsByLabel = new Map(character.frontPage.abilityRows.map((row) => [row.label.toUpperCase(), row]));
  const skillRows = new Map(character.frontPage.skillRows.map((row) => [normalizeKey(row.label), row]));

  if (assets.statBlock) {
    if (!hasPrintedTemplate && assets.greyBackground) {
      STAT_ROW_BACKGROUNDS.forEach((background) => {
        drawSvg(ctx, assets.greyBackground, componentRect(abilityRegion, ABILITY_PANEL_VIEWBOX, background));
      });
    }

    STAT_BLOCKS.forEach((slot) => {
      const row = abilityRowsByLabel.get(slot.label);
      if (!row) {
        return;
      }

      const block = componentRect(abilityRegion, ABILITY_PANEL_VIEWBOX, {
        x: slot.x,
        y: slot.y,
        width: STAT_BLOCK_VIEWBOX.width,
        height: STAT_BLOCK_VIEWBOX.height,
      });
      if (!hasPrintedTemplate) {
        drawSvg(ctx, assets.statBlock, block);
        maskRect(ctx, componentRect(block, STAT_BLOCK_VIEWBOX, STAT_VALUE_SLOTS.labelMask));
      }
      if (row.saveProficient) {
        const saveMarker = componentPoint(block, STAT_BLOCK_VIEWBOX, { x: 27.7, y: 3 });
        fillCircle(ctx, saveMarker.x, saveMarker.y, componentRadius(block, STAT_BLOCK_VIEWBOX, 2.1), "#000000");
      }
      drawSocketText(ctx, signed(row.saveBonus), componentRect(block, STAT_BLOCK_VIEWBOX, STAT_VALUE_SLOTS.save), {
        font: "Helvetica-Bold",
        maxSize: 10.4,
        minSize: 4.4,
        color: "#000000",
      });
      drawSocketText(ctx, `${row.score}`, componentRect(block, STAT_BLOCK_VIEWBOX, STAT_VALUE_SLOTS.score), {
        font: "Helvetica-Bold",
        maxSize: 15.4,
        minSize: 8,
        color: "#000000",
      });
      if (!hasPrintedTemplate) {
        drawCenteredTextInRect(ctx, slot.label, componentRect(block, STAT_BLOCK_VIEWBOX, STAT_VALUE_SLOTS.label), {
          font: "Helvetica",
          maxSize: 7.2,
          minSize: 5,
          color: "#000000",
        });
      }
      drawSocketText(ctx, signed(row.modifier), componentRect(block, STAT_BLOCK_VIEWBOX, STAT_VALUE_SLOTS.modifier), {
        font: "Helvetica-Bold",
        maxSize: 8.6,
        minSize: 5,
        color: "#000000",
      });
    });
  }

  if (assets.skillBlock || assets.generalContainer) {
    if (drawShell || canRecompose) {
      drawCenteredTextInRect(ctx, "ABILITY CHECKS", { x: 204, y: abilityRegion.y - 4, width: 170, height: 8 }, {
        maxSize: 4.4,
        minSize: 3.5,
        color: "#9a9a9a",
      });
    }

    SKILL_BLOCKS.forEach((slot) => {
      const block = componentRect(abilityRegion, ABILITY_PANEL_VIEWBOX, {
        x: slot.x,
        y: slot.y,
        width: slot.width,
        height: slot.height,
      });
      if (canRecompose && assets.generalContainer) {
        drawSvg(ctx, assets.generalContainer, block);
      } else if (!hasPrintedTemplate && assets.skillBlock) {
        drawSvg(ctx, assets.skillBlock, block);
      }

      slot.skills.forEach((skill, index) => {
        const row = skillRows.get(normalizeKey(skill));
        if (!row) {
          return;
        }

        const centerY = SKILL_ROW_SLOTS.firstCenterY + index * SKILL_ROW_SLOTS.rowGap;
        const circleCenter = componentPoint(block, SKILL_BLOCK_VIEWBOX, { x: SKILL_ROW_SLOTS.circleX, y: centerY });

        if (canRecompose && assets.skillLine) {
          const lineRect = componentRect(block, SKILL_BLOCK_VIEWBOX, {
            x: SKILL_ROW_SLOTS.line.x,
            y: centerY - SKILL_ROW_SLOTS.line.height / 2,
            width: SKILL_ROW_SLOTS.line.width,
            height: SKILL_ROW_SLOTS.line.height,
          });
          drawSvg(ctx, assets.skillLine, lineRect);
          maskRect(ctx, componentRect(lineRect, { width: 57, height: 5 }, {
            x: SKILL_ROW_SLOTS.lineLabelMask.x,
            y: 0,
            width: SKILL_ROW_SLOTS.lineLabelMask.width,
            height: SKILL_ROW_SLOTS.lineLabelMask.height,
          }));
        } else {
          maskRect(ctx, componentRect(block, SKILL_BLOCK_VIEWBOX, {
            x: hasPrintedTemplate ? SKILL_ROW_SLOTS.bonusMask.x : 15,
            y: centerY + (hasPrintedTemplate ? SKILL_ROW_SLOTS.bonusMask.yOffset : -3.2),
            width: hasPrintedTemplate ? SKILL_ROW_SLOTS.bonusMask.width : 60,
            height: hasPrintedTemplate ? SKILL_ROW_SLOTS.bonusMask.height : 6.4,
          }));
        }
        drawSkillMarker(ctx, circleCenter, row);

        drawSocketText(ctx, signed(row.total), componentRect(block, SKILL_BLOCK_VIEWBOX, {
          x: SKILL_ROW_SLOTS.bonusValue.x,
          y: centerY + SKILL_ROW_SLOTS.bonusValue.yOffset,
          width: SKILL_ROW_SLOTS.bonusValue.width,
          height: SKILL_ROW_SLOTS.bonusValue.height,
        }), {
          font: "Helvetica-Bold",
          maxSize: 5.1,
          minSize: 2.5,
          color: "#000000",
        });
        if (!hasPrintedTemplate || canRecompose) {
          drawFittedText(ctx, skill, componentRect(block, SKILL_BLOCK_VIEWBOX, {
            x: SKILL_ROW_SLOTS.label.x,
            y: centerY + SKILL_ROW_SLOTS.label.yOffset,
            width: SKILL_ROW_SLOTS.label.width,
            height: SKILL_ROW_SLOTS.label.height,
          }), {
            font: "Helvetica",
            maxSize: 5.45,
            minSize: 3.1,
            color: "#000000",
          });
        }
      });
      if (!hasPrintedTemplate || canRecompose) {
        maskRect(ctx, componentRect(block, SKILL_BLOCK_VIEWBOX, { x: 24, y: 52, width: 30, height: 8 }));
        drawCenteredTextInRect(ctx, slot.ability, componentRect(block, SKILL_BLOCK_VIEWBOX, { x: 0, y: 53, width: 78, height: 7 }), {
          font: "Helvetica-Bold",
          maxSize: 5.2,
          minSize: 3.8,
          color: "#9a9a9a",
        });
      }
    });
  }
}

function renderPassives(ctx: PdfRenderContext, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter, drawShell: boolean) {
  if (drawShell) {
    drawSvg(ctx, assets.passivesAndSpeeds, FRONT_PAGE_REGIONS.passives);
  }

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
    const cell = componentRect(FRONT_PAGE_REGIONS.passives, PASSIVES_VIEWBOX, PASSIVE_BOXES[index]);
    drawCenteredTextInRect(ctx, value, rectFromFractions(cell, { x: 0.06, y: 0.07, width: 0.88, height: 0.40 }), {
      font: "Helvetica-Bold",
      maxSize: 10.2,
      minSize: 4.2,
      color: "#000000",
    });
  });
}

function renderProficiencies(ctx: PdfRenderContext, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter) {
  const cells = splitColumns(insetRect(FRONT_PAGE_REGIONS.proficiencies, 8, 0), 5, 13);
  const groups = character.frontPage.proficiencyGroups;
  const values = [groups.weapons, groups.armor, groups.tools, groups.vehicles, groups.languages];

  values.forEach((items, index) => {
    if (assets.proficiencyBox) {
      drawSvg(ctx, assets.proficiencyBox, cells[index]);
    }
    if (!items.length) {
      return;
    }
    drawCenteredTextInRect(ctx, items.slice(0, 3).join(", "), rectFromFractions(cells[index], { x: 0.10, y: 0.18, width: 0.78, height: 0.52 }), {
      maxSize: 5.1,
      minSize: 2.8,
      align: "left",
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
    drawFittedText(ctx, cleanText(attack.type), { x: row.x + 225, y: row.y, width: 40, height: row.height }, { maxSize: 5.2, minSize: 3.6, color: "#000000" });
    drawFittedText(ctx, cleanText(attack.properties), { x: row.x + 268, y: row.y, width: 92, height: row.height }, { maxSize: 5.0, minSize: 3.5, color: "#000000" });
  });
}

function cardCategory(card: PdfPageCard) {
  const explicitGroup = card.tags.find((tag) => tag.startsWith("pdf-group:"))?.slice("pdf-group:".length);
  if (explicitGroup === "race") {
    return "Racial";
  }
  if (explicitGroup === "subrace") {
    return "Subracial";
  }
  if (explicitGroup === "class") {
    return "Class";
  }
  if (explicitGroup === "subclass") {
    return "Subclass";
  }
  if (explicitGroup === "feat") {
    return "Feat";
  }
  if (explicitGroup === "additional") {
    return "Additional";
  }
  if (explicitGroup === "other") {
    return "Other";
  }

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

type FeatureGroupSection = {
  id: string;
  title: string;
  cards: PdfPageCard[];
};

function toFeatureDeckGroupId(card: PdfPageCard) {
  if (cardHasGroup(card, "class")) {
    return "class";
  }
  if (cardHasGroup(card, "subclass")) {
    return "subclass";
  }
  if (cardHasGroup(card, "feat")) {
    return "feat";
  }
  if (cardHasGroup(card, "additional")) {
    return "additional";
  }
  return "other";
}

function buildFeatureDeckGroups(cards: PdfPageCard[]) {
  const groups = new Map<string, FeatureGroupSection>([
    ["class", { id: "class", title: "CLASS FEATURES", cards: [] }],
    ["subclass", { id: "subclass", title: "SUBCLASS FEATURES", cards: [] }],
    ["feat", { id: "feat", title: "FEATS", cards: [] }],
    ["additional", { id: "additional", title: "ADDITIONAL FEATURES", cards: [] }],
    ["other", { id: "other", title: "OTHER / CONDITIONAL", cards: [] }],
  ]);

  cards.forEach((card) => {
    groups.get(toFeatureDeckGroupId(card))?.cards.push(card);
  });

  return [...groups.values()].filter((group) => group.cards.length);
}

function estimateFeatureListHeight(cards: PdfPageCard[]) {
  return cards
    .map(summarizeCard)
    .reduce((total, summary) => total + Math.max(18, Math.min(42, 12 + Math.ceil(summary.body.length / 55) * 6)) + 5, 0);
}

function renderGroupedFeatureDeck(ctx: PdfRenderContext, cards: PdfPageCard[], rect: PdfRect) {
  const groups = buildFeatureDeckGroups(cards);
  const columns = splitColumns(rect, 2, 16);
  let columnIndex = 0;
  let cursorY = columns[0].y;

  groups.forEach((group) => {
    const requiredHeight = 10 + estimateFeatureListHeight(group.cards) + 6;
    const column = columns[columnIndex];
    if (cursorY + requiredHeight > column.y + column.height && columnIndex < columns.length - 1) {
      columnIndex += 1;
      cursorY = columns[columnIndex].y;
    }

    const activeColumn = columns[columnIndex];
    drawFittedText(ctx, group.title, { x: activeColumn.x, y: cursorY, width: activeColumn.width, height: 6 }, {
      font: "Helvetica-Bold",
      maxSize: 4.8,
      minSize: 3.8,
      color: "#444444",
    });
    strokeRule(ctx, activeColumn.x, cursorY + 7, activeColumn.width);

    const listRect = {
      x: activeColumn.x,
      y: cursorY + 10,
      width: activeColumn.width,
      height: Math.max(18, activeColumn.y + activeColumn.height - (cursorY + 10)),
    };
    renderFeatureList(ctx, group.cards, listRect, 1);
    cursorY += Math.min(requiredHeight, activeColumn.height) + 6;
  });
}

function renderRail(ctx: PdfRenderContext, character: ResolvedPdfCharacter) {
  const railCards = character.frontPage.railCards.filter((card) => card.kind !== "proficiency" && card.kind !== "language");
  const noteCards = railCards.filter((card) => card.kind === "condition" || card.kind === "sense");
  const racialCards = railCards.filter((card) => cardHasGroup(card, "race") || cardHasGroup(card, "subrace") || card.kind === "trait");
  const noteLines = extractRailNotes([...noteCards, ...racialCards]);

  const notesRect = { x: FRONT_PAGE_REGIONS.rail.x + 8, y: FRONT_PAGE_REGIONS.rail.y + 10, width: FRONT_PAGE_REGIONS.rail.width - 16, height: 86 };
  const traitsRect = { x: FRONT_PAGE_REGIONS.rail.x + 8, y: FRONT_PAGE_REGIONS.rail.y + 106, width: FRONT_PAGE_REGIONS.rail.width - 16, height: FRONT_PAGE_REGIONS.rail.height - 114 };

  maskRect(ctx, notesRect);
  noteLines.forEach((line, index) => {
    const y = notesRect.y + index * 10;
    if (y + 8 > notesRect.y + notesRect.height) {
      return;
    }
    drawFittedText(ctx, `${line.title}: ${line.value}`, { x: notesRect.x + 2, y, width: notesRect.width - 4, height: 8 }, {
      font: "Helvetica",
      maxSize: 5.5,
      minSize: 3.8,
      color: "#000000",
    });
  });

  if (!racialCards.length) {
    return;
  }

  maskRect(ctx, traitsRect);
  renderFeatureList(ctx, racialCards, traitsRect, 1);
}

function renderFeatureDeck(ctx: PdfRenderContext, character: ResolvedPdfCharacter) {
  const cards = [
    ...character.frontPage.deck,
    ...character.frontPage.deckOverflow,
  ].filter(
    (card) =>
      card.kind !== "proficiency" &&
      card.kind !== "language" &&
      !cardHasGroup(card, "race") &&
      !cardHasGroup(card, "subrace"),
  );

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
  renderGroupedFeatureDeck(ctx, cards, { x: 31, y: 542, width: 532, height: 274 });
}

export function renderFrontPage(ctx: PdfRenderContext, assets: PdfSvgAssetBundle, character: ResolvedPdfCharacter) {
  ctx.doc.addPage({ size: [PAGE_SIZE.width, PAGE_SIZE.height], margin: 0 });
  const hasTemplate = Boolean(assets.frontPageTemplate);

  if (hasTemplate) {
    drawSvg(ctx, assets.frontPageTemplate, { x: 0, y: 0, width: PAGE_SIZE.width, height: PAGE_SIZE.height }, "contain");
  }

  renderHeader(ctx, character, !hasTemplate);
  renderStatStrip(ctx, assets, character, !hasTemplate);
  renderAbilities(ctx, assets, character, !hasTemplate);
  renderSpellcasting(ctx, assets, character);
  renderPassives(ctx, assets, character, !hasTemplate);
  renderProficiencies(ctx, assets, character);
  renderAttacks(ctx, assets, character, !hasTemplate);
  renderRail(ctx, character);
  renderFeatureDeck(ctx, character);
}
