"use client";

import { useMemo, useState } from "react";

import { hasMarkdownContent, MarkdownRenderer } from "@/components/markdown-editor";
import type { BuiltInBackgroundRecord } from "@/lib/builtins/backgrounds";
import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import type { BuiltInElement } from "@/lib/builtins/types";
import {
  ABILITY_KEYS,
  ABILITY_LABELS,
  formatAbilityModifier,
  type AbilityKey,
  type CharacterDraft,
  type CharacterManualGrant,
  type CharacterManualGrantKind,
} from "@/lib/characters/types";
import { getInventoryEffectSummary } from "@/lib/equipment/inventory";
import {
  getPreparationCapacity,
  getSpellCastingTime,
  getSpellDuration,
  getSpellLevel,
  getSpellRange,
  getSpellSchool,
  getSpellSlotSummary,
  type SpellSelectionGroup,
} from "@/lib/progression/spellcasting";

type ReviewSheetTab = "character" | "actions" | "features" | "inventory" | "personality";

type ReviewSheetProps = {
  canSave: boolean;
  classRecordsByEntry: Array<BuiltInClassRecord | null>;
  completionChecklist: Array<{ label: string; done: boolean }>;
  draft: CharacterDraft;
  effectiveAbilities: Record<AbilityKey, number>;
  equipmentEffectSummary: ReturnType<typeof getInventoryEffectSummary>;
  equipmentProficiencies: {
    armor: string[];
    weapons: string[];
  };
  improvementBonuses: Partial<Record<AbilityKey, number>>;
  manualGrantsByKind: Record<CharacterManualGrantKind, CharacterManualGrant[]>;
  navigationWarnings: string[];
  racialBonuses: Partial<Record<AbilityKey, number>>;
  saveValidationMessage: string;
  selectedBackground: BuiltInBackgroundRecord | null;
  selectedBackgroundFeatureElements: BuiltInElement[];
  selectedClassFeatureElements: BuiltInElement[];
  selectedFeatElements: BuiltInElement[];
  selectedLanguageIds: string[];
  selectedLanguageNames: string[];
  selectedProgressionElements: BuiltInElement[];
  selectedProficiencyIds: string[];
  selectedProficiencyNames: string[];
  selectedRace: BuiltInRaceRecord | null;
  selectedRacialTraitElements: BuiltInElement[];
  selectedSpellIds: string[];
  selectedSubrace: BuiltInElement | null;
  spellGroups: SpellSelectionGroup[];
  spells: BuiltInElement[];
};

type ReviewResource = {
  id: string;
  label: string;
  value: string;
  meta?: string;
};

type ReviewActionCard = {
  id: string;
  title: string;
  timing: string;
  summary: string;
  cost?: string;
  source?: string;
};

const TAB_OPTIONS: Array<{ id: ReviewSheetTab; label: string; eyebrow: string }> = [
  { id: "character", label: "Character", eyebrow: "Overview" },
  { id: "actions", label: "Actions & Spells", eyebrow: "Play surface" },
  { id: "features", label: "Features", eyebrow: "Reference" },
  { id: "inventory", label: "Inventory", eyebrow: "Gear" },
  { id: "personality", label: "Personality", eyebrow: "Narrative" },
];

const FEATURE_ACTION_RULES: Array<{
  match: RegExp;
  timing: string;
  summary: string;
  cost?: string;
}> = [
  { match: /^Action Surge$/i, timing: "Free action", summary: "Take one additional action on your turn.", cost: "1 use" },
  { match: /^Second Wind$/i, timing: "Bonus action", summary: "Regain hit points using your fighter recovery.", cost: "1 use" },
  { match: /^Flurry of Blows$/i, timing: "Bonus action", summary: "After Attack, make two unarmed strikes.", cost: "1 ki" },
  { match: /^Stunning Strike$/i, timing: "On hit", summary: "Force a Constitution save or stun the target until your next turn.", cost: "1 ki" },
  { match: /^Rage$/i, timing: "Bonus action", summary: "Enter a rage with damage and resilience benefits." },
  { match: /^Wild Shape$/i, timing: "Action", summary: "Transform into a beast form using your druid training.", cost: "1 use" },
  { match: /^Channel Divinity$/i, timing: "Action / feature", summary: "Spend one Channel Divinity use on a subclass option.", cost: "1 use" },
  { match: /^Bardic Inspiration$/i, timing: "Bonus action", summary: "Grant an inspiration die to an ally within range.", cost: "1 use" },
  { match: /^Lay on Hands$/i, timing: "Action", summary: "Restore hit points from the Lay on Hands pool.", cost: "Pool spend" },
  { match: /^Misty Visions$/i, timing: "Action", summary: "Cast Silent Image at will without spending a slot.", cost: "At will" },
];

