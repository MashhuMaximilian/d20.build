"use client";

import { useEffect, useMemo, useState } from "react";

import {
  clearPdfExportPayload,
  readPdfExportPayload,
} from "@/lib/pdf/session";
import type { ResolvedPdfCharacter } from "@/lib/pdf/types";

type PdfExportViewerProps = {
  templateSvg: string;
  token: string | null;
};

function formatCardTags(tags: string[]) {
  return tags.filter(Boolean).join(" · ");
}

function PdfStatCard({ label, value, meta }: { label: string; value: string; meta?: string }) {
  return (
    <article className="pdf-export__statCard">
      <span className="pdf-export__statLabel">{label}</span>
      <strong className="pdf-export__statValue">{value}</strong>
      {meta ? <span className="pdf-export__statMeta">{meta}</span> : null}
    </article>
  );
}

function PdfFeatureCard({
  title,
  summary,
  detail,
  tags,
  kind,
}: {
  detail?: string;
  kind: string;
  summary: string;
  tags: string[];
  title: string;
}) {
  return (
    <article className={`pdf-export__featureCard pdf-export__featureCard--${kind}`}>
      <header className="pdf-export__featureCardHeader">
        <h3>{title}</h3>
        {tags.length ? <span>{formatCardTags(tags)}</span> : null}
      </header>
      <p className="pdf-export__featureCardSummary">{summary}</p>
      {detail ? <div className="pdf-export__featureCardDetail">{detail}</div> : null}
    </article>
  );
}

function PdfRailGroup({
  title,
  cards,
}: {
  cards: ResolvedPdfCharacter["frontPage"]["railCards"];
  title: string;
}) {
  if (!cards.length) {
    return null;
  }

  return (
    <section className="pdf-export__railGroup">
      <h2>{title}</h2>
      <div className="pdf-export__railCards">
        {cards.map((card) => (
          <PdfFeatureCard key={card.id} title={card.title} summary={card.summary} detail={card.detail} tags={card.tags} kind={card.kind} />
        ))}
      </div>
    </section>
  );
}

