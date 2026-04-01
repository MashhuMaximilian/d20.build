"use client";

import {
  ABILITY_KEYS,
  ABILITY_LABELS,
  createRolledAbilities,
  formatAbilityModifier,
  getPointBuyTotal,
  POINT_BUY_COST,
  STANDARD_ARRAY,
  type AbilityKey,
  type AbilityMode,
  type CharacterAbilities,
} from "@/lib/characters/types";

type AbilityScoreEditorProps = {
  abilities: CharacterAbilities;
  mode: AbilityMode;
  onAbilitiesChange: (abilities: CharacterAbilities) => void;
  onModeChange: (mode: AbilityMode, abilities: CharacterAbilities) => void;
  appliedBonuses: Record<string, number>;
  bonusBreakdown?: Partial<Record<AbilityKey, string[]>>;
  validationMessage?: string;
};

function clampAbilityValue(mode: AbilityMode, value: number) {
  const min = mode === "point-buy" ? 8 : 3;
  const max = mode === "point-buy" ? 15 : 20;
  return Math.min(max, Math.max(min, value));
}

function nextAbilities(
  abilities: CharacterAbilities,
  ability: AbilityKey,
  value: number,
): CharacterAbilities {
  return {
    ...abilities,
    [ability]: value,
  };
}

function clampPointBuyValue(
  abilities: CharacterAbilities,
  ability: AbilityKey,
  value: number,
) {
  const clamped = clampAbilityValue("point-buy", value);
  const budgetWithoutCurrent = ABILITY_KEYS.reduce((sum, key) => {
    if (key === ability) {
      return sum;
    }

    return sum + (POINT_BUY_COST[abilities[key]] ?? 0);
  }, 0);

  const remainingBudget = Math.max(0, 27 - budgetWithoutCurrent);
  const allowedScores = Object.entries(POINT_BUY_COST)
    .map(([score, cost]) => ({ score: Number(score), cost }))
    .filter((entry) => entry.cost <= remainingBudget)
    .map((entry) => entry.score);

  const maxAllowed = allowedScores.length ? Math.max(...allowedScores) : 8;
  return Math.min(clamped, maxAllowed);
}

function getNextAbilityValue(
  abilities: CharacterAbilities,
  ability: AbilityKey,
  mode: AbilityMode,
  requestedValue: number,
) {
  if (mode === "point-buy") {
    return clampPointBuyValue(abilities, ability, requestedValue);
  }

  return clampAbilityValue(mode, requestedValue);
}

function getNextStandardArrayValue(
  abilities: CharacterAbilities,
  ability: AbilityKey,
  delta: -1 | 1,
) {
  const ordered = [...STANDARD_ARRAY].sort((left, right) => left - right) as number[];
  const current = abilities[ability];
  const currentIndex = ordered.indexOf(current);

  if (currentIndex === -1) {
    return current;
  }

  for (
    let index = currentIndex + delta;
    index >= 0 && index < ordered.length;
    index += delta
  ) {
    const candidate = ordered[index];
    const takenElsewhere = ABILITY_KEYS.some(
      (key) => key !== ability && abilities[key] === candidate,
    );

    if (!takenElsewhere) {
      return candidate;
    }
  }

  return current;
}

function getAdjustedAbilityValue(
  abilities: CharacterAbilities,
  ability: AbilityKey,
  mode: AbilityMode,
  delta: -1 | 1,
) {
  if (mode === "standard-array") {
    return getNextStandardArrayValue(abilities, ability, delta);
  }

  return getNextAbilityValue(abilities, ability, mode, abilities[ability] + delta);
}

