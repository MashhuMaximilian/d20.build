export type EquipmentChoiceOption = {
  id: string;
  label: string;
  items: string[];
};

export type StartingEquipmentAutoItem = {
  name: string;
  source: EquipmentChoiceSource;
};

export type EquipmentChoiceSource = "class" | "background";

export type EquipmentChoiceGroup = {
  id: string;
  title: string;
  description: string;
  source: EquipmentChoiceSource;
  options: EquipmentChoiceOption[];
};

export type EquipmentGoldAlternative = {
  formula: string;
  averageGp: number;
  notes: string[];
};

export type StartingEquipmentPlan = {
  autoItems: StartingEquipmentAutoItem[];
  choiceGroups: EquipmentChoiceGroup[];
  notes: string[];
  goldAlternative: EquipmentGoldAlternative | null;
};

type StartingEquipmentContext = {
  classId: string;
  backgroundId: string;
};

function uniqueItems(items: StartingEquipmentAutoItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.source}:${item.name}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function getClassPlan(classId: string): StartingEquipmentPlan {
  switch (classId) {
    case "ID_WOTC_PHB_CLASS_FIGHTER":
      return {
        autoItems: [],
        choiceGroups: [
          {
            id: "fighter-armor-package",
            title: "Armor package",
            description: "Choose the fighter starting armor package.",
            source: "class",
            options: [
              { id: "chain-mail", label: "Chain Mail", items: ["Chain Mail"] },
              {
                id: "leather-longbow",
                label: "Leather Armor + Longbow",
                items: ["Leather Armor", "Longbow", "Quiver", "20 Arrows"],
              },
            ],
          },
          {
            id: "fighter-weapon-package",
            title: "Primary weapons",
            description: "Choose the fighter's main weapon loadout.",
            source: "class",
            options: [
              { id: "martial-and-shield", label: "Martial Weapon + Shield", items: ["Martial Weapon", "Shield"] },
              { id: "two-martial", label: "Two Martial Weapons", items: ["Martial Weapon", "Martial Weapon"] },
            ],
          },
          {
            id: "fighter-sidearm-package",
            title: "Secondary gear",
            description: "Choose the fighter's ranged or thrown backup option.",
            source: "class",
            options: [
              { id: "crossbow", label: "Light Crossbow + 20 Bolts", items: ["Light Crossbow", "20 Bolts"] },
              { id: "handaxes", label: "Two Handaxes", items: ["Handaxe", "Handaxe"] },
            ],
          },
          {
            id: "fighter-pack",
            title: "Pack",
            description: "Choose the travel pack the fighter starts with.",
            source: "class",
            options: [
              { id: "dungeoneer", label: "Dungeoneer's Pack", items: ["Dungeoneer's Pack"] },
              { id: "explorer", label: "Explorer's Pack", items: ["Explorer's Pack"] },
            ],
          },
        ],
        notes: [],
        goldAlternative: {
          formula: "5d4 × 10 gp",
          averageGp: 125,
          notes: ["Replaces the class starting gear package. Background gear is still kept in this first pass."],
        },
      };
    case "ID_WOTC_PHB_CLASS_WIZARD":
      return {
        autoItems: [{ name: "Spellbook", source: "class" }],
        choiceGroups: [
          {
            id: "wizard-weapon",
            title: "Weapon",
            description: "Choose the wizard's starting weapon.",
            source: "class",
            options: [
              { id: "quarterstaff", label: "Quarterstaff", items: ["Quarterstaff"] },
              { id: "dagger", label: "Dagger", items: ["Dagger"] },
            ],
          },
          {
            id: "wizard-focus",
            title: "Spellcasting gear",
            description: "Choose the wizard's material component option.",
            source: "class",
            options: [
              { id: "component-pouch", label: "Component Pouch", items: ["Component Pouch"] },
              { id: "arcane-focus", label: "Arcane Focus", items: ["Arcane Focus"] },
            ],
          },
          {
            id: "wizard-pack",
            title: "Pack",
            description: "Choose the travel pack the wizard starts with.",
            source: "class",
            options: [
              { id: "scholar", label: "Scholar's Pack", items: ["Scholar's Pack"] },
              { id: "explorer", label: "Explorer's Pack", items: ["Explorer's Pack"] },
            ],
          },
        ],
        notes: [],
        goldAlternative: {
          formula: "4d4 × 10 gp",
          averageGp: 100,
          notes: ["Replaces the class starting gear package. Background gear is still kept in this first pass."],
        },
      };
    case "":
      return { autoItems: [], choiceGroups: [], notes: ["Choose a class to unlock class starting equipment."], goldAlternative: null };
    default:
      return {
        autoItems: [],
        choiceGroups: [],
        notes: ["Starting equipment is not modeled yet for this class source."],
        goldAlternative: null,
      };
  }
}

