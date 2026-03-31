export type EquipmentChoiceOption = {
  id: string;
  label: string;
  items: string[];
};

export type EquipmentChoiceGroup = {
  id: string;
  title: string;
  description: string;
  options: EquipmentChoiceOption[];
};

export type StartingEquipmentPlan = {
  autoItems: string[];
  choiceGroups: EquipmentChoiceGroup[];
  notes: string[];
};

type StartingEquipmentContext = {
  classId: string;
  backgroundId: string;
};

function uniqueItems(items: string[]) {
  return [...new Set(items)];
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
            options: [
              { id: "martial-and-shield", label: "Martial Weapon + Shield", items: ["Martial Weapon", "Shield"] },
              { id: "two-martial", label: "Two Martial Weapons", items: ["Martial Weapon", "Martial Weapon"] },
            ],
          },
          {
            id: "fighter-sidearm-package",
            title: "Secondary gear",
            description: "Choose the fighter's ranged or thrown backup option.",
            options: [
              { id: "crossbow", label: "Light Crossbow + 20 Bolts", items: ["Light Crossbow", "20 Bolts"] },
              { id: "handaxes", label: "Two Handaxes", items: ["Handaxe", "Handaxe"] },
            ],
          },
          {
            id: "fighter-pack",
            title: "Pack",
            description: "Choose the travel pack the fighter starts with.",
            options: [
              { id: "dungeoneer", label: "Dungeoneer's Pack", items: ["Dungeoneer's Pack"] },
              { id: "explorer", label: "Explorer's Pack", items: ["Explorer's Pack"] },
            ],
          },
        ],
        notes: [],
      };
    case "ID_WOTC_PHB_CLASS_WIZARD":
      return {
        autoItems: ["Spellbook"],
        choiceGroups: [
          {
            id: "wizard-weapon",
            title: "Weapon",
            description: "Choose the wizard's starting weapon.",
            options: [
              { id: "quarterstaff", label: "Quarterstaff", items: ["Quarterstaff"] },
              { id: "dagger", label: "Dagger", items: ["Dagger"] },
            ],
          },
          {
            id: "wizard-focus",
            title: "Spellcasting gear",
            description: "Choose the wizard's material component option.",
            options: [
              { id: "component-pouch", label: "Component Pouch", items: ["Component Pouch"] },
              { id: "arcane-focus", label: "Arcane Focus", items: ["Arcane Focus"] },
            ],
          },
          {
            id: "wizard-pack",
            title: "Pack",
            description: "Choose the travel pack the wizard starts with.",
            options: [
              { id: "scholar", label: "Scholar's Pack", items: ["Scholar's Pack"] },
              { id: "explorer", label: "Explorer's Pack", items: ["Explorer's Pack"] },
            ],
          },
        ],
        notes: [],
      };
    case "":
      return { autoItems: [], choiceGroups: [], notes: ["Choose a class to unlock class starting equipment."] };
    default:
      return {
        autoItems: [],
        choiceGroups: [],
        notes: ["Starting equipment is not modeled yet for this class source."],
      };
  }
}

function getBackgroundPlan(backgroundId: string): StartingEquipmentPlan {
  switch (backgroundId) {
    case "ID_BACKGROUND_ACOLYTE":
      return {
        autoItems: ["Holy Symbol", "5 Sticks of Incense", "Vestments", "Set of Common Clothes", "Belt Pouch (15 gp)"],
        choiceGroups: [
          {
            id: "acolyte-book",
            title: "Devotional item",
            description: "Choose the devotional item carried from temple service.",
            options: [
              { id: "prayer-book", label: "Prayer Book", items: ["Prayer Book"] },
              { id: "prayer-wheel", label: "Prayer Wheel", items: ["Prayer Wheel"] },
            ],
          },
        ],
        notes: [],
      };
    case "ID_BACKGROUND_SAGE":
      return {
        autoItems: ["Bottle of Black Ink", "Quill", "Small Knife", "Letter from a Dead Colleague", "Set of Common Clothes", "Belt Pouch (10 gp)"],
        choiceGroups: [],
        notes: [],
      };
    case "ID_BACKGROUND_SOLDIER":
      return {
        autoItems: ["Insignia of Rank", "Trophy from a Fallen Enemy", "Set of Common Clothes", "Belt Pouch (10 gp)"],
        choiceGroups: [
          {
            id: "soldier-game-set",
            title: "Memento",
            description: "Choose the game set or token carried from service.",
            options: [
              { id: "bone-dice", label: "Set of Bone Dice", items: ["Set of Bone Dice"] },
              { id: "deck-of-cards", label: "Deck of Cards", items: ["Deck of Cards"] },
            ],
          },
        ],
        notes: [],
      };
    case "":
      return { autoItems: [], choiceGroups: [], notes: ["Choose a background to unlock background starting equipment."] };
    default:
      return {
        autoItems: [],
        choiceGroups: [],
        notes: ["Starting equipment is not modeled yet for this background source."],
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
  };
}

export function getMissingEquipmentChoiceCount(
  plan: StartingEquipmentPlan,
  selections: Record<string, string>,
) {
  return plan.choiceGroups.filter((group) => !selections[group.id]).length;
}

export function resolveStartingEquipmentItems(
  plan: StartingEquipmentPlan,
  selections: Record<string, string>,
) {
  const selectedItems = plan.choiceGroups.flatMap((group) => {
    const choiceId = selections[group.id];
    const option = group.options.find((entry) => entry.id === choiceId);
    return option?.items ?? [];
  });

  return uniqueItems([...plan.autoItems, ...selectedItems]);
}