export function AbilityScoreEditor({
  abilities,
  mode,
  onAbilitiesChange,
  onModeChange,
  appliedBonuses,
  bonusBreakdown,
  validationMessage,
}: AbilityScoreEditorProps) {
  const pointBuySpent = getPointBuyTotal(abilities);

  return (
    <section className="builder-panel">
      <div className="ability-mode__header">
        <span className="builder-panel__label">Ability scores</span>
        <div className="ability-mode__tabs">
          <button
            className={`button button--secondary button--compact${mode === "manual" ? " ability-mode__tab--active" : ""}`}
            type="button"
            onClick={() => onModeChange("manual", abilities)}
          >
            Manual
          </button>
          <button
            className={`button button--secondary button--compact${mode === "standard-array" ? " ability-mode__tab--active" : ""}`}
            type="button"
            onClick={() =>
              onModeChange("standard-array", {
                strength: 15,
                dexterity: 14,
                constitution: 13,
                intelligence: 12,
                wisdom: 10,
                charisma: 8,
              })
            }
          >
            Standard array
          </button>
          <button
            className={`button button--secondary button--compact${mode === "point-buy" ? " ability-mode__tab--active" : ""}`}
            type="button"
            onClick={() =>
              onModeChange("point-buy", {
                strength: 8,
                dexterity: 8,
                constitution: 8,
                intelligence: 8,
                wisdom: 8,
                charisma: 8,
              })
            }
          >
            Point buy
          </button>
          <button
            className={`button button--secondary button--compact${mode === "rolled" ? " ability-mode__tab--active" : ""}`}
            type="button"
            onClick={() => onModeChange("rolled", createRolledAbilities())}
          >
            Roll
          </button>
        </div>
      </div>

      <p className="route-shell__copy">
        {mode === "manual" && "Use direct entry for now. Good for testing and DM override flows."}
        {mode === "standard-array" &&
          "Assign the standard array values 15, 14, 13, 12, 10, and 8 across your six abilities."}
        {mode === "point-buy" &&
          `Spend up to 27 points. Current total: ${pointBuySpent}/27.`}
        {mode === "rolled" && "These scores were rolled. You can reroll or tweak them if needed."}
      </p>
      {validationMessage ? (
        <p className="auth-card__status auth-card__status--error">{validationMessage}</p>
      ) : null}

      <div className="ability-grid">
        {ABILITY_KEYS.map((ability) => {
          const baseScore = abilities[ability];
          const bonus = appliedBonuses[ability] ?? 0;
          const total = baseScore + bonus;
          const breakdown = bonusBreakdown?.[ability] ?? [];

          return (
            <label className="ability-card" key={ability}>
              <span className="ability-card__label">{ABILITY_LABELS[ability]}</span>
              <div className="numeric-stepper">
                <button
                  className="button button--secondary button--compact numeric-stepper__button"
                  type="button"
                  onClick={() =>
                    onAbilitiesChange(
                      nextAbilities(
                        abilities,
                        ability,
                        getAdjustedAbilityValue(abilities, ability, mode, -1),
                      ),
                    )
                  }
                  disabled={
                    mode === "standard-array"
                      ? getNextStandardArrayValue(abilities, ability, -1) === baseScore
                      : getAdjustedAbilityValue(abilities, ability, mode, -1) === baseScore
                  }
                >
                  -
                </button>
                <div className="numeric-stepper__value" aria-live="polite">
                  {baseScore}
                </div>
                <button
                  className="button button--secondary button--compact numeric-stepper__button"
                  type="button"
                  onClick={() =>
                    onAbilitiesChange(
                      nextAbilities(
                        abilities,
                        ability,
                        getAdjustedAbilityValue(abilities, ability, mode, 1),
                      ),
                    )
                  }
                  disabled={
                    mode === "standard-array"
                      ? getNextStandardArrayValue(abilities, ability, 1) === baseScore
                      : getAdjustedAbilityValue(abilities, ability, mode, 1) === baseScore
                  }
                >
                  +
                </button>
              </div>
              <span className="ability-card__meta">
                Total {total} ({formatAbilityModifier(total)})
              </span>
              {breakdown.length ? (
                <span className="ability-card__bonusNote">{breakdown.join(" · ")}</span>
              ) : null}
            </label>
          );
        })}
      </div>
    </section>
  );
}
