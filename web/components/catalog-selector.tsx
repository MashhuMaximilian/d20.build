"use client";

import { useMemo, useState } from "react";

type CatalogItem = {
  id: string;
  name: string;
  description: string;
  meta?: string;
  origin?: "built-in" | "imported";
  source?: string;
  tags?: string[];
};

type CatalogSelectorProps = {
  emptyMessage?: string;
  items: CatalogItem[];
  label: string;
  onSelect: (id: string) => void;
  selectedId: string;
};

export function CatalogSelector({
  emptyMessage = "No matching entries.",
  items,
  label,
  onSelect,
  selectedId,
}: CatalogSelectorProps) {
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "srd" | "imported">("all");
  const [isExpanded, setIsExpanded] = useState(false);

  function getPreviewText(text: string) {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length <= 260) {
      return normalized;
    }

    const sentenceBreak = normalized.slice(0, 260).lastIndexOf(". ");
    if (sentenceBreak > 80) {
      return `${normalized.slice(0, sentenceBreak + 1)}…`;
    }

    return `${normalized.slice(0, 240).trimEnd()}…`;
  }

  function getParagraphs(text: string) {
    const normalized = text.replace(/\s+/g, " ").trim();

    if (!normalized) {
      return [];
    }

    const sentences = normalized.split(/(?<=[.!?])\s+/);
    const paragraphs: string[] = [];

    for (let index = 0; index < sentences.length; index += 3) {
      paragraphs.push(sentences.slice(index, index + 3).join(" "));
    }

    return paragraphs;
  }

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return items.filter((item) => {
      const sourceMatches =
        sourceFilter === "all" ||
        item.origin === (sourceFilter === "srd" ? "built-in" : "imported");

      if (!sourceMatches) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      const haystack = `${item.name} ${item.description} ${item.meta ?? ""} ${item.source ?? ""} ${(item.tags ?? []).join(" ")}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [items, query, sourceFilter]);

  const selectedItem =
    filteredItems.find((item) => item.id === selectedId) ??
    filteredItems[0] ??
    items.find((item) => item.id === selectedId) ??
    items[0] ??
    null;

  const renderContent = (mode: "inline" | "modal") => (
    <>
      <div className="catalog-selector__toolbar">
        <span className="builder-panel__label">{label}</span>
        <div className="catalog-selector__toolbarActions">
          <div className="catalog-selector__filters">
            <button
              className={`choice-chip${sourceFilter === "all" ? " choice-chip--active" : ""}`}
              type="button"
              onClick={() => setSourceFilter("all")}
            >
              All
            </button>
            <button
              className={`choice-chip${sourceFilter === "srd" ? " choice-chip--active" : ""}`}
              type="button"
              onClick={() => setSourceFilter("srd")}
            >
              SRD
            </button>
            <button
              className={`choice-chip${sourceFilter === "imported" ? " choice-chip--active" : ""}`}
              type="button"
              onClick={() => setSourceFilter("imported")}
            >
              Imported
            </button>
          </div>
          <input
            className="input catalog-selector__search"
            placeholder={`Search ${label.toLowerCase()}`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {mode === "inline" ? (
            <button
              className="button button--secondary button--compact"
              type="button"
              onClick={() => setIsExpanded(true)}
            >
              Browse library
            </button>
          ) : null}
        </div>
      </div>

      <div className="catalog-selector__layout">
        <div className="catalog-selector__list" role="listbox" aria-label={label}>
          {filteredItems.length ? (
            filteredItems.map((item) => {
              const active = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  className={`catalog-selector__row${active ? " catalog-selector__row--active" : ""}`}
                  type="button"
                  onClick={() => onSelect(item.id)}
                >
                  <strong>{item.name}</strong>
                  {item.source ? <span className="catalog-selector__source">{item.source}</span> : null}
                  {item.meta ? <span>{item.meta}</span> : null}
                </button>
              );
            })
          ) : (
            <div className="catalog-selector__empty">{emptyMessage}</div>
          )}
        </div>

        <div className={`catalog-selector__detail catalog-selector__detail--${mode}`}>
          {selectedItem ? (
            <>
              <span className="catalog-selector__detailLabel">Selected</span>
              <h3 className="catalog-selector__detailTitle">{selectedItem.name}</h3>
              {selectedItem.source ? (
                <p className="catalog-selector__detailMeta">Source: {selectedItem.source}</p>
              ) : null}
              {selectedItem.tags?.length ? (
                <div className="catalog-selector__tagList">
                  {selectedItem.tags.slice(0, mode === "modal" ? 10 : 6).map((tag) => (
                    <span className="catalog-selector__tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              {(mode === "modal" ? getParagraphs(selectedItem.description) : [getPreviewText(selectedItem.description)]).map(
                (paragraph, index) => (
                  <p className="catalog-selector__detailCopy" key={`${selectedItem.id}-${index}`}>
                    {paragraph}
                  </p>
                ),
              )}
              {selectedItem.meta ? (
                <p className="catalog-selector__detailMeta">{selectedItem.meta}</p>
              ) : null}
            </>
          ) : (
            <p className="catalog-selector__detailCopy">{emptyMessage}</p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="catalog-selector">
      {renderContent("inline")}
      {isExpanded ? (
        <div
          className="catalog-selector__modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${label} browser`}
        >
          <div className="catalog-selector__modalCard">
            <div className="catalog-selector__modalHeader">
              <strong>{label} library</strong>
              <button
                className="button button--secondary button--compact"
                type="button"
                onClick={() => setIsExpanded(false)}
              >
                Close
              </button>
            </div>
            {renderContent("modal")}
          </div>
        </div>
      ) : null}
    </div>
  );
}
