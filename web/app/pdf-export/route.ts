import { NextResponse } from "next/server";

import type { ResolvedPdfCharacter } from "@/lib/pdf/types";
import { generatePdfBytes } from "@/lib/pdf/generate";

function sanitizeFileName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s.-]+/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    || "arcanum-character";
}

export async function POST(request: Request) {
  let character: ResolvedPdfCharacter;

  try {
    character = (await request.json()) as ResolvedPdfCharacter;
  } catch {
    return NextResponse.json({ error: "Invalid export payload." }, { status: 400 });
  }

  if (!character?.frontPage?.stats || !character?.name) {
    return NextResponse.json({ error: "Missing character export data." }, { status: 400 });
  }

  const pdfBytes = generatePdfBytes(character);
  const fileName = `${sanitizeFileName(character.name)}.pdf`;

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": String(pdfBytes.byteLength),
      "Cache-Control": "no-store",
    },
  });
}
