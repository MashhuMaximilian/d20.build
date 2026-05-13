# D&D 5e Combat & Spellcasting Hub Rules Contract

## Sources Checked

- `DnD-Books/5e/Books/SRD_CC_v5.1.pdf`, local PDF pages 64-65, 93-96, 100-103.
- `DnD-Books/5e/Books/D&D 5E - Player's Handbook.pdf`, local PDF pages 147-148, 190-197, 202-206.
- `aurora-elements/core/players-handbook/classes/*.xml`, especially bard, cleric, druid, paladin, ranger, sorcerer, warlock, wizard, eldritch knight, and arcane trickster spell slot/stat rules.
- Current PDF implementation: `web/lib/pdf/types.ts`, `web/lib/pdf/from-builder.ts`, `web/lib/pdf/resolve.ts`, `web/lib/pdf/front-page-renderer.ts`.

## Contract

The first-page bottom hub is a tactical summary, not a full spell sheet. It should expose the choices and counters needed at the table while preserving enough source metadata for later pages to render full details.

### Weapon Rows

Each row must represent an actual attack option, not a class feature or spell unless a later design explicitly adds an action row section.

Required fields:

- `name`: weapon or attack label.
- `attackBonus`: final to-hit string, including proficiency only when the character is proficient with that weapon or attack.
- `damage`: dice plus the same ability modifier used for the attack roll, unless an item/feature/spell says otherwise.
- `damageType`: piercing, slashing, bludgeoning, or the explicit damage type from the source attack.
- `properties`: compact weapon property/range payload.
- `source`: equipment, natural weapon, feature, or manual source for troubleshooting and appendix expansion.

Rules:

- Melee weapon attacks default to Strength; ranged weapon attacks default to Dexterity.
- Finesse allows Strength or Dexterity, but the same chosen modifier applies to both attack and damage.
- Thrown melee weapons use the melee ability modifier for attack and damage; thrown finesse weapons can still choose Strength or Dexterity.
- Add proficiency bonus only for proficient weapons/attacks.
- Damage should never show a negative final modifier as reducing below zero damage in computed roll summaries.
- Properties should be abbreviations, not prose: `amm`, `fin`, `heavy`, `light`, `load`, `range 80/320`, `reach`, `thrown 20/60`, `2h`, `vers`.
- Keep weapon rows independent from spell rows. A spell attack belongs in the spell list unless the product intentionally adds an "attack cantrips" callout.

### Spell Column

The spell column must be driven by spellcasting rules, not by feature-card text scraping.

Required fields:

- `hasSpellcasting`: true when the character has at least one spellcasting source, including racial/feat/granted cantrips.
- `spellcastingSources`: one entry per casting source with `ownerType`, `ownerLabel`, `ability`, `kind`, `recovery`, and optional `dc` / `attackBonus`.
- `cantrips`: level 0 spells grouped separately; cantrips never consume slots and do not need preparation.
- `preparedOrKnown`: currently castable leveled spells grouped by spell level and source.
- `spellbookOnly`: wizard spellbook spells not currently prepared; exclude from the first-page tactical list unless space/design explicitly marks them as not prepared.
- `slots`: long-rest spell slots by level 1-9.
- `pactSlots`: short-rest Pact Magic slots with `slotLevel` and `count`, separate from normal spell slots.
- `innateOrAtWill`: racial, feat, invocation, or feature spells that do not use normal class slots, with their usage cadence when known.

Rules:

- Cantrips are level 0 and should always render above slot-using spells.
- A leveled spell consumes a slot of its level or higher when cast.
- Prepared casters should show prepared spells, not every spell on their class list.
- Known casters should show known selected spells.
- Wizards should show prepared wizard spells on page 1; spellbook-only entries belong on a later spellbook/detail page.
- Spell save DC is `8 + proficiency bonus + spellcasting ability modifier + special modifiers`.
- Spell attack bonus is `proficiency bonus + spellcasting ability modifier + special modifiers`.
- Multiclass characters keep each spell associated with its source class and use that source class's casting ability.
- Multiclass normal slots use combined caster level: full levels for bard/cleric/druid/sorcerer/wizard, half levels rounded down for paladin/ranger, and third-caster levels rounded down for eldritch knight/arcane trickster.
- Pact Magic is not folded into normal slot rows. It can cast warlock spells and can also be used with other prepared/known Spellcasting-feature spells; normal spell slots can cast warlock spells known.

### First-Page Rendering Priorities

If space is limited:

- Always show cantrips first.
- Show slot counters for all available slot levels before listing long spell names.
- Prefer prepared/known combat-relevant spells over spellbook-only or ritual-only spells.
- Preserve source labels when spell names collide or when multiclass ability differences matter.
- Overflow spell details to later pages rather than truncating source data out of the model.

## Current Implementation Gaps To Fix

- `PdfSpellSlots` currently mixes all spell slots into one payload and has booleans for caster type. It should split normal long-rest slots from Pact Magic short-rest slots.
- `buildSpellSlots` uses only the primary caster's explicit class rules when possible. That is correct for single-class casters, but it is not a complete multiclass slot contract.
- Half-caster fallback is keyed by class level, which is fine for single-class paladin/ranger but not sufficient for multiclass aggregation.
- Third casters from eldritch knight and arcane trickster have explicit Aurora slot stats and should be included as spellcasting sources; they should count as one-third levels for multiclass normal-slot aggregation.
- `buildSpellList` currently returns selected/granted spells without distinguishing prepared, known, spellbook-only, pact, or innate usage. The PDF model needs that distinction before the renderer can be rules-correct.
- `renderSpellLevelGroup` currently displays filled markers for all available slots, which reads like all slots are spent/checked. Use empty trackers for available slots unless the model later tracks expended slots.

## Recommended PDF Model Shape

```ts
type PdfSpellcastingSource = {
  id: string;
  ownerType: "race" | "subrace" | "class" | "subclass" | "feat" | "manual";
  ownerLabel: string;
  ability?: AbilityKey;
  kind: "prepared" | "known" | "spellbook" | "pact" | "innate" | "granted";
  recovery?: "at-will" | "short-rest" | "long-rest" | "daily" | "slots";
  dc?: number;
  attackBonus?: string;
};

type PdfSpellSlotPool = {
  kind: "spellcasting" | "pact";
  recovery: "long-rest" | "short-rest";
  slotLevel?: number;
  slots: Array<{ level: number; max: number; expended?: number }>;
};

type PdfSpellListEntry = {
  id: string;
  name: string;
  level: number;
  sourceId: string;
  sourceLabel: string;
  preparationState: "prepared" | "known" | "spellbook" | "always-prepared" | "innate";
  castingTime?: string;
  attackOrSave?: string;
  concentration?: boolean;
  ritual?: boolean;
};
```

Renderer contract:

- Non-spellcasters get full-width weapon rows.
- Spellcasters get weapon rows plus spell column.
- Spell column renders `Cantrips`, then slot pools, then known/prepared leveled spells grouped by level.
- Pact slots render as a distinct `Pact` row or badge, not as normal level 1-9 long-rest slots.
