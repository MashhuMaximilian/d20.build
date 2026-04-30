# Page Design: PDF First Page

This note is the detailed companion to [M6_PDF_EXPORT_PLAN.md](/Users/max/dev/Arcanum/planning/M6_PDF_EXPORT_PLAN.md).

`M6` stays high level.
This file is the implementation-grade first-page design note.

## Scope

This note is only about page 1 of the exported PDF.

It does not redefine the whole export system.
It tightens:

- first-page content selection
- first-page visual grouping
- first-page asset usage
- first-page data filtering
- first-page rendering tasks still left to solve

## Current Reassessment

This section overrides any optimistic reading of the pass log below.

The exported page shown in current testing proves that many items previously marked as “done” are only partially implemented, visually broken, semantically wrong, or not yet acceptable.

From now on, status should be judged by exported output quality, not by whether a code path exists.

### What Is Actually Working

- the page shell / overall template anchor is present
- the numeric combat strip is directionally better than the earliest versions
- ability blocks and skill blocks are at least rendered in the intended zones
- the PDF has begun separating:
  - right-column passive notes
  - racial / subracial area
  - lower feature area
- the system can now surface some class resources and some feature/action summaries

### What Is Not Actually Done

- header identity is not solved:
  - fields are crowded
  - values are placed in the wrong slots
  - subclass / lineage / class data is still visually confused
- spellcasting / resource strip is not solved:
  - the current compact resource box is too cramped
  - label/value hierarchy is weak
  - multi-resource handling is still not visually reliable
- passive notes box is not solved:
  - duplicate entries still appear
  - capitalization / normalization is inconsistent
  - content is still partly heuristic and not authoritative enough
- racial / subracial right-column body is not solved:
  - text density is poor
  - grouping clarity is weak
  - content still reads like dumped cards, not a controlled first-page summary
- lower feature area is not solved:
  - wrong items still appear there
  - proficiency/tool/language-adjacent noise still leaks in
  - category grouping exists in code but is not yet good enough in output
- attacks / actions surface is not solved:
  - the current table is semantically wrong for mixed actions
  - `Hit`, `Damage`, `Type`, `Properties` are being abused to show timing/uses/effect
  - feature actions and spell actions are not yet represented in a clean first-page pattern
- proficiencies row is not solved:
  - the screenshot suggests incorrect box labeling / ownership
  - tools/weapons/languages grouping needs a truth pass against rendered output
- duplicate mechanical information still exists across:
  - passive notes
  - right-column feature body
  - lower feature deck
  - action/attack rows

### Design Conclusion

The current state is not “finish with tweaks”.

It needs a controlled second-stage cleanup with these rules:

1. stop marking items done when only the data pipe exists
2. validate each section against rendered PDF output
3. fix semantic correctness before adding more feature coverage
4. remove duplication before adding more density

## Corrected Implementation Strategy

We should not keep expanding feature coverage on top of a semantically unstable first page.

The right order now is:

### Stage 1. Semantic Cleanup

Fix sections that are currently using the wrong structure, even if they technically render.

- header identity mapping
- spell/resource strip semantics
- passive note deduplication and normalization
- attack/action surface semantics
- lower feature filtering truth

### Stage 2. Visual Cleanup

Once semantics are correct:

- tighten spacing
- improve text hierarchy
- fix density
- reduce visual clutter
- make grouped content readable in one scan

### Stage 3. Coverage Expansion

Only after stages 1 and 2:

- more subclasses
- more race/subrace special cases
- more resource edge cases
- more spell/action prioritization rules

## Reset Plan

This is the plan that should drive the next implementation work.

### Phase R1. Header Truth

Goal:
- make the top identity row factually correct and clearly assigned

Tasks:
- remap each identity field to the correct slot
- verify:
  - race
  - subrace / lineage
  - class
  - subclass
  - background
  - level
  - experience
- prevent cross-field overflow and accidental value collisions

Acceptance:
- no field appears in the wrong slot
- subclass is visible and not merged ambiguously
- header can be parsed in under 3 seconds

### Phase R2. Top-Right Strip Semantics

Goal:
- make the spellcasting/resource strip structurally correct before tuning visuals

