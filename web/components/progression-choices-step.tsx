"use client";

import { useEffect, useMemo, useState } from "react";

import { getDetailMarkup } from "@/components/catalog-selector";
import { sortTableRows, toggleTableSort, type TableSortState } from "@/components/table-sort";
import type { ProgressionChoiceGroup } from "@/lib/progression/choices";

type ProgressionChoicesStepProps = {
  groups: ProgressionChoiceGroup[];
  selections: Record<string, string[]>;
  onSelectionChange: (groupId: string, optionIds: string[]) => void;
};

function getOptionSummary(group: ProgressionChoiceGroup, description: string, prerequisite?: string) {
  if (prerequisite?.trim()) {
    return prerequisite.trim();
  }

  const firstSentence = description
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)[0];

  return firstSentence || `${group.optionType} option`;
}

export function ProgressionChoicesStep({
  groups,
  selections,
  onSelectionChange,
}: ProgressionChoicesStepProps) {
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id ?? "");
  const [previewIds, setPreviewIds] = useState<Record<string, string>>({});
  const [queries, setQueries] = useState<Record<string, string>>({});
  const [activePane, setActivePane] = useState<"filters" | "list" | "detail">("list");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [tableSort, setTableSort] = useState<TableSortState<"name" | "source" | "summary" | "impact">>({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    if (!groups.some((group) => group.id === activeGroupId)) {
      setActiveGroupId(groups[0]?.id ?? "");
    }
  }, [activeGroupId, groups]);

  const activeGroup = groups.find((group) => group.id === activeGroupId) ?? null;
  const query = activeGroup ? queries[activeGroup.id]?.trim().toLowerCase() ?? "" : "";
  const filteredOptions = useMemo(
    () =>
      activeGroup
        ? activeGroup.options.filter((option) =>
            !query
              ? true
              : `${option.element.name} ${option.element.source} ${option.element.description} ${
                  option.element.prerequisite ?? ""
                }`
                  .toLowerCase()
                  .includes(query),
          )
        : [],
    [activeGroup, query],
  );
  const sortedOptions = useMemo(
    () =>
      sortTableRows(filteredOptions, tableSort, (option, key) => {
        switch (key) {
          case "source":
            return option.element.source ?? "";
          case "summary":
            return getOptionSummary(activeGroup as ProgressionChoiceGroup, option.element.description, option.element.prerequisite);
          case "impact":
            return option.requirementFailures[0] || `Adds ${(activeGroup as ProgressionChoiceGroup).optionType.toLowerCase()} option`;
          case "name":
          default:
            return option.element.name;
        }
      }),
    [activeGroup, filteredOptions, tableSort],
  );
  const selectedIds = activeGroup ? selections[activeGroup.id] ?? [] : [];
  const previewId = activeGroup
    ? previewIds[activeGroup.id] ?? selectedIds[0] ?? sortedOptions[0]?.element.id ?? ""
    : "";
  const previewOption =
    sortedOptions.find((option) => option.element.id === previewId) ??
    activeGroup?.options.find((option) => option.element.id === previewId) ??
    null;

  useEffect(() => {
    if (activeGroup && previewOption) {
      setPreviewIds((current) => ({
        ...current,
        [activeGroup.id]: previewOption.element.id,
      }));
    }
  }, [activeGroup, previewOption]);

  if (!groups.length) {
    return (
      <section className="builder-panel">
        <span className="builder-panel__label">Class choices</span>
        <p className="route-shell__copy">
          No level-gated class-specific choice families are unlocked for the current build yet.
        </p>
      </section>
    );
  }

  function toggleOption(optionId: string) {
    if (!activeGroup) {
      return;
    }

    const current = selections[activeGroup.id] ?? [];
    const alreadySelected = current.includes(optionId);

    if (alreadySelected) {
      onSelectionChange(
        activeGroup.id,
        current.filter((id) => id !== optionId),
      );
      return;
    }

    if (activeGroup.exactSelections === 1) {
      onSelectionChange(activeGroup.id, [optionId]);
      return;
    }

    if (current.length >= activeGroup.exactSelections) {
      return;
    }

    onSelectionChange(activeGroup.id, [...current, optionId]);
  }

  return (
    <section className="builder-panel progression-step">
      <div className="builder-stepPanel__intro">
        <span className="route-shell__tag">Class choices</span>
        <h2 className="route-shell__title">Resolve level-gated class families and nested picks</h2>
        <p className="route-shell__copy">
          This step handles class-specific choice systems like invocations, disciplines, fighting styles, metamagic-like picks, and other recursive family nodes unlocked by your current build.
        </p>
      </div>

      <div className="spellcasting-step__groupTabs">
        {groups.map((group) => {
          const pickedCount = selections[group.id]?.length ?? 0;
          return (
            <button
              key={group.id}
              type="button"
              className={`spellcasting-step__groupTab${group.id === activeGroupId ? " spellcasting-step__groupTab--active" : ""}`}
              onClick={() => setActiveGroupId(group.id)}
            >
              <span>{group.title}</span>
              <small>{pickedCount}/{group.exactSelections}</small>
            </button>
          );
        })}
      </div>

      {activeGroup ? (
        <>
          <div className="catalog-selector__mobileToggles">
            {viewMode === "cards" ? (
              <button
                className={`button button--secondary button--compact${activePane === "filters" ? " ability-mode__tab--active" : ""}`}
                type="button"
                onClick={() => setActivePane("filters")}
              >
                Filters
              </button>
            ) : null}
            <button
              className={`button button--secondary button--compact${activePane === "list" ? " ability-mode__tab--active" : ""}`}
              type="button"
              onClick={() => setActivePane("list")}
            >
              Library
            </button>
            <button
              className={`button button--secondary button--compact${activePane === "detail" ? " ability-mode__tab--active" : ""}`}
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
                  <span className="catalog-selector__sectionLabel">{activeGroup.ownerLabel}</span>
                  <strong className="catalog-selector__count">
                    {selectedIds.length}/{activeGroup.exactSelections} selected
                  </strong>
                </div>

                <div className="catalog-selector__searchField">
                  <span className="catalog-selector__sectionLabel">Search</span>
                  <input
                    className="input catalog-selector__search"
                    value={queries[activeGroup.id] ?? ""}
                    onChange={(event) =>
                      setQueries((current) => ({
                        ...current,
                        [activeGroup.id]: event.target.value,
                      }))
                    }
                    placeholder={`Search ${activeGroup.optionType.toLowerCase()}`}
                  />
                </div>

                <div className="catalog-selector__selectionSnapshot">
                  <span className="catalog-selector__sectionLabel">Selection rule</span>
                  <strong className="catalog-selector__snapshotTitle">{activeGroup.title}</strong>
                  <p className="catalog-selector__snapshotMeta">
                    Choose exactly {activeGroup.exactSelections} option{activeGroup.exactSelections === 1 ? "" : "s"}.
                  </p>
                  <ul className="catalog-selector__impactList">
                    <li>{activeGroup.optionType} family at level {activeGroup.unlockLevel}</li>
                    {activeGroup.supportsKey ? <li>{activeGroup.supportsKey}</li> : null}
                  </ul>
                </div>
              </aside>
            ) : null}

            <div className={`catalog-selector__optionsPanel${activePane === "list" ? " is-mobileActive" : ""}${viewMode === "table" ? " catalog-selector__optionsPanel--table" : ""}`}>
              <div className="catalog-selector__optionsHeader">
                <div className="catalog-selector__headingBlock">
                  <span className="catalog-selector__sectionLabel">Choose {activeGroup.optionType.toLowerCase()}</span>
                </div>
                <div className="catalog-selector__optionsActions">
                  <div className="catalog-selector__viewMode">
                    <button
                      className={`button button--secondary button--compact${viewMode === "cards" ? " ability-mode__tab--active" : ""}`}
                      type="button"
                      onClick={() => setViewMode("cards")}
                    >
                      <span className="catalog-selector__viewModeButton">
                        <span className="catalog-selector__viewModeGlyph catalog-selector__viewModeGlyph--workbench" aria-hidden="true" />
                        <span>Workbench</span>
                      </span>
                    </button>
                    <button
                      className={`button button--secondary button--compact${viewMode === "table" ? " ability-mode__tab--active" : ""}`}
                      type="button"
                      onClick={() => setViewMode("table")}
                    >
                      <span className="catalog-selector__viewModeButton">
                        <span className="catalog-selector__viewModeGlyph catalog-selector__viewModeGlyph--table" aria-hidden="true" />
                        <span>Table</span>
                      </span>
                    </button>
                  </div>
                  <span className="catalog-selector__count">{sortedOptions.length} options</span>
                </div>
              </div>

              {viewMode === "table" ? (
                <div className="catalog-selector__tableToolbar">
                  <div className="catalog-selector__tableToolbarPrimary">
                    <label className="catalog-selector__searchField catalog-selector__tableSearch">
                      <span className="catalog-selector__sectionLabel">Search</span>
                      <input
                        className="input catalog-selector__search"
                        placeholder={`Search ${activeGroup.optionType.toLowerCase()}`}
                        value={queries[activeGroup.id] ?? ""}
                        onChange={(event) =>
                          setQueries((current) => ({
                            ...current,
                            [activeGroup.id]: event.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>
              ) : null}

              {sortedOptions.length ? (
                viewMode === "table" ? (
                  <div className="catalog-selector__tableWrap" role="table" aria-label={`${activeGroup.title} option table`}>
                    <div className="catalog-selector__tableHead" role="row">
                      {([
                        ["name", "Name"],
                        ["source", "Source"],
                        ["summary", "Summary"],
                        ["impact", "Impact"],
                      ] as const).map(([key, headerLabel]) => {
                        const active = tableSort.key === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            role="columnheader"
                            aria-sort={active ? (tableSort.direction === "asc" ? "ascending" : "descending") : "none"}
                            className={`catalog-selector__tableSort${active ? " is-active" : ""}`}
                            onClick={() => setTableSort((current) => toggleTableSort(current, key))}
                          >
                            <span>{headerLabel}</span>
                            <span className="catalog-selector__tableSortGlyph" aria-hidden="true">
                              {active ? (tableSort.direction === "asc" ? "▲" : "▼") : "↕"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="catalog-selector__tableBody" role="rowgroup">
                      {sortedOptions.map((option) => {
                        const isSelected = selectedIds.includes(option.element.id);
                        const summary = getOptionSummary(activeGroup, option.element.description, option.element.prerequisite);
                        return (
                          <button
                            key={option.element.id}
                            className={`catalog-selector__tableRow${previewOption?.element.id === option.element.id ? " catalog-selector__tableRow--preview" : ""}${isSelected ? " catalog-selector__tableRow--selected" : ""}`}
                            type="button"
                            disabled={option.requirementFailures.length > 0 && !isSelected}
                            onClick={() => {
                              setPreviewIds((current) => ({
                                ...current,
                                [activeGroup.id]: option.element.id,
                              }));
                              toggleOption(option.element.id);
                            }}
                            role="row"
                          >
                            <span className="catalog-selector__tableCell catalog-selector__tableCell--name" role="cell">
                              <strong>{option.element.name}</strong>
                              {isSelected ? <span className="catalog-selector__selectedBadge">Selected</span> : null}
                            </span>
                            <span className="catalog-selector__tableCell" role="cell">{option.element.source}</span>
                            <span className="catalog-selector__tableCell" role="cell">{summary}</span>
                            <span className="catalog-selector__tableCell" role="cell">
                              {option.requirementFailures.length ? option.requirementFailures[0] : `Adds ${activeGroup.optionType.toLowerCase()} option`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="catalog-selector__list">
                    {sortedOptions.map((option) => {
                      const isSelected = selectedIds.includes(option.element.id);
                      return (
                        <button
                          key={option.element.id}
                          className={`catalog-selector__row${previewOption?.element.id === option.element.id ? " catalog-selector__row--preview" : ""}${isSelected ? " catalog-selector__row--selected" : ""}`}
                          type="button"
                          disabled={option.requirementFailures.length > 0 && !isSelected}
                          onClick={() => {
                            setPreviewIds((current) => ({
                              ...current,
                              [activeGroup.id]: option.element.id,
                            }));
                            toggleOption(option.element.id);
                          }}
                        >
                          <div className="catalog-selector__rowHeader">
                            <strong>{option.element.name}</strong>
                            {isSelected ? <span className="catalog-selector__selectedBadge">Selected</span> : null}
                          </div>
                          <span className="catalog-selector__source">{option.element.source}</span>
                          <div className="catalog-selector__summaryList">
                            <span>{getOptionSummary(activeGroup, option.element.description, option.element.prerequisite)}</span>
                          </div>
                          <div className="catalog-selector__rowImpact">
                            <span className="catalog-selector__impactChip">
                              {activeGroup.optionType}
                            </span>
                            {option.requirementFailures.length ? (
                              <span className="catalog-selector__impactChip">{option.requirementFailures[0]}</span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )
              ) : (
                <p className="catalog-selector__empty">
                  No matching options. Adjust the search or change to another family tab.
                </p>
              )}
            </div>

            <aside className={`catalog-selector__detailPanel${activePane === "detail" ? " is-mobileActive" : ""}`}>
              {previewOption ? (
                <>
                  <div className="catalog-selector__detailHeader">
                    <span className="catalog-selector__detailLabel">Selected</span>
                    <h3 className="catalog-selector__detailTitle">{previewOption.element.name}</h3>
                    <p className="catalog-selector__detailMeta">
                      {previewOption.element.source}
                      {previewOption.element.prerequisite ? ` • ${previewOption.element.prerequisite}` : ""}
                    </p>
                  </div>

                  <section className="catalog-selector__detailSection">
                    <span className="catalog-selector__detailLabel">Selection summary</span>
                    <ul className="catalog-selector__impactList">
                      <li>Selected {selectedIds.length} of {activeGroup.exactSelections}</li>
                      <li>{activeGroup.optionType} family at level {activeGroup.unlockLevel}</li>
                      {activeGroup.supportsKey ? <li>{activeGroup.supportsKey}</li> : null}
                    </ul>
                  </section>

                  <div
                    className="catalog-selector__detailRichText"
                    dangerouslySetInnerHTML={{ __html: getDetailMarkup(previewOption.element) }}
                  />
                </>
              ) : (
                <p className="builder-summary__meta">Choose an option to inspect its details.</p>
              )}
            </aside>
          </div>
        </>
      ) : null}
    </section>
  );
}
