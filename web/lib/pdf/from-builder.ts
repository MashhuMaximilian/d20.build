import type {
  BuiltInElement,
} from "@/lib/builtins/types";
import type { BuiltInBackgroundRecord } from "@/lib/builtins/backgrounds";
import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import type {
  AbilityKey,
  CharacterDraft,
  CharacterManualGrant,
} from "@/lib/characters/types";
import type { SpellSelectionGroup } from "@/lib/progression/spellcasting";

import {
  resolvePdfCharacter,
  toPdfCardFromElement,
  toPdfCardFromGrant,
  toPdfCardFromInventoryItem,
  type PdfResolveSource,
  type ResolvedPdfCharacter,
} from "@/lib/pdf";

type BuilderPdfSourceArgs = {
  abilities: Record<AbilityKey, number>;
  allSelectedFeatElements: BuiltInElement[];
  classRecordsByEntry: Array<BuiltInClassRecord | null>;
  draft: CharacterDraft;
  effectiveAbilities: Record<AbilityKey, number>;
  manualGrantsByKind: Record<CharacterManualGrant["kind"], CharacterManualGrant[]>;
  selectedBackground: BuiltInBackgroundRecord | null;
  selectedBackgroundFeatureElements: BuiltInElement[];
  selectedClassFeatureElements: BuiltInElement[];
  selectedExpertiseLabels: string[];
  selectedFeatElements: BuiltInElement[];
  selectedLanguageIds: string[];
  selectedLanguageNames: string[];
  selectedManualFeatureElements: BuiltInElement[];
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

function getClassLabel(classRecordsByEntry: Array<BuiltInClassRecord | null>, draft: CharacterDraft) {
  const labels = draft.classEntries.map((entry, index) => classRecordsByEntry[index]?.class.name || entry.classId).filter(Boolean);
  return labels.join(" / ");
}

function buildStatCards(args: BuilderPdfSourceArgs) {
  const proficiencyBonus = 2 + Math.floor((Math.max(1, args.draft.level) - 1) / 4);
  const dexMod = Math.floor((args.effectiveAbilities.dexterity - 10) / 2);
  const wisMod = Math.floor((args.effectiveAbilities.wisdom - 10) / 2);
  const chaMod = Math.floor((args.effectiveAbilities.charisma - 10) / 2);
  const intMod = Math.floor((args.effectiveAbilities.intelligence - 10) / 2);
  const conMod = Math.floor((args.effectiveAbilities.constitution - 10) / 2);

  return [
    { id: "proficiency-bonus", label: "Proficiency Bonus", value: `+${proficiencyBonus}` },
    { id: "initiative", label: "Initiative", value: `${dexMod >= 0 ? "+" : ""}${dexMod}` },
    { id: "attacks", label: "Attacks / Action", value: `${Math.max(1, 1)}` },
    { id: "passive-perception", label: "Passive Perception", value: `${10 + wisMod}` },
    { id: "spellcasting-bonus", label: "Spellcasting Bonus", value: `${proficiencyBonus + chaMod >= 0 ? "+" : ""}${proficiencyBonus + chaMod}` },
    { id: "spell-save-dc", label: "Save DC", value: `${8 + proficiencyBonus + chaMod}` },
    { id: "spellcasting-ability", label: "Spellcasting Ability", value: `${args.selectedClassFeatureElements.some((feature) => /intelligence/i.test(feature.description + feature.descriptionHtml)) ? "INT" : "—"}` },
    { id: "hp", label: "HP", value: `${args.draft.level * (8 + conMod)}` },
    { id: "ac", label: "AC", value: "—" },
  ];
}

function buildFeatureCards(args: BuilderPdfSourceArgs) {
  const cards = [
    ...args.selectedRacialTraitElements.map((element) => toPdfCardFromElement(element, { kind: "trait" })),
    ...args.selectedClassFeatureElements.map((element) => toPdfCardFromElement(element, { kind: "feature" })),
    ...args.selectedBackgroundFeatureElements.map((element) => toPdfCardFromElement(element, { kind: "feature" })),
    ...args.selectedFeatElements.map((element) => toPdfCardFromElement(element, { kind: "feature" })),
    ...args.selectedManualFeatureElements.map((element) => toPdfCardFromElement(element, { kind: "feature" })),
    ...args.selectedProgressionElements.map((element) => toPdfCardFromElement(element, { kind: "feature" })),
    ...args.manualGrantsByKind.feature.map((grant) => toPdfCardFromGrant(grant)),
    ...args.manualGrantsByKind.feat.map((grant) => toPdfCardFromGrant(grant)),
    ...args.manualGrantsByKind.asi.map((grant) => toPdfCardFromGrant(grant)),
  ];

  return uniqueById(cards);
}

function buildCompanionCards(args: BuilderPdfSourceArgs) {
  return uniqueById(
    args.selectedProgressionElements
      .filter((element) => /companion/i.test(element.type) || /companion/i.test(element.name) || /companion/i.test(element.description))
      .map((element) => toPdfCardFromElement(element, { kind: "feature", pageHint: "companion" })),
  );
}

function buildInventoryCards(args: BuilderPdfSourceArgs) {
  return uniqueById(args.draft.inventoryItems.map((item) => toPdfCardFromInventoryItem(item)));
}

function buildSpellCards(args: BuilderPdfSourceArgs) {
  const spellsById = new Map(args.spells.map((spell) => [spell.id, spell]));
  const selectedIds = uniqueStrings([
    ...args.selectedSpellIds,
    ...args.manualGrantsByKind.spell.map((grant) => grant.refId).filter((id): id is string => Boolean(id)),
  ]);

  return uniqueById(
    selectedIds
      .map((id) => spellsById.get(id))
      .filter((spell): spell is BuiltInElement => Boolean(spell))
      .map((spell) => toPdfCardFromElement(spell, { kind: "spell" })),
  );
}

function buildBackstoryCards(args: BuilderPdfSourceArgs) {
  const backstory = args.draft.backstory;
  return [
    ...(backstory.personalityTraits ? [{ id: "personality-traits", title: "Personality traits", kind: "note" as const, contentKind: "detail" as const, summary: backstory.personalityTraits, detail: backstory.personalityTraits, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
    ...(backstory.ideals ? [{ id: "ideals", title: "Ideals", kind: "note" as const, contentKind: "detail" as const, summary: backstory.ideals, detail: backstory.ideals, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
    ...(backstory.bonds ? [{ id: "bonds", title: "Bonds", kind: "note" as const, contentKind: "detail" as const, summary: backstory.bonds, detail: backstory.bonds, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
    ...(backstory.flaws ? [{ id: "flaws", title: "Flaws", kind: "note" as const, contentKind: "detail" as const, summary: backstory.flaws, detail: backstory.flaws, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
    ...(backstory.alliesAndOrganizations ? [{ id: "allies-and-organizations", title: "Allies and organizations", kind: "note" as const, contentKind: "detail" as const, summary: backstory.alliesAndOrganizations, detail: backstory.alliesAndOrganizations, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
    ...(backstory.backstory ? [{ id: "backstory", title: "Backstory", kind: "note" as const, contentKind: "detail" as const, summary: backstory.backstory, detail: backstory.backstory, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
    ...(backstory.additionalFeatures ? [{ id: "additional-features", title: "Additional features", kind: "note" as const, contentKind: "detail" as const, summary: backstory.additionalFeatures, detail: backstory.additionalFeatures, tags: ["backstory"], priority: 90, pageHint: "backstory" as const, widthHint: "wide" as const }] : []),
  ];
}

export function buildPdfCharacterFromBuilder(args: BuilderPdfSourceArgs): ResolvedPdfCharacter {
  const source: PdfResolveSource = {
    draft: args.draft,
    identity: {
      raceLabel: args.selectedRace?.race.name || "",
      subraceLabel: args.selectedSubrace?.name || "",
      classLabel: getClassLabel(args.classRecordsByEntry, args.draft),
      backgroundLabel: args.selectedBackground?.background.name || "",
    },
    stats: buildStatCards(args),
    featureCards: buildFeatureCards(args),
    companionCards: buildCompanionCards(args),
    inventoryCards: buildInventoryCards(args),
    spellCards: buildSpellCards(args),
    backstoryCards: buildBackstoryCards(args),
    backstory: args.draft.backstory,
    currency: args.draft.inventoryCurrency,
    manualGrants: args.draft.manualGrants,
    notes: [
      "Export derived from the current review-step resolved model.",
      ...(args.selectedExpertiseLabels.length ? [`Expertise: ${args.selectedExpertiseLabels.join(", ")}`] : []),
      ...(args.selectedProficiencyNames.length ? [`Proficiencies: ${args.selectedProficiencyNames.join(", ")}`] : []),
      ...(args.selectedLanguageNames.length ? [`Languages: ${args.selectedLanguageNames.join(", ")}`] : []),
      ...(args.selectedSpellIds.length ? [`Selected spells: ${args.selectedSpellIds.length}`] : []),
    ],
  };

  return resolvePdfCharacter(source);
}