function getBackgroundPlan(backgroundId: string): StartingEquipmentPlan {
  switch (backgroundId) {
    case "ID_BACKGROUND_ACOLYTE":
      return {
        autoItems: [
          { name: "Holy Symbol", source: "background" },
          { name: "5 Sticks of Incense", source: "background" },
          { name: "Vestments", source: "background" },
          { name: "Set of Common Clothes", source: "background" },
          { name: "Belt Pouch (15 gp)", source: "background" },
        ],
        choiceGroups: [
          {
            id: "acolyte-book",
            title: "Devotional item",
            description: "Choose the devotional item carried from temple service.",
            source: "background",
            options: [
              { id: "prayer-book", label: "Prayer Book", items: ["Prayer Book"] },
              { id: "prayer-wheel", label: "Prayer Wheel", items: ["Prayer Wheel"] },
            ],
          },
        ],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_SAGE":
      return {
        autoItems: [
          { name: "Bottle of Black Ink", source: "background" },
          { name: "Quill", source: "background" },
          { name: "Small Knife", source: "background" },
          { name: "Letter from a Dead Colleague", source: "background" },
          { name: "Set of Common Clothes", source: "background" },
          { name: "Belt Pouch (10 gp)", source: "background" },
        ],
        choiceGroups: [],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_SOLDIER":
      return {
        autoItems: [
          { name: "Insignia of Rank", source: "background" },
          { name: "Trophy from a Fallen Enemy", source: "background" },
          { name: "Set of Common Clothes", source: "background" },
          { name: "Belt Pouch (10 gp)", source: "background" },
        ],
        choiceGroups: [
          {
            id: "soldier-game-set",
            title: "Memento",
            description: "Choose the game set or token carried from service.",
            source: "background",
            options: [
              { id: "bone-dice", label: "Set of Bone Dice", items: ["Set of Bone Dice"] },
              { id: "deck-of-cards", label: "Deck of Cards", items: ["Deck of Cards"] },
            ],
          },
        ],
        notes: [],
        goldAlternative: null,
      };
    case "":
      return { autoItems: [], choiceGroups: [], notes: ["Choose a background to unlock background starting equipment."], goldAlternative: null };
    default:
      return {
        autoItems: [],
        choiceGroups: [],
        notes: ["Starting equipment is not modeled yet for this background source."],
        goldAlternative: null,
      };
  }
}

export function getStartingEquipmentPlan({ classId, backgroundId }: StartingEquipmentContext): StartingEquipmentPlan {
  const classPlan = getClassPlan(classId);
  const backgroundPlan = getBackgroundPlan(backgroundId);

  return {
    autoItems: uniqueItems([...classPlan.autoItems, ...backgroundPlan.autoItems]),
    choiceGroups: [...classPlan.choiceGroups, ...backgroundPlan.choiceGroups],
    notes: [...classPlan.notes, ...backgroundPlan.notes].filter(Boolean),
    goldAlternative: classPlan.goldAlternative,
  };
}

export function getMissingEquipmentChoiceCount(
  plan: StartingEquipmentPlan,
  selections: Record<string, string>,
  mode: "gear" | "gold" = "gear",
) {
  return plan.choiceGroups.filter((group) => {
    if (mode === "gold" && group.source === "class") {
      return false;
    }
    return !selections[group.id];
  }).length;
}

export function resolveStartingEquipmentItems(
  plan: StartingEquipmentPlan,
  selections: Record<string, string>,
  mode: "gear" | "gold" = "gear",
) {
  const selectedItems = plan.choiceGroups.flatMap((group) => {
    if (mode === "gold" && group.source === "class") {
      return [];
    }
    const choiceId = selections[group.id];
    const option = group.options.find((entry) => entry.id === choiceId);
    return option?.items ?? [];
  });

  const autoItems = plan.autoItems
    .filter((item) => !(mode === "gold" && item.source === "class"))
    .map((item) => item.name);

  return [...new Set([...autoItems, ...selectedItems])];
}
