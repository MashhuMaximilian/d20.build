import type { PdfRect } from "@/lib/pdf/drawing";

export const PAGE_SIZE = {
  width: 595,
  height: 842,
} as const;

export const FRONT_PAGE_REGIONS = {
  header: { x: 10, y: 10, width: 575, height: 69 },
  statStrip: { x: 10, y: 84, width: 570, height: 51 },
  abilities: { x: 10, y: 144, width: 384, height: 152 },
  passives: { x: 10, y: 302, width: 378, height: 40 },
  proficiencies: { x: 10, y: 342, width: 378, height: 50 },
  attacks: { x: 10, y: 392, width: 378, height: 92 },
  spellcasting: { x: 394, y: 144, width: 190, height: 45 },
  rail: { x: 394, y: 194, width: 190, height: 282 },
  features: { x: 16, y: 520, width: 563, height: 300 },
} satisfies Record<string, PdfRect>;

export function rectFromFractions(region: PdfRect, fractions: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return {
    x: region.x + region.width * fractions.x,
    y: region.y + region.height * fractions.y,
    width: region.width * fractions.width,
    height: region.height * fractions.height,
  };
}
