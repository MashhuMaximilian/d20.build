import type { BuiltInSheet } from "@/lib/builtins/types";

export const BUILT_IN_SRD_SHEETS = {
  "ID_WOTC_PHB_CLASS_FIGHTER": {
    "display": false,
    "descriptions": [
      {
        "text": "A master of martial combat, skilled with a variety of weapons and armor.",
        "html": "A master of martial combat, skilled with a variety of weapons and armor."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SECONDWIND": {
    "action": "Bonus Action",
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "You regain 1d10+{{level:fighter}} hp.",
        "html": "You regain 1d10+{{level:fighter}} hp."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ACTIONSURGE": {
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "On your turn, you can take one additional action on top of your regular action.",
        "html": "On your turn, you can take one additional action on top of your regular action."
      },
      {
        "text": "On your turn, you can take one additional action on top of your regular action.",
        "html": "On your turn, you can take one additional action on top of your regular action.",
        "level": 17,
        "usage": "2/Short Rest"
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MARTIALARCHETYPE": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ABILITYSCOREIMPROVEMENT_FIGHTER": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_EXTRAATTACK": {
    "descriptions": [
      {
        "text": "You can attack twice, instead of once, whenever you take the Attack action on your turn",
        "html": "You can attack twice, instead of once, whenever you take the Attack action on your turn",
        "level": 5
      },
      {
        "text": "You can attack three times, instead of once, whenever you take the Attack action on your turn",
        "html": "You can attack three times, instead of once, whenever you take the Attack action on your turn",
        "level": 11
      },
      {
        "text": "You can attack four times, instead of once, whenever you take the Attack action on your turn",
        "html": "You can attack four times, instead of once, whenever you take the Attack action on your turn",
        "level": 20
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_INDOMITABLE": {
    "usage": "{{indomitable:usage}}/Long Rest",
    "descriptions": [
      {
        "text": "You can reroll a saving throw that you fail. If you do so, you must use the new roll.",
        "html": "You can reroll a saving throw that you fail. If you do so, you must use the new roll."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_FIGHTINGSTYLE_ARCHERY": {
    "descriptions": [
      {
        "text": "You gain a +2 bonus to attack rolls you make with ranged weapons.",
        "html": "You gain a +2 bonus to attack rolls you make with ranged weapons."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_FIGHTINGSTYLE_DEFENSE": {
    "descriptions": [
      {
        "text": "While you are wearing armor, you gain a +1 bonus to AC.",
        "html": "While you are wearing armor, you gain a +1 bonus to AC."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_FIGHTINGSTYLE_DUELING": {
    "descriptions": [
      {
        "text": "When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.",
        "html": "When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_FIGHTINGSTYLE_GREAT_WEAPON_FIGHTING": {
    "descriptions": [
      {
        "text": "When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit.",
        "html": "When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_FIGHTINGSTYLE_PROTECTION": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.",
        "html": "When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_FIGHTINGSTYLE_TWOWEAPON_FIGHTING": {
    "descriptions": [
      {
        "text": "When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.",
        "html": "When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_CHAMPION": {
    "display": false,
    "descriptions": [
      {
        "text": "The archetypal Champion focuses on the development of raw physical power honed to deadly perfection.",
        "html": "The archetypal Champion focuses on the development of raw physical power honed to deadly perfection."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_IMPROVEDCRITICAL": {
    "descriptions": [
      {
        "text": "Your weapon attacks score a critical hit on a roll of 19 or 20.",
        "html": "Your weapon attacks score a critical hit on a roll of 19 or 20."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_REMARKABLEATHLETE": {
    "descriptions": [
      {
        "text": "When you make a running long jump, the distance you can cover increases by {{strength:modifier}} feet.",
        "html": "When you make a running long jump, the distance you can cover increases by {{strength:modifier}} feet."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ADDITIONALFIGHTINGSTYLE": {
    "descriptions": [
      {
        "text": "You adopt a second style of fighting as your specialty.",
        "html": "You adopt a second style of fighting as your specialty."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_SUPERIORCRITICAL": {
    "descriptions": [
      {
        "text": "Your weapon attacks score a critical hit on a roll of 18–20.",
        "html": "Your weapon attacks score a critical hit on a roll of 18–20."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_SURVIVOR": {
    "descriptions": [
      {
        "text": "At the start of each of your turns, you regain {{survivor:hp}} hp if you have no more than half of your hp left. You don’t gain this benefit if you have 0 hp.",
        "html": "At the start of each of your turns, you regain {{survivor:hp}} hp if you have no more than half of your hp left. You don’t gain this benefit if you have 0 hp."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FIGHTER_BATTLE_MASTER": {
    "display": false,
    "descriptions": [
      {
        "text": "Those who emulate the archetypal Battle Master employ martial techniques passed down through generations.",
        "html": "Those who emulate the archetypal Battle Master employ martial techniques passed down through generations."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BATTLE_MASTER_COMBAT_SUPERIORITY": {
    "descriptions": [
      {
        "text": "You learn maneuvers that are fueled by special dice called superiority dice. You have {{superiority dice:amount}} superiority dice which are d{{superiority dice:size}}s. DC {{superiority dice:dc}}",
        "html": "You learn maneuvers that are fueled by special dice called superiority dice. You have {{superiority dice:amount}} superiority dice which are d{{superiority dice:size}}s. DC {{superiority dice:dc}}"
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BATTLE_MASTER_STUDENT_OF_WAR": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BATTLE_MASTER_KNOW_YOUR_ENEMY": {
    "descriptions": [
      {
        "text": "Spend at least 1 minute observing or interacting with another creature outside combat, you can learn certain information about its capabilities compared to your own.",
        "html": "Spend at least 1 minute observing or interacting with another creature outside combat, you can learn certain information about its capabilities compared to your own."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BATTLE_MASTER_IMPROVED_COMBAT_SUPERIORITY": {
    "display": false,
    "descriptions": [
      {
        "text": "Your superiority dice turn into d10s.",
        "html": "Your superiority dice turn into d10s."
      },
      {
        "text": "Your superiority dice turn into d12s.",
        "html": "Your superiority dice turn into d12s.",
        "level": 18
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BATTLE_MASTER_RELENTLESS": {
    "descriptions": [
      {
        "text": "When you roll initiative and have no superiority dice remaining, you regain 1 superiority die.",
        "html": "When you roll initiative and have no superiority dice remaining, you regain 1 superiority die."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_COMMANDERS_STRIKE": {
    "descriptions": [
      {
        "text": "When you take the Attack action on your turn, you can forgo one of your attacks and use a bonus action to direct one of your companions to strike. When you do so, choose a friendly creature who can see or hear you and expend one superiority die. That creature can immediately use its reaction to make one weapon attack, adding the superiority die to the attack’s damage roll.",
        "html": "When you take the Attack action on your turn, you can forgo one of your attacks and use a bonus action to direct one of your companions to strike. When you do so, choose a friendly creature who can see or hear you and expend one superiority die. That creature can immediately use its reaction to make one weapon attack, adding the superiority die to the attack’s damage roll."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_DISARMING_ATTACK": {
    "descriptions": [
      {
        "text": "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to disarm the target, forcing it to drop one item of your choice that it’s holding. You add the superiority die to the attack’s damage roll, and the target must make a Strength saving throw. On a failed save, it drops the object you choose. The object lands at its feet.",
        "html": "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to disarm the target, forcing it to drop one item of your choice that it’s holding. You add the superiority die to the attack’s damage roll, and the target must make a Strength saving throw. On a failed save, it drops the object you choose. The object lands at its feet."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_DISTRACTING_STRIKE": {
    "descriptions": [
      {
        "text": "When you hit a creature with a weapon attack, you can expend one superiority die to distract the creature, giving your allies an opening. You add the superiority die to the attack’s damage roll. The next attack roll against the target by an attacker other than you has advantage if the attack is made before the start of your next turn.",
        "html": "When you hit a creature with a weapon attack, you can expend one superiority die to distract the creature, giving your allies an opening. You add the superiority die to the attack’s damage roll. The next attack roll against the target by an attacker other than you has advantage if the attack is made before the start of your next turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_EVASIVE_FOOTWORK": {
    "descriptions": [
      {
        "text": "When you move, you can expend one superiority die, rolling the die and adding the number rolled to your AC until you stop moving.",
        "html": "When you move, you can expend one superiority die, rolling the die and adding the number rolled to your AC until you stop moving."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_FEINTING_ATTACK": {
    "descriptions": [
      {
        "text": "You can expend one superiority die and use a bonus action on your turn to feint, choosing one creature within 5 feet of you as your target. You have advantage on your next attack roll against that creature this turn. If that attack hits, add the superiority die to the attack’s damage roll.",
        "html": "You can expend one superiority die and use a bonus action on your turn to feint, choosing one creature within 5 feet of you as your target. You have advantage on your next attack roll against that creature this turn. If that attack hits, add the superiority die to the attack’s damage roll."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_GOADING_ATTACK": {
    "descriptions": [
      {
        "text": "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to goad the target into attacking you. You add the superiority die to the attack’s damage roll, and the target must make a Wisdom saving throw. On a failed save, the target has disadvantage on all attack rolls against targets other than you until the end of your next turn.",
        "html": "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to goad the target into attacking you. You add the superiority die to the attack’s damage roll, and the target must make a Wisdom saving throw. On a failed save, the target has disadvantage on all attack rolls against targets other than you until the end of your next turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_LUNGING_ATTACK": {
    "descriptions": [
      {
        "text": "When you make a melee weapon attack on your turn, you can expend one superiority die to increase your reach for that attack by 5 feet. If you hit, you add the superiority die to the attack’s damage roll.",
        "html": "When you make a melee weapon attack on your turn, you can expend one superiority die to increase your reach for that attack by 5 feet. If you hit, you add the superiority die to the attack’s damage roll."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_MANEUVERING_ATTACK": {
    "descriptions": [
      {
        "text": "When you hit a creature with a weapon attack, you can expend one superiority die to maneuver one of your comrades into a more advantageous position. You add the superiority die to the attack’s damage roll, and you choose a friendly creature who can see or hear you. That creature can use its reaction to move up to half its speed without provoking opportunity attacks from the target of your attack.",
        "html": "When you hit a creature with a weapon attack, you can expend one superiority die to maneuver one of your comrades into a more advantageous position. You add the superiority die to the attack’s damage roll, and you choose a friendly creature who can see or hear you. That creature can use its reaction to move up to half its speed without provoking opportunity attacks from the target of your attack."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_MENACING_ATTACK": {
    "descriptions": [
      {
        "text": "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to frighten the target. You add the superiority die to the attack’s damage roll, and the target must make a Wisdom saving throw. On a failed save, it is frightened of you until the end of your next turn.",
        "html": "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to frighten the target. You add the superiority die to the attack’s damage roll, and the target must make a Wisdom saving throw. On a failed save, it is frightened of you until the end of your next turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_PARRY": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When another creature damages you with a melee attack, you can expend one superiority die to reduce the damage by the number you roll on your superiority die + {{dexterity:modifier}}.",
        "html": "When another creature damages you with a melee attack, you can expend one superiority die to reduce the damage by the number you roll on your superiority die + {{dexterity:modifier}}."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_PRECISION_ATTACK": {
    "descriptions": [
      {
        "text": "When you make a weapon attack roll against a creature, you can expend one superiority die to add it to the roll. You can use this maneuver before or after making the attack roll, but before any effects of the attack are applied.",
        "html": "When you make a weapon attack roll against a creature, you can expend one superiority die to add it to the roll. You can use this maneuver before or after making the attack roll, but before any effects of the attack are applied."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_PUSHING_ATTACK": {
    "descriptions": [
      {
        "text": "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to drive the target back. You add the superiority die to the attack's damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, you push the target up to 15 feet away from you.",
        "html": "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to drive the target back. You add the superiority die to the attack's damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, you push the target up to 15 feet away from you."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_RALLY": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "On your turn, you can expend one superiority die. When you do so, choose a friendly creature who can see or hear you. That creature gains temporary hp equal to the superiority die roll + {{charisma:modifier}}.",
        "html": "On your turn, you can expend one superiority die. When you do so, choose a friendly creature who can see or hear you. That creature gains temporary hp equal to the superiority die roll + {{charisma:modifier}}."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_RIPOSTE": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When a creature misses you with a melee attack, you can expend one superiority die to make a melee weapon attack against the creature. If you hit, you add the superiority die to the attack's damage roll.",
        "html": "When a creature misses you with a melee attack, you can expend one superiority die to make a melee weapon attack against the creature. If you hit, you add the superiority die to the attack's damage roll."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_SWEEPING_ATTACK": {
    "descriptions": [
      {
        "text": "When you hit a creature with a melee weapon attack, you can expend one superiority die to attempt to damage another creature with the same attack. Choose another creature within 5 feet of the original target and within your reach. If the original attack roll would hit the second creature, it takes damage equal to the number you roll on your superiority die. The damage is of the same type dealt by the original attack.",
        "html": "When you hit a creature with a melee weapon attack, you can expend one superiority die to attempt to damage another creature with the same attack. Choose another creature within 5 feet of the original target and within your reach. If the original attack roll would hit the second creature, it takes damage equal to the number you roll on your superiority die. The damage is of the same type dealt by the original attack."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_MANEUVER_TRIP_ATTACK": {
    "descriptions": [
      {
        "text": "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to knock the target down. You add the superiority die to the attack’s damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, you knock the target prone.",
        "html": "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to knock the target down. You add the superiority die to the attack’s damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, you knock the target prone."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FIGHTER_ELDRITCH_KNIGHT": {
    "display": false,
    "descriptions": [
      {
        "text": "The archetypal Eldritch Knight combines the martial mastery common to all fighters with a careful study of magic.",
        "html": "The archetypal Eldritch Knight combines the martial mastery common to all fighters with a careful study of magic."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELDRITCH_KNIGHT_SPELLCASTING": {
    "display": false,
    "descriptions": [
      {
        "text": "You augment your martial prowess with the ability to cast spells.",
        "html": "You augment your martial prowess with the ability to cast spells."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELDRITCH_KNIGHT_WEAPON_BOND": {
    "descriptions": [
      {
        "text": "You perform a ritual over the course of 1 hour, which can be done during a short rest. The weapon must be within your reach throughout the ritual, at the conclusion of which you touch the weapon and forge the bond. Once you have bonded a weapon to yourself, you can’t be disarmed of that weapon unless you are incapacitated. If it is on the same plane of existence, you can summon that weapon as a bonus action on your turn, causing it to teleport instantly to your hand. You can have up to two bonded weapons, but can summon only one at a time with your bonus action. If you attempt to bond with a third weapon, you must break the bond with one of the other two.",
        "html": "You perform a ritual over the course of 1 hour, which can be done during a short rest. The weapon must be within your reach throughout the ritual, at the conclusion of which you touch the weapon and forge the bond.\n\t\t\tOnce you have bonded a weapon to yourself, you can’t be disarmed of that weapon unless you are incapacitated. If it is on the same plane of existence, you can summon that weapon as a bonus action on your turn, causing it to teleport instantly to your hand.\n\t\t\tYou can have up to two bonded weapons, but can summon only one at a time with your bonus action. If you attempt to bond with a third weapon, you must break the bond with one of the other two."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELDRITCH_KNIGHT_WAR_MAGIC": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "When you use your action to cast a cantrip, you can make one weapon attack.",
        "html": "When you use your action to cast a cantrip, you can make one weapon attack."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELDRITCH_KNIGHT_ELDRITCH_STRIKE": {
    "descriptions": [
      {
        "text": "When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.",
        "html": "When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELDRITCH_KNIGHT_ARCANE_CHARGE": {
    "descriptions": [
      {
        "text": "You can teleport up to 30 feet to an unoccupied space you can see when you use your Action Surge. You can teleport before or after the additional action.",
        "html": "You can teleport up to 30 feet to an unoccupied space you can see when you use your Action Surge. You can teleport before or after the additional action."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELDRITCH_KNIGHT_IMPROVED_WAR_MAGIC": {
    "descriptions": [
      {
        "text": "When you use your action to cast a spell, you can make one weapon attack as a bonus action.",
        "html": "When you use your action to cast a spell, you can make one weapon attack as a bonus action."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_SORCERER": {
    "display": false,
    "descriptions": [
      {
        "text": "A spellcaster who draws on inherent magic from a gift or bloodline.",
        "html": "A spellcaster who draws on inherent magic from a gift or bloodline."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_SPELLCASTING_SORCERER": {
    "display": false,
    "descriptions": [
      {
        "text": "You have the ability to cast spells.",
        "html": "You have the ability to cast spells."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_SORCEROUS_ORIGIN": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_FONT_OF_MAGIC": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "You have {{sorcery-points}} Sorcery Points. You can transform unexpended sorcery points into one spell slot (2 > 1st, 3 > 2nd, 5 > 3rd, 6 > 4th, 7 > 5th) on your turn or you can expend one spell slot and gain a number of sorcery points equal to the slot’s level.",
        "html": "You have {{sorcery-points}} Sorcery Points. You can transform unexpended sorcery points into one spell slot (2 > 1st, 3 > 2nd, 5 > 3rd, 6 > 4th, 7 > 5th) on your turn or you can expend one spell slot and gain a number of sorcery points equal to the slot’s level."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_METAMAGIC": {
    "descriptions": [
      {
        "text": "You can use only one Metamagic option on a spell when you cast it, unless otherwise noted.",
        "html": "You can use only one Metamagic option on a spell when you cast it, unless otherwise noted."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_ABILITY_SCORE_IMPROVEMENT_SORCERER": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_SORCEROUS_RESTORATION": {
    "descriptions": [
      {
        "text": "You regain 4 expended sorcery points whenever you finish a short rest.",
        "html": "You regain 4 expended sorcery points whenever you finish a short rest."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_METAMAGIC_CAREFUL_SPELL": {
    "descriptions": [
      {
        "text": "When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell’s full force. To do so, you spend 1 sorcery point and choose up to {{metamagic careful spell:creatures}} of those creatures. A chosen creature automatically succeeds on its saving throw against the spell.",
        "html": "When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell’s full force. To do so, you spend 1 sorcery point and choose up to {{metamagic careful spell:creatures}} of those creatures. A chosen creature automatically succeeds on its saving throw against the spell."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_METAMAGIC_DISTANT_SPELL": {
    "descriptions": [
      {
        "text": "When you cast a spell that has a range of 5 feet or greater, you can spend 1 sorcery point to double the range of the spell. When you cast a spell that has a range of touch, you can spend 1 sorcery point to make the range of the spell 30 feet.",
        "html": "When you cast a spell that has a range of 5 feet or greater, you can spend 1 sorcery point to double the range of the spell. When you cast a spell that has a range of touch, you can spend 1 sorcery point to make the range of the spell 30 feet."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_METAMAGIC_EMPOWERED_SPELL": {
    "descriptions": [
      {
        "text": "When you roll damage for a spell, you can spend 1 sorcery point to reroll {{metamagic empowered spell:rerolls}} damage dice. You must use the new rolls. You can use Empowered Spell even if you have already used a different Metamagic option during the casting of the spell.",
        "html": "When you roll damage for a spell, you can spend 1 sorcery point to reroll {{metamagic empowered spell:rerolls}} damage dice. You must use the new rolls. You can use Empowered Spell even if you have already used a different Metamagic option during the casting of the spell."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_METAMAGIC_EXTENDED_SPELL": {
    "descriptions": [
      {
        "text": "When you cast a spell that has a duration of 1 minute or longer, you can spend 1 sorcery point to double its duration, to a maximum duration of 24 hours.",
        "html": "When you cast a spell that has a duration of 1 minute or longer, you can spend 1 sorcery point to double its duration, to a maximum duration of 24 hours."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_METAMAGIC_HEIGHTENED_SPELL": {
    "descriptions": [
      {
        "text": "When you cast a spell that forces a creature to make a saving throw to resist its effects, you can spend 3 sorcery points to give one target of the spell disadvantage on its first saving throw made against the spell.",
        "html": "When you cast a spell that forces a creature to make a saving throw to resist its effects, you can spend 3 sorcery points to give one target of the spell disadvantage on its first saving throw made against the spell."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_METAMAGIC_QUICKEND_SPELL": {
    "descriptions": [
      {
        "text": "When you cast a spell that has a casting time of 1 action, you can spend 2 sorcery points to change the casting time to 1 bonus action for this casting.",
        "html": "When you cast a spell that has a casting time of 1 action, you can spend 2 sorcery points to change the casting time to 1 bonus action for this casting."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_METAMAGIC_SUBTLE_SPELL": {
    "descriptions": [
      {
        "text": "When you cast a spell, you can spend 1 sorcery point to cast it without any somatic or verbal components.",
        "html": "When you cast a spell, you can spend 1 sorcery point to cast it without any somatic or verbal components."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_METAMAGIC_TWINNED_SPELL": {
    "descriptions": [
      {
        "text": "When you cast a spell that targets only one creature and doesn’t have a range of self, you can spend a number of sorcery points equal to the spell’s level to target a second creature in range with the same spell (1 sorcery point if the spell is a cantrip).",
        "html": "When you cast a spell that targets only one creature and doesn’t have a range of self, you can spend a number of sorcery points equal to the spell’s level to target a second creature in range with the same spell (1 sorcery point if the spell is a cantrip)."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_DRACONIC_BLOODLINE": {
    "display": false,
    "descriptions": [
      {
        "text": "Your innate magic comes from draconic magic that was mingled with your blood or that of your ancestors.",
        "html": "Your innate magic comes from draconic magic that was mingled with your blood or that of your ancestors."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRAGON_ANCESTOR": {
    "descriptions": [
      {
        "text": "Whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check.",
        "html": "Whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRACONIC_RESILIENCE": {
    "descriptions": [
      {
        "text": "When you aren’t wearing armor, your AC equals {{ac:draconic resilience}}.",
        "html": "When you aren’t wearing armor, your AC equals {{ac:draconic resilience}}."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_AFFINITY": {
    "descriptions": [
      {
        "text": "When you cast a spell that deals {{dragon ancestor damage type}} damage, add {{charisma:modifier}} to one damage roll of that spell. At the same time, you can spend 1 sorcery point to gain {{dragon ancestor damage type}} resistance for 1 hour.",
        "html": "When you cast a spell that deals {{dragon ancestor damage type}} damage, add {{charisma:modifier}} to one damage roll of that spell. At the same time, you can spend 1 sorcery point to gain {{dragon ancestor damage type}} resistance for 1 hour."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRAGON_WINGS": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "Sprout a pair of dragon wings from your back, gaining a {{speed}} ft. flying speed. They last until you dismiss them as a bonus action on your turn.",
        "html": "Sprout a pair of dragon wings from your back, gaining a {{speed}} ft. flying speed. They last until you dismiss them as a bonus action on your turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRACONIC_PRESENCE": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can spend 5 sorcery points to draw on this power and exude an aura of awe or fear to a distance of 60 feet. For 1 minute or until you lose your concentration, each hostile creature that starts its turn in this aura must succeed on a Wisdom saving throw or be charmed or frightened until the aura ends. A creature that succeeds on this saving throw is immune to your aura for 24 hours.",
        "html": "You can spend 5 sorcery points to draw on this power and exude an aura of awe or fear to a distance of 60 feet. For 1 minute or until you lose your concentration, each hostile creature that starts its turn in this aura must succeed on a Wisdom saving throw or be charmed or frightened until the aura ends. A creature that succeeds on this saving throw is immune to your aura for 24 hours."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRAGON_ANCESTOR_BLACK": {
    "descriptions": [
      {
        "text": "The black dragon as your ancestor.",
        "html": "The black dragon as your ancestor."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRAGON_ANCESTOR_BLUE": {
    "descriptions": [
      {
        "text": "The blue dragon as your ancestor.",
        "html": "The blue dragon as your ancestor."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRAGON_ANCESTOR_BRASS": {
    "descriptions": [
      {
        "text": "The brass dragon as your ancestor.",
        "html": "The brass dragon as your ancestor."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRAGON_ANCESTOR_BRONZE": {
    "descriptions": [
      {
        "text": "The bronze dragon as your ancestor.",
        "html": "The bronze dragon as your ancestor."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRAGON_ANCESTOR_COPPER": {
    "descriptions": [
      {
        "text": "The copper dragon as your ancestor.",
        "html": "The copper dragon as your ancestor."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRAGON_ANCESTOR_GOLD": {
    "descriptions": [
      {
        "text": "The gold dragon as your ancestor.",
        "html": "The gold dragon as your ancestor."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRAGON_ANCESTOR_GREEN": {
    "descriptions": [
      {
        "text": "The green dragon as your ancestor.",
        "html": "The green dragon as your ancestor."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRAGON_ANCESTOR_RED": {
    "descriptions": [
      {
        "text": "The red dragon as your ancestor.",
        "html": "The red dragon as your ancestor."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRAGON_ANCESTOR_SILVER": {
    "descriptions": [
      {
        "text": "The silver dragon as your ancestor.",
        "html": "The silver dragon as your ancestor."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DRAGON_ANCESTOR_WHITE": {
    "descriptions": [
      {
        "text": "The white dragon as your ancestor.",
        "html": "The white dragon as your ancestor."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_WILD_MAGIC": {
    "display": false,
    "descriptions": [
      {
        "text": "Your innate magic comes from the wild forces of chaos that underlie the order of creation.",
        "html": "Your innate magic comes from the wild forces of chaos that underlie the order of creation."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WILD_MAGIC_SURGE": {
    "descriptions": [
      {
        "text": "Once per turn, the DM can have you roll a d20 immediately after you cast a sorcerer spell of 1st level or higher. If you roll a 1, roll on the Wild Magic Surge table to create a magical effect. If that effect is a spell, it is too wild to be affected by your Metamagic, and if it normally requires concentration, it doesn’t require concentration in this case; the spell lasts for its full duration.",
        "html": "Once per turn, the DM can have you roll a d20 immediately after you cast a sorcerer spell of 1st level or higher. If you roll a 1, roll on the Wild Magic Surge table to create a magical effect. If that effect is a spell, it is too wild to be affected by your Metamagic, and if it normally requires concentration, it doesn’t require concentration in this case; the spell lasts for its full duration."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_TIDES_OF_CHAOS": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You can gain advantage on one attack roll, ability check, or saving throw. Any time before you regain the use of this feature, the DM can have you roll on the Wild Magic Surge table immediately after you cast a sorcerer spell of 1st level or higher. You then regain the use of this feature.",
        "html": "You can gain advantage on one attack roll, ability check, or saving throw.\n\t\t\tAny time before you regain the use of this feature, the DM can have you roll on the Wild Magic Surge table immediately after you cast a sorcerer spell of 1st level or higher. You then regain the use of this feature."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BEND_LUCK": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When another creature you can see makes an attack roll, an ability check, or a saving throw, you can spend 2 sorcery points to roll 1d4 and apply the number rolled as a bonus or penalty to the creature’s roll. You can do so after the creature rolls but before any effects of the roll occur.",
        "html": "When another creature you can see makes an attack roll, an ability check, or a saving throw, you can spend 2 sorcery points to roll 1d4 and apply the number rolled as a bonus or penalty to the creature’s roll. You can do so after the creature rolls but before any effects of the roll occur."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CONTROLLED_CHAOS": {
    "descriptions": [
      {
        "text": "Whenever you roll on the Wild Magic Surge table, you can roll twice and use either number.",
        "html": "Whenever you roll on the Wild Magic Surge table, you can roll twice and use either number."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_SPELL_BOMBARDMENT": {
    "descriptions": [
      {
        "text": "When you roll damage for a spell and roll the highest number possible on any of the dice, choose one of those dice, roll it again and add that roll to the damage. You can use the feature only once per turn.",
        "html": "When you roll damage for a spell and roll the highest number possible on any of the dice, choose one of those dice, roll it again and add that roll to the damage. You can use the feature only once per turn."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_DRUID": {
    "display": false,
    "descriptions": [
      {
        "text": "A priest of the Old Faith, wielding the powers of nature—moonlight and plant growth, fire and lightning—and adopting animal forms.",
        "html": "A priest of the Old Faith, wielding the powers of nature—moonlight and plant growth, fire and lightning—and adopting animal forms."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_DRUID_DRUIDIC": {
    "descriptions": [
      {
        "text": "You can use it to leave hidden messages. You and others who know this language automatically spot such a message. Others spot the message’s presence with a successful DC 15 Perception check but can’t decipher it without magic.",
        "html": "You can use it to leave hidden messages. You and others who know this language automatically spot such a message. Others spot the message’s presence with a successful DC 15 Perception check but can’t decipher it without magic."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_DRUID_SPELLCASTING_DRUID": {
    "descriptions": [
      {
        "text": "You can cast druid spells as rituals. You can prepare {{druid:spellcasting:prepare}} spells from the druid spell list. You can use a druidic focus as your spellcasting focus.",
        "html": "You can cast druid spells as rituals. You can prepare {{druid:spellcasting:prepare}} spells from the druid spell list. You can use a druidic focus as your spellcasting focus."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_DRUID_WILDSHAPE": {
    "action": "Action",
    "usage": "2/Short Rest",
    "descriptions": [
      {
        "text": "You can magically assume the shape of a beast that you have seen before. You can stay in a beast shape for {{druid wildshape:hours}} hours. You then revert to your normal form unless you expend another use of this feature. You can revert to your normal form earlier by using a bonus action on your turn. You automatically revert if you fall unconscious, drop to 0 hit points, or die.",
        "html": "You can magically assume the shape of a beast that you have seen before.\n\t\t\tYou can stay in a beast shape for {{druid wildshape:hours}} hours. You then revert to your normal form unless you expend another use of this feature. You can revert to your normal form earlier by using a bonus action on your turn. You automatically revert if you fall unconscious, drop to 0 hit points, or die.",
        "level": 2
      },
      {
        "text": "You can magically assume the shape of a beast that you have seen before. You can stay in a beast shape for {{druid wildshape:hours}} hours. You then revert to your normal form unless you expend another use of this feature. You can revert to your normal form earlier by using a bonus action on your turn. You automatically revert if you fall unconscious, drop to 0 hit points, or die.",
        "html": "You can magically assume the shape of a beast that you have seen before.\n\t\t\tYou can stay in a beast shape for {{druid wildshape:hours}} hours. You then revert to your normal form unless you expend another use of this feature. You can revert to your normal form earlier by using a bonus action on your turn. You automatically revert if you fall unconscious, drop to 0 hit points, or die.",
        "level": 20,
        "usage": ""
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_DRUID_DRUID_CIRCLE": {
    "display": false,
    "descriptions": [
      {
        "text": "You choose to identify with a circle of druids.",
        "html": "You choose to identify with a circle of druids."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_DRUID_ABILITYSCOREIMPROVEMENT_DRUID": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_DRUID_TIMELESS_BODY": {
    "descriptions": [
      {
        "text": "For every 10 years that pass, your body ages only 1 year.",
        "html": "For every 10 years that pass, your body ages only 1 year."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_DRUID_BEAST_SPELLS": {
    "descriptions": [
      {
        "text": "You can cast many of your druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a druid spell while in a beast shape, but you aren’t able to provide material components.",
        "html": "You can cast many of your druid spells in any shape you assume using Wild Shape.\n\t\t\tYou can perform the somatic and verbal components of a druid spell while in a beast shape, but you aren’t able to provide material components."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_DRUID_ARCHDRUID": {
    "descriptions": [
      {
        "text": "You can use your Wild Shape an unlimited number of times.",
        "html": "You can use your Wild Shape an unlimited number of times."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_CIRCLEOFTHELAND": {
    "display": false,
    "descriptions": [
      {
        "text": "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition.",
        "html": "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_LAND_BONUS_CANTRIP": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_LAND_NATURAL_RECOVERY": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level of {{level:druid:half:up}}, and none of the slots can be 6th level or higher.",
        "html": "During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level of {{level:druid:half:up}}, and none of the slots can be 6th level or higher."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_LAND_CIRCLE_SPELLS": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_LAND_LANDS_STRIDE": {
    "descriptions": [
      {
        "text": "Moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard. You have advantage on saving throws against plants that are magically created or manipulated to impede movement, such those created by the entangle spell.",
        "html": "Moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard. \n\t\t\tYou have advantage on saving throws against plants that are magically created or manipulated to impede movement, such those created by the entangle spell."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_LAND_NATURES_WARD": {
    "descriptions": [
      {
        "text": "You can’t be charmed or frightened by elementals or fey, and you are immune to poison and disease.",
        "html": "You can’t be charmed or frightened by elementals or fey, and you are immune to poison and disease."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_LAND_NATURES_SANCTUARY": {
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_SPELLS_ARCTIC": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_SPELLS_COAST": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_SPELLS_DESERT": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_SPELLS_FOREST": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_SPELLS_GRASSLAND": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_SPELLS_SWAMP": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_CIRCLEOFTHEMOON": {
    "display": false,
    "descriptions": [
      {
        "text": "Druids of the Circle of the Moon are fierce guardians of the wilds.",
        "html": "Druids of the Circle of the Moon are fierce guardians of the wilds."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_MOON_COMBAT_WILD_SHAPE": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "Wild Shape on your turn as a bonus action, rather than as an action. While you are transformed by Wild Shape, you can use a bonus action to expend one spell slot to regain 1d8 hp per level of the spell slot expended.",
        "html": "Wild Shape on your turn as a bonus action, rather than as an action.\n\t\t\tWhile you are transformed by Wild Shape, you can use a bonus action to expend one spell slot to regain 1d8 hp per level of the spell slot expended."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_MOON_CIRCLE_FORMS": {
    "descriptions": [
      {
        "text": "You can use your Wild Shape to transform into a beast with a CR as high as {{circle forms:cr}}.",
        "html": "You can use your Wild Shape to transform into a beast with a CR as high as {{circle forms:cr}}."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_MOON_PRIMAL_STRIKE": {
    "descriptions": [
      {
        "text": "Your attacks in beast form count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage..",
        "html": "Your attacks in beast form count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_MOON_ELEMENTAL_WILD_SHAPE": {
    "descriptions": [
      {
        "text": "You can expend two uses of Wild Shape at the same time to transform into an air elemental, an earth elemental, a fire elemental, or a water elemental.",
        "html": "You can expend two uses of Wild Shape at the same time to transform into an air elemental, an earth elemental, a fire elemental, or a water elemental."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_CIRCLE_MOON_THOUSAND_FORMS": {
    "descriptions": [
      {
        "text": "You can cast the alter self spell at will.",
        "html": "You can cast the alter self spell at will."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_RANGER": {
    "display": false,
    "descriptions": [
      {
        "text": "A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization.",
        "html": "A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization."
      }
    ]
  },
  "ID_WOTC_CLASSFEATURE_RANGER_FAVORED_ENEMY": {
    "descriptions": [
      {
        "text": "You have advantage on Survival checks to track your favored enemies, as well as on Intelligence checks to recall information about them.",
        "html": "You have advantage on Survival checks to track your favored enemies, as well as on Intelligence checks to recall information about them."
      }
    ]
  },
  "ID_WOTC_CLASSFEATURE_RANGER_NATURAL_EXPLORER": {
    "descriptions": [
      {
        "text": "When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you’re proficient in. While traveling for an hour or more in your favored terrain, you gain the following benefits: Difficult terrain doesn’t slow your group’s travel. Your group can’t become lost except by magical means. Even when you are engaged in another activity while traveling, you remain alert to danger. If you are traveling alone, you can move stealthily at a normal pace. When you forage, you find twice as much food as you normally would. While tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area.",
        "html": "When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you’re proficient in. While traveling for an hour or more in your favored terrain, you gain the following benefits:\n\t\t\tDifficult terrain doesn’t slow your group’s travel.\n\t\t\tYour group can’t become lost except by magical means.\n\t\t\tEven when you are engaged in another activity while traveling, you remain alert to danger.\n\t\t\tIf you are traveling alone, you can move stealthily at a normal pace.\n\t\t\tWhen you forage, you find twice as much food as you normally would.\n\t\t\tWhile tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area."
      }
    ]
  },
  "ID_WOTC_CLASSFEATURE_RANGER_SPELLCASTING": {
    "display": false,
    "descriptions": [
      {
        "text": "You have learned to use the magical essence of nature to cast spells, much as a druid does.",
        "html": "You have learned to use the magical essence of nature to cast spells, much as a druid does."
      }
    ]
  },
  "ID_WOTC_CLASSFEATURE_RANGER_RANGER_ARCHETYPE": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_CLASSFEATURE_RANGER_PRIMEVAL_AWARENESS": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can expend one ranger spell slot to focus your awareness on the region around you. For 1 minute per level of the spell slot you expend, you can sense whether the following types of creatures are present within 1 mile of you (or within up to 6 miles if you are in your favored terrain): aberrations, celestials, dragons, elementals, fey, fiends, and undead. This feature doesn’t reveal the creatures’ location or number.",
        "html": "You can expend one ranger spell slot to focus your awareness on the region around you.\n\t\t\tFor 1 minute per level of the spell slot you expend, you can sense whether the following types of creatures are present within 1 mile of you (or within up to 6 miles if you are in your favored terrain): aberrations, celestials, dragons, elementals, fey, fiends, and undead. This feature doesn’t reveal the creatures’ location or number."
      }
    ]
  },
  "ID_WOTC_CLASSFEATURE_RANGER_ASI": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_CLASSFEATURE_RANGER_EXTRA_ATTACK": {
    "descriptions": [
      {
        "text": "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
        "html": "You can attack twice, instead of once, whenever you take the Attack action on your turn."
      }
    ]
  },
  "ID_WOTC_CLASSFEATURE_RANGER_LANDS_STRIDE": {
    "descriptions": [
      {
        "text": "Moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard. You have advantage on saving throws against plants that are magically created or manipulated to impede movement, such those created by the entangle spell.",
        "html": "Moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.\n\t\t\tYou have advantage on saving throws against plants that are magically created or manipulated to impede movement, such those created by the entangle spell."
      }
    ]
  },
  "ID_WOTC_CLASSFEATURE_RANGER_HIDE_IN_PLAIN_SIGHT": {
    "descriptions": [
      {
        "text": "You can spend 1 minute creating camouflage for yourself. You must have access to fresh mud, dirt, plants, soot, and other naturally occurring materials with which to create your camouflage. Once you are camouflaged in this way, you can try to hide by pressing yourself up against a solid surface, such as a tree or wall, that is at least as tall and wide as you are. You gain a +10 bonus to Stealth checks as long as you remain there without moving or taking actions. Once you move or take an action or a reaction, you must camouflage yourself again to gain this benefit.",
        "html": "You can spend 1 minute creating camouflage for yourself. You must have access to fresh mud, dirt, plants, soot, and other naturally occurring materials with which to create your camouflage.\n\t\t\tOnce you are camouflaged in this way, you can try to hide by pressing yourself up against a solid surface, such as a tree or wall, that is at least as tall and wide as you are. You gain a +10 bonus to Stealth checks as long as you remain there without moving or taking actions. Once you move or take an action or a reaction, you must camouflage yourself again to gain this benefit."
      }
    ]
  },
  "ID_WOTC_CLASSFEATURE_RANGER_VANISH": {
    "descriptions": [
      {
        "text": "You can use the Hide action as a bonus action on your turn. Also, you can’t be tracked by nonmagical means, unless you choose to leave a trail.",
        "html": "You can use the Hide action as a bonus action on your turn. Also, you can’t be tracked by nonmagical means, unless you choose to leave a trail."
      }
    ]
  },
  "ID_WOTC_CLASSFEATURE_RANGER_FERAL_SENSES": {
    "descriptions": [
      {
        "text": "When you attack a creature you can’t see, your inability to see it doesn’t impose disadvantage on your attack rolls against it. You are also aware of the location of any invisible creature within 30 feet of you, provided that the creature isn’t hidden from you and you aren’t blinded or deafened.",
        "html": "When you attack a creature you can’t see, your inability to see it doesn’t impose disadvantage on your attack rolls against it. \n\t\t\tYou are also aware of the location of any invisible creature within 30 feet of you, provided that the creature isn’t hidden from you and you aren’t blinded or deafened."
      }
    ]
  },
  "ID_WOTC_CLASSFEATURE_RANGER_FOE_SLAYER": {
    "descriptions": [
      {
        "text": "Once on each of your turns, you can add {{wisdom:modifier}} to the attack roll or the damage roll of an attack you make against one of your favored enemies. You can choose to use this feature before or after the roll, but before any effects of the roll are applied.",
        "html": "Once on each of your turns, you can add {{wisdom:modifier}} to the attack roll or the damage roll of an attack you make against one of your favored enemies. You can choose to use this feature before or after the roll, but before any effects of the roll are applied."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_RANGER_FAVORED_ENEMY_HUMANOIDS_1": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_RANGER_FAVORED_ENEMY_HUMANOIDS_2": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_RANGER_FAVORED_ENEMY_HUMANOIDS_3": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_ARCHETYPE_RANGER_HUNTER": {
    "display": false,
    "descriptions": [
      {
        "text": "Emulating the Hunter archetype means accepting your place as a bulwark between civilization and the terrors of the wilderness.",
        "html": "Emulating the Hunter archetype means accepting your place as a bulwark between civilization and the terrors of the wilderness."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_HUNTERS_PREY": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_DEFENSIVE_TACTICS": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_MULTIATTACK": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_SUPERIOR_HUNTERS_DEFENSE": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_HUNTERS_PREY_COLOSSUS_SLAYER": {
    "usage": "1/Turn",
    "descriptions": [
      {
        "text": "When you hit a creature with a weapon attack, the creature takes an extra 1d8 damage if it’s below its hp maximum.",
        "html": "When you hit a creature with a weapon attack, the creature takes an extra 1d8 damage if it’s below its hp maximum."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_HUNTERS_PREY_GIANT_KILLER": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When a Large or larger creature within 5 feet of you hits or misses you with an attack, you can use your reaction to attack that creature immediately after its attack, provided that you can see the creature.",
        "html": "When a Large or larger creature within 5 feet of you hits or misses you with an attack, you can use your reaction to attack that creature immediately after its attack, provided that you can see the creature."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_HUNTERS_PREY_HORDE_BREAKER": {
    "descriptions": [
      {
        "text": "Once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target and within range of your weapon.",
        "html": "Once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target and within range of your weapon."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_DEFENSIVE_TACTICS_ESCAPE_THE_HORDE": {
    "descriptions": [
      {
        "text": "Opportunity attacks against you are made with disadvantage.",
        "html": "Opportunity attacks against you are made with disadvantage."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_DEFENSIVE_TACTICS_MULTIATTACK_DEFENSE": {
    "descriptions": [
      {
        "text": "When a creature hits you with an attack, you gain a +4 bonus to AC against all subsequent attacks made by that creature for the rest of the turn.",
        "html": "When a creature hits you with an attack, you gain a +4 bonus to AC against all subsequent attacks made by that creature for the rest of the turn."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_DEFENSIVE_TACTICS_STEEL_WILL": {
    "descriptions": [
      {
        "text": "You have advantage on saving throws against being frightened.",
        "html": "You have advantage on saving throws against being frightened."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_MULTIATTACK_VOLLEY": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can make a ranged attack against any number of creatures within 10 feet of a point you can see within your weapon’s range. You must have ammunition for each target, as normal, and you make a separate attack roll for each target.",
        "html": "You can make a ranged attack against any number of creatures within 10 feet of a point you can see within your weapon’s range. You must have ammunition for each target, as normal, and you make a separate attack roll for each target."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_MULTIATTACK_WHIRLWIND_ATTACK": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can make a melee attack against any number of creatures within 5 feet of you, with a separate attack roll for each target.",
        "html": "You can make a melee attack against any number of creatures within 5 feet of you, with a separate attack roll for each target."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_SUPERIOR_HUNTERS_DEFENSE_EVASION": {
    "descriptions": [
      {
        "text": "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.",
        "html": "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_SUPERIOR_HUNTERS_DEFENSE_STAND_AGAINST_THE_TIDE": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When a hostile creature misses you with a melee attack, you can force that creature to repeat the same attack against another creature of your choice.",
        "html": "When a hostile creature misses you with a melee attack, you can force that creature to repeat the same attack against another creature of your choice."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_SUPERIOR_HUNTERS_DEFENSE_UNCANNY_DODGE": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When an attacker that you can see hits you with an attack, you can halve the attack’s damage against you.",
        "html": "When an attacker that you can see hits you with an attack, you can halve the attack’s damage against you."
      }
    ]
  },
  "ID_WOTC_ARCHETYPE_RANGER_BEAST_MASTER": {
    "display": false,
    "descriptions": [
      {
        "text": "The Beast Master archetype embodies a friendship between the civilized races and the beasts of the world.",
        "html": "The Beast Master archetype embodies a friendship between the civilized races and the beasts of the world."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_RANGERS_COMPANION": {
    "descriptions": [
      {
        "text": "The beast obeys your commands as best as it can. It takes its turn on your initiative, though it doesn’t take an action unless you command it to. On your turn, you can verbally command the beast where to move. You can use your action to verbally command it to take the Attack, Dash, Disengage, Dodge, or Help action. Once you have the Extra Attack feature, you can make one weapon attack yourself when you command the beast to take the Attack action. While traveling through your favored terrain with only the beast, you can move stealthily at a normal pace. If the beast dies, you can obtain another one by spending 8 hours magically bonding with another beast that isn’t hostile to you, either the same type of beast as before or a different one.",
        "html": "The beast obeys your commands as best as it can. It takes its turn on your initiative, though it doesn’t take an action unless you command it to. On your turn, you can verbally command the beast where to move. You can use your action to verbally command it to take the Attack, Dash, Disengage, Dodge, or Help action. Once you have the Extra Attack feature, you can make one weapon attack yourself when you command the beast to take the Attack action.\n\t\t\tWhile traveling through your favored terrain with only the beast, you can move stealthily at a normal pace.\n\t\t\tIf the beast dies, you can obtain another one by spending 8 hours magically bonding with another beast that isn’t hostile to you, either the same type of beast as before or a different one."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_EXCEPTIONAL_TRAINING": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "On any of your turns when your beast companion doesn’t attack, you can command the beast to take the Dash, Disengage, or Help action on its turn. The beast’s attacks now count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.",
        "html": "On any of your turns when your beast companion doesn’t attack, you can command the beast to take the Dash, Disengage, or Help action on its turn.\n\t\t\tThe beast’s attacks now count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_BESTIAL_FURY": {
    "descriptions": [
      {
        "text": "When you command your beast companion to take the Attack action, the beast can make two attacks, or it can take the Multiattack action if it has that action.",
        "html": "When you command your beast companion to take the Attack action, the beast can make two attacks, or it can take the Multiattack action if it has that action."
      }
    ]
  },
  "ID_WOTC_ARCHETYPEFEATURE_RANGER_SHARE_SPELLS": {
    "descriptions": [
      {
        "text": "When you cast a spell targeting yourself, you can also affect your beast companion with the spell if the beast is within 30 feet of you.",
        "html": "When you cast a spell targeting yourself, you can also affect your beast companion with the spell if the beast is within 30 feet of you."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_MONK": {
    "display": false,
    "descriptions": [
      {
        "text": "A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.",
        "html": "A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_UNARMORED_DEFENSE": {
    "descriptions": [
      {
        "text": "While you are wearing no armor and not wielding a shield, your AC equals {{ac:unarmored defense monk}}.",
        "html": "While you are wearing no armor and not wielding a shield, your AC equals {{ac:unarmored defense monk}}."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_MARTIAL_ARTS": {
    "descriptions": [
      {
        "text": "Your unarmed strike does 1d{{martial arts:dice}}+{{martial arts:damage}} damage. You can use Strength or Dexterity for these attacks. When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action. For example, if you take the Attack action and attack with a quarterstaff, you can also make an unarmed strike as a bonus action, assuming you haven’t already taken a bonus action this turn.",
        "html": "Your unarmed strike does 1d{{martial arts:dice}}+{{martial arts:damage}} damage. You can use Strength or Dexterity for these attacks.\n\t\t\tWhen you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action. For example, if you take the Attack action and attack with a quarterstaff, you can also make an unarmed strike as a bonus action, assuming you haven’t already taken a bonus action this turn."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_KI": {
    "descriptions": [
      {
        "text": "You have {{ki:points}} Ki Points and your Ki DC is {{ki:dc}}",
        "html": "You have {{ki:points}} Ki Points and your Ki DC is {{ki:dc}}"
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_KI_FLURRY_OF_BLOWS": {
    "action": "Bonus Action",
    "usage": "Ki",
    "descriptions": [
      {
        "text": "Immediately after you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes.",
        "html": "Immediately after you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_KI_PATIENT_DEFENSE": {
    "action": "Bonus Action",
    "usage": "Ki",
    "descriptions": [
      {
        "text": "You can spend 1 ki point to take the Dodge action on your turn.",
        "html": "You can spend 1 ki point to take the Dodge action on your turn."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_KI_STEP_OF_THE_WIND": {
    "action": "Bonus Action",
    "usage": "Ki",
    "descriptions": [
      {
        "text": "You can spend 1 ki point to take the Disengage or Dash action on your turn, and your jump distance is doubled for the turn.",
        "html": "You can spend 1 ki point to take the Disengage or Dash action on your turn, and your jump distance is doubled for the turn."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_UNARMORED_MOVEMENT": {
    "descriptions": [
      {
        "text": "Your speed increases by {{monk:unarmored movement}} feet while you are not wearing armor or wielding a shield.",
        "html": "Your speed increases by {{monk:unarmored movement}} feet while you are not wearing armor or wielding a shield."
      },
      {
        "text": "Your speed increases by {{monk:unarmored movement}} feet while you are not wearing armor or wielding a shield. You gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.",
        "html": "Your speed increases by {{monk:unarmored movement}} feet while you are not wearing armor or wielding a shield. You gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.",
        "level": 9
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_MONASTIC_TRADITION": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_DEFLECT_MISSILES": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "You can deflect or catch the missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by 1d10+{{monk:deflect missiles bonus}}. If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in one hand and you have at least one hand free. If you catch a missile in this way, you can spend 1 ki point to make a ranged attack with the weapon or piece of ammunition you just caught, as part of the same reaction. You make this attack with proficiency, regardless of your weapon proficiencies, and the missile counts as a monk weapon for the attack.",
        "html": "You can deflect or catch the missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by 1d10+{{monk:deflect missiles bonus}}.\n\t\t\tIf you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in one hand and you have at least one hand free. If you catch a missile in this way, you can spend 1 ki point to make a ranged attack with the weapon or piece of ammunition you just caught, as part of the same reaction. You make this attack with proficiency, regardless of your weapon proficiencies, and the missile counts as a monk weapon for the attack."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_ABILITYSCOREIMPROVEMENT_MONK": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_SLOW_FALL": {
    "usage": "Reaction",
    "descriptions": [
      {
        "text": "Reduce any falling damage you take by {{monk:slowfall}}.",
        "html": "Reduce any falling damage you take by {{monk:slowfall}}."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_EXTRA_ATTACK_MONK": {
    "descriptions": [
      {
        "text": "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
        "html": "You can attack twice, instead of once, whenever you take the Attack action on your turn."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_STUNNING_STRIKE": {
    "usage": "Ki",
    "descriptions": [
      {
        "text": "When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.",
        "html": "When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_KI_EMPOWERED_STRIKES": {
    "descriptions": [
      {
        "text": "Your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.",
        "html": "Your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_EVASION_MONK": {
    "descriptions": [
      {
        "text": "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.",
        "html": "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_STILLNESS_OF_MIND": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can end one effect on yourself that is causing you to be charmed or frightened.",
        "html": "You can end one effect on yourself that is causing you to be charmed or frightened."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_PURITY_OF_BODY": {
    "descriptions": [
      {
        "text": "Your mastery of the ki flowing through you makes you immune to disease and poison.",
        "html": "Your mastery of the ki flowing through you makes you immune to disease and poison."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_TONGUE_OF_THE_SUN_AND_MOON": {
    "descriptions": [
      {
        "text": "You learn to touch the ki of other minds so that you understand all spoken languages. Moreover, any creature that can understand a language can understand what you say.",
        "html": "You learn to touch the ki of other minds so that you understand all spoken languages. Moreover, any creature that can understand a language can understand what you say."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_DIAMOND_SOUL": {
    "usage": "Ki",
    "descriptions": [
      {
        "text": "Whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.",
        "html": "Whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_TIMELESS_BODY_MONK": {
    "descriptions": [
      {
        "text": "Your ki sustains you so that you suffer none of the frailty of old age, and you can’t be aged magically. You no longer need food or water.",
        "html": "Your ki sustains you so that you suffer none of the frailty of old age, and you can’t be aged magically.\n\t\t\tYou no longer need food or water."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_EMPTY_BODY": {
    "action": "Action",
    "usage": "Ki",
    "descriptions": [
      {
        "text": "You can spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage. You can spend 8 ki points to cast the astral projection spell, without needing material components. When you do so, you can’t take any other creatures with you.",
        "html": "You can spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage.\n\t\t\tYou can spend 8 ki points to cast the astral projection spell, without needing material components. When you do so, you can’t take any other creatures with you."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_MONK_PERFECT_SELF": {
    "descriptions": [
      {
        "text": "When you roll for initiative and have no ki points remaining, you regain 4 ki points.",
        "html": "When you roll for initiative and have no ki points remaining, you regain 4 ki points."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_WAY_OF_THE_OPEN_HAND": {
    "display": false,
    "descriptions": [
      {
        "text": "The ultimate masters of martial arts combat, whether armed or unarmed.",
        "html": "The ultimate masters of martial arts combat, whether armed or unarmed."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAYOFTHEOPENHAND_OPEN_HAND_TECHNIQUE": {
    "descriptions": [
      {
        "text": "Whenever you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects on that target: knock prone DEX Save, Push 15 feet STR Save, It can’t take reactions until the end of your next turn.",
        "html": "Whenever you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects on that target: knock prone DEX Save, Push 15 feet STR Save, It can’t take reactions until the end of your next turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAYOFTHEOPENHAND_WHOLENESS_OF_BODY": {
    "action": "Action",
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You can regain {{monk:wholeness of body}} hit points.",
        "html": "You can regain {{monk:wholeness of body}} hit points."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAYOFTHEOPENHAND_TRANQUILITY": {
    "descriptions": [
      {
        "text": "At the end of a long rest, you gain the effect of a sanctuary spell that lasts until the start of your next long rest (the spell can end early as normal). The saving throw DC for the spell equals {{tranquility:dc}}.",
        "html": "At the end of a long rest, you gain the effect of a sanctuary spell that lasts until the start of your next long rest (the spell can end early as normal). The saving throw DC for the spell equals {{tranquility:dc}}."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAYOFTHEOPENHAND_QUIVERING_PALM": {
    "descriptions": [
      {
        "text": "When you hit a creature with an unarmed strike, you can spend 3 ki points to start these imperceptible vibrations, which last for {{level:monk}} days. The vibrations are harmless unless you use your action to end them. To do so, you and the target must be on the same plane of existence. When you use this action, the creature must make a Constitution saving throw. If it fails, it is reduced to 0 hit points. If it succeeds, it takes 10d10 necrotic damage. You can have only one creature under the effect of this feature at a time. You can choose to end the vibrations harmlessly without using an action.",
        "html": "When you hit a creature with an unarmed strike, you can spend 3 ki points to start these imperceptible vibrations, which last for {{level:monk}} days. The vibrations are harmless unless you use your action to end them. To do so, you and the target must be on the same plane of existence. When you use this action, the creature must make a Constitution saving throw. If it fails, it is reduced to 0 hit points. If it succeeds, it takes 10d10 necrotic damage.\n\t\t\tYou can have only one creature under the effect of this feature at a time. You can choose to end the vibrations harmlessly without using an action."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_MONK_WAY_OF_SHADOW": {
    "display": false,
    "descriptions": [
      {
        "text": "Monks of the Way of Shadow follow a tradition that values stealth and subterfuge.",
        "html": "Monks of the Way of Shadow follow a tradition that values stealth and subterfuge."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAY_OF_SHADOW_SHADOW_ARTS": {
    "action": "Action",
    "usage": "Ki",
    "descriptions": [
      {
        "text": "You can spend 2 ki points to cast darkness, darkvision, pass without trace, or silence, without providing material components. Additionally, you gain the minor illusion cantrip if you don’t already know it.",
        "html": "You can spend 2 ki points to cast darkness, darkvision, pass without trace, or silence, without providing material components. Additionally, you gain the minor illusion cantrip if you don’t already know it."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAY_OF_SHADOW_SHADOW_STEP": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "When you are in dim light or darkness, you can teleport up to 60 feet to an unoccupied space you can see that is also in dim light or darkness. You then have advantage on the first melee attack you make before the end of the turn.",
        "html": "When you are in dim light or darkness, you can teleport up to 60 feet to an unoccupied space you can see that is also in dim light or darkness. You then have advantage on the first melee attack you make before the end of the turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAY_OF_SHADOW_CLOAK_OF_SHADOWS": {
    "action": "Action",
    "descriptions": [
      {
        "text": "When you are in an area of dim light or darkness, you can become invisible. You remain invisible until you make an attack, cast a spell, or are in an area of bright light.",
        "html": "When you are in an area of dim light or darkness, you can become invisible. You remain invisible until you make an attack, cast a spell, or are in an area of bright light."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAY_OF_SHADOW_OPPORTUNIST": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "Whenever a creature within 5 feet of you is hit by an attack made by a creature other than you, you can make a melee attack against that creature.",
        "html": "Whenever a creature within 5 feet of you is hit by an attack made by a creature other than you, you can make a melee attack against that creature."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_MONK_WAY_OF_THE_FOUR_ELEMENTS": {
    "display": false,
    "descriptions": [
      {
        "text": "You follow a monastic tradition that teaches you to harness the elements.",
        "html": "You follow a monastic tradition that teaches you to harness the elements."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAY_OF_THE_FOUR_ELEMENTS_DISCIPLE_OF_THE_ELEMENTS": {
    "usage": "Ki",
    "descriptions": [
      {
        "text": "You learn magical disciplines that harness the power of the four elements.",
        "html": "You learn magical disciplines that harness the power of the four elements."
      },
      {
        "text": "You can spend additional ki points (max 3) to increase the level of an elemental discipline spell that you cast. The spell’s level increases by 1 for each additional ki point you spend.",
        "html": "You can spend additional ki points (max 3) to increase the level of an elemental discipline spell that you cast. The spell’s level increases by 1 for each additional ki point you spend.",
        "level": 5
      },
      {
        "text": "You can spend additional ki points (max 4) to increase the level of an elemental discipline spell that you cast. The spell’s level increases by 1 for each additional ki point you spend.",
        "html": "You can spend additional ki points (max 4) to increase the level of an elemental discipline spell that you cast. The spell’s level increases by 1 for each additional ki point you spend.",
        "level": 9
      },
      {
        "text": "You can spend additional ki points (max 5) to increase the level of an elemental discipline spell that you cast. The spell’s level increases by 1 for each additional ki point you spend.",
        "html": "You can spend additional ki points (max 5) to increase the level of an elemental discipline spell that you cast. The spell’s level increases by 1 for each additional ki point you spend.",
        "level": 13
      },
      {
        "text": "You can spend additional ki points (max 6) to increase the level of an elemental discipline spell that you cast. The spell’s level increases by 1 for each additional ki point you spend.",
        "html": "You can spend additional ki points (max 6) to increase the level of an elemental discipline spell that you cast. The spell’s level increases by 1 for each additional ki point you spend.",
        "level": 17
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_ELEMENTAL_ATTUNEMENT": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can briefly control elemental forces within 30 feet of you.",
        "html": "You can briefly control elemental forces within 30 feet of you."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_BREATH_OF_WINTER": {
    "descriptions": [
      {
        "text": "You can spend 6 ki points to cast cone of cold.",
        "html": "You can spend 6 ki points to cast cone of cold."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_CLENCH_OF_THE_NORTH_WIND": {
    "descriptions": [
      {
        "text": "You can spend 3 ki points to cast hold person.",
        "html": "You can spend 3 ki points to cast hold person."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_ETERNAL_MOUNTAIN_DEFENSE": {
    "descriptions": [
      {
        "text": "You can spend 5 ki points to cast stoneskin, targeting yourself.",
        "html": "You can spend 5 ki points to cast stoneskin, targeting yourself."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_FANGS_OF_THE_FIRE_SNAKE": {
    "descriptions": [
      {
        "text": "When you use the Attack action on your turn, you can spend 1 ki point to cause tendrils of flame to stretch out from your fists and feet. Your reach with your unarmed strikes increases by 10 feet for that action, as well as the rest of the turn. A hit with such an attack deals fire damage instead of bludgeoning damage, and if you spend 1 ki point when the attack hits, it also deals an extra 1d10 fire damage.",
        "html": "When you use the Attack action on your turn, you can spend 1 ki point to cause tendrils of flame to stretch out from your fists and feet. Your reach with your unarmed strikes increases by 10 feet for that action, as well as the rest of the turn. A hit with such an attack deals fire damage instead of bludgeoning damage, and if you spend 1 ki point when the attack hits, it also deals an extra 1d10 fire damage."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_FIST_OF_FOUR_THUNDERS": {
    "descriptions": [
      {
        "text": "You can spend 2 ki points to cast thunderwave",
        "html": "You can spend 2 ki points to cast thunderwave"
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_FIST_OF_UNBROKEN_AIR": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can spend 2 ki points and choose a creature within 30 feet of you. That creature must make a Strength saving throw. On a failed save, the creature takes 3d10 bludgeoning damage, plus an extra 1d10 bludgeoning damage for each additional ki point you spend, and you can push the creature up to 20 feet away from you and knock it prone. On a successful save, the creature takes half as much damage, and you don’t push it or knock it prone.",
        "html": "You can spend 2 ki points and choose a creature within 30 feet of you. That creature must make a Strength saving throw. On a failed save, the creature takes 3d10 bludgeoning damage, plus an extra 1d10 bludgeoning damage for each additional ki point you spend, and you can push the creature up to 20 feet away from you and knock it prone. On a successful save, the creature takes half as much damage, and you don’t push it or knock it prone."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_FLAMES_OF_THE_PHOENIX": {
    "descriptions": [
      {
        "text": "You can spend 4 ki points to cast fireball.",
        "html": "You can spend 4 ki points to cast fireball."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_GONG_OF_THE_SUMMIT": {
    "descriptions": [
      {
        "text": "You can spend 3 ki points to cast shatter.",
        "html": "You can spend 3 ki points to cast shatter."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_MIST_STANCE": {
    "descriptions": [
      {
        "text": "You can spend 4 ki points to cast gaseous form, targeting yourself.",
        "html": "You can spend 4 ki points to cast gaseous form, targeting yourself."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_RIDE_THE_WIND": {
    "descriptions": [
      {
        "text": "You can spend 4 ki points to cast fly, targeting yourself.",
        "html": "You can spend 4 ki points to cast fly, targeting yourself."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_RIVER_OF_HUNGRY_FLAME": {
    "descriptions": [
      {
        "text": "You can spend 5 ki points to cast wall of fire.",
        "html": "You can spend 5 ki points to cast wall of fire."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_RUSH_OF_THE_GALE_SPIRITS": {
    "descriptions": [
      {
        "text": "You can spend 2 ki points to cast gust of wind.",
        "html": "You can spend 2 ki points to cast gust of wind."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_SHAPE_THE_FLOWING_RIVER": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can spend 1 ki point to shape an area of ice or water no larger than 30 feet on a side within 120 feet of you. You can’t shape the ice to trap or injure a creature in the area.",
        "html": "You can spend 1 ki point to shape an area of ice or water no larger than 30 feet on a side within 120 feet of you. You can’t shape the ice to trap or injure a creature in the area."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_SWEEPING_CINDER_STRIKE": {
    "descriptions": [
      {
        "text": "You can spend 2 ki points to cast burning hands.",
        "html": "You can spend 2 ki points to cast burning hands."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_WATER_WHIP": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can spend 2 ki points to create a whip of water that shoves and pulls a creature to unbalance it. A creature that you can see that is within 30 feet of you must make a Dexterity saving throw. On a failed save, the creature takes 3d10 bludgeoning damage, plus an extra 1d10 bludgeoning damage for each additional ki point you spend, and you can either knock it prone or pull it up to 25 feet closer to you. On a successful save, the creature takes half as much damage, and you don’t pull it or knock it prone.",
        "html": "You can spend 2 ki points to create a whip of water that shoves and pulls a creature to unbalance it. A creature that you can see that is within 30 feet of you must make a Dexterity saving throw. On a failed save, the creature takes 3d10 bludgeoning damage, plus an extra 1d10 bludgeoning damage for each additional ki point you spend, and you can either knock it prone or pull it up to 25 feet closer to you. On a successful save, the creature takes half as much damage, and you don’t pull it or knock it prone."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ELEMENTAL_DISCIPLINE_WAVE_OF_ROLLING_EARTH": {
    "descriptions": [
      {
        "text": "You can spend 6 ki points to cast wall of stone.",
        "html": "You can spend 6 ki points to cast wall of stone."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_PALADIN": {
    "display": false,
    "descriptions": [
      {
        "text": "A holy warrior bound to a sacred oath.",
        "html": "A holy warrior bound to a sacred oath."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_PALADIN_DIVINE_SENSE": {
    "action": "Action",
    "usage": "{{divine sense:count}}/Long Rest",
    "descriptions": [
      {
        "text": "You can open your awareness to detect presence of strong evil. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover. You know the type of any being whose presence you sense, but not its identity. Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated.",
        "html": "You can open your awareness to detect presence of strong evil. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover. You know the type of any being whose presence you sense, but not its identity. Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_PALADIN_LAY_ON_HANDS": {
    "action": "Action",
    "usage": "{{lay on hands:hp pool}}/Long Rest",
    "descriptions": [
      {
        "text": "You can touch a creature and draw power from the pool to restore a number of hp to that creature, up to the maximum amount remaining in your pool. You can expend 5 hp from your pool of healing to cure the target of one disease or neutralize one poison affecting it. This feature has no effect on undead and constructs.",
        "html": "You can touch a creature and draw power from the pool to restore a number of hp to that creature, up to the maximum amount remaining in your pool. \n\t\t\tYou can expend 5 hp from your pool of healing to cure the target of one disease or neutralize one poison affecting it.\n\t\t\tThis feature has no effect on undead and constructs."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_PALADIN_SPELLCASTING": {
    "display": false,
    "descriptions": [
      {
        "text": "You have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does.",
        "html": "You have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_PALADIN_DIVINE_SMITE": {
    "descriptions": [
      {
        "text": "When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon’s damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 6d8. The damage increases by 1d8 if the target is an undead or a fiend.",
        "html": "When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon’s damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 6d8. The damage increases by 1d8 if the target is an undead or a fiend."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_PALADIN_DIVINE_HEALTH": {
    "descriptions": [
      {
        "text": "The divine magic flowing through you makes you immune to disease.",
        "html": "The divine magic flowing through you makes you immune to disease."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_PALADIN_SACRED_OATH": {
    "display": false,
    "descriptions": [
      {
        "text": "Your oath allows you to channel divine energy to fuel magical effects.",
        "html": "Your oath allows you to channel divine energy to fuel magical effects."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_PALADIN_ASI": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_PALADIN_EXTRA_ATTACK": {
    "descriptions": [
      {
        "text": "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
        "html": "You can attack twice, instead of once, whenever you take the Attack action on your turn."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_PALADIN_AURA_OF_PROTECTION": {
    "descriptions": [
      {
        "text": "Whenever you or a friendly creature within {{aura of protection:range}} feet of you must make a saving throw, the creature gains a +{{aura of protection:save bonus}} bonus to the saving throw. You must be conscious to grant this bonus.",
        "html": "Whenever you or a friendly creature within {{aura of protection:range}} feet of you must make a saving throw, the creature gains a +{{aura of protection:save bonus}} bonus to the saving throw. You must be conscious to grant this bonus."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_PALADIN_AURA_OF_COURAGE": {
    "descriptions": [
      {
        "text": "You and friendly creatures within {{aura of courage:range}} feet of you can’t be frightened while you are conscious.",
        "html": "You and friendly creatures within {{aura of courage:range}} feet of you can’t be frightened while you are conscious."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_PALADIN_IMPROVED_DIVINE_SMITE": {
    "descriptions": [
      {
        "text": "Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage.",
        "html": "Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_PALADIN_CLEANSING_TOUCH": {
    "action": "Action",
    "usage": "{{cleansing touch:count}}/Long Rest",
    "descriptions": [
      {
        "text": "You can end one spell on yourself or on one willing creature that you touch.",
        "html": "You can end one spell on yourself or on one willing creature that you touch."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_PALADIN_OATH_OF_DEVOTION": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PALADIN_DEVOTION_OATH_SPELLS": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PALADIN_DEVOTION_CHANNEL_DIVINITY": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PALADIN_CHANNEL_DIVINITY_SACRED_WEAPON": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Sacred Weapon",
    "descriptions": [
      {
        "text": "For 1 minute, you add +{{charisma:modifier}} to attack rolls made with that weapon. The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration. You can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends.",
        "html": "For 1 minute, you add +{{charisma:modifier}} to attack rolls made with that weapon. The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration.\n\t\t\tYou can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PALADIN_CHANNEL_DIVINITY_TURN_THE_UNHOLY": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Turn the Unholy",
    "descriptions": [
      {
        "text": "Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage. A turned creature must spend its turns trying to move as far away from you as it can, and it can’t willingly move to a space within 30 feet of you. It also can’t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there’s nowhere to move, the creature can use the Dodge action.",
        "html": "Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage.\n\t\t\tA turned creature must spend its turns trying to move as far away from you as it can, and it can’t willingly move to a space within 30 feet of you. It also can’t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there’s nowhere to move, the creature can use the Dodge action."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PALADIN_AURA_OF_DEVOTION": {
    "descriptions": [
      {
        "text": "You and friendly creatures within {{aura of devotion:range}} feet of you can’t be charmed while you are conscious.",
        "html": "You and friendly creatures within {{aura of devotion:range}} feet of you can’t be charmed while you are conscious."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PALADIN_PURITY_OF_SPIRIT": {
    "descriptions": [
      {
        "text": "You are always under the effects of a protection from evil and good spell.",
        "html": "You are always under the effects of a protection from evil and good spell."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PALADIN_HOLY_NIMBUS": {
    "action": "Action",
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that. Whenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage. In addition, for the duration, you have advantage on saving throws against spells cast by fiends or undead.",
        "html": "You can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that. Whenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage. In addition, for the duration, you have advantage on saving throws against spells cast by fiends or undead."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_PALADIN_OATH_OF_THE_ANCIENTS": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOTA_OATH_SPELLS": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOTA_CHANNEL_DIVINITY": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOTA_CHANNEL_DIVINITY_NATURES_WRATH": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Nature’s Wrath",
    "descriptions": [
      {
        "text": "You can cause spectral vines to spring up and reach for a creature within 10 feet of you that you can see. The creature must succeed on a Strength or Dexterity saving throw (its choice) or be restrained. While restrained by the vines, the creature repeats the saving throw at the end of each of its turns. On a success, it frees itself and the vines vanish.",
        "html": "You can cause spectral vines to spring up and reach for a creature within 10 feet of you that you can see. The creature must succeed on a Strength or Dexterity saving throw (its choice) or be restrained. While restrained by the vines, the creature repeats the saving throw at the end of each of its turns. On a success, it frees itself and the vines vanish."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOTA_CHANNEL_DIVINITY_TURN_THE_FAITHLESS": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Turn the Faithless",
    "descriptions": [
      {
        "text": "You present your holy symbol, and each fey or fiend within 30 feet of you that can hear you must make a Wisdom saving throw. On a failed save, the creature is turned for 1 minute or until it takes damage. A turned creature must spend its turns trying to move as far away from you as it can, and it can’t willingly move to a space within 30 feet of you. It also can’t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there’s nowhere to move, the creature can use the Dodge action. If the creature’s true form is concealed by an illusion, shapeshifting, or other effect, that form is revealed while it is turned.",
        "html": "You present your holy symbol, and each fey or fiend within 30 feet of you that can hear you must make a Wisdom saving throw. On a failed save, the creature is turned for 1 minute or until it takes damage.\n\t\t\tA turned creature must spend its turns trying to move as far away from you as it can, and it can’t willingly move to a space within 30 feet of you. It also can’t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there’s nowhere to move, the creature can use the Dodge action.\n\t\t\tIf the creature’s true form is concealed by an illusion, shapeshifting, or other effect, that form is revealed while it is turned."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOTA_AURA_OF_WARDING": {
    "descriptions": [
      {
        "text": "You and friendly creatures within {{aura of warding:range}} feet of you have resistance to damage from spells.",
        "html": "You and friendly creatures within {{aura of warding:range}} feet of you have resistance to damage from spells."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOTA_UNDYING_SENTINEL": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "When you are reduced to 0 hit points and are not killed outright, you can choose to drop to 1 hit point instead. You suffer none of the drawbacks of old age, and you can’t be aged magically.",
        "html": "When you are reduced to 0 hit points and are not killed outright, you can choose to drop to 1 hit point instead.\n\t\t\tYou suffer none of the drawbacks of old age, and you can’t be aged magically."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOTA_ELDER_CHAMPION": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "For 1 minute you gain the following benefits: At the start of each of your turns, you regain 10 hp Whenever you cast a paladin spell that has a casting time of 1 action, you can cast it using a bonus action instead. Enemy creatures within 10 feet of you have disadvantage on saving throws against your paladin spells and Channel Divinity options.",
        "html": "For 1 minute you gain the following benefits:\n\t\t\tAt the start of each of your turns, you regain 10 hp\n\t\t\tWhenever you cast a paladin spell that has a casting time of 1 action, you can cast it using a bonus action instead.\n\t\t\tEnemy creatures within 10 feet of you have disadvantage on saving throws against your paladin spells and Channel Divinity options."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOV_OATH_SPELLS": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOV_CHANNEL_DIVINITY": {
    "display": false,
    "descriptions": [
      {
        "text": "You have the Abjure Enemy and Vow of Enmity Channel Divinity options.",
        "html": "You have the Abjure Enemy and Vow of Enmity Channel Divinity options."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOV_CHANNEL_DIVINITY_ABJURE_ENEMY": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Abjure Enemy",
    "descriptions": [
      {
        "text": "You present your holy symbol and speak a prayer of denunciation, using your Channel Divinity. Choose one creature within 60 feet of you that you can see. That creature must make a Wisdom saving throw, unless it is immune to being frightened. Fiends and undead have disadvantage on this saving throw. On a failed save, the creature is frightened for 1 minute or until it takes any damage. While frightened, the creature’s speed is 0, and it can’t benefit from any bonus to its speed. On a successful save, the creature’s speed is halved for 1 minute or until the creature takes any damage.",
        "html": "You present your holy symbol and speak a prayer of denunciation, using your Channel Divinity. Choose one creature within 60 feet of you that you can see. That creature must make a Wisdom saving throw, unless it is immune to being frightened. Fiends and undead have disadvantage on this saving throw.\n\t\t\tOn a failed save, the creature is frightened for 1 minute or until it takes any damage. While frightened, the creature’s speed is 0, and it can’t benefit from any bonus to its speed.\n\t\t\tOn a successful save, the creature’s speed is halved for 1 minute or until the creature takes any damage."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOV_CHANNEL_DIVINITY_VOW_OF_ENMITY": {
    "action": "Bonus Action",
    "usage": "Channel Divinity",
    "alt": "Vow of Enmity",
    "descriptions": [
      {
        "text": "You can utter a vow of enmity against a creature you can see within 10 feet of you, using your Channel Divinity. You gain advantage on attack rolls against the creature for 1 minute or until it drops to 0 hit points or falls unconscious.",
        "html": "You can utter a vow of enmity against a creature you can see within 10 feet of you, using your Channel Divinity. You gain advantage on attack rolls against the creature for 1 minute or until it drops to 0 hit points or falls unconscious."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOV_RELENTLESS_AVENGER": {
    "descriptions": [
      {
        "text": "When you hit a creature with an opportunity attack, you can move up to half your speed immediately after the attack and as part of the same reaction. This movement doesn’t provoke opportunity attacks.",
        "html": "When you hit a creature with an opportunity attack, you can move up to half your speed immediately after the attack and as part of the same reaction. This movement doesn’t provoke opportunity attacks."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOV_SOUL_OF_VENGEANCE": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When a creature under the effect of your Vow of Enmity makes an attack, you can make a melee weapon attack against that creature if it is within range.",
        "html": "When a creature under the effect of your Vow of Enmity makes an attack, you can make a melee weapon attack against that creature if it is within range."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_OOV_AVENGING_ANGEL": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "For 1 hour, you gain the following benefits: Wings sprout from your back and grant you a flying speed of 60 feet. You emanate an aura of menace in a 30-foot radius. The first time any enemy creature enters the aura or starts its turn there during a battle, the creature must succeed on a Wisdom saving throw or become frightened of you for 1 minute or until it takes any damage. Attack rolls against the frightened creature have advantage.",
        "html": "For 1 hour, you gain the following benefits:\n\t\t\tWings sprout from your back and grant you a flying speed of 60 feet.\n\t\t\tYou emanate an aura of menace in a 30-foot radius. The first time any enemy creature enters the aura or starts its turn there during a battle, the creature must succeed on a Wisdom saving throw or become frightened of you for 1 minute or until it takes any damage. Attack rolls against the frightened creature have advantage."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_BARD": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARD_BARDIC_INSPIRATION": {
    "action": "Bonus Action",
    "usage": "{{bardic-inspiration:count}}/Long Rest",
    "descriptions": [
      {
        "text": "Inspire one creature other than yourself within 60 feet of you who can hear you. It gains one Bardic Inspiration die, a d{{bardic-inspiration:dice}}. Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes.",
        "html": "Inspire one creature other than yourself within 60 feet of you who can hear you. It gains one Bardic Inspiration die, a d{{bardic-inspiration:dice}}.\n\t\tOnce within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARD_SPELLCASTING_BARD": {
    "display": false,
    "descriptions": [
      {
        "text": "You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music.",
        "html": "You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARD_JACK_OF_ALL_TRADES": {
    "display": false,
    "descriptions": [
      {
        "text": "You can add half your proficiency bonus ({{proficiency:half}}), rounded down, to any ability check you make that doesn’t already include your proficiency bonus.",
        "html": "You can add half your proficiency bonus ({{proficiency:half}}), rounded down, to any ability check you make that doesn’t already include your proficiency bonus."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARD_SONG_OF_REST": {
    "descriptions": [
      {
        "text": "You or any friendly creatures who can hear your performance regain hp at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d{{song-of-rest:dice:size}} hit points.",
        "html": "You or any friendly creatures who can hear your performance regain hp at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d{{song-of-rest:dice:size}} hit points."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARD_BARD_COLLEGE": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARD_EXPERTISE": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARD_ABILITYSCOREIMPROVEMENT_BARD": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARD_FONT_OF_INSPIRATION": {
    "descriptions": [
      {
        "text": "You regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.",
        "html": "You regain all of your expended uses of Bardic Inspiration when you finish a short or long rest."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARD_COUNTERCHARM": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed.",
        "html": "You can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARD_MAGICAL_SECRETS": {
    "display": false,
    "descriptions": [
      {
        "text": "You have plundered magical knowledge from a wide spectrum of disciplines.",
        "html": "You have plundered magical knowledge from a wide spectrum of disciplines."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARD_SUPERIOR_INSPIRATION": {
    "descriptions": [
      {
        "text": "When you roll initiative and have no uses of Bardic Inspiration left, you regain one use.",
        "html": "When you roll initiative and have no uses of Bardic Inspiration left, you regain one use."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_COLLEGE_OF_LORE": {
    "display": false,
    "descriptions": [
      {
        "text": "Bards of the College of Lore know something about most things, collecting bits of knowledge from sources as diverse as scholarly tomes and peasant tales.",
        "html": "Bards of the College of Lore know something about most things, collecting bits of knowledge from sources as diverse as scholarly tomes and peasant tales."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BARD_LORE_BONUS_PROFICIENCIES": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BARD_LORE_CUTTING_WORDS": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a damage roll, you can use your reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature’s roll. You can choose to use this feature after the creature makes its roll, but before the GM determines whether the attack roll or ability check succeeds or fails, or before the creature deals its damage. The creature is immune if it can’t hear you or if it’s immune to being charmed.",
        "html": "When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a damage roll, you can use your reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature’s roll. You can choose to use this feature after the creature makes its roll, but before the GM determines whether the attack roll or ability check succeeds or fails, or before the creature deals its damage. The creature is immune if it can’t hear you or if it’s immune to being charmed."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BARD_LORE_ADDITIONAL_MAGICAL_SECRETS": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BARD_LORE_PEERLESS_SKILL": {
    "descriptions": [
      {
        "text": "When you make an ability check, you can expend one use of Bardic Inspiration. Roll a Bardic Inspiration die and add the number rolled to your ability check. You can choose to do so after you roll the die for the ability check, but before the GM tells you whether you succeed or fail.",
        "html": "When you make an ability check, you can expend one use of Bardic Inspiration. Roll a Bardic Inspiration die and add the number rolled to your ability check. You can choose to do so after you roll the die for the ability check, but before the GM tells you whether you succeed or fail."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_COLLEGE_OF_VALOR": {
    "display": false,
    "descriptions": [
      {
        "text": "Bards of the College of Valor are daring skalds whose tales keep alive the memory of the great heroes of the past, and thereby inspire a new generation of heroes.",
        "html": "Bards of the College of Valor are daring skalds whose tales keep alive the memory of the great heroes of the past, and thereby inspire a new generation of heroes."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BARD_VALOR_BONUS_PROFICIENCIES": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BARD_VALOR_COMBAT_INSPIRATION": {
    "descriptions": [
      {
        "text": "A creature that has a Bardic Inspiration die from you can roll that die and add the number rolled to a weapon damage roll it just made. Alternatively, when an attack roll is made against the creature, it can use its reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, after seeing the roll but before knowing whether it hits or misses.",
        "html": "A creature that has a Bardic Inspiration die from you can roll that die and add the number rolled to a weapon damage roll it just made. Alternatively, when an attack roll is made against the creature, it can use its reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, after seeing the roll but before knowing whether it hits or misses."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BARD_VALOR_EXTRA_ATTACK": {
    "descriptions": [
      {
        "text": "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
        "html": "You can attack twice, instead of once, whenever you take the Attack action on your turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BARD_VALOR_BATTLE_MAGIC": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "When you use your action to cast a bard spell, you can make one weapon attack.",
        "html": "When you use your action to cast a bard spell, you can make one weapon attack."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_WIZARD": {
    "display": false,
    "descriptions": [
      {
        "text": "A scholarly magic-user capable of manipulating the structures of reality.",
        "html": "A scholarly magic-user capable of manipulating the structures of reality."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WIZARD_SPELLCASTING_WIZARD": {
    "display": false,
    "descriptions": [
      {
        "text": "You can prepare {{wizard:spellcasting:prepare}} spells from the your spellbook. You use an arcane focus to cast spells. and can also cast wizard spells as a ritual.",
        "html": "You can prepare {{wizard:spellcasting:prepare}} spells from the your spellbook. You use an arcane focus to cast spells. and can also cast wizard spells as a ritual."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WIZARD_ARCANE_RECOVERY": {
    "descriptions": [
      {
        "text": "Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than {{level:wizard:half:up}}.",
        "html": "Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than {{level:wizard:half:up}}."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WIZARD_ARCANE_TRADITION": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WIZARD_ABILITYSCOREIMPROVEMENT_WIZARD": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WIZARD_SPELL_MASTERY": {
    "descriptions": [
      {
        "text": "Choose a 1st-level wizard spell and a 2nd-­level wizard spell that are in your spellbook. You can cast those spells at their lowest level without expending a spell slot when you have them prepared. If you want to cast either spell at a higher level, you must expend a spell slot as normal. By spending 8 hours in study, you can exchange one or both of the spells you chose for different spells of the same levels.",
        "html": "Choose a 1st-level wizard spell and a 2nd-­level wizard spell that are in your spellbook. You can cast those spells at their lowest level without expending a spell slot when you have them prepared. If you want to cast either spell at a higher level, you must expend a spell slot as normal.\n\t\t\tBy spending 8 hours in study, you can exchange one or both of the spells you chose for different spells of the same levels."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WIZARD_SIGNATURE_SPELLS": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "Choose two 3rd-­level wizard spells in your spellbook as your signature spells. You always have these spells prepared, they don’t count against the number of spells you have prepared, and you can cast each of them once at 3rd level without expending a spell slot. If you want to cast either spell at a higher level, you must expend a spell slot as normal.",
        "html": "Choose two 3rd-­level wizard spells in your spellbook as your signature spells. You always have these spells prepared, they don’t count against the number of spells you have prepared, and you can cast each of them once at 3rd level without expending a spell slot.\n\t\t\tIf you want to cast either spell at a higher level, you must expend a spell slot as normal."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_WIZARD_SCHOOL_OF_ABJURATION": {
    "display": false,
    "descriptions": [
      {
        "text": "The School of Abjuration emphasizes magic that blocks, banishes, or protects. Detractors of this school say that its tradition is about denial, negation rather than positive assertion.",
        "html": "The School of Abjuration emphasizes magic that blocks, banishes, or protects. Detractors of this school say that its tradition is about denial, negation rather than positive assertion."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ABJURATION_ABJURATION_SAVANT": {
    "descriptions": [
      {
        "text": "The gold and time you must spend to copy an abjuration spell into your spellbook is halved.",
        "html": "The gold and time you must spend to copy an abjuration spell into your spellbook is halved."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ABJURATION_ARCANE_WARD": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "When you cast an abjuration spell of 1st level or higher, you can create a magical ward on yourself that lasts until you finish a long rest. The ward has {{arcane ward:hp}} hp. Whenever you take damage, the ward takes the damage instead. If this damage reduces the ward to 0 hp, you take any remaining damage. While the ward has 0 hp, it can’t absorb damage, but its magic remains. Whenever you cast an abjuration spell of 1st level or higher, the ward regains a number of hp equal to twice the level of the spell.",
        "html": "When you cast an abjuration spell of 1st level or higher, you can create a magical ward on yourself that lasts until you finish a long rest. The ward has {{arcane ward:hp}} hp. Whenever you take damage, the ward takes the damage instead. If this damage reduces the ward to 0 hp, you take any remaining damage.\n\t\t\tWhile the ward has 0 hp, it can’t absorb damage, but its magic remains. Whenever you cast an abjuration spell of 1st level or higher, the ward regains a number of hp equal to twice the level of the spell."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ABJURATION_PROJECTED_WARD": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When a creature that you can see within 30 feet of you takes damage, you can cause your Arcane Ward to absorb that damage. If this damage reduces the ward to 0 hp, the warded creature takes any remaining damage.",
        "html": "When a creature that you can see within 30 feet of you takes damage, you can cause your Arcane Ward to absorb that damage. If this damage reduces the ward to 0 hp, the warded creature takes any remaining damage."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ABJURATION_IMPROVED_ABJURATION": {
    "descriptions": [
      {
        "text": "When you cast an abjuration spell that requires you to make an ability check as a part of casting that spell, you add {{proficiency}} to that ability check.",
        "html": "When you cast an abjuration spell that requires you to make an ability check as a part of casting that spell, you add {{proficiency}} to that ability check."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ABJURATION_SPELL_RESISTANCE": {
    "descriptions": [
      {
        "text": "You have advantage on saving throws against spells. You have resistance against the damage of spells.",
        "html": "You have advantage on saving throws against spells.\n\t\t\tYou have resistance against the damage of spells."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_WIZARD_SCHOOL_OF_CONJURATION": {
    "display": false,
    "descriptions": [
      {
        "text": "As a conjurer, you favor spells that produce objects and creatures out of thin air.",
        "html": "As a conjurer, you favor spells that produce objects and creatures out of thin air."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_CONJURATION_CONJURATION_SAVANT": {
    "descriptions": [
      {
        "text": "The gold and time you must spend to copy a conjuration spell into your spellbook is halved.",
        "html": "The gold and time you must spend to copy a conjuration spell into your spellbook is halved."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_CONJURATION_MINOR_CONJURATION": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can conjure up an inanimate object in your hand or on the ground in an unoccupied space that you can see within 10 feet of you. This object can be no larger than 3 feet on a side and weigh no more than 10 pounds, and its form must be that of a nonmagical object that you have seen. The object is visibly magical, radiating dim light out to 5 feet. The object disappears after 1 hour, when you use this feature again, or if it takes or deals any damage.",
        "html": "You can conjure up an inanimate object in your hand or on the ground in an unoccupied space that you can see within 10 feet of you. This object can be no larger than 3 feet on a side and weigh no more than 10 pounds, and its form must be that of a nonmagical object that you have seen. The object is visibly magical, radiating dim light out to 5 feet. The object disappears after 1 hour, when you use this feature again, or if it takes or deals any damage."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_CONJURATION_BENIGN_TRANSPOSITION": {
    "action": "Action",
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "Teleport up to 30 feet to an unoccupied space that you can see. Alternatively, you can choose a space within range that is occupied by a Small or Medium creature. If that creature is willing, you both teleport, swapping places. Recharges when you cast a conjuration spell of 1st level or higher.",
        "html": "Teleport up to 30 feet to an unoccupied space that you can see. Alternatively, you can choose a space within range that is occupied by a Small or Medium creature. If that creature is willing, you both teleport, swapping places. Recharges when you cast a conjuration spell of 1st level or higher."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_CONJURATION_FOCUSED_CONJURATION": {
    "descriptions": [
      {
        "text": "While you are concentrating on a conjuration spell, your concentration can’t be broken as a result of taking damage.",
        "html": "While you are concentrating on a conjuration spell, your concentration can’t be broken as a result of taking damage."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_CONJURATION_DURABLE_SUMMONS": {
    "descriptions": [
      {
        "text": "Any creature that you summon or create with a conjuration spell has 30 temporary hp.",
        "html": "Any creature that you summon or create with a conjuration spell has 30 temporary hp."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_WIZARD_SCHOOL_OF_DIVINATION": {
    "display": false,
    "descriptions": [
      {
        "text": "The counsel of a diviner is sought by royalty and commoners alike, for all seek a clearer understanding of the past, present, and future.",
        "html": "The counsel of a diviner is sought by royalty and commoners alike, for all seek a clearer understanding of the past, present, and future."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_DIVINATION_DIVINATION_SAVANT": {
    "descriptions": [
      {
        "text": "The gold and time you must spend to copy a divination spell into your spellbook is halved.",
        "html": "The gold and time you must spend to copy a divination spell into your spellbook is halved."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_DIVINATION_PORTENT": {
    "descriptions": [
      {
        "text": "When you finish a long rest, roll two d20s and record the numbers rolled. You can replace any attack roll, saving throw, or ability check made by you or a creature that you can see with one of these foretelling rolls. You must choose to do so before the roll, and you can replace a roll in this way only once per turn.",
        "html": "When you finish a long rest, roll two d20s and record the numbers rolled. You can replace any attack roll, saving throw, or ability check made by you or a creature that you can see with one of these foretelling rolls. You must choose to do so before the roll, and you can replace a roll in this way only once per turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_DIVINATION_EXPERT_DIVINATION": {
    "descriptions": [
      {
        "text": "When you cast a divination spell of 2nd level or higher using a spell slot, you regain one expended spell slot. The slot you regain must be of a level lower than the spell you cast and can’t be higher than 5th level.",
        "html": "When you cast a divination spell of 2nd level or higher using a spell slot, you regain one expended spell slot. The slot you regain must be of a level lower than the spell you cast and can’t be higher than 5th level."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_DIVINATION_THE_THIRD_EYE": {
    "action": "Action",
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "Choose one of the following benefits, which lasts until you are incapacitated or you take a short or long rest. Darkvision. You gain darkvision out to a range of 60 feet. Ethereal Sight. You can see into the Ethereal Plane within 60 feet of you. Greater Comprehension. You can read any language. See Invisibility. You can see invisible creatures and objects within 10 feet of you that are within line of sight.",
        "html": "Choose one of the following benefits, which lasts until you are incapacitated or you take a short or long rest.\n\t\t\tDarkvision. You gain darkvision out to a range of 60 feet.\n\t\t\tEthereal Sight. You can see into the Ethereal Plane within 60 feet of you.\n\t\t\tGreater Comprehension. You can read any language.\n\t\t\tSee Invisibility. You can see invisible creatures and objects within 10 feet of you that are within line of sight."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_DIVINATION_GREATER_PORTENT": {
    "descriptions": [
      {
        "text": "You roll three d20s for your Portent feature, rather than two.",
        "html": "You roll three d20s for your Portent feature, rather than two."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_WIZARD_SCHOOL_OF_ENCHANTMENT": {
    "display": false,
    "descriptions": [
      {
        "text": "As a member of the School of Enchantment, you have honed your ability to magically entrance and beguile other people and monsters.",
        "html": "As a member of the School of Enchantment, you have honed your ability to magically entrance and beguile other people and monsters."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ENCHANTMENT_ENCHANTMENT_SAVANT": {
    "descriptions": [
      {
        "text": "The gold and time you must spend to copy an enchantment spell into your spellbook is halved.",
        "html": "The gold and time you must spend to copy an enchantment spell into your spellbook is halved."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ENCHANTMENT_HYPNOTIC_GAZE": {
    "action": "Action",
    "descriptions": [
      {
        "text": "Choose one creature that you can see within 5 feet of you. If the target can see or hear you, it must succeed on a Wisdom saving throw or be charmed by you until the end of your next turn. The charmed creature’s speed drops to 0, and the creature is incapacitated and visibly dazed.",
        "html": "Choose one creature that you can see within 5 feet of you. If the target can see or hear you, it must succeed on a Wisdom saving throw or be charmed by you until the end of your next turn. The charmed creature’s speed drops to 0, and the creature is incapacitated and visibly dazed."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ENCHANTMENT_INSTINCTIVE_CHARM": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When a creature you can see within 30 feet of you makes an attack roll against you, you can divert the attack, provided that another creature is within the attack’s range. The attacker must make a Wisdom saving throw. On a failed save, the attacker must target the creature that is closest to it, not including you or itself. If multiple creatures are closest, the attacker chooses which one to target. On a successful save, you can’t use this feature on the attacker again until you finish a long rest.",
        "html": "When a creature you can see within 30 feet of you makes an attack roll against you, you can divert the attack, provided that another creature is within the attack’s range. The attacker must make a Wisdom saving throw. On a failed save, the attacker must target the creature that is closest to it, not including you or itself. If multiple creatures are closest, the attacker chooses which one to target. On a successful save, you can’t use this feature on the attacker again until you finish a long rest."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ENCHANTMENT_SPLIT_ENCHANTMENT": {
    "descriptions": [
      {
        "text": "When you cast an enchantment spell of 1st level or higher that targets only one creature, you can have it target a second creature.",
        "html": "When you cast an enchantment spell of 1st level or higher that targets only one creature, you can have it target a second creature."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ENCHANTMENT_ALTER_MEMORIES": {
    "descriptions": [
      {
        "text": "When you cast an enchantment spell to charm one or more creatures, you can alter one creature’s understanding so that it remains unaware of being charmed. Once before the spell expires, you can use your action to try to make the chosen creature forget some of the time it spent charmed. The creature must succeed on an Intelligence saving throw or lose {{alter memories:hours}} hours of its memories. You can make the creature forget less time, and the amount of time can’t exceed the duration of your enchantment spell.",
        "html": "When you cast an enchantment spell to charm one or more creatures, you can alter one creature’s understanding so that it remains unaware of being charmed.\n\t\t\tOnce before the spell expires, you can use your action to try to make the chosen creature forget some of the time it spent charmed. The creature must succeed on an Intelligence saving throw or lose {{alter memories:hours}} hours of its memories. You can make the creature forget less time, and the amount of time can’t exceed the duration of your enchantment spell."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_WIZARD_SCHOOL_OF_EVOCATION": {
    "display": false,
    "descriptions": [
      {
        "text": "You focus your study on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid.",
        "html": "You focus your study on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_EVOCATION_EVOCATION_SAVANT": {
    "descriptions": [
      {
        "text": "The gold and time you must spend to copy an evocation spell into your spellbook is halved.",
        "html": "The gold and time you must spend to copy an evocation spell into your spellbook is halved."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_EVOCATION_SCULPT_SPELLS": {
    "descriptions": [
      {
        "text": "When you cast an evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell’s level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.",
        "html": "When you cast an evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell’s level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_EVOCATION_POTENT_CANTRIP": {
    "descriptions": [
      {
        "text": "When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip’s damage but suffers no additional effect from the cantrip.",
        "html": "When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip’s damage but suffers no additional effect from the cantrip."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_EVOCATION_EMPOWERED_EVOCATION": {
    "descriptions": [
      {
        "text": "You can add {{intelligence:modifier}} to one damage roll of any wizard evocation spell you cast.",
        "html": "You can add {{intelligence:modifier}} to one damage roll of any wizard evocation spell you cast."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_EVOCATION_OVERCHANNEL": {
    "descriptions": [
      {
        "text": "When you cast a wizard spell of 1st through 5th level that deals damage, you can deal maximum damage with that spell. If you use this feature again before you finish a long rest, you take 2d12 necrotic damage for each level of the spell, immediately after you cast it. Each time you use this feature again before finishing a long rest, the necrotic damage per spell level increases by 1d12. This damage ignores resistance and immunity.",
        "html": "When you cast a wizard spell of 1st through 5th level that deals damage, you can deal maximum damage with that spell. If you use this feature again before you finish a long rest, you take 2d12 necrotic damage for each level of the spell, immediately after you cast it. Each time you use this feature again before finishing a long rest, the necrotic damage per spell level increases by 1d12. This damage ignores resistance and immunity."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_WIZARD_SCHOOL_OF_ILLUSION": {
    "display": false,
    "descriptions": [
      {
        "text": "You focus your studies on magic that dazzles the senses, befuddles the mind, and tricks even the wisest folk.",
        "html": "You focus your studies on magic that dazzles the senses, befuddles the mind, and tricks even the wisest folk."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ILLUSION_ILLUSION_SAVANT": {
    "descriptions": [
      {
        "text": "The gold and time you must spend to copy an illusion spell into your spellbook is halved.",
        "html": "The gold and time you must spend to copy an illusion spell into your spellbook is halved."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ILLUSION_IMPROVED_MINOR_ILLUSION": {
    "descriptions": [
      {
        "text": "When you cast minor illusion, you can create both a sound and an image with a single casting of the spell.",
        "html": "When you cast minor illusion, you can create both a sound and an image with a single casting of the spell."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ILLUSION_MALLEABLE_ILLUSIONS": {
    "action": "Action",
    "descriptions": [
      {
        "text": "When you cast an illusion spell that has a duration of 1 minute or longer, you can change the nature of that illusion, provided that you can see the illusion.",
        "html": "When you cast an illusion spell that has a duration of 1 minute or longer, you can change the nature of that illusion, provided that you can see the illusion."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ILLUSION_ILLUSORY_SELF": {
    "action": "Reaction",
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "When a creature makes an attack roll against you, you can interpose the illusory duplicate between the attacker and yourself. The attack automatically misses you, then the illusion dissipates.",
        "html": "When a creature makes an attack roll against you, you can interpose the illusory duplicate between the attacker and yourself. The attack automatically misses you, then the illusion dissipates."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_ILLUSION_ILLUSORY_REALITY": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "When you cast an illusion spell of 1st level or higher, you can choose one inanimate, nonmagical object that is part of the illusion and make that object real. The object remains real for 1 minute. For example, you can create an illusion of a bridge over a chasm and then make it real long enough for your allies to cross. The object can’t deal damage or otherwise directly harm anyone.",
        "html": "When you cast an illusion spell of 1st level or higher, you can choose one inanimate, nonmagical object that is part of the illusion and make that object real. The object remains real for 1 minute. For example, you can create an illusion of a bridge over a chasm and then make it real long enough for your allies to cross. The object can’t deal damage or otherwise directly harm anyone."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_WIZARD_SCHOOL_OF_NECROMANCY": {
    "display": false,
    "descriptions": [
      {
        "text": "The School of Necromancy explores the cosmic forces of life, death, and undeath.",
        "html": "The School of Necromancy explores the cosmic forces of life, death, and undeath."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_NECROMANCY_NECROMANCY_SAVANT": {
    "descriptions": [
      {
        "text": "The gold and time you must spend to copy a necromancy spell into your spellbook is halved.",
        "html": "The gold and time you must spend to copy a necromancy spell into your spellbook is halved."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_NECROMANCY_GRIM_HARVEST": {
    "descriptions": [
      {
        "text": "Once per turn when you kill one or more creatures with a spell of 1st level or higher, you regain hp equal to twice the spell’s level, or three times its level if the spell belongs to the School of Necromancy. You don’t gain this benefit for killing constructs or undead.",
        "html": "Once per turn when you kill one or more creatures with a spell of 1st level or higher, you regain hp equal to twice the spell’s level, or three times its level if the spell belongs to the School of Necromancy. You don’t gain this benefit for killing constructs or undead."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_NECROMANCY_UNDEAD_THRALLS": {
    "descriptions": [
      {
        "text": "When you cast animate dead, you can target one additional corpse or pile of bones, creating another zombie or skeleton, as appropriate. The creature’s hp maximum is increased by {{level:wizard}} and adds {{proficiency}} to its weapon damage rolls.",
        "html": "When you cast animate dead, you can target one additional corpse or pile of bones, creating another zombie or skeleton, as appropriate. The creature’s hp maximum is increased by {{level:wizard}} and adds {{proficiency}} to its weapon damage rolls."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_NECROMANCY_INURED_TO_UNDEAD": {
    "descriptions": [
      {
        "text": "Your hp maximum can't be reduced.",
        "html": "Your hp maximum can't be reduced."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_NECROMANCY_COMMAND_UNDEAD": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can choose one undead that you can see within 60 feet of you. That creature must make a Charisma saving throw. If it succeeds, you can’t use this feature on it again. If it fails, it becomes friendly to you and obeys your commands until you use this feature again. Intelligent undead are harder to control in this way. If the target has an Intelligence of 8 or higher, it has advantage on the saving throw. If it fails the saving throw and has an Intelligence of 12 or higher, it can repeat the saving throw at the end of every hour until it succeeds and breaks free.",
        "html": "You can choose one undead that you can see within 60 feet of you. That creature must make a Charisma saving throw. If it succeeds, you can’t use this feature on it again. If it fails, it becomes friendly to you and obeys your commands until you use this feature again. Intelligent undead are harder to control in this way. If the target has an Intelligence of 8 or higher, it has advantage on the saving throw. If it fails the saving throw and has an Intelligence of 12 or higher, it can repeat the saving throw at the end of every hour until it succeeds and breaks free."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_WIZARD_SCHOOL_OF_TRANSMUTATION": {
    "display": false,
    "descriptions": [
      {
        "text": "You are a student of spells that modify energy and matter.",
        "html": "You are a student of spells that modify energy and matter."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_TRANSMUTATION_TRANSMUTATION_SAVANT": {
    "descriptions": [
      {
        "text": "The gold and time you must spend to copy a transmutation spell into your spellbook is halved.",
        "html": "The gold and time you must spend to copy a transmutation spell into your spellbook is halved."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_TRANSMUTATION_MINOR_ALCHEMY": {
    "descriptions": [
      {
        "text": "You can temporarily alter the physical properties of one nonmagical object, changing it from one substance into another. You perform a special alchemical procedure on one object composed entirely of wood, stone (but not a gemstone), iron, copper, or silver, transforming it into a different one of those materials. For each 10 minutes you spend performing the procedure, you can transform up to 1 cubic foot of material. After 1 hour, or until you lose your concentration, the material reverts to its original substance.",
        "html": "You can temporarily alter the physical properties of one nonmagical object, changing it from one substance into another. You perform a special alchemical procedure on one object composed entirely of wood, stone (but not a gemstone), iron, copper, or silver, transforming it into a different one of those materials. For each 10 minutes you spend performing the procedure, you can transform up to 1 cubic foot of material. After 1 hour, or until you lose your concentration, the material reverts to its original substance."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_TRANSMUTATION_TRANSMUTERS_STONE": {
    "descriptions": [
      {
        "text": "You can spend 8 hours creating a transmuter’s stone that stores transmutation magic.",
        "html": "You can spend 8 hours creating a transmuter’s stone that stores transmutation magic."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_TRANSMUTATION_SHAPECHANGER": {
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "You can cast polymorph without expending a spell slot. When you do so, you can target only yourself and transform into a beast whose challenge rating is 1 or lower.",
        "html": "You can cast polymorph without expending a spell slot. When you do so, you can target only yourself and transform into a beast whose challenge rating is 1 or lower."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WIZARD_TRANSMUTATION_MASTER_TRANSMUTER": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can consume the reserve of transmutation magic stored within your transmuter’s stone in a single burst. Major Transformation. You can transmute one nonmagical object—no larger than a 5-foot cube—into another nonmagical object of similar size and mass and of equal or lesser value. You must spend 10 minutes handling the object to transform it. Panacea. You remove all curses, diseases, and poisons affecting a creature that you touch with the transmuter’s stone. The creature also regains all its hp. Restore Life. You cast the raise dead spell on a creature you touch with the transmuter’s stone, without expending a spell slot or needing to have the spell in your spellbook. Restore Youth. You touch the transmuter’s stone to a willing creature, and that creature’s apparent age is reduced by 3d10 years, to a minimum of 13 years. This effect doesn’t extend the creature’s lifespan.",
        "html": "You can consume the reserve of transmutation magic stored within your transmuter’s stone in a single burst.\n\t\t\tMajor Transformation. You can transmute one nonmagical object—no larger than a 5-foot cube—into another nonmagical object of similar size and mass and of equal or lesser value. You must spend 10 minutes handling the object to transform it.\n\t\t\tPanacea. You remove all curses, diseases, and poisons affecting a creature that you touch with the transmuter’s stone. The creature also regains all its hp.\n\t\t\tRestore Life. You cast the raise dead spell on a creature you touch with the transmuter’s stone, without expending a spell slot or needing to have the spell in your spellbook.\n\t\t\tRestore Youth. You touch the transmuter’s stone to a willing creature, and that creature’s apparent age is reduced by 3d10 years, to a minimum of 13 years. This effect doesn’t extend the creature’s lifespan."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_CLERIC": {
    "display": false,
    "descriptions": [
      {
        "text": "A priestly champion who wields divine magic in service of a higher power.",
        "html": "A priestly champion who wields divine magic in service of a higher power."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_CLERIC_SPELLCASTING_CLERIC": {
    "descriptions": [
      {
        "text": "You can cast cleric spells as rituals. You can prepare {{cleric:spellcasting:prepare}} spells from the cleric spell list. You can use a holy symbol as your spellcasting focus.",
        "html": "You can cast cleric spells as rituals. You can prepare {{cleric:spellcasting:prepare}} spells from the cleric spell list. You can use a holy symbol as your spellcasting focus."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_CLERIC_DIVINEDOMAIN": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_CLERIC_CHANNELDIVINITY": {
    "usage": "{{channel divinity:count}}/Short Rest",
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_CLERIC_CHANNELDIVINITY_TURN_UNDEAD": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Turn Undead",
    "descriptions": [
      {
        "text": "Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage. A turned creature must spend its turns trying to move as far away from you as it can, and it can’t willingly move to a space within 30 feet of you. It also can’t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there’s nowhere to move, the creature can use the Dodge action.",
        "html": "Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage.\n\t\t\t\tA turned creature must spend its turns trying to move as far away from you as it can, and it can’t willingly move to a space within 30 feet of you. It also can’t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there’s nowhere to move, the creature can use the Dodge action."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_CLERIC_ABILITYSCOREIMPROVEMENT_CLERIC": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_CLERIC_DESTROYUNDEAD": {
    "descriptions": [
      {
        "text": "When an undead of CR 1/2 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.",
        "html": "When an undead of CR 1/2 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed."
      },
      {
        "text": "When an undead of CR 1 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.",
        "html": "When an undead of CR 1 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.",
        "level": 8
      },
      {
        "text": "When an undead of CR 2 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.",
        "html": "When an undead of CR 2 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.",
        "level": 11
      },
      {
        "text": "When an undead of CR 3 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.",
        "html": "When an undead of CR 3 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.",
        "level": 14
      },
      {
        "text": "When an undead of CR 4 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.",
        "html": "When an undead of CR 4 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.",
        "level": 17
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_CLERIC_DIVINEINTERVENTION": {
    "action": "Action",
    "descriptions": [
      {
        "text": "Describe the assistance you seek, and roll a d100. If you roll a number equal to or lower than {{level:cleric}}, your deity intervenes. If your deity intervenes, you can’t use this feature again for 7 days. Otherwise, you can use it again after you finish a long rest.",
        "html": "Describe the assistance you seek, and roll a d100. If you roll a number equal to or lower than {{level:cleric}}, your deity intervenes.\n\t\t\tIf your deity intervenes, you can’t use this feature again for 7 days. Otherwise, you can use it again after you finish a long rest."
      },
      {
        "text": "Describe the assistance you seek and your deity intervenes. You can’t use this feature again for 7 days.",
        "html": "Describe the assistance you seek and your deity intervenes.\n\t\t\tYou can’t use this feature again for 7 days.",
        "level": 20
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_LIFEDOMAIN": {
    "display": false,
    "descriptions": [
      {
        "text": "The Life domain focuses on the vibrant positive energy— one of the fundamental forces of the universe—that sustains all life.",
        "html": "The Life domain focuses on the vibrant positive energy— one of the fundamental forces of the universe—that sustains all life."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_LIFE_BONUSPROFICIENCY": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_LIFE_DISCIPLEOFLIFE": {
    "descriptions": [
      {
        "text": "Whenever you use a spell of 1st level or higher to restore hp to a creature, the creature regains additional hp equal to 2 + the spell’s level.",
        "html": "Whenever you use a spell of 1st level or higher to restore hp to a creature, the creature regains additional hp equal to 2 + the spell’s level."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_LIFE_CHANNELDIVINITY_PRESERVELIFE": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Preserve Life",
    "descriptions": [
      {
        "text": "You present your holy symbol and evoke healing energy that can restore {{preserve life:hp}} hp. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hp maximum. You can’t use this feature on an undead or a construct.",
        "html": "You present your holy symbol and evoke healing energy that can restore {{preserve life:hp}} hp. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hp maximum. You can’t use this feature on an undead or a construct."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_LIFE_BLESSEDHEALER": {
    "descriptions": [
      {
        "text": "When you cast a spell of 1st level or higher that restores hp to a creature other than you, you regain hp equal to 2 + the spell’s level.",
        "html": "When you cast a spell of 1st level or higher that restores hp to a creature other than you, you regain hp equal to 2 + the spell’s level."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_LIFE_DIVINESTRIKE": {
    "descriptions": [
      {
        "text": "Once on each of your turn +1d8 radiant damage with a weapon attack.",
        "html": "Once on each of your turn +1d8 radiant damage with a weapon attack."
      },
      {
        "text": "Once on each of your turn +2d8 radiant damage with a weapon attack.",
        "html": "Once on each of your turn +2d8 radiant damage with a weapon attack.",
        "level": 14
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_LIFE_SUPREMEHEALING": {
    "descriptions": [
      {
        "text": "When you would normally roll one or more dice to restore hp with a spell, you instead use the highest number possible for each die. For example, instead of restoring 2d6 hp to a creature, you restore 12.",
        "html": "When you would normally roll one or more dice to restore hp with a spell, you instead use the highest number possible for each die. For example, instead of restoring 2d6 hp to a creature, you restore 12."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_CLERIC_KNOWLEDGE_DOMAIN": {
    "display": false,
    "descriptions": [
      {
        "text": "The gods of knowledge value learning and understanding above all.",
        "html": "The gods of knowledge value learning and understanding above all."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_KNOWLEDGE_DOMAIN_BLESSINGS_OF_KNOWLEDGE": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_KNOWLEDGE_DOMAIN_BLESSINGS_OF_KNOWLEDGE_ARCANA": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_KNOWLEDGE_DOMAIN_BLESSINGS_OF_KNOWLEDGE_HISTORY": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_KNOWLEDGE_DOMAIN_BLESSINGS_OF_KNOWLEDGE_NATURE": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_KNOWLEDGE_DOMAIN_BLESSINGS_OF_KNOWLEDGE_RELIGION": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_KNOWLEDGE_DOMAIN_CD_KNOWLEDGE_OF_THE_AGES": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Knowledge of the Ages",
    "descriptions": [
      {
        "text": "You choose one skill or tool. For 10 minutes, you have proficiency with the chosen skill or tool.",
        "html": "You choose one skill or tool. For 10 minutes, you have proficiency with the chosen skill or tool."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_KNOWLEDGE_DOMAIN_CD_READ_THOUGHTS": {
    "action": "Action",
    "descriptions": [
      {
        "text": "Choose one creature that you can see within 60 feet of you. That creature must make a Wisdom saving throw. If the creature fails its save, you can read its surface thoughts when it is within 60 feet of you. This effect lasts for 1 minute. During that time, you can use your action to end this effect and cast the suggestion spell on the creature without expending a spell slot. The target automatically fails its saving throw against the spell.",
        "html": "Choose one creature that you can see within 60 feet of you. That creature must make a Wisdom saving throw. If the creature fails its save, you can read its surface thoughts when it is within 60 feet of you. This effect lasts for 1 minute. During that time, you can use your action to end this effect and cast the suggestion spell on the creature without expending a spell slot. The target automatically fails its saving throw against the spell."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_KNOWLEDGE_DOMAIN_POTENT_SPELLCASTING": {
    "descriptions": [
      {
        "text": "+{{wisdom:modifier}} to the damage you deal with any cleric cantrip.",
        "html": "+{{wisdom:modifier}} to the damage you deal with any cleric cantrip."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_KNOWLEDGE_DOMAIN_VISIONS_OF_THE_PAST": {
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "You spend at least 1 minute in meditation and prayer, then receive dreamlike, shadowy glimpses of recent events. You can meditate in this way for {{wisdom:score}} minutes and must maintain concentration during that time, as if you were casting a spell. Object Reading. Holding an object as you meditate, you can see visions of the object’s previous owner. After meditating for 1 minute, you learn how the owner acquired and lost the object, as well as the most recent significant event involving the object and that owner. If the object was owned by another creature in the recent past (within {{wisdom:score}} days), you can spend 1 additional minute for each owner to learn the same information about that creature. Area Reading. As you meditate, you see visions of recent events in your immediate vicinity, going back {{wisdom:score}} days. For each minute you meditate, you learn about one significant event, beginning with the most recent. Significant events typically involve powerful emotions, such as battles and betrayals, marriages and murders, births and funerals. However, they might also include more mundane events that are nevertheless important in your current situation.",
        "html": "You spend at least 1 minute in meditation and prayer, then receive dreamlike, shadowy glimpses of recent events. You can meditate in this way for {{wisdom:score}} minutes and must maintain concentration during that time, as if you were casting a spell.\n\t\t\tObject Reading. Holding an object as you meditate, you can see visions of the object’s previous owner. After meditating for 1 minute, you learn how the owner acquired and lost the object, as well as the most recent significant event involving the object and that owner. If the object was owned by another creature in the recent past (within {{wisdom:score}} days), you can spend 1 additional minute for each owner to learn the same information about that creature.\n\t\t\tArea Reading. As you meditate, you see visions of recent events in your immediate vicinity, going back {{wisdom:score}} days. For each minute you meditate, you learn about one significant event, beginning with the most recent. Significant events typically involve powerful emotions, such as battles and betrayals, marriages and murders, births and funerals. However, they might also include more mundane events that are nevertheless important in your current situation."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_CLERIC_LIGHT_DOMAIN": {
    "display": false,
    "descriptions": [
      {
        "text": "Gods of light promote the ideals of rebirth and renewal, truth, vigilance, and beauty, often using the symbol of the sun.",
        "html": "Gods of light promote the ideals of rebirth and renewal, truth, vigilance, and beauty, often using the symbol of the sun."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_LIGHT_DOMAIN_BONUS_CANTRIP": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_LIGHT_DOMAIN_WARDING_FLARE": {
    "action": "Reaction",
    "usage": "{{warding flare:count}}/Long Rest",
    "descriptions": [
      {
        "text": "When you are attacked by a creature within 30 feet of you that you can see, you can use your reaction to impose disadvantage on the attack roll, causing light to flare before the attacker before it hits or misses.",
        "html": "When you are attacked by a creature within 30 feet of you that you can see, you can use your reaction to impose disadvantage on the attack roll, causing light to flare before the attacker before it hits or misses."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_LIGHT_DOMAIN_CD_RADIANCE_OF_THE_DAWN": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Radiance of the Dawn",
    "descriptions": [
      {
        "text": "You present your holy symbol, and any magical darkness within 30 feet of you is dispelled. Each hostile creature within 30 feet of you must make a Constitution saving throw. A creature takes 2d10+{{level:cleric}} radiant damage on a failed saving throw, and half as much damage on a successful one. A creature that has total cover from you is not affected.",
        "html": "You present your holy symbol, and any magical darkness within 30 feet of you is dispelled. Each hostile creature within 30 feet of you must make a Constitution saving throw. A creature takes 2d10+{{level:cleric}} radiant damage on a failed saving throw, and half as much damage on a successful one. A creature that has total cover from you is not affected."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_LIGHT_DOMAIN_IMPROVED_FLARE": {
    "descriptions": [
      {
        "text": "You can also use your Warding Flare feature when a creature that you can see within 30 feet of you attacks a creature other than you.",
        "html": "You can also use your Warding Flare feature when a creature that you can see within 30 feet of you attacks a creature other than you."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_LIGHT_DOMAIN_POTENT_SPELLCASTING": {
    "descriptions": [
      {
        "text": "+{{wisdom:modifier}} to the damage you deal with any cleric cantrip.",
        "html": "+{{wisdom:modifier}} to the damage you deal with any cleric cantrip."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_LIGHT_DOMAIN_CORONA_OF_LIGHT": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can activate an aura of sunlight that lasts for 1 minute or until you dismiss it using another action. You emit bright light in a 60-foot radius and dim light 30 feet beyond that. Your enemies in the bright light have disadvantage on saving throws against any spell that deals fire or radiant damage.",
        "html": "You can activate an aura of sunlight that lasts for 1 minute or until you dismiss it using another action. You emit bright light in a 60-foot radius and dim light 30 feet beyond that. Your enemies in the bright light have disadvantage on saving throws against any spell that deals fire or radiant damage."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_CLERIC_NATURE_DOMAIN": {
    "display": false,
    "descriptions": [
      {
        "text": "Gods of nature are as varied as the natural world itself, from inscrutable gods of the deep forests to friendly deities associated with particular springs and groves.",
        "html": "Gods of nature are as varied as the natural world itself, from inscrutable gods of the deep forests to friendly deities associated with particular springs and groves."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_NATURE_DOMAIN_ACOLYTE_OF_NATURE": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_NATURE_DOMAIN_BONUS_PROFICIENCY": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_NATURE_DOMAIN_CD_CHARM_ANIMALS_AND_PLANTS": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Charm Animals and Plants",
    "descriptions": [
      {
        "text": "You present your holy symbol and invoke the name of your deity. Each beast or plant creature that can see you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is charmed by you for 1 minute or until it takes damage. While it is charmed by you, it is friendly to you and other creatures you designate.",
        "html": "You present your holy symbol and invoke the name of your deity. Each beast or plant creature that can see you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is charmed by you for 1 minute or until it takes damage. While it is charmed by you, it is friendly to you and other creatures you designate."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_NATURE_DOMAIN_DAMPEN_ELEMENTS": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When you or a creature within 30 feet of you takes acid, cold, fire, lightning, or thunder damage, you can use your reaction to grant resistance to the creature against that instance of the damage.",
        "html": "When you or a creature within 30 feet of you takes acid, cold, fire, lightning, or thunder damage, you can use your reaction to grant resistance to the creature against that instance of the damage."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_NATURE_DOMAIN_DIVINE_STRIKE": {
    "descriptions": [
      {
        "text": "Once on each of your turn +1d8 cold, fire, or lightning damage with a weapon attack.",
        "html": "Once on each of your turn +1d8 cold, fire, or lightning damage with a weapon attack."
      },
      {
        "text": "Once on each of your turn +2d8 cold, fire, or lightning damage with a weapon attack.",
        "html": "Once on each of your turn +2d8 cold, fire, or lightning damage with a weapon attack.",
        "level": 14
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_NATURE_DOMAIN_MASTER_OF_NATURE": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "While creatures are charmed by your Charm Animals and Plants feature, you can take a bonus action on your turn to verbally command what each of those creatures will do on its next turn.",
        "html": "While creatures are charmed by your Charm Animals and Plants feature, you can take a bonus action on your turn to verbally command what each of those creatures will do on its next turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_CLERIC_TEMPEST_DOMAIN": {
    "display": false,
    "descriptions": [
      {
        "text": "Gods whose portfolios include the Tempest domain govern storms, sea, and sky.",
        "html": "Gods whose portfolios include the Tempest domain govern storms, sea, and sky."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_TEMPEST_DOMAIN_BONUS_PROFICIENCIES": {
    "display": false,
    "descriptions": [
      {
        "text": "You gain proficiency with martial weapons and heavy armor.",
        "html": "You gain proficiency with martial weapons and heavy armor."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_TEMPEST_DOMAIN_WRATH_OF_THE_STORM": {
    "action": "Reaction",
    "usage": "{{wrath of the storm:count}}/Long Rest.",
    "descriptions": [
      {
        "text": "When a creature within 5 feet of you that you can see hits you with an attack, you can use your reaction to cause the creature to make a Dexterity saving throw. The creature takes 2d8 lightning or thunder damage on a failed saving throw, and half as much damage on a successful one.",
        "html": "When a creature within 5 feet of you that you can see hits you with an attack, you can use your reaction to cause the creature to make a Dexterity saving throw. The creature takes 2d8 lightning or thunder damage on a failed saving throw, and half as much damage on a successful one."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_TEMPEST_DOMAIN_CD_DESTRUCTIVE_WRATH": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Destructive Wrath",
    "descriptions": [
      {
        "text": "When you roll lightning or thunder damage, you can use your Channel Divinity to deal maximum damage, instead of rolling.",
        "html": "When you roll lightning or thunder damage, you can use your Channel Divinity to deal maximum damage, instead of rolling."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_TEMPEST_DOMAIN_THUNDERBOLT_STRIKE": {
    "descriptions": [
      {
        "text": "When you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you.",
        "html": "When you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_TEMPEST_DOMAIN_DIVINE_STRIKE": {
    "descriptions": [
      {
        "text": "Once on each of your turn +1d8 thunder damage with a weapon attack.",
        "html": "Once on each of your turn +1d8 thunder damage with a weapon attack."
      },
      {
        "text": "Once on each of your turn +2d8 thunder damage with a weapon attack.",
        "html": "Once on each of your turn +2d8 thunder damage with a weapon attack.",
        "level": 14
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_TEMPEST_DOMAIN_STORMBORN": {
    "descriptions": [
      {
        "text": "You have a flying speed of {{speed}} ft. whenever you are not underground or indoors.",
        "html": "You have a flying speed of {{speed}} ft. whenever you are not underground or indoors."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_CLERIC_Trickery_DOMAIN": {
    "display": false,
    "descriptions": [
      {
        "text": "Gods of trickery are mischief-makers and instigators who stand as a constant challenge to the accepted order among both gods and mortals.",
        "html": "Gods of trickery are mischief-makers and instigators who stand as a constant challenge to the accepted order among both gods and mortals."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_TRICKERY_DOMAIN_BLESSING_OF_THE_TRICKSTER": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can touch a willing creature other than yourself to give it advantage on Stealth checks. This blessing lasts for 1 hour or until you use this feature again.",
        "html": "You can touch a willing creature other than yourself to give it advantage on Stealth checks. This blessing lasts for 1 hour or until you use this feature again."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_TRICKERY_DOMAIN_CD_INVOKE_DUPLICITY": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Invoke Duplicity",
    "descriptions": [
      {
        "text": "You create a perfect illusion of yourself that lasts for 1 minute, or until you lose your concentration. The illusion appears in an unoccupied space that you can see within 30 feet of you. As a bonus action on your turn, you can move the illusion up to 30 feet to a space you can see, but it must remain within 120 feet of you. For the duration, you can cast spells as though you were in the illusion’s space, but you must use your own senses. Additionally, when both you and your illusion are within 5 feet of a creature that can see the illusion, you have advantage on attack rolls against that creature, given how distracting the illusion is to the target.",
        "html": "You create a perfect illusion of yourself that lasts for 1 minute, or until you lose your concentration.\n\t\t\tThe illusion appears in an unoccupied space that you can see within 30 feet of you. As a bonus action on your turn, you can move the illusion up to 30 feet to a space you can see, but it must remain within 120 feet of you.\n\t\t\tFor the duration, you can cast spells as though you were in the illusion’s space, but you must use your own senses. Additionally, when both you and your illusion are within 5 feet of a creature that can see the illusion, you have advantage on attack rolls against that creature, given how distracting the illusion is to the target."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_TRICKERY_DOMAIN_CD_CLOAK_OF_SHADOWS": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Cloak of Shadows",
    "descriptions": [
      {
        "text": "You become invisible until the end of your next turn. You become visible if you attack or cast a spell.",
        "html": "You become invisible until the end of your next turn. You become visible if you attack or cast a spell."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_TRICKERY_DOMAIN_DIVINE_STRIKE": {
    "descriptions": [
      {
        "text": "Once on each of your turn +1d8 poison damage with a weapon attack.",
        "html": "Once on each of your turn +1d8 poison damage with a weapon attack."
      },
      {
        "text": "Once on each of your turn +2d8 poison damage with a weapon attack.",
        "html": "Once on each of your turn +2d8 poison damage with a weapon attack.",
        "level": 14
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_TRICKERY_DOMAIN_IMPROVED_DUPLICITY": {
    "descriptions": [
      {
        "text": "You can create up to four duplicates of yourself, instead of one, when you use Invoke Duplicity. As a bonus action on your turn, you can move any number of them up to 30 feet, to a maximum range of 120 feet.",
        "html": "You can create up to four duplicates of yourself, instead of one, when you use Invoke Duplicity.\n\t\t\tAs a bonus action on your turn, you can move any number of them up to 30 feet, to a maximum range of 120 feet."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_CLERIC_War_DOMAIN": {
    "display": false,
    "descriptions": [
      {
        "text": "The gods of war watch over warriors and reward them for their great deeds.",
        "html": "The gods of war watch over warriors and reward them for their great deeds."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAR_DOMAIN_BONUS_PROFICIENCIES": {
    "display": false,
    "descriptions": [
      {
        "text": "You gain proficiency with martial weapons and heavy armor.",
        "html": "You gain proficiency with martial weapons and heavy armor."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAR_DOMAIN_WAR_PRIEST": {
    "action": "Bonus Action",
    "usage": "{{war priest:count}}/Long Rest",
    "descriptions": [
      {
        "text": "When you use the Attack action, you can make one weapon attack.",
        "html": "When you use the Attack action, you can make one weapon attack."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAR_DOMAIN_CD_GUIDED_STRIKE": {
    "usage": "Channel Divinity",
    "alt": "Guided Strike",
    "descriptions": [
      {
        "text": "When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll.",
        "html": "When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAR_DOMAIN_CD_WAR_GODS_BLESSING": {
    "action": "Reaction",
    "usage": "Channel Divinity",
    "alt": "War God’s Blessing",
    "descriptions": [
      {
        "text": "When a creature within 30 feet of you makes an attack roll, you can use your reaction to grant that creature a +10 bonus to the roll.",
        "html": "When a creature within 30 feet of you makes an attack roll, you can use your reaction to grant that creature a +10 bonus to the roll."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAR_DOMAIN_DIVINE_STRIKE": {
    "descriptions": [
      {
        "text": "Once on each of your turn +1d8 damage of the same type dealt by the weapon with a weapon attack.",
        "html": "Once on each of your turn +1d8 damage of the same type dealt by the weapon with a weapon attack."
      },
      {
        "text": "Once on each of your turn +2d8 damage of the same type dealt by the weapon with a weapon attack.",
        "html": "Once on each of your turn +2d8 damage of the same type dealt by the weapon with a weapon attack.",
        "level": 14
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_WAR_DOMAIN_AVATAR_OF_BATTLE": {
    "descriptions": [
      {
        "text": "You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.",
        "html": "You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_ROGUE": {
    "display": false,
    "descriptions": [
      {
        "text": "A scoundrel who uses stealth and trickery to overcome obstacles and enemies.",
        "html": "A scoundrel who uses stealth and trickery to overcome obstacles and enemies."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_EXPERTISE": {
    "display": false,
    "descriptions": [
      {
        "text": "Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.",
        "html": "Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_SNEAKATTACK": {
    "descriptions": [
      {
        "text": "Once per turn, you can deal an extra {{sneak-attack:count}}d{{sneak-attack:die}} damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon. You don’t need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn’t incapacitated, and you don’t have disadvantage on the attack roll.",
        "html": "Once per turn, you can deal an extra {{sneak-attack:count}}d{{sneak-attack:die}} damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.\n\t\t\tYou don’t need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn’t incapacitated, and you don’t have disadvantage on the attack roll."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_THIEVES_CANT": {
    "descriptions": [
      {
        "text": "A secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves’ cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly. In addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves’ guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run.",
        "html": "A secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves’ cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly.\n\t\t\tIn addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves’ guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_CUNNINGACTION": {
    "descriptions": [
      {
        "text": "You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.",
        "html": "You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_ROGUISHARCHETYPE": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_ABILITYSCOREIMPROVEMENT_ROGUE": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_UNCANNY_DODGE": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When an attacker that you can see hits you with an attack, you can halve the attack’s damage against you.",
        "html": "When an attacker that you can see hits you with an attack, you can halve the attack’s damage against you."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_EVASION": {
    "descriptions": [
      {
        "text": "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.",
        "html": "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_RELIABLETALENT": {
    "descriptions": [
      {
        "text": "Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.",
        "html": "Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_BLINDSENSE": {
    "descriptions": [
      {
        "text": "If you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.",
        "html": "If you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_SLIPPERYMIND": {
    "display": false,
    "descriptions": [
      {
        "text": "You have acquired greater mental strength. You gain proficiency in Wisdom saving throws.",
        "html": "You have acquired greater mental strength. You gain proficiency in Wisdom saving throws."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_ELUSIVE": {
    "descriptions": [
      {
        "text": "No attack roll has advantage against you while you aren’t incapacitated.",
        "html": "No attack roll has advantage against you while you aren’t incapacitated."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ROGUE_STROKEOFLUCK": {
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20.",
        "html": "If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_THIEF": {
    "display": false,
    "descriptions": [
      {
        "text": "You hone your skills in the larcenous arts.",
        "html": "You hone your skills in the larcenous arts."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_THIEF_FASTHANDS": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "You can make a Sleight of Hand check, use your thieves’ tools to disarm a trap or open a lock, or take the Use an Object action.",
        "html": "You can make a Sleight of Hand check, use your thieves’ tools to disarm a trap or open a lock, or take the Use an Object action."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_THIEF_SECONDSTORYWORK": {
    "descriptions": [
      {
        "text": "Climbing no longer costs you extra movement. When you make a running jump, the distance you cover increases by {{dexterity:modifier}} feet.",
        "html": "Climbing no longer costs you extra movement. When you make a running jump, the distance you cover increases by {{dexterity:modifier}} feet."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_THIEF_SUPREMESNEAK": {
    "descriptions": [
      {
        "text": "You have advantage on a Stealth check if you move no more than half your speed on the same turn.",
        "html": "You have advantage on a Stealth check if you move no more than half your speed on the same turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_THIEF_USEMAGICDEVICE": {
    "descriptions": [
      {
        "text": "You ignore all class, race, and level requirements on the use of magic items.",
        "html": "You ignore all class, race, and level requirements on the use of magic items."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_THIEF_THIEFS_REFLEXES": {
    "descriptions": [
      {
        "text": "You can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10. You can’t use this feature when you are surprised.",
        "html": "You can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10. You can’t use this feature when you are surprised."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_ASSASSIN": {
    "display": false,
    "descriptions": [
      {
        "text": "You focus your training on the grim art of death.",
        "html": "You focus your training on the grim art of death."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_BONUSPROFICIENCIES": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ASSASSINATE": {
    "descriptions": [
      {
        "text": "You have advantage on attack rolls against any creature that hasn’t taken a turn in the combat yet. In addition, any hit you score against a creature that is surprised is a critical hit.",
        "html": "You have advantage on attack rolls against any creature that hasn’t taken a turn in the combat yet. In addition, any hit you score against a creature that is surprised is a critical hit."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_INFILTRATIONEXPERTISE": {
    "descriptions": [
      {
        "text": "You can unfailingly create false identities for yourself. You must spend seven days and 25 gp to establish the history, profession, and affiliations for an identity. You can’t establish an identity that belongs to someone else.",
        "html": "You can unfailingly create false identities for yourself. You must spend seven days and 25 gp to establish the history, profession, and affiliations for an identity. You can’t establish an identity that belongs to someone else."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_IMPOSTER": {
    "descriptions": [
      {
        "text": "You gain the ability to unerringly mimic another person’s speech, writing, and behavior. Your ruse is indiscernible to the casual observer. If a wary creature suspects something is amiss, you have advantage on any Deception check you make to avoid detection.",
        "html": "You gain the ability to unerringly mimic another person’s speech, writing, and behavior. Your ruse is indiscernible to the casual observer. If a wary creature suspects something is amiss, you have advantage on any Deception check you make to avoid detection."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_DEATHSTRIKE": {
    "descriptions": [
      {
        "text": "When you attack and hit a creature that is surprised, it must make a DC{{death strike:dc}} Constitution save. On a failed save, double the damage of your attack against the creature.",
        "html": "When you attack and hit a creature that is surprised, it must make a DC{{death strike:dc}} Constitution save. On a failed save, double the damage of your attack against the creature."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_ARCANE_TRICKSTER": {
    "display": false,
    "descriptions": [
      {
        "text": "You enhance you fine-honed skills of stealth and agility with magic, learning tricks of enchantment and illusion.",
        "html": "You enhance you fine-honed skills of stealth and agility with magic, learning tricks of enchantment and illusion."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ARCANE_TRICKSTER_SPELLCASTING": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ARCANE_TRICKSTER_MAGE_HAND_LEGERDEMAIN": {
    "descriptions": [
      {
        "text": "When you cast mage hand, you can make the spectral hand invisible, and you can perform the following additional tasks with it: You can stow one object the hand is holding in a container worn or carried by another creature, retrieve an object in a container worn or carried by another creature, or use thieves’ tools to pick locks and disarm traps at range. You can perform one of these tasks without being noticed by a creature if you succeed on a Sleight of Hand check contested by the creature’s Perception check. In addition, you can use the bonus action granted by your Cunning Action to control the hand.",
        "html": "When you cast mage hand, you can make the spectral hand invisible, and you can perform the following additional tasks with it: \n\t\t\tYou can stow one object the hand is holding in a container worn or carried by another creature, retrieve an object in a container worn or carried by another creature, or use thieves’ tools to pick locks and disarm traps at range.\n\t\t\tYou can perform one of these tasks without being noticed by a creature if you succeed on a Sleight of Hand check contested by the creature’s Perception check. In addition, you can use the bonus action granted by your Cunning Action to control the hand."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ARCANE_TRICKSTER_MAGICAL_AMBUSH": {
    "descriptions": [
      {
        "text": "If you are hidden from a creature when you cast a spell on it, the creature has disadvantage on any saving throw it makes against the spell this turn.",
        "html": "If you are hidden from a creature when you cast a spell on it, the creature has disadvantage on any saving throw it makes against the spell this turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ARCANE_TRICKSTER_VERSATILE_TRICKSTER": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "On your turn, you can designate a creature within 5 feet of the spectral hand created by the spell. Doing so gives you advantage on attack rolls against that creature until the end of the turn.",
        "html": "On your turn, you can designate a creature within 5 feet of the spectral hand created by the spell. Doing so gives you advantage on attack rolls against that creature until the end of the turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ARCANE_TRICKSTER_SPELL_THIEF": {
    "action": "Reaction",
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "Immediately after a creature casts a spell that targets you or includes you in its area of effect, you can force the creature to make a DC{{spellcasting:dc:int}} saving throw with its spellcasting ability modifier. On a failed save, you negate the spell’s effect against you, and you steal the knowledge of the spell if it is at least 1st level and of a level you can cast. For the next 8 hours, you know the spell and can cast it using your spell slots. The creature can’t cast that spell until the 8 hours have passed.",
        "html": "Immediately after a creature casts a spell that targets you or includes you in its area of effect, you can force the creature to make a DC{{spellcasting:dc:int}} saving throw with its spellcasting ability modifier. On a failed save, you negate the spell’s effect against you, and you steal the knowledge of the spell if it is at least 1st level and of a level you can cast. For the next 8 hours, you know the spell and can cast it using your spell slots. The creature can’t cast that spell until the 8 hours have passed."
      }
    ]
  },
  "ID_EXPERTISE_SKILL_ACROBATICS": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_ANIMALHANDLING": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_ARCANA": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_ATHLETICS": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_DECEPTION": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_HISTORY": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_INSIGHT": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_INTIMIDATION": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_INVESTIGATION": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_MEDICINE": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_NATURE": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_PERCEPTION": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_PERFORMANCE": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_PERSUASION": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_RELIGION": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_SLEIGHTOFHAND": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_STEALTH": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_SKILL_SURVIVAL": {
    "display": false,
    "descriptions": []
  },
  "ID_EXPERTISE_TOOL_THIEVES_TOOLS": {
    "descriptions": [
      {
        "text": "Your proficiency bonus is doubled for any Thieves’ Tools check you make.",
        "html": "Your proficiency bonus is doubled for any Thieves’ Tools check you make."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_WARLOCK": {
    "display": false,
    "descriptions": [
      {
        "text": "A wielder of magic that is derived from a bargain with an extraplanar entity.",
        "html": "A wielder of magic that is derived from a bargain with an extraplanar entity."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WARLOCK_OTHERWORLDLY_PATRON": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WARLOCK_SPELLCASTING_WARLOCK_PACT_MAGIC": {
    "display": false,
    "descriptions": [
      {
        "text": "Your arcane research and the magic bestowed on you by your patron have given you facility with spells. You have {{warlock:spellcasting:slots:count}} slots of level {{warlock:spellcasting:slot}}",
        "html": "Your arcane research and the magic bestowed on you by your patron have given you facility with spells. You have {{warlock:spellcasting:slots:count}} slots of level {{warlock:spellcasting:slot}}"
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WARLOCK_PACT_BOON": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WARLOCK_ABILITY_SCORE_IMPROVEMENT_WARLOCK": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WARLOCK_MYSTIC_ARCANUM": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You can cast your arcanum spells once without expending a spell slot.",
        "html": "You can cast your arcanum spells once without expending a spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WARLOCK_ELDRITCH_MASTER": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You can spend 1 minute entreating your patron for aid to regain all your expended spell slots from your Pact Magic feature.",
        "html": "You can spend 1 minute entreating your patron for aid to regain all your expended spell slots from your Pact Magic feature."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WARLOCK_PACT_BOON_PACT_OF_THE_CHAIN": {
    "descriptions": [
      {
        "text": "You learn the find familiar spell and can cast it as a ritual. Additionally, when you take the Attack action, you can forgo one of your own attacks to allow your familiar to make one attack with its reaction.",
        "html": "You learn the find familiar spell and can cast it as a ritual.\n\t\t\tAdditionally, when you take the Attack action, you can forgo one of your own attacks to allow your familiar to make one attack with its reaction."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WARLOCK_PACT_BOON_PACT_OF_THE_TOME": {
    "descriptions": [
      {
        "text": "Your patron gives you a grimoire called a Book of Shadows. If you lose it, you can perform a 1-hour ceremony to receive a replacement from your patron. This ceremony can be performed during a short or long rest, and it destroys the previous book. The book turns to ash when you die.",
        "html": "Your patron gives you a grimoire called a Book of Shadows. \n\t\t\tIf you lose it, you can perform a 1-hour ceremony to receive a replacement from your patron. This ceremony can be performed during a short or long rest, and it destroys the previous book. The book turns to ash when you die."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_WARLOCK_PACT_BOON_PACT_OF_THE_BLADE": {
    "usage": "Action",
    "descriptions": [
      {
        "text": "Create a pact weapon in your empty hand. This weapon counts as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. Your pact weapon disappears if it is more than 5 feet away from you for 1 minute or more. It also disappears if you use this feature again, if you dismiss the weapon (no action required), or if you die. You can transform one magic weapon into your pact weapon by performing a special ritual while you hold the weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest. You can then dismiss the weapon, shunting it into an extradimensional space, and it appears whenever you create your pact weapon thereafter. You can’t affect an artifact or a sentient weapon in this way. The weapon ceases being your pact weapon if you die, if you perform the 1-hour ritual on a different weapon, or if you use a 1-hour ritual to break your bond to it. The weapon appears at your feet if it is in the extradimensional space when the bond breaks.",
        "html": "Create a pact weapon in your empty hand. This weapon counts as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.\n\t\t\tYour pact weapon disappears if it is more than 5 feet away from you for 1 minute or more. It also disappears if you use this feature again, if you dismiss the weapon (no action required), or if you die.\n\t\t\tYou can transform one magic weapon into your pact weapon by performing a special ritual while you hold the weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest. You can then dismiss the weapon, shunting it into an extradimensional space, and it appears whenever you create your pact weapon thereafter. You can’t affect an artifact or a sentient weapon in this way. The weapon ceases being your pact weapon if you die, if you perform the 1-hour ritual on a different weapon, or if you use a 1-hour ritual to break your bond to it. The weapon appears at your feet if it is in the extradimensional space when the bond breaks."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_AGONIZING_BLAST": {
    "descriptions": [
      {
        "text": "When you cast eldritch blast, add {{agonizing blast:damage}} to the damage it deals on a hit.",
        "html": "When you cast eldritch blast, add {{agonizing blast:damage}} to the damage it deals on a hit."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_ARMOR_OF_SHADOWS": {
    "descriptions": [
      {
        "text": "You can cast mage armor on yourself at will, without expending a spell slot or material components.",
        "html": "You can cast mage armor on yourself at will, without expending a spell slot or material components."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_ASCENDANT_STEP": {
    "descriptions": [
      {
        "text": "You can cast levitate on yourself at will, without expending a spell slot or material components.",
        "html": "You can cast levitate on yourself at will, without expending a spell slot or material components."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_BEAST_SPEECH": {
    "descriptions": [
      {
        "text": "You can cast speak with animals at will, without expending a spell slot.",
        "html": "You can cast speak with animals at will, without expending a spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_BEGUILING_INFLUENCE": {
    "display": false,
    "descriptions": [
      {
        "text": "You gain proficiency in the Deception and Persuasion skills.",
        "html": "You gain proficiency in the Deception and Persuasion skills."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_BEWITCHING_WHISPERS": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You can cast compulsion once using a warlock spell slot.",
        "html": "You can cast compulsion once using a warlock spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_BOOK_OF_ANCIENT_SECRETS": {
    "descriptions": [
      {
        "text": "With your Book of Shadows in hand, you can cast the chosen spells as rituals. On your adventures, you can add other ritual spells to your Book of Shadows. When you find such a spell, you can add it to the book if the spell’s level is equal to or less than {{level:warlock:half:up}} and if you can spare the time to transcribe the spell. For each level of the spell, the transcription process takes 2 hours and costs 50 gp for the rare inks needed to inscribe it.",
        "html": "With your Book of Shadows in hand, you can cast the chosen spells as rituals.\n\t\t\tOn your adventures, you can add other ritual spells to your Book of Shadows. When you find such a spell, you can add it to the book if the spell’s level is equal to or less than {{level:warlock:half:up}} and if you can spare the time to transcribe the spell. For each level of the spell, the transcription process takes 2 hours and costs 50 gp for the rare inks needed to inscribe it."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_CHAINS_OF_CARCERI": {
    "descriptions": [
      {
        "text": "You can cast hold monster at will—targeting a celestial, fiend, or elemental—without expending a spell slot or material components. You must finish a long rest before you can use this invocation on the same creature again.",
        "html": "You can cast hold monster at will—targeting a celestial, fiend, or elemental—without expending a spell slot or material components. You must finish a long rest before you can use this invocation on the same creature again."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_DEVILS_SIGHT": {
    "descriptions": [
      {
        "text": "You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.",
        "html": "You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_DREADFUL_WORD": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You can cast confusion once using a warlock spell slot.",
        "html": "You can cast confusion once using a warlock spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_ELDRITCH_SIGHT": {
    "descriptions": [
      {
        "text": "You can cast detect magic at will, without expending a spell slot.",
        "html": "You can cast detect magic at will, without expending a spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_Eldritch_Spear": {
    "descriptions": [
      {
        "text": "When you cast eldritch blast, its range is 300 feet.",
        "html": "When you cast eldritch blast, its range is 300 feet."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_EYES_OF_THE_RUNEKEEPER": {
    "descriptions": [
      {
        "text": "You can read all writing.",
        "html": "You can read all writing."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_FIENDISH_VIGOR": {
    "descriptions": [
      {
        "text": "You can cast false life on yourself at will, without expending a spell slot or material components.",
        "html": "You can cast false life on yourself at will, without expending a spell slot or material components."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_GAZE_OF_TWO_MINDS": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can touch a willing humanoid and perceive through its senses until the end of your next turn. As long as the creature is on the same plane of existence as you, you can use your action on subsequent turns to maintain this connection, extending the duration until the end of your next turn. While perceiving through the other creature’s senses, you benefit from any special senses possessed by that creature, and you are blinded and deafened to your own surroundings.",
        "html": "You can touch a willing humanoid and perceive through its senses until the end of your next turn. As long as the creature is on the same plane of existence as you, you can use your action on subsequent turns to maintain this connection, extending the duration until the end of your next turn. While perceiving through the other creature’s senses, you benefit from any special senses possessed by that creature, and you are blinded and deafened to your own surroundings."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_LIFEDRINKER": {
    "descriptions": [
      {
        "text": "When you hit a creature with your pact weapon, the creature takes {{lifedrinker:damage}} extra necrotic damage.",
        "html": "When you hit a creature with your pact weapon, the creature takes {{lifedrinker:damage}} extra necrotic damage."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_MASK_OF_MANY_FACES": {
    "descriptions": [
      {
        "text": "You can cast disguise self at will, without expending a spell slot.",
        "html": "You can cast disguise self at will, without expending a spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_MASTER_OF_MYRIAD_FORMS": {
    "descriptions": [
      {
        "text": "You can cast alter self at will, without expending a spell slot.",
        "html": "You can cast alter self at will, without expending a spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_MINIONS_OF_CHAOS": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You can cast conjure elemental once using a warlock spell slot.",
        "html": "You can cast conjure elemental once using a warlock spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_MIRE_THE_MIND": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You can cast slow once using a warlock spell slot.",
        "html": "You can cast slow once using a warlock spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_MISTY_VISIONS": {
    "descriptions": [
      {
        "text": "You can cast silent image at will, without expending a spell slot or material components.",
        "html": "You can cast silent image at will, without expending a spell slot or material components."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_ONE_WITH_SHADOWS": {
    "action": "Action",
    "descriptions": [
      {
        "text": "When you are in an area of dim light or darkness, you can become invisible until you move or take an action or a reaction.",
        "html": "When you are in an area of dim light or darkness, you can become invisible until you move or take an action or a reaction."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_OTHERWORLDLY_LEAP": {
    "descriptions": [
      {
        "text": "You can cast jump on yourself at will, without expending a spell slot or material components.",
        "html": "You can cast jump on yourself at will, without expending a spell slot or material components."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_REPELLING_BLAST": {
    "descriptions": [
      {
        "text": "When you hit a creature with eldritch blast, you can push the creature up to 10 feet away from you in a straight line.",
        "html": "When you hit a creature with eldritch blast, you can push the creature up to 10 feet away from you in a straight line."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_SCULPTOR_OF_FLESH": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You can cast polymorph once using a warlock spell slot.",
        "html": "You can cast polymorph once using a warlock spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_SIGN_OF_ILL_OMEN": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You can cast bestow curse once using a warlock spell slot.",
        "html": "You can cast bestow curse once using a warlock spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_THIEF_OF_FIVE_FATES": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You can cast bane once using a warlock spell slot.",
        "html": "You can cast bane once using a warlock spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_THIRSTING_BLADE": {
    "descriptions": [
      {
        "text": "You can attack with your pact weapon twice, instead of once, whenever you take the Attack action on your turn.",
        "html": "You can attack with your pact weapon twice, instead of once, whenever you take the Attack action on your turn."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_VISIONS_OF_DISTANT_REALMS": {
    "descriptions": [
      {
        "text": "You can cast arcane eye at will, without expending a spell slot.",
        "html": "You can cast arcane eye at will, without expending a spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_VOICE_OF_THE_CHAIN_MASTER": {
    "descriptions": [
      {
        "text": "You can communicate telepathically with your familiar and perceive through your familiar’s senses as long as you are on the same plane of existence. Additionally, while perceiving through your familiar’s senses, you can also speak through your familiar in your own voice, even if your familiar is normally incapable of speech.",
        "html": "You can communicate telepathically with your familiar and perceive through your familiar’s senses as long as you are on the same plane of existence. Additionally, while perceiving through your familiar’s senses, you can also speak through your familiar in your own voice, even if your familiar is normally incapable of speech."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_WHISPERS_OF_THE_GRAVE": {
    "descriptions": [
      {
        "text": "You can cast speak with dead at will, without expending a spell slot.",
        "html": "You can cast speak with dead at will, without expending a spell slot."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_ELDRITCH_INVOCATION_WITCH_SIGHT": {
    "descriptions": [
      {
        "text": "You can see the true form of any shapechanger or creature concealed by illusion or transmutation magic while the creature is within 30 feet of you and within line of sight.",
        "html": "You can see the true form of any shapechanger or creature concealed by illusion or transmutation magic while the creature is within 30 feet of you and within line of sight."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_OTHERWORLDLY_PATRON_FIEND": {
    "display": false,
    "descriptions": [
      {
        "text": "You have made a pact with a fiend from the lower planes of existence.",
        "html": "You have made a pact with a fiend from the lower planes of existence."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_FIEND_EXPANDED_SPELL_LIST": {
    "display": false,
    "descriptions": [
      {
        "text": "The Fiend lets you choose from an expanded list of spells when you learn a warlock spell.",
        "html": "The Fiend lets you choose from an expanded list of spells when you learn a warlock spell."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_FIEND_DARKONESBLESSING": {
    "descriptions": [
      {
        "text": "When you reduce a hostile creature to 0 hit points, you gain {{dark ones blessing:temp hp}} temporary hp.",
        "html": "When you reduce a hostile creature to 0 hit points, you gain {{dark ones blessing:temp hp}} temporary hp."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_FIEND_DARKONESOWNLUCK": {
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll.",
        "html": "When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_FIEND_FIENDISH_RESILIENCE": {
    "descriptions": [
      {
        "text": "You can choose one damage type when you finish a short or long rest. You gain resistance to that damage type until you choose a different one with this feature. Damage from magical weapons or silver weapons ignores this resistance.",
        "html": "You can choose one damage type when you finish a short or long rest. You gain resistance to that damage type until you choose a different one with this feature. Damage from magical weapons or silver weapons ignores this resistance."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_FIEND_HURL_THROUGH_HELL": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "When you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears. At the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a fiend, it takes 10d10 psychic damage.",
        "html": "When you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears.\n\t\t\tAt the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a fiend, it takes 10d10 psychic damage."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_OTHERWORLDLY_PATRON_THE_ARCHFEY": {
    "display": false,
    "descriptions": [
      {
        "text": "Your patron is a lord or lady of the fey, a creature of legend who holds secrets that were forgotten before the mortal races were born.",
        "html": "Your patron is a lord or lady of the fey, a creature of legend who holds secrets that were forgotten before the mortal races were born."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ARCHFEY_EXPANDED_SPELL_LIST": {
    "display": false,
    "descriptions": [
      {
        "text": "The Archfey lets you choose from an expanded list of spells when you learn a warlock spell.",
        "html": "The Archfey lets you choose from an expanded list of spells when you learn a warlock spell."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ARCHFEY_FEY_PRESENCE": {
    "action": "Action",
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "You can cause each creature in a 10-foot cube originating from you to make a Wisdom saving throw. The creatures that fail their saving throws are all charmed or frightened by you until the end of your next turn.",
        "html": "You can cause each creature in a 10-foot cube originating from you to make a Wisdom saving throw. The creatures that fail their saving throws are all charmed or frightened by you until the end of your next turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ARCHFEY_MISTY_ESCAPE": {
    "action": "Reaction",
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "When you take damage, you can turn invisible and teleport up to 60 feet to an unoccupied space you can see. You remain invisible until the start of your next turn or until you attack or cast a spell.",
        "html": "When you take damage, you can turn invisible and teleport up to 60 feet to an unoccupied space you can see. You remain invisible until the start of your next turn or until you attack or cast a spell."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ARCHFEY_BEGUILING_DEFENSES": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "You are immune to being charmed, and when another creature attempts to charm you, you can attempt to turn the charm back on that creature. The creature must succeed on a Wisdom saving throw or be charmed by you for 1 minute or until the creature takes any damage.",
        "html": "You are immune to being charmed, and when another creature attempts to charm you, you can attempt to turn the charm back on that creature. The creature must succeed on a Wisdom saving throw or be charmed by you for 1 minute or until the creature takes any damage."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_ARCHFEY_DARK_DELIRIUM": {
    "action": "Action",
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "Choose a creature that you can see within 60 feet of you. It must make a Wisdom saving throw. On a failed save, it is charmed or frightened by you for 1 minute or until your concentration is broken. This effect ends early if the creature takes any damage.",
        "html": "Choose a creature that you can see within 60 feet of you. It must make a Wisdom saving throw. On a failed save, it is charmed or frightened by you for 1 minute or until your concentration is broken. This effect ends early if the creature takes any damage."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_OTHERWORLDLY_PATRON_THE_GREAT_OLD_ONE": {
    "display": false,
    "descriptions": [
      {
        "text": "Your patron is a mysterious entity whose nature is utterly foreign to the fabric of reality.",
        "html": "Your patron is a mysterious entity whose nature is utterly foreign to the fabric of reality."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_GREATOLDONE_EXPANDED_SPELL_LIST": {
    "display": false,
    "descriptions": [
      {
        "text": "The Great Old One lets you choose from an expanded list of spells when you learn a warlock spell.",
        "html": "The Great Old One lets you choose from an expanded list of spells when you learn a warlock spell."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_GREATOLDONE_AWAKEND_MIND": {
    "descriptions": [
      {
        "text": "You can communicate telepathically with any creature you can see within 30 feet of you. You don’t need to share a language with the creature for it to understand your telepathic utterances, but the creature must be able to understand at least one language.",
        "html": "You can communicate telepathically with any creature you can see within 30 feet of you. You don’t need to share a language with the creature for it to understand your telepathic utterances, but the creature must be able to understand at least one language."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_GREATOLDONE_ENTROPIC_WARD": {
    "action": "Reaction",
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "When a creature makes an attack roll against you, you can impose disadvantage on that roll. If the attack misses you, your next attack roll against the creature has advantage if you make it before the end of your next turn.",
        "html": "When a creature makes an attack roll against you, you can impose disadvantage on that roll. If the attack misses you, your next attack roll against the creature has advantage if you make it before the end of your next turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_GREATOLDONE_THOUGHT_SHIELD": {
    "descriptions": [
      {
        "text": "Whenever a creature deals psychic damage to you, that creature takes the same amount of damage that you do.",
        "html": "Whenever a creature deals psychic damage to you, that creature takes the same amount of damage that you do."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_GREATOLDONE_CREATE_THRALL": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can touch an incapacitated humanoid. That creature is then charmed by you until a remove curse spell is cast on it, the charmed condition is removed from it, or you use this feature again. You can communicate telepathically with the charmed creature as long as the two of you are on the same plane of existence.",
        "html": "You can touch an incapacitated humanoid. That creature is then charmed by you until a remove curse spell is cast on it, the charmed condition is removed from it, or you use this feature again. You can communicate telepathically with the charmed creature as long as the two of you are on the same plane of existence."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_BARBARIAN": {
    "display": false,
    "descriptions": [
      {
        "text": "A fierce warrior of primitive background who can enter a battle rage.",
        "html": "A fierce warrior of primitive background who can enter a battle rage."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_RAGE": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "Advantage on Strength checks and Strength Saves. A +{{barbarian rage:damage}} to damage rolls with strength melee weapon attacks. You have resistance to bludgeoning, piercing, and slashing damage.",
        "html": "Advantage on Strength checks and Strength Saves. \n\t\t\tA +{{barbarian rage:damage}} to damage rolls with strength melee weapon attacks. \n\t\t\tYou have resistance to bludgeoning, piercing, and slashing damage.",
        "usage": "{{barbarian rage:count}}/Long Rest"
      },
      {
        "text": "Advantage on Strength checks and Strength Saves. A +{{barbarian rage:damage}} to damage rolls with strength melee weapon attacks. You have resistance to bludgeoning, piercing, and slashing damage.",
        "html": "Advantage on Strength checks and Strength Saves. \n\t\t\tA +{{barbarian rage:damage}} to damage rolls with strength melee weapon attacks. \n\t\t\tYou have resistance to bludgeoning, piercing, and slashing damage.",
        "level": 20,
        "usage": "Unlimited"
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_UNARMORED_DEFENCE": {
    "descriptions": [
      {
        "text": "While you aren’t wearing armor, your AC equals {{ac:unarmored defense barbarian}}. You can use a shield and still gain this benefit.",
        "html": "While you aren’t wearing armor, your AC equals {{ac:unarmored defense barbarian}}. You can use a shield and still gain this benefit."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_RECKLESS_ATTACK": {
    "descriptions": [
      {
        "text": "When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.",
        "html": "When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_DANGER_SENSE": {
    "descriptions": [
      {
        "text": "You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can’t be blinded, deafened, or incapacitated.",
        "html": "You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can’t be blinded, deafened, or incapacitated."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_PRIMAL_PATH": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_ABILITYSCOREIMPROVEMENT": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_EXTRA_ATTACK": {
    "descriptions": [
      {
        "text": "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
        "html": "You can attack twice, instead of once, whenever you take the Attack action on your turn."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_FAST_MOVEMENT": {
    "descriptions": [
      {
        "text": "Your speed increases by 10 feet while you aren’t wearing heavy armor.",
        "html": "Your speed increases by 10 feet while you aren’t wearing heavy armor."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_FERAL_INSTINCT": {
    "descriptions": [
      {
        "text": "You have advantage on initiative rolls. If you are surprised at the beginning of combat and aren’t incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.",
        "html": "You have advantage on initiative rolls. \n\t\t\tIf you are surprised at the beginning of combat and aren’t incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_BRUTAL_CRITICAL": {
    "descriptions": [
      {
        "text": "One additional weapon damage die when determining the extra damage for a critical hit with a melee attack.",
        "html": "One additional weapon damage die when determining the extra damage for a critical hit with a melee attack."
      },
      {
        "text": "Two additional weapon damage die when determining the extra damage for a critical hit with a melee attack.",
        "html": "Two additional weapon damage die when determining the extra damage for a critical hit with a melee attack.",
        "level": 13
      },
      {
        "text": "Three additional weapon damage die when determining the extra damage for a critical hit with a melee attack.",
        "html": "Three additional weapon damage die when determining the extra damage for a critical hit with a melee attack.",
        "level": 17
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_RELENTLESS_RAGE": {
    "descriptions": [
      {
        "text": "If you drop to 0 hp while you’re raging and don’t die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hp instead. Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.",
        "html": "If you drop to 0 hp while you’re raging and don’t die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hp instead. Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_PERSISTANT_RAGE": {
    "descriptions": [
      {
        "text": "Your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.",
        "html": "Your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_INDOMITABLE_MIGHT": {
    "descriptions": [
      {
        "text": "If your total for a Strength check is less than {{strength:score}}, you can use {{strength:score}} place of the total.",
        "html": "If your total for a Strength check is less than {{strength:score}}, you can use {{strength:score}} place of the total."
      }
    ]
  },
  "ID_WOTC_PHB_CLASS_FEATURE_BARBARIAN_PRIMAL_CHAMPION": {
    "display": false,
    "descriptions": [
      {
        "text": "You embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24.",
        "html": "You embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_PATH_OF_THE_BERSERKER": {
    "display": false,
    "descriptions": [
      {
        "text": "The Path of the Berserker is a path of untrammeled fury, slick with blood.",
        "html": "The Path of the Berserker is a path of untrammeled fury, slick with blood."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_BERSERKER_FRENZY": {
    "descriptions": [
      {
        "text": "For the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.",
        "html": "For the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_BERSERKER_MINDLESS_RAGE": {
    "descriptions": [
      {
        "text": "You can’t be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.",
        "html": "You can’t be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_BERSERKER_INTIMIDATING_PRESENCE": {
    "action": "Action",
    "descriptions": [
      {
        "text": "Choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a DC{{intimidating presence:dc}} Wisdom saving throw or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you. If the creature succeeds on its saving throw, you can't use this feature on that creature again for 24 hours.",
        "html": "Choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a DC{{intimidating presence:dc}} Wisdom saving throw or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you.\n\t\t\tIf the creature succeeds on its saving throw, you can't use this feature on that creature again for 24 hours."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_BERSERKER_RETALIATION": {
    "action": "Reaction",
    "descriptions": [
      {
        "text": "When you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.",
        "html": "When you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_PATH_OF_THE_TOTEM_WARRIOR": {
    "display": false,
    "descriptions": [
      {
        "text": "The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as guide, protector, and inspiration.",
        "html": "The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as guide, protector, and inspiration."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_SPIRIT_SEEKER": {
    "descriptions": [
      {
        "text": "You can cast beast sense and speak with animals as rituals",
        "html": "You can cast beast sense and speak with animals as rituals"
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_TOTEM_SPIRIT": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_ASPECT_OF_THE_BEAST": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_SPIRIT_WALKER": {
    "descriptions": [
      {
        "text": "You can cast the commune with nature spell, but only as a ritual. A spiritual version of one of the animals you chose for Totem Spirit or Aspect of the Beast appears to you to convey the information you seek.",
        "html": "You can cast the commune with nature spell, but only as a ritual. A spiritual version of one of the animals you chose for Totem Spirit or Aspect of the Beast appears to you to convey the information you seek."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_TOTEMIC_ATTUNEMENT": {
    "display": false,
    "descriptions": []
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_TOTEM_SPIRIT_BEAR": {
    "descriptions": [
      {
        "text": "While raging, you have resistance to all damage except psychic damage.",
        "html": "While raging, you have resistance to all damage except psychic damage."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_TOTEM_SPIRIT_EAGLE": {
    "descriptions": [
      {
        "text": "While you're raging and aren't wearing any armor, other creatures have disadvantage on opportunity attack rolls against you, and you can use the Dash Action as a bonus action on your turn.",
        "html": "While you're raging and aren't wearing any armor, other creatures have disadvantage on opportunity attack rolls against you, and you can use the Dash Action as a bonus action on your turn."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_TOTEM_SPIRIT_WOLF": {
    "descriptions": [
      {
        "text": "While you're raging, your friends have advantage on melee attack rolls against any creature within 5 feet of you that is hostile to you.",
        "html": "While you're raging, your friends have advantage on melee attack rolls against any creature within 5 feet of you that is hostile to you."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_ASPECT_OF_THE_BEAST_BEAR": {
    "descriptions": [
      {
        "text": "Your carrying capacity is doubled, and you have advantage on Strength checks made to push, pull, lift, or break objects.",
        "html": "Your carrying capacity is doubled, and you have advantage on Strength checks made to push, pull, lift, or break objects."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_ASPECT_OF_THE_BEAST_EAGLE": {
    "descriptions": [
      {
        "text": "You can see up to 1 mile away with no difficulty, able to discern even fine details as though looking at something no more than 100 feet away from you. Additionally, dim light doesn't impose disadvantage on your Perception checks.",
        "html": "You can see up to 1 mile away with no difficulty, able to discern even fine details as though looking at something no more than 100 feet away from you. Additionally, dim light doesn't impose disadvantage on your Perception checks."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_ASPECT_OF_THE_BEAST_WOLF": {
    "descriptions": [
      {
        "text": "You can track other creatures while traveling at a fast pace, and you can move stealthily while traveling at a normal pace.",
        "html": "You can track other creatures while traveling at a fast pace, and you can move stealthily while traveling at a normal pace."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_TOTEMIC_ATTUNEMENT_BEAR": {
    "descriptions": [
      {
        "text": "While you’re raging, any creature within 5 feet of you that’s hostile to you has disadvantage on attack rolls against targets other than you or another character with this feature. An enemy is immune to this effect if it can’t see or hear you or if it can’t be frightened.",
        "html": "While you’re raging, any creature within 5 feet of you that’s hostile to you has disadvantage on attack rolls against targets other than you or another character with this feature. An enemy is immune to this effect if it can’t see or hear you or if it can’t be frightened."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_TOTEMIC_ATTUNEMENT_EAGLE": {
    "descriptions": [
      {
        "text": "While raging, you have a {{speed}} ft. flying speed. This benefit works only in short bursts; you fall if you end your turn in the air and nothing else is holding you aloft.",
        "html": "While raging, you have a {{speed}} ft. flying speed. This benefit works only in short bursts; you fall if you end your turn in the air and nothing else is holding you aloft."
      }
    ]
  },
  "ID_WOTC_PHB_ARCHETYPE_FEATURE_PATH_OF_THE_TOTEM_WARRIOR_TOTEMIC_ATTUNEMENT_WOLF": {
    "action": "Bonus Action",
    "descriptions": [
      {
        "text": "While you’re raging, you can knock a Large or smaller creature prone when you hit it with melee weapon attack.",
        "html": "While you’re raging, you can knock a Large or smaller creature prone when you hit it with melee weapon attack."
      }
    ]
  },
  "ID_RACE_HALFORC": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_MENACING": {
    "display": false,
    "descriptions": [
      {
        "text": "You gain proficiency in the Intimidation skill.",
        "html": "You gain proficiency in the Intimidation skill."
      }
    ]
  },
  "ID_RACIAL_TRAIT_RELENTLESS_ENDURANCE": {
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "When you are reduced to 0 hps but not killed outright, you can drop to 1 hp instead.",
        "html": "When you are reduced to 0 hps but not killed outright, you can drop to 1 hp instead."
      }
    ]
  },
  "ID_RACIAL_TRAIT_SAVAGE_ATTACKS": {
    "descriptions": [
      {
        "text": "When you score a critical hit with a melee weapon attack, you can roll one of the weapon’s damage dice one additional time and add it to the extra damage of the critical hit.",
        "html": "When you score a critical hit with a melee weapon attack, you can roll one of the weapon’s damage dice one additional time and add it to the extra damage of the critical hit."
      }
    ]
  },
  "ID_RACE_GNOME": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_GNOME_CUNNING": {
    "descriptions": [
      {
        "text": "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.",
        "html": "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic."
      }
    ]
  },
  "ID_RACIAL_TRAIT_GNOME_SUBRACE": {
    "display": false,
    "descriptions": []
  },
  "ID_SUB_RACE_FOREST_GNOME": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_NATURAL_ILLUSIONIST": {
    "descriptions": [
      {
        "text": "You know the minor illusion cantrip. Intelligence is your spellcasting ability for it.",
        "html": "You know the minor illusion cantrip. Intelligence is your spellcasting ability for it."
      }
    ]
  },
  "ID_RACIAL_TRAIT_SPEAK_WITH_SMALL_BEASTS": {
    "descriptions": [
      {
        "text": "Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.",
        "html": "Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts."
      }
    ]
  },
  "ID_SUB_RACE_ROCK_GNOME": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_ARTIFICERS_LORE": {
    "descriptions": [
      {
        "text": "Whenever you make a History check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus, instead of any proficiency bonus you normally apply.",
        "html": "Whenever you make a History check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus, instead of any proficiency bonus you normally apply."
      }
    ]
  },
  "ID_RACIAL_TRAIT_TINKER": {
    "descriptions": [
      {
        "text": "Using tinker’s tools, you can construct a Tiny clockwork device. You can have up to three such devices active at a time.",
        "html": "Using tinker’s tools, you can construct a Tiny clockwork device. You can have up to three such devices active at a time."
      }
    ]
  },
  "ID_SRD_RACE_DWARF": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_DWARVEN_RESILIENCE": {
    "descriptions": [
      {
        "text": "You have advantage on saving throws against poison, and you have resistance against poison damage.",
        "html": "You have advantage on saving throws against poison, and you have resistance against poison damage."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DWARVEN_COMBAT_TRAINING": {
    "display": false,
    "descriptions": [
      {
        "text": "You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.",
        "html": "You have proficiency with the battleaxe, handaxe, light hammer, and warhammer."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DWARVEN_TOOL_PROFICIENCY": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_STONECUNNING": {
    "descriptions": [
      {
        "text": "A +{{stonecunning:check}} on History checks related to origin of stonework.",
        "html": "A +{{stonecunning:check}} on History checks related to origin of stonework."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DWARVEN_SUBRACE": {
    "display": false,
    "descriptions": []
  },
  "ID_SUB_RACE_HILL_DWARF": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_DWARVEN_TOUGHNESS": {
    "display": false,
    "descriptions": [
      {
        "text": "Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.",
        "html": "Your hit point maximum increases by 1, and it increases by 1 every time you gain a level."
      }
    ]
  },
  "ID_SUB_RACE_MOUNTAIN_DWARF": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_DWARVEN_ARMOR_TRAINING": {
    "display": false,
    "descriptions": [
      {
        "text": "You have proficiency with light and medium armor.",
        "html": "You have proficiency with light and medium armor."
      }
    ]
  },
  "ID_RACE_TIEFLING": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_HELLISH_RESISTANCE": {
    "descriptions": [
      {
        "text": "You have resistance to fire damage.",
        "html": "You have resistance to fire damage."
      }
    ]
  },
  "ID_RACIAL_TRAIT_INFERNAL_LEGACY": {
    "descriptions": [
      {
        "text": "You know the thaumaturgy cantrip. (Charisma)",
        "html": "You know the thaumaturgy cantrip. (Charisma)"
      },
      {
        "text": "You know the thaumaturgy cantrip. You can cast the hellish rebuke spell as a 2nd-level spell (1/long rest). (Charisma)",
        "html": "You know the thaumaturgy cantrip. You can cast the hellish rebuke spell as a 2nd-level spell (1/long rest). (Charisma)",
        "level": 3
      },
      {
        "text": "You know the thaumaturgy cantrip. You can cast the hellish rebuke spell as a 2nd-level spell and the darkness spell (1/long rest). (Charisma)",
        "html": "You know the thaumaturgy cantrip. You can cast the hellish rebuke spell as a 2nd-level spell and the darkness spell (1/long rest). (Charisma)",
        "level": 5
      }
    ]
  },
  "ID_RACE_HALFLING": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_LUCKY": {
    "descriptions": [
      {
        "text": "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.",
        "html": "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll."
      }
    ]
  },
  "ID_RACIAL_TRAIT_BRAVE": {
    "descriptions": [
      {
        "text": "You have advantage on saving throws against being frightened.",
        "html": "You have advantage on saving throws against being frightened."
      }
    ]
  },
  "ID_RACIAL_TRAIT_HALFLING_NIMBLENESS": {
    "descriptions": [
      {
        "text": "You can move through the space of any creature that is of a size larger than yours.",
        "html": "You can move through the space of any creature that is of a size larger than yours."
      }
    ]
  },
  "ID_RACIAL_TRAIT_HALFLING_SUBRACE": {
    "display": false,
    "descriptions": []
  },
  "ID_SUB_RACE_LIGHTFOOT_HALFLING": {
    "display": false,
    "descriptions": []
  },
  "ID_SUB_RACE_STOUT_HALFLING": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_NATURALLY_STEALTHY": {
    "descriptions": [
      {
        "text": "You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.",
        "html": "You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you."
      }
    ]
  },
  "ID_RACIAL_TRAIT_STOUT_RESILIENCE": {
    "descriptions": [
      {
        "text": "You have advantage on saving throws against poison, and you have resistance against poison damage.",
        "html": "You have advantage on saving throws against poison, and you have resistance against poison damage."
      }
    ]
  },
  "ID_RACE_DRAGONBORN": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_BREATH_WEAPON": {
    "action": "Action",
    "usage": "1/Short Rest",
    "descriptions": [
      {
        "text": "Exhale destructive energy. Your breath weapon does {{breath-weapon:dice count}}d{{breath-weapon:dice size}} {{draconic-ancestry:damage type}} damage in a {{draconic-ancestry:breath}} DC {{breath-weapon:dc}}",
        "html": "Exhale destructive energy. Your breath weapon does {{breath-weapon:dice count}}d{{breath-weapon:dice size}} {{draconic-ancestry:damage type}} damage in a {{draconic-ancestry:breath}} DC {{breath-weapon:dc}}"
      }
    ]
  },
  "ID_RACIAL_TRAIT_DAMAGE_RESISTANCE": {
    "descriptions": [
      {
        "text": "You have resistance to {{draconic-ancestry:damage type}}.",
        "html": "You have resistance to {{draconic-ancestry:damage type}}."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DRACONIC_ANCESTRY_BLACK": {
    "alt": "Black",
    "descriptions": [
      {
        "text": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}.",
        "html": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DRACONIC_ANCESTRY_BLUE": {
    "alt": "Blue",
    "descriptions": [
      {
        "text": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}.",
        "html": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DRACONIC_ANCESTRY_BRASS": {
    "alt": "Brass",
    "descriptions": [
      {
        "text": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}.",
        "html": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DRACONIC_ANCESTRY_BRONZE": {
    "alt": "Bronze",
    "descriptions": [
      {
        "text": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}.",
        "html": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DRACONIC_ANCESTRY_COPPER": {
    "alt": "Copper",
    "descriptions": [
      {
        "text": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}.",
        "html": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DRACONIC_ANCESTRY_GOLD": {
    "alt": "Gold",
    "descriptions": [
      {
        "text": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}.",
        "html": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DRACONIC_ANCESTRY_GREEN": {
    "alt": "Green",
    "descriptions": [
      {
        "text": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}.",
        "html": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DRACONIC_ANCESTRY_RED": {
    "alt": "Red",
    "descriptions": [
      {
        "text": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}.",
        "html": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DRACONIC_ANCESTRY_SILVER": {
    "alt": "Silver",
    "descriptions": [
      {
        "text": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}.",
        "html": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DRACONIC_ANCESTRY_WHITE": {
    "alt": "White",
    "descriptions": [
      {
        "text": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}.",
        "html": "Your draconic ancestry is {{draconic-ancestry}}. Your damage type is {{draconic-ancestry:damage type}}. Your breath weapon is {{draconic-ancestry:breath}}."
      }
    ]
  },
  "ID_RACE_ELF": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_KEEN_SENSES": {
    "display": false,
    "descriptions": [
      {
        "text": "You have proficiency in the Perception skill.",
        "html": "You have proficiency in the Perception skill."
      }
    ]
  },
  "ID_RACIAL_TRAIT_FEY_ANCESTRY": {
    "descriptions": [
      {
        "text": "Advantage on saving throws against being charmed, and magic can’t put you to sleep.",
        "html": "Advantage on saving throws against being charmed, and magic can’t put you to sleep."
      }
    ]
  },
  "ID_RACIAL_TRAIT_TRANCE": {
    "descriptions": [
      {
        "text": "Elves don’t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day.",
        "html": "Elves don’t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day."
      }
    ]
  },
  "ID_RACIAL_TRAIT_ELVEN_SUBRACE": {
    "display": false,
    "descriptions": []
  },
  "ID_SUB_RACE_HIGH_ELF": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_ELF_WEAPON_TRAINING": {
    "display": false,
    "descriptions": [
      {
        "text": "You have proficiency with the longsword, shortsword, shortbow, and longbow.",
        "html": "You have proficiency with the longsword, shortsword, shortbow, and longbow."
      }
    ]
  },
  "ID_RACIAL_TRAIT_CANTRIP": {
    "display": false,
    "descriptions": [
      {
        "text": "You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.",
        "html": "You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it."
      }
    ]
  },
  "ID_RACIAL_TRAIT_EXTRA_LANGUAGE": {
    "display": false,
    "descriptions": []
  },
  "ID_SUB_RACE_WOOD_ELF": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_FLEET_OF_FOOT": {
    "display": false,
    "descriptions": [
      {
        "text": "Your speed increases to 35 feet.",
        "html": "Your speed increases to 35 feet."
      }
    ]
  },
  "ID_RACIAL_TRAIT_MASK_OF_THE_WILD": {
    "descriptions": [
      {
        "text": "You can attempt to hide even when you are only lightly obscured.",
        "html": "You can attempt to hide even when you are only lightly obscured."
      }
    ]
  },
  "ID_SUB_RACE_DARK_ELF": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_SUNLIGHT_SENSITIVITY": {
    "descriptions": [
      {
        "text": "You have disadvantage on attack rolls and on Perception checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.",
        "html": "You have disadvantage on attack rolls and on Perception checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight."
      }
    ]
  },
  "ID_RACIAL_TRAIT_DROW_MAGIC": {
    "descriptions": [
      {
        "text": "You know the dancing lights cantrip. (Charisma)",
        "html": "You know the dancing lights cantrip. (Charisma)"
      },
      {
        "text": "You know the dancing lights cantrip. You can cast Faerie Fire 1/long rest. (Charisma)",
        "html": "You know the dancing lights cantrip. You can cast Faerie Fire 1/long rest. (Charisma)",
        "level": 3
      },
      {
        "text": "You know the dancing lights cantrip. You can cast Faerie Fire and Darkness 1/long rest. (Charisma)",
        "html": "You know the dancing lights cantrip. You can cast Faerie Fire and Darkness 1/long rest. (Charisma)",
        "level": 5
      }
    ]
  },
  "ID_RACIAL_TRAIT_DROW_WEAPON_TRAINING": {
    "display": false,
    "descriptions": [
      {
        "text": "You have proficiency with rapiers, shortswords, and hand crossbows.",
        "html": "You have proficiency with rapiers, shortswords, and hand crossbows."
      }
    ]
  },
  "ID_RACE_HALFELF": {
    "display": false,
    "descriptions": []
  },
  "ID_RACIAL_TRAIT_HALFELF_FEY_ANCESTRY": {
    "descriptions": [
      {
        "text": "You have advantage on saving throws against being charmed, and magic can’t put you to sleep.",
        "html": "You have advantage on saving throws against being charmed, and magic can’t put you to sleep."
      }
    ]
  },
  "ID_RACIAL_TRAIT_SKILL_VERSATILITY": {
    "display": false,
    "descriptions": []
  },
  "ID_RACE_HUMAN": {
    "display": false,
    "descriptions": []
  },
  "ID_RACE_VARIANT_HUMAN_VARIANT": {
    "display": false,
    "alt": "Human",
    "descriptions": []
  },
  "ID_INTERNAL_GRANTS_REQTEMPFIX": {
    "display": false,
    "descriptions": []
  },
  "ID_RACE_VARIANT_HUMAN_VARIANT_DEXTERITY": {
    "display": false,
    "descriptions": []
  },
  "ID_RACE_VARIANT_HUMAN_VARIANT_CONSTITUTION": {
    "display": false,
    "descriptions": []
  },
  "ID_RACE_VARIANT_HUMAN_VARIANT_INTELLIGENCE": {
    "display": false,
    "descriptions": []
  },
  "ID_RACE_VARIANT_HUMAN_VARIANT_WISDOM": {
    "display": false,
    "descriptions": []
  },
  "ID_RACE_VARIANT_HUMAN_VARIANT_CHARISMA": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_ACTOR": {
    "descriptions": [
      {
        "text": "You have advantage on Deception and Performance checks when trying to pass yourself off as a different person. You can mimic the speech of another person or the sounds made by other creatures. You must have heard the person speaking, or heard the creature make the sound, for at least 1 minute. A successful Insight check contested by your Deception check allows a listener to determine that the effect is faked.",
        "html": "You have advantage on Deception and Performance checks when trying to pass yourself off as a different person.\n\t\t\tYou can mimic the speech of another person or the sounds made by other creatures. You must have heard the person speaking, or heard the creature make the sound, for at least 1 minute. A successful Insight check contested by your Deception check allows a listener to determine that the effect is faked."
      }
    ]
  },
  "ID_PHB_FEAT_ALERT": {
    "descriptions": [
      {
        "text": "You can’t be surprised while you are conscious. Other creatures don’t gain advantage on attack rolls against you as a result of being unseen by you.",
        "html": "You can’t be surprised while you are conscious.\n\t\t\tOther creatures don’t gain advantage on attack rolls against you as a result of being unseen by you."
      }
    ]
  },
  "ID_PHB_FEAT_ATHLETE": {
    "descriptions": [
      {
        "text": "When you are prone, standing up uses only 5 feet of your movement. Climbing doesn’t cost you extra movement. You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.",
        "html": "When you are prone, standing up uses only 5 feet of your movement.\n\t\t\tClimbing doesn’t cost you extra movement.\n\t\t\tYou can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet."
      }
    ]
  },
  "ID_PHB_FEAT_CHARGER": {
    "descriptions": [
      {
        "text": "When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature. If you move at least 10 feet in a straight line immediately before taking this bonus action, you either gain a +5 bonus to the attack’s damage roll (if you chose to make a melee attack and hit) or push the target up to 10 feet away from you (if you chose to shove and you succeed).",
        "html": "When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature.\n\t\t\tIf you move at least 10 feet in a straight line immediately before taking this bonus action, you either gain a +5 bonus to the attack’s damage roll (if you chose to make a melee attack and hit) or push the target up to 10 feet away from you (if you chose to shove and you succeed)."
      }
    ]
  },
  "ID_PHB_FEAT_CROSSBOWEXPERT": {
    "descriptions": [
      {
        "text": "You ignore the loading quality of crossbows with which you are proficient. Being within 5 feet of a hostile creature doesn’t impose disadvantage on your ranged attack rolls. When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.",
        "html": "You ignore the loading quality of crossbows with which you are proficient.\n\t\t\tBeing within 5 feet of a hostile creature doesn’t impose disadvantage on your ranged attack rolls.\n\t\t\tWhen you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding."
      }
    ]
  },
  "ID_PHB_FEAT_DEFENSIVE_DUELIST": {
    "descriptions": [
      {
        "text": "When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add {{defensive duelist:ac}} to your AC for that attack, potentially causing the attack to miss you.",
        "html": "When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add {{defensive duelist:ac}} to your AC for that attack, potentially causing the attack to miss you."
      }
    ]
  },
  "ID_PHB_FEAT_DUALWIELDER": {
    "descriptions": [
      {
        "text": "+1 bonus to AC while you are wielding a separate melee weapon in each hand. You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren’t light. You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.",
        "html": "+1 bonus to AC while you are wielding a separate melee weapon in each hand.\n\t\t\tYou can use two-weapon fighting even when the one-handed melee weapons you are wielding aren’t light.\n\t\t\tYou can draw or stow two one-handed weapons when you would normally be able to draw or stow only one."
      }
    ]
  },
  "ID_PHB_FEAT_DUNGEON_DELVER": {
    "descriptions": [
      {
        "text": "You have advantage on Perception and Investigation checks made to detect the presence of secret doors. You have advantage on saving throws made to avoid or resist traps. You have resistance to the damage dealt by traps. Traveling at a fast pace doesn’t impose the normal −5 penalty on your passive Perception score.",
        "html": "You have advantage on Perception and Investigation checks made to detect the presence of secret doors.\n\t\t\tYou have advantage on saving throws made to avoid or resist traps.\n\t\t\tYou have resistance to the damage dealt by traps.\n\t\t\tTraveling at a fast pace doesn’t impose the normal −5 penalty on your passive Perception score."
      }
    ]
  },
  "ID_PHB_FEAT_DURABLE": {
    "descriptions": [
      {
        "text": "When you roll a Hit Die to regain hit points, the minimum number of hit points you regain from the roll equals {{durable:hd:bonus}}.",
        "html": "When you roll a Hit Die to regain hit points, the minimum number of hit points you regain from the roll equals {{durable:hd:bonus}}."
      }
    ]
  },
  "ID_PHB_FEAT_ELEMENTAL_ADEPT": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_ELEMENTAL_ADEPT_ACID": {
    "alt": "Elemental Adept, Acid",
    "descriptions": [
      {
        "text": "Spells you cast ignore acid resistance. Treat any 1 on a damage die as a 2 with acid spells.",
        "html": "Spells you cast ignore acid resistance. Treat any 1 on a damage die as a 2 with acid spells."
      }
    ]
  },
  "ID_PHB_FEAT_ELEMENTAL_ADEPT_COLD": {
    "alt": "Elemental Adept, Cold",
    "descriptions": [
      {
        "text": "Spells you cast ignore cold resistance. Treat any 1 on a damage die as a 2 with cold spells.",
        "html": "Spells you cast ignore cold resistance. Treat any 1 on a damage die as a 2 with cold spells."
      }
    ]
  },
  "ID_PHB_FEAT_ELEMENTAL_ADEPT_FIRE": {
    "alt": "Elemental Adept, Fire",
    "descriptions": [
      {
        "text": "Spells you cast ignore fire resistance. Treat any 1 on a damage die as a 2 with fire spells.",
        "html": "Spells you cast ignore fire resistance. Treat any 1 on a damage die as a 2 with fire spells."
      }
    ]
  },
  "ID_PHB_FEAT_ELEMENTAL_ADEPT_LIGHTNING": {
    "alt": "Elemental Adept, Lightning",
    "descriptions": [
      {
        "text": "Spells you cast ignore lightning resistance. Treat any 1 on a damage die as a 2 with lightning spells.",
        "html": "Spells you cast ignore lightning resistance. Treat any 1 on a damage die as a 2 with lightning spells."
      }
    ]
  },
  "ID_PHB_FEAT_ELEMENTAL_ADEPT_THUNDER": {
    "alt": "Elemental Adept, Thunder",
    "descriptions": [
      {
        "text": "Spells you cast ignore thunder resistance. Treat any 1 on a damage die as a 2 with thunder spells.",
        "html": "Spells you cast ignore thunder resistance. Treat any 1 on a damage die as a 2 with thunder spells."
      }
    ]
  },
  "ID_PHB_FEAT_ELEMENTAL_ADEPT_2": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_ELEMENTAL_ADEPT_3": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_ELEMENTAL_ADEPT_4": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_ELEMENTAL_ADEPT_5": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_GRAPPLER": {
    "descriptions": [
      {
        "text": "You have advantage on attack rolls against a creature you are grappling. You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends.",
        "html": "You have advantage on attack rolls against a creature you are grappling.\n\t\t\tYou can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends."
      }
    ]
  },
  "ID_PHB_FEAT_GREATWEAPONMASTER": {
    "descriptions": [
      {
        "text": "On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action. Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a - 5 penalty to the attack roll. If the attack hits, you add +10 to the attack’s damage.",
        "html": "On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action.\n\t\t\tBefore you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a - 5 penalty to the attack roll. If the attack hits, you add +10 to the attack’s damage."
      }
    ]
  },
  "ID_PHB_FEAT_HEALER": {
    "action": "Action",
    "descriptions": [
      {
        "text": "You can spend one use of a healer’s kit to tend to a creature and restore 1d6 + 4 hit points to it, plus additional hit points equal to the creature’s maximum number of Hit Dice. The creature can’t regain hit points from this feat again until it finishes a short or long rest. When you use a healer’s kit to stabilize a dying creature, that creature also regains 1 hit point.",
        "html": "You can spend one use of a healer’s kit to tend to a creature and restore 1d6 + 4 hit points to it, plus additional hit points equal to the creature’s maximum number of Hit Dice. The creature can’t regain hit points from this feat again until it finishes a short or long rest.\n\t\t\tWhen you use a healer’s kit to stabilize a dying creature, that creature also regains 1 hit point."
      }
    ]
  },
  "ID_PHB_FEAT_HEAVILYARMORED": {
    "display": false,
    "descriptions": [
      {
        "text": "You have trained to master the use of heavy armor.",
        "html": "You have trained to master the use of heavy armor."
      }
    ]
  },
  "ID_PHB_FEAT_HEAVYARMORMASTER": {
    "descriptions": [
      {
        "text": "While you are wearing heavy armor, bludgeoning, piercing, and slashing damage that you take from non magical weapons is reduced by 3.",
        "html": "While you are wearing heavy armor, bludgeoning, piercing, and slashing damage that you take from non magical weapons is reduced by 3."
      }
    ]
  },
  "ID_PHB_FEAT_INSPIRINGLEADER": {
    "descriptions": [
      {
        "text": "You can spend 10 minutes inspiring your companions, shoring up their resolve to fight. When you do so, choose up to six friendly creatures within 30 feet of you who can see or hear you and who can understand you. Each creature can gain {{inspiring leader:hp:temp}} temporary hit points. A creature can’t gain temporary hit points from this feat again until it has finished a short or long rest.",
        "html": "You can spend 10 minutes inspiring your companions, shoring up their resolve to fight. When you do so, choose up to six friendly creatures within 30 feet of you who can see or hear you and who can understand you. Each creature can gain {{inspiring leader:hp:temp}} temporary hit points. A creature can’t gain temporary hit points from this feat again until it has finished a short or long rest."
      }
    ]
  },
  "ID_PHB_FEAT_KEENMIND": {
    "descriptions": [
      {
        "text": "You always know which way is north. You always know the number of hours left before the next sunrise or sunset. You can accurately recall anything you have seen or heard within the past month.",
        "html": "You always know which way is north.\n\t\t\tYou always know the number of hours left before the next sunrise or sunset.\n\t\t\tYou can accurately recall anything you have seen or heard within the past month."
      }
    ]
  },
  "ID_PHB_FEAT_LIGHTLYARMORED": {
    "descriptions": [
      {
        "text": "You have trained to master the use of light armor.",
        "html": "You have trained to master the use of light armor."
      }
    ]
  },
  "ID_PHB_FEAT_LINGUIST": {
    "descriptions": [
      {
        "text": "You can ably create written ciphers. Others can’t decipher a code you create unless you teach them, they succeed on an Intelligence check (DC {{linguist:dc}}), or they use magic to decipher it.",
        "html": "You can ably create written ciphers. Others can’t decipher a code you create unless you teach them, they succeed on an Intelligence check (DC {{linguist:dc}}), or they use magic to decipher it."
      }
    ]
  },
  "ID_PHB_FEAT_LUCKY": {
    "usage": "3/Long Rest",
    "descriptions": [
      {
        "text": "Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker’s roll or yours.",
        "html": "Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined.\n\t\t\tYou can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker’s roll or yours."
      }
    ]
  },
  "ID_PHB_FEAT_MAGESLAYER": {
    "descriptions": [
      {
        "text": "When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature. When you damage a creature that is concentrating on a spell, that creature has disadvantage on the saving throw it makes to maintain its concentration. You have advantage on saving throws against spells cast by creatures within 5 feet of you.",
        "html": "When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature.\n\t\t\tWhen you damage a creature that is concentrating on a spell, that creature has disadvantage on the saving throw it makes to maintain its concentration.\n\t\t\tYou have advantage on saving throws against spells cast by creatures within 5 feet of you."
      }
    ]
  },
  "ID_PHB_FEAT_MAGICINITIATE": {
    "descriptions": []
  },
  "ID_PHB_FEAT_MAGIC_INITIATE_BARD": {
    "descriptions": [
      {
        "text": "Spellcasting ability: Charisma.",
        "html": "Spellcasting ability: Charisma."
      }
    ]
  },
  "ID_PHB_FEAT_MAGIC_INITIATE_CLERIC": {
    "descriptions": [
      {
        "text": "Spellcasting ability: Wisdom.",
        "html": "Spellcasting ability: Wisdom."
      }
    ]
  },
  "ID_PHB_FEAT_MAGIC_INITIATE_DRUID": {
    "descriptions": [
      {
        "text": "Spellcasting ability: Wisdom.",
        "html": "Spellcasting ability: Wisdom."
      }
    ]
  },
  "ID_PHB_FEAT_MAGIC_INITIATE_SORCERER": {
    "descriptions": [
      {
        "text": "Spellcasting ability: Charisma.",
        "html": "Spellcasting ability: Charisma."
      }
    ]
  },
  "ID_PHB_FEAT_MAGIC_INITIATE_WARLOCK": {
    "descriptions": [
      {
        "text": "Spellcasting ability: Charisma.",
        "html": "Spellcasting ability: Charisma."
      }
    ]
  },
  "ID_PHB_FEAT_MAGIC_INITIATE_WIZARD": {
    "descriptions": [
      {
        "text": "Spellcasting ability: Intelligence.",
        "html": "Spellcasting ability: Intelligence."
      }
    ]
  },
  "ID_PHB_FEAT_MARTIALADEPT": {
    "descriptions": [
      {
        "text": "{{martial adept:dice:amount}}d{{martial adept:dice:size}} superiority dice / short rest. DC {{martial adept:dc}}",
        "html": "{{martial adept:dice:amount}}d{{martial adept:dice:size}} superiority dice / short rest. DC {{martial adept:dc}}"
      }
    ]
  },
  "ID_PHB_FEAT_MEDIUMARMORMASTER": {
    "descriptions": [
      {
        "text": "Wearing medium armor doesn’t impose disadvantage on your Stealth checks.",
        "html": "Wearing medium armor doesn’t impose disadvantage on your Stealth checks."
      }
    ]
  },
  "ID_PHB_FEAT_MOBILE": {
    "descriptions": [
      {
        "text": "When you use the Dash action, difficult terrain doesn’t cost you extra movement on that turn. When you make a melee attack against a creature, you don’t provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not.",
        "html": "When you use the Dash action, difficult terrain doesn’t cost you extra movement on that turn.\n\t\t\tWhen you make a melee attack against a creature, you don’t provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not."
      }
    ]
  },
  "ID_PHB_FEAT_MODERATELYARMORED": {
    "display": false,
    "descriptions": [
      {
        "text": "You have trained to master the use of medium armor and shields.",
        "html": "You have trained to master the use of medium armor and shields."
      }
    ]
  },
  "ID_PHB_FEAT_MOUNTEDCOMBATANT": {
    "descriptions": [
      {
        "text": "You have advantage on melee attack rolls against any unmounted creature that is smaller than your mount. You can force an attack targeted at your mount to target you instead. If your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.",
        "html": "You have advantage on melee attack rolls against any unmounted creature that is smaller than your mount.\n\t\t\tYou can force an attack targeted at your mount to target you instead. \n\t\t\tIf your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw, and only half damage if it fails."
      }
    ]
  },
  "ID_PHB_FEAT_OBSERVANT": {
    "descriptions": [
      {
        "text": "If you can see a creature’s mouth while it is speaking a language you understand, you can interpret what it’s saying by reading its lips. You have a +5 bonus to your passive Perception and passive Investigation scores.",
        "html": "If you can see a creature’s mouth while it is speaking a language you understand, you can interpret what it’s saying by reading its lips.\n\t\t\tYou have a +5 bonus to your passive Perception and passive Investigation scores."
      }
    ]
  },
  "ID_PHB_FEAT_POLEARMMASTER": {
    "descriptions": [
      {
        "text": "When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. The weapon’s damage die for this attack is a d4, and the attack deals bludgeoning damage. This attack uses the same ability modifier as the primary attack. While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter your reach.",
        "html": "When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. The weapon’s damage die for this attack is a d4, and the attack deals bludgeoning damage. This attack uses the same ability modifier as the primary attack.\n\t\t\tWhile you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter your reach."
      }
    ]
  },
  "ID_PHB_FEAT_RESILIENT": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_RESILIENT_STRENGTH": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_RESILIENT_DEXTERITY": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_RESILIENT_CONSTITUTION": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_RESILIENT_INTELLIGENCE": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_RESILIENT_WISDOM": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_RESILIENT_CHARISMA": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_RITUALCASTER": {
    "descriptions": [
      {
        "text": "You have learned a number of spells that you can cast as rituals.",
        "html": "You have learned a number of spells that you can cast as rituals."
      }
    ]
  },
  "ID_PHB_FEAT_RITUAL_CASTER_BARD": {
    "descriptions": [
      {
        "text": "Spellcasting ability: Charisma.",
        "html": "Spellcasting ability: Charisma."
      }
    ]
  },
  "ID_PHB_FEAT_RITUAL_CASTER_CLERIC": {
    "descriptions": [
      {
        "text": "Spellcasting ability: Wisdom.",
        "html": "Spellcasting ability: Wisdom."
      }
    ]
  },
  "ID_PHB_FEAT_RITUAL_CASTER_DRUID": {
    "descriptions": [
      {
        "text": "Spellcasting ability: Wisdom.",
        "html": "Spellcasting ability: Wisdom."
      }
    ]
  },
  "ID_PHB_FEAT_RITUAL_CASTER_SORCERER": {
    "descriptions": [
      {
        "text": "Spellcasting ability: Charisma.",
        "html": "Spellcasting ability: Charisma."
      }
    ]
  },
  "ID_PHB_FEAT_RITUAL_CASTER_WARLOCK": {
    "descriptions": [
      {
        "text": "Spellcasting ability: Charisma.",
        "html": "Spellcasting ability: Charisma."
      }
    ]
  },
  "ID_PHB_FEAT_RITUAL_CASTER_WIZARD": {
    "descriptions": [
      {
        "text": "Spellcasting ability: Intelligence.",
        "html": "Spellcasting ability: Intelligence."
      }
    ]
  },
  "ID_PHB_FEAT_SAVAGEATTACKER": {
    "descriptions": [
      {
        "text": "Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon's damage dice as use either total.",
        "html": "Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon's damage dice as use either total."
      }
    ]
  },
  "ID_PHB_FEAT_SENTINEL": {
    "descriptions": [
      {
        "text": "When you hit a creature with an opportunity attack, the creature’s speed becomes 0 for the rest of the turn. Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach. When a creature within 5 feet of you makes an attack against a target other than you, you can use your reaction to make a melee weapon attack against the attacking creature.",
        "html": "When you hit a creature with an opportunity attack, the creature’s speed becomes 0 for the rest of the turn.\n\t\t\tCreatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.\n\t\t\tWhen a creature within 5 feet of you makes an attack against a target other than you, you can use your reaction to make a melee weapon attack against the attacking creature."
      }
    ]
  },
  "ID_PHB_FEAT_SHARPSHOOTER": {
    "descriptions": [
      {
        "text": "Attacking at long range doesn’t impose disadvantage on your ranged weapon attack rolls. Your ranged weapon attacks ignore half cover and three-quarters cover. Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a - 5 penalty to the attack roll. If the attack hits, you add +10 to the attack’s damage.",
        "html": "Attacking at long range doesn’t impose disadvantage on your ranged weapon attack rolls.\n\t\t\tYour ranged weapon attacks ignore half cover and three-quarters cover.\n\t\t\tBefore you make an attack with a ranged weapon that you are proficient with, you can choose to take a - 5 penalty to the attack roll. If the attack hits, you add +10 to the attack’s damage."
      }
    ]
  },
  "ID_PHB_FEAT_SHIELDMASTER": {
    "descriptions": [
      {
        "text": "If you take the Attack action on your turn, you can use a bonus action to try to shove a creature within 5 feet of you with your shield. If you aren’t incapacitated, you can add your shield’s AC bonus to any Dexterity saving throw you make against a spell or other harmful effect that targets only you. If you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can use your reaction to take no damage if you succeed on the saving throw, interposing your shield between yourself and the source of the effect.",
        "html": "If you take the Attack action on your turn, you can use a bonus action to try to shove a creature within 5 feet of you with your shield.\n\t\t\tIf you aren’t incapacitated, you can add your shield’s AC bonus to any Dexterity saving throw you make against a spell or other harmful effect that targets only you.\n\t\t\tIf you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can use your reaction to take no damage if you succeed on the saving throw, interposing your shield between yourself and the source of the effect."
      }
    ]
  },
  "ID_PHB_FEAT_SKILLED": {
    "display": false,
    "descriptions": []
  },
  "ID_PHB_FEAT_SKULKER": {
    "descriptions": [
      {
        "text": "You can try to hide when you are lightly obscured from the creature from which you are hiding. When you are hidden from a creature and miss it with a ranged weapon attack, making the attack doesn’t reveal your position. Dim light doesn’t impose disadvantage on your Perception checks relying on sight.",
        "html": "You can try to hide when you are lightly obscured from the creature from which you are hiding.\n\t\t\tWhen you are hidden from a creature and miss it with a ranged weapon attack, making the attack doesn’t reveal your position.\n\t\t\tDim light doesn’t impose disadvantage on your Perception checks relying on sight."
      }
    ]
  },
  "ID_PHB_FEAT_SPELLSNIPER": {
    "descriptions": [
      {
        "text": "When you cast a spell that requires you to make an attack roll, the spell’s range is doubled. Your ranged spell attacks ignore half cover and three-quarters cover.",
        "html": "When you cast a spell that requires you to make an attack roll, the spell’s range is doubled.\n\t\t\tYour ranged spell attacks ignore half cover and three-quarters cover."
      }
    ]
  },
  "ID_PHB_FEAT_TAVERNBRAWLER": {
    "descriptions": [
      {
        "text": "You are proficient with improvised weapons. Your unarmed strike uses a d4 for damage. When you hit a creature with an unarmed strike or an improvised weapon on your turn, you can use a bonus action to attempt to grapple the target.",
        "html": "You are proficient with improvised weapons.\n\t\t\tYour unarmed strike uses a d4 for damage.\n\t\t\tWhen you hit a creature with an unarmed strike or an improvised weapon on your turn, you can use a bonus action to attempt to grapple the target."
      }
    ]
  },
  "ID_PHB_FEAT_TOUGH": {
    "descriptions": [
      {
        "text": "Your hit points maximum increases by {{tough:hp}}.",
        "html": "Your hit points maximum increases by {{tough:hp}}."
      }
    ]
  },
  "ID_PHB_FEAT_WARCASTER": {
    "descriptions": [
      {
        "text": "You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage. You can perform the somatic components of spells even when you have weapons or a shield in one or both hands. When a hostile creature’s movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack. The spell must have a casting time of 1 action and must target only that creature.",
        "html": "You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage.\n\t\t\tYou can perform the somatic components of spells even when you have weapons or a shield in one or both hands.\n\t\t\tWhen a hostile creature’s movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack. The spell must have a casting time of 1 action and must target only that creature."
      }
    ]
  },
  "ID_PHB_FEAT_WEAPONMASTER": {
    "descriptions": []
  },
  "ID_BACKGROUND_FEATURE_DISCOVERY": {
    "alt": "Discovery",
    "descriptions": [
      {
        "text": "The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature. It could be a site that no one else has ever seen. You might have uncovered a fact that has long been forgotten, or unearthed some relic of the past that could rewrite history. It might be information that would be damaging to the people who or consigned you to exile, and hence the reason for your return to society.",
        "html": "The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature. It could be a site that no one else has ever seen. You might have uncovered a fact that has long been forgotten, or unearthed some relic of the past that could rewrite history. It might be information that would be damaging to the people who or consigned you to exile, and hence the reason for your return to society."
      }
    ]
  },
  "ID_BACKGROUND_FEATURE_GUILD_MEMBERSHIP": {
    "alt": "Guild Membership",
    "descriptions": []
  },
  "ID_BACKGROUND_VARIANT_GUILD_MERCHANT": {
    "alt": "Guild Merchant",
    "descriptions": []
  },
  "ID_BACKGROUND_FEATURE_BY_POPULAR_DEMAND": {
    "alt": "By Popular Demand",
    "descriptions": [
      {
        "text": "You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble’s court. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each night. In addition, your performance makes you something of a local figure. When strangers recognize you in a town where you have performed, they typically take a liking to you.",
        "html": "You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble’s court. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each night. In addition, your performance makes you something of a local figure. When strangers recognize you in a town where you have performed, they typically take a liking to you."
      }
    ]
  },
  "ID_WOTC_PHB_BACKGROUND_VARIANT_GLADIATOR": {
    "alt": "Gladiator",
    "descriptions": []
  },
  "ID_BACKGROUND_FEATURE_FALSE_IDENTITY": {
    "alt": "False Identity",
    "descriptions": [
      {
        "text": "You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy.",
        "html": "You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy."
      }
    ]
  },
  "ID_BACKGROUND_FEATURE_RUSTIC_HOSPITALITY": {
    "alt": "Rustic Hospitality",
    "descriptions": []
  },
  "ID_BACKGROUND_FEATURE_WANDERER": {
    "alt": "Wanderer",
    "descriptions": []
  },
  "ID_BACKGROUND_FEATURE_CITY_SECRETS": {
    "alt": "City Secrets",
    "descriptions": []
  },
  "ID_BACKGROUND_FEATURE_MILITARY_RANK": {
    "alt": "Military Rank",
    "descriptions": []
  },
  "ID_BACKGROUND_FEATURE_SHELTER_OF_THE_FAITHFUL": {
    "alt": "Shelter of the Faithful",
    "descriptions": []
  },
  "ID_BACKGROUND_CRIMINAL": {
    "display": false,
    "descriptions": []
  },
  "ID_BACKGROUND_FEATURE_CRIMINAL_CONTACT": {
    "alt": "Criminal Contact",
    "descriptions": [
      {
        "text": "You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you.",
        "html": "You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you."
      }
    ]
  },
  "ID_WOTC_PHB_BACKGROUND_VARIANT_CRIMINAL_SPY": {
    "alt": "Spy",
    "descriptions": []
  },
  "ID_BACKGROUND_FEATURE_POSITIONOFPRIVILEGE": {
    "alt": "Position of Privilege",
    "descriptions": []
  },
  "ID_WOTC_PHB_BACKGROUND_VARIANT_NOBLE_KNIGHT": {
    "alt": "Knight",
    "descriptions": []
  },
  "ID_WOTC_PHB_BACKGROUND_FEATURE_KNIGHT_RETAINERS": {
    "alt": "Retainers",
    "descriptions": [
      {
        "text": "You have the service of three retainers loyal to your family. These retainers can be attendants or messengers, and one might be a majordomo. Your retainers are commoners who can perform mundane tasks for you, but they do not fight for you, will not follow you into obviously dangerous areas (such as dungeons), and will leave if they are frequently endangered or abused.",
        "html": "You have the service of three retainers loyal to your family. These retainers can be attendants or messengers, and one might be a majordomo. Your retainers are commoners who can perform mundane tasks for you, but they do not fight for you, will not follow you into obviously dangerous areas (such as dungeons), and will leave if they are frequently endangered or abused."
      }
    ]
  },
  "ID_WOTC_PHB_BACKGROUND_FEATURE_SAILOR_SHIPS_PASSAGE": {
    "alt": "Ship’s Passage",
    "descriptions": []
  },
  "ID_WOTC_PHB_BACKGROUND_VARIANT_SAILOR_PIRATE": {
    "alt": "Pirate",
    "descriptions": []
  },
  "ID_WOCT_PHB_BACKGROUND_FEATURE_PIRATE_BAD_REPUTATION": {
    "alt": "Bad Reputation",
    "descriptions": [
      {
        "text": "No matter where you go, people are afraid of you due to your reputation. When you are in a civilized settlement, you can get away with minor criminal offenses, such as refusing to pay for food at a tavern or breaking down doors at a local shop, since most people will not report your activity to the authorities.",
        "html": "No matter where you go, people are afraid of you due to your reputation. When you are in a civilized settlement, you can get away with minor criminal offenses, such as refusing to pay for food at a tavern or breaking down doors at a local shop, since most people will not report your activity to the authorities."
      }
    ]
  },
  "ID_BACKGROUND_FEATURE_RESEARCHER": {
    "alt": "Researcher",
    "descriptions": []
  },
  "ID_WOTC_DMG_ARCHETYPE_DEATHDOMAIN": {
    "display": false,
    "descriptions": [
      {
        "text": "The Death domain is concerned with the forces that cause death, as well as the negative energy that gives rise to undead creatures.",
        "html": "The Death domain is concerned with the forces that cause death, as well as the negative energy that gives rise to undead creatures."
      }
    ]
  },
  "ID_WOTC_DMG_ARCHETYPE_FEATURE_DEATH_DOMAIN_DOMAIN_SPELLS": {
    "display": false,
    "descriptions": [
      {
        "text": "You gain domain spells at the cleric levels listed in the Death Domain Spells table.",
        "html": "You gain domain spells at the cleric levels listed in the Death Domain Spells table."
      }
    ]
  },
  "ID_WOTC_DMG_ARCHETYPE_FEATURE_DEATH_DOMAIN_BONUS_PROFICIENCY": {
    "display": false,
    "descriptions": [
      {
        "text": "You gain proficiency with martial weapons.",
        "html": "You gain proficiency with martial weapons."
      }
    ]
  },
  "ID_WOTC_DMG_ARCHETYPE_FEATURE_DEATH_DOMAIN_REAPER": {
    "descriptions": [
      {
        "text": "When you cast a necromancy cantrip that targets one creature, you can target two creatures within range and within 5ft of each other instead.",
        "html": "When you cast a necromancy cantrip that targets one creature, you can target two creatures within range and within 5ft of each other instead."
      }
    ]
  },
  "ID_WOTC_DMG_ARCHETYPE_FEATURE_DEATH_DOMAIN_CHANNELDIVINITY_TOUCH_OF_DEATH": {
    "usage": "Channel Divinity",
    "alt": "Touch of Death",
    "descriptions": [
      {
        "text": "Use channel divinity when you hit a creature with a melee attack to deal {{ touch of death:necrotic damage }} extra necrotic damage.",
        "html": "Use channel divinity when you hit a creature with a melee attack to deal {{ touch of death:necrotic damage }} extra necrotic damage."
      }
    ]
  },
  "ID_WOTC_DMG_ARCHETYPE_FEATURE_DEATH_DOMAIN_INESCAPABLE_DESTRUCTION": {
    "descriptions": [
      {
        "text": "Your cleric spells and Channel Divinity options ignore resistance to necrotic damage.",
        "html": "Your cleric spells and Channel Divinity options ignore resistance to necrotic damage."
      }
    ]
  },
  "ID_WOTC_DMG_ARCHETYPE_FEATURE_DEATH_DOMAIN_DIVINE_STRIKE": {
    "usage": "1/Turn",
    "descriptions": [
      {
        "text": "Deal an extra 1d8 damage on a hit with a weapon.",
        "html": "Deal an extra 1d8 damage on a hit with a weapon."
      },
      {
        "text": "Deal an extra 2d8 damage on a hit with a weapon.",
        "html": "Deal an extra 2d8 damage on a hit with a weapon.",
        "level": 14
      }
    ]
  },
  "ID_WOTC_DMG_ARCHETYPE_FEATURE_DEATH_DOMAIN_IMPROVED_REAPER": {
    "descriptions": [
      {
        "text": "When you cast a necromancy spell of 1st through 5th level, that targets one creature, you can target two creatures within range and within 5ft of each other instead. If the spell consumes its material components, you must provide them for each target.",
        "html": "When you cast a necromancy spell of 1st through 5th level, that targets one creature, you can target two creatures within range and within 5ft of each other instead. If the spell consumes its material components, you must provide them for each target."
      }
    ]
  },
  "ID_DMG_ARCHETYPE_PALADIN_OATHBREAKER": {
    "display": false,
    "descriptions": [
      {
        "text": "An Oathbreaker is a paladin who breaks his or her sacred oaths to pursue some dark ambition or serve an evil power.",
        "html": "An Oathbreaker is a paladin who breaks his or her sacred oaths to pursue some dark ambition or serve an evil power."
      }
    ]
  },
  "ID_DMG_ARCHETYPE_FEATURE_OATHBREAKER_OATHBREAKER_SPELLS": {
    "display": false,
    "descriptions": []
  },
  "ID_DMG_ARCHETYPE_FEATURE_OATHBREAKER_CHANNEL_DIVINITY": {
    "display": false,
    "descriptions": []
  },
  "ID_DMG_ARCHETYPE_FEATURE_OATHBREAKER_CHANNEL_DIVINITY_CONTROL_UNDEAD": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Control Undead",
    "descriptions": [
      {
        "text": "You target one undead creature you can see within 30 feet. The target must make a Wisdom saving throw. On a failed save, the target must obey your commands for the next 24 hours, or until you use this Channel Divinity option again. An undead whose challenge rating is equal to or greater than {{level:paladin}} is immune to this effect.",
        "html": "You target one undead creature you can see within 30 feet. The target must make a Wisdom saving throw. On a failed save, the target must obey your commands for the next 24 hours, or until you use this Channel Divinity option again. An undead whose challenge rating is equal to or greater than {{level:paladin}} is immune to this effect."
      }
    ]
  },
  "ID_DMG_ARCHETYPE_FEATURE_OATHBREAKER_CHANNEL_DIVINITY_DREADFUL_ASPECT": {
    "action": "Action",
    "usage": "Channel Divinity",
    "alt": "Dreadful Aspect",
    "descriptions": [
      {
        "text": "Each creature of your choice within 30 feet of you must make a Wisdom saving throw if it can see you. On a failed save, the target is frightened of you for 1 minute. If a creature frightened by this effect ends its turn more than 30 feet away from you, it can attempt another Wisdom saving throw to end the effect on it.",
        "html": "Each creature of your choice within 30 feet of you must make a Wisdom saving throw if it can see you. On a failed save, the target is frightened of you for 1 minute. If a creature frightened by this effect ends its turn more than 30 feet away from you, it can attempt another Wisdom saving throw to end the effect on it."
      }
    ]
  },
  "ID_DMG_ARCHETYPE_FEATURE_OATHBREAKER_AURA_OF_HATE": {
    "descriptions": [
      {
        "text": "You as well any fiends and undead within {{aura of hate:range}} feet of the paladin, gains a +{{aura of hate:damage}} bonus to melee weapon damage rolls.",
        "html": "You as well any fiends and undead within {{aura of hate:range}} feet of the paladin, gains a +{{aura of hate:damage}} bonus to melee weapon damage rolls."
      }
    ]
  },
  "ID_DMG_ARCHETYPE_FEATURE_OATHBREAKER_SUPERNATURAL_RESISTANCE": {
    "descriptions": [
      {
        "text": "You have resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.",
        "html": "You have resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons."
      }
    ]
  },
  "ID_DMG_ARCHETYPE_FEATURE_OATHBREAKER_DREAD_LORD": {
    "action": "Action",
    "usage": "1/Long Rest",
    "descriptions": [
      {
        "text": "You surround yourself with an aura of gloom that lasts for 1 minute. The aura reduces any bright light in a 30-foot radius around the paladin to dim light. Whenever an enemy that is frightened by the paladin starts its turn in the aura, it takes 4d10 psychic damage. Additionally, the paladin and creatures he or she chooses in the aura are draped in deeper shadow. Creatures that rely on sight have disadvantage on attack rolls against creatures draped in this shadow. While the aura lasts, the paladin can use a bonus action on his or her turn to cause the shadows in the aura to attack one creature. The paladin makes a melee spell attack against the target. If the attack hits, the target takes necrotic damage equal to 3d10+{{charisma:modifier}}.",
        "html": "You surround yourself with an aura of gloom that lasts for 1 minute. The aura reduces any bright light in a 30-foot radius around the paladin to dim light. Whenever an enemy that is frightened by the paladin starts its turn in the aura, it takes 4d10 psychic damage. Additionally, the paladin and creatures he or she chooses in the aura are draped in deeper shadow. Creatures that rely on sight have disadvantage on attack rolls against creatures draped in this shadow.\n\t\t\tWhile the aura lasts, the paladin can use a bonus action on his or her turn to cause the shadows in the aura to attack one creature. The paladin makes a melee spell attack against the target. If the attack hits, the target takes necrotic damage equal to 3d10+{{charisma:modifier}}."
      }
    ]
  }
} satisfies Record<string, BuiltInSheet>;
