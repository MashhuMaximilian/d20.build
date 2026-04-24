import fs from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";

import { PdfExportViewer } from "@/components/pdf-export-viewer";

type PdfExportPageProps = {
  searchParams?: Promise<{
    token?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Arcanum PDF export",
};

async function loadFrontPageTemplate() {
  const templatePath = path.resolve(
    process.cwd(),
    "../SVGs for PDF/examples with svgs/Design general character sheet p1 v3.svg",
  );
  return fs.readFile(templatePath, "utf8");
}

export default async function PdfExportPage({ searchParams }: PdfExportPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const templateSvg = await loadFrontPageTemplate();

  return <PdfExportViewer templateSvg={templateSvg} token={params?.token ?? null} />;
}