Tasks:
- define one correct spellcaster pattern
- define one correct martial/resource pattern
- define monk as a controlled special case
- prevent over-compression of multi-resource states
- remove “resource exists in code but is unreadable in PDF” cases

Acceptance:
- spellcasters show a readable casting block
- martials do not show fake casting UI
- resource boxes are readable and not overloaded

### Phase R3. Right Column Truth

Goal:
- make the right column non-duplicative and category-correct

Tasks:
- passive notes box:
  - dedupe
  - normalize capitalization
  - normalize wording
  - prefer one canonical line per mechanic
- racial/subracial body:
  - only race/subrace features
  - no spill from class/proficiency/build-choice noise

Acceptance:
- no duplicate `Resistance: Poison` style lines
- no mixed class/proficiency junk in racial space
- content reads as controlled summary, not dump

### Phase R4. Lower Feature Deck Truth

Goal:
- make the big lower feature area actually reflect meaningful gameplay features

Tasks:
- keep only:
  - class features
  - subclass features
  - feats
  - additional features
  - other / conditional only if truly useful
- remove:
  - tools
  - instruments
  - languages
  - proficiency picks
  - generic build-option filler
  - weak pseudo-features

Acceptance:
- no `Flute`, `Horn`, `Lyre`, `Jeweler's Tools`, raw proficiencies, etc. in the lower feature body unless explicitly justified
- lower feature area feels like gameplay information, not build bookkeeping

### Phase R5. Actions Surface Redesign

Goal:
- stop misusing the attack table for mixed semantics

Tasks:
- decide whether the current attack shell can survive
- if yes:
  - use columns with coherent meaning
- if no:
  - redesign the area into:
    - actions
    - attacks
    - spellcasting shortlist
- keep page-1 content usable at the table

Acceptance:
- no row should put “Bonus action” in a hit column unless the layout intentionally supports that semantic
- action rows must be structurally honest

### Phase R6. Coverage Expansion

Goal:
- only after R1-R5 are stable

Tasks:
- subclass-specific resources
- more race/subrace passive-note rules
- better action prioritization rules
- spell shortlist / slot representation if needed

## Immediate Next Priority

If implementation resumes, do this next:

1. fix header truth
2. fix top-right strip semantics
3. fix duplicate / wrong right-column content
4. fix lower feature filtering
5. only then revisit attack/action layout

## Pass Status

### Reset Pass R1 + R2 Completed

- header rendering now uses an explicit field model instead of stuffing values into loosely reused slots
- the header now separates:
  - race
  - lineage
  - class & level
  - player
  - background
  - subclass
- misleading merged header values such as `Race / Subrace` in the race slot were removed from the renderer
- top-right strip semantics were simplified into three clean render states:
  - spellcaster
  - martial / resource-only
  - monk (`Ki Save DC` + `Ki Points`)
- unreadable stacked secondary spellcaster resources were removed from the top-right strip
- spellcasters now show one combined casting block plus one readable primary resource box
- martials now show one centered resource box or two side-by-side resource boxes instead of fake spellcasting UI

### Reset Pass R1 + R2 Partial

- header truth is much better in code, but still needs exported visual verification against real characters
- lineage and subclass are now structurally separated, but long multiclass / long subclass cases may still need tighter width handling
- the top-right strip is now semantically cleaner, but resource priority and naming may still need tuning per class

### Reset Pass R1 + R2 Still Open

- experience is still not surfaced in the header
- broader class / subclass resource coverage still needs more cases
- spellcasters with more than one important resource still need a better long-term surface than a single primary resource box
- header density and hierarchy still need final visual tuning after export review

### Pass 1 Completed

- `_Proficiency Box.svg` is now part of the runtime PDF asset bundle and is explicitly drawn over the proficiencies row.
- saving-throw proficiency detection now uses:
  - selected proficiency names
  - humanized selected proficiency ids
  - manual proficiency grants
- ability-score save proficiency dots now have corrected data feeding them.
- subclass label is now resolved into the PDF character identity model.
- the header now surfaces more identity fields instead of only race / class / background.
- the right column is now split conceptually into:
  - compact passive-note box
  - racial / subracial feature body
- the lower feature deck now excludes racial / subracial cards so ownership is cleaner.
- first-page feature cards now carry explicit PDF grouping tags:
  - `race`
  - `subrace`
  - `class`
  - `subclass`
  - `feat`
  - `additional`
  - `other`
