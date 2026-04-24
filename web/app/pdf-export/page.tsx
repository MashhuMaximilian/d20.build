import type { Metadata } from "next";

import { PdfExportViewer } from "@/components/pdf-export-viewer";
import { loadPdfSvgAsset, loadPdfSvgAssetBundle } from "@/lib/pdf/svg-assets.server";

type PdfExportPageProps = {
  searchParams?: Promise<{
    token?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Arcanum PDF export",
};

export default async function PdfExportPage({ searchParams }: PdfExportPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const templateSvg = await loadPdfSvgAsset("frontPageTemplate");
  const svgAssets = await loadPdfSvgAssetBundle([
    "frontPageHeader",
    "abilityPanel",
    "hpPanel",
    "passivesAndSpeeds",
    "weaponAttacks",
    "generalContainer",
    "hitDie",
    "lines",
    "proficiencyBoolean",
    "ac",
    "bonusBox",
    "hp",
    "line",
    "lineBonusSkill",
    "passiveBox",
    "proficiencyBox",
    "skillBlock",
    "skillLine",
    "statBlock",
    "weaponLine",
  ]);

  return <PdfExportViewer templateSvg={templateSvg} svgAssets={svgAssets} token={params?.token ?? null} />;
}
