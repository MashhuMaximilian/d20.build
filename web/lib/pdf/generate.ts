import type { ResolvedPdfCharacter } from "@/lib/pdf/types";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

type TextStyle = {
  size: number;
  font: "F1" | "F2";
};

function mm(value: number) {
  return (value * 72) / 25.4;
}

function normalizeForPdf(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2026]/g, "...")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

function stripHtml(value: string) {
  return normalizeForPdf(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(value: string, fontSize: number, maxWidth: number) {
  const text = stripHtml(value);
  if (!text) {
    return [] as string[];
  }

  const approxChars = Math.max(12, Math.floor(maxWidth / (fontSize * 0.52)));
  const words = text.split(/\s+/g);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= approxChars) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    if (word.length > approxChars) {
      const chunks = word.match(new RegExp(`.{1,${approxChars}}`, "g")) ?? [word];
      lines.push(...chunks.slice(0, -1));
      current = chunks[chunks.length - 1] ?? "";
      continue;
    }

    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function pageY(top: number, height = 0) {
  return PAGE_HEIGHT - top - height;
}

function rect(x: number, top: number, width: number, height: number, options?: { fill?: string; stroke?: string; lineWidth?: number }) {
  const fill = options?.fill ?? "1 1 1";
  const stroke = options?.stroke ?? "0.78 0.53 0.37";
  const lineWidth = options?.lineWidth ?? 0.75;
  return [
    `${fill} rg`,
    `${stroke} RG`,
    `${lineWidth} w`,
    `${x.toFixed(2)} ${pageY(top, height).toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re`,
    `B`,
  ];
}

function line(x1: number, top1: number, x2: number, top2: number, options?: { stroke?: string; lineWidth?: number }) {
  const stroke = options?.stroke ?? "0.78 0.53 0.37";
  const lineWidth = options?.lineWidth ?? 0.75;
  return [
    `${stroke} RG`,
    `${lineWidth} w`,
    `${x1.toFixed(2)} ${pageY(top1).toFixed(2)} m`,
    `${x2.toFixed(2)} ${pageY(top2).toFixed(2)} l`,
    `S`,
  ];
}

function text(x: number, top: number, value: string, style: TextStyle) {
  const safe = escapePdfText(normalizeForPdf(value));
  return [
    `BT`,
    `/${style.font} ${style.size.toFixed(2)} Tf`,
    `1 0 0 1 ${x.toFixed(2)} ${pageY(top, style.size).toFixed(2)} Tm`,
    `(${safe}) Tj`,
    `ET`,
  ];
}

function textBlock(
  x: number,
  top: number,
  width: number,
  value: string,
  style: TextStyle,
  options?: { maxLines?: number; lineGap?: number },
) {
  const lines = wrapText(value, style.size, width);
  const maxLines = options?.maxLines ?? lines.length;
  const lineGap = options?.lineGap ?? Math.max(3, Math.round(style.size * 0.38));
  const commands: string[] = [];

  lines.slice(0, maxLines).forEach((entry, index) => {
    commands.push(...text(x, top + index * (style.size + lineGap), entry, style));
  });

  return commands;
}

function buildContent(character: ResolvedPdfCharacter) {
  const commands: string[] = [];
  const margin = mm(10);
  const gutter = mm(4);
  const innerWidth = PAGE_WIDTH - margin * 2;
  const leftWidth = mm(92);
  const rightWidth = innerWidth - leftWidth - gutter;
  const topStart = mm(18);
  const headerHeight = mm(24);
  const leftX = margin;
  const rightX = margin + leftWidth + gutter;

  commands.push(...rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, { fill: "0.97 0.94 0.89", stroke: "0.97 0.94 0.89", lineWidth: 0 }));

  // Header band
  commands.push(...rect(margin, topStart, innerWidth, headerHeight, { fill: "0.99 0.98 0.95", stroke: "0.78 0.53 0.37", lineWidth: 1.1 }));
  commands.push(...text(leftX + mm(4), topStart + mm(4), character.name, { size: 22, font: "F2" }));
  commands.push(...text(leftX + mm(4), topStart + mm(13), "Front page export", { size: 8, font: "F1" }));

  const metaX = rightX + mm(2);
  const metaWidth = rightWidth - mm(4);
  const metaLines = [
    `Class: ${character.classLabel || "Unknown"}`,
    `Level: ${character.level}`,
    `Race: ${character.raceLabel || "Unknown"}`,
    `Background: ${character.backgroundLabel || "Unknown"}`,
    character.playerName ? `Player: ${character.playerName}` : "",
  ].filter(Boolean);
  metaLines.forEach((entry, index) => {
    commands.push(...text(metaX, topStart + mm(4) + index * mm(4.5), entry, { size: 9.5, font: "F1" }));
  });
  commands.push(...line(margin + mm(2), topStart + headerHeight + mm(4), PAGE_WIDTH - margin - mm(2), topStart + headerHeight + mm(4), { lineWidth: 0.9 }));

  // Left column: stats, skills, attacks
  const statsTop = topStart + headerHeight + mm(8);
  commands.push(...text(leftX, statsTop, "Numbers and stats", { size: 13, font: "F2" }));
  const stats = character.frontPage.stats;
  const statColumns = 2;
  const statGap = mm(3);
  const statCardWidth = (leftWidth - statGap) / statColumns;
  const statCardHeight = mm(15);
  const statStartTop = statsTop + mm(6);

  stats.forEach((stat, index) => {
    const column = index % statColumns;
    const row = Math.floor(index / statColumns);
    const x = leftX + column * (statCardWidth + statGap);
    const y = statStartTop + row * (statCardHeight + statGap);
    commands.push(...rect(x, y, statCardWidth, statCardHeight, { fill: "0.99 0.98 0.95" }));
    commands.push(...text(x + mm(2.2), y + mm(2.4), stat.label, { size: 7.5, font: "F2" }));
    commands.push(...text(x + mm(2.2), y + mm(8.2), stat.value, { size: 13, font: "F2" }));
    if (stat.meta) {
      commands.push(...textBlock(x + mm(2.2), y + mm(12.2), statCardWidth - mm(4.4), stat.meta, { size: 5.6, font: "F1" }, { maxLines: 2 }));
    }
  });

  const statsRows = Math.ceil(stats.length / statColumns);
  const skillsTop = statStartTop + statsRows * (statCardHeight + statGap) + mm(3);
  commands.push(...text(leftX, skillsTop, "Skills", { size: 12, font: "F2" }));
  commands.push(...rect(leftX, skillsTop + mm(4.5), leftWidth, mm(55), { fill: "0.99 0.98 0.95" }));
  const skillRows = character.frontPage.skillRows.slice(0, 12);
  const skillColumns = 2;
  const skillColumnWidth = (leftWidth - mm(6)) / skillColumns;
  skillRows.forEach((skill, index) => {
    const column = index % skillColumns;
    const row = Math.floor(index / skillColumns);
    const x = leftX + mm(2) + column * skillColumnWidth;
    const y = skillsTop + mm(8) + row * mm(7.5);
    commands.push(...text(x, y, `${skill.label}`, { size: 7.5, font: "F1" }));
    commands.push(...text(x + skillColumnWidth - mm(8), y, `${skill.total >= 0 ? "+" : ""}${skill.total}`, { size: 7.5, font: "F2" }));
  });

  const attacksTop = skillsTop + mm(63);
  commands.push(...text(leftX, attacksTop, "Attacks", { size: 12, font: "F2" }));
  commands.push(...rect(leftX, attacksTop + mm(4.5), leftWidth, mm(46), { fill: "0.99 0.98 0.95" }));
  commands.push(...text(leftX + mm(2), attacksTop + mm(9), "Name", { size: 7.5, font: "F2" }));
  commands.push(...text(leftX + mm(46), attacksTop + mm(9), "Hit", { size: 7.5, font: "F2" }));
  commands.push(...text(leftX + mm(70), attacksTop + mm(9), "Damage", { size: 7.5, font: "F2" }));
  const attacks = character.frontPage.attackRows.slice(0, 4);
  attacks.forEach((attack, index) => {
    const y = attacksTop + mm(14) + index * mm(8.2);
    commands.push(...text(leftX + mm(2), y, attack.name, { size: 7.2, font: "F1" }));
    commands.push(...text(leftX + mm(46), y, attack.hit, { size: 7.2, font: "F1" }));
    commands.push(...text(leftX + mm(70), y, attack.damage, { size: 7.2, font: "F1" }));
  });

  // Right column: feature deck and rails
  const featureTop = statsTop;
  commands.push(...text(rightX, featureTop, "Features and traits", { size: 13, font: "F2" }));
  const featureGap = mm(3);
  const featureColumns = 2;
  const featureCardWidth = (rightWidth - featureGap) / featureColumns;
  const featureCardHeight = mm(24);
  const features = [...character.frontPage.deck, ...character.frontPage.railCards].slice(0, 6);
  const featureStartTop = featureTop + mm(6);
  features.forEach((card, index) => {
    const column = index % featureColumns;
    const row = Math.floor(index / featureColumns);
    const x = rightX + column * (featureCardWidth + featureGap);
    const y = featureStartTop + row * (featureCardHeight + featureGap);
    commands.push(...rect(x, y, featureCardWidth, featureCardHeight, { fill: "0.99 0.98 0.95" }));
    commands.push(...text(x + mm(2), y + mm(2.4), card.title, { size: 8.5, font: "F2" }));
    if (card.sourceLabel) {
      commands.push(...text(x + featureCardWidth - mm(2), y + mm(2.4), card.sourceLabel, { size: 5.5, font: "F1" }));
    }
    commands.push(...textBlock(x + mm(2), y + mm(8), featureCardWidth - mm(4), card.summary, { size: 6.7, font: "F1" }, { maxLines: 3 }));
    if (card.tags.length) {
      commands.push(...textBlock(x + mm(2), y + featureCardHeight - mm(6), featureCardWidth - mm(4), card.tags.join(" · "), { size: 5.2, font: "F1" }, { maxLines: 1 }));
    }
  });

  const deckRows = Math.ceil(features.length / featureColumns);
  const railTop = featureStartTop + deckRows * (featureCardHeight + featureGap) + mm(3);
  commands.push(...text(rightX, railTop, "Senses, conditions, and references", { size: 11, font: "F2" }));
  commands.push(...rect(rightX, railTop + mm(4), rightWidth, mm(34), { fill: "0.99 0.98 0.95" }));
  const railText = character.frontPage.railCards
    .slice(0, 4)
    .map((card) => `${card.title}: ${card.summary}`)
    .join("  •  ");
  commands.push(...textBlock(rightX + mm(2), railTop + mm(8), rightWidth - mm(4), railText || "No rail cards on this character.", { size: 6.4, font: "F1" }, { maxLines: 4 }));

  const footerTop = PAGE_HEIGHT - mm(12);
  const noteLine = character.frontPage.notes.length
    ? character.frontPage.notes.join(" | ")
    : "Front page PDF export";
  commands.push(...text(leftX, footerTop, noteLine, { size: 6.6, font: "F1" }));
  commands.push(...text(PAGE_WIDTH - margin - mm(20), footerTop, "Page 1", { size: 7, font: "F2" }));

  return commands.join("\n");
}

function buildPdfObjects(character: ResolvedPdfCharacter) {
  const content = buildContent(character);
  const objects = [
    `<< /Type /Catalog /Pages 2 0 R >>`,
    `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH.toFixed(2)} ${PAGE_HEIGHT.toFixed(2)}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`,
    `<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream`,
  ];

  return objects;
}

export function generatePdfBytes(character: ResolvedPdfCharacter) {
  const objects = buildPdfObjects(character);
  const parts: string[] = [];
  parts.push("%PDF-1.4\n");

  const offsets: number[] = [0];
  let length = Buffer.byteLength(parts[0], "utf8");

  objects.forEach((object, index) => {
    offsets.push(length);
    const chunk = `${index + 1} 0 obj\n${object}\nendobj\n`;
    parts.push(chunk);
    length += Buffer.byteLength(chunk, "utf8");
  });

  const xrefOffset = length;
  const xrefLines = ["xref", `0 ${objects.length + 1}`, "0000000000 65535 f "];
  offsets.slice(1).forEach((offset) => {
    xrefLines.push(`${offset.toString().padStart(10, "0")} 00000 n `);
  });
  const trailer = [
    "trailer",
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    "startxref",
    `${xrefOffset}`,
    "%%EOF",
  ].join("\n");

  parts.push(`${xrefLines.join("\n")}\n${trailer}`);
  return Buffer.from(parts.join(""), "utf8");
}