- low-signal feature noise is now partially filtered:
  - proficiency / language option content
  - tool / instrument / language proficiency filler
  - `Ability Score Improvement`
  - generic subclass-definition entries like `Bard College`
- the spellcasting area now has a first structured pass:
  - spellcasters use one combined casting box
  - supported resource classes get an adjacent resource box
  - monks get `Ki Save DC` plus `Ki Points`

### Pass 1 Partial

- header identity is improved, but still not a final chip-based or perfectly labeled identity row
- class-resource support exists only for initial cases:
  - Bard
  - Druid
  - Monk
- right-column passive-note extraction currently uses lightweight heuristics and needs stronger source-driven mapping
- lower feature-area grouping is cleaner, but not yet final in presentation density or ordering
- attack extraction is not yet redesigned beyond current behavior

### Pass 1 Still Open

- broader race / subrace / class / subclass case coverage
- stronger passive-note extraction from review-step data rather than text heuristics
- full top-right resource system for more classes
- final right-column density tuning
- final lower-feature grouping strategy
- possible actions / spellcasting split inside the attacks block

### Pass 2 Completed

- class-resource support is broadened beyond the initial three cases
  - Bard
  - Druid
  - Monk
  - Sorcerer
  - Paladin
  - Cleric / Paladin `Channel Divinity`
  - Fighter
  - Barbarian
- the spell / resource strip now handles a pure martial resource case instead of falling through to blank or dead spellcasting boxes
- the lower big feature box now renders in grouped ownership sections instead of one flat undifferentiated list
  - `Class Features`
  - `Subclass Features`
  - `Feats`
  - `Additional Features`
  - `Other / Conditional`
- compact action-style summaries are now injected for a first subset of high-signal abilities:
  - `Action Surge`
  - `Second Wind`
  - `Flurry of Blows`
  - `Stunning Strike`
  - `Rage`
  - `Wild Shape`
  - `Channel Divinity`
  - `Bardic Inspiration`
  - `Lay on Hands`
- right-column passive / condition notes now catch a wider set of short defensive / sense signals:
  - resistance
  - vulnerability
  - immunity
  - condition immunity
  - darkvision
  - speed increase
  - flight

### Pass 2 Partial

- class-resource coverage is broader, but still only a first practical set rather than a full class-by-class system
- grouped lower-feature ownership now exists, but density and ordering still need tuning against more real exports
- passive-note extraction is better, but still relies largely on text heuristics rather than a dedicated structured review-surface source

### Pass 2 Still Open

- multi-resource classes still need a more expressive top-right resource model than a single primary resource box
- subclass-specific resource handling still needs broader coverage
- attacks / actions extraction still needs to become a deliberate first-page play surface rather than a mostly equipment-derived table
- possible actions / spellcasting split inside the attacks block remains experimental
- right-column racial / subracial density still needs tuning after more corpus checks

### Pass 3 Completed

- the top-right resource transport is no longer limited to a single class-resource stat
- class resources now flow through the PDF model as multiple `class-resource-*` entries
- non-spellcaster resource rendering can now show up to two class-resource boxes instead of forcing a single-box layout
- spellcasters still use the combined casting box, but now pull the first available class resource from the widened resource list
- the resource list now better mirrors the review-step resource coverage by supporting multiple same-page class resources

### Pass 3 Partial

- multi-resource transport now exists, but spellcasters still only surface one adjacent resource box on page 1
- resource ordering is practical rather than fully tuned by class/subclass importance
- attacks / actions are still not yet redesigned into a dedicated first-page play-surface module

### Pass 3 Still Open

- richer spellcaster multi-resource layouts when a class really needs more than one adjacent resource on page 1
- attack / actions redesign and extraction from review-step surfaces
- stronger structured sourcing for the passive-notes box instead of mostly pattern-based extraction
- broader subclass-specific resource rules

### Pass 4 Completed

- attacks / actions extraction is no longer purely weapon-only
- the first-page attack rows can now mix:
  - equipped weapons
  - selected cantrips
  - high-signal feature actions
- the attacks table now uses its `type` column instead of dropping that data on the floor
- passive / condition notes are now partially promoted into explicit PDF tags during source building
- the right-column note extractor now reads `pdf-note:*` tags first, reducing reliance on renderer-only text guessing

