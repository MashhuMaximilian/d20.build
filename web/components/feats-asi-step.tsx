"use client";

import { useMemo, useState } from "react";

import type { BuiltInElement } from "@/lib/builtins/types";
import {
  ABILITY_KEYS,
  ABILITY_LABELS,
  type AbilityKey,
  type CharacterImprovementSelection,
} from "@/lib/characters/types";
import {
  getAvailableFeatOptions,
  getImprovementSelectionPoints,
  type ImprovementOpportunity,
} from "@/lib/progression/improvements";

type FeatsAsiStepProps = {
  effectiveAbilitiesBeforeImprovements: Record<string, number>;
  featFailuresById: Record<string, string[]>;
  feats: BuiltInElement[];
  opportunities: ImprovementOpportunity[];
  selections: Record<string, CharacterImprovementSelection>;
  onSelectionChange: (opportunityId: string, selection: CharacterImprovementSelection) => void;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizeRichHtml(markup: string) {
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

function formatPlainTextAsHtml(text: string) {
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

function getDetailMarkup(feat: BuiltInElement | null) {
  if (!feat) {
    return "";
  }

  if (feat.descriptionHtml?.trim()) {
    return sanitizeRichHtml(feat.descriptionHtml);
  }

  return formatPlainTextAsHtml(feat.description);
}

function getEmptyAsiSelection(): CharacterImprovementSelection {
  return {
    mode: "asi",
    abilityBonuses: {},
    featId: "",
  };
}

function getAsiValue(selection: CharacterImprovementSelection | undefined, ability: AbilityKey) {
  if (!selection || selection.mode !== "asi") {
    return 0;
  }

  return selection.abilityBonuses[ability] ?? 0;
}

function getRemainingAsiPoints(
  selection: CharacterImprovementSelection | undefined,
  opportunity: ImprovementOpportunity,
) {
  return Math.max(0, opportunity.totalPoints - getImprovementSelectionPoints(selection));
}

export function FeatsAsiStep({
  effectiveAbilitiesBeforeImprovements,
  featFailuresById,
  feats,
  opportunities,
  selections,
  onSelectionChange,
}: FeatsAsiStepProps) {
  const [queries, setQueries] = useState<Record<string, string>>({});
  const [previewIds, setPreviewIds] = useState<Record<string, string>>({});
  const featOptions = useMemo(() => getAvailableFeatOptions(feats), [feats]);

  if (!opportunities.length) {
    return (
      <section className="builder-panel">
        <span className="builder-panel__label">Feats / ASI</span>
        <p className="route-shell__copy">
          No unlocked ability score improvements are available at the current class levels yet.
        </p>
      </section>
    );
  }

  return (
    <section className="builder-panel feats-step">
      <div className="builder-stepPanel__intro">
        <span className="route-shell__tag">Feats / ASI</span>
        <h2 className="route-shell__title">Resolve every unlocked improvement opportunity</h2>
        <p className="route-shell__copy">
          Improvements are awarded by class level, not total character level. Each unlocked slot can become an ability score increase or, when feat data is available, a feat pick.
        </p>
      </div>

      <div className="feats-step__list">
        {opportunities.map((opportunity) => {
          const selection = selections[opportunity.id] ?? getEmptyAsiSelection();
          const isAsi = selection.mode === "asi";
          const featQuery = queries[opportunity.id]?.trim().toLowerCase() ?? "";
          const filteredFeats = featQuery
            ? featOptions.filter((feat) =>
                `${feat.name} ${feat.source} ${feat.description}`.toLowerCase().includes(featQuery),
              )
            : featOptions;
          const previewId =
            previewIds[opportunity.id] ??
            selection.featId ??
            filteredFeats[0]?.id ??
            "";
          const selectedFeat = selection.featId
            ? featOptions.find((feat) => feat.id === selection.featId) ?? null
            : null;
          const previewFeat =
            filteredFeats.find((feat) => feat.id === previewId) ??
            featOptions.find((feat) => feat.id === previewId) ??
            selectedFeat ??
            filteredFeats[0] ??
            null;
          const previewFailures = previewFeat ? featFailuresById[previewFeat.id] ?? [] : [];
          const selectedFailures = selectedFeat ? featFailuresById[selectedFeat.id] ?? [] : [];

          return (
            <article className="feats-step__card" key={opportunity.id}>
              <div className="feats-step__header">
                <div>
                  <span className="builder-panel__label">Improvement slot</span>
                  <strong className="builder-summary__name">{opportunity.title}</strong>
                  <p className="builder-summary__meta">
                    {opportunity.featureName} at class level {opportunity.unlockLevel}
                  </p>
                </div>
                <div className="feats-step__modeSwitch">
                  <button
                    className={`button button--secondary button--compact${isAsi ? " ability-mode__tab--active" : ""}`}
                    type="button"
                    onClick={() =>
                      onSelectionChange(opportunity.id, {
                        mode: "asi",
                        abilityBonuses: selection.mode === "asi" ? selection.abilityBonuses : {},
                        featId: "",
                      })
                    }
                  >
                    ASI
                  </button>
                  {opportunity.featAllowed ? (
                    <button
                      className={`button button--secondary button--compact${!isAsi ? " ability-mode__tab--active" : ""}`}
                      type="button"
                      disabled={!featOptions.length}
                      onClick={() =>
                        onSelectionChange(opportunity.id, {
                          mode: "feat",
                          abilityBonuses: {},
                          featId: selection.mode === "feat" ? selection.featId : "",
                          featName: selection.mode === "feat" ? selection.featName : undefined,
                          featSource: selection.mode === "feat" ? selection.featSource : undefined,
                        })
                      }
                    >
                      Feat
                    </button>
                  ) : null}
                </div>
              </div>

              {isAsi ? (
                <div className="feats-step__asi">
                  <p className="builder-summary__meta">
                    {opportunity.notes[0] ??
                      `Spend exactly ${opportunity.totalPoints} points. You can raise one score by 2 or two scores by 1, up to a final score of 20.`}
                  </p>
                  <p className="builder-summary__meta">
                    Remaining points: {getRemainingAsiPoints(selection, opportunity)}
                  </p>
                  <div className="ability-grid ability-grid--compact">
                    {ABILITY_KEYS.map((ability) => {
                      const currentBonus = getAsiValue(selection, ability);
                      const remainingPoints = getRemainingAsiPoints(selection, opportunity);
                      const effectiveBeforeThisOpportunity =
                        effectiveAbilitiesBeforeImprovements[ability] - currentBonus;
                      const canDecrease = currentBonus > 0;
                      const canIncrease =
                        remainingPoints > 0 &&
                        currentBonus < opportunity.maxPerAbility &&
                        opportunity.allowedAbilities.includes(ability) &&
                        effectiveBeforeThisOpportunity + currentBonus < 20;

                      return (
                        <div className="ability-card ability-card--compact" key={`${opportunity.id}-${ability}`}>
                          <span className="ability-card__label">{ABILITY_LABELS[ability]}</span>
                          <div className="numeric-stepper">
                            <button
                              className="button button--secondary button--compact numeric-stepper__button"
                              type="button"
                              disabled={!canDecrease}
                              onClick={() =>
                                onSelectionChange(opportunity.id, {
                                  ...selection,
                                  mode: "asi",
                                  abilityBonuses: {
                                    ...selection.abilityBonuses,
                                    [ability]: Math.max(0, currentBonus - 1),
                                  },
                                  featId: "",
                                  featName: undefined,
                                  featSource: undefined,
                                })
                              }
                            >
                              -
                            </button>
                            <div className="numeric-stepper__value" aria-live="polite">
                              +{currentBonus}
                            </div>
                            <button
                              className="button button--secondary button--compact numeric-stepper__button"
                              type="button"
                              disabled={!canIncrease}
                              onClick={() =>
                                onSelectionChange(opportunity.id, {
                                  ...selection,
                                  mode: "asi",
                                  abilityBonuses: {
                                    ...selection.abilityBonuses,
                                    [ability]: currentBonus + 1,
                                  },
                                  featId: "",
                                  featName: undefined,
                                  featSource: undefined,
                                })
                              }
                            >
                              +
                            </button>
                          </div>
                          <span className="ability-card__meta">
                            Final {effectiveBeforeThisOpportunity + currentBonus}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="feats-step__featPicker">
                  {featOptions.length ? (
                    <>
                      <div className="feats-step__pickerLayout">
                        <div className="feats-step__pickerColumn feats-step__pickerColumn--list">
                          <label className="builder-field">
                            <span>Search feats</span>
                            <input
                              className="input"
                              value={queries[opportunity.id] ?? ""}
                              onChange={(event) =>
                                setQueries((current) => ({
                                  ...current,
                                  [opportunity.id]: event.target.value,
                                }))
                              }
                              placeholder="Search feat library"
                            />
                          </label>
                          <div className="feats-step__listHeader">
                            <span className="builder-panel__label">Choose feat</span>
                            <span className="builder-summary__meta">{filteredFeats.length} entries</span>
                          </div>
                          <div className="feats-step__optionList" role="list">
                            {filteredFeats.length ? (
                              filteredFeats.map((feat) => {
                                const isPreview = previewFeat?.id === feat.id;
                                const isSelected = selection.featId === feat.id;
                                const failures = featFailuresById[feat.id] ?? [];
                                const canSelect = failures.length === 0;
                                return (
                                  <button
                                    key={feat.id}
                                    className={`feats-step__option${isPreview ? " feats-step__option--preview" : ""}${isSelected ? " feats-step__option--selected" : ""}`}
                                    type="button"
                                    onClick={() => {
                                      setPreviewIds((current) => ({
                                        ...current,
                                        [opportunity.id]: feat.id,
                                      }));
                                      if (canSelect) {
                                        onSelectionChange(opportunity.id, {
                                          mode: "feat",
                                          abilityBonuses: {},
                                          featId: feat.id,
                                          featName: feat.name,
                                          featSource: feat.source,
                                        });
                                      }
                                    }}
                                  >
                                    <strong>{feat.name}</strong>
                                    <span>{feat.source}</span>
                                    {!canSelect ? (
                                      <small className="auth-card__status auth-card__status--error">
                                        {failures[0]}
                                      </small>
                                    ) : null}
                                  </button>
                                );
                              })
                            ) : (
                              <p className="builder-summary__meta">No feats match the current search.</p>
                            )}
                          </div>
                        </div>
                        <div className="feats-step__pickerColumn feats-step__pickerColumn--detail">
                          {previewFeat ? (
                            <div className="feats-step__featPreview">
                              <span className="builder-panel__label">
                                {selection.featId === previewFeat.id ? "Selected feat" : "Preview feat"}
                              </span>
                              <strong className="builder-summary__name">{previewFeat.name}</strong>
                              <p className="builder-summary__meta">{previewFeat.source}</p>
                              {previewFeat.supports?.length ? (
                                <div className="catalog-selector__detailTags">
                                  {previewFeat.supports.slice(0, 6).map((tag) => (
                                    <span className="catalog-selector__detailTag" key={`${previewFeat.id}-${tag}`}>
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                              <div
                                className="catalog-selector__richText"
                                dangerouslySetInnerHTML={{ __html: getDetailMarkup(previewFeat) }}
                              />
                              {previewFailures.length ? (
                                <div className="builder-warnings">
                                  {previewFailures.map((message) => (
                                    <p className="auth-card__status auth-card__status--error" key={`${previewFeat.id}-${message}`}>
                                      {message}
                                    </p>
                                  ))}
                                </div>
                              ) : null}
                              {selectedFailures.length ? (
                                <p className="builder-summary__meta">
                                  The currently selected feat no longer satisfies its prerequisite checks.
                                </p>
                              ) : null}
                            </div>
                          ) : (
                            <p className="builder-summary__meta">Pick a feat from the left to inspect its details.</p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="auth-card__status auth-card__status--error">
                      No feat catalog is currently available. Import feat sources or use the ASI option for this slot.
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
