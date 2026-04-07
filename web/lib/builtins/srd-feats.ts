import type { BuiltInElement } from "@/lib/builtins/types";

export const BUILT_IN_SRD_FEAT_ELEMENTS: readonly BuiltInElement[] = [
  {
    "id": "ID_PHB_FEAT_ACTOR",
    "type": "Feat",
    "name": "Actor",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Skilled at mimicry and dramatics, you gain the following benefits Increase your Charisma score by 1, to a maximum of 20. You have advantage on Charisma (Deception) and Charisma (Performance) checks when trying to pass yourself off as a different person. You can mimic the speech of another person or the sounds made by other creatures. You must have heard the person speaking, or heard the creature make the sound, for at least 1 minute. A successful Wisdom (Insight) check contested by your Charisma (Deception) check allows a listener to determine that the effect is faked.",
    "rules": [
      {
        "kind": "stat",
        "name": "charisma",
        "value": "1"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Skilled at mimicry and dramatics, you gain the following benefits</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase your Charisma score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>You have advantage on Charisma (Deception) and Charisma (Performance) checks when trying to pass yourself off as a different person.</li>\n\t\t\t\t<li>You can mimic the speech of another person or the sounds made by other creatures. You must have heard the person speaking, or heard the creature make the sound, for at least 1 minute. A successful Wisdom (Insight) check contested by your Charisma (Deception) check allows a listener to determine that the effect is faked.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_ALERT",
    "type": "Feat",
    "name": "Alert",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Always on the lookout for danger, you gain the following benefits: You gain a +5 bonus to initiative. You can’t be surprised while you are conscious. Other creatures don’t gain advantage on attack rolls against you as a result of being unseen by you.",
    "rules": [
      {
        "kind": "stat",
        "name": "initiative",
        "value": "5"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Always on the lookout for danger, you gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>You gain a +5 bonus to initiative.</li>\n\t\t\t\t<li>You can’t be surprised while you are conscious.</li>\n\t\t\t\t<li>Other creatures don’t gain advantage on attack rolls against you as a result of being unseen by you.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_ATHLETE",
    "type": "Feat",
    "name": "Athlete",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You have undergone extensive physical training to gain the following benefits: Increase your Strength or Dexterity score by 1, to a maximum of 20. When you are prone, standing up uses only 5 feet of your movement. Climbing doesn’t cost you extra movement. You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.",
    "rules": [
      {
        "kind": "select",
        "type": "Ability Score Improvement",
        "name": "Athlete",
        "supports": "ID_PHB_FEAT_ASI_STRENGTH|ID_PHB_FEAT_ASI_DEXTERITY"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You have undergone extensive physical training to gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>When you are prone, standing up uses only 5 feet of your movement.</li>\n\t\t\t\t<li>Climbing doesn’t cost you extra movement.</li>\n\t\t\t\t<li>You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_CHARGER",
    "type": "Feat",
    "name": "Charger",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature. If you move at least 10 feet in a straight line immediately before taking this bonus action, you either gain a +5 bonus to the attack’s damage roll (if you chose to make a melee attack and hit) or push the target up to 10 feet away from you (if you chose to shove and you succeed).",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature.</p>\n\t\t\t<p class=\"indent\">If you move at least 10 feet in a straight line immediately before taking this bonus action, you either gain a +5 bonus to the attack’s damage roll (if you chose to make a melee attack and hit) or push the target up to 10 feet away from you (if you chose to shove and you succeed).</p>"
  },
  {
    "id": "ID_PHB_FEAT_CROSSBOWEXPERT",
    "type": "Feat",
    "name": "Crossbow Expert",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Thanks to extensive practice with the crossbow, you gain the following benefits: You ignore the loading quality of crossbows with which you are proficient. Being within 5 feet of a hostile creature doesn’t impose disadvantage on your ranged attack rolls. When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>Thanks to extensive practice with the crossbow, you gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>You ignore the loading quality of crossbows with which you are proficient.</li>\n\t\t\t\t<li>Being within 5 feet of a hostile creature doesn’t impose disadvantage on your ranged attack rolls.</li>\n\t\t\t\t<li>When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_DEFENSIVE_DUELIST",
    "type": "Feat",
    "name": "Defensive Duelist",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: Dexterity 13 or higher When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing the attack to miss you.",
    "rules": [
      {
        "kind": "stat",
        "name": "defensive duelist:ac",
        "value": "proficiency"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: Dexterity 13 or higher</i></p>\n\t\t\t<p>When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing the attack to miss you.</p>",
    "prerequisite": "Dexterity 13 or higher",
    "requirements": "[dex:13]"
  },
  {
    "id": "ID_PHB_FEAT_DUALWIELDER",
    "type": "Feat",
    "name": "Dual Wielder",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You master fighting with two weapons, gaining the following benefits: You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand. You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren’t light. You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.",
    "rules": [
      {
        "kind": "stat",
        "name": "ac:misc",
        "value": "1"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You master fighting with two weapons, gaining the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand.</li>\n\t\t\t\t<li>You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren’t light.</li>\n\t\t\t\t<li>You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_DUNGEON_DELVER",
    "type": "Feat",
    "name": "Dungeon Delver",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Alert to the hidden traps and secret doors found in many dungeons, you gain the following benefits: You have advantage on Wisdom (Perception) and Intelligence (Investigation) checks made to detect the presence of secret doors. You have advantage on saving throws made to avoid or resist traps. You have resistance to the damage dealt by traps. Traveling at a fast pace doesn’t impose the normal −5 penalty on your passive Wisdom (Perception) score.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>Alert to the hidden traps and secret doors found in many dungeons, you gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>You have advantage on Wisdom (Perception) and Intelligence (Investigation) checks made to detect the presence of secret doors.</li>\n\t\t\t\t<li>You have advantage on saving throws made to avoid or resist traps.</li>\n\t\t\t\t<li>You have resistance to the damage dealt by traps.</li>\n\t\t\t\t<li>Traveling at a fast pace doesn’t impose the normal −5 penalty on your passive Wisdom (Perception) score.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_DURABLE",
    "type": "Feat",
    "name": "Durable",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Hardy and resilient, you gain the following benefits: Increase your Constitution score by 1, to a maximum of 20. When you roll a Hit Die to regain hit points, the minimum number of hit points you regain from the roll equals twice your Constitution modifier (minimum of 2).",
    "rules": [
      {
        "kind": "stat",
        "name": "constitution",
        "value": "1"
      },
      {
        "kind": "stat",
        "name": "durable:constitution modifier",
        "value": "constitution:modifier"
      },
      {
        "kind": "stat",
        "name": "durable:constitution modifier",
        "value": "constitution:modifier"
      },
      {
        "kind": "stat",
        "name": "durable:hd:bonus",
        "value": "2",
        "bonus": "feat:durable"
      },
      {
        "kind": "stat",
        "name": "durable:hd:bonus",
        "value": "durable:constitution modifier",
        "bonus": "feat:durable"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Hardy and resilient, you gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase your Constitution score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>When you roll a Hit Die to regain hit points, the minimum number of hit points you regain from the roll equals twice your Constitution modifier (minimum of 2).</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_ELEMENTAL_ADEPT",
    "type": "Feat",
    "name": "Elemental Adept",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: The ability to cast at least one spell When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2. You can select this feat multiple times. Each time you do so, you must choose a different damage type.",
    "rules": [
      {
        "kind": "select",
        "type": "Feat Feature",
        "name": "Elemental Adept",
        "supports": "Elemental Adept"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: The ability to cast at least one spell</i></p>\n\t\t\t<p>When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder.</p>\n\t\t\t<p class=\"indent\">Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2.</p>\n\t\t\t<p class=\"indent\">You can select this feat multiple times. Each time you do so, you must choose a different damage type.</p>",
    "prerequisite": "The ability to cast at least one spell",
    "requirements": "[type:spell]"
  },
  {
    "id": "ID_PHB_FEAT_ELEMENTAL_ADEPT_ACID",
    "type": "Feat Feature",
    "name": "Acid",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Elemental Adept"
    ],
    "description": "Spells you cast ignore acid resistance. In addition, when you roll damage for a spell you cast that deals acid damage, you can treat any 1 on a damage die as a 2.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>Spells you cast ignore acid resistance. In addition, when you roll damage for a spell you cast that deals acid damage, you can treat any 1 on a damage die as a 2.</p>"
  },
  {
    "id": "ID_PHB_FEAT_ELEMENTAL_ADEPT_COLD",
    "type": "Feat Feature",
    "name": "Cold",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Elemental Adept"
    ],
    "description": "Spells you cast ignore cold resistance. In addition, when you roll damage for a spell you cast that deals cold damage, you can treat any 1 on a damage die as a 2.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>Spells you cast ignore cold resistance. In addition, when you roll damage for a spell you cast that deals cold damage, you can treat any 1 on a damage die as a 2.</p>"
  },
  {
    "id": "ID_PHB_FEAT_ELEMENTAL_ADEPT_FIRE",
    "type": "Feat Feature",
    "name": "Fire",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Elemental Adept"
    ],
    "description": "Spells you cast ignore fire resistance. In addition, when you roll damage for a spell you cast that deals fire damage, you can treat any 1 on a damage die as a 2.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>Spells you cast ignore fire resistance. In addition, when you roll damage for a spell you cast that deals fire damage, you can treat any 1 on a damage die as a 2.</p>"
  },
  {
    "id": "ID_PHB_FEAT_ELEMENTAL_ADEPT_LIGHTNING",
    "type": "Feat Feature",
    "name": "Lightning",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Elemental Adept"
    ],
    "description": "Spells you cast ignore lightning resistance. In addition, when you roll damage for a spell you cast that deals lightning damage, you can treat any 1 on a damage die as a 2.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>Spells you cast ignore lightning resistance. In addition, when you roll damage for a spell you cast that deals lightning damage, you can treat any 1 on a damage die as a 2.</p>"
  },
  {
    "id": "ID_PHB_FEAT_ELEMENTAL_ADEPT_THUNDER",
    "type": "Feat Feature",
    "name": "Thunder",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Elemental Adept"
    ],
    "description": "Spells you cast ignore thunder resistance. In addition, when you roll damage for a spell you cast that deals thunder damage, you can treat any 1 on a damage die as a 2.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>Spells you cast ignore thunder resistance. In addition, when you roll damage for a spell you cast that deals thunder damage, you can treat any 1 on a damage die as a 2.</p>"
  },
  {
    "id": "ID_PHB_FEAT_ELEMENTAL_ADEPT_2",
    "type": "Feat",
    "name": "Elemental Adept",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: The ability to cast at least one spell When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2. You can select this feat multiple times. Each time you do so, you must choose a different damage type.",
    "rules": [
      {
        "kind": "select",
        "type": "Feat Feature",
        "name": "Elemental Adept",
        "supports": "Elemental Adept"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: The ability to cast at least one spell</i></p>\n\t\t\t<p>When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder.</p>\n\t\t\t<p class=\"indent\">Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2.</p>\n\t\t\t<p class=\"indent\">You can select this feat multiple times. Each time you do so, you must choose a different damage type.</p>",
    "prerequisite": "The ability to cast at least one spell",
    "requirements": "ID_PHB_FEAT_ELEMENTAL_ADEPT,[type:spell]"
  },
  {
    "id": "ID_PHB_FEAT_ELEMENTAL_ADEPT_3",
    "type": "Feat",
    "name": "Elemental Adept",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: The ability to cast at least one spell When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2. You can select this feat multiple times. Each time you do so, you must choose a different damage type.",
    "rules": [
      {
        "kind": "select",
        "type": "Feat Feature",
        "name": "Elemental Adept",
        "supports": "Elemental Adept"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: The ability to cast at least one spell</i></p>\n\t\t\t<p>When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder.</p>\n\t\t\t<p class=\"indent\">Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2.</p>\n\t\t\t<p class=\"indent\">You can select this feat multiple times. Each time you do so, you must choose a different damage type.</p>",
    "prerequisite": "The ability to cast at least one spell",
    "requirements": "ID_PHB_FEAT_ELEMENTAL_ADEPT_2,[type:spell]"
  },
  {
    "id": "ID_PHB_FEAT_ELEMENTAL_ADEPT_4",
    "type": "Feat",
    "name": "Elemental Adept",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: The ability to cast at least one spell When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2. You can select this feat multiple times. Each time you do so, you must choose a different damage type.",
    "rules": [
      {
        "kind": "select",
        "type": "Feat Feature",
        "name": "Elemental Adept",
        "supports": "Elemental Adept"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: The ability to cast at least one spell</i></p>\n\t\t\t<p>When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder.</p>\n\t\t\t<p class=\"indent\">Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2.</p>\n\t\t\t<p class=\"indent\">You can select this feat multiple times. Each time you do so, you must choose a different damage type.</p>",
    "prerequisite": "The ability to cast at least one spell",
    "requirements": "ID_PHB_FEAT_ELEMENTAL_ADEPT_3,[type:spell]"
  },
  {
    "id": "ID_PHB_FEAT_ELEMENTAL_ADEPT_5",
    "type": "Feat",
    "name": "Elemental Adept",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: The ability to cast at least one spell When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2. You can select this feat multiple times. Each time you do so, you must choose a different damage type.",
    "rules": [
      {
        "kind": "select",
        "type": "Feat Feature",
        "name": "Elemental Adept",
        "supports": "Elemental Adept"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: The ability to cast at least one spell</i></p>\n\t\t\t<p>When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder.</p>\n\t\t\t<p class=\"indent\">Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2.</p>\n\t\t\t<p class=\"indent\">You can select this feat multiple times. Each time you do so, you must choose a different damage type.</p>",
    "prerequisite": "The ability to cast at least one spell",
    "requirements": "ID_PHB_FEAT_ELEMENTAL_ADEPT_4,[type:spell]"
  },
  {
    "id": "ID_PHB_FEAT_GRAPPLER",
    "type": "Feat",
    "name": "Grappler",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: Strength 13 or higher You’ve developed the skills necessary to hold your own in close-quarters grappling. You gain the following benefits: You have advantage on attack rolls against a creature you are grappling. You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p class=\"flavor\">Prerequisite: Strength 13 or higher</p>\n\t\t\t<p>You’ve developed the skills necessary to hold your own in close-quarters grappling. You gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>You have advantage on attack rolls against a creature you are grappling.</li>\n\t\t\t\t<li>You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends.</li>\n\t\t\t</ul>",
    "prerequisite": "Strength 13 or higher",
    "requirements": "[str:13]"
  },
  {
    "id": "ID_PHB_FEAT_GREATWEAPONMASTER",
    "type": "Feat",
    "name": "Great Weapon Master",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You’ve learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes. You gain the following benefits: On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action. Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a - 5 penalty to the attack roll. If the attack hits, you add +10 to the attack’s damage.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>You’ve learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes. You gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action.</li>\n\t\t\t\t<li>Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a - 5 penalty to the attack roll. If the attack hits, you add +10 to the attack’s damage.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_HEALER",
    "type": "Feat",
    "name": "Healer",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You are an able physician, allowing you to mend wounds quickly and get your allies back in the fight. You gain the following benefits: When you use a healer’s kit to stabilize a dying creature, that creature also regains 1 hit point. As an action, you can spend one use of a healer’s kit to tend to a creature and restore 1d6 + 4 hit points to it, plus additional hit points equal to the creature’s maximum number of Hit Dice. The creature can’t regain hit points from this feat again until it finishes a short or long rest.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>You are an able physician, allowing you to mend wounds quickly and get your allies back in the fight. You gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>When you use a healer’s kit to stabilize a dying creature, that creature also regains 1 hit point.</li>\n\t\t\t\t<li>As an action, you can spend one use of a healer’s kit to tend to a creature and restore 1d6 + 4 hit points to it, plus additional hit points equal to the creature’s maximum number of Hit Dice. The creature can’t regain hit points from this feat again until it finishes a short or long rest.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_HEAVILYARMORED",
    "type": "Feat",
    "name": "Heavily Armored",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: Proficiency with medium armor You have trained to master the use of heavy armor, gaining the following benefits: Increase your Strength score by 1, to a maximum of 20. You gain proficiency with heavy armor.",
    "rules": [
      {
        "kind": "stat",
        "name": "strength",
        "value": "1"
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_ARMOR_PROFICIENCY_HEAVY_ARMOR"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: Proficiency with medium armor</i></p>\n\t\t\t<p>You have trained to master the use of heavy armor, gaining the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase your Strength score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>You gain proficiency with heavy armor.</li>\n\t\t\t</ul>",
    "prerequisite": "Proficiency with medium armor",
    "requirements": "ID_PROFICIENCY_ARMOR_PROFICIENCY_MEDIUM_ARMOR"
  },
  {
    "id": "ID_PHB_FEAT_HEAVYARMORMASTER",
    "type": "Feat",
    "name": "Heavy Armor Master",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: Proficiency with heavy armor You can use your armor to deflect strikes that would kill others. You gain the following benefits: Increase your Strength score by 1, to a maximum of 20. While you are wearing heavy armor, bludgeoning, piercing, and slashing damage that you take from non magical weapons is reduced by 3.",
    "rules": [
      {
        "kind": "stat",
        "name": "strength",
        "value": "1"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: Proficiency with heavy armor</i></p>\n\t\t\t<p>You can use your armor to deflect strikes that would kill others. You gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase your Strength score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>While you are wearing heavy armor, bludgeoning, piercing, and slashing damage that you take from non magical weapons is reduced by 3.</li>\n\t\t\t</ul>",
    "prerequisite": "Proficiency with heavy armor",
    "requirements": "ID_PROFICIENCY_ARMOR_PROFICIENCY_HEAVY_ARMOR"
  },
  {
    "id": "ID_PHB_FEAT_INSPIRINGLEADER",
    "type": "Feat",
    "name": "Inspiring Leader",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: Charisma 13 or higher You can spend 10 minutes inspiring your companions, shoring up their resolve to fight. When you do so, choose up to six friendly creatures (which can include yourself) within 30 feet of you who can see or hear you and who can understand you. Each creature can gain temporary hit points equal to your level + your Charisma modifier. A creature can’t gain temporary hit points from this feat again until it has finished a short or long rest.",
    "rules": [
      {
        "kind": "stat",
        "name": "inspiring leader:hp:temp",
        "value": "level"
      },
      {
        "kind": "stat",
        "name": "inspiring leader:hp:temp",
        "value": "charisma:modifier"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: Charisma 13 or higher</i></p>\n\t\t\t<p>You can spend 10 minutes inspiring your companions, shoring up their resolve to fight. When you do so, choose up to six friendly creatures (which can include yourself) within 30 feet of you who can see or hear you and who can understand you. Each creature can gain temporary hit points equal to your level + your Charisma modifier. A creature can’t gain temporary hit points from this feat again until it has finished a short or long rest.</p>",
    "prerequisite": "Charisma 13 or higher",
    "requirements": "[cha:13]"
  },
  {
    "id": "ID_PHB_FEAT_KEENMIND",
    "type": "Feat",
    "name": "Keen Mind",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You have a mind that can track time, direction, and detail with uncanny precision. You gain the following benefits: Increase your Intelligence score by 1, to a maximum of 20. You always know which way is north. You always know the number of hours left before the next sunrise or sunset. You can accurately recall anything you have seen or heard within the past month.",
    "rules": [
      {
        "kind": "stat",
        "name": "intelligence",
        "value": "1"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You have a mind that can track time, direction, and detail with uncanny precision. You gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase your Intelligence score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>You always know which way is north.</li>\n\t\t\t\t<li>You always know the number of hours left before the next sunrise or sunset.</li>\n\t\t\t\t<li>You can accurately recall anything you have seen or heard within the past month.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_LIGHTLYARMORED",
    "type": "Feat",
    "name": "Lightly Armored",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You have trained to master the use of light armor, gaining the following benefits: Increase your Strength or Dexterity score by 1, to a maximum of 20. You gain proficiency with light armor.",
    "rules": [
      {
        "kind": "select",
        "type": "Ability Score Improvement",
        "name": "Ability Score Increase (Lightly Armored)",
        "supports": "ID_PHB_FEAT_ASI_STRENGTH|ID_PHB_FEAT_ASI_DEXTERITY"
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_ARMOR_PROFICIENCY_LIGHT_ARMOR"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You have trained to master the use of light armor, gaining the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>You gain proficiency with light armor.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_LINGUIST",
    "type": "Feat",
    "name": "Linguist",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You have studied languages and codes, gaining the following benefits: Increase your Intelligence score by 1, to a maximum of 20. You learn three languages of your choice. You can ably create written ciphers. Others can’t decipher a code you create unless you teach them, they succeed on an Intelligence check (DC equal to your Intelligence score + your proficiency bonus), or they use magic to decipher it.",
    "rules": [
      {
        "kind": "stat",
        "name": "intelligence",
        "value": "1"
      },
      {
        "kind": "select",
        "type": "Language",
        "name": "Language (Linguist)",
        "number": 3
      },
      {
        "kind": "stat",
        "name": "linguist:dc",
        "value": "intelligence:score"
      },
      {
        "kind": "stat",
        "name": "linguist:dc",
        "value": "proficiency"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You have studied languages and codes, gaining the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase your Intelligence score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>You learn three languages of your choice.</li>\n\t\t\t\t<li>You can ably create written ciphers. Others can’t decipher a code you create unless you teach them, they succeed on an Intelligence check (DC equal to your Intelligence score + your proficiency bonus), or they use magic to decipher it.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_LUCKY",
    "type": "Feat",
    "name": "Lucky",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You have inexplicable luck that seems to kick in at just the right moment. You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw. You can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker’s roll or yours. If more than one creature spends a luck point to influence the outcome of a roll, the points cancel each other out; no additional dice are rolled. You regain your expended luck points when you finish a long rest.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>You have inexplicable luck that seems to kick in at just the right moment.</p>\n\t\t\t<p class=\"indent\">You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw.</p>\n\t\t\t<p class=\"indent\">You can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker’s roll or yours.</p>\n\t\t\t<p class=\"indent\">If more than one creature spends a luck point to influence the outcome of a roll, the points cancel each other out; no additional dice are rolled.</p>\n\t\t\t<p class=\"indent\">You regain your expended luck points when you finish a long rest.</p>"
  },
  {
    "id": "ID_PHB_FEAT_MAGESLAYER",
    "type": "Feat",
    "name": "Mage Slayer",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You have practiced techniques useful in melee combat against spellcasters, gaining the following benefits: When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature. When you damage a creature that is concentrating on a spell, that creature has disadvantage on the saving throw it makes to maintain its concentration. You have advantage on saving throws against spells cast by creatures within 5 feet of you.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>You have practiced techniques useful in melee combat against spellcasters, gaining the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature.</li>\n\t\t\t\t<li>When you damage a creature that is concentrating on a spell, that creature has disadvantage on the saving throw it makes to maintain its concentration.</li>\n\t\t\t\t<li>You have advantage on saving throws against spells cast by creatures within 5 feet of you.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_MAGICINITIATE",
    "type": "Feat",
    "name": "Magic Initiate",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class’s spell list. In addition, choose one 1st-level spell to learn from that same list. Using this feat, you can cast the spell once at its lowest level, and you must finish a long rest before you can cast it in this way again. Your spellcasting ability for these spells depends on the class you chose: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid: or Intelligence for wizard.",
    "rules": [
      {
        "kind": "select",
        "type": "Feat Feature",
        "name": "Magic Initiate",
        "supports": "Magic Initiate"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class’s spell list.</p>\n\t\t\t<p class=\"indent\">In addition, choose one 1st-level spell to learn from that same list. Using this feat, you can cast the spell once at its lowest level, and you must finish a long rest before you can cast it in this way again.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells depends on the class you chose: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid: or Intelligence for wizard.</p>"
  },
  {
    "id": "ID_PHB_FEAT_MAGIC_INITIATE_BARD",
    "type": "Feat Feature",
    "name": "Bard",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Magic Initiate"
    ],
    "description": "You learn two cantrips of your choice from the bard’s spell list. In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again. Your spellcasting ability for these spells is charisma.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "Cantrip (Magic Initiate)",
        "supports": "0,Bard",
        "number": 2
      },
      {
        "kind": "select",
        "type": "Spell",
        "name": "1st-level Spell (Magic Initiate)",
        "supports": "1,Bard"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You learn two cantrips of your choice from the bard’s spell list.</p>\n\t\t\t<p class=\"indent\">In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells is charisma.</p>"
  },
  {
    "id": "ID_PHB_FEAT_MAGIC_INITIATE_CLERIC",
    "type": "Feat Feature",
    "name": "Cleric",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Magic Initiate"
    ],
    "description": "You learn two cantrips of your choice from the cleric’s spell list. In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again. Your spellcasting ability for these spells is wisdom.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "Cantrip (Magic Initiate)",
        "supports": "0,Cleric",
        "number": 2
      },
      {
        "kind": "select",
        "type": "Spell",
        "name": "1st-level Spell (Magic Initiate)",
        "supports": "1,Cleric"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You learn two cantrips of your choice from the cleric’s spell list.</p>\n\t\t\t<p class=\"indent\">In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells is wisdom.</p>"
  },
  {
    "id": "ID_PHB_FEAT_MAGIC_INITIATE_DRUID",
    "type": "Feat Feature",
    "name": "Druid",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Magic Initiate"
    ],
    "description": "You learn two cantrips of your choice from the druid spell list. In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again. Your spellcasting ability for these spells is wisdom.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "Cantrip (Magic Initiate)",
        "supports": "0,Druid",
        "number": 2
      },
      {
        "kind": "select",
        "type": "Spell",
        "name": "1st-level Spell (Magic Initiate)",
        "supports": "1,Druid"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You learn two cantrips of your choice from the druid spell list.</p>\n\t\t\t<p class=\"indent\">In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells is wisdom.</p>"
  },
  {
    "id": "ID_PHB_FEAT_MAGIC_INITIATE_SORCERER",
    "type": "Feat Feature",
    "name": "Sorcerer",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Magic Initiate"
    ],
    "description": "You learn two cantrips of your choice from the sorcerer’s spell list. In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again. Your spellcasting ability for these spells is charisma.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "Cantrip (Magic Initiate)",
        "supports": "0,Sorcerer",
        "number": 2
      },
      {
        "kind": "select",
        "type": "Spell",
        "name": "1st-level Spell (Magic Initiate)",
        "supports": "1,Sorcerer"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You learn two cantrips of your choice from the sorcerer’s spell list.</p>\n\t\t\t<p class=\"indent\">In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells is charisma.</p>"
  },
  {
    "id": "ID_PHB_FEAT_MAGIC_INITIATE_WARLOCK",
    "type": "Feat Feature",
    "name": "Warlock",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Magic Initiate"
    ],
    "description": "You learn two cantrips of your choice from the warlock’s spell list. In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again. Your spellcasting ability for these spells is charisma.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "Cantrip (Magic Initiate)",
        "supports": "0,Warlock",
        "number": 2
      },
      {
        "kind": "select",
        "type": "Spell",
        "name": "1st-level Spell (Magic Initiate)",
        "supports": "1,Warlock"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You learn two cantrips of your choice from the warlock’s spell list.</p>\n\t\t\t<p class=\"indent\">In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells is charisma.</p>"
  },
  {
    "id": "ID_PHB_FEAT_MAGIC_INITIATE_WIZARD",
    "type": "Feat Feature",
    "name": "Wizard",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Magic Initiate"
    ],
    "description": "You learn two cantrips of your choice from the wizard’s spell list. In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again. Your spellcasting ability for these spells is intelligence.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "Cantrip (Magic Initiate)",
        "supports": "0,Wizard",
        "number": 2
      },
      {
        "kind": "select",
        "type": "Spell",
        "name": "1st-level Spell (Magic Initiate)",
        "supports": "1,Wizard"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You learn two cantrips of your choice from the wizard’s spell list.</p>\n\t\t\t<p class=\"indent\">In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells is intelligence.</p>"
  },
  {
    "id": "ID_PHB_FEAT_MARTIALADEPT",
    "type": "Feat",
    "name": "Martial Adept",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You have martial training that allows you to perform special combat maneuvers. You gain the following benefits: You learn two maneuvers of your choice from among those available to the Battle Master archetype in the fighter class. If a maneuver you use requires your target to make a saving throw to resist the maneuver’s effects, the saving throw DC equals 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice). You gain one superiority die, which is a d6 (this die is added to any superiority dice you have from another source). This die is used to fuel your maneuvers. A superiority die is expended when you use it. You regain your expended superiority dice when you finish a short or long rest.",
    "rules": [
      {
        "kind": "stat",
        "name": "martial adept:ability",
        "value": "strength:modifier",
        "bonus": "martial adept:ability"
      },
      {
        "kind": "stat",
        "name": "martial adept:ability",
        "value": "dexterity:modifier",
        "bonus": "martial adept:ability"
      },
      {
        "kind": "stat",
        "name": "martial adept:dc",
        "value": "8"
      },
      {
        "kind": "stat",
        "name": "martial adept:dc",
        "value": "proficiency"
      },
      {
        "kind": "stat",
        "name": "martial adept:dc",
        "value": "martial adept:ability"
      },
      {
        "kind": "stat",
        "name": "martial adept:dice:amount",
        "value": "1"
      },
      {
        "kind": "stat",
        "name": "martial adept:dice:size",
        "value": "6"
      },
      {
        "kind": "select",
        "type": "Archetype Feature",
        "name": "Martial Adept",
        "supports": "Maneuver,Battle Master",
        "number": 2
      },
      {
        "kind": "stat",
        "name": "superiority dice:amount",
        "value": "1",
        "requirements": "ID_ARCHETYPE_FEATURE_BATTLE_MASTER_COMBAT_SUPERIORITY"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You have martial training that allows you to perform special combat maneuvers. You gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>You learn two maneuvers of your choice from among those available to the Battle Master archetype in the fighter class. If a maneuver you use requires your target to make a saving throw to resist the maneuver’s effects, the saving throw DC equals 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice).</li>\n\t\t\t\t<li>You gain one superiority die, which is a d6 (this die is added to any superiority dice you have from another source). This die is used to fuel your maneuvers. A superiority die is expended when you use it. You regain your expended superiority dice when you finish a short or long rest.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_MEDIUMARMORMASTER",
    "type": "Feat",
    "name": "Medium Armor Master",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: Proficiency with medium armor You have practiced moving in medium armor to gain the following benefits: Wearing medium armor doesn’t impose disadvantage on your Dexterity (Stealth) checks. When you wear medium armor, you can add 3, rather than 2, to your AC if you have a Dexterity of 16 or higher.",
    "rules": [
      {
        "kind": "stat",
        "name": "ac:armored:dexterity:cap",
        "value": "3",
        "bonus": "base"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: Proficiency with medium armor</i></p>\n\t\t\t<p>You have practiced moving in medium armor to gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Wearing medium armor doesn’t impose disadvantage on your Dexterity (Stealth) checks.</li>\n\t\t\t\t<li>When you wear medium armor, you can add 3, rather than 2, to your AC if you have a Dexterity of 16 or higher.</li>\n\t\t\t</ul>",
    "prerequisite": "Proficiency with medium armor",
    "requirements": "ID_PROFICIENCY_ARMOR_PROFICIENCY_MEDIUM_ARMOR"
  },
  {
    "id": "ID_PHB_FEAT_MOBILE",
    "type": "Feat",
    "name": "Mobile",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You are exceptionally speedy and agile. You gain the following benefits: Your speed increases by 10 feet. When you use the Dash action, difficult terrain doesn’t cost you extra movement on that turn. When you make a melee attack against a creature, you don’t provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not.",
    "rules": [
      {
        "kind": "stat",
        "name": "innate speed:misc",
        "value": "10"
      },
      {
        "kind": "stat",
        "name": "innate speed:climb:misc",
        "value": "10",
        "requirements": "[innate speed:climb:1]"
      },
      {
        "kind": "stat",
        "name": "innate speed:fly:misc",
        "value": "10",
        "requirements": "[innate speed:fly:1]"
      },
      {
        "kind": "stat",
        "name": "innate speed:swim:misc",
        "value": "10",
        "requirements": "[innate speed:swim:1]"
      },
      {
        "kind": "stat",
        "name": "innate speed:burrow:misc",
        "value": "10",
        "requirements": "[innate speed:burrow:1]"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You are exceptionally speedy and agile. You gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Your speed increases by 10 feet.</li>\n\t\t\t\t<li>When you use the Dash action, difficult terrain doesn’t cost you extra movement on that turn.</li>\n\t\t\t\t<li>When you make a melee attack against a creature, you don’t provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_MODERATELYARMORED",
    "type": "Feat",
    "name": "Moderately Armored",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: Proficiency with light armor You have trained to master the use of medium armor and shields, gaining the following benefits: Increase your Strength or Dexterity score by 1, to a maximum of 20. You gain proficiency with medium armor and shields.",
    "rules": [
      {
        "kind": "select",
        "type": "Ability Score Improvement",
        "name": "Ability Score Increase (Moderately Armored)",
        "supports": "ID_PHB_FEAT_ASI_STRENGTH|ID_PHB_FEAT_ASI_DEXTERITY"
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_ARMOR_PROFICIENCY_MEDIUM_ARMOR"
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_ARMOR_PROFICIENCY_SHIELDS"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: Proficiency with light armor</i></p>\n\t\t\t<p>You have trained to master the use of medium armor and shields, gaining the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>You gain proficiency with medium armor and shields.</li>\n\t\t\t</ul>",
    "prerequisite": "Proficiency with light armor",
    "requirements": "ID_PROFICIENCY_ARMOR_PROFICIENCY_LIGHT_ARMOR"
  },
  {
    "id": "ID_PHB_FEAT_MOUNTEDCOMBATANT",
    "type": "Feat",
    "name": "Mounted Combatant",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You are a dangerous foe to face while mounted. While you are mounted and aren’t incapacitated, you gain the following benefits: You have advantage on melee attack rolls against any unmounted creature that is smaller than your mount. You can force an attack targeted at your mount to target you instead. If your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>You are a dangerous foe to face while mounted. While you are mounted and aren’t incapacitated, you gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>You have advantage on melee attack rolls against any unmounted creature that is smaller than your mount.</li>\n\t\t\t\t<li>You can force an attack targeted at your mount to target you instead.</li>\n\t\t\t\t<li>If your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_OBSERVANT",
    "type": "Feat",
    "name": "Observant",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Quick to notice details of your environment, you gain the following benefits: Increase your Intelligence or Wisdom score by 1, to a maximum of 20. If you can see a creature’s mouth while it is speaking a language you understand, you can interpret what it’s saying by reading its lips. You have a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores.",
    "rules": [
      {
        "kind": "select",
        "type": "Ability Score Improvement",
        "name": "Ability Score Increase (Observant)",
        "supports": "ID_PHB_FEAT_ASI_INTELLIGENCE|ID_PHB_FEAT_ASI_WISDOM"
      },
      {
        "kind": "stat",
        "name": "perception:passive",
        "value": "5"
      },
      {
        "kind": "stat",
        "name": "investigation:passive",
        "value": "5"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Quick to notice details of your environment, you gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase your Intelligence or Wisdom score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>If you can see a creature’s mouth while it is speaking a language you understand, you can interpret what it’s saying by reading its lips.</li>\n\t\t\t\t<li>You have a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_POLEARMMASTER",
    "type": "Feat",
    "name": "Polearm Master",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You can keep your enemies at bay with reach weapons. You gain the following benefits: When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. The weapon’s damage die for this attack is a d4, and the attack deals bludgeoning damage. This attack uses the same ability modifier as the primary attack. While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter your reach.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>You can keep your enemies at bay with reach weapons. You gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. The weapon’s damage die for this attack is a d4, and the attack deals bludgeoning damage. This attack uses the same ability modifier as the primary attack. </li>\n\t\t\t\t<li>While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter your reach.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_RESILIENT",
    "type": "Feat",
    "name": "Resilient",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Choose one ability score. You gain the following benefits: Increase the chosen ability score by 1, to a maximum of 20. You gain proficiency in saving throws using the chosen ability.",
    "rules": [
      {
        "kind": "select",
        "type": "Feat Feature",
        "name": "Resilient (Feat)",
        "supports": "Resilient"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Choose one ability score. You gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase the chosen ability score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>You gain proficiency in saving throws using the chosen ability.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_RESILIENT_STRENGTH",
    "type": "Feat Feature",
    "name": "Resilient (Strength)",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Resilient"
    ],
    "description": "Your Strength increases by 1. You gain proficiency with Strength saving throws.",
    "rules": [
      {
        "kind": "stat",
        "name": "strength",
        "value": "1",
        "alt": "Resilient"
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SAVINGTHROW_STRENGTH"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Your Strength increases by 1.</p>\n\t\t\t<p>You gain proficiency with Strength saving throws.</p>"
  },
  {
    "id": "ID_PHB_FEAT_RESILIENT_DEXTERITY",
    "type": "Feat Feature",
    "name": "Resilient (Dexterity)",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Resilient"
    ],
    "description": "Your Dexterity increases by 1. You gain proficiency with Dexterity saving throws.",
    "rules": [
      {
        "kind": "stat",
        "name": "dexterity",
        "value": "1",
        "alt": "Resilient"
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SAVINGTHROW_DEXTERITY"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Your Dexterity increases by 1.</p>\n\t\t\t<p>You gain proficiency with Dexterity saving throws.</p>"
  },
  {
    "id": "ID_PHB_FEAT_RESILIENT_CONSTITUTION",
    "type": "Feat Feature",
    "name": "Resilient (Constitution)",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Resilient"
    ],
    "description": "Your Constitution increases by 1. You gain proficiency with Constitution saving throws.",
    "rules": [
      {
        "kind": "stat",
        "name": "constitution",
        "value": "1",
        "alt": "Resilient"
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SAVINGTHROW_CONSTITUTION"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Your Constitution increases by 1.</p>\n\t\t\t<p>You gain proficiency with Constitution saving throws.</p>"
  },
  {
    "id": "ID_PHB_FEAT_RESILIENT_INTELLIGENCE",
    "type": "Feat Feature",
    "name": "Resilient (Intelligence)",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Resilient"
    ],
    "description": "Your Intelligence increases by 1. You gain proficiency with Intelligence saving throws.",
    "rules": [
      {
        "kind": "stat",
        "name": "intelligence",
        "value": "1",
        "alt": "Resilient"
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SAVINGTHROW_INTELLIGENCE"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Your Intelligence increases by 1.</p>\n\t\t\t<p>You gain proficiency with Intelligence saving throws.</p>"
  },
  {
    "id": "ID_PHB_FEAT_RESILIENT_WISDOM",
    "type": "Feat Feature",
    "name": "Resilient (Wisdom)",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Resilient"
    ],
    "description": "Your Wisdom increases by 1. You gain proficiency with Wisdom saving throws.",
    "rules": [
      {
        "kind": "stat",
        "name": "wisdom",
        "value": "1",
        "alt": "Resilient"
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SAVINGTHROW_WISDOM"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Your Wisdom increases by 1.</p>\n\t\t\t<p>You gain proficiency with Wisdom saving throws.</p>"
  },
  {
    "id": "ID_PHB_FEAT_RESILIENT_CHARISMA",
    "type": "Feat Feature",
    "name": "Resilient (Charisma)",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Resilient"
    ],
    "description": "Your Charisma increases by 1. You gain proficiency with Charisma saving throws.",
    "rules": [
      {
        "kind": "stat",
        "name": "charisma",
        "value": "1",
        "alt": "Resilient"
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SAVINGTHROW_CHARISMA"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Your Charisma increases by 1.</p>\n\t\t\t<p>You gain proficiency with Charisma saving throws.</p>"
  },
  {
    "id": "ID_PHB_FEAT_RITUALCASTER",
    "type": "Feat",
    "name": "Ritual Caster",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: Intelligence or Wisdom 13 or higher You have learned a number of spells that you can cast as rituals. These spells are written in a ritual book, which you must have in hand while casting one of them. When you choose this feat, you acquire a ritual book holding two 1st-level spells of your choice. Choose one of the following classes: bard, cleric, druid, sorcerer, warlock, or wizard. You must choose your spells from that class’s spell list, and the spells you choose must have the ritual tag. The class you choose also determines your spellcasting ability for these spells: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; or Intelligence for wizard. If you come across a spell in written form, such as a magical spell scroll or a wizard’s spellbook, you might be able to add it to your ritual book. The spell must be on the spell list for the class you chose, the spell’s level can be no higher than half your level (rounded up), and it must have the ritual tag. The process of copying the spell into your ritual book takes 2 hours per level of the spell, and costs 50 gp per level. The cost represents material components you expend as you experiment with the spell to master it, as well as the fine inks you need to record it.",
    "rules": [
      {
        "kind": "select",
        "type": "Feat Feature",
        "name": "Ritual Caster",
        "supports": "Ritual Caster"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: Intelligence or Wisdom 13 or higher</i></p>\n\t\t\t<p>You have learned a number of spells that you can cast as rituals. These spells are written in a ritual book, which you must have in hand while casting one of them.</p>\n\t\t\t<p class=\"indent\">When you choose this feat, you acquire a ritual book holding two 1st-level spells of your choice. Choose one of the following classes: bard, cleric, druid, sorcerer, warlock, or wizard. You must choose your spells from that class’s spell list, and the spells you choose must have the ritual tag. The class you choose also determines your spellcasting ability for these spells: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; or Intelligence for wizard.</p>\n\t\t\t<p class=\"indent\">If you come across a spell in written form, such as a magical spell scroll or a wizard’s spellbook, you might be able to add it to your ritual book. The spell must be on the spell list for the class you chose, the spell’s level can be no higher than half your level (rounded up), and it must have the ritual tag. The process of copying the spell into your ritual book takes 2 hours per level of the spell, and costs 50 gp per level. The cost represents material components you expend as you experiment with the spell to master it, as well as the fine inks you need to record it.</p>",
    "prerequisite": "Intelligence or Wisdom 13 or higher",
    "requirements": "[int:13]||[wis:13]"
  },
  {
    "id": "ID_PHB_FEAT_RITUAL_CASTER_BARD",
    "type": "Feat Feature",
    "name": "Bard",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Ritual Caster"
    ],
    "description": "You acquire a ritual book holding two 1st-level spells of your choice. Your spellcasting ability for these spells is charisma.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "1st-level Spell (Ritual Caster)",
        "supports": "Ritual,1,Bard",
        "number": 2
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You acquire a ritual book holding two 1st-level spells of your choice.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells is charisma.</p>"
  },
  {
    "id": "ID_PHB_FEAT_RITUAL_CASTER_CLERIC",
    "type": "Feat Feature",
    "name": "Cleric",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Ritual Caster"
    ],
    "description": "You acquire a ritual book holding two 1st-level spells of your choice. Your spellcasting ability for these spells is wisdom.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "1st-level Spell (Ritual Caster)",
        "supports": "Ritual,1,Cleric",
        "number": 2
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You acquire a ritual book holding two 1st-level spells of your choice.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells is wisdom.</p>"
  },
  {
    "id": "ID_PHB_FEAT_RITUAL_CASTER_DRUID",
    "type": "Feat Feature",
    "name": "Druid",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Ritual Caster"
    ],
    "description": "You acquire a ritual book holding two 1st-level spells of your choice. Your spellcasting ability for these spells is wisdom.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "1st-level Spell (Ritual Caster)",
        "supports": "Ritual,1,Druid",
        "number": 2
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You acquire a ritual book holding two 1st-level spells of your choice.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells is wisdom.</p>"
  },
  {
    "id": "ID_PHB_FEAT_RITUAL_CASTER_SORCERER",
    "type": "Feat Feature",
    "name": "Sorcerer",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Ritual Caster"
    ],
    "description": "You acquire a ritual book holding two 1st-level spells of your choice. Your spellcasting ability for these spells is charisma.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "1st-level Spell (Ritual Caster)",
        "supports": "Ritual,1,Sorcerer",
        "number": 2
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You acquire a ritual book holding two 1st-level spells of your choice.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells is charisma.</p>"
  },
  {
    "id": "ID_PHB_FEAT_RITUAL_CASTER_WARLOCK",
    "type": "Feat Feature",
    "name": "Warlock",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Ritual Caster"
    ],
    "description": "You acquire a ritual book holding two 1st-level spells of your choice. Your spellcasting ability for these spells is charisma.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "1st-level Spell (Ritual Caster)",
        "supports": "Ritual,1,Warlock",
        "number": 2
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You acquire a ritual book holding two 1st-level spells of your choice.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells is charisma.</p>"
  },
  {
    "id": "ID_PHB_FEAT_RITUAL_CASTER_WIZARD",
    "type": "Feat Feature",
    "name": "Wizard",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Ritual Caster"
    ],
    "description": "You acquire a ritual book holding two 1st-level spells of your choice. Your spellcasting ability for these spells is intelligence.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "1st-level Spell (Ritual Caster)",
        "supports": "Ritual,1,Wizard",
        "number": 2
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You acquire a ritual book holding two 1st-level spells of your choice.</p>\n\t\t\t<p class=\"indent\">Your spellcasting ability for these spells is intelligence.</p>"
  },
  {
    "id": "ID_PHB_FEAT_SAVAGEATTACKER",
    "type": "Feat",
    "name": "Savage Attacker",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon's damage dice as use either total.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon's damage dice as use either total.</p>"
  },
  {
    "id": "ID_PHB_FEAT_SENTINEL",
    "type": "Feat",
    "name": "Sentinel",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You have mastered techniques to take advantage of every drop in any enemy’s guard, gaining the following benefits: When you hit a creature with an opportunity attack, the creature’s speed becomes 0 for the rest of the turn. Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach. When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn’t have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>You have mastered techniques to take advantage of every drop in any enemy’s guard, gaining the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>When you hit a creature with an opportunity attack, the creature’s speed becomes 0 for the rest of the turn.</li>\n\t\t\t\t<li>Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.</li>\n\t\t\t\t<li>When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn’t have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_SHARPSHOOTER",
    "type": "Feat",
    "name": "Sharpshooter",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You have mastered ranged weapons and can make shots that others find impossible. You gain the following benefits: Attacking at long range doesn’t impose disadvantage on your ranged weapon attack rolls. Your ranged weapon attacks ignore half cover and three-quarters cover. Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a - 5 penalty to the attack roll. If the attack hits, you add +10 to the attack’s damage.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>You have mastered ranged weapons and can make shots that others find impossible. You gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Attacking at long range doesn’t impose disadvantage on your ranged weapon attack rolls.</li>\n\t\t\t\t<li>Your ranged weapon attacks ignore half cover and three-quarters cover.</li>\n\t\t\t\t<li>Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a - 5 penalty to the attack roll. If the attack hits, you add +10 to the attack’s damage.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_SHIELDMASTER",
    "type": "Feat",
    "name": "Shield Master",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You use shields not just for protection but also for offense. You gain the following benefits while you are wielding a shield: If you take the Attack action on your turn, you can use a bonus action to try to shove a creature within 5 feet of you with your shield. If you aren’t incapacitated, you can add your shield’s AC bonus to any Dexterity saving throw you make against a spell or other harmful effect that targets only you. If you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can use your reaction to take no damage if you succeed on the saving throw, interposing your shield between yourself and the source of the effect.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p>You use shields not just for protection but also for offense. You gain the following benefits while you are wielding a shield:</p>\n\t\t\t<ul>\n\t\t\t\t<li>If you take the Attack action on your turn, you can use a bonus action to try to shove a creature within 5 feet of you with your shield.</li>\n\t\t\t\t<li>If you aren’t incapacitated, you can add your shield’s AC bonus to any Dexterity saving throw you make against a spell or other harmful effect that targets only you.</li>\n\t\t\t\t<li>If you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can use your reaction to take no damage if you succeed on the saving throw, interposing your shield between yourself and the source of the effect.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_SKILLED",
    "type": "Feat",
    "name": "Skilled",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You gain proficiency in any combination of three skills or tools of your choice.",
    "rules": [
      {
        "kind": "select",
        "type": "Proficiency",
        "name": "Skill Proficiency (Skilled)",
        "supports": "Skill||Tool",
        "number": 3
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You gain proficiency in any combination of three skills or tools of your choice.</p>"
  },
  {
    "id": "ID_PHB_FEAT_SKULKER",
    "type": "Feat",
    "name": "Skulker",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: Dexterity 13 or higher You are expert at slinking through shadows. You gain the following benefits: You can try to hide when you are lightly obscured from the creature from which you are hiding. When you are hidden from a creature and miss it with a ranged weapon attack, making the attack doesn’t reveal your position. Dim light doesn’t impose disadvantage on your Wisdom (Perception) checks relying on sight.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p class=\"flavor\">Prerequisite: Dexterity 13 or higher</p>\n\t\t\t<p>You are expert at slinking through shadows. You gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>You can try to hide when you are lightly obscured from the creature from which you are hiding.</li>\n\t\t\t\t<li>When you are hidden from a creature and miss it with a ranged weapon attack, making the attack doesn’t reveal your position.</li>\n\t\t\t\t<li>Dim light doesn’t impose disadvantage on your Wisdom (Perception) checks relying on sight.</li>\n\t\t\t</ul>",
    "prerequisite": "Dexterity 13 or higher",
    "requirements": "[dex:13]"
  },
  {
    "id": "ID_PHB_FEAT_SPELLSNIPER",
    "type": "Feat",
    "name": "Spell Sniper",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: The ability to cast at least one spell You have learned techniques to enhance your attacks with certain kinds of spells, gaining the following benefits: When you cast a spell that requires you to make an attack roll, the spell’s range is doubled. Your ranged spell attacks ignore half cover and three-quarters cover. You learn one cantrip that requires an attack roll. Choose the cantrip from the bard, cleric, druid, sorcerer, warlock, or wizard spell list. Your spellcasting ability for this cantrip depends on the spell list you chose from: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; or Intelligence for wizard.",
    "rules": [
      {
        "kind": "select",
        "type": "Spell",
        "name": "Spell Sniper",
        "supports": "0,(Bard||Cleric||Druid||Sorcerer||Warlock||Wizard)"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: The ability to cast at least one spell</i></p>\n\t\t\t<p>You have learned techniques to enhance your attacks with certain kinds of spells, gaining the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>When you cast a spell that requires you to make an attack roll, the spell’s range is doubled.</li>\n\t\t\t\t<li>Your ranged spell attacks ignore half cover and three-quarters cover.</li>\n\t\t\t\t<li>You learn one cantrip that requires an attack roll. Choose the cantrip from the bard, cleric, druid, sorcerer, warlock, or wizard spell list. Your spellcasting ability for this cantrip depends on the spell list you chose from: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; or Intelligence for wizard.</li>\n\t\t\t</ul>",
    "prerequisite": "The ability to cast at least one spell",
    "requirements": "[type:spell]"
  },
  {
    "id": "ID_PHB_FEAT_TAVERNBRAWLER",
    "type": "Feat",
    "name": "Tavern Brawler",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Accustomed to rough-and-tumble fighting using whatever weapons happen to be at hand, you gain the following benefits: Increase your Strength or Constitution score by 1, to a maximum of 20. You are proficient with improvised weapons. Your unarmed strike uses a d4 for damage. When you hit a creature with an unarmed strike or an improvised weapon on your turn, you can use a bonus action to attempt to grapple the target.",
    "rules": [
      {
        "kind": "select",
        "type": "Ability Score Improvement",
        "name": "Ability Score Increase (Tavern Brawler)",
        "supports": "ID_PHB_FEAT_ASI_STRENGTH|ID_PHB_FEAT_ASI_CONSTITUTION"
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>Accustomed to rough-and-tumble fighting using whatever weapons happen to be at hand, you gain the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase your Strength or Constitution score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>You are proficient with improvised weapons.</li>\n\t\t\t\t<li>Your unarmed strike uses a d4 for damage.</li>\n\t\t\t\t<li>When you hit a creature with an unarmed strike or an improvised weapon on your turn, you can use a bonus action to attempt to grapple the target.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_TOUGH",
    "type": "Feat",
    "name": "Tough",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Your hit points maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit points maximum increases by an additional 2 hit points.",
    "rules": [
      {
        "kind": "stat",
        "name": "tough:hp",
        "value": "level"
      },
      {
        "kind": "stat",
        "name": "tough:hp",
        "value": "level"
      },
      {
        "kind": "stat",
        "name": "hp",
        "value": "tough:hp"
      }
    ],
    "setters": [
      {
        "name": "allow duplicate",
        "value": "true"
      }
    ],
    "descriptionHtml": "<p>Your hit points maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit points maximum increases by an additional 2 hit points.</p>"
  },
  {
    "id": "ID_PHB_FEAT_WARCASTER",
    "type": "Feat",
    "name": "War Caster",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "Prerequisite: The ability to cast at least one spell You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits: You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage. You can perform the somatic components of spells even when you have weapons or a shield in one or both hands. When a hostile creature’s movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack. The spell must have a casting time of 1 action and must target only that creature.",
    "rules": [],
    "setters": [],
    "descriptionHtml": "<p><i>Prerequisite: The ability to cast at least one spell</i></p>\n\t\t\t<p>You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage.</li>\n\t\t\t\t<li>You can perform the somatic components of spells even when you have weapons or a shield in one or both hands.</li>\n\t\t\t\t<li>When a hostile creature’s movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack. The spell must have a casting time of 1 action and must target only that creature.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_WEAPONMASTER",
    "type": "Feat",
    "name": "Weapon Master",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [],
    "description": "You have practiced extensively with a variety of weapons, gaining the following benefits: Increase your Strength or Dexterity score by 1, to a maximum of 20. You gain proficiency with four weapons of your choice. Each one must be a simple or a martial weapon.",
    "rules": [
      {
        "kind": "select",
        "type": "Ability Score Improvement",
        "name": "Ability Score Increase (Weapon Master)",
        "supports": "ID_PHB_FEAT_ASI_STRENGTH|ID_PHB_FEAT_ASI_DEXTERITY"
      },
      {
        "kind": "select",
        "type": "Proficiency",
        "name": "Weapon Master",
        "supports": "Weapon",
        "number": 4
      }
    ],
    "setters": [],
    "descriptionHtml": "<p>You have practiced extensively with a variety of weapons, gaining the following benefits:</p>\n\t\t\t<ul>\n\t\t\t\t<li>Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>\n\t\t\t\t<li>You gain proficiency with four weapons of your choice. Each one must be a simple or a martial weapon.</li>\n\t\t\t</ul>"
  },
  {
    "id": "ID_PHB_FEAT_ASI_STRENGTH",
    "type": "Ability Score Improvement",
    "name": "Ability Score Increase (Strength)",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Feat",
      "Athlete"
    ],
    "description": "Your Strength increases by 1.",
    "rules": [
      {
        "kind": "stat",
        "name": "strength",
        "value": "1",
        "alt": "Ability Score Increase"
      }
    ],
    "setters": [
      {
        "name": "allow duplicate",
        "value": "true"
      }
    ],
    "descriptionHtml": "<p>Your Strength increases by 1.</p>"
  },
  {
    "id": "ID_PHB_FEAT_ASI_DEXTERITY",
    "type": "Ability Score Improvement",
    "name": "Ability Score Increase (Dexterity)",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Feat",
      "Athlete"
    ],
    "description": "Your Dexterity increases by 1.",
    "rules": [
      {
        "kind": "stat",
        "name": "dexterity",
        "value": "1",
        "alt": "Ability Score Increase"
      }
    ],
    "setters": [
      {
        "name": "allow duplicate",
        "value": "true"
      }
    ],
    "descriptionHtml": "<p>Your Dexterity increases by 1.</p>"
  },
  {
    "id": "ID_PHB_FEAT_ASI_CONSTITUTION",
    "type": "Ability Score Improvement",
    "name": "Ability Score Increase (Constitution)",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Feat"
    ],
    "description": "Your Constitution increases by 1.",
    "rules": [
      {
        "kind": "stat",
        "name": "constitution",
        "value": "1",
        "alt": "Ability Score Increase"
      }
    ],
    "setters": [
      {
        "name": "allow duplicate",
        "value": "true"
      }
    ],
    "descriptionHtml": "<p>Your Constitution increases by 1.</p>"
  },
  {
    "id": "ID_PHB_FEAT_ASI_INTELLIGENCE",
    "type": "Ability Score Improvement",
    "name": "Ability Score Increase (Intelligence)",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Feat"
    ],
    "description": "Your Intelligence increases by 1.",
    "rules": [
      {
        "kind": "stat",
        "name": "intelligence",
        "value": "1",
        "alt": "Ability Score Increase"
      }
    ],
    "setters": [
      {
        "name": "allow duplicate",
        "value": "true"
      }
    ],
    "descriptionHtml": "<p>Your Intelligence increases by 1.</p>"
  },
  {
    "id": "ID_PHB_FEAT_ASI_WISDOM",
    "type": "Ability Score Improvement",
    "name": "Ability Score Increase (Wisdom)",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Feat"
    ],
    "description": "Your Wisdom increases by 1.",
    "rules": [
      {
        "kind": "stat",
        "name": "wisdom",
        "value": "1",
        "alt": "Ability Score Increase"
      }
    ],
    "setters": [
      {
        "name": "allow duplicate",
        "value": "true"
      }
    ],
    "descriptionHtml": "<p>Your Wisdom increases by 1.</p>"
  },
  {
    "id": "ID_PHB_FEAT_ASI_CHARISMA",
    "type": "Ability Score Improvement",
    "name": "Ability Score Increase (Charisma)",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/feats.xml",
    "supports": [
      "Feat"
    ],
    "description": "Your Charisma increases by 1.",
    "rules": [
      {
        "kind": "stat",
        "name": "charisma",
        "value": "1",
        "alt": "Ability Score Increase"
      }
    ],
    "setters": [
      {
        "name": "allow duplicate",
        "value": "true"
      }
    ],
    "descriptionHtml": "<p>Your Charisma increases by 1.</p>"
  }
] as const;
