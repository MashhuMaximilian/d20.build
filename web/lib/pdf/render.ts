import type { ResolvedPdfCharacter } from "@/lib/pdf/types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderCard(title: string, summary: string, detail?: string, tags: string[] = []) {
  return `
    <article class="pdf-card">
      <div class="pdf-card__head">
        <h3>${escapeHtml(title)}</h3>
        ${tags.length ? `<p>${escapeHtml(tags.join(" · "))}</p>` : ""}
      </div>
      <p class="pdf-card__summary">${escapeHtml(summary)}</p>
      ${detail ? `<div class="pdf-card__detail">${escapeHtml(detail)}</div>` : ""}
    </article>
  `;
}

function renderSection(title: string, cards: Array<{ title: string; summary: string; detail?: string; tags: string[] }>) {
  return `
    <section class="pdf-page__section">
      <h2>${escapeHtml(title)}</h2>
      <div class="pdf-cardGrid">
        ${cards.map((card) => renderCard(card.title, card.summary, card.detail, card.tags)).join("")}
      </div>
    </section>
  `;
}

export function buildPdfExportHtml(character: ResolvedPdfCharacter) {
  const pages = character.pagePlan.length ? character.pagePlan : [];

  const body = pages
    .map((page) => {
      const sections = page.sections
        .map((section) => renderSection(section.title, section.cards))
        .join("");
      return `
        <section class="pdf-page">
          <header class="pdf-page__header">
            <div>
              <span class="pdf-page__eyebrow">${escapeHtml(page.kind.toUpperCase())}</span>
              <h1>${escapeHtml(character.name)}</h1>
            </div>
            <div class="pdf-page__meta">
              <strong>Page ${page.number}</strong>
              <span>${escapeHtml(character.classLabel || character.backgroundLabel || "Character sheet")}</span>
            </div>
          </header>
          ${sections}
        </section>
      `;
    })
    .join("");

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(character.name)} - PDF export</title>
      <style>
        :root {
          color-scheme: light;
          --ink: #4a2b1e;
          --paper: #f7f1e8;
          --line: #d6b79d;
          --shadow: rgba(74, 43, 30, 0.06);
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          color: var(--ink);
          background: #eee5d7;
        }
        .pdf-page {
          width: 210mm;
          min-height: 297mm;
          page-break-after: always;
          padding: 14mm;
          background: var(--paper);
          border: 1px solid var(--line);
        }
        .pdf-page__header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: start;
          padding-bottom: 10mm;
          border-bottom: 1px solid var(--line);
          margin-bottom: 10mm;
        }
        .pdf-page__eyebrow {
          display: inline-block;
          margin-bottom: 8px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        h1 {
          margin: 0;
          font-size: 28px;
          line-height: 1.05;
        }
        .pdf-page__meta {
          text-align: right;
          display: grid;
          gap: 4px;
        }
        .pdf-page__section + .pdf-page__section {
          margin-top: 10mm;
        }
        .pdf-page__section h2 {
          margin: 0 0 6mm;
          font-size: 16px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .pdf-cardGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .pdf-card {
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 10px;
          box-shadow: 0 1px 0 var(--shadow);
          background: rgba(255,255,255,0.36);
          break-inside: avoid;
        }
        .pdf-card__head {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: start;
          margin-bottom: 6px;
        }
        .pdf-card__head h3 {
          margin: 0;
          font-size: 13px;
        }
        .pdf-card__head p {
          margin: 0;
          font-size: 10px;
          opacity: 0.75;
        }
        .pdf-card__summary {
          margin: 0 0 6px;
          font-size: 11px;
        }
        .pdf-card__detail {
          font-size: 10px;
          line-height: 1.35;
          white-space: pre-wrap;
          opacity: 0.9;
        }
        @media print {
          body { background: white; }
          .pdf-page { border: none; margin: 0; page-break-after: always; }
        }
      </style>
    </head>
    <body>
      ${body}
      <script>
        window.addEventListener('load', () => {
          setTimeout(() => window.print(), 250);
        });
      </script>
    </body>
  </html>`;
}

