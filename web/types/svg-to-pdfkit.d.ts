declare module "svg-to-pdfkit" {
  import type PDFDocument from "pdfkit";

  export type SVGtoPDFOptions = {
    width?: number;
    height?: number;
    preserveAspectRatio?: string;
    assumePt?: boolean;
  };

  function SVGtoPDF(
    doc: PDFDocument,
    svg: string,
    x: number,
    y: number,
    options?: SVGtoPDFOptions,
  ): void;

  export default SVGtoPDF;
}
