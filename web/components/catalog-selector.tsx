"use client";

import { useEffect, useMemo, useState } from "react";

export type CatalogItem = {
  id: string;
  name: string;
  description: string;
  detailHtml?: string;
  meta?: string;
  origin?: "built-in" | "imported";
  source?: string;
  filterTags?: string[];
  detailTags?: string[];
  summaryLines?: string[];
  impactLines?: string[];
  mechanicsLines?: string[];
  featureDetails?: {
    name: string;
    description: string;
    detailHtml?: string;
    source?: string;
  }[];
};

function getSourceFilterLabel(item: CatalogItem) {
  if (item.origin === "built-in") {
    return "SRD";
  }

  return item.source?.trim() || "Imported source";
}

type CatalogSelectorProps = {
  emptyMessage?: string;
  items: CatalogItem[];
  label: string;
  onSelect: (id: string) => void;
  selectedId: string;
};

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function sanitizeRichHtml(markup: string) {
  const withoutDangerousBlocks = markup
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/\son[a-z-]+="[^"]*"/gi, "")
    .replace(/\son[a-z-]+='[^']*'/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sstyle='[^']*'/gi, "")
    .replace(/\sclass="[^"]*"/gi, "")
    .replace(/\sclass='[^']*'/gi, "");

  return withoutDangerousBlocks.replace(
    /<\/?([a-z0-9-]+)(?:\s[^>]*?)?>/gi,
    (match, rawTag: string) => {
      const tag = rawTag.toLowerCase();
      const allowedTags = new Set([
        "p",
        "br",
        "ul",
        "ol",
        "li",
        "strong",
        "b",
        "em",
        "i",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "blockquote",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
      ]);

      return allowedTags.has(tag) ? match : "";
    },
  );
}