### Pass 4 Partial

- the attacks block is improved into a more useful action surface, but it is still constrained by the existing attack-table visual shell
- cantrip extraction is intentionally conservative and not yet a full spellcasting-action surface
- passive-note extraction is now split between structured tags and fallback text heuristics

### Pass 4 Still Open

- full action-surface redesign if the current attacks table proves too limiting in playtesting
- richer spell list / slot integration on page 1 if the actions surface needs a spell column or spell subpanel
- broader subclass-specific passive / resource tagging
- final density tuning after visual testing against more exported characters

### Pass 5 Completed

- class resources are now priority-sorted before entering the first-page strip
- spellcasters can now surface a compact secondary resource inside the adjacent class-resource box instead of hard-dropping everything after the first resource
- the spell/resource strip is now better aligned with the review-step idea of “primary resource plus additional tracked pool”

### Pass 5 Partial

- secondary spellcaster resources now have a display path, but it is still a compressed summary inside the current shell rather than a fully bespoke layout
- resource priority is now explicit, but still broad and class-level rather than subclass-specific

### Pass 5 Still Open

- richer subclass-specific resource ordering and surfacing
- possible dedicated spellcaster dual-resource layout if the compact stacked box proves too dense in testing
- final visual tuning of the top-right strip after export comparisons

### Pass 6 Completed

- first subclass-specific resource coverage now exists for selected cases we can justify cleanly:
  - `Superiority Dice`
  - `Starry Form`
  - `Arcane Recovery`
- the action surface now prioritizes a more useful first-page mix instead of a flat inventory-first list:
  - up to 2 equipped weapons
  - up to 2 feature actions
  - 1 cantrip
  - 1 leveled spell if available

### Pass 6 Partial

- subclass/resource coverage is improved, but still not exhaustive
- action extraction is more table-usable, but still filtered through the current attack-table shell and row budget

### Pass 6 Still Open

- broader subclass-specific resource coverage beyond the currently justified cases
- possible spell-specific prioritization rules beyond “first available”
- deeper review-surface-driven action ranking if current ordering is not good enough in practice

## Visual Anchor

Keep the current front-page visual anchor:

- header banner
- top combat strip
- ability score blocks
- skill blocks
- passives / speeds row
- proficiencies / languages row
- attacks block

Do not redesign the page into a different document.
The work now is to make the current sheet:

- cleaner
- more compact
- more informative
- better categorized
- mechanically useful at the table

## Page 1 Purpose

Page 1 must answer:

1. who is this character
2. what are the key combat numbers
3. what are the key passive defenses / edges
4. what resources matter right now
5. what can the player do right now

Page 1 is not a full rules reference.
Page 1 is a combat-ready and table-ready play surface.

## Global Rule

If the user did not complain about a section, treat it as acceptable for now.

Current emphasis:

- upper identity area
- spellcasting / resource strip redesign
- right column redesign
- lower feature area redesign
- better filtering of what counts as a first-page feature

## Primary Feedback Locked In

These points should be treated as decisions unless later replaced.

### 1. `_Proficiency Box.svg` Must Render The New Asset

The front page is still showing the old visual.

Action:

- verify which asset path is actually being loaded
- verify there is no cached or bundled copy still referenced
- confirm the first-page renderer is using the current `/web/public/pdf-svg/_Proficiency Box.svg`

### 2. Ability Score Proficiency Dot

Each ability score frame has a small circle above the `SAVE` oval.

Rule:

- if the character is proficient in that saving throw, fill that dot black
- if not proficient, leave it empty

This is separate from the save modifier number itself.

### 3. Spellcasting Section Must Become A Resource / Casting Module

The current three spellcasting boxes are not the final design.

Replace that area with a design system that supports two patterns:

#### Spellcaster Pattern

One widened box for:

- spell attack bonus
- spellcasting ability
- save DC

Plus one adjacent class-resource box.

Examples:

- Bard: `Bardic Inspiration`
- Druid: `Wild Shape`
- other spellcasters: their main class resource if relevant

#### Martial / Non-Spellcaster Pattern

Do not show empty spellcasting boxes.

Instead, use class-resource boxes only.

Examples:

- Monk: `Ki Save DC` and `Ki Points`
- Fighter: class-resource data when applicable
- other martials: class resource if it exists, otherwise collapse the area cleanly

This area is a design problem first, then a class-by-class content problem.

### 4. Header Identity Must Be Explicit

Do not merge identity into one loose string.

Fields should stay distinct:

- Level
- Race
- Subrace / Lineage
- Class
- Subclass
- Background
- Experience

The upper right section should be properly filled and clearly parseable.

### 5. Right Column Box Ownership Is Fixed

The right column should not be reinterpreted as a generic `Defenses & Identity` stack.

The existing ownership is:

- top resource / casting area
- compact `Senses / Conditions / passive mechanical notes` box
- right-column main body for racial and subracial features

#### Existing `Defenses` Box

Keep the existing `Defenses` box next to `AC`.

This is where we write short defense contributors such as:

- `+2 Shield`
- `+1 Ring of Protection`
- similar short defense notes

Do not move this responsibility into a new top-right summary box.

#### Box Below Spellcasting / Resources

This should become the compact short-text box for:

- resistances
- immunities
- vulnerabilities
- rest type
- passive mechanical notes
- similar concise table-usable defensive / condition / sense information

This is the same conceptual area as `Senses & Conditions`.
It should be shorter than the current oversized version and should not become paragraph prose.

#### Right Column Main Body

This area remains for:

- racial features
- subracial features

Keep fuller feature content here, but only for race and subrace ownership.

### 6. Lower Feature Area Owns Class / Subclass / Feats / Additional Features

The big lower feature area should own:

- class features
- subclass features
- feats
- additional features
- other / conditional

This is the primary gameplay-facing feature surface.

Preferred compact format:

`Name | Type | Uses | Effect`

If that proves too thin in practice, allow a short paragraph-style summary there.
But it must remain:

- compact
- readable
- table-usable

### 7. Gameplay Grouping Is Experimental

There is a possible direction to regroup lower features by gameplay usage instead of source order.

Possible buckets:

- `Core Turn Features`
- `Bonus / Reaction Features`
- `Limited-Use Features`
- `Passive Features`
- `Exploration / Social Features`
- `Always-On Modifiers`

But this is not locked.

Mark this as:

- `maybe it will not work`

Do not treat this as a final design decision until it is tested on-page.

## What Belongs On Page 1

Include:

- things used every session
- things that change combat math
- things with charges or uses
- things with short-rest / long-rest cadence
- action / bonus / reaction mechanics
- major passive defenses
- major movement or sense changes
- things the DM asks about often

Do not include as first-page feature entries:

- instrument proficiencies
- tool picks
- language picks as pseudo-features
- generic sourcebook citations
- full long-form rules text for every feature
- build-option filler that does not matter at the table

Those belong elsewhere:

- proficiencies section
- later detail pages
- appendix cards

## First-Page Feature Filter

Before any feature is allowed onto page 1, it should pass this filter:

1. does it change action economy
2. does it change combat numbers
3. does it have uses / charges / rests
4. does it grant a defense, resistance, immunity, or movement mode
5. does it create a repeat-use tactical option

If the answer is no to all five, it probably should not be in the page-1 feature area.

Examples of items that should usually be filtered out of page-1 feature lists:

- `Flute`
- `Horn`
- `Sylvan`
- isolated proficiency options
- generic class-definition entries that do not affect active play

## First-Page Feature Line Contract

Every first-page feature line should answer:

1. what is it called
2. what kind of thing is it
3. how often can I use it
4. what does it do in one sentence

Suggested compact shape:

`Feature Name | Type | Uses | Effect`

Where relevant:

- `Type` = Passive / Action / Bonus / Reaction / Conditional
- `Uses` = Always On / PB per LR / 1 per SR / CHA per LR / etc
- `Effect` = short mechanical summary only

If that cannot fit cleanly, the full text belongs later in appendix pages.

## Data Source Rule

For this PDF, page 1 should primarily pull from the resolved surfaces already represented in the Review step.

Important rule:

- prefer the Review-step subtabs / pills / groups as the operational truth for page-1 organization

This means page-1 extraction should align with:

- overview / essentials
- actions / spells
- features
- inventory
- personality / background

The PDF should not invent a new classification model if the Review surface already solved it.