function PdfFrontPage({ character }: { character: ResolvedPdfCharacter }) {
  const [traitCards, featureCards, conditionCards, senseCards, proficiencyCards, languageCards] = useMemo(() => {
    const all = character.frontPage.railCards;
    return [
      all.filter((card) => card.kind === "trait"),
      character.frontPage.deck,
      all.filter((card) => card.kind === "condition"),
      all.filter((card) => card.kind === "sense"),
      all.filter((card) => card.kind === "proficiency"),
      all.filter((card) => card.kind === "language"),
    ];
  }, [character.frontPage.deck, character.frontPage.railCards]);

  return (
    <div className="pdf-export__sheetContent">
        <header className="pdf-export__header">
          <div className="pdf-export__identity">
            <span className="pdf-export__eyebrow">Front</span>
            <h1>{character.name}</h1>
            <p>
              {character.classLabel || "Character"}{character.level ? ` · Level ${character.level}` : ""}
            </p>
          </div>
          <div className="pdf-export__identityMeta">
            <div>
              <span>Race</span>
              <strong>{[character.raceLabel, character.subraceLabel].filter(Boolean).join(" / ") || "—"}</strong>
            </div>
            <div>
              <span>Background</span>
              <strong>{character.backgroundLabel || "—"}</strong>
            </div>
            <div>
              <span>Player</span>
              <strong>{character.playerName || "—"}</strong>
            </div>
          </div>
        </header>

        <section className="pdf-export__statsSection">
          <h2>Numbers and stats</h2>
          <div className="pdf-export__statsGrid">
            {character.frontPage.stats.map((stat) => (
              <PdfStatCard key={stat.id} label={stat.label} value={stat.value} meta={stat.meta} />
            ))}
          </div>
        </section>

        <section className="pdf-export__featuresSection">
          <div className="pdf-export__deckArea">
            <h2>Features and traits</h2>
            <div className="pdf-export__featureGrid">
              {featureCards.map((card) => (
                <PdfFeatureCard key={card.id} title={card.title} summary={card.summary} detail={card.detail} tags={card.tags} kind={card.kind} />
              ))}
            </div>
          </div>

          <aside className="pdf-export__rail">
            <PdfRailGroup title="Racial traits" cards={traitCards} />
            <PdfRailGroup title="Conditions" cards={conditionCards} />
            <PdfRailGroup title="Senses" cards={senseCards} />
            <PdfRailGroup title="Proficiencies" cards={proficiencyCards} />
            <PdfRailGroup title="Languages" cards={languageCards} />
          </aside>
        </section>

        {character.frontPage.notes.length ? (
          <footer className="pdf-export__footerNotes">
            {character.frontPage.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </footer>
        ) : null}
    </div>
  );
}

export function PdfExportViewer({ templateSvg, token }: PdfExportViewerProps) {
  const [character, setCharacter] = useState<ResolvedPdfCharacter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Missing export token. Please go back and export again.");
      return;
    }

    const payload = readPdfExportPayload(token);
    if (!payload) {
      setError("Export data was not found. Please return to the builder and export again.");
      return;
    }

    clearPdfExportPayload(token);
    setCharacter(payload);
    setReady(true);
  }, [token]);

  useEffect(() => {
    if (!ready || !character) {
      return;
    }

    let cancelled = false;
    const schedulePrint = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      if (!cancelled) {
        window.print();
      }
    };

    void schedulePrint();

    return () => {
      cancelled = true;
    };
  }, [character, ready]);

  if (error) {
    return <div className="pdf-export__error">{error}</div>;
  }

  if (!character) {
    return <div className="pdf-export__loading">Loading export preview…</div>;
  }

  return (
    <div className="pdf-export">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        html, body {
          margin: 0;
          padding: 0;
          background: #efe4d2;
        }
        body {
          color: #4c2b1d;
          font-family: Georgia, "Times New Roman", serif;
        }
        .pdf-export {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #efe4d2;
          padding: 12px;
        }
        .pdf-export__sheet {
          position: relative;
          width: 210mm;
          height: 297mm;
          overflow: hidden;
          background: #f7f1e8;
          box-shadow: 0 18px 40px rgba(68, 42, 28, 0.14);
        }
        .pdf-export__templateSvg {
          position: absolute;
          inset: 0;
          opacity: 0.9;
          pointer-events: none;
          z-index: 0;
        }
        .pdf-export__templateSvg svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .pdf-export__sheetContent {
          position: absolute;
          inset: 0;
          padding: 18mm 14mm 14mm;
          display: grid;
          grid-template-rows: auto auto 1fr auto;
          gap: 8mm;
          z-index: 1;
        }
        .pdf-export__header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 14mm;
        }
        .pdf-export__identity h1 {
          margin: 0;
          font-size: 31px;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .pdf-export__identity p {
          margin: 6px 0 0;
          font-size: 13px;
          opacity: 0.82;
        }
        .pdf-export__eyebrow {
          display: inline-block;
          margin-bottom: 6px;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .pdf-export__identityMeta {
          min-width: 67mm;
          display: grid;
          gap: 4mm;
        }
        .pdf-export__identityMeta div {
          display: grid;
          gap: 2px;
        }
        .pdf-export__identityMeta span {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.6;
        }
        .pdf-export__identityMeta strong {
          font-size: 14px;
          font-weight: 700;
        }
        .pdf-export__statsSection h2,
        .pdf-export__deckArea h2 {
          margin: 0 0 5mm;
          font-size: 15px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .pdf-export__statsGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 4mm;
        }
        .pdf-export__statCard,
        .pdf-export__featureCard,
        .pdf-export__railGroup {
          background: rgba(255, 255, 255, 0.44);
          border: 1px solid rgba(170, 116, 77, 0.28);
          border-radius: 10px;
          box-shadow: 0 1px 0 rgba(80, 50, 36, 0.04);
        }
        .pdf-export__statCard {
          padding: 9px 10px 10px;
          min-height: 43mm;
          display: grid;
          grid-template-rows: auto auto 1fr;
          gap: 6px;
        }
        .pdf-export__statLabel {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.75;
        }
        .pdf-export__statValue {
          font-size: 28px;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .pdf-export__statMeta {
          align-self: end;
          font-size: 11px;
          line-height: 1.28;
          opacity: 0.78;
        }
        .pdf-export__featuresSection {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(56mm, 0.72fr);
          gap: 6mm;
          align-items: start;
        }
        .pdf-export__featureGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 3.5mm;
        }
        .pdf-export__featureCard {
          padding: 9px 10px 10px;
          break-inside: avoid;
        }
        .pdf-export__featureCardHeader {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: start;
          margin-bottom: 4px;
        }
        .pdf-export__featureCardHeader h3 {
          margin: 0;
          font-size: 13px;
          line-height: 1.15;
        }
        .pdf-export__featureCardHeader span {
          font-size: 9px;
          opacity: 0.65;
          text-align: right;
        }
        .pdf-export__featureCardSummary {
          margin: 0;
          font-size: 11px;
          line-height: 1.3;
          opacity: 0.9;
        }
        .pdf-export__featureCardDetail {
          margin-top: 6px;
          font-size: 10px;
          line-height: 1.34;
          white-space: pre-wrap;
          opacity: 0.82;
        }
        .pdf-export__rail {
          display: grid;
          gap: 4mm;
        }
        .pdf-export__railGroup {
          padding: 8px;
        }
        .pdf-export__railGroup h2 {
          margin: 0 0 4px;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .pdf-export__railCards {
          display: grid;
          gap: 4px;
        }
        .pdf-export__railCards .pdf-export__featureCard {
          padding: 7px 8px 8px;
        }
        .pdf-export__railCards .pdf-export__featureCardHeader h3 {
          font-size: 11px;
        }
        .pdf-export__railCards .pdf-export__featureCardSummary,
        .pdf-export__railCards .pdf-export__featureCardDetail {
          font-size: 9px;
        }
        .pdf-export__footerNotes {
          font-size: 10px;
          opacity: 0.72;
          display: grid;
          gap: 3px;
        }
        .pdf-export__error,
        .pdf-export__loading {
          max-width: 800px;
          padding: 32px;
          background: white;
          border-radius: 14px;
          border: 1px solid rgba(170, 116, 77, 0.28);
          box-shadow: 0 18px 40px rgba(68, 42, 28, 0.12);
        }
        @media print {
          .pdf-export {
            display: block;
            padding: 0;
            background: white;
          }
          .pdf-export__sheet {
            box-shadow: none;
          }
        }
      `}</style>
      <div className="pdf-export__sheet">
        <div className="pdf-export__templateSvg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: templateSvg }} />
        <PdfFrontPage character={character} />
      </div>
    </div>
  );
}