export function formatPlainTextAsHtml(text: string) {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!normalized) {
    return "";
  }

  const blocks = normalized.split(/\n\s*\n/);

  return blocks
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (!lines.length) {
        return "";
      }

      const bulletLines = lines.filter((line) => /^[-*•]\s+/.test(line));
      if (bulletLines.length === lines.length) {
        const items = bulletLines
          .map((line) => `<li>${escapeHtml(line.replace(/^[-*•]\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      const headingLine = lines[0];
      const headingMatch = headingLine.match(/^([A-Z][A-Z0-9' /-]{3,}|[A-Z][^:]{2,40}):$/);
      if (headingMatch) {
        const remainder = lines.slice(1).join(" ");
        return `<h4>${escapeHtml(headingLine.replace(/:$/, ""))}</h4>${
          remainder ? `<p>${escapeHtml(remainder)}</p>` : ""
        }`;
      }

      return `<p>${escapeHtml(lines.join(" "))}</p>`;
    })
    .join("");
}

export function getDetailMarkup(item: CatalogItem | null) {
  if (!item) {
    return "";
  }

  if (item.detailHtml?.trim()) {
    return sanitizeRichHtml(item.detailHtml);
  }

  return formatPlainTextAsHtml(item.description);
}

export function getPreviewText(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (normalized.length <= 320) {
    return normalized;
  }

  const sentenceBreak = normalized.slice(0, 320).lastIndexOf(". ");
  if (sentenceBreak > 80) {
    return `${normalized.slice(0, sentenceBreak + 1)}…`;
  }

  return `${normalized.slice(0, 300).trimEnd()}…`;
}

export function CatalogSelector({
  emptyMessage = "No matching entries.",
  items,
  label,
  onSelect,
  selectedId,
}: CatalogSelectorProps) {
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "built-in" | "imported">("all");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState(selectedId);
  const [detailView, setDetailView] = useState<"overview" | "mechanics" | "features" | "reference">("overview");
  const [activePane, setActivePane] = useState<"filters" | "list" | "detail">("list");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [showTableFilters, setShowTableFilters] = useState(false);

  const tagOptions = useMemo(() => {
    const counts = new Map<string, number>();

    items.forEach((item) => {
      if (sourceFilter !== "all" && item.origin !== sourceFilter) {
        return;
      }

      item.filterTags?.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });

    const sorted = [...counts.entries()].sort(
      (left, right) => right[1] - left[1] || left[0].localeCompare(right[0]),
    );
    const abilityTags = sorted
      .map(([tag]) => tag)
      .filter((tag) => /^[+-]\d+\s[A-Z]{3,}$/.test(tag));
    const remaining = sorted
      .map(([tag]) => tag)
      .filter((tag) => !abilityTags.includes(tag))
      .slice(0, Math.max(0, 12 - abilityTags.length));

    return [...abilityTags, ...remaining];
  }, [items, sourceFilter]);

  const sourceOptions = useMemo(() => {
    const counts = new Map<string, number>();

    items.forEach((item) => {
      if (sourceFilter !== "all" && item.origin !== sourceFilter) {
        return;
      }

      const label = getSourceFilterLabel(item);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });

    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([label]) => label);
  }, [items, sourceFilter]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return items.filter((item) => {
      const sourceMatches =
        sourceFilter === "all" ||
        item.origin === sourceFilter;

      if (!sourceMatches) {
        return false;
      }

      if (tagFilter && !(item.filterTags ?? []).includes(tagFilter)) {
        return false;
      }

      if (selectedSources.length) {
        const label = getSourceFilterLabel(item);
        if (!selectedSources.includes(label)) {
          return false;
        }
      }

      if (!normalized) {
        return true;
      }

      const haystack = [
        item.name,
        item.description,
        item.meta ?? "",
        item.source ?? "",
        ...(item.summaryLines ?? []),
        ...(item.impactLines ?? []),
        ...((item.filterTags ?? []).concat(item.detailTags ?? [])),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [items, query, selectedSources, sourceFilter, tagFilter]);

  useEffect(() => {
    if (!tagFilter) {
      return;
    }

    if (!tagOptions.includes(tagFilter)) {
      setTagFilter(null);
    }
  }, [tagFilter, tagOptions]);

  useEffect(() => {
    if (!selectedSources.length) {
      return;
    }

    const allowed = new Set(sourceOptions);
    setSelectedSources((current) => current.filter((source) => allowed.has(source)));
  }, [selectedSources.length, sourceOptions]);

  const committedSelection =
    items.find((item) => item.id === selectedId) ?? null;

  const previewItem =
    filteredItems.find((item) => item.id === previewId) ??
    items.find((item) => item.id === previewId) ??
    filteredItems[0] ??
    committedSelection ??
    items[0] ??
    null;

  useEffect(() => {
    if (!items.length) {
      return;
    }

    if (selectedId && selectedId !== previewId) {
      setPreviewId(selectedId);
      return;
    }

    if (!previewItem && filteredItems[0]) {
      setPreviewId(filteredItems[0].id);
    }
  }, [filteredItems, items, previewId, previewItem, selectedId]);

  useEffect(() => {
    if (selectedId) {
      setActivePane("detail");
    }
  }, [selectedId]);

  const detailMarkup = useMemo(() => getDetailMarkup(previewItem), [previewItem]);
  const activeFilters = [
    sourceFilter !== "all"
      ? sourceFilter === "built-in"
        ? "Built-in SRD"
        : "Imported sources"
      : "",
    ...selectedSources,
    tagFilter ?? "",
    query ? `Search: ${query}` : "",
  ].filter(Boolean);

  return (
    <div className="catalog-selector">
      <div className="catalog-selector__mobileToggles">
        {viewMode === "cards" ? (
          <button
            className={`choice-chip${activePane === "filters" ? " choice-chip--active" : ""}`}
            type="button"
            onClick={() => setActivePane("filters")}
          >
            Filters
          </button>
        ) : null}
        <button
          className={`choice-chip${activePane === "list" ? " choice-chip--active" : ""}`}
          type="button"
          onClick={() => setActivePane("list")}
        >
          Library
        </button>
        <button
          className={`choice-chip${activePane === "detail" ? " choice-chip--active" : ""}`}
          type="button"
          onClick={() => setActivePane("detail")}
        >
          Details
        </button>
      </div>
      <div className={`catalog-selector__workbench${viewMode === "table" ? " catalog-selector__workbench--table" : ""}`}>
        {viewMode === "cards" ? (
          <aside className={`catalog-selector__filtersPanel${activePane === "filters" ? " is-mobileActive" : ""}`}>
            <div className="catalog-selector__panelHeader">
              <span className="builder-panel__label">{label}</span>
              <strong className="catalog-selector__count">
                {filteredItems.length} {filteredItems.length === 1 ? "entry" : "entries"}
              </strong>
            </div>

            <label className="catalog-selector__searchField">
              <span className="catalog-selector__sectionLabel">Search</span>
              <input
                className="input catalog-selector__search"
                placeholder={`Search ${label.toLowerCase()}`}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <div className="catalog-selector__filterGroup">
              <span className="catalog-selector__sectionLabel">Source</span>
              <div className="catalog-selector__filters">
                <button
                  className={`choice-chip${sourceFilter === "all" ? " choice-chip--active" : ""}`}
                  type="button"
                  onClick={() => {
                    setSourceFilter("all");
                    setTagFilter(null);
                    setSelectedSources([]);
                  }}
                >
                  All
                </button>
                <button
                  className={`choice-chip${sourceFilter === "built-in" ? " choice-chip--active" : ""}`}
                  type="button"
                  onClick={() => {
                    setSourceFilter("built-in");
                    setTagFilter(null);
                    setSelectedSources([]);
                  }}
                >
                  Built-in
                </button>
                <button
                  className={`choice-chip${sourceFilter === "imported" ? " choice-chip--active" : ""}`}
                  type="button"
                  onClick={() => {
                    setSourceFilter("imported");
                    setTagFilter(null);
                    setSelectedSources([]);
                  }}
                >
                  Imported sources
                </button>
              </div>
            </div>

            {sourceOptions.length > 1 ? (
              <div className="catalog-selector__filterGroup">
                <span className="catalog-selector__sectionLabel">Named sources</span>
                <div className="catalog-selector__filterTags">
                  {sourceOptions.slice(0, 12).map((source) => (
                    <button
                      key={source}
                      className={`catalog-selector__filterChip${selectedSources.includes(source) ? " catalog-selector__filterChip--active" : ""}`}
                      type="button"
                      onClick={() =>
                        setSelectedSources((current) =>
                          current.includes(source)
                            ? current.filter((entry) => entry !== source)
                            : [...current, source],
                        )
                      }
                    >
                      {source}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {tagOptions.length ? (
              <div className="catalog-selector__filterGroup">
                <span className="catalog-selector__sectionLabel">Filter by tags</span>
                <div className="catalog-selector__filterTags">
                  {tagOptions.map((tag) => (
                    <button
                      key={tag}
                      className={`catalog-selector__filterChip${tagFilter === tag ? " catalog-selector__filterChip--active" : ""}`}
                      type="button"
                      onClick={() => setTagFilter((current) => (current === tag ? null : tag))}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {previewItem ? (
              <div className="catalog-selector__selectionSnapshot">
                <span className="catalog-selector__sectionLabel">Build impact</span>
                <strong className="catalog-selector__snapshotTitle">{previewItem.name}</strong>
                <p className="catalog-selector__snapshotMeta">
                  {previewItem.source ?? "Unknown source"}
                </p>
                {previewItem.impactLines?.length ? (
                  <ul className="catalog-selector__impactList">
                    {previewItem.impactLines.slice(0, 4).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="catalog-selector__snapshotEmpty">
                    Select an option to inspect what it changes in your build.
                  </p>
                )}
              </div>
            ) : null}
          </aside>
        ) : null}

        <div className={`catalog-selector__optionsPanel${activePane === "list" ? " is-mobileActive" : ""}${viewMode === "table" ? " catalog-selector__optionsPanel--table" : ""}`}>
          <div className="catalog-selector__optionsHeader">
            <div>
              <span className="catalog-selector__sectionLabel">Choose {label.toLowerCase()}</span>
              <h3 className="catalog-selector__optionsTitle">{label} library</h3>
            </div>
            <div className="catalog-selector__optionsActions">
              <div className="catalog-selector__viewMode">
                <button
                  className={`button button--secondary button--compact${viewMode === "cards" ? " ability-mode__tab--active" : ""}`}
                  type="button"
                  onClick={() => setViewMode("cards")}
                >
                  Workbench
                </button>
                <button
                  className={`button button--secondary button--compact${viewMode === "table" ? " ability-mode__tab--active" : ""}`}
                  type="button"
                  onClick={() => setViewMode("table")}
                >
                  Table
                </button>
              </div>
              {activeFilters.length ? (
                <button
                  className="button button--secondary button--compact"
                  type="button"
                  onClick={() => {
                    setTagFilter(null);
                    setSourceFilter("all");
                    setSelectedSources([]);
                    setQuery("");
                  }}
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          </div>

          {viewMode === "table" ? (
              <div className="catalog-selector__tableToolbar">
                <div className="catalog-selector__tableToolbarPrimary">
                  <label className="catalog-selector__searchField catalog-selector__tableSearch">
                    <span className="catalog-selector__sectionLabel">Search</span>
                    <input
                      className="input catalog-selector__search"
                      placeholder={`Search ${label.toLowerCase()}`}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </label>

                  <div className="catalog-selector__tableToolbarControls">
                    <div className="catalog-selector__filterGroup">
                      <span className="catalog-selector__sectionLabel">Source</span>
                      <div className="catalog-selector__filters">
                        {(["all", "built-in", "imported"] as const).map((option) => (
                          <button
                            key={option}
                            className={`choice-chip${sourceFilter === option ? " choice-chip--active" : ""}`}
                            type="button"
                            onClick={() => {
                              setSourceFilter(option);
                              setTagFilter(null);
                              setSelectedSources([]);
                            }}
                          >
                            {option === "all" ? "All" : option === "built-in" ? "Built-in" : "Imported sources"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {(sourceOptions.length > 1 || tagOptions.length) ? (
                      <button
                        className={`button button--secondary button--compact${showTableFilters ? " ability-mode__tab--active" : ""}`}
                        type="button"
                        onClick={() => setShowTableFilters((current) => !current)}
                      >
                        {showTableFilters ? "Hide filters" : "More filters"}
                      </button>
                    ) : null}
                  </div>
                </div>

                {showTableFilters ? (
                  <div className="catalog-selector__tableToolbarRow">
                    {sourceOptions.length > 1 ? (
                      <div className="catalog-selector__filterGroup catalog-selector__tableTags">
                        <span className="catalog-selector__sectionLabel">Sources</span>
                        <div className="catalog-selector__filterTags">
                          {sourceOptions.slice(0, 12).map((source) => (
                            <button
                              key={source}
                              className={`catalog-selector__filterChip${selectedSources.includes(source) ? " catalog-selector__filterChip--active" : ""}`}
                              type="button"
                              onClick={() =>
                                setSelectedSources((current) =>
                                  current.includes(source)
                                    ? current.filter((entry) => entry !== source)
                                    : [...current, source],
                                )
                              }
                            >
                              {source}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {tagOptions.length ? (
                      <div className="catalog-selector__filterGroup catalog-selector__tableTags">
                        <span className="catalog-selector__sectionLabel">Tags</span>
                        <div className="catalog-selector__filterTags">
                          {tagOptions.map((tag) => (
                            <button
                              key={tag}
                              className={`catalog-selector__filterChip${tagFilter === tag ? " catalog-selector__filterChip--active" : ""}`}
                              type="button"
                              onClick={() => setTagFilter((current) => (current === tag ? null : tag))}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
          ) : null}

          {activeFilters.length ? (
            <div className="catalog-selector__appliedFilters">
              {activeFilters.map((filter) => (
                <span className="catalog-selector__filterChip catalog-selector__appliedFilter" key={filter}>
                  {filter}
                </span>
              ))}
            </div>
          ) : null}

          {viewMode === "cards" ? (
            <div className="catalog-selector__list" role="listbox" aria-label={label}>
              {filteredItems.length ? (
                filteredItems.map((item) => {
                  const isPreview = item.id === previewItem?.id;
                  const isSelected = item.id === selectedId;
                  return (
                    <button
                      key={item.id}
                      className={`catalog-selector__row${
                        isPreview ? " catalog-selector__row--preview" : ""
                      }${isSelected ? " catalog-selector__row--selected" : ""}`}
                      type="button"
                      onClick={() => {
                        setPreviewId(item.id);
                        onSelect(item.id);
                        setActivePane("detail");
                      }}
                    >
                      <div className="catalog-selector__rowHeader">
                        <strong>{item.name}</strong>
                        {isSelected ? <span className="catalog-selector__selectedBadge">Selected</span> : null}
                      </div>
                      {item.source ? <span className="catalog-selector__source">{item.source}</span> : null}
                      {item.summaryLines?.length ? (
                        <div className="catalog-selector__summaryList">
                          {item.summaryLines.slice(0, 3).map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </div>
                      ) : null}
                      {item.impactLines?.length ? (
                        <div className="catalog-selector__rowImpact">
                          {item.impactLines.slice(0, 2).map((line) => (
                            <span className="catalog-selector__impactChip" key={line}>
                              {line}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </button>
                  );
                })
              ) : (
                <div className="catalog-selector__empty">{emptyMessage}</div>
              )}
            </div>
          ) : (
            <div className="catalog-selector__tableWrap" role="table" aria-label={`${label} table`}>
              <div className="catalog-selector__tableHead" role="row">
                <span role="columnheader">Name</span>
                <span role="columnheader">Source</span>
                <span role="columnheader">Summary</span>
                <span role="columnheader">Impact</span>
              </div>
              <div className="catalog-selector__tableBody" role="rowgroup">
                {filteredItems.length ? (
                  filteredItems.map((item) => {
                    const isPreview = item.id === previewItem?.id;
                    const isSelected = item.id === selectedId;

                    return (
                      <button
                        key={item.id}
                        className={`catalog-selector__tableRow${
                          isPreview ? " catalog-selector__tableRow--preview" : ""
                        }${isSelected ? " catalog-selector__tableRow--selected" : ""}`}
                        type="button"
                        onClick={() => {
                          setPreviewId(item.id);
                          onSelect(item.id);
                          setActivePane("detail");
                        }}
                      >
                        <span className="catalog-selector__tableCell catalog-selector__tableCell--name">
                          <strong>{item.name}</strong>
                          {isSelected ? <span className="catalog-selector__selectedBadge">Selected</span> : null}
                        </span>
                        <span className="catalog-selector__tableCell">{item.source ?? "—"}</span>
                        <span className="catalog-selector__tableCell">
                          {(item.summaryLines?.[0] || item.meta || "—").slice(0, 120)}
                        </span>
                        <span className="catalog-selector__tableCell">
                          {(item.impactLines?.[0] || "—").slice(0, 120)}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="catalog-selector__empty">{emptyMessage}</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={`catalog-selector__detailPanel${activePane === "detail" ? " is-mobileActive" : ""}`}>
          {previewItem ? (
            <>
              <div className="catalog-selector__detailHeader">
                <span className="catalog-selector__detailLabel">
                  {previewItem.id === selectedId ? "Selected" : "Preview"}
                </span>
                <h3 className="catalog-selector__detailTitle">{previewItem.name}</h3>
                {previewItem.source ? (
                  <p className="catalog-selector__detailMeta">Source: {previewItem.source}</p>
                ) : null}
              </div>

              {previewItem.detailTags?.length ? (
                <div className="catalog-selector__detailSection">
                  <span className="catalog-selector__sectionLabel">Key traits</span>
                  <div className="catalog-selector__tagList">
                    {previewItem.detailTags.slice(0, 8).map((tag) => (
                      <span className="catalog-selector__tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="catalog-selector__detailTabs">
                {(["overview", "mechanics", "features", "reference"] as const).map((view) => (
                  <button
                    key={view}
                    className={`catalog-selector__detailTab${
                      detailView === view ? " catalog-selector__detailTab--active" : ""
                    }`}
                    type="button"
                    onClick={() => setDetailView(view)}
                  >
                    {view === "overview"
                      ? "Overview"
                      : view === "mechanics"
                        ? "Mechanics"
                        : view === "features"
                          ? "Features"
                          : "Reference"}
                  </button>
                ))}
              </div>

              {detailView === "overview" ? (
                <div className="catalog-selector__detailSection">
                  <span className="catalog-selector__sectionLabel">What this is</span>
                  <p className="catalog-selector__detailCopy">{getPreviewText(previewItem.description)}</p>
                  {previewItem.impactLines?.length ? (
                    <>
                      <span className="catalog-selector__sectionLabel">This changes your build</span>
                      <ul className="catalog-selector__impactList">
                        {previewItem.impactLines.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              ) : null}

              {detailView === "mechanics" ? (
                <div className="catalog-selector__detailSection">
                  {previewItem.meta ? (
                    <>
                      <span className="catalog-selector__sectionLabel">Selection summary</span>
                      <p className="catalog-selector__detailMeta">{previewItem.meta}</p>
                    </>
                  ) : null}
                  {(previewItem.mechanicsLines?.length || previewItem.impactLines?.length) ? (
                    <>
                      <span className="catalog-selector__sectionLabel">Mechanical breakdown</span>
                      <ul className="catalog-selector__impactList">
                        {(previewItem.mechanicsLines ?? previewItem.impactLines ?? []).map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              ) : null}

              {detailView === "features" ? (
                <div className="catalog-selector__detailSection">
                  <span className="catalog-selector__sectionLabel">Feature details</span>
                  {previewItem.featureDetails?.length ? (
                    <div className="catalog-selector__featureList">
                      {previewItem.featureDetails.map((feature) => {
                        const featureMarkup = feature.detailHtml?.trim()
                          ? sanitizeRichHtml(feature.detailHtml)
                          : formatPlainTextAsHtml(feature.description);

                        return (
                          <article className="catalog-selector__featureCard" key={feature.name}>
                            <div className="catalog-selector__featureHeader">
                              <strong className="catalog-selector__featureTitle">{feature.name}</strong>
                              {feature.source ? (
                                <span className="catalog-selector__featureSource">{feature.source}</span>
                              ) : null}
                            </div>
                            {featureMarkup ? (
                              <div
                                className="catalog-selector__featureBody catalog-selector__richText"
                                dangerouslySetInnerHTML={{ __html: featureMarkup }}
                              />
                            ) : (
                              <p className="catalog-selector__detailMeta">No feature details available yet.</p>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="catalog-selector__detailMeta">No feature details available yet.</p>
                  )}
                </div>
              ) : null}

              {detailView === "reference" ? (
                <div className="catalog-selector__detailSection">
                  <span className="catalog-selector__sectionLabel">Reference</span>
                  {detailMarkup ? (
                    <div
                      className="catalog-selector__richText"
                      dangerouslySetInnerHTML={{ __html: detailMarkup }}
                    />
                  ) : (
                    <p className="catalog-selector__detailMeta">{emptyMessage}</p>
                  )}
                </div>
              ) : null}
            </>
          ) : (
            <p className="catalog-selector__detailMeta">{emptyMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
