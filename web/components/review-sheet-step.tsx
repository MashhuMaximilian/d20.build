"use client";

import { useMemo, useState, type ReactNode } from "react";

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
  getSpellComponents,
  getSpellDuration,
  getSpellLevel,
  getSpellRange,
  getSpellSchool,
  getSpellSlotSummary,
  isSpellConcentration,
  isSpellRitual,
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

type ReviewDetailState =
  | {
      kind: "spell";
      spell: BuiltInElement;
      groupLabel: string;
      badges: string[];
    }
  | {
      kind: "feature";
      feature: BuiltInElement;
      badges: string[];
    }
  | {
      kind: "manual-grant";
      grant: CharacterManualGrant;
      badges: string[];
    }
  | {
      kind: "item";
      item: CharacterDraft["inventoryItems"][number];
      badges: string[];
    }
  | {
      kind: "action";
      action: ReviewActionCard;
      badges: string[];
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

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sentencePreview(value: string, fallback = "No short summary available.") {
  const cleaned = stripHtml(value);
  if (!cleaned) {
    return fallback;
  }
  const sentence = cleaned.match(/.+?[.!?](?:\s|$)/)?.[0]?.trim() ?? cleaned;
  return sentence.length > 180 ? `${sentence.slice(0, 177)}...` : sentence;
}

function titleizeBackstoryKey(key: string) {
  switch (key) {
    case "alliesAndOrganizations":
      return "Allies and Organizations";
    case "additionalFeatures":
      return "Additional Features";
    case "personalityTraits":
      return "Personality Traits";
    default:
      return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (char) => char.toUpperCase());
  }
}

function uniqueByNameAndSource<T extends { name: string; source?: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.name.toLowerCase()}::${(item.source ?? "").toLowerCase()}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
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

function getFeaturePreview(element: BuiltInElement) {
  if (element.prerequisite) {
    return element.prerequisite;
  }

  if (element.descriptionHtml) {
    return sentencePreview(element.descriptionHtml);
  }

  return element.description || "No short summary available.";
}

function getSpellPreview(spell: BuiltInElement) {
  return `${getSpellLevel(spell) === 0 ? "Cantrip" : `Level ${getSpellLevel(spell)}`} • ${getSpellSchool(spell)} • ${getSpellCastingTime(spell)}`;
}

function getSpellBadges(spell: BuiltInElement) {
  return uniqueStrings([
    getSpellLevel(spell) === 0 ? "Cantrip" : `Level ${getSpellLevel(spell)}`,
    getSpellSchool(spell),
    isSpellRitual(spell) ? "Ritual" : "",
    isSpellConcentration(spell) ? "Concentration" : "",
  ]);
}

function getInventoryItemBadges(item: CharacterDraft["inventoryItems"][number]) {
  return uniqueStrings([
    item.category,
    item.family ?? "",
    item.rarity ?? "",
    item.equipped ? "Equipped" : "Stored",
    item.attuned ? "Attuned" : item.attunable ? "Attunable" : "",
  ]);
}

function getInventoryItemPreview(item: CharacterDraft["inventoryItems"][number]) {
  const parts = uniqueStrings([
    item.baseDamage || item.damage || "",
    item.attackBonus ? `Modifier ${item.attackBonus}` : "",
    item.notes ? sentencePreview(item.notes) : "",
  ]);

  return parts.join(" • ") || "No active mechanics shown.";
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

  const raceItems = [...args.selectedRacialTraitElements];
  if (raceItems.length) {
    sections.push({ id: "race", title: "Race & lineage", items: uniqueByNameAndSource(raceItems as BuiltInElement[]) });
  }

  if (args.selectedClassFeatureElements.length || args.selectedProgressionElements.length) {
    sections.push({
      id: "class",
      title: "Class, subclass, and build choices",
      items: uniqueByNameAndSource([...args.selectedClassFeatureElements, ...args.selectedProgressionElements]),
    });
  }

  const backgroundItems = [...args.selectedBackgroundFeatureElements];
  if (backgroundItems.length) {
    sections.push({ id: "background", title: "Background", items: uniqueByNameAndSource(backgroundItems as BuiltInElement[]) });
  }

  if (args.selectedFeatElements.length) {
    sections.push({ id: "feats", title: "Feats", items: uniqueByNameAndSource(args.selectedFeatElements) });
  }

  if (args.manualFeatureGrants.length) {
    sections.push({ id: "manual", title: "Manual / DM feature grants", items: args.manualFeatureGrants });
  }

  return sections;
}

