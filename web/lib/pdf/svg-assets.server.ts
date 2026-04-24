import fs from "node:fs/promises";
import path from "node:path";

export const PDF_EXPORT_SVG_ASSET_PATHS = {
  frontPageTemplate: "SVGs for PDF/examples with svgs/Design general character sheet p1 v3.svg",
  frontPageHeader: "SVGs for PDF/Front Page Header.svg",
  abilityPanel: "SVGs for PDF/Ability scores, Saves, and ability checks.svg",
  hpPanel: "SVGs for PDF/HP and Bonuses full.svg",
  passivesAndSpeeds: "SVGs for PDF/Passives and speeds.svg",
  weaponAttacks: "SVGs for PDF/Weapon attacks.svg",
  generalContainer: "SVGs for PDF/General Box Container.svg",
  hitDie: "SVGs for PDF/Hit Die.svg",
  lines: "SVGs for PDF/Lines.svg",
  proficiencyBoolean: "SVGs for PDF/Proficiency check boolean.svg",
  ac: "SVGs for PDF/_AC.svg",
  bonusBox: "SVGs for PDF/_Bonus Box.svg",
  hp: "SVGs for PDF/_HP.svg",
  line: "SVGs for PDF/_Line.svg",
  lineBonusSkill: "SVGs for PDF/_Line bonus skill.svg",
  passiveBox: "SVGs for PDF/_Passive box.svg",
  proficiencyBox: "SVGs for PDF/_Proficiency Box.svg",
  skillBlock: "SVGs for PDF/_Skill Block.svg",
  skillLine: "SVGs for PDF/_Skill line.svg",
  statBlock: "SVGs for PDF/_Stat Block.svg",
  weaponLine: "SVGs for PDF/Weapon Line.svg",
} as const;

export type PdfSvgAssetKey = keyof typeof PDF_EXPORT_SVG_ASSET_PATHS;
export type PdfSvgAssetBundle = Partial<Record<PdfSvgAssetKey, string>>;

function resolvePdfAssetPath(relativePath: string) {
  return path.resolve(process.cwd(), "../", relativePath);
}

export async function loadPdfSvgAsset(key: PdfSvgAssetKey) {
  return fs.readFile(resolvePdfAssetPath(PDF_EXPORT_SVG_ASSET_PATHS[key]), "utf8");
}

export async function loadPdfSvgAssetBundle(keys: PdfSvgAssetKey[]) {
  const entries = await Promise.all(
    keys.map(async (key) => [key, await loadPdfSvgAsset(key)] as const),
  );

  return Object.fromEntries(entries) as PdfSvgAssetBundle;
}
