"use client";

import { useMemo, useState } from "react";

type CatalogItem = {
  id: string;
  name: string;
  description: string;
  meta?: string;
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

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return items.filter((item) => {
      const sourceMatches =
        sourceFilter === "all" ||
        (sourceFilter === "srd"
          ? (item.source ?? "").toLowerCase().includes("system reference document")
          : !(item.source ?? "").toLowerCase().includes("system reference document"));

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
    items.find((item) => item.id === selectedId) ?? filteredItems[0] ?? items[0] ?? null;

  const content = (
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
          <button
            className="button button--secondary button--compact"
            type="button"
            onClick={() => setIsExpanded(true)}
          >
            Expand
          </button>
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

        <div className="catalog-selector__detail">
          {selectedItem ? (
            <>
              <span className="catalog-selector__detailLabel">Selected</span>
              <h3 className="catalog-selector__detailTitle">{selectedItem.name}</h3>
              {selectedItem.source ? (
                <p className="catalog-selector__detailMeta">Source: {selectedItem.source}</p>
              ) : null}
              <p className="catalog-selector__detailCopy">{selectedItem.description}</p>
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
      {content}
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
            {content}
          </div>
        </div>
      ) : null}
    </div>
  );
}
