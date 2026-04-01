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
  feats: BuiltInElement[];
  opportunities: ImprovementOpportunity[];
  selections: Record<string, CharacterImprovementSelection>;
  onSelectionChange: (opportunityId: string, selection: CharacterImprovementSelection) => void;
};

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

function getRemainingAsiPoints(selection: CharacterImprovementSelection | undefined) {
  return Math.max(0, 2 - getImprovementSelectionPoints(selection));
}

export function FeatsAsiStep({
  effectiveAbilitiesBeforeImprovements,
  feats,
  opportunities,
  selections,
  onSelectionChange,
}: FeatsAsiStepProps) {
  const [queries, setQueries] = useState<Record<string, string>>({});
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
          const selectedFeat = selection.featId
            ? featOptions.find((feat) => feat.id === selection.featId) ?? null
            : null;

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
                </div>
              </div>

              {isAsi ? (
                <div className="feats-step__asi">
                  <p className="builder-summary__meta">
                    Spend exactly 2 points. You can raise one score by 2 or two scores by 1, up to a final score of 20.
                  </p>
                  <p className="builder-summary__meta">
                    Remaining points: {getRemainingAsiPoints(selection)}
                  </p>
                  <div className="ability-grid ability-grid--compact">
                    {ABILITY_KEYS.map((ability) => {
                      const currentBonus = getAsiValue(selection, ability);
                      const remainingPoints = getRemainingAsiPoints(selection);
                      const effectiveBeforeThisOpportunity =
                        effectiveAbilitiesBeforeImprovements[ability] - currentBonus;
                      const canDecrease = currentBonus > 0;
                      const canIncrease =
                        remainingPoints > 0 &&
                        currentBonus < 2 &&
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
                          placeholder="Search imported feat library"
                        />
                      </label>
                      <label className="builder-field">
                        <span>Choose a feat</span>
                        <select
                          className="input"
                          value={selection.featId}
                          onChange={(event) => {
                            const feat = featOptions.find((entry) => entry.id === event.target.value);
                            onSelectionChange(opportunity.id, {
                              mode: "feat",
                              abilityBonuses: {},
                              featId: feat?.id ?? "",
                              featName: feat?.name ?? undefined,
                              featSource: feat?.source ?? undefined,
                            });
                          }}
                        >
                          <option value="">Select a feat</option>
                          {filteredFeats.map((feat) => (
                            <option key={feat.id} value={feat.id}>
                              {feat.name} · {feat.source}
                            </option>
                          ))}
                        </select>
                      </label>
                      {selectedFeat ? (
                        <div className="feats-step__featPreview">
                          <span className="builder-panel__label">Selected feat</span>
                          <strong className="builder-summary__name">{selectedFeat.name}</strong>
                          <p className="builder-summary__meta">{selectedFeat.source}</p>
                          <p className="route-shell__copy">
                            {selectedFeat.description.trim()
                              ? selectedFeat.description.trim().slice(0, 260)
                              : "This feat has imported rules text available in the reference layer."}
                          </p>
                        </div>
                      ) : (
                        <p className="builder-summary__meta">
                          Feat prerequisite enforcement will be tightened later. For now, choose a feat from imported sources if you want to test feat flow.
                        </p>
                      )}
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