function renderManualGrant(grant: CharacterManualGrant, onOpen: () => void) {
  return (
    <button className="review-sheet__compactRow" key={grant.id} type="button" onClick={onOpen}>
      <div className="review-sheet__compactMain">
        <strong>{grant.name}</strong>
        <span>{grant.source || "Manual / DM grant"}</span>
      </div>
      <div className="review-sheet__compactMeta">
        <span className="review-sheet__chip">Manual grant</span>
        <p>{grant.note || grant.description || "Open details"}</p>
      </div>
    </button>
  );
}

function ReviewDetailDrawer({
  detail,
  onClose,
}: {
  detail: ReviewDetailState | null;
  onClose: () => void;
}) {
  if (!detail) {
    return null;
  }

  let title = "";
  let subtitle = "";
  let body: ReactNode = null;

  if (detail.kind === "spell") {
    title = detail.spell.name;
    subtitle = detail.spell.source;
    body = (
      <>
        <div className="review-sheet__detailGrid">
          <div className="review-sheet__detailStat">
            <span>Level</span>
            <strong>{getSpellLevel(detail.spell) === 0 ? "Cantrip" : getSpellLevel(detail.spell)}</strong>
          </div>
          <div className="review-sheet__detailStat">
            <span>School</span>
            <strong>{getSpellSchool(detail.spell)}</strong>
          </div>
          <div className="review-sheet__detailStat">
            <span>Casting time</span>
            <strong>{getSpellCastingTime(detail.spell)}</strong>
          </div>
          <div className="review-sheet__detailStat">
            <span>Range</span>
            <strong>{getSpellRange(detail.spell)}</strong>
          </div>
          <div className="review-sheet__detailStat">
            <span>Duration</span>
            <strong>{getSpellDuration(detail.spell)}</strong>
          </div>
          <div className="review-sheet__detailStat">
            <span>Components</span>
            <strong>{getSpellComponents(detail.spell) || "—"}</strong>
          </div>
        </div>
        <div className="review-sheet__detailBody">
          <FeatureContent element={detail.spell} />
        </div>
      </>
    );
  }

  if (detail.kind === "feature") {
    title = detail.feature.name;
    subtitle = detail.feature.source || detail.feature.type;
    body = (
      <div className="review-sheet__detailBody">
        <FeatureContent element={detail.feature} />
      </div>
    );
  }

  if (detail.kind === "manual-grant") {
    title = detail.grant.name;
    subtitle = detail.grant.source || "Manual / DM grant";
    body = (
      <div className="review-sheet__detailBody">
        {detail.grant.note ? <p className="builder-summary__meta">{detail.grant.note}</p> : null}
        {detail.grant.description ? <p className="builder-summary__meta">{detail.grant.description}</p> : null}
      </div>
    );
  }

  if (detail.kind === "item") {
    title = detail.item.name;
    subtitle = detail.item.sourceLabel;
    body = (
      <>
        <div className="review-sheet__detailGrid">
          <div className="review-sheet__detailStat">
            <span>Category</span>
            <strong>{detail.item.category}</strong>
          </div>
          <div className="review-sheet__detailStat">
            <span>Quantity</span>
            <strong>{detail.item.quantity}</strong>
          </div>
          <div className="review-sheet__detailStat">
            <span>State</span>
            <strong>{detail.item.equipped ? "Equipped" : "Stored"}</strong>
          </div>
          <div className="review-sheet__detailStat">
            <span>Attunement</span>
            <strong>{detail.item.attuned ? "Attuned" : detail.item.attunable ? "Attunable" : "No attunement"}</strong>
          </div>
          {detail.item.baseDamage || detail.item.damage ? (
            <div className="review-sheet__detailStat">
              <span>Damage</span>
              <strong>{detail.item.damage || detail.item.baseDamage}</strong>
            </div>
          ) : null}
          {detail.item.attackBonus ? (
            <div className="review-sheet__detailStat">
              <span>Modifier</span>
              <strong>{detail.item.attackBonus}</strong>
            </div>
          ) : null}
        </div>
        {detail.item.detailHtml ? (
          <div className="review-sheet__detailBody" dangerouslySetInnerHTML={{ __html: detail.item.detailHtml }} />
        ) : detail.item.notes ? (
          <div className="review-sheet__detailBody">
            <p className="builder-summary__meta">{detail.item.notes}</p>
          </div>
        ) : null}
      </>
    );
  }

  if (detail.kind === "action") {
    title = detail.action.title;
    subtitle = detail.action.source || detail.action.timing;
    body = (
      <div className="review-sheet__detailBody">
        <p className="builder-summary__meta">{detail.action.summary}</p>
        {detail.action.cost ? <p className="builder-summary__meta">Cost: {detail.action.cost}</p> : null}
      </div>
    );
  }

  return (
    <div className="review-sheet__detailOverlay" role="dialog" aria-modal="true">
      <button aria-label="Close details" className="review-sheet__detailBackdrop" type="button" onClick={onClose} />
      <aside className="review-sheet__detailDrawer">
        <div className="review-sheet__detailHeader">
          <div className="review-sheet__detailTitle">
            <span className="builder-panel__label">Details</span>
            <strong className="builder-summary__name">{title}</strong>
            <p className="builder-summary__meta">{subtitle}</p>
          </div>
          <button className="builder-button builder-button--ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="review-sheet__chipList">
          {detail.badges.map((badge) => (
            <span className="review-sheet__chip" key={badge}>
              {badge}
            </span>
          ))}
        </div>
        {body}
      </aside>
    </div>
  );
}

