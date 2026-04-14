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

function option(id: string, label: string, items: string[]): EquipmentChoiceOption {
  return { id, label, items };
}

function group(
  id: string,
  title: string,
  description: string,
  source: EquipmentChoiceSource,
  options: EquipmentChoiceOption[],
): EquipmentChoiceGroup {
  return { id, title, description, source, options };
}

function auto(name: string, source: EquipmentChoiceSource): StartingEquipmentAutoItem {
  return { name, source };
}

function classGoldAlternative(formula: string, averageGp: number): EquipmentGoldAlternative {
  return {
    formula,
    averageGp,
    notes: ["Replaces the class starting gear package. Background gear is still kept in this first pass."],
  };
}

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
    case "ID_WOTC_ERLW_CLASS_ARTIFICER":
      return {
        autoItems: [auto("Thieves' Tools", "class"), auto("Dungeoneer's Pack", "class")],
        choiceGroups: [
          group(
            "artificer-armor",
            "Armor",
            "Choose the artificer's starting armor.",
            "class",
            [
              option("studded-leather", "Studded Leather Armor", ["Studded Leather Armor"]),
              option("scale-mail", "Scale Mail", ["Scale Mail"]),
            ],
          ),
          group(
            "artificer-ranged",
            "Ranged option",
            "Choose the artificer's starting ranged loadout.",
            "class",
            [
              option("crossbow", "Light Crossbow + 20 Bolts", ["Light Crossbow", "20 Bolts"]),
              option("simple-weapon", "Simple Weapon", ["Simple Weapon"]),
            ],
          ),
          group(
            "artificer-tools",
            "Artisan's tools",
            "Choose the artisan's tools the artificer begins with.",
            "class",
            [option("artisan-tools", "Artisan's Tools", ["Artisan's Tools"])],
          ),
          group(
            "artificer-sidearm",
            "Backup weapon",
            "Choose the second simple weapon carried alongside the artificer's tools.",
            "class",
            [option("simple-weapon", "Simple Weapon", ["Simple Weapon"])],
          ),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("5d4 × 10 gp", 125),
      };
    case "ID_WOTC_PHB_CLASS_BARBARIAN":
      return {
        autoItems: [auto("Explorer's Pack", "class"), auto("4 Javelins", "class")],
        choiceGroups: [
          group("barbarian-main-weapon", "Main weapon", "Choose the barbarian's heavy weapon.", "class", [
            option("greataxe", "Greataxe", ["Greataxe"]),
            option("martial-weapon", "Martial Weapon", ["Martial Weapon"]),
          ]),
          group("barbarian-sidearm", "Sidearm", "Choose the barbarian's backup weapon option.", "class", [
            option("two-handaxes", "Two Handaxes", ["Handaxe", "Handaxe"]),
            option("simple-weapon", "Simple Weapon", ["Simple Weapon"]),
          ]),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("2d4 × 10 gp", 50),
      };
    case "ID_WOTC_PHB_CLASS_BARD":
      return {
        autoItems: [auto("Leather Armor", "class"), auto("Dagger", "class")],
        choiceGroups: [
          group("bard-weapon", "Weapon", "Choose the bard's starting weapon.", "class", [
            option("rapier", "Rapier", ["Rapier"]),
            option("longsword", "Longsword", ["Longsword"]),
            option("simple-weapon", "Simple Weapon", ["Simple Weapon"]),
          ]),
          group("bard-pack", "Pack", "Choose the bard's travel pack.", "class", [
            option("diplomat", "Diplomat's Pack", ["Diplomat's Pack"]),
            option("entertainer", "Entertainer's Pack", ["Entertainer's Pack"]),
          ]),
          group("bard-instrument", "Instrument", "Choose the instrument the bard begins with.", "class", [
            option("lute", "Lute", ["Lute"]),
            option("musical-instrument", "Musical Instrument", ["Musical Instrument"]),
          ]),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("5d4 × 10 gp", 125),
      };
    case "ID_WOTC_PHB_CLASS_CLERIC":
      return {
        autoItems: [auto("Shield", "class"), auto("Holy Symbol", "class")],
        choiceGroups: [
          group("cleric-main-weapon", "Main weapon", "Choose the cleric's starting melee weapon.", "class", [
            option("mace", "Mace", ["Mace"]),
            option("warhammer", "Warhammer", ["Warhammer"]),
          ]),
          group("cleric-armor", "Armor", "Choose the cleric's starting armor.", "class", [
            option("scale-mail", "Scale Mail", ["Scale Mail"]),
            option("leather-armor", "Leather Armor", ["Leather Armor"]),
            option("chain-mail", "Chain Mail", ["Chain Mail"]),
          ]),
          group("cleric-backup", "Backup weapon", "Choose the cleric's ranged or melee backup option.", "class", [
            option("crossbow", "Light Crossbow + 20 Bolts", ["Light Crossbow", "20 Bolts"]),
            option("simple-weapon", "Simple Weapon", ["Simple Weapon"]),
          ]),
          group("cleric-pack", "Pack", "Choose the cleric's travel pack.", "class", [
            option("priest", "Priest's Pack", ["Priest's Pack"]),
            option("explorer", "Explorer's Pack", ["Explorer's Pack"]),
          ]),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("5d4 × 10 gp", 125),
      };
    case "ID_WOTC_PHB_CLASS_DRUID":
      return {
        autoItems: [auto("Leather Armor", "class"), auto("Explorer's Pack", "class"), auto("Druidic Focus", "class")],
        choiceGroups: [
          group("druid-offhand", "Protection", "Choose the druid's protective gear or an extra weapon.", "class", [
            option("wooden-shield", "Wooden Shield", ["Wooden Shield"]),
            option("simple-weapon", "Simple Weapon", ["Simple Weapon"]),
          ]),
          group("druid-main-weapon", "Weapon", "Choose the druid's starting melee weapon.", "class", [
            option("scimitar", "Scimitar", ["Scimitar"]),
            option("simple-melee-weapon", "Simple Melee Weapon", ["Simple Melee Weapon"]),
          ]),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("2d4 × 10 gp", 50),
      };
    case "ID_WOTC_PHB_CLASS_FIGHTER":
      return {
        autoItems: [],
        choiceGroups: [
          group("fighter-armor-package", "Armor package", "Choose the fighter starting armor package.", "class", [
            option("chain-mail", "Chain Mail", ["Chain Mail"]),
            option("leather-longbow", "Leather Armor + Longbow", ["Leather Armor", "Longbow", "Quiver", "20 Arrows"]),
          ]),
          group("fighter-weapon-package", "Primary weapons", "Choose the fighter's main weapon loadout.", "class", [
            option("martial-and-shield", "Martial Weapon + Shield", ["Martial Weapon", "Shield"]),
            option("two-martial", "Two Martial Weapons", ["Martial Weapon", "Martial Weapon"]),
          ]),
          group("fighter-sidearm-package", "Secondary gear", "Choose the fighter's ranged or thrown backup option.", "class", [
            option("crossbow", "Light Crossbow + 20 Bolts", ["Light Crossbow", "20 Bolts"]),
            option("handaxes", "Two Handaxes", ["Handaxe", "Handaxe"]),
          ]),
          group("fighter-pack", "Pack", "Choose the travel pack the fighter starts with.", "class", [
            option("dungeoneer", "Dungeoneer's Pack", ["Dungeoneer's Pack"]),
            option("explorer", "Explorer's Pack", ["Explorer's Pack"]),
          ]),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("5d4 × 10 gp", 125),
      };
    case "ID_WOTC_PHB_CLASS_MONK":
      return {
        autoItems: [auto("10 Darts", "class")],
        choiceGroups: [
          group("monk-main-weapon", "Weapon", "Choose the monk's starting weapon.", "class", [
            option("shortsword", "Shortsword", ["Shortsword"]),
            option("simple-weapon", "Simple Weapon", ["Simple Weapon"]),
          ]),
          group("monk-pack", "Pack", "Choose the monk's travel pack.", "class", [
            option("dungeoneer", "Dungeoneer's Pack", ["Dungeoneer's Pack"]),
            option("explorer", "Explorer's Pack", ["Explorer's Pack"]),
          ]),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("5d4 gp", 12),
      };
    case "ID_WOTC_PHB_CLASS_PALADIN":
      return {
        autoItems: [auto("Chain Mail", "class"), auto("Holy Symbol", "class")],
        choiceGroups: [
          group("paladin-main-weapon", "Primary weapons", "Choose the paladin's starting weapon loadout.", "class", [
            option("martial-and-shield", "Martial Weapon + Shield", ["Martial Weapon", "Shield"]),
            option("two-martial", "Two Martial Weapons", ["Martial Weapon", "Martial Weapon"]),
          ]),
          group("paladin-backup", "Backup weapon", "Choose the paladin's secondary option.", "class", [
            option("five-javelins", "Five Javelins", ["5 Javelins"]),
            option("simple-melee", "Simple Melee Weapon", ["Simple Melee Weapon"]),
          ]),
          group("paladin-pack", "Pack", "Choose the paladin's travel pack.", "class", [
            option("priest", "Priest's Pack", ["Priest's Pack"]),
            option("explorer", "Explorer's Pack", ["Explorer's Pack"]),
          ]),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("5d4 × 10 gp", 125),
      };
    case "ID_WOTC_PHB_CLASS_RANGER":
      return {
        autoItems: [auto("Longbow", "class"), auto("Quiver", "class"), auto("20 Arrows", "class")],
        choiceGroups: [
          group("ranger-armor", "Armor", "Choose the ranger's starting armor.", "class", [
            option("scale-mail", "Scale Mail", ["Scale Mail"]),
            option("leather-armor", "Leather Armor", ["Leather Armor"]),
          ]),
          group("ranger-main-weapon", "Primary weapons", "Choose the ranger's melee loadout.", "class", [
            option("two-shortswords", "Two Shortswords", ["Shortsword", "Shortsword"]),
            option("two-simple-melee", "Two Simple Melee Weapons", ["Simple Melee Weapon", "Simple Melee Weapon"]),
          ]),
          group("ranger-pack", "Pack", "Choose the ranger's travel pack.", "class", [
            option("dungeoneer", "Dungeoneer's Pack", ["Dungeoneer's Pack"]),
            option("explorer", "Explorer's Pack", ["Explorer's Pack"]),
          ]),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("5d4 × 10 gp", 125),
      };
    case "ID_WOTC_PHB_CLASS_ROGUE":
      return {
        autoItems: [auto("Leather Armor", "class"), auto("Dagger", "class"), auto("Dagger", "class"), auto("Thieves' Tools", "class")],
        choiceGroups: [
          group("rogue-main-weapon", "Main weapon", "Choose the rogue's primary weapon.", "class", [
            option("rapier", "Rapier", ["Rapier"]),
            option("shortsword", "Shortsword", ["Shortsword"]),
          ]),
          group("rogue-ranged", "Ranged option", "Choose the rogue's ranged or melee backup option.", "class", [
            option("shortbow", "Shortbow + Quiver + 20 Arrows", ["Shortbow", "Quiver", "20 Arrows"]),
            option("shortsword", "Shortsword", ["Shortsword"]),
          ]),
          group("rogue-pack", "Pack", "Choose the rogue's travel pack.", "class", [
            option("burglar", "Burglar's Pack", ["Burglar's Pack"]),
            option("dungeoneer", "Dungeoneer's Pack", ["Dungeoneer's Pack"]),
            option("explorer", "Explorer's Pack", ["Explorer's Pack"]),
          ]),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("4d4 × 10 gp", 100),
      };
    case "ID_WOTC_PHB_CLASS_SORCERER":
      return {
        autoItems: [auto("Dagger", "class"), auto("Dagger", "class")],
        choiceGroups: [
          group("sorcerer-weapon", "Weapon", "Choose the sorcerer's starting weapon.", "class", [
            option("crossbow", "Light Crossbow + 20 Bolts", ["Light Crossbow", "20 Bolts"]),
            option("simple-weapon", "Simple Weapon", ["Simple Weapon"]),
          ]),
          group("sorcerer-focus", "Spellcasting gear", "Choose the sorcerer's material component option.", "class", [
            option("component-pouch", "Component Pouch", ["Component Pouch"]),
            option("arcane-focus", "Arcane Focus", ["Arcane Focus"]),
          ]),
          group("sorcerer-pack", "Pack", "Choose the sorcerer's travel pack.", "class", [
            option("dungeoneer", "Dungeoneer's Pack", ["Dungeoneer's Pack"]),
            option("explorer", "Explorer's Pack", ["Explorer's Pack"]),
          ]),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("3d4 × 10 gp", 75),
      };
    case "ID_WOTC_PHB_CLASS_WARLOCK":
      return {
        autoItems: [auto("Leather Armor", "class"), auto("Simple Weapon", "class"), auto("Dagger", "class"), auto("Dagger", "class")],
        choiceGroups: [
          group("warlock-weapon", "Ranged option", "Choose the warlock's ranged or melee backup option.", "class", [
            option("crossbow", "Light Crossbow + 20 Bolts", ["Light Crossbow", "20 Bolts"]),
            option("simple-weapon", "Simple Weapon", ["Simple Weapon"]),
          ]),
          group("warlock-focus", "Spellcasting gear", "Choose the warlock's material component option.", "class", [
            option("component-pouch", "Component Pouch", ["Component Pouch"]),
            option("arcane-focus", "Arcane Focus", ["Arcane Focus"]),
          ]),
          group("warlock-pack", "Pack", "Choose the warlock's travel pack.", "class", [
            option("scholar", "Scholar's Pack", ["Scholar's Pack"]),
            option("dungeoneer", "Dungeoneer's Pack", ["Dungeoneer's Pack"]),
          ]),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("4d4 × 10 gp", 100),
      };
    case "ID_WOTC_PHB_CLASS_WIZARD":
      return {
        autoItems: [auto("Spellbook", "class")],
        choiceGroups: [
          group("wizard-weapon", "Weapon", "Choose the wizard's starting weapon set.", "class", [
            option("quarterstaff", "Quarterstaff", ["Quarterstaff"]),
            option("dagger", "Dagger", ["Dagger"]),
          ]),
          group("wizard-sidearm", "Sidearm", "Choose the wizard's backup weapon option.", "class", [
            option("crossbow", "Light Crossbow + 20 Bolts", ["Light Crossbow", "20 Bolts"]),
            option("simple-weapon", "Simple Weapon", ["Simple Weapon"]),
          ]),
          group("wizard-focus", "Spellcasting gear", "Choose the wizard's material component option.", "class", [
            option("component-pouch", "Component Pouch", ["Component Pouch"]),
            option("arcane-focus", "Arcane Focus", ["Arcane Focus"]),
          ]),
          group("wizard-pack", "Pack", "Choose the travel pack the wizard starts with.", "class", [
            option("scholar", "Scholar's Pack", ["Scholar's Pack"]),
            option("explorer", "Explorer's Pack", ["Explorer's Pack"]),
          ]),
        ],
        notes: [],
        goldAlternative: classGoldAlternative("4d4 × 10 gp", 100),
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
          auto("Holy Symbol", "background"),
          auto("5 Sticks of Incense", "background"),
          auto("Vestments", "background"),
          auto("Set of Common Clothes", "background"),
          auto("Belt Pouch (15 gp)", "background"),
        ],
        choiceGroups: [
          group("acolyte-book", "Devotional item", "Choose the devotional item carried from temple service.", "background", [
            option("prayer-book", "Prayer Book", ["Prayer Book"]),
            option("prayer-wheel", "Prayer Wheel", ["Prayer Wheel"]),
          ]),
        ],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_CHARLATAN":
      return {
        autoItems: [auto("Set of Fine Clothes", "background"), auto("Disguise Kit", "background"), auto("Belt Pouch (15 gp)", "background")],
        choiceGroups: [
          group("charlatan-tools", "Tools of the con", "Choose the prop or trick carried with the charlatan's disguise.", "background", [
            option("colored-bottles", "Ten Colored Bottles", ["10 Colored Bottles"]),
            option("weighted-dice", "Set of Weighted Dice", ["Set of Weighted Dice"]),
            option("marked-cards", "Deck of Marked Cards", ["Deck of Marked Cards"]),
            option("imaginary-duke", "Signet Ring of an Imaginary Duke", ["Signet Ring of an Imaginary Duke"]),
          ]),
        ],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_CRIMINAL":
      return {
        autoItems: [auto("Crowbar", "background"), auto("Set of Dark Common Clothes", "background"), auto("Belt Pouch (15 gp)", "background")],
        choiceGroups: [],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_ENTERTAINER":
      return {
        autoItems: [auto("Favor of an Admirer", "background"), auto("Costume", "background"), auto("Belt Pouch (15 gp)", "background")],
        choiceGroups: [
          group("entertainer-instrument", "Instrument", "Choose the instrument the entertainer carries on the road.", "background", [
            option("musical-instrument", "Musical Instrument", ["Musical Instrument"]),
          ]),
        ],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_FOLK_HERO":
      return {
        autoItems: [
          auto("Shovel", "background"),
          auto("Iron Pot", "background"),
          auto("Set of Common Clothes", "background"),
          auto("Belt Pouch (10 gp)", "background"),
        ],
        choiceGroups: [
          group("folk-hero-tools", "Artisan's tools", "Choose the artisan's tools the folk hero kept from village life.", "background", [
            option("artisan-tools", "Artisan's Tools", ["Artisan's Tools"]),
          ]),
        ],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_GUILD_ARTISAN":
      return {
        autoItems: [auto("Letter of Introduction", "background"), auto("Set of Traveler's Clothes", "background"), auto("Belt Pouch (15 gp)", "background")],
        choiceGroups: [
          group("guild-artisan-tools", "Artisan's tools", "Choose the artisan's tools linked to the guild business.", "background", [
            option("artisan-tools", "Artisan's Tools", ["Artisan's Tools"]),
          ]),
        ],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_HERMIT":
      return {
        autoItems: [
          auto("Scroll Case Full of Notes", "background"),
          auto("Winter Blanket", "background"),
          auto("Set of Common Clothes", "background"),
          auto("Herbalism Kit", "background"),
          auto("Belt Pouch (5 gp)", "background"),
        ],
        choiceGroups: [],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_NOBLE":
      return {
        autoItems: [
          auto("Set of Fine Clothes", "background"),
          auto("Signet Ring", "background"),
          auto("Scroll of Pedigree", "background"),
          auto("Purse (25 gp)", "background"),
        ],
        choiceGroups: [],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_OUTLANDER":
      return {
        autoItems: [
          auto("Staff", "background"),
          auto("Hunting Trap", "background"),
          auto("Trophy from an Animal You Killed", "background"),
          auto("Set of Traveler's Clothes", "background"),
          auto("Belt Pouch (10 gp)", "background"),
        ],
        choiceGroups: [
          group("outlander-instrument", "Musical instrument", "Choose the instrument carried from life in the wilds.", "background", [
            option("musical-instrument", "Musical Instrument", ["Musical Instrument"]),
          ]),
        ],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_SAGE":
      return {
        autoItems: [
          auto("Bottle of Black Ink", "background"),
          auto("Quill", "background"),
          auto("Small Knife", "background"),
          auto("Letter from a Dead Colleague", "background"),
          auto("Set of Common Clothes", "background"),
          auto("Belt Pouch (10 gp)", "background"),
        ],
        choiceGroups: [],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_SAILOR":
      return {
        autoItems: [
          auto("Belaying Pin", "background"),
          auto("50 Feet of Silk Rope", "background"),
          auto("Lucky Charm", "background"),
          auto("Set of Common Clothes", "background"),
          auto("Belt Pouch (10 gp)", "background"),
        ],
        choiceGroups: [],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_SOLDIER":
      return {
        autoItems: [
          auto("Insignia of Rank", "background"),
          auto("Trophy from a Fallen Enemy", "background"),
          auto("Set of Common Clothes", "background"),
          auto("Belt Pouch (10 gp)", "background"),
        ],
        choiceGroups: [
          group("soldier-game-set", "Memento", "Choose the game set or token carried from service.", "background", [
            option("bone-dice", "Set of Bone Dice", ["Set of Bone Dice"]),
            option("deck-of-cards", "Deck of Cards", ["Deck of Cards"]),
          ]),
        ],
        notes: [],
        goldAlternative: null,
      };
    case "ID_BACKGROUND_URCHIN":
      return {
        autoItems: [
          auto("Small Knife", "background"),
          auto("Map of the City", "background"),
          auto("Pet Mouse", "background"),
          auto("Token to Remember Your Parents By", "background"),
          auto("Set of Common Clothes", "background"),
          auto("Belt Pouch (10 gp)", "background"),
        ],
        choiceGroups: [],
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