function humanizeGrantedId(value: string) {
  return value
    .replace(/^ID_/, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function uniqueById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

function toFeatureMarkup(element: BuiltInElement) {
  return element.descriptionHtml || "";
}

function FeatureContent({ element }: { element: BuiltInElement }) {
  const markup = toFeatureMarkup(element);

  if (markup) {
    return <div className="review-sheet__featureBody" dangerouslySetInnerHTML={{ __html: markup }} />;
  }

  if (element.description) {
    return <p className="builder-summary__meta">{element.description}</p>;
  }

  return <p className="builder-summary__meta">No additional reference text in the current source.</p>;
}

function deriveReviewResources(args: {
  classRecordsByEntry: Array<BuiltInClassRecord | null>;
  draft: CharacterDraft;
  effectiveAbilities: Record<AbilityKey, number>;
  equipmentEffectSummary: ReturnType<typeof getInventoryEffectSummary>;
  selectedClassFeatureElements: BuiltInElement[];
  spellGroups: SpellSelectionGroup[];
}) {
  const resources: ReviewResource[] = [
    {
      id: "attunement",
      label: "Attunement",
      value: `${args.equipmentEffectSummary.attunedCount}/${args.equipmentEffectSummary.attunementLimit}`,
      meta: "Active attuned items",
    },
  ];

  args.classRecordsByEntry.forEach((record, index) => {
    const entry = args.draft.classEntries[index];
    if (!record || !entry?.classId) {
      return;
    }

    const className = record.class.name;
    const featureNames = new Set(args.selectedClassFeatureElements.map((feature) => feature.name.toLowerCase()));
    const slotSummary = getSpellSlotSummary(record.class.rules, entry.level);
    if (slotSummary.length) {
      resources.push({
        id: `${record.class.id}-slots`,
        label: `${className} slots`,
        value: slotSummary.map(({ slotLevel, count }) => `L${slotLevel}:${count}`).join(" • "),
        meta: "Explicit slot progression",
      });
    }

    const preparationCapacity = getPreparationCapacity(record.class.rules, entry.level, args.effectiveAbilities);
    if (preparationCapacity > 0 && args.spellGroups.some((group) => group.ownerLabel === className && group.kind === "prepared")) {
      resources.push({
        id: `${record.class.id}-prepared`,
        label: `${className} prepared`,
        value: `${preparationCapacity}`,
        meta: "Preparation capacity",
      });
    }

    if (/monk/i.test(className) && featureNames.has("ki")) {
      resources.push({ id: `${record.class.id}-ki`, label: "Ki points", value: `${entry.level}`, meta: "Modeled from monk level" });
    }

    if (/sorcerer/i.test(className) && (featureNames.has("font of magic") || featureNames.has("sorcery points"))) {
      resources.push({ id: `${record.class.id}-sorcery`, label: "Sorcery points", value: `${entry.level}`, meta: "Modeled from sorcerer level" });
    }

    if (/paladin/i.test(className) && featureNames.has("lay on hands")) {
      resources.push({ id: `${record.class.id}-lay-on-hands`, label: "Lay on Hands", value: `${entry.level * 5}`, meta: "Healing pool" });
    }

    if (/fighter/i.test(className) && featureNames.has("action surge")) {
      resources.push({ id: `${record.class.id}-action-surge`, label: "Action Surge", value: "1 use", meta: "Short-rest refresh" });
    }

    if (/fighter/i.test(className) && featureNames.has("second wind")) {
      resources.push({ id: `${record.class.id}-second-wind`, label: "Second Wind", value: "1 use", meta: "Short-rest refresh" });
    }

    if (/druid/i.test(className) && featureNames.has("wild shape")) {
      resources.push({ id: `${record.class.id}-wild-shape`, label: "Wild Shape", value: "2 uses", meta: "Baseline 2014 pool" });
    }

    if (/cleric|paladin/i.test(className) && featureNames.has("channel divinity")) {
      resources.push({ id: `${record.class.id}-channel-divinity`, label: "Channel Divinity", value: "1 use", meta: "Tracked conservatively" });
    }

    if (/bard/i.test(className) && featureNames.has("bardic inspiration")) {
      resources.push({
        id: `${record.class.id}-bardic-inspiration`,
        label: "Bardic Inspiration",
        value: `${Math.max(1, Math.floor((args.effectiveAbilities.charisma - 10) / 2))}`,
        meta: "Uses based on Charisma modifier",
      });
    }
  });

  return uniqueById(resources);
}

function deriveWeaponActionCards(items: CharacterDraft["inventoryItems"]) {
  return items
    .filter((item) => item.equipped && item.category === "weapon")
    .map((item) => ({
      id: `weapon-${item.id}`,
      title: item.name,
      timing: "Attack",
      summary: item.damage || item.baseDamage || "Weapon attack",
      cost: item.attackBonus ? `Modifier ${item.attackBonus}` : undefined,
      source: item.sourceLabel,
    }));
}

function deriveFeatureActionCards(elements: BuiltInElement[]) {
  return uniqueById(
    elements.flatMap((element) => {
      const rule = FEATURE_ACTION_RULES.find((entry) => entry.match.test(element.name));
      if (!rule) {
        return [];
      }

      return [
        {
          id: `feature-action-${element.id}`,
          title: element.name,
          timing: rule.timing,
          summary: rule.summary,
          cost: rule.cost,
          source: element.source,
        } satisfies ReviewActionCard,
      ];
    }),
  );
}

function deriveSpellGroupCards(groups: SpellSelectionGroup[], spells: BuiltInElement[], selectedSpellIds: string[]) {
  const spellsById = new Map(spells.map((spell) => [spell.id, spell]));

  return groups.map((group) => {
    const ids = [...new Set([...(group.grantedSpellIds ?? []), ...selectedSpellIds.filter((id) => (group.availableSpellIds ?? []).includes(id))])];
    const entries = ids
      .map((id) => spellsById.get(id))
      .filter((spell): spell is BuiltInElement => Boolean(spell));

    return {
      group,
      entries,
    };
  });
}

function buildFeatureSections(args: {
  selectedBackground: BuiltInBackgroundRecord | null;
  selectedBackgroundFeatureElements: BuiltInElement[];
  selectedClassFeatureElements: BuiltInElement[];
  selectedFeatElements: BuiltInElement[];
  selectedProgressionElements: BuiltInElement[];
  selectedRace: BuiltInRaceRecord | null;
  selectedRacialTraitElements: BuiltInElement[];
  selectedSubrace: BuiltInElement | null;
  manualFeatureGrants: CharacterManualGrant[];
}) {
  const sections: Array<{ id: string; title: string; items: Array<BuiltInElement | CharacterManualGrant> }> = [];

  const raceItems = [
    ...(args.selectedRace ? [args.selectedRace.race] : []),
    ...(args.selectedSubrace ? [args.selectedSubrace] : []),
    ...args.selectedRacialTraitElements,
  ];
  if (raceItems.length) {
    sections.push({ id: "race", title: "Race & lineage", items: uniqueById(raceItems as BuiltInElement[]) });
  }

  if (args.selectedClassFeatureElements.length || args.selectedProgressionElements.length) {
    sections.push({
      id: "class",
      title: "Class, subclass, and build choices",
      items: uniqueById([...args.selectedClassFeatureElements, ...args.selectedProgressionElements]),
    });
  }

  const backgroundItems = [
    ...(args.selectedBackground ? [args.selectedBackground.background] : []),
    ...args.selectedBackgroundFeatureElements,
  ];
  if (backgroundItems.length) {
    sections.push({ id: "background", title: "Background", items: uniqueById(backgroundItems as BuiltInElement[]) });
  }

  if (args.selectedFeatElements.length) {
    sections.push({ id: "feats", title: "Feats", items: uniqueById(args.selectedFeatElements) });
  }

  if (args.manualFeatureGrants.length) {
    sections.push({ id: "manual", title: "Manual / DM feature grants", items: args.manualFeatureGrants });
  }

  return sections;
}

function renderManualGrant(grant: CharacterManualGrant) {
  return (
    <article className="review-sheet__featureCard" key={grant.id}>
      <span className="builder-panel__label">Manual grant</span>
      <strong className="builder-summary__name">{grant.name}</strong>
      <p className="builder-summary__meta">
        {grant.source || "Manual / DM grant"}
        {grant.note ? ` • ${grant.note}` : ""}
      </p>
      {grant.description ? <p className="builder-summary__meta">{grant.description}</p> : null}
    </article>
  );
}

export function ReviewSheetStep(props: ReviewSheetProps) {
  const [activeTab, setActiveTab] = useState<ReviewSheetTab>("character");

  const resources = useMemo(
    () =>
      deriveReviewResources({
        classRecordsByEntry: props.classRecordsByEntry,
        draft: props.draft,
        effectiveAbilities: props.effectiveAbilities,
        equipmentEffectSummary: props.equipmentEffectSummary,
        selectedClassFeatureElements: props.selectedClassFeatureElements,
        spellGroups: props.spellGroups,
      }),
    [
      props.classRecordsByEntry,
      props.draft,
      props.effectiveAbilities,
      props.equipmentEffectSummary,
      props.selectedClassFeatureElements,
      props.spellGroups,
    ],
  );

  const actionCards = useMemo(
    () =>
      uniqueById([
        ...deriveWeaponActionCards(props.draft.inventoryItems),
        ...deriveFeatureActionCards([
          ...props.selectedClassFeatureElements,
          ...props.selectedProgressionElements,
          ...props.selectedFeatElements,
        ]),
      ]),
    [
      props.draft.inventoryItems,
      props.selectedClassFeatureElements,
      props.selectedProgressionElements,
      props.selectedFeatElements,
    ],
  );

  const spellGroupCards = useMemo(
    () => deriveSpellGroupCards(props.spellGroups, props.spells, props.selectedSpellIds),
    [props.selectedSpellIds, props.spellGroups, props.spells],
  );

  const featureSections = useMemo(
    () =>
      buildFeatureSections({
        selectedBackground: props.selectedBackground,
        selectedBackgroundFeatureElements: props.selectedBackgroundFeatureElements,
        selectedClassFeatureElements: props.selectedClassFeatureElements,
        selectedFeatElements: props.selectedFeatElements,
        selectedProgressionElements: props.selectedProgressionElements,
        selectedRace: props.selectedRace,
        selectedRacialTraitElements: props.selectedRacialTraitElements,
        selectedSubrace: props.selectedSubrace,
        manualFeatureGrants: props.manualGrantsByKind.feature,
      }),
    [
      props.manualGrantsByKind.feature,
      props.selectedBackground,
      props.selectedBackgroundFeatureElements,
      props.selectedClassFeatureElements,
      props.selectedFeatElements,
      props.selectedProgressionElements,
      props.selectedRace,
      props.selectedRacialTraitElements,
      props.selectedSubrace,
    ],
  );

  const classSplit = props.draft.classEntries
    .flatMap((entry, index) => {
      const record = props.classRecordsByEntry[index];
      return entry.classId && record ? [`${record.class.name} ${entry.level}`] : [];
    })
    .join(" / ");

  const readinessWarnings = [
    ...(props.saveValidationMessage ? [props.saveValidationMessage] : []),
    ...props.navigationWarnings,
  ].filter(Boolean);

  return (
    <section className="builder-stepPanel review-sheet">
      <div className="builder-stepPanel__intro">
        <span className="route-shell__tag">Review</span>
        <h2 className="route-shell__title">Read the draft like a real character sheet</h2>
        <p className="route-shell__copy">
          This is the web-first sheet surface: stats, resources, actions, spells, features, inventory, and personality in one place without waiting for PDF export.
        </p>
      </div>

      <div className="review-sheet__tabBar">
        {TAB_OPTIONS.map((tab) => (
          <button
            className={`review-sheet__tab${activeTab === tab.id ? " review-sheet__tab--active" : ""}`}
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.eyebrow}</span>
            <strong>{tab.label}</strong>
          </button>
        ))}
      </div>

      {activeTab === "character" ? (
        <div className="review-sheet__grid">
          <article className="builder-review__card review-sheet__card--span2">
            <span className="builder-panel__label">Readiness</span>
            <strong className="builder-summary__name">{props.canSave ? "Ready to save" : "Needs attention"}</strong>
            <p className="builder-summary__meta">
              {props.canSave
                ? "The guided build is in a saveable state."
                : props.saveValidationMessage || "Finish the remaining blockers before saving."}
            </p>
            <div className="review-sheet__checklist">
              {props.completionChecklist.map((item) => (
                <div className={`review-sheet__checkItem${item.done ? " is-complete" : " is-pending"}`} key={item.label}>
                  <span>{item.done ? "Done" : "Pending"}</span>
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
            {readinessWarnings.length ? (
              <div className="review-sheet__warningBlock">
                {readinessWarnings.map((warning) => (
                  <p className="auth-card__status auth-card__status--error builder-navigation__warningItem" key={warning}>
                    {warning}
                  </p>
                ))}
              </div>
            ) : null}
          </article>

          <article className="builder-review__card">
            <span className="builder-panel__label">Identity</span>
            <strong className="builder-summary__name">{props.draft.name || "Untitled Adventurer"}</strong>
            <p className="builder-summary__meta">Player: {props.draft.playerName || "Unassigned"}</p>
            <p className="builder-summary__meta">Race: {props.selectedRace?.race.name ?? "Missing"}</p>
            <p className="builder-summary__meta">Lineage: {props.selectedSubrace?.name ?? (props.selectedRace?.subraces.length ? "Missing" : "Not required")}</p>
            <p className="builder-summary__meta">Background: {props.selectedBackground?.background.name ?? "Missing"}</p>
            <p className="builder-summary__meta">Class split: {classSplit || "Missing"}</p>
            <p className="builder-summary__meta">Level {props.draft.level}</p>
          </article>

          <article className="builder-review__card">
            <span className="builder-panel__label">Resources</span>
            <p className="builder-summary__meta">This pass only shows resource pools we can justify from current rules and sheet state.</p>
            <div className="review-sheet__resourceGrid">
              {resources.map((resource) => (
                <div className="ability-card" key={resource.id}>
                  <span className="ability-card__label">{resource.label}</span>
                  <strong className="summary-card__value">{resource.value}</strong>
                  <span className="ability-card__meta">{resource.meta || "Tracked"}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="builder-review__card review-sheet__card--span2">
            <span className="builder-panel__label">Ability scores</span>
            <div className="ability-grid">
              {ABILITY_KEYS.map((ability) => (
                <div className="ability-card" key={ability}>
                  <span className="ability-card__label">{ABILITY_LABELS[ability]}</span>
                  <strong className="summary-card__value">{props.effectiveAbilities[ability]}</strong>
                  <span className="ability-card__meta">{formatAbilityModifier(props.effectiveAbilities[ability])}</span>
                  <span className="ability-card__meta">
                    Base {props.draft.abilities[ability]}
                    {props.racialBonuses[ability] ? ` • racial ${props.racialBonuses[ability] >= 0 ? "+" : ""}${props.racialBonuses[ability]}` : ""}
                    {props.improvementBonuses[ability] ? ` • ASI ${props.improvementBonuses[ability] >= 0 ? "+" : ""}${props.improvementBonuses[ability]}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="builder-review__card review-sheet__card--span2">
            <span className="builder-panel__label">Proficiencies and languages</span>
            <div className="review-sheet__twoColumn">
              <div className="review-sheet__listBlock">
                <strong>Armor and weapons</strong>
                <p className="builder-summary__meta">Armor: {props.equipmentProficiencies.armor.length ? props.equipmentProficiencies.armor.join(", ") : "None detected"}</p>
                <p className="builder-summary__meta">Weapons: {props.equipmentProficiencies.weapons.length ? props.equipmentProficiencies.weapons.join(", ") : "None detected"}</p>
              </div>
              <div className="review-sheet__listBlock">
                <strong>Selected proficiencies</strong>
                <p className="builder-summary__meta">
                  {[...props.selectedProficiencyNames, ...props.selectedProficiencyIds.map(humanizeGrantedId), ...props.manualGrantsByKind.proficiency.map((grant) => grant.name)]
                    .filter(Boolean)
                    .join(", ") || "None detected"}
                </p>
              </div>
              <div className="review-sheet__listBlock review-sheet__listBlock--full">
                <strong>Languages</strong>
                <p className="builder-summary__meta">
                  {[...props.selectedLanguageNames, ...props.selectedLanguageIds.map(humanizeGrantedId), ...props.manualGrantsByKind.language.map((grant) => grant.name)]
                    .filter(Boolean)
                    .join(", ") || "None detected"}
                </p>
              </div>
            </div>
          </article>
        </div>
      ) : null}

      {activeTab === "actions" ? (
        <div className="review-sheet__grid">
          <article className="builder-review__card review-sheet__card--span2">
            <span className="builder-panel__label">Action surface</span>
            <p className="builder-summary__meta">Compact table-facing actions derived from equipped gear and known action-like features.</p>
            <div className="review-sheet__actionGrid">
              {actionCards.length ? (
                actionCards.map((card) => (
                  <article className="review-sheet__actionCard" key={card.id}>
                    <span className="builder-panel__label">{card.timing}</span>
                    <strong className="builder-summary__name">{card.title}</strong>
                    <p className="builder-summary__meta">{card.summary}</p>
                    <p className="builder-summary__meta">
                      {[card.cost, card.source].filter(Boolean).join(" • ") || "Always available"}
                    </p>
                  </article>
                ))
              ) : (
                <p className="builder-summary__meta">No compact actions detected yet. Martial attacks will appear from equipped weapons, and explicit feature actions will show as the build grows.</p>
              )}
            </div>
          </article>

          <article className="builder-review__card review-sheet__card--span2">
            <span className="builder-panel__label">Spellcasting</span>
            <div className="review-sheet__spellGroupGrid">
              {spellGroupCards.length ? (
                spellGroupCards.map(({ group, entries }) => (
                  <article className="review-sheet__spellGroupCard" key={group.id}>
                    <span className="builder-panel__label">{group.ownerLabel}</span>
                    <strong className="builder-summary__name">{group.title}</strong>
                    <p className="builder-summary__meta">
                      {group.kind === "granted"
                        ? `${entries.length} granted`
                        : `${props.draft.spellSelections[group.id]?.length ?? 0}/${group.maxSelections} selected`}
                    </p>
                    {entries.length ? (
                      <div className="review-sheet__spellList">
                        {entries.map((spell) => (
                          <article className="review-sheet__spellCard" key={`${group.id}-${spell.id}`}>
                            <strong>{spell.name}</strong>
                            <p>{getSpellLevel(spell) === 0 ? "Cantrip" : `Level ${getSpellLevel(spell)}`} • {getSpellSchool(spell)}</p>
                            <p>{getSpellCastingTime(spell)} • {getSpellRange(spell)} • {getSpellDuration(spell)}</p>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="builder-summary__meta">No spells chosen in this group yet.</p>
                    )}
                  </article>
                ))
              ) : (
                <p className="builder-summary__meta">No spell groups are active for this build.</p>
              )}
            </div>
          </article>
        </div>
      ) : null}

      {activeTab === "features" ? (
        <div className="review-sheet__sectionStack">
          {featureSections.length ? (
            featureSections.map((section) => (
              <article className="builder-review__card" key={section.id}>
                <span className="builder-panel__label">{section.title}</span>
                <div className="review-sheet__featureGrid">
                  {section.items.map((item) =>
                    "kind" in item ? (
                      renderManualGrant(item)
                    ) : (
                      <article className="review-sheet__featureCard" key={item.id}>
                        <span className="builder-panel__label">{item.source || item.type}</span>
                        <strong className="builder-summary__name">{item.name}</strong>
                        <FeatureContent element={item} />
                      </article>
                    ),
                  )}
                </div>
              </article>
            ))
          ) : (
            <article className="builder-review__card">
              <span className="builder-panel__label">Features</span>
              <p className="builder-summary__meta">No feature surfaces are available yet for this draft.</p>
            </article>
          )}
        </div>
      ) : null}

      {activeTab === "inventory" ? (
        <div className="review-sheet__grid">
          <article className="builder-review__card">
            <span className="builder-panel__label">Inventory snapshot</span>
            <div className="review-sheet__resourceGrid">
              <div className="ability-card">
                <span className="ability-card__label">Owned</span>
                <strong className="summary-card__value">{props.draft.inventoryItems.length}</strong>
                <span className="ability-card__meta">Total entries</span>
              </div>
              <div className="ability-card">
                <span className="ability-card__label">Equipped</span>
                <strong className="summary-card__value">{props.equipmentEffectSummary.equippedCount}</strong>
                <span className="ability-card__meta">Active gear</span>
              </div>
              <div className="ability-card">
                <span className="ability-card__label">Attuned</span>
                <strong className="summary-card__value">{props.equipmentEffectSummary.attunedCount}</strong>
                <span className="ability-card__meta">Of {props.equipmentEffectSummary.attunementLimit}</span>
              </div>
            </div>
            <p className="builder-summary__meta">
              Currency: {props.draft.inventoryCurrency.pp} pp • {props.draft.inventoryCurrency.gp} gp • {props.draft.inventoryCurrency.ep} ep • {props.draft.inventoryCurrency.sp} sp • {props.draft.inventoryCurrency.cp} cp
            </p>
          </article>

          <article className="builder-review__card">
            <span className="builder-panel__label">Equipment effects</span>
            {[
              ...props.equipmentEffectSummary.acLines,
              ...props.equipmentEffectSummary.weaponLines,
              ...props.equipmentEffectSummary.itemGrantLines,
            ].length ? (
              <ul className="route-shell__list">
                {[
                  ...props.equipmentEffectSummary.acLines,
                  ...props.equipmentEffectSummary.weaponLines,
                  ...props.equipmentEffectSummary.itemGrantLines,
                ].map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="builder-summary__meta">No active equipment effects yet.</p>
            )}
          </article>

          <article className="builder-review__card review-sheet__card--span2">
            <span className="builder-panel__label">Owned gear</span>
            <div className="review-sheet__inventoryList">
              {props.draft.inventoryItems.length ? (
                props.draft.inventoryItems.map((item) => (
                  <article className="review-sheet__inventoryCard" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.sourceLabel}</p>
                    </div>
                    <div>
                      <p>{item.category}</p>
                      <p>Qty {item.quantity}</p>
                    </div>
                    <div>
                      <p>{item.equipped ? "Equipped" : "Stored"}</p>
                      <p>{item.attuned ? "Attuned" : item.attunable ? "Attunable" : "No attunement"}</p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="builder-summary__meta">No inventory entries yet.</p>
              )}
            </div>
          </article>

          {(hasMarkdownContent(props.draft.equipmentNotes.additionalTreasure) || hasMarkdownContent(props.draft.equipmentNotes.questItems)) ? (
            <article className="builder-review__card review-sheet__card--span2">
              <span className="builder-panel__label">Treasure and quest notes</span>
              <div className="backstory-step__sheetGrid">
                {hasMarkdownContent(props.draft.equipmentNotes.additionalTreasure) ? (
                  <article className="backstory-step__sheetCard">
                    <strong className="builder-summary__name">Additional treasure</strong>
                    <MarkdownRenderer compact value={props.draft.equipmentNotes.additionalTreasure} />
                  </article>
                ) : null}
                {hasMarkdownContent(props.draft.equipmentNotes.questItems) ? (
                  <article className="backstory-step__sheetCard">
                    <strong className="builder-summary__name">Quest items</strong>
                    <MarkdownRenderer compact value={props.draft.equipmentNotes.questItems} />
                  </article>
                ) : null}
              </div>
            </article>
          ) : null}

          {props.draft.manualGrants.length ? (
            <article className="builder-review__card review-sheet__card--span2">
              <span className="builder-panel__label">Additional build grants</span>
              <ul className="route-shell__list">
                {props.draft.manualGrants.map((grant) => (
                  <li key={grant.id}>
                    <strong>{grant.name}</strong> ({grant.kind}
                    {grant.source ? ` • ${grant.source}` : ""})
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>
      ) : null}

      {activeTab === "personality" ? (
        <div className="review-sheet__sectionStack">
          {Object.entries(props.draft.backstory).some(([, value]) => hasMarkdownContent(value)) ? (
            <article className="builder-review__card">
              <span className="builder-panel__label">Backstory and personality</span>
              <div className="backstory-step__sheetGrid">
                {Object.entries(props.draft.backstory)
                  .filter(([, value]) => hasMarkdownContent(value))
                  .map(([key, value]) => (
                    <article className="backstory-step__sheetCard" key={key}>
                      <strong className="builder-summary__name">
                        {key === "alliesAndOrganizations"
                          ? "Allies and organizations"
                          : key === "additionalFeatures"
                            ? "Additional features"
                            : key.charAt(0).toUpperCase() + key.slice(1)}
                      </strong>
                      <MarkdownRenderer compact value={value} />
                    </article>
                  ))}
              </div>
            </article>
          ) : (
            <article className="builder-review__card">
              <span className="builder-panel__label">Backstory and personality</span>
              <p className="builder-summary__meta">No narrative notes yet.</p>
            </article>
          )}
        </div>
      ) : null}
    </section>
  );
}
