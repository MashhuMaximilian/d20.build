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
  racialBonuses: Record<string, number>;
  validationMessage?: string;
};

function readNumericValue(value: string, fallback: number) {
  if (value.trim() === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

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
  rawValue: string,
) {
  const requestedValue = readNumericValue(rawValue, abilities[ability]);

  if (mode === "point-buy") {
    return clampPointBuyValue(abilities, ability, requestedValue);
  }

  return clampAbilityValue(mode, requestedValue);
}

export function AbilityScoreEditor({
  abilities,
  mode,
  onAbilitiesChange,
  onModeChange,
  racialBonuses,
  validationMessage,
}: AbilityScoreEditorProps) {
  const pointBuySpent = getPointBuyTotal(abilities);
  const assignedArray = Object.values(abilities);

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
          const bonus = racialBonuses[ability] ?? 0;
          const total = baseScore + bonus;

          return (
            <label className="ability-card" key={ability}>
              <span className="ability-card__label">{ABILITY_LABELS[ability]}</span>
              {mode === "standard-array" ? (
                <select
                  className="input"
                  value={baseScore}
                  onChange={(event) =>
                    onAbilitiesChange(
                      nextAbilities(abilities, ability, Number(event.target.value)),
                    )
                  }
                >
                  {STANDARD_ARRAY.map((score) => {
                    const takenElsewhere =
                      assignedArray.filter((value) => value === score).length >=
                        STANDARD_ARRAY.filter((value) => value === score).length &&
                      baseScore !== score;

                    return (
                      <option disabled={takenElsewhere} key={score} value={score}>
                        {score}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  className="input"
                  type="number"
                  min={mode === "point-buy" ? 8 : 3}
                  max={mode === "point-buy" ? 15 : 20}
                  value={baseScore}
                  onInput={(event) =>
                    onAbilitiesChange(
                      nextAbilities(
                        abilities,
                        ability,
                        getNextAbilityValue(
                          abilities,
                          ability,
                          mode,
                          event.currentTarget.value,
                        ),
                      ),
                    )
                  }
                  onChange={(event) =>
                    onAbilitiesChange(
                      nextAbilities(
                        abilities,
                        ability,
                        getNextAbilityValue(
                          abilities,
                          ability,
                          mode,
                          event.target.value,
                        ),
                      ),
                    )
                  }
                />
              )}
              <span className="ability-card__meta">
                Total {total} ({formatAbilityModifier(total)})
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
