"use client";

import { useEffect, useMemo, useState } from "react";

import { getDetailMarkup } from "@/components/catalog-selector";
import type { ProgressionChoiceGroup } from "@/lib/progression/choices";

type ProgressionChoicesStepProps = {
  groups: ProgressionChoiceGroup[];
  selections: Record<string, string[]>;
  onSelectionChange: (groupId: string, optionIds: string[]) => void;
};

export function ProgressionChoicesStep({
  groups,
  selections,
  onSelectionChange,
}: ProgressionChoicesStepProps) {
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id ?? "");
  const [previewIds, setPreviewIds] = useState<Record<string, string>>({});
  const [queries, setQueries] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!groups.some((group) => group.id === activeGroupId)) {
      setActiveGroupId(groups[0]?.id ?? "");
    }
  }, [activeGroupId, groups]);

  const activeGroup = groups.find((group) => group.id === activeGroupId) ?? null;
  const query = activeGroup ? queries[activeGroup.id]?.trim().toLowerCase() ?? "" : "";
  const filteredOptions = activeGroup
    ? activeGroup.options.filter((option) =>
        !query
          ? true
          : `${option.element.name} ${option.element.source} ${option.element.description} ${
              option.element.prerequisite ?? ""
            }`
              .toLowerCase()
              .includes(query),
      )
    : [];
  const selectedIds = activeGroup ? selections[activeGroup.id] ?? [] : [];
  const previewId = activeGroup
    ? previewIds[activeGroup.id] ?? selectedIds[0] ?? filteredOptions[0]?.element.id ?? ""
    : "";
  const previewOption =
    filteredOptions.find((option) => option.element.id === previewId) ??
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
        <div className="progression-step__layout">
          <aside className="builder-review__card progression-step__sidebar">
            <span className="builder-panel__label">{activeGroup.ownerLabel}</span>
            <strong className="builder-summary__name">{selectedIds.length}/{activeGroup.exactSelections} selected</strong>
            <p className="builder-summary__meta">
              {activeGroup.optionType} family at level {activeGroup.unlockLevel}
            </p>
            <label className="builder-field">
              <span>Search</span>
              <input
                className="input"
                value={activeGroup ? queries[activeGroup.id] ?? "" : ""}
                onChange={(event) =>
                  setQueries((current) => ({
                    ...current,
                    [activeGroup.id]: event.target.value,
                  }))
                }
                placeholder={`Search ${activeGroup.optionType.toLowerCase()}`}
              />
            </label>
            <div className="builder-review__card">
              <span className="builder-panel__label">Selection rule</span>
              <p className="builder-summary__meta">
                Choose exactly {activeGroup.exactSelections} option{activeGroup.exactSelections === 1 ? "" : "s"}.
              </p>
              {activeGroup.supportsKey ? (
                <p className="builder-summary__meta">{activeGroup.supportsKey}</p>
              ) : null}
            </div>
          </aside>

          <div className="builder-review__card progression-step__options">
            {filteredOptions.map((option) => {
              const isSelected = selectedIds.includes(option.element.id);
              const isDisabled = option.requirementFailures.length > 0 && !isSelected;

              return (
                <button
                  key={option.element.id}
                  className={`catalog-selector__option${isSelected ? " is-selected" : ""}`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    setPreviewIds((current) => ({
                      ...current,
                      [activeGroup.id]: option.element.id,
                    }));
                    toggleOption(option.element.id);
                  }}
                >
                  <div className="catalog-selector__optionHeader">
                    <strong>{option.element.name}</strong>
                    {isSelected ? <span className="catalog-selector__selectedBadge">Selected</span> : null}
                  </div>
                  <p className="catalog-selector__optionMeta">{option.element.source}</p>
                  {option.element.prerequisite ? (
                    <p className="catalog-selector__optionSummary">{option.element.prerequisite}</p>
                  ) : null}
                  {option.requirementFailures.length ? (
                    <p className="auth-card__status auth-card__status--error">
                      {option.requirementFailures[0]}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>

          <aside className="builder-review__card progression-step__detail">
            {previewOption ? (
              <>
                <span className="builder-panel__label">Selected</span>
                <strong className="builder-summary__name">{previewOption.element.name}</strong>
                <p className="builder-summary__meta">{previewOption.element.source}</p>
                {previewOption.element.prerequisite ? (
                  <p className="builder-summary__meta">{previewOption.element.prerequisite}</p>
                ) : null}
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
      ) : null}
    </section>
  );
}
