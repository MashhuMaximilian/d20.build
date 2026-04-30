import fs from "node:fs/promises";
import path from "node:path";

export const PDF_EXPORT_SVG_ASSET_PATHS = {
  frontPageTemplate: "pdf-svg/examples with svgs/Design general character sheet p1 v3.svg",
  frontPageHeader: "pdf-svg/Front Page Header.svg",
  abilityPanel: "pdf-svg/Ability scores, Saves, and ability checks.svg",
  hpPanel: "pdf-svg/HP and Bonuses full.svg",
  passivesAndSpeeds: "pdf-svg/Passives and speeds.svg",
  weaponAttacks: "pdf-svg/Weapon attacks.svg",
  generalContainer: "pdf-svg/General Box Container.svg",
  greyBackground: "pdf-svg/_Grey background.svg",
  hitDie: "pdf-svg/Hit Die.svg",
  lines: "pdf-svg/Lines.svg",
  proficiencyBoolean: "pdf-svg/Proficiency check boolean.svg",
  ac: "pdf-svg/_AC.svg",
  bonusBox: "pdf-svg/_Bonus Box.svg",
  hp: "pdf-svg/_HP.svg",
  line: "pdf-svg/_Line.svg",
  lineBonusSkill: "pdf-svg/_Line bonus skill.svg",
  passiveBox: "pdf-svg/_Passive box.svg",
  proficiencyBox0: "pdf-svg/_Proficiency Box 0.svg",
  proficiencyBox1: "pdf-svg/_Proficiency box 1.svg",
  skillBlock: "pdf-svg/_Skill Block.svg",
  skillLine: "pdf-svg/_Skill line.svg",
  statBlock: "pdf-svg/_Stat Block.svg",
  weaponLine: "pdf-svg/Weapon Line.svg",
} as const;

export type PdfSvgAssetKey = keyof typeof PDF_EXPORT_SVG_ASSET_PATHS;
export type PdfSvgAssetBundle = Partial<Record<PdfSvgAssetKey, string>>;

function resolvePdfAssetPath(relativePath: string) {
  const candidates = [
    path.resolve(process.cwd(), "public", relativePath),
    path.resolve(process.cwd(), "web", "public", relativePath),
  ];

  return candidates;
}

export async function loadPdfSvgAsset(key: PdfSvgAssetKey) {
  const candidates = resolvePdfAssetPath(PDF_EXPORT_SVG_ASSET_PATHS[key]);

  for (const candidate of candidates) {
    try {
      return await fs.readFile(candidate, "utf8");
    } catch {
      // Try the next candidate.
    }
  }

  throw new Error(`Unable to locate PDF SVG asset: ${PDF_EXPORT_SVG_ASSET_PATHS[key]}`);
}

export async function loadPdfSvgAssetBundle(keys: PdfSvgAssetKey[]) {
  const entries = await Promise.all(
    keys.map(async (key) => [key, await loadPdfSvgAsset(key)] as const),
  );

  return Object.fromEntries(entries) as PdfSvgAssetBundle;
}