export function ReviewSheetStep(props: ReviewSheetProps) {
  const [activeTab, setActiveTab] = useState<ReviewSheetTab>("character");
  const [detail, setDetail] = useState<ReviewDetailState | null>(null);

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

  const selectedProficiencyLabels = useMemo(
    () =>
      uniqueStrings([
        ...props.selectedProficiencyNames,
        ...props.selectedProficiencyIds.map(humanizeGrantedId),
        ...props.manualGrantsByKind.proficiency.map((grant) => grant.name),
      ]),
    [props.manualGrantsByKind.proficiency, props.selectedProficiencyIds, props.selectedProficiencyNames],
  );

  const selectedLanguageLabels = useMemo(
    () =>
      uniqueStrings([
        ...props.selectedLanguageNames,
        ...props.selectedLanguageIds.map(humanizeGrantedId),
        ...props.manualGrantsByKind.language.map((grant) => grant.name),
      ]),
    [props.manualGrantsByKind.language, props.selectedLanguageIds, props.selectedLanguageNames],
  );

  const allEffectLines = [
    ...props.equipmentEffectSummary.acLines,
    ...props.equipmentEffectSummary.weaponLines,
    ...props.equipmentEffectSummary.itemGrantLines,
  ];

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
            <div className="review-sheet__headlineRow">
              <div>
                <strong className="builder-summary__name">{props.canSave ? "Ready to save" : "Needs attention"}</strong>
                <p className="builder-summary__meta">
                  {props.canSave
                    ? "The guided build is in a saveable state."
                    : props.saveValidationMessage || "Finish the remaining blockers before saving."}
                </p>
              </div>
              <div className="review-sheet__statusPill">{props.completionChecklist.filter((item) => item.done).length}/{props.completionChecklist.length} steps complete</div>
            </div>
            <details className="review-sheet__foldout">
              <summary>Builder checklist</summary>
              <div className="review-sheet__checklist">
                {props.completionChecklist.map((item) => (
                  <div className={`review-sheet__checkItem${item.done ? " is-complete" : " is-pending"}`} key={item.label}>
                    <span>{item.done ? "Done" : "Pending"}</span>
                    <strong>{item.label}</strong>
                  </div>
                ))}
              </div>
            </details>
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
                <div className="review-sheet__chipList">
                  {props.equipmentProficiencies.armor.length
                    ? props.equipmentProficiencies.armor.map((value) => <span className="review-sheet__chip" key={`armor-${value}`}>Armor: {value}</span>)
                    : <span className="review-sheet__chip review-sheet__chip--muted">No armor proficiencies detected</span>}
                  {props.equipmentProficiencies.weapons.length
                    ? props.equipmentProficiencies.weapons.map((value) => <span className="review-sheet__chip" key={`weapon-${value}`}>Weapon: {value}</span>)
                    : <span className="review-sheet__chip review-sheet__chip--muted">No weapon proficiencies detected</span>}
                </div>
              </div>
              <div className="review-sheet__listBlock">
                <strong>Selected proficiencies</strong>
                <div className="review-sheet__chipList">
                  {selectedProficiencyLabels.length
                    ? selectedProficiencyLabels.map((value) => <span className="review-sheet__chip" key={value}>{value}</span>)
                    : <span className="review-sheet__chip review-sheet__chip--muted">None detected</span>}
                </div>
              </div>
              <div className="review-sheet__listBlock review-sheet__listBlock--full">
                <strong>Languages</strong>
                <div className="review-sheet__chipList">
                  {selectedLanguageLabels.length
                    ? selectedLanguageLabels.map((value) => <span className="review-sheet__chip" key={value}>{value}</span>)
                    : <span className="review-sheet__chip review-sheet__chip--muted">None detected</span>}
                </div>
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
            <div className="review-sheet__compactList">
              {actionCards.length ? (
                actionCards.map((card) => (
                  <button
                    className="review-sheet__compactRow"
                    key={card.id}
                    type="button"
                    onClick={() =>
                      setDetail({
                        kind: "action",
                        action: card,
                        badges: uniqueStrings([card.timing, card.cost ?? "", card.source ?? ""]),
                      })
                    }
                  >
                    <div className="review-sheet__compactMain">
                      <strong>{card.title}</strong>
                      <span>{card.timing}</span>
                    </div>
                    <div className="review-sheet__compactMeta">
                      <div className="review-sheet__chipList">
                        {card.cost ? <span className="review-sheet__chip">{card.cost}</span> : null}
                        {card.source ? <span className="review-sheet__chip">{card.source}</span> : null}
                      </div>
                      <p>{card.summary}</p>
                    </div>
                  </button>
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
                    <div className="review-sheet__headlineRow">
                      <div>
                        <span className="builder-panel__label">{group.ownerLabel}</span>
                        <strong className="review-sheet__sectionTitle">{group.title}</strong>
                        <p className="builder-summary__meta">
                          {group.kind === "granted"
                            ? `${entries.length} granted`
                            : `${props.draft.spellSelections[group.id]?.length ?? 0}/${group.maxSelections} selected`}
                        </p>
                      </div>
                      <span className="review-sheet__statusPill">{entries.length} entries</span>
                    </div>
                    {entries.length ? (
                      <div className="review-sheet__compactList">
                        {entries.map((spell) => (
                          <button
                            className="review-sheet__compactRow review-sheet__compactRow--spell"
                            key={`${group.id}-${spell.id}`}
                            type="button"
                            onClick={() =>
                              setDetail({
                                kind: "spell",
                                spell,
                                groupLabel: group.title,
                                badges: uniqueStrings([...getSpellBadges(spell), group.title, group.ownerLabel]),
                              })
                            }
                          >
                            <div className="review-sheet__compactMain">
                              <strong>{spell.name}</strong>
                              <span>{group.title}</span>
                            </div>
                            <div className="review-sheet__compactMeta">
                              <div className="review-sheet__chipList">
                                {getSpellBadges(spell).map((badge) => (
                                  <span className="review-sheet__chip" key={`${spell.id}-${badge}`}>
                                    {badge}
                                  </span>
                                ))}
                              </div>
                              <p>{getSpellPreview(spell)} • {getSpellRange(spell)} • {getSpellDuration(spell)}</p>
                            </div>
                          </button>
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
                <div className="review-sheet__compactList">
                  {section.items.map((item) =>
                    "kind" in item ? (
                      renderManualGrant(item, () =>
                        setDetail({
                          kind: "manual-grant",
                          grant: item,
                          badges: uniqueStrings([item.kind.toUpperCase(), item.source || "Manual / DM grant"]),
                        }),
                      )
                    ) : (
                      <button
                        className="review-sheet__compactRow"
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setDetail({
                            kind: "feature",
                            feature: item,
                            badges: uniqueStrings([item.type, item.source || ""]),
                          })
                        }
                      >
                        <div className="review-sheet__compactMain">
                          <strong>{item.name}</strong>
                          <span>{item.source || item.type}</span>
                        </div>
                        <div className="review-sheet__compactMeta">
                          <div className="review-sheet__chipList">
                            <span className="review-sheet__chip">{item.type}</span>
                            {item.prerequisite ? <span className="review-sheet__chip">Prerequisite</span> : null}
                          </div>
                          <p>{getFeaturePreview(item)}</p>
                        </div>
                      </button>
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
            {allEffectLines.length ? (
              <ul className="route-shell__list">
                {allEffectLines.map((line) => (
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
                  <button
                    className="review-sheet__inventoryRow"
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setDetail({
                        kind: "item",
                        item,
                        badges: getInventoryItemBadges(item),
                      })
                    }
                  >
                    <div className="review-sheet__compactMain">
                      <strong>{item.name}</strong>
                      <span>{item.sourceLabel}</span>
                    </div>
                    <div className="review-sheet__inventoryMeta">
                      <span>{item.category}</span>
                      <span>Qty {item.quantity}</span>
                      <span>{item.equipped ? "Equipped" : "Stored"}</span>
                      <span>{item.attuned ? "Attuned" : item.attunable ? "Attunable" : "No attunement"}</span>
                    </div>
                    <p className="review-sheet__inventoryPreview">{getInventoryItemPreview(item)}</p>
                  </button>
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
              <ul className="route-shell__list review-sheet__grantList">
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
                        {titleizeBackstoryKey(key)}
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

      <ReviewDetailDrawer detail={detail} onClose={() => setDetail(null)} />
    </section>
  );
}
