import type PDFDocument from "pdfkit";
import type SVGtoPDF from "svg-to-pdfkit";

export type PdfRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PdfTextOptions = {
  font?: string;
  size?: number;
  color?: string;
  align?: "left" | "center" | "right";
  lineGap?: number;
};

type PdfShapeDocument = PDFDocument & {
  rect: (x: number, y: number, width: number, height: number) => PdfShapeDocument;
  fill: (color?: string) => PdfShapeDocument;
};

export type PdfRenderContext = {
  doc: PDFDocument;
  svgToPdf: typeof SVGtoPDF;
  bodyFont: string;
};

export function insetRect(rect: PdfRect, inset: number): PdfRect;
export function insetRect(rect: PdfRect, xInset: number, yInset: number): PdfRect;
export function insetRect(rect: PdfRect, xInset: number, yInset = xInset): PdfRect {
  return {
    x: rect.x + xInset,
    y: rect.y + yInset,
    width: Math.max(0, rect.width - xInset * 2),
    height: Math.max(0, rect.height - yInset * 2),
  };
}

export function splitColumns(rect: PdfRect, count: number, gap = 0) {
  const width = (rect.width - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, index) => ({
    x: rect.x + index * (width + gap),
    y: rect.y,
    width,
    height: rect.height,
  }));
}

export function splitRows(rect: PdfRect, count: number, gap = 0) {
  const height = (rect.height - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, index) => ({
    x: rect.x,
    y: rect.y + index * (height + gap),
    width: rect.width,
    height,
  }));
}

export function drawSvg(
  ctx: PdfRenderContext,
  svg: string | undefined,
  rect: PdfRect,
  fit: "stretch" | "contain" = "stretch",
) {
  if (!svg) {
    return;
  }

  ctx.svgToPdf(ctx.doc, svg, rect.x, rect.y, {
    width: rect.width,
    height: rect.height,
    preserveAspectRatio: fit === "stretch" ? "none" : "xMidYMid meet",
    assumePt: true,
  });
}

function resolveFont(ctx: PdfRenderContext, font?: string) {
  return font || ctx.bodyFont;
}

export function fitTextSize(
  ctx: PdfRenderContext,
  text: string,
  rect: PdfRect,
  options: PdfTextOptions & { maxSize: number; minSize: number },
) {
  for (let size = options.maxSize; size >= options.minSize; size -= 0.25) {
    ctx.doc.save();
    ctx.doc.font(resolveFont(ctx, options.font));
    ctx.doc.fontSize(size);
    const measuredHeight = ctx.doc.heightOfString(text, {
      width: rect.width,
      height: rect.height,
      align: options.align || "left",
      lineBreak: true,
      ellipsis: true,
      lineGap: options.lineGap ?? size * 0.12,
    });
    ctx.doc.restore();

    if (measuredHeight <= rect.height) {
      return size;
    }
  }

  return options.minSize;
}

export function drawText(
  ctx: PdfRenderContext,
  text: string,
  rect: PdfRect,
  options: PdfTextOptions = {},
) {
  const size = options.size || 8;
  ctx.doc.font(resolveFont(ctx, options.font));
  ctx.doc.fontSize(size);
  ctx.doc.fillColor(options.color || "#111111");
  ctx.doc.text(text, rect.x, rect.y, {
    width: rect.width,
    height: rect.height,
    align: options.align || "left",
    lineBreak: true,
    ellipsis: true,
    lineGap: options.lineGap ?? size * 0.12,
  });
}

export function drawFittedText(
  ctx: PdfRenderContext,
  text: string,
  rect: PdfRect,
  options: PdfTextOptions & { maxSize: number; minSize: number },
) {
  drawText(ctx, text, rect, {
    ...options,
    size: fitTextSize(ctx, text, rect, options),
  });
}

export function drawCenteredTextInRect(
  ctx: PdfRenderContext,
  text: string,
  rect: PdfRect,
  options: PdfTextOptions & { maxSize: number; minSize: number },
) {
  if (!text.trim()) {
    return;
  }

  const size = fitTextSize(ctx, text, rect, {
    ...options,
    align: options.align || "center",
  });
  ctx.doc.save();
  ctx.doc.font(resolveFont(ctx, options.font));
  ctx.doc.fontSize(size);
  const lineGap = options.lineGap ?? size * 0.08;
  const measuredHeight = ctx.doc.heightOfString(text, {
    width: rect.width,
    align: options.align || "center",
    lineBreak: true,
    ellipsis: true,
    lineGap,
  });
  ctx.doc.restore();

  const y = rect.y + Math.max(0, (rect.height - measuredHeight) / 2);
  drawText(ctx, text, { ...rect, y }, {
    ...options,
    size,
    align: options.align || "center",
    lineGap,
  });
}

export function maskRect(ctx: PdfRenderContext, rect: PdfRect, color = "#ffffff") {
  const shapeDoc = ctx.doc as PdfShapeDocument;
  ctx.doc.save();
  shapeDoc.rect(rect.x, rect.y, rect.width, rect.height).fill(color);
  ctx.doc.restore();
}

export function strokeRule(ctx: PdfRenderContext, x: number, y: number, width: number, color = "#c8c8c8") {
  ctx.doc.save();
  ctx.doc.moveTo(x, y)
    .lineTo(x + width, y)
    .strokeColor(color)
    .lineWidth(0.35)
    .stroke();
  ctx.doc.restore();
}
