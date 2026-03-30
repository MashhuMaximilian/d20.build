"use client";

import { useMemo, useState } from "react";

type CatalogItem = {
  id: string;
  name: string;
  description: string;
  meta?: string;
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

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return items;
    }

    return items.filter((item) => {
      const haystack = `${item.name} ${item.description} ${item.meta ?? ""}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [items, query]);

  const selectedItem =
    items.find((item) => item.id === selectedId) ?? filteredItems[0] ?? items[0] ?? null;

  return (
    <div className="catalog-selector">
      <div className="catalog-selector__toolbar">
        <span className="builder-panel__label">{label}</span>
        <input
          className="input catalog-selector__search"
          placeholder={`Search ${label.toLowerCase()}`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
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
    </div>
  );
}