## Right Column Height / Density Rules

The `Senses & Conditions` box should exist even if empty for many characters.

But it should not waste space.

Rules:

- make it shorter than the current oversized block
- fill it with short tags only
- include things like:
  - resistances
  - immunities
  - vulnerabilities
  - condition advantages
  - darkvision / special senses if that section owns them

The rest of the vertical space should go to right-column racial and subracial feature content.

## Attacks / Actions Area

Keep the attacks block.

But the intended usage is:

- first rows reserved for real table actions
- not just literal weapons

Preferred rows:

- main melee weapon
- main ranged weapon
- bread-and-butter cantrip or signature action
- summon / companion / animated-object action when relevant
- class-resource action if it matters in repeated play

Possible later extension:

- split this area into two columns:
  - `Actions`
  - `Spellcasting`

For spellcasting, where relevant, we may show:

- cantrip names
- spell names
- spell levels
- spell slots

Possible slot-display approach:

- use circles like `◯`
- or reuse `Proficiency check boolean.svg`

This is not locked yet.
No new asset is required unless the current boolean asset looks wrong in practice.

## Resources Design Rules

The resource strip above the right-column summaries must support:

- spellcasting summary
- class resources
- martial resources
- multi-resource classes

The visual grammar should be:

- one long box when three related spellcasting values belong together
- one or more adjacent square / rectangular boxes for class resources

Examples:

- Bard: `Spellcasting` + `Bardic Inspiration`
- Druid: `Spellcasting` + `Wild Shape`
- Monk: `Ki Save DC` + `Ki Points`

Do not leave dead empty boxes for non-casters.

## Category Ownership Rules

The first page should split ownership like this:

### Proficiencies Section

Owns:

- weapons
- armor
- tools
- languages
- instruments

It does not own major features.

### Ability Checks Section

Owns:

- skill proficiencies
- skill expertise

It does not duplicate skill features as feature cards.

### Right Column Box Below Resources

Owns:

- passive defensive traits
- conditions and condition edges
- resistances / immunities / vulnerabilities
- rest type
- compact sense / passive-mechanics notes

### Right Column Main Body

Owns:

- racial features
- subracial features

### Lower Feature Surface

Owns:

- class features
- subclass features
- feats
- additional features
- other / conditional

### Appendix / Later Pages

Owns:

- full text
- source-heavy descriptions
- long-form rules text
- full item / spell / feature cards

## Hybrid Benchmark: Bardium + Hanaho

Use this rule for evaluating page 1:

- `Bardium` is better for quick scan of numbers
- `Hanaho` is better for content separation
- the target page should combine those strengths

That means:

- fast numeric scan like Bardium
- better category separation like Hanaho
- less prose clutter than Hanaho in the wrong places
- better aesthetics and better grouping than both

## Phased Implementation Plan

### Phase A. Asset Truth And Correctness

#### A1. `_Proficiency Box.svg` Truth

- confirm `_Proficiency Box.svg` resolves to the new file
- remove or bypass any stale in-memory / bundled asset use
- verify the first-page renderer is not holding onto an outdated visual

#### A2. Saving Throw Proficiency Indicator

- fill the top dot in ability score blocks when proficient
- ensure the underlying saving-throw proficiency detection is correct
- verify this across more than the current sample characters

#### A3. Broader Case Coverage Note

Later step, but must be noted now:

- identify more race / subrace / class / subclass cases
- especially for resource ownership and first-page feature selection

### Phase B. Header And Resource Strip

#### B1. Header Identity Completion

- map explicit fields for level, race, subrace, class, subclass, background, experience
- stop losing subclass visibility near the header

#### B2. Spellcasting / Resource Strip Redesign

- build the long spellcasting box variant for spellcasters
- build adjacent class-resource boxes
- support martial collapse rules
- support monk special case

#### B3. Special Resource Coverage

Add explicit support over time for cases such as:

- Bard
- Druid
- Monk
- Fighter
- other classes with meaningful first-page resources

### Phase C. Right Column Structure

#### C1. Keep `Defenses` Where It Already Belongs

- keep defense contributors in the existing `Defenses` box near `AC`
- do not move that responsibility into a new right-column summary box

#### C2. Compact `Senses / Conditions / Passive Notes` Box

