export type PdfAssetGroup = {
  id: string;
  label: string;
  files: string[];
  notes: string[];
};

export const PDF_REFERENCE_LIBRARY: PdfAssetGroup[] = [
  {
    id: "blank-sheets",
    label: "Blank Sheets",
    files: [
      "Blank Sheets/Blank.pdf",
      "Blank Sheets/Class Character Sheet_Artificer-Gunsmith_V1.0_Fillable.pdf",
      "Blank Sheets/Class Character Sheet_Bard V1.2_Fillable.pdf",
      "Blank Sheets/Class Character Sheet_Druid V1.1_Fillable.pdf",
      "Blank Sheets/Class_Character_Sheet_Cleric_V1.2_Fillable.pdf",
    ],
    notes: [
      "Page-flow reference for the broad four-page structure.",
      "Shows how the same shell adapts to different class densities.",
    ],
  },
  {
    id: "character-examples",
    label: "Character Sheets examples pdf",
    files: [
      "Character Sheets  examples pdf/Hanaho lvl 15.pdf",
      "Character Sheets  examples pdf/orryn lvl 12.pdf",
      "Character Sheets  examples pdf/woody woodrow lvl 11.pdf",
      "Character Sheets  examples pdf/QUEUE.pdf",
      "Character Sheets  examples pdf/Rusty Goldforge lvl 10.pdf",
      "Character Sheets  examples pdf/Florence.pdf",
    ],
    notes: [
      "Used to validate the page order after the front sheet.",
      "Good corpus for companion, inventory, spell, and appendix pages.",
    ],
  },
  {
    id: "svg-reference",
    label: "SVGs for PDF",
    files: [
      "SVGs for PDF/Front Page Header.svg",
      "SVGs for PDF/Ability scores, Saves, and ability checks.svg",
      "SVGs for PDF/HP and Bonuses full.svg",
      "SVGs for PDF/Passives and speeds.svg",
      "SVGs for PDF/Weapon attacks.svg",
    ],
    notes: [
      "Reusable component pieces for the front page and other rigid sections.",
      "Treat these as the puzzle pieces, not as the whole page.",
    ],
  },
  {
    id: "svg-template",
    label: "SVGs for PDF examples",
    files: ["SVGs for PDF/examples with svgs/Design general character sheet p1 v3.svg"],
    notes: [
      "This is the strongest composition target for page 1.",
      "Use it to snap together the numeric side and the feature card deck.",
    ],
  },
];

export const PDF_SVG_COMPONENT_MANIFEST = {
  pageShell: "SVGs for PDF/Front Page Header.svg",
  abilityPanel: "SVGs for PDF/Ability scores, Saves, and ability checks.svg",
  hpPanel: "SVGs for PDF/HP and Bonuses full.svg",
  speedPanel: "SVGs for PDF/Passives and speeds.svg",
  attackPanel: "SVGs for PDF/Weapon attacks.svg",
  generalContainer: "SVGs for PDF/General Box Container.svg",
  hitDie: "SVGs for PDF/Hit Die.svg",
  lines: "SVGs for PDF/Lines.svg",
  proficiencyBoolean: "SVGs for PDF/Proficiency check boolean.svg",
  ac: "SVGs for PDF/_AC.svg",
  bonusBox: "SVGs for PDF/_Bonus Box.svg",
  hp: "SVGs for PDF/_HP.svg",
  line: "SVGs for PDF/_Line.svg",
  lineBonusSkill: "SVGs for PDF/_Line bonus skill.svg",
  passiveBox: "SVGs for PDF/_Passive box.svg",
  proficiencyBox: "SVGs for PDF/_Proficiency Box.svg",
  skillBlock: "SVGs for PDF/_Skill Block.svg",
  skillLine: "SVGs for PDF/_Skill line.svg",
  statBlock: "SVGs for PDF/_Stat Block.svg",
  weaponLine: "SVGs for PDF/Weapon Line.svg",
} as const;