- shrink `Senses & Conditions`
- use it for short passive mechanical notes only
- keep it concise and high-signal

#### C3. Right Column Main Body Ownership

- keep this body for racial and subracial features
- do not turn it into a generic all-feature summary column

### Phase D. Lower Feature Surface

#### D1. Reassign Lower Feature Ownership

The big lower box should own:

- class features
- subclass features
- feats
- additional features
- other / conditional

#### D2. Start With Compact Feature Rows

Preferred format:

`Name | Type | Uses | Effect`

#### D3. Allow Short Paragraph Summary If Needed

If the compact line format is too thin:

- allow a short paragraph-style summary
- keep it compact and table-usable

#### D4. Gameplay Grouping Is Experimental

- test gameplay-use grouping
- do not lock it in unless it works clearly on-page
- treat this as optional / maybe

### Phase E. Filtering And Extraction

#### E1. Page-1 Feature Filtering

- remove low-signal build-option entries from page-1 feature surfaces
- keep tools, instruments, and languages in proficiencies instead
- keep active mechanics on page 1

#### E2. Resource Extraction

- identify which Review-step data already exposes:
  - current resource name
  - current uses
  - recovery cadence
  - usage type
- map those to page-1 resource boxes

#### E3. Attack Data Extraction

- fix missing attack-table extraction from builder equipment / action surfaces
- ensure the attack block is populated from Review-step action data, not only from raw inventory

#### E4. Possible Actions / Spellcasting Split

Later optional refinement:

- test splitting the attacks block into:
  - `Actions`
  - `Spellcasting`
- where relevant, show:
  - cantrip names
  - spell names
  - spell levels
  - spell slots
- optionally use `Proficiency check boolean.svg` for slot circles

## Implementation Order Recommendation

Do these in this order:

1. `_Proficiency Box.svg` asset truth
2. saving-throw proficiency dot correctness
3. broader save/resource case note for more classes and races
4. header identity completion
5. spellcasting / resource strip redesign
6. special resource case coverage
7. compact `Senses / Conditions / passive notes` box
8. right-column racial / subracial feature ownership
9. lower feature-surface ownership redesign
10. page-1 feature filtering
11. attack and action extraction refinement
12. optional actions / spellcasting split

This order matters because:

- asset truth must be solved before visual QA
- saving-throw dots are a correctness issue
- header and resource strip changes affect the whole upper-right geometry
- right-column ownership depends on the resource strip structure
- filtering must happen before final lower-feature packing
- action/spell split is optional and should come only after extraction is trustworthy

## Acceptance Criteria For This Note

This note is satisfied when page 1 does all of the following:

1. uses the new `_Proficiency Box.svg`
2. fills saving-throw proficiency dots correctly
3. does not show dead spellcasting boxes for martials
4. supports spellcasters and martial-resource classes with coherent top-right boxes
5. shows clear labeled identity fields in the header
6. keeps defense contributors in the existing `Defenses` box
7. uses the box below resources for compact conditions / passive-note content
8. keeps racial and subracial features in the right-column main body
9. uses the lower big box for class / subclass / feats / additional / conditional features
10. filters out low-value pseudo-features from first-page feature areas
11. keeps proficiencies in the proficiencies row, not in the feature deck
10. remains visually anchored to the current front-page design

## Current Status Summary

### Partially Done

- Header identity layout:
  - more data is surfaced now
  - still not the final explicit chip/field layout
- Top-right spell/resource strip:
  - structurally much better
  - still constrained by the current shell and needs visual tuning
- Passive / condition notes:
  - partially structured through `pdf-note:*` tags
  - still falls back to text heuristics
- Lower grouped feature surface:
  - ownership and filtering are improved
  - density and ordering still need export-driven tuning
- Actions / attacks surface:
  - no longer weapon-only
  - still limited by the current table format and row budget

### Still Left

- broader subclass-specific resource coverage
- broader race / subrace / class / subclass special-case coverage
- more deliberate action ranking from review surfaces if needed after testing
- possible `Actions / Spellcasting` split if the current table proves too limiting
- possible richer spell / slot integration on page 1
- more deterministic passive-note sourcing from structured review data
- final density tuning of:
  - top-right strip
  - right-column racial / subracial area
  - lower grouped feature area
