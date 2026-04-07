import type { BuiltInElement } from "@/lib/builtins/types";

export const BUILT_IN_SRD_BACKGROUND_ELEMENTS: readonly BuiltInElement[] = [
  {
    "id": "ID_BACKGROUND_ACOLYTE",
    "type": "Background",
    "name": "Acolyte",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-acolyte.xml",
    "supports": [],
    "description": "You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices in order to conduct worshipers into the presence of the divine. You are not necessarily a cleric—performing sacred rites is not the same thing as channeling divine power. Choose a god, a pantheon of gods, or some other quasi-divine being, and work with your DM to detail the nature of your religious service. Were you a lesser functionary in a temple, raised from childhood to assist the priests in the sacred rites? Or were you a high priest who suddenly experienced a call to serve your god in a different way? Perhaps you were the leader of a small cult outside of any established temple structure, or even an occult group that served a fiendish master that you now deny. Skill Proficiencies: Insight, Religion Languages: Two of your choice Equipment: A holy symbol (a gift to you when you entered the priesthood), a prayer book or prayer wheel, 5 sticks of incense, vestments, a set of common clothes, and a belt pouch containing 15 gp SUGGESTED CHARACTERISTICS Acolytes are shaped by their experience in temples or other religious communities. Their study of the history and tenets of their faith and their relationships to temples, shrines, or hierarchies affect their mannerisms and ideals. Their flaws might be some hidden hypocrisy or heretical idea, or an ideal or bond taken to an extreme.",
    "descriptionHtml": "<p>You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices in order to conduct worshipers into the presence of the divine. You are not necessarily a cleric—performing sacred rites is not the same thing as channeling divine power.</p>\n\t\t\t<p class=\"indent\">Choose a god, a pantheon of gods, or some other quasi-divine being, and work with your DM to detail the nature of your religious service. Were you a lesser functionary in a temple, raised from childhood to assist the priests in the sacred rites? Or were you a high priest who suddenly experienced a call to serve your god in a different way? Perhaps you were the leader of a small cult outside of any established temple structure, or even an occult group that served a fiendish master that you now deny.</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li><strong>Skill Proficiencies:</strong>Insight, Religion</li>\n\t\t\t\t<li><strong>Languages:</strong>Two of your choice</li>\n\t\t\t\t<li><strong>Equipment:</strong>A holy symbol (a gift to you when you entered the priesthood), a prayer book or prayer wheel, 5 sticks of incense, vestments, a set of common clothes, and a belt pouch containing 15 gp</li>\n\t\t\t</ul>\n\t\t\t<div element=\"ID_BACKGROUND_FEATURE_SHELTER_OF_THE_FAITHFUL\" />\n\t\t\t<h5>SUGGESTED CHARACTERISTICS</h5>\n\t\t\t<p>Acolytes are shaped by their experience in temples or other religious communities. Their study of the history and tenets of their faith and their relationships to temples, shrines, or hierarchies affect their mannerisms and ideals. Their flaws might be some hidden hypocrisy or heretical idea, or an ideal or bond taken to an extreme.</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_INSIGHT",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_RELIGION",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_BACKGROUND_FEATURE_SHELTER_OF_THE_FAITHFUL",
        "requirements": "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Language",
        "name": "Language (Acolyte)",
        "supports": "Standard||Exotic",
        "choices": [
          {
            "id": "1",
            "value": "I idolize a particular hero of my faith, and constantly refer to that person’s deeds and example."
          },
          {
            "id": "2",
            "value": "I can find common ground between the fiercest enemies, empathizing with them and always working toward peace."
          },
          {
            "id": "3",
            "value": "I see omens in every event and action. The gods try to speak to us, we just need to listen"
          },
          {
            "id": "4",
            "value": "Nothing can shake my optimistic attitude."
          },
          {
            "id": "5",
            "value": "I quote (or misquote) sacred texts and proverbs in almost every situation."
          },
          {
            "id": "6",
            "value": "I am tolerant (or intolerant) of other faiths and respect (or condemn) the worship of other gods."
          },
          {
            "id": "7",
            "value": "I’ve enjoyed fine food, drink, and high society among my temple’s elite. Rough living grates on me."
          },
          {
            "id": "8",
            "value": "I’ve spent so long in the temple that I have little practical experience dealing with people in the outside world."
          }
        ],
        "number": 2,
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Tradition. The ancient traditions of worship and sacrifice must be preserved and upheld. (Lawful)"
          },
          {
            "id": "2",
            "value": "Charity. I always try to help those in need, no matter what the personal cost. (Good)"
          },
          {
            "id": "3",
            "value": "Change. We must help bring about the changes the gods are constantly working in the world. (Chaotic)"
          },
          {
            "id": "4",
            "value": "Power. I hope to one day rise to the top of my faith’s religious hierarchy. (Lawful)"
          },
          {
            "id": "5",
            "value": "Faith. I trust that my deity will guide my actions. I have faith that if I work hard, things will go well. (Lawful)"
          },
          {
            "id": "6",
            "value": "Aspiration. I seek to prove myself worthy of my god’s favor by matching my actions against his or her teachings. (Any)"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "I would die to recover an ancient relic of my faith that was lost long ago."
          },
          {
            "id": "2",
            "value": "I will someday get revenge on the corrupt temple hierarchy who branded me a heretic."
          },
          {
            "id": "3",
            "value": "I owe my life to the priest who took me in when my parents died."
          },
          {
            "id": "4",
            "value": "Everything I do is for the common people."
          },
          {
            "id": "5",
            "value": "I will do anything to protect the temple where I served."
          },
          {
            "id": "6",
            "value": "I seek to preserve a sacred text that my enemies consider heretical and seek to destroy."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "I judge others harshly, and myself even more severely."
          },
          {
            "id": "2",
            "value": "I put too much trust in those who wield power within my temple’s hierarchy."
          },
          {
            "id": "3",
            "value": "My piety sometimes leads me to blindly trust those that profess faith in my god."
          },
          {
            "id": "4",
            "value": "I am inflexible in my thinking."
          },
          {
            "id": "5",
            "value": "I am suspicious of strangers and expect the worst of them."
          },
          {
            "id": "6",
            "value": "Once I pick a goal, I become obsessed with it to the detriment of everything else in my life."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "Insight, Religion, 2 Languages"
      }
    ]
  },
  {
    "id": "ID_BACKGROUND_FEATURE_SHELTER_OF_THE_FAITHFUL",
    "type": "Background Feature",
    "name": "Feature: Shelter of the Faithful",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-acolyte.xml",
    "supports": [
      "Background Feature"
    ],
    "description": "As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle. You might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there. This could be the temple where you used to serve, if you remain on good terms with it, or a temple where you have found a new home. While near your temple, you can call upon the priests for assistance, provided the assistance you ask for is not hazardous and you remain in good standing with your temple.",
    "descriptionHtml": "<p>As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle.</p>\n\t\t\t<p class=\"indent\">You might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there. This could be the temple where you used to serve, if you remain on good terms with it, or a temple where you have found a new home. While near your temple, you can call upon the priests for assistance, provided the assistance you ask for is not hazardous and you remain in good standing with your temple.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_CHARLATAN",
    "type": "Background",
    "name": "Charlatan",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-charlatan.xml",
    "supports": [],
    "description": "You have always had a way with people. You know what makes them tick, you can tease out their hearts’ desires after a few minutes of conversation, and with a few leading questions you can read them like they were children’s books. It’s a useful talent, and one that you’re perfectly willing to use for your advantage. You know what people want and you deliver, or rather, you promise to deliver. Common sense should steer people away from things that sound too good to be true, but common sense seems to be in short supply when you’re around. The bottle of pink-colored liquid will surely cure that unseemly rash, this ointment—nothing more than a bit of fat with a sprinkle of silver dust—can restore youth and vigor, and there’s a bridge in the city that just happens to be for sale. These marvels sound implausible, but you make them sound like the real deal. Skill Proficiencies: Deception, Sleight of Hand Tool Proficiencies: Disguise kit, forgery kit Equipment: A set of fine clothes, a disguise kit, tools of the con of your choice (ten stoppered bottles filled with colored liquid, a set of weighted dice, a deck of marked cards, or a signet ring of an imaginary duke), and a belt pouch containing 15 gp FAVORITE SCHEMES Every charlatan has an angle he or she uses in preference to other schemes. Choose a favorite scam or roll on the table below. d6 Scam 1 I cheat at games of chance. 2 I shave coins or forge documents. 3 I insinuate myself into people’s lives to prey on their weakness and secure their fortunes. 4 I put on new identities like clothes. 5 I run sleight-of-hand cons on street corners. 6 I convince people that worthless junk is worth their hard-earned money. SUGGESTED CHARACTERISTICS Charlatans are colorful characters who conceal their true selves behind the masks they construct. They reflect what people want to see, what they want to believe, and how they see the world. But their true selves are sometimes plagued by an uneasy conscience, an old enemy, or deep-seated trust issues.",
    "descriptionHtml": "<p>You have always had a way with people. You know what makes them tick, you can tease out their hearts’ desires after a few minutes of conversation, and with a few leading questions you can read them like they were children’s books. It’s a useful talent, and one that you’re perfectly willing to use for your advantage.</p>\n\t\t\t<p class=\"indent\">You know what people want and you deliver, or rather, you promise to deliver. Common sense should steer people away from things that sound too good to be true, but common sense seems to be in short supply when you’re around. The bottle of pink-colored liquid will surely cure that unseemly rash, this ointment—nothing more than a bit of fat with a sprinkle of silver dust—can restore youth and vigor, and there’s a bridge in the city that just happens to be for sale. These marvels sound implausible, but you make them sound like the real deal.</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li><strong>Skill Proficiencies:</strong> Deception, Sleight of Hand</li>\n\t\t\t\t<li><strong>Tool Proficiencies:</strong> Disguise kit, forgery kit</li>\n\t\t\t\t<li><strong>Equipment:</strong> A set of fine clothes, a disguise kit, tools of the con of your choice (ten stoppered bottles filled with colored liquid, a set of weighted dice, a deck of marked cards, or a signet ring of an imaginary duke), and a belt pouch containing 15 gp</li>\n\t\t\t</ul>\n\t\t\t<h5>FAVORITE SCHEMES</h5>\n\t\t\t<p>Every charlatan has an angle he or she uses in preference to other schemes. Choose a favorite scam or roll on the table below.</p>\n\t\t\t<table>\n\t\t\t\t<thead>\n\t\t\t\t\t<tr><td class=\"col-20\">d6</td><td>Scam</td></tr>\n\t\t\t\t</thead>\n\t\t\t\t<tr><td>1</td><td>I cheat at games of chance.</td></tr>\n\t\t\t\t<tr><td>2</td><td>I shave coins or forge documents.</td></tr>\n\t\t\t\t<tr><td>3</td><td>I insinuate myself into people’s lives to prey on their weakness and secure their fortunes.</td></tr>\n\t\t\t\t<tr><td>4</td><td>I put on new identities like clothes.</td></tr>\n\t\t\t\t<tr><td>5</td><td>I run sleight-of-hand cons on street corners.</td></tr>\n\t\t\t\t<tr><td>6</td><td>I convince people that worthless junk is worth their hard-earned money.</td></tr>\n\t\t\t</table>\n\t\t\t<div element=\"ID_BACKGROUND_FEATURE_FALSE_IDENTITY\" />\n\t\t\t<h5>SUGGESTED CHARACTERISTICS</h5>\n\t\t\t<p>Charlatans are colorful characters who conceal their true selves behind the masks they construct. They reflect what people want to see, what they want to believe, and how they see the world. But their true selves are sometimes plagued by an uneasy conscience, an old enemy, or deep-seated trust issues.</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_DECEPTION",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_SLEIGHTOFHAND",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_TOOL_PROFICIENCY_DISGUISE_KIT",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_TOOL_PROFICIENCY_FORGERY_KIT",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_BACKGROUND_FEATURE_FALSE_IDENTITY",
        "requirements": "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Background Feature",
        "name": "Variant Feature",
        "supports": "Optional Background Feature",
        "choices": [
          {
            "id": "1",
            "value": "I cheat at games of chance."
          },
          {
            "id": "2",
            "value": "I shave coins or forge documents."
          },
          {
            "id": "3",
            "value": "I insinuate myself into people’s lives to prey on their weakness and secure their fortunes."
          },
          {
            "id": "4",
            "value": "I put on new identities like clothes."
          },
          {
            "id": "5",
            "value": "I run sleight-of-hand cons on street corners."
          },
          {
            "id": "6",
            "value": "I convince people that worthless junk is worth their hard-earned money."
          }
        ],
        "optional": true,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Personality Trait",
        "choices": [
          {
            "id": "1",
            "value": "I fall in and out of love easily, and am always pursuing someone."
          },
          {
            "id": "2",
            "value": "I have a joke for every occasion, especially occasions where humor is inappropriate."
          },
          {
            "id": "3",
            "value": "Flattery is my preferred trick for getting what I want."
          },
          {
            "id": "4",
            "value": "I’m a born gambler who can’t resist taking a risk for a potential payoff."
          },
          {
            "id": "5",
            "value": "I lie about almost everything, even when there’s no good reason to."
          },
          {
            "id": "6",
            "value": "Sarcasm and insults are my weapons of choice."
          },
          {
            "id": "7",
            "value": "I keep multiple holy symbols on me and invoke whatever deity might come in useful at any given moment."
          },
          {
            "id": "8",
            "value": "I pocket anything I see that might have some value."
          }
        ],
        "number": 2,
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Independence. I am a free spirit— no one tells me what to do. (Chaotic)"
          },
          {
            "id": "2",
            "value": "Fairness. I never target people who can’t afford to lose a few coins. (Lawful)"
          },
          {
            "id": "3",
            "value": "Charity. I distribute the money I acquire to the people who really need it. (Good)"
          },
          {
            "id": "4",
            "value": "Creativity. I never run the same con twice. (Chaotic)"
          },
          {
            "id": "5",
            "value": "Friendship. Material goods come and go. Bonds of friendship last forever. (Good)"
          },
          {
            "id": "6",
            "value": "Aspiration. I’m determined to make something of myself. (Any)"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "I fleeced the wrong person and must work to ensure that this individual never crosses paths with me or those I care about."
          },
          {
            "id": "2",
            "value": "I owe everything to my mentor—a horrible person who’s probably rotting in jail somewhere."
          },
          {
            "id": "3",
            "value": "Somewhere out there, I have a child who doesn’t know me. I’m making the world better for him or her."
          },
          {
            "id": "4",
            "value": "I come from a noble family, and one day I’ll reclaim my lands and title from those who stole them from me."
          },
          {
            "id": "5",
            "value": "A powerful person killed someone I love. Some day soon, I’ll have my revenge."
          },
          {
            "id": "6",
            "value": "I swindled and ruined a person who didn’t deserve it. I seek to atone for my misdeeds but might never be able to forgive myself."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "I can’t resist a pretty face."
          },
          {
            "id": "2",
            "value": "I’m always in debt. I spend my ill-gotten gains on decadent luxuries faster than I bring them in.."
          },
          {
            "id": "3",
            "value": "I’m convinced that no one could ever fool me the way I fool others."
          },
          {
            "id": "4",
            "value": "I’m too greedy for my own good. I can’t resist taking a risk if there’s money involved."
          },
          {
            "id": "5",
            "value": "I can’t resist swindling people who are more powerful than me."
          },
          {
            "id": "6",
            "value": "I hate to admit it and will hate myself for it, but I’ll run and preserve my own hide if the going gets tough."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "Deception, Sleight of Hand, Disguise kit, Forgery Kit"
      }
    ]
  },
  {
    "id": "ID_BACKGROUND_FEATURE_FALSE_IDENTITY",
    "type": "Background Feature",
    "name": "Feature: False Identity",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-charlatan.xml",
    "supports": [
      "Background Feature"
    ],
    "description": "You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy.",
    "descriptionHtml": "<p>You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_CRIMINAL",
    "type": "Background",
    "name": "Criminal",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-criminal.xml",
    "supports": [],
    "description": "You are an experienced criminal with a history of breaking the law. You have spent a lot of time among other criminals and still have contacts within the criminal underworld. You’re far closer than most people to the world of murder, theft, and violence that pervades the underbelly of civilization, and you have survived up to this point by flouting the rules and regulations of society. Skill Proficiencies: Deception, Stealth Tool Proficiencies: One type of gaming set, thieves’ tools. Equipment: A crowbar, a set of dark common clothes including a hood, and a belt pouch containing 15 gp CRIMINAL SPECIALTY There are many kinds of criminals, and within a thieves’ guild or similar criminal organization, individual members have particular specialties. Even criminals who operate outside of such organizations have strong preferences for certain kinds of crimes over others. Choose the role you played in your criminal life, or roll on the table below. d8 Specialty 1 Blackmailer 2 Burglar 3 Enforcer 4 Fence 5 Highway robber 6 Hired killer 7 Pickpocket 8 Smuggler SUGGESTED CHARACTERISTICS Criminals might seem like villains on the surface, and many of them are villainous to the core. But some have an abundance of endearing, if not redeeming, characteristics. There might be honor among thieves, but criminals rarely show any respect for law or authority.",
    "descriptionHtml": "<p>You are an experienced criminal with a history of breaking the law. You have spent a lot of time among other criminals and still have contacts within the criminal underworld. You’re far closer than most people to the world of murder, theft, and violence that pervades the underbelly of civilization, and you have survived up to this point by flouting the rules and regulations of society.</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li><strong>Skill Proficiencies:</strong> Deception, Stealth</li>\n\t\t\t\t<li><strong>Tool Proficiencies:</strong> One type of gaming set, thieves’ tools.</li>\n\t\t\t\t<li><strong>Equipment:</strong> A crowbar, a set of dark common clothes including a hood, and a belt pouch containing 15 gp</li>\n\t\t\t</ul>\n\t\t\t<h5>CRIMINAL SPECIALTY</h5>\n\t\t\t<p>There are many kinds of criminals, and within a thieves’ guild or similar criminal organization, individual members have particular specialties. Even criminals who operate outside of such organizations have strong preferences for certain kinds of crimes over others. Choose the role you played in your criminal life, or roll on the table below.</p>\n\t\t\t<table>\n\t\t\t\t<thead>\n\t\t\t\t\t<tr><td class=\"col-20\">d8</td><td>Specialty</td></tr>\n\t\t\t\t</thead>\n\t\t\t\t<tr><td>1</td><td>Blackmailer</td></tr>\n\t\t\t\t<tr><td>2</td><td>Burglar</td></tr>\n\t\t\t\t<tr><td>3</td><td>Enforcer</td></tr>\n\t\t\t\t<tr><td>4</td><td>Fence</td></tr>\n\t\t\t\t<tr><td>5</td><td>Highway robber</td></tr>\n\t\t\t\t<tr><td>6</td><td>Hired killer</td></tr>\n\t\t\t\t<tr><td>7</td><td>Pickpocket</td></tr>\n\t\t\t\t<tr><td>8</td><td>Smuggler</td></tr>\n\t\t\t</table>\n\t\t\t<div element=\"ID_BACKGROUND_FEATURE_CRIMINAL_CONTACT\" />\n\t\t\t<h5>SUGGESTED CHARACTERISTICS</h5>\n\t\t\t<p>Criminals might seem like villains on the surface, and many of them are villainous to the core. But some have an abundance of endearing, if not redeeming, characteristics. There might be honor among thieves, but criminals rarely show any respect for law or authority.</p>\n\t\t\t<div element=\"ID_WOTC_PHB_BACKGROUND_VARIANT_CRIMINAL_SPY\" />",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_DECEPTION",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_STEALTH",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_TOOL_PROFICIENCY_THIEVES_TOOLS",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_BACKGROUND_FEATURE_CRIMINAL_CONTACT",
        "requirements": "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Proficiency",
        "name": "Gaming Set (Criminal)",
        "supports": "Gaming Set",
        "choices": [
          {
            "id": "1",
            "value": "Blackmailer"
          },
          {
            "id": "2",
            "value": "Burglar"
          },
          {
            "id": "3",
            "value": "Enforcer"
          },
          {
            "id": "4",
            "value": "Fence"
          },
          {
            "id": "5",
            "value": "Highway robber"
          },
          {
            "id": "6",
            "value": "Hired killer"
          },
          {
            "id": "7",
            "value": "Pickpocket"
          },
          {
            "id": "8",
            "value": "Smuggler"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Personality Trait",
        "choices": [
          {
            "id": "1",
            "value": "I always have a plan for what to do when things go wrong."
          },
          {
            "id": "2",
            "value": "I am always calm, no matter what the situation. I never raise my voice or let my emotions control me."
          },
          {
            "id": "3",
            "value": "The first thing I do in a new place is note the locations of everything valuable—or where such things could be hidden."
          },
          {
            "id": "4",
            "value": "I would rather make a new friend than a new enemy."
          },
          {
            "id": "5",
            "value": "I am incredibly slow to trust. Those who seem the fairest often have the most to hide."
          },
          {
            "id": "6",
            "value": "I don’t pay attention to the risks in a situation. Never tell me the odds."
          },
          {
            "id": "7",
            "value": "The best way to get me to do something is to tell me I can’t do it."
          },
          {
            "id": "8",
            "value": "I blow up at the slightest insult."
          }
        ],
        "number": 2,
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Honor. I don’t steal from others in the trade. (Lawful)"
          },
          {
            "id": "2",
            "value": "Freedom. Chains are meant to be broken, as are those who would forge them. (Chaotic)"
          },
          {
            "id": "3",
            "value": "Charity. I steal from the wealthy so that I can help people in need. (Good)"
          },
          {
            "id": "4",
            "value": "Greed. I will do whatever it takes to become wealthy. (Evil)"
          },
          {
            "id": "5",
            "value": "People. I’m loyal to my friends, not to any ideals, and everyone else can take a trip down the Styx for all I care. (Neutral)"
          },
          {
            "id": "6",
            "value": "Redemption. There’s a spark of good in everyone. (Good)"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "I’m trying to pay off an old debt I owe to a generous benefactor."
          },
          {
            "id": "2",
            "value": "My ill-gotten gains go to support my family."
          },
          {
            "id": "3",
            "value": "Something important was taken from me, and I aim to steal it back."
          },
          {
            "id": "4",
            "value": "I will become the greatest thief that ever lived."
          },
          {
            "id": "5",
            "value": "I’m guilty of a terrible crime. I hope I can redeem myself for it."
          },
          {
            "id": "6",
            "value": "Someone I loved died because of I mistake I made. That will never happen again."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "When I see something valuable, I can’t think about anything but how to steal it."
          },
          {
            "id": "2",
            "value": "When faced with a choice between money and my friends, I usually choose the money."
          },
          {
            "id": "3",
            "value": "If there’s a plan, I’ll forget it. If I don’t forget it, I’ll ignore it."
          },
          {
            "id": "4",
            "value": "I have a “tell” that reveals when I’m lying."
          },
          {
            "id": "5",
            "value": "I turn tail and run when things look bad."
          },
          {
            "id": "6",
            "value": "An innocent person is in prison for a crime that I committed. I’m okay with that."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "Deception, Stealth, Gaming Set, Thieves’ Tools"
      }
    ]
  },
  {
    "id": "ID_BACKGROUND_FEATURE_CRIMINAL_CONTACT",
    "type": "Background Feature",
    "name": "Feature: Criminal Contact",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-criminal.xml",
    "supports": [
      "Background Feature"
    ],
    "description": "You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you.",
    "descriptionHtml": "<p>You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_WOTC_PHB_BACKGROUND_VARIANT_CRIMINAL_SPY",
    "type": "Background Variant",
    "name": "Variant Criminal: Spy",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-criminal.xml",
    "supports": [
      "Variant Criminal"
    ],
    "description": "Although your capabilities are not much different from those of a burglar or smuggler, you learned and practiced them in a very different context: as an espionage agent. You might have been an officially sanctioned agent of the crown, or perhaps you sold the secrets you uncovered to the highest bidder.",
    "descriptionHtml": "<p>Although your capabilities are not much different from those of a burglar or smuggler, you learned and practiced them in a very different context: as an espionage agent. You might have been an officially sanctioned agent of the crown, or perhaps you sold the secrets you uncovered to the highest bidder.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_ENTERTAINER",
    "type": "Background",
    "name": "Entertainer",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-entertainer.xml",
    "supports": [],
    "description": "You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them. Your poetics can stir the hearts of those who hear you, awakening grief or joy, laughter or anger. Your music raises their spirits or captures their sorrow. Your dance steps captivate, your humor cuts to the quick. Whatever techniques you use, your art is your life. Skill Proficiencies: Acrobatics, Performance Tool Proficiencies: Disguise kit, one type of musical instrument Equipment: musical instrument (one of your choice), the favor of an admirer (love letter, lock of hair, or trinket), a costume, and a belt pouch containing 15 gp ENTERTAINER ROUTINES A good entertainer is versatile, spicing up every performance with a variety of different routines. Choose one to three routines or roll on the table below to define your expertise as an entertainer. d10 Entertainer Routine 1 Actor 2 Dancer 3 Fire-eater 4 Jester 5 Juggler 6 Instrumentalist 7 Poet 8 Singer 9 Storyteller 10 Tumbler SUGGESTED CHARACTERISTICS Successful entertainers have to be able to capture and hold an audience’s attention, so they tend to have flamboyant or forceful personalities. They’re inclined toward the romantic and often cling to high-minded ideals about the practice of art and the appreciation of beauty. VARIANT ENTERTAINER : GLADIATOR A gladiator is as much an entertainer as any minstrel or circus performer, trained to make the arts of combat into a spectacle the crowd can enjoy. This kind of flashy combat is your entertainer routine, though you might also have some skills as a tumbler or actor. Using your By Popular Demand feature, you can find a place to perform in any place that features combat for entertainment—perhaps a gladiatorial arena or secret pit fighting club. You can replace the musical instrument in your equipment package with an inexpensive but unusual weapon, such as a trident or net.",
    "descriptionHtml": "<p>You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them. Your poetics can stir the hearts of those who hear you, awakening grief or joy, laughter or anger. Your music raises their spirits or captures their sorrow. Your dance steps captivate, your humor cuts to the quick. Whatever techniques you use, your art is your life.</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li><strong>Skill Proficiencies:</strong> Acrobatics, Performance</li>\n\t\t\t\t<li><strong>Tool Proficiencies:</strong> Disguise kit, one type of musical instrument</li>\n\t\t\t\t<li><strong>Equipment:</strong> musical instrument (one of your choice), the favor of an admirer (love letter, lock of hair, or trinket), a costume, and a belt pouch containing 15 gp</li>\n\t\t\t</ul>\n\t\t\t<h5>ENTERTAINER ROUTINES</h5>\n\t\t\t<p>A good entertainer is versatile, spicing up every performance with a variety of different routines. Choose one to three routines or roll on the table below to define your expertise as an entertainer.</p>\n\t\t\t<table>\n\t\t\t\t<thead>\n\t\t\t\t\t<tr><td class=\"col-10\">d10</td><td>Entertainer Routine</td></tr>\n\t\t\t\t</thead>\n\t\t\t\t<tr><td>1</td><td>Actor</td></tr>\n\t\t\t\t<tr><td>2</td><td>Dancer</td></tr>\n\t\t\t\t<tr><td>3</td><td>Fire-eater</td></tr>\n\t\t\t\t<tr><td>4</td><td>Jester</td></tr>\n\t\t\t\t<tr><td>5</td><td>Juggler</td></tr>\n\t\t\t\t<tr><td>6</td><td>Instrumentalist</td></tr>\n\t\t\t\t<tr><td>7</td><td>Poet</td></tr>\n\t\t\t\t<tr><td>8</td><td>Singer</td></tr>\n\t\t\t\t<tr><td>9</td><td>Storyteller</td></tr>\n\t\t\t\t<tr><td>10</td><td>Tumbler</td></tr>\n\t\t\t</table>\n\t\t\t<div element=\"ID_BACKGROUND_FEATURE_BY_POPULAR_DEMAND\" />\n\t\t\t<h5>SUGGESTED CHARACTERISTICS</h5>\n\t\t\t<p>Successful entertainers have to be able to capture and hold an audience’s attention, so they tend to have flamboyant or forceful personalities. They’re inclined toward the romantic and often cling to high-minded ideals about the practice of art and the appreciation of beauty.</p>\n\t\t\t<h4>VARIANT ENTERTAINER : GLADIATOR</h4>\n\t\t\t<p>A gladiator is as much an entertainer as any minstrel or circus performer, trained to make the arts of combat into a spectacle the crowd can enjoy. This kind of flashy combat is your entertainer routine, though you might also have some skills as a tumbler or actor. Using your By Popular Demand feature, you can find a place to perform in any place that features combat for entertainment—perhaps a gladiatorial arena or secret pit fighting club. You can replace the musical instrument in your equipment package with an inexpensive but unusual weapon, such as a trident or net.</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_ACROBATICS",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_PERFORMANCE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_TOOL_PROFICIENCY_DISGUISE_KIT",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_BACKGROUND_FEATURE_BY_POPULAR_DEMAND",
        "requirements": "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Proficiency",
        "name": "Musical Intrument (Entertainer)",
        "supports": "Musical Instrument",
        "choices": [
          {
            "id": "1",
            "value": "Actor"
          },
          {
            "id": "2",
            "value": "Dancer"
          },
          {
            "id": "3",
            "value": "Fire-eater"
          },
          {
            "id": "4",
            "value": "Jester"
          },
          {
            "id": "5",
            "value": "Juggler"
          },
          {
            "id": "6",
            "value": "Instrumentalist"
          },
          {
            "id": "7",
            "value": "Poet"
          },
          {
            "id": "8",
            "value": "Singer"
          },
          {
            "id": "9",
            "value": "Storyteller"
          },
          {
            "id": "10",
            "value": "Tumbler"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Personality Trait",
        "choices": [
          {
            "id": "1",
            "value": "I know a story relevant to almost every situation."
          },
          {
            "id": "2",
            "value": "Whenever I come to a new place, I collect local rumors and spread gossip."
          },
          {
            "id": "3",
            "value": "I’m a hopeless romantic, always searching for that “special someone.”"
          },
          {
            "id": "4",
            "value": "Nobody stays angry at me or around me for long, since I can defuse any amount tension."
          },
          {
            "id": "5",
            "value": "I love a good insult, even one directed at me."
          },
          {
            "id": "6",
            "value": "I get bitter if I’m not the center of attention."
          },
          {
            "id": "7",
            "value": "I’ll settle for nothing less than perfection."
          },
          {
            "id": "8",
            "value": "I change my mood or my mind as quickly as I change key in a song."
          }
        ],
        "number": 2,
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Beauty. When I perform, I make the world better than it was. (Good)"
          },
          {
            "id": "2",
            "value": "Tradition. The stories, legends, and songs of the past must never be forgotten, for they teach us who we are. (Lawful)"
          },
          {
            "id": "3",
            "value": "Creativity. The world is in need of new ideas and bold action. (Chaotic)"
          },
          {
            "id": "4",
            "value": "Greed. I’m only in it for the money and fame. (Evil)"
          },
          {
            "id": "5",
            "value": "People. I like seeing the smiles on people’s faces when I perform. That’s all that matters. (Neutral)"
          },
          {
            "id": "6",
            "value": "Honesty. Art should reflect the soul; it should come from within and reveal who we really are. (Any)"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "My instrument is my most treasured possession, and it reminds me of someone I love."
          },
          {
            "id": "2",
            "value": "Someone stole my precious instrument, and someday I’ll get it back."
          },
          {
            "id": "3",
            "value": "I want to be famous, whatever it takes."
          },
          {
            "id": "4",
            "value": "I idolize a hero of the old tales and measure my deeds against that person’s."
          },
          {
            "id": "5",
            "value": "I will do anything to prove myself superior to my hated rival."
          },
          {
            "id": "6",
            "value": "I would do anything for the other members of my old troupe."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "I’ll do anything to win fame and renown."
          },
          {
            "id": "2",
            "value": "I’m a sucker for a pretty face."
          },
          {
            "id": "3",
            "value": "A scandal prevents me from ever going home again. That kind of trouble seems to follow me around."
          },
          {
            "id": "4",
            "value": "I once satirized a noble who still wants my head. It was a mistake that I will likely repeat."
          },
          {
            "id": "5",
            "value": "I have trouble keeping my true feelings hidden. My sharp tongue lands me in trouble."
          },
          {
            "id": "6",
            "value": "Despite my best efforts, I am unreliable to my friends."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "Acrobatics, Performance, Disguise kit, Instrument"
      }
    ]
  },
  {
    "id": "ID_BACKGROUND_FEATURE_BY_POPULAR_DEMAND",
    "type": "Background Feature",
    "name": "Feature: By Popular Demand",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-entertainer.xml",
    "supports": [
      "Background Feature"
    ],
    "description": "You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble’s court. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each night. In addition, your performance makes you something of a local figure. When strangers recognize you in a town where you have performed, they typically take a liking to you.",
    "descriptionHtml": "<p>You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble’s court. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each night. In addition, your performance makes you something of a local figure. When strangers recognize you in a town where you have performed, they typically take a liking to you.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_WOTC_PHB_BACKGROUND_VARIANT_GLADIATOR",
    "type": "Background Variant",
    "name": "Variant Entertainer: Gladiator",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-entertainer.xml",
    "supports": [
      "Variant Entertainer"
    ],
    "description": "A gladiator is as much an entertainer as any minstrel or circus performer, trained to make the arts of combat into a spectacle the crowd can enjoy. This kind of flashy combat is your entertainer routine, though you might also have some skills as a tumbler or actor. Using your By Popular Demand feature, you can find a place to perform in any place that features combat for entertainment—perhaps a gladiatorial arena or secret pit fighting club. You can replace the musical instrument in your equipment package with an inexpensive but unusual weapon, such as a trident or net.",
    "descriptionHtml": "<p>A gladiator is as much an entertainer as any minstrel or circus performer, trained to make the arts of combat into a spectacle the crowd can enjoy. This kind of flashy combat is your entertainer routine, though you might also have some skills as a tumbler or actor. Using your By Popular Demand feature, you can find a place to perform in any place that features combat for entertainment—perhaps a gladiatorial arena or secret pit fighting club. You can replace the musical instrument in your equipment package with an inexpensive but unusual weapon, such as a trident or net.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_FOLK_HERO",
    "type": "Background",
    "name": "Folk Hero",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-folkhero.xml",
    "supports": [],
    "description": "You come from a humble social rank, but you are destined for so much more. Already the people of your home village regard you as their champion, and your destiny calls you to stand against the tyrants and monsters that threaten the common folk everywhere. Skill Proficiencies: Animal Handling, Survival Tool Proficiencies: One type of artisan’s tools, vehicles (land) Equipment: A set of artisan’s tools (one of your choice), a shovel, an iron pot, a set of common clothes, and a belt pouch containing 10 gp DEFINING EVENT You previously pursued a simple profession among the peasantry, perhaps as a farmer, miner, servant, shepherd, woodcutter, or gravedigger. But something happened that set you on a different path and marked you for greater things. Choose or randomly determine a defining event that marked you as a hero of the people. d10 Defining Event 1 I stood up to a tyrant’s agents. 2 I saved people during a natural disaster. 3 I stood alone against a terrible monster. 4 I stole from a corrupt merchant to help the poor. 5 I led a militia to fight off an invading army. 6 I broke into a tyrant’s castle and stole weapons to arm the people. 7 I trained the peasantry to use farm implements as weapons against a tyrant’s soldiers. 8 A lord rescinded an unpopular decree after I led a symbolic act of protect against it. 9 A celestial, fey, or similar creature gave me a blessing or revealed my secret origin. 10 Recruited into a lord’s army, I rose to leadership and was commended for my heroism. SUGGESTED CHARACTERISTICS A folk hero is one of the common people, for better or for worse. Most folk heroes look on their humble origins as a virtue, not a shortcoming, and their home communities remain very important to them.",
    "descriptionHtml": "<p>You come from a humble social rank, but you are destined for so much more. Already the people of your home village regard you as their champion, and your destiny calls you to stand against the tyrants and monsters that threaten the common folk everywhere.</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li><strong>Skill Proficiencies:</strong> Animal Handling, Survival</li>\n\t\t\t\t<li><strong>Tool Proficiencies:</strong> One type of artisan’s tools, vehicles (land)</li>\n\t\t\t\t<li><strong>Equipment:</strong> A set of artisan’s tools (one of your choice), a shovel, an iron pot, a set of common clothes, and a belt pouch containing 10 gp</li>\n\t\t\t</ul>\n\t\t\t<h5>DEFINING EVENT</h5>\n\t\t\t<p>You previously pursued a simple profession among the peasantry, perhaps as a farmer, miner, servant, shepherd, woodcutter, or gravedigger. But something happened that set you on a different path and marked you for greater things. Choose or randomly determine a defining event that marked you as a hero of the people.</p>\n\t\t\t<table>\n\t\t\t\t<thead>\n\t\t\t\t\t<tr><td class=\"col-20\">d10</td><td>Defining Event</td></tr>\n\t\t\t\t</thead>\n\t\t\t\t<tr><td>1</td><td>I stood up to a tyrant’s agents.</td></tr>\n\t\t\t\t<tr><td>2</td><td>I saved people during a natural disaster.</td></tr>\n\t\t\t\t<tr><td>3</td><td>I stood alone against a terrible monster.</td></tr>\n\t\t\t\t<tr><td>4</td><td>I stole from a corrupt merchant to help the poor.</td></tr>\n\t\t\t\t<tr><td>5</td><td>I led a militia to fight off an invading army.</td></tr>\n\t\t\t\t<tr><td>6</td><td>I broke into a tyrant’s castle and stole weapons to arm the people.</td></tr>\n\t\t\t\t<tr><td>7</td><td>I trained the peasantry to use farm implements as weapons against a tyrant’s soldiers.</td></tr>\n\t\t\t\t<tr><td>8</td><td>A lord rescinded an unpopular decree after I led a symbolic act of protect against it.</td></tr>\n\t\t\t\t<tr><td>9</td><td>A celestial, fey, or similar creature gave me a blessing or revealed my secret origin.</td></tr>\n\t\t\t\t<tr><td>10</td><td>Recruited into a lord’s army, I rose to leadership and was commended for my heroism.</td></tr>\n\t\t\t</table>\n\t\t\t<div element=\"ID_BACKGROUND_FEATURE_RUSTIC_HOSPITALITY\" />\n\t\t\t<h5>SUGGESTED CHARACTERISTICS</h5>\n\t\t\t<p>A folk hero is one of the common people, for better or for worse. Most folk heroes look on their humble origins as a virtue, not a shortcoming, and their home communities remain very important to them.</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_ANIMALHANDLING",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_SURVIVAL",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_TOOL_PROFICIENCY_VEHICLES_LAND",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_BACKGROUND_FEATURE_RUSTIC_HOSPITALITY",
        "requirements": "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Background Feature",
        "name": "Variant Feature",
        "supports": "Optional Background Feature",
        "choices": [
          {
            "id": "1",
            "value": "I stood up to a tyrant’s agents."
          },
          {
            "id": "2",
            "value": "I saved people during a natural disaster."
          },
          {
            "id": "3",
            "value": "I stood alone against a terrible monster."
          },
          {
            "id": "4",
            "value": "I stole from a corrupt merchant to help the poor."
          },
          {
            "id": "5",
            "value": "I led a militia to fight off an invading army."
          },
          {
            "id": "6",
            "value": "I broke into a tyrant’s castle and stole weapons to arm the people."
          },
          {
            "id": "7",
            "value": "I trained the peasantry to use farm implements as weapons against a tyrant’s soldiers."
          },
          {
            "id": "8",
            "value": "A lord rescinded an unpopular decree after I led a symbolic act of protect against it."
          },
          {
            "id": "9",
            "value": "A celestial, fey, or similar creature gave me a blessing or revealed my secret origin."
          },
          {
            "id": "10",
            "value": "Recruited into a lord’s army, I rose to leadership and was commended for my heroism."
          }
        ],
        "optional": true,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Personality Trait",
        "choices": [
          {
            "id": "1",
            "value": "I judge people by their actions, not their words."
          },
          {
            "id": "2",
            "value": "If someone is in trouble, I’m always ready to lend help."
          },
          {
            "id": "3",
            "value": "When I set my mind to something, I follow through no matter what gets in my way."
          },
          {
            "id": "4",
            "value": "I have a strong sense of fair play and always try to find the most equitable solution to arguments."
          },
          {
            "id": "5",
            "value": "I’m confident in my own abilities and do what I can to instill confidence in others."
          },
          {
            "id": "6",
            "value": "Thinking is for other people. I prefer action."
          },
          {
            "id": "7",
            "value": "I misuse long words in an attempt to sound smarter."
          },
          {
            "id": "8",
            "value": "I get bored easily. When am I going to get on with my destiny?"
          }
        ],
        "number": 2,
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Respect. People deserve to be treated with dignity and respect. (Good)"
          },
          {
            "id": "2",
            "value": "Fairness. No one should get preferential treatment before the law, and no one is above the law. (Lawful)"
          },
          {
            "id": "3",
            "value": "Freedom. Tyrants must not be allowed to oppress the people. (Chaotic)"
          },
          {
            "id": "4",
            "value": "Might. If I become strong, I can take what I want— what I deserve. (Evil)"
          },
          {
            "id": "5",
            "value": "Sincerity. There’s no good in pretending to be something I’m not. (Neutral)"
          },
          {
            "id": "6",
            "value": "Destiny. Nothing and no one can steer me away from my higher calling. (Any)"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "I have a family, but I have no idea where they are. One day, I hope to see them again."
          },
          {
            "id": "2",
            "value": "I worked the land, I love the land, and I will protect the land."
          },
          {
            "id": "3",
            "value": "A proud noble once gave me a horrible beating, and I will take my revenge on any bully I encounter."
          },
          {
            "id": "4",
            "value": "My tools are symbols of my past life, and I carry them so that I will never forget my roots."
          },
          {
            "id": "5",
            "value": "I protect those who cannot protect themselves."
          },
          {
            "id": "6",
            "value": "I wish my childhood sweetheart had come with me to pursue my destiny."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "The tyrant who rules my land will stop at nothing to see me killed."
          },
          {
            "id": "2",
            "value": "I’m convinced of the significance of my destiny, and blind to my shortcomings and the risk of failure."
          },
          {
            "id": "3",
            "value": "The people who knew me when I was young know my shameful secret, so I can never go home again."
          },
          {
            "id": "4",
            "value": "I have a weakness for the vices of the city, especially hard drink."
          },
          {
            "id": "5",
            "value": "Secretly, I believe that things would be better if I were a tyrant lording over the land."
          },
          {
            "id": "6",
            "value": "I have trouble trusting in my allies."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "Animal Handling, Survival, Artisan’s Tool, Vehicles (Land)"
      }
    ]
  },
  {
    "id": "ID_BACKGROUND_FEATURE_RUSTIC_HOSPITALITY",
    "type": "Background Feature",
    "name": "Feature: Rustic Hospitality",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-folkhero.xml",
    "supports": [
      "Background Feature"
    ],
    "description": "Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or anyone else searching for you, though they will not risk their lives for you.",
    "descriptionHtml": "<p>Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or anyone else searching for you, though they will not risk their lives for you.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_GUILD_ARTISAN",
    "type": "Background",
    "name": "Guild Artisan",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-guildartisan.xml",
    "supports": [],
    "description": "You are a member of an artisan’s guild, skilled in a particular field and closely associated with other artisans. You are a well-established part of the mercantile world, freed by talent and wealth from the constraints of a feudal social order. You learned your skills as an apprentice to a master artisan, under the sponsorship of your guild, until you became a master in your own right. Skill Proficiencies: Insight, Persuasion Tool Proficiencies: One type of artisan’s tools Languages: One of your choice Equipment: A set of artisan’s tools (one of your choice), a letter of introduction from your guild, a set of traveler’s clothes, and a belt pouch containing 15 gp GUILD BUSINESS Guilds are generally found in cities large enough to support several artisans practicing the same trade. However, your guild might instead be a loose network of artisans who each work in a different village within a larger realm. Work with your DM to determine the nature of your guild. You can select your guild business from the Guild Business table or roll randomly. d20 Guild Business 1 Alchemists and apothecaries 2 Armorers, locksmiths, and finesmiths 3 Brewers, distillers, and vintners 4 Calligraphers, scribes, and scriveners 5 Carpenters, roofers, and plasterers 6 Cartographers, surveyors, and chart-makers 7 Cobblers and shoemakers 8 Cooks and bakers 9 Glassblowers and glaziers 10 Jewelers and gemcutters 11 Leatherworkers, skinners, and tanners 12 Masons and stonecutters 13 Painters, limners, and sign-makers 14 Potters and tile-makers 15 Shipwrights and sailmakers 16 Smiths and metal-forgers 17 Tinkers, pewterers, and casters 18 Wagon-makers and wheelwrights 19 Weavers and dyers 20 Woodcarvers, coopers, and bowyer As a member of your guild, you know the skills needed to create finished items from raw materials (reflected in your proficiency with a certain kind of artisan’s tools), as well as the principles of trade and good business practices. The question now is whether you abandon your trade for adventure, or take on the extra effort to weave adventuring and trade together. SUGGESTED CHARACTERISTICS Guild artisans are among the most ordinary people in the world—until they set down their tools and take up an adventuring career. They understand the value of hard work and the importance of community, but they’re vulnerable to sins of greed and covetousness. VARIANT GUILD ARTISAN : GUILD MERCHANT Instead of an artisans’ guild, you might belong to a guild of traders, caravan masters, or shopkeepers. You don’t craft items yourself but earn a living by buying and selling the works of others (or the raw materials artisans need to practice their craft). Your guild might be a large merchant consortium (or family) with interests across the region. Perhaps you transported goods from one place to another, by ship, wagon, or caravan, or bought them from traveling traders and sold them in your own little shop. In some ways, the traveling merchant’s life lends itself to adventure far more than the life of an artisan. Rather than proficiency with artisan’s tools, you might be proficient with navigator’s tools or an additional language. And instead of artisan’s tools, you can start with a mule and a cart.",
    "descriptionHtml": "<p>You are a member of an artisan’s guild, skilled in a particular field and closely associated with other artisans. You are a well-established part of the mercantile world, freed by talent and wealth from the constraints of a feudal social order. You learned your skills as an apprentice to a master artisan, under the sponsorship of your guild, until you became a master in your own right.</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li><strong>Skill Proficiencies:</strong>Insight, Persuasion</li>\n\t\t\t\t<li><strong>Tool Proficiencies:</strong>One type of artisan’s tools</li>\n\t\t\t\t<li><strong>Languages:</strong>One of your choice</li>\n\t\t\t\t<li><strong>Equipment:</strong>A set of artisan’s tools (one of your choice), a letter of introduction from your guild, a set of traveler’s clothes, and a belt pouch containing 15 gp</li>\n\t\t\t</ul>\n\t\t\t<h5>GUILD BUSINESS</h5>\n\t\t\t<p>Guilds are generally found in cities large enough to support several artisans practicing the same trade. However, your guild might instead be a loose network of artisans who each work in a different village within a larger realm. Work with your DM to determine the nature of your guild. You can select your guild business from the Guild Business table or roll randomly.</p>\n\t\t\t<table>\n\t\t\t\t<thead>\n\t\t\t\t\t<tr><td>d20</td><td>Guild Business</td></tr>\n\t\t\t\t</thead>\n\t\t\t\t<tr><td>1</td><td>Alchemists and apothecaries</td></tr>\n\t\t\t\t<tr><td>2</td><td>Armorers, locksmiths, and finesmiths</td></tr>\n\t\t\t\t<tr><td>3</td><td>Brewers, distillers, and vintners</td></tr>\n\t\t\t\t<tr><td>4</td><td>Calligraphers, scribes, and scriveners</td></tr>\n\t\t\t\t<tr><td>5</td><td>Carpenters, roofers, and plasterers</td></tr>\n\t\t\t\t<tr><td>6</td><td>Cartographers, surveyors, and chart-makers</td></tr>\n\t\t\t\t<tr><td>7</td><td>Cobblers and shoemakers</td></tr>\n\t\t\t\t<tr><td>8</td><td>Cooks and bakers</td></tr>\n\t\t\t\t<tr><td>9</td><td>Glassblowers and glaziers</td></tr>\n\t\t\t\t<tr><td>10</td><td>Jewelers and gemcutters</td></tr>\n\t\t\t\t<tr><td>11</td><td>Leatherworkers, skinners, and tanners</td></tr>\n\t\t\t\t<tr><td>12</td><td>Masons and stonecutters</td></tr>\n\t\t\t\t<tr><td>13</td><td>Painters, limners, and sign-makers</td></tr>\n\t\t\t\t<tr><td>14</td><td>Potters and tile-makers</td></tr>\n\t\t\t\t<tr><td>15</td><td>Shipwrights and sailmakers</td></tr>\n\t\t\t\t<tr><td>16</td><td>Smiths and metal-forgers</td></tr>\n\t\t\t\t<tr><td>17</td><td>Tinkers, pewterers, and casters</td></tr>\n\t\t\t\t<tr><td>18</td><td>Wagon-makers and wheelwrights</td></tr>\n\t\t\t\t<tr><td>19</td><td>Weavers and dyers</td></tr>\n\t\t\t\t<tr><td>20</td><td>Woodcarvers, coopers, and bowyer</td></tr>\n\t\t\t</table>\n\t\t\t<p>As a member of your guild, you know the skills needed to create finished items from raw materials (reflected in your proficiency with a certain kind of artisan’s tools), as well as the principles of trade and good business practices. The question now is whether you abandon your trade for adventure, or take on the extra effort to weave adventuring and trade together.</p>\n\t\t\t<div element=\"ID_BACKGROUND_FEATURE_GUILD_MEMBERSHIP\" />\n\t\t\t<h5>SUGGESTED CHARACTERISTICS</h5>\n\t\t\t<p>Guild artisans are among the most ordinary people in the world—until they set down their tools and take up an adventuring career. They understand the value of hard work and the importance of community, but they’re vulnerable to sins of greed and covetousness.</p>\n\t\t\t<h4>VARIANT GUILD ARTISAN : GUILD MERCHANT</h4>\n\t\t\t<p>Instead of an artisans’ guild, you might belong to a guild of traders, caravan masters, or shopkeepers. You don’t craft items yourself but earn a living by buying and selling the works of others (or the raw materials artisans need to practice their craft). Your guild might be a large merchant consortium (or family) with interests across the region. Perhaps you transported goods from one place to another, by ship, wagon, or caravan, or bought them from traveling traders and sold them in your own little shop. In some ways, the traveling merchant’s life lends itself to adventure far more than the life of an artisan.</p>\n\t\t\t<p class=\"indent\">Rather than proficiency with artisan’s tools, you might be proficient with navigator’s tools or an additional language. And instead of artisan’s tools, you can start with a mule and a cart.</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_INSIGHT",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_PERSUASION",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_BACKGROUND_FEATURE_GUILD_MEMBERSHIP",
        "requirements": "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Proficiency",
        "name": "Tool Proficiency (Guild Artisan)",
        "supports": "Artisan tools",
        "choices": [
          {
            "id": "1",
            "value": "Alchemists and apothecaries"
          },
          {
            "id": "2",
            "value": "Armorers, locksmiths, and finesmiths"
          },
          {
            "id": "3",
            "value": "Brewers, distillers, and vintners"
          },
          {
            "id": "4",
            "value": "Calligraphers, scribes, and scriveners"
          },
          {
            "id": "5",
            "value": "Carpenters, roofers, and plasterers"
          },
          {
            "id": "6",
            "value": "Cartographers, surveyors, and chart-makers"
          },
          {
            "id": "7",
            "value": "Cobblers and shoemakers"
          },
          {
            "id": "8",
            "value": "Cooks and bakers"
          },
          {
            "id": "9",
            "value": "Glassblowers and glaziers"
          },
          {
            "id": "10",
            "value": "Jewelers and gemcutters"
          },
          {
            "id": "11",
            "value": "Leatherworkers, skinners, and tanners"
          },
          {
            "id": "12",
            "value": "Masons and stonecutters"
          },
          {
            "id": "13",
            "value": "Painters, limners, and sign-makers"
          },
          {
            "id": "14",
            "value": "Potters and tile-makers"
          },
          {
            "id": "15",
            "value": "Shipwrights and sailmakers"
          },
          {
            "id": "16",
            "value": "Smiths and metal-forgers"
          },
          {
            "id": "17",
            "value": "Tinkers, pewterers, and casters"
          },
          {
            "id": "18",
            "value": "Wagon-makers and wheelwrights"
          },
          {
            "id": "19",
            "value": "Weavers and dyers"
          },
          {
            "id": "20",
            "value": "Woodcarvers, coopers, and bowyers"
          }
        ],
        "requirements": "!ID_BACKGROUND_VARIANT_GUILD_MERCHANT",
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Personality Trait",
        "choices": [
          {
            "id": "1",
            "value": "I believe that anything worth doing is worth doing right. I can’t help it— I’m a perfectionist."
          },
          {
            "id": "2",
            "value": "I’m a snob who looks down on those who can’t appreciate fine art."
          },
          {
            "id": "3",
            "value": "I always want to know how things work and what makes people tick."
          },
          {
            "id": "4",
            "value": "I’m full of witty aphorisms and have a proverb for every occasion."
          },
          {
            "id": "5",
            "value": "I’m rude to people who lack my commitment to hard work and fair play."
          },
          {
            "id": "6",
            "value": "I like to talk at length about my profession."
          },
          {
            "id": "7",
            "value": "I don’t part with my money easily and will haggle tirelessly to get the best deal possible."
          },
          {
            "id": "8",
            "value": "I’m well known for my work, and I want to make sure everyone appreciates it. I’m always taken aback when people haven’t heard of me."
          }
        ],
        "number": 2,
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Community. It is the duty of all civilized people to strengthen the bonds of community and the security of civilization. (Lawful)"
          },
          {
            "id": "2",
            "value": "Generosity. My talents were given to me so that I could use them to benefit the world. (Good)"
          },
          {
            "id": "3",
            "value": "Freedom. Everyone should be free to pursue his or her own livelihood. (Chaotic)"
          },
          {
            "id": "4",
            "value": "Greed. I’m only in it for the money. (Evil)"
          },
          {
            "id": "5",
            "value": "People. I’m committed to the people I care about, not to ideals. (Neutral)"
          },
          {
            "id": "6",
            "value": "Aspiration. I work hard to be the best there is at my craft."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "The workshop where I learned my trade is the most important place in the world to me."
          },
          {
            "id": "2",
            "value": "I created a great work for someone, and then found them unworthy to receive it. I’m still looking for someone worthy."
          },
          {
            "id": "3",
            "value": "I owe my guild a great debt for forging me into the person I am today."
          },
          {
            "id": "4",
            "value": "I pursue wealth to secure someone’s love."
          },
          {
            "id": "5",
            "value": "One day I will return to my guild and prove that I am the greatest artisan of them all."
          },
          {
            "id": "6",
            "value": "I will get revenge on the evil forces that destroyed my place of business and ruined my livelihood."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "I’ll do anything to get my hands on something rare or priceless."
          },
          {
            "id": "2",
            "value": "I’m quick to assume that someone is trying to cheat me."
          },
          {
            "id": "3",
            "value": "No one must ever learn that I once stole money from guild coffers."
          },
          {
            "id": "4",
            "value": "I’m never satisfied with what I have— I always want more."
          },
          {
            "id": "5",
            "value": "I would kill to acquire a noble title."
          },
          {
            "id": "6",
            "value": "I’m horribly jealous of anyone who can outshine my handiwork. Everywhere I go, I’m surrounded by rivals."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "Insight, Persuasion, Artisan’s Tool, Language"
      }
    ]
  },
  {
    "id": "ID_BACKGROUND_FEATURE_GUILD_MEMBERSHIP",
    "type": "Background Feature",
    "name": "Feature: Guild Membership",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-guildartisan.xml",
    "supports": [
      "Background Feature"
    ],
    "description": "As an established and respected member of a guild, you can rely on certain benefits that membership provides. Your fellow guild members will provide you with lodging and food if necessary, and pay for your funeral if needed. In some cities and towns, a guildhall offers a central place to meet other members of your profession, which can be a good place to meet potential patrons, allies, or hirelings. Guilds often wield tremendous political power. If you are accused of a crime, your guild will support you if a good case can be made for your innocence or the crime is justifiable. You can also gain access to powerful political figures through the guild, if you are a member in good standing. Such connections might require the donation of money or magic items to the guild’s coffers. You must pay dues of 5 gp per month to the guild. If you miss payments, you must make up back dues to remain in the guild’s good graces.",
    "descriptionHtml": "<p>As an established and respected member of a guild, you can rely on certain benefits that membership provides. Your fellow guild members will provide you with lodging and food if necessary, and pay for your funeral if needed. In some cities and towns, a guildhall offers a central place to meet other members of your profession, which can be a good place to meet potential patrons, allies, or hirelings.</p>\n\t\t\t<p class=\"indent\">Guilds often wield tremendous political power. If you are accused of a crime, your guild will support you if a good case can be made for your innocence or the crime is justifiable. You can also gain access to powerful political figures through the guild, if you are a member in good standing. Such connections might require the donation of money or magic items to the guild’s coffers.</p>\n\t\t\t<p class=\"indent\">You must pay dues of 5 gp per month to the guild. If you miss payments, you must make up back dues to remain in the guild’s good graces.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_VARIANT_GUILD_MERCHANT",
    "type": "Background Variant",
    "name": "Variant Guild Artisan: Guild Merchant",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-guildartisan.xml",
    "supports": [
      "Variant Guild Artisan"
    ],
    "description": "Instead of an artisans’ guild, you might belong to a guild of traders, caravan masters, or shopkeepers. You don’t craft items yourself but earn a living by buying and selling the works of others (or the raw materials artisans need to practice their craft). Your guild might be a large merchant consortium (or family) with interests across the region. Perhaps you transported goods from one place to another, by ship, wagon, or caravan, or bought them from traveling traders and sold them in your own little shop. In some ways, the traveling merchant’s life lends itself to adventure far more than the life of an artisan. Rather than proficiency with artisan’s tools, you might be proficient with navigator’s tools or an additional language. And instead of artisan’s tools, you can start with a mule and a cart.",
    "descriptionHtml": "<p>Instead of an artisans’ guild, you might belong to a guild of traders, caravan masters, or shopkeepers. You don’t craft items yourself but earn a living by buying and selling the works of others (or the raw materials artisans need to practice their craft). Your guild might be a large merchant consortium (or family) with interests across the region. Perhaps you transported goods from one place to another, by ship, wagon, or caravan, or bought them from traveling traders and sold them in your own little shop. In some ways, the traveling merchant’s life lends itself to adventure far more than the life of an artisan.</p>\n\t\t\t<p class=\"indent\">Rather than proficiency with artisan’s tools, you might be proficient with navigator’s tools or an additional language. And instead of artisan’s tools, you can start with a mule and a cart.</p>",
    "rules": [
      {
        "kind": "select",
        "type": "Background Feature",
        "name": "Guild Merchant Option",
        "supports": "Guild Merchant Option",
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_FEATURE_GUILD_MERCHANT_OPTION_A",
    "type": "Background Feature",
    "name": "Navigator’s Tools",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-guildartisan.xml",
    "supports": [
      "Guild Merchant Option"
    ],
    "description": "Rather than proficiency with artisan’s tools, you might be proficient with navigator’s tools or an additional language.",
    "descriptionHtml": "<p>Rather than proficiency with artisan’s tools, you might be proficient with navigator’s tools or an additional language.</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_TOOL_PROFICIENCY_NAVIGATORS_TOOLS",
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_FEATURE_GUILD_MERCHANT_OPTION_B",
    "type": "Background Feature",
    "name": "Additional Language",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-guildartisan.xml",
    "supports": [
      "Guild Merchant Option"
    ],
    "description": "Rather than proficiency with artisan’s tools, you might be proficient with navigator’s tools or an additional language.",
    "descriptionHtml": "<p>Rather than proficiency with artisan’s tools, you might be proficient with navigator’s tools or an additional language.</p>",
    "rules": [
      {
        "kind": "select",
        "type": "Language",
        "name": "Language (Guild Merchant)",
        "supports": "Standard||Exotic",
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_HERMIT",
    "type": "Background",
    "name": "Hermit",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-hermit.xml",
    "supports": [],
    "description": "You lived in seclusion—either in a sheltered community such as a monastery, or entirely a lone—for a formative part of your life. In your time apart from the clamor of society, you found quiet, solitude, and perhaps some of the answers you were looking for. Skill Proficiencies: Medicine, Religion Tool Proficiencies: Herbalism kit Languages: One of your choice Equipment: A scroll case stuffed full of notes from your studies or prayers, a winter blanket, a set of common clothes, an herbalism kit, and 5 gp LIFE OF SECLUSION What was the reason for your isolation, and what changed to allow you to end your solitude? You can work with your DM to determine the exact nature of your seclusion, or you can choose or roll on the table below to determine the reason behind your seclusion. d8 Life of Seclusion 1 I was searching for spiritual enlightenment. 2 I was partaking of communal living in accordance with the dictates of a religious order. 3 I was exiled for a crime I didn’t commit. 4 I retreated from society after a life-altering event. 5 I needed a quiet place to work on my art, literature, music, or manifesto. 6 I needed to commune with nature, far from civilization. 7 I was the caretaker of an ancient ruin or relic. 8 I was a pilgrim in search of a person, place, or relic of spiritual significance. SUGGESTED CHARACTERISTICS Some hermits are well suited to a life of seclusion, whereas others chafe against it and long for company. Whether they embrace solitude or long to escape it, the solitary life shapes their attitudes and ideals. A few are driven slightly mad by their years apart from society. OTHER HERMITS This hermit background assumes a contemplative sort of seclusion that allows room for study and prayer. If you want to play a rugged wilderness recluse who lives off the land while shunning the company of other people, look at the outlander background. On the other hand, if you want to go in a more religious direction, the acolyte might be what you’re looking for. Or you could even be a charlatan, posing as a wise and holy person and letting pious fools support you.",
    "descriptionHtml": "<p>You lived in seclusion—either in a sheltered community such as a monastery, or entirely a lone—for a formative part of your life. In your time apart from the clamor of society, you found quiet, solitude, and perhaps some of the answers you were looking for.</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li> <strong>Skill Proficiencies:</strong>Medicine, Religion</li>\n\t\t\t\t<li> <strong>Tool Proficiencies:</strong>Herbalism kit</li>\n\t\t\t\t<li> <strong>Languages:</strong>One of your choice</li>\n\t\t\t\t<li> <strong>Equipment:</strong>A scroll case stuffed full of notes from your studies or prayers, a winter blanket, a set of common clothes, an herbalism kit, and 5 gp</li>\n\t\t\t</ul>\n\t\t\t<h5>LIFE OF SECLUSION</h5>\n\t\t\t<p>What was the reason for your isolation, and what changed to allow you to end your solitude? You can work with your DM to determine the exact nature of your seclusion, or you can choose or roll on the table below to determine the reason behind your seclusion.</p>\n\t\t\t<table>\n\t\t\t\t<thead>\n\t\t\t\t\t<tr> <td>d8</td> <td>Life of Seclusion</td> </tr>\n\t\t\t\t</thead>\n\t\t\t\t<tr> <td>1</td> <td>I was searching for spiritual enlightenment.</td> </tr>\n\t\t\t\t<tr> <td>2</td> <td>I was partaking of communal living in accordance with the dictates of a religious order.</td> </tr>\n\t\t\t\t<tr> <td>3</td> <td>I was exiled for a crime I didn’t commit.</td> </tr>\n\t\t\t\t<tr> <td>4</td> <td>I retreated from society after a life-altering event.</td> </tr>\n\t\t\t\t<tr> <td>5</td> <td>I needed a quiet place to work on my art, literature, music, or manifesto.</td> </tr>\n\t\t\t\t<tr> <td>6</td> <td>I needed to commune with nature, far from civilization.</td> </tr>\n\t\t\t\t<tr> <td>7</td> <td>I was the caretaker of an ancient ruin or relic.</td> </tr>\n\t\t\t\t<tr> <td>8</td> <td>I was a pilgrim in search of a person, place, or relic of spiritual significance.</td> </tr>\n\t\t\t</table>\n\t\t\t<div element=\"ID_BACKGROUND_FEATURE_DISCOVERY\" />\n\t\t\t<h5>SUGGESTED CHARACTERISTICS</h5>\n\t\t\t<p>Some hermits are well suited to a life of seclusion, whereas others chafe against it and long for company. Whether they embrace solitude or long to escape it, the solitary life shapes their attitudes and ideals. A few are driven slightly mad by their years apart from society.</p>\n\t\t\t<h5>OTHER HERMITS</h5>\n\t\t\t<p>This hermit background assumes a contemplative sort of seclusion that allows room for study and prayer. If you want to play a rugged wilderness recluse who lives off the land while shunning the company of other people, look at the outlander background. On the other hand, if you want to go in a more religious direction, the acolyte might be what you’re looking for. Or you could even be a charlatan, posing as a wise and holy person and letting pious fools support you.</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_MEDICINE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_RELIGION",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_TOOL_PROFICIENCY_HERBALISM_KIT",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_BACKGROUND_FEATURE_DISCOVERY",
        "requirements": "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Language",
        "name": "Language (Hermit)",
        "supports": "Standard||Exotic",
        "choices": [
          {
            "id": "1",
            "value": "I was searching for spiritual enlightenment."
          },
          {
            "id": "2",
            "value": "I was partaking of communal living in accordance with the dictates of a religious order."
          },
          {
            "id": "3",
            "value": "I was exiled for a crime I didn’t commit."
          },
          {
            "id": "4",
            "value": "I retreated from society after a life-altering event."
          },
          {
            "id": "5",
            "value": "I needed a quiet place to work on my art, literature, music, or manifesto."
          },
          {
            "id": "6",
            "value": "I needed to commune with nature, far from civilization."
          },
          {
            "id": "7",
            "value": "I was the caretaker of an ancient ruin or relic."
          },
          {
            "id": "8",
            "value": "I was a pilgrim in search of a person, place, or relic of spiritual significance."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Personality Trait",
        "choices": [
          {
            "id": "1",
            "value": "I’ve been isolated for so long that I rarely speak, preferring gestures and the occasional grunt."
          },
          {
            "id": "2",
            "value": "I am utterly serene, even in the face of disaster."
          },
          {
            "id": "3",
            "value": "The leader of my community had something wise to say on every topic, and I am eager to share that wisdom."
          },
          {
            "id": "4",
            "value": "I feel tremendous empathy for all who suffer."
          },
          {
            "id": "5",
            "value": "I’m oblivious to etiquette and social expectations."
          },
          {
            "id": "6",
            "value": "I connect everything that happens to me to a grand, cosmic plan."
          },
          {
            "id": "7",
            "value": "I often get lost in my own thoughts and contemplation, becoming oblivious to my surroundings."
          },
          {
            "id": "8",
            "value": "I am working on a grand philosophical theory and love sharing my ideas."
          }
        ],
        "number": 2,
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Greater Good. My gifts are meant to be shared with all, not used for my own benefit. (Good)"
          },
          {
            "id": "2",
            "value": "Logic. Emotions must not cloud our sense of what is right and true, or our logical thinking. (Lawful)"
          },
          {
            "id": "3",
            "value": "Free Thinking. Inquiry and curiosity are the pillars of progress. (Chaotic)"
          },
          {
            "id": "4",
            "value": "Power. Solitude and contemplation are paths toward mystical or magical power. (Evil)"
          },
          {
            "id": "5",
            "value": "Live and Let Live. Meddling in the affairs of others only causes trouble. (Neutral)"
          },
          {
            "id": "6",
            "value": "Self-Knowledge. If you know yourself, there’s nothing left to know. (Any)"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "Nothing is more important than the other members of my hermitage, order, or association."
          },
          {
            "id": "2",
            "value": "I entered seclusion to hide from the ones who might still be hunting me. I must someday confront them."
          },
          {
            "id": "3",
            "value": "I’m still seeking the enlightenment I pursued in my seclusion, and it still eludes me."
          },
          {
            "id": "4",
            "value": "I entered seclusion because I loved someone I could not have."
          },
          {
            "id": "5",
            "value": "Should my discovery come to light, it could bring ruin to the world."
          },
          {
            "id": "6",
            "value": "My isolation gave me great insight into a great evil that only I can destroy."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "Now that I’ve returned to the world, I enjoy its delights a little too much."
          },
          {
            "id": "2",
            "value": "I harbor dark, bloodthirsty thoughts that my isolation and meditation failed to quell."
          },
          {
            "id": "3",
            "value": "I am dogmatic in my thoughts and philosophy."
          },
          {
            "id": "4",
            "value": "I let my need to win arguments overshadow friendships and harmony."
          },
          {
            "id": "5",
            "value": "I’d risk too much to uncover a lost bit of knowledge."
          },
          {
            "id": "6",
            "value": "I like keeping secrets and won’t share them with anyone."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "Medicine, Religion, Herbalism kit, Language"
      }
    ]
  },
  {
    "id": "ID_BACKGROUND_FEATURE_DISCOVERY",
    "type": "Background Feature",
    "name": "Feature: Discovery",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-hermit.xml",
    "supports": [
      "Background Feature"
    ],
    "description": "The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature. It could be a site that no one else has ever seen. You might have uncovered a fact that has long been forgotten, or unearthed some relic of the past that could rewrite history. It might be information that would be damaging to the people who or consigned you to exile, and hence the reason for your return to society. Work with your DM to determine the details of your discovery and its impact on the campaign.",
    "descriptionHtml": "<p>The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature. It could be a site that no one else has ever seen. You might have uncovered a fact that has long been forgotten, or unearthed some relic of the past that could rewrite history. It might be information that would be damaging to the people who or consigned you to exile, and hence the reason for your return to society.</p>\n\t\t\t<p class=\"indent\">Work with your DM to determine the details of your discovery and its impact on the campaign.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_NOBLE",
    "type": "Background",
    "name": "Noble",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-noble.xml",
    "supports": [],
    "description": "You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence. You might be a pampered aristocrat unfamiliar with work or discomfort, a former merchant just elevated to the nobility, or a disinherited scoundrel with a disproportionate sense of entitlement. Or you could be an honest, hard-working landowner who cares deeply about the people who live and work on your land, keenly aware of your responsibility to them. Work with your DM to come up with an appropriate title and determine how much authority that title carries. A noble title doesn’t stand on its own—it’s connected to an entire family, and whatever title you hold, you will pass it down to your own children. Not only do you need to determine your noble title, but you should also work with the DM to describe your family and their influence on you. Is your family old and established, or was your title only recently bestowed? How much influence do they wield, and over what area? What kind of reputation does your family have among the other aristocrats of the region? How do the common people regard them? What’s your position in the family? Are you the heir to the head of the family? Have you already inherited the title? How do you feel about that responsibility? Or are you so far down the line of inheritance that no one cares what you do, as long as you don’t embarrass the family? How does the head of your family feel about your adventuring career? Are you in your family’s good graces, or shunned by the rest of your family? Does your family have a coat of arms? An insignia you might wear on a signet ring? Particular colors you wear all the time? An animal you regard as a symbol of your line or even a spiritual member of the family? These details help establish your family and your title as features of the world of the campaign. Skill Proficiencies: History, Persuasion Tool Proficiencies: One type of gaming set Languages: One of your choice Equipment: A set of fine clothes, a signet ring, a scroll of pedigree, and a purse containing 25 gp SUGGESTED CHARACTERISTICS Nobles are born and raised to a very different lifestyle than most people ever experience, and their personalities reflect that upbringing. A noble title comes with a plethora of bonds—responsibilities to family, to other nobles (including the sovereign), to the people entrusted to the family’s care, or even to the title itself. But this responsibility is often a good way to undermine a noble. VARIANT NOBLE: KNIGHT A knighthood is among the lowest noble titles in most societies, but it can be a path to higher status. If you wish to be a knight, choose the Retainers feature (see the sidebar) instead of the Position of Privilege feature. One of your commoner retainers is replaced by a noble who serves as your squire, aiding you in exchange for training on his or her own path to knighthood. Your two remaining retainers might include a groom to care for your horse and a servant who polishes your armor (and even helps you put it on). As an emblem of chivalry and the ideals of courtly love, you might include among your equipment a banner or other token from a noble lord or lady to whom you have given your heart—in a chaste sort of devotion. (This person could be your bond.) VARIANT FEATURE: RETAINERS If your character has a noble background, you may select this background feature instead of Position of Privilege. You have the service of three retainers loyal to your family. These retainers can be attendants or messengers, and one might be a majordomo. Your retainers are commoners who can perform mundane tasks for you, but they do not fight for you, will not follow you into obviously dangerous areas (such as dungeons), and will leave if they are frequently endangered or abused.",
    "descriptionHtml": "<p>You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence. You might be a pampered aristocrat unfamiliar with work or discomfort, a former merchant just elevated to the nobility, or a disinherited scoundrel with a disproportionate sense of entitlement. Or you could be an honest, hard-working landowner who cares deeply about the people who live and work on your land, keenly aware of your responsibility to them.</p>\n\t\t\t<p class=\"indent\">Work with your DM to come up with an appropriate title and determine how much authority that title carries. A noble title doesn’t stand on its own—it’s connected to an entire family, and whatever title you hold, you will pass it down to your own children. Not only do you need to determine your noble title, but you should also work with the DM to describe your family and their influence on you.</p>\n\t\t\t<p class=\"indent\">Is your family old and established, or was your title only recently bestowed? How much influence do they wield, and over what area? What kind of reputation does your family have among the other aristocrats of the region? How do the common people regard them?</p>\n\t\t\t<p class=\"indent\">What’s your position in the family? Are you the heir to the head of the family? Have you already inherited the title? How do you feel about that responsibility? Or are you so far down the line of inheritance that no one cares what you do, as long as you don’t embarrass the family? How does the head of your family feel about your adventuring career? Are you in your family’s good graces, or shunned by the rest of your family?</p>\n\t\t\t<p class=\"indent\">Does your family have a coat of arms? An insignia you might wear on a signet ring? Particular colors you wear all the time? An animal you regard as a symbol of your line or even a spiritual member of the family?</p>\n\t\t\t<p class=\"indent\">These details help establish your family and your title as features of the world of the campaign.</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li><strong>Skill Proficiencies:</strong> History, Persuasion</li>\n\t\t\t\t<li><strong>Tool Proficiencies:</strong> One type of gaming set</li>\n\t\t\t\t<li><strong>Languages:</strong> One of your choice</li>\n\t\t\t\t<li><strong>Equipment:</strong> A set of fine clothes, a signet ring, a scroll of pedigree, and a purse containing 25 gp</li>\n\t\t\t</ul>\n\t\t\t<div element=\"ID_BACKGROUND_FEATURE_POSITIONOFPRIVILEGE\" />\n\t\t\t<h5>SUGGESTED CHARACTERISTICS</h5>\n\t\t\t<p>Nobles are born and raised to a very different lifestyle than most people ever experience, and their personalities reflect that upbringing. A noble title comes with a plethora of bonds—responsibilities to family, to other nobles (including the sovereign), to the people entrusted to the family’s care, or even to the title itself. But this responsibility is often a good way to undermine a noble.</p>\n\t\t\t<h4>VARIANT NOBLE: KNIGHT</h4>\n\t\t\t<p>A knighthood is among the lowest noble titles in most societies, but it can be a path to higher status. If you wish to be a knight, choose the Retainers feature (see the sidebar) instead of the Position of Privilege feature. One of your commoner retainers is replaced by a noble who serves as your squire, aiding you in exchange for training on his or her own path to knighthood. Your two remaining retainers might include a groom to care for your horse and a servant who polishes your armor (and even helps you put it on).</p>\n\t\t\t<p class=\"indent\">As an emblem of chivalry and the ideals of courtly love, you might include among your equipment a banner or other token from a noble lord or lady to whom you have given your heart—in a chaste sort of devotion. (This person could be your bond.)</p>\n\t\t\t<h4>VARIANT FEATURE: RETAINERS</h4>\n\t\t\t<p>If your character has a noble background, you may select this background feature instead of Position of Privilege. You have the service of three retainers loyal to your family. These retainers can be attendants or messengers, and one might be a majordomo. Your retainers are commoners who can perform mundane tasks for you, but they do not fight for you, will not follow you into obviously dangerous areas (such as dungeons), and will leave if they are frequently endangered or abused.</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_HISTORY",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_PERSUASION",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_BACKGROUND_FEATURE_POSITIONOFPRIVILEGE",
        "requirements": "!ID_WOTC_PHB_BACKGROUND_FEATURE_KNIGHT_RETAINERS,!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Proficiency",
        "name": "Gaming Set (Noble)",
        "supports": "Gaming Set",
        "choices": [
          {
            "id": "1",
            "value": "My eloquent flattery makes everyone I talk to feel like the most wonderful and important person in the world."
          },
          {
            "id": "2",
            "value": "The common folk love me for my kindness and generosity."
          },
          {
            "id": "3",
            "value": "No one could doubt by looking at my regal bearing that I am a cut above the unwashed masses."
          },
          {
            "id": "4",
            "value": "I take great pains to always look my best and follow the latest fashions."
          },
          {
            "id": "5",
            "value": "I don’t like to get my hands dirty, and I won’t be caught dead in unsuitable accommodations."
          },
          {
            "id": "6",
            "value": "Despite my noble birth, I do not place myself above other folk. We all have the same blood."
          },
          {
            "id": "7",
            "value": "My favor, once lost, is lost forever."
          },
          {
            "id": "8",
            "value": "If you do me an injury, I will crush you, ruin your name, and salt your fields."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Respect. Respect is due to me because of my position, but all people regardless of station deserve to be treated with dignity. (Good)"
          },
          {
            "id": "2",
            "value": "Responsibility. It is my duty to respect the authority of those above me, just as those below me must respect mine. (Lawful)"
          },
          {
            "id": "3",
            "value": "Independence. I must prove that I can handle myself without the coddling of my family. (Chaotic)"
          },
          {
            "id": "4",
            "value": "Power. If I can attain more power, no one will tell me what to do. (Evil)"
          },
          {
            "id": "5",
            "value": "Family. Blood runs thicker than water. (Any)"
          },
          {
            "id": "6",
            "value": "Noble Obligation. It is my duty to protect and care for the people beneath me. (Good)"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "I will face any challenge to win the approval of my family."
          },
          {
            "id": "2",
            "value": "My house’s alliance with another noble family must be sustained at all costs."
          },
          {
            "id": "3",
            "value": "Nothing is more important than the other members of my family."
          },
          {
            "id": "4",
            "value": "I am in love with the heir of a family that my family despises."
          },
          {
            "id": "5",
            "value": "My loyalty to my sovereign is unwavering."
          },
          {
            "id": "6",
            "value": "The common folk must see me as a hero of the people."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "I secretly believe that everyone is beneath me."
          },
          {
            "id": "2",
            "value": "I hide a truly scandalous secret that could ruin my family forever."
          },
          {
            "id": "3",
            "value": "I too often hear veiled insults and threats in every word addressed to me, and I’m quick to anger."
          },
          {
            "id": "4",
            "value": "I have an insatiable desire for carnal pleasures."
          },
          {
            "id": "5",
            "value": "In fact, the world does revolve around me."
          },
          {
            "id": "6",
            "value": "By my words and actions, I often bring shame to my family."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "History, Persuasion, Gaming Set, Language"
      }
    ]
  },
  {
    "id": "ID_BACKGROUND_FEATURE_POSITIONOFPRIVILEGE",
    "type": "Background Feature",
    "name": "Feature: Position of Privilege",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-noble.xml",
    "supports": [
      "Background Feature",
      "Noble"
    ],
    "description": "Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. The common folk make every effort to accommodate you and avoid your displeasure, and other people of high birth treat you as a member of the same social sphere. You can secure an audience with a local noble if you need to.",
    "descriptionHtml": "<p>Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. The common folk make every effort to accommodate you and avoid your displeasure, and other people of high birth treat you as a member of the same social sphere. You can secure an audience with a local noble if you need to.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_WOTC_PHB_BACKGROUND_VARIANT_NOBLE_KNIGHT",
    "type": "Background Variant",
    "name": "Variant Noble: Knight",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-noble.xml",
    "supports": [
      "Variant Noble"
    ],
    "description": "A knighthood is among the lowest noble titles in most societies, but it can be a path to higher status. If you wish to be a knight, choose the Retainers feature (see the sidebar) instead of the Position of Privilege feature. One of your commoner retainers is replaced by a noble who serves as your squire, aiding you in exchange for training on his or her own path to knighthood. Your two remaining retainers might include a groom to care for your horse and a servant who polishes your armor (and even helps you put it on). As an emblem of chivalry and the ideals of courtly love, you might include among your equipment a banner or other token from a noble lord or lady to whom you have given your heart—in a chaste sort of devotion. (This person could be your bond.)",
    "descriptionHtml": "<p>A knighthood is among the lowest noble titles in most societies, but it can be a path to higher status. If you wish to be a knight, choose the Retainers feature (see the sidebar) instead of the Position of Privilege feature. One of your commoner retainers is replaced by a noble who serves as your squire, aiding you in exchange for training on his or her own path to knighthood. Your two remaining retainers might include a groom to care for your horse and a servant who polishes your armor (and even helps you put it on).</p>\n\t\t\t<p class=\"indent\">As an emblem of chivalry and the ideals of courtly love, you might include among your equipment a banner or other token from a noble lord or lady to whom you have given your heart—in a chaste sort of devotion. (This person could be your bond.)</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_WOTC_PHB_BACKGROUND_FEATURE_KNIGHT_RETAINERS",
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": []
  },
  {
    "id": "ID_WOTC_PHB_BACKGROUND_FEATURE_KNIGHT_RETAINERS",
    "type": "Background Feature",
    "name": "Feature: Retainers",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-noble.xml",
    "supports": [
      "Background Feature",
      "Noble"
    ],
    "description": "If your character has a noble background, you may select this background feature instead of Position of Privilege. You have the service of three retainers loyal to your family. These retainers can be attendants or messengers, and one might be a majordomo. Your retainers are commoners who can perform mundane tasks for you, but they do not fight for you, will not follow you into obviously dangerous areas (such as dungeons), and will leave if they are frequently endangered or abused.",
    "descriptionHtml": "<p>If your character has a noble background, you may select this background feature instead of Position of Privilege. You have the service of three retainers loyal to your family. These retainers can be attendants or messengers, and one might be a majordomo. Your retainers are commoners who can perform mundane tasks for you, but they do not fight for you, will not follow you into obviously dangerous areas (such as dungeons), and will leave if they are frequently endangered or abused.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_OUTLANDER",
    "type": "Background",
    "name": "Outlander",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-outlander.xml",
    "supports": [],
    "description": "You grew up in the wilds, far from civilization and the comforts of town and technology. You’ve witnessed the migration of herds larger than forests, survived weather more extreme than any city-dweller could comprehend, and enjoyed the solitude of being the only thinking creature for miles in any direction. The wilds are in your blood, whether you were a nomad, an explorer, a recluse, a hunter-gatherer, or even a marauder. Even in places where you don’t know the specific features of the terrain, you know the ways of the wild. Skill Proficiencies: Athletics, Survival Tool Proficiencies: One type of musical instrument Languages: One of your choice Equipment: A staff, a hunting trap, a trophy from an animal you killed, a set of traveler’s clothes, and a belt pouch containing 10 gp Origin You’ve been to strange places and seen things that others cannot begin to fathom. Consider some of the distant lands you have visited, and how they impacted you. You can roll on the following table to determine your occupation during your time in the wild, or choose one that best fits your character. d10 Origin 1 Forester 2 Trapper 3 Homesteader 4 Guide 5 Exile or outcast 6 Bounty hunter 7 Pilgrim 8 Tribal nomad 9 Hunter-gatherer 10 Tribal marauder Suggested Characteristics Often considered rude and uncouth among civilized folk, outlanders have little respect for the niceties of life in the cities. The ties of tribe, clan, family, and the natural world of which they are a part are the most important bonds to most outlanders.",
    "descriptionHtml": "<p>You grew up in the wilds, far from civilization and the comforts of town and technology. You’ve witnessed the migration of herds larger than forests, survived weather more extreme than any city-dweller could comprehend, and enjoyed the solitude of being the only thinking creature for miles in any direction. The wilds are in your blood, whether you were a nomad, an explorer, a recluse, a hunter-gatherer, or even a marauder. Even in places where you don’t know the specific features of the terrain, you know the ways of the wild.</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li><strong>Skill Proficiencies:</strong> Athletics, Survival</li>\n\t\t\t\t<li><strong>Tool Proficiencies:</strong> One type of musical instrument</li>\n\t\t\t\t<li><strong>Languages:</strong> One of your choice</li>\n\t\t\t\t<li><strong>Equipment:</strong> A staff, a hunting trap, a trophy from an animal you killed, a set of traveler’s clothes, and a belt pouch containing 10 gp</li>\n\t\t\t</ul>\n\t\t\t<h5>Origin</h5>\n\t\t\t<p>You’ve been to strange places and seen things that others cannot begin to fathom. Consider some of the distant lands you have visited, and how they impacted you. You can roll on the following table to determine your occupation during your time in the wild, or choose one that best fits your character.</p>\n\t\t\t<table>\n\t\t\t\t<thead>\n\t\t\t\t\t<tr><td class=\"col-10\">d10</td><td>Origin</td></tr>\n\t\t\t\t</thead>\n\t\t\t\t<tr><td>1</td><td>Forester</td></tr>\n\t\t\t\t<tr><td>2</td><td>Trapper</td></tr>\n\t\t\t\t<tr><td>3</td><td>Homesteader</td></tr>\n\t\t\t\t<tr><td>4</td><td>Guide</td></tr>\n\t\t\t\t<tr><td>5</td><td>Exile or outcast</td></tr>\n\t\t\t\t<tr><td>6</td><td>Bounty hunter</td></tr>\n\t\t\t\t<tr><td>7</td><td>Pilgrim</td></tr>\n\t\t\t\t<tr><td>8</td><td>Tribal nomad</td></tr>\n\t\t\t\t<tr><td>9</td><td>Hunter-gatherer</td></tr>\n\t\t\t\t<tr><td>10</td><td>Tribal marauder</td></tr>\n\t\t\t</table>\n\t\t\t<div element=\"ID_BACKGROUND_FEATURE_WANDERER\" />\n\t\t\t<h5>Suggested Characteristics</h5>\n\t\t\t<p>Often considered rude and uncouth among civilized folk, outlanders have little respect for the niceties of life in the cities. The ties of tribe, clan, family, and the natural world of which they are a part are the most important bonds to most outlanders.</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_ATHLETICS",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_SURVIVAL",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_BACKGROUND_FEATURE_WANDERER",
        "requirements": "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Background Feature",
        "name": "Variant Feature",
        "supports": "Optional Background Feature",
        "choices": [
          {
            "id": "1",
            "value": "Forester"
          },
          {
            "id": "2",
            "value": "Trapper"
          },
          {
            "id": "3",
            "value": "Homesteader"
          },
          {
            "id": "4",
            "value": "Guide"
          },
          {
            "id": "5",
            "value": "Exile or outcast"
          },
          {
            "id": "6",
            "value": "Bounty hunter"
          },
          {
            "id": "7",
            "value": "Pilgrim"
          },
          {
            "id": "8",
            "value": "Tribal nomad"
          },
          {
            "id": "9",
            "value": "Hunter-gatherer"
          },
          {
            "id": "10",
            "value": "Tribal marauder"
          }
        ],
        "optional": true,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Personality Trait",
        "choices": [
          {
            "id": "1",
            "value": "I’m driven by a wanderlust that led me away from home."
          },
          {
            "id": "2",
            "value": "I watch over my friends as if they were a litter of newborn pups."
          },
          {
            "id": "3",
            "value": "I once ran twenty-five miles without stopping to warn to my clan of an approaching orc horde. I’d do it again if I had to."
          },
          {
            "id": "4",
            "value": "I have a lesson for every situation, drawn from observing nature."
          },
          {
            "id": "5",
            "value": "I place no stock in wealthy or well-mannered folk. Money and manners won’t save you from a hungry owlbear."
          },
          {
            "id": "6",
            "value": "I’m always picking things up, absently fiddling with them, and sometimes accidentally breaking them."
          },
          {
            "id": "7",
            "value": "I feel far more comfortable around animals than people."
          },
          {
            "id": "8",
            "value": "I was, in fact, raised by wolves."
          }
        ],
        "number": 2,
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Change. Life is like the seasons, in constant change, and we must change with it. (Chaotic)"
          },
          {
            "id": "2",
            "value": "Greater Good. It is each person’s responsibility to make the most happiness for the whole tribe. (Good)"
          },
          {
            "id": "3",
            "value": "Honor. If I dishonor myself, I dishonor my whole clan. (Lawful)"
          },
          {
            "id": "4",
            "value": "Might. The strongest are meant to rule. (Evil)"
          },
          {
            "id": "5",
            "value": "Nature. The natural world is more important than all the constructs of civilization. (Neutral)"
          },
          {
            "id": "6",
            "value": "Glory. I must earn glory in battle, for myself and my clan. (Any)"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "My family, clan, or tribe is the most important thing in my life, even when they are far from me."
          },
          {
            "id": "2",
            "value": "An injury to the unspoiled wilderness of my home is an injury to me."
          },
          {
            "id": "3",
            "value": "I will bring terrible wrath down on the evildoers who destroyed my homeland."
          },
          {
            "id": "4",
            "value": "I am the last of my tribe, and it is up to me to ensure their names enter legend."
          },
          {
            "id": "5",
            "value": "I suffer awful visions of a coming disaster and will do anything to prevent it."
          },
          {
            "id": "6",
            "value": "It is my duty to provide children to sustain my tribe."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "I am too enamored of ale, wine, and other intoxicants."
          },
          {
            "id": "2",
            "value": "There’s no room for caution in a life lived to the fullest."
          },
          {
            "id": "3",
            "value": "I remember every insult I’ve received and nurse a silent resentment toward anyone who’s ever wronged me."
          },
          {
            "id": "4",
            "value": "I am slow to trust members of other races, tribes, and societies."
          },
          {
            "id": "5",
            "value": "Violence is my answer to almost any challenge."
          },
          {
            "id": "6",
            "value": "Don’t expect me to save those who can’t save themselves. It is nature’s way that the strong thrive and the weak perish."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "Athletics, Survival, Instrument, Language"
      }
    ]
  },
  {
    "id": "ID_BACKGROUND_FEATURE_WANDERER",
    "type": "Background Feature",
    "name": "Feature: Wanderer",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-outlander.xml",
    "supports": [
      "Background Feature"
    ],
    "description": "You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and fresh water for yourself and up to five other people each day, provided that the land offers berries, small game, water, and so forth.",
    "descriptionHtml": "<p>You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and fresh water for yourself and up to five other people each day, provided that the land offers berries, small game, water, and so forth.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_SAGE",
    "type": "Background",
    "name": "Sage",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-sage.xml",
    "supports": [],
    "description": "You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you. Your efforts have made you a master in your fields of study. Skill Proficiencies: Arcana, History Languages: Two of your choice Equipment: A bottle of black ink, a quill, a small knife, a letter from a dead colleague posing a question you have not yet been able to answer, a set of common clothes, and a belt pouch containing 10 gp SPECIALTY To determine the nature of your scholarly training, roll a d8 or choose from the options in the table below. d8 Specialty 1 Alchemist 2 Astronomer 3 Discredited Academic 4 Librarian 5 Professor 6 Researcher 7 Wizard’s Apprentice 8 Scribe SUGGESTED CHARACTERISTICS Sages are defined by their extensive studies, and their characteristics reflect this life of study. Devoted to scholarly pursuits, a sage values knowledge highly—sometimes in its own right, sometimes as a means toward other ideals.",
    "descriptionHtml": "<p>You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you. Your efforts have made you a master in your fields of study.</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li><strong>Skill Proficiencies:</strong>Arcana, History</li>\n\t\t\t\t<li><strong>Languages:</strong>Two of your choice</li>\n\t\t\t\t<li><strong>Equipment:</strong>A bottle of black ink, a quill, a small knife, a letter from a dead colleague posing a question you have not yet been able to answer, a set of common clothes, and a belt pouch containing 10 gp</li>\n\t\t\t</ul>\n\t\t\t<h5>SPECIALTY</h5>\n\t\t\t<p>To determine the nature of your scholarly training, roll a d8 or choose from the options in the table below.</p>\n\t\t\t<table>\n\t\t\t\t<thead>\n\t\t\t\t\t<tr><td class=\"col-20\">d8</td><td>Specialty</td></tr>\n\t\t\t\t</thead>\n\t\t\t\t<tr><td>1</td><td>Alchemist</td></tr>\n\t\t\t\t<tr><td>2</td><td>Astronomer</td></tr>\n\t\t\t\t<tr><td>3</td><td>Discredited Academic</td></tr>\n\t\t\t\t<tr><td>4</td><td>Librarian</td></tr>\n\t\t\t\t<tr><td>5</td><td>Professor</td></tr>\n\t\t\t\t<tr><td>6</td><td>Researcher</td></tr>\n\t\t\t\t<tr><td>7</td><td>Wizard’s Apprentice</td></tr>\n\t\t\t\t<tr><td>8</td><td>Scribe</td></tr>\n\t\t\t</table>\n\t\t\t<div element=\"ID_BACKGROUND_FEATURE_RESEARCHER\" />\n\t\t\t<h5>SUGGESTED CHARACTERISTICS</h5>\n\t\t\t<p>Sages are defined by their extensive studies, and their characteristics reflect this life of study. Devoted to scholarly pursuits, a sage values knowledge highly—sometimes in its own right, sometimes as a means toward other ideals.</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_ARCANA",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_HISTORY",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_BACKGROUND_FEATURE_RESEARCHER",
        "requirements": "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Language",
        "name": "Language (Sage)",
        "supports": "Standard||Exotic",
        "choices": [
          {
            "id": "1",
            "value": "Alchemist"
          },
          {
            "id": "2",
            "value": "Astronomer"
          },
          {
            "id": "3",
            "value": "Discredited Academic"
          },
          {
            "id": "4",
            "value": "Librarian"
          },
          {
            "id": "5",
            "value": "Professor"
          },
          {
            "id": "6",
            "value": "Researcher"
          },
          {
            "id": "7",
            "value": "Wizard’s Apprentice"
          },
          {
            "id": "8",
            "value": "Scribe"
          }
        ],
        "number": 2,
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Personality Trait",
        "choices": [
          {
            "id": "1",
            "value": "I use polysyllabic words that convey the impression of great erudition."
          },
          {
            "id": "2",
            "value": "I’ve read every book in the world’s greatest libraries— or I like to boast that I have."
          },
          {
            "id": "3",
            "value": "I’m used to helping out those who aren’t as smart as I am, and I patiently explain anything and everything to others."
          },
          {
            "id": "4",
            "value": "There’s nothing I like more than a good mystery."
          },
          {
            "id": "5",
            "value": "I’m willing to listen to every side of an argument before I make my own judgment."
          },
          {
            "id": "6",
            "value": "I ... speak ... slowly ... when talking ... to idiots, ... which ... almost ... everyone ... is .. compared ... to me."
          },
          {
            "id": "7",
            "value": "I am horribly, horribly awkward in social situations."
          },
          {
            "id": "8",
            "value": "I’m convinced that people are always trying to steal my secrets."
          }
        ],
        "number": 2,
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Knowledge. The path to power and self-improvement is through knowledge. (Neutral)"
          },
          {
            "id": "2",
            "value": "Beauty. What is beautiful points us beyond itself toward what is true. (Good)"
          },
          {
            "id": "3",
            "value": "Logic. Emotions must not cloud our logical thinking. (Lawful)"
          },
          {
            "id": "4",
            "value": "No Limits. Nothing should fetter the infinite possibility inherent in all existence. (Chaotic)"
          },
          {
            "id": "5",
            "value": "Power. Knowledge is the path to power and domination. (Evil)"
          },
          {
            "id": "6",
            "value": "Self-Improvement. The goal of a life of study is the betterment of oneself. (Any)"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "It is my duty to protect my students."
          },
          {
            "id": "2",
            "value": "I have an ancient text that holds terrible secrets that must not fall into the wrong hands."
          },
          {
            "id": "3",
            "value": "I work to preserve a library, university, scriptorium, or monastery."
          },
          {
            "id": "4",
            "value": "My life’s work is a series of tomes related to a specific field of lore."
          },
          {
            "id": "5",
            "value": "I've been searching my whole life for the answer to a certain question."
          },
          {
            "id": "6",
            "value": "I sold my soul for knowledge. I hope to do great deeds and win it back."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "I am easily distracted by the promise of information."
          },
          {
            "id": "2",
            "value": "Most people scream and run when they see a demon. I stop and take notes on its anatomy."
          },
          {
            "id": "3",
            "value": "Unlocking an ancient mystery is worth the price of a civilization."
          },
          {
            "id": "4",
            "value": "I overlook obvious solutions in favor of complicated ones."
          },
          {
            "id": "5",
            "value": "I speak without really thinking through my words, invariably insulting others."
          },
          {
            "id": "6",
            "value": "I can’t keep a secret to save my life, or anyone else’s."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "Arcana, History, 2 Languages"
      }
    ]
  },
  {
    "id": "ID_BACKGROUND_FEATURE_RESEARCHER",
    "type": "Background Feature",
    "name": "Feature: Researcher",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-sage.xml",
    "supports": [
      "Background Feature"
    ],
    "description": "When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature. Your DM might rule that the knowledge you seek is secreted away in an almost inaccessible place, or that it simply cannot be found. Unearthing the deepest secrets of the multiverse can require an adventure or even a whole campaign",
    "descriptionHtml": "<p>When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature. Your DM might rule that the knowledge you seek is secreted away in an almost inaccessible place, or that it simply cannot be found. Unearthing the deepest secrets of the multiverse can require an adventure or even a whole campaign</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_SAILOR",
    "type": "Background",
    "name": "Sailor",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-sailer.xml",
    "supports": [],
    "description": "You sailed on a seagoing vessel for years. In that time, you faced down mighty storms, monsters of the deep, and those who wanted to sink your craft to the bottomless depths. Your first love is the distant line of the horizon, but the time has come to try your hand at something new. Discuss the nature of the ship you previously sailed with your Dungeon Master. Was it a merchant ship, a naval vessel, a ship of discovery, or a pirate ship? How famous (or infamous) is it? Is it widely traveled? Is it still sailing, or is it missing and presumed lost with all hands? What were your duties on board—boatswain, captain, navigator, cook, or some other position? Who were the captain and first mate? Did you leave your ship on good terms with your fellows, or on the run? Skill Proficiencies: Athletics, Perception Tool Proficiencies: Navigator’s tools, vehicles (water) Equipment: A belaying pin (club), 50 feet of silk rope, a lucky charm such as a rabbit foot or a small stone with a hole in the center (or you may roll for a random trinket on the Trinkets table in chapter 5), a set of common clothes, and a belt pouch containing 10 gp SUGGESTED CHARACTERISTICS Sailors can be a rough lot, but the responsibilities of life on a ship make them generally reliable as well. Life aboard a ship shapes their outlook and forms their most important attachments.",
    "descriptionHtml": "<p>You sailed on a seagoing vessel for years. In that time, you faced down mighty storms, monsters of the deep, and those who wanted to sink your craft to the bottomless depths. Your first love is the distant line of the horizon, but the time has come to try your hand at something new.</p>\n\t\t\t<p class=\"indent\">Discuss the nature of the ship you previously sailed with your Dungeon Master. Was it a merchant ship, a naval vessel, a ship of discovery, or a pirate ship? How famous (or infamous) is it? Is it widely traveled? Is it still sailing, or is it missing and presumed lost with all hands?</p>\n\t\t\t<p class=\"indent\">What were your duties on board—boatswain, captain, navigator, cook, or some other position? Who were the captain and first mate? Did you leave your ship on good terms with your fellows, or on the run?</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li> <strong>Skill Proficiencies:</strong> Athletics, Perception</li>\n\t\t\t\t<li> <strong>Tool Proficiencies:</strong> Navigator’s tools, vehicles (water)</li>\n\t\t\t\t<li> <strong>Equipment:</strong> A belaying pin (club), 50 feet of silk rope, a lucky charm such as a rabbit foot or a small stone with a hole in the center (or you may roll for a random trinket on the Trinkets table in chapter 5), a set of common clothes, and a belt pouch containing 10 gp</li>\n\t\t\t</ul>\n\t\t\t<div element=\"ID_WOTC_PHB_BACKGROUND_FEATURE_SAILOR_SHIPS_PASSAGE\" />\n\t\t\t<h5>SUGGESTED CHARACTERISTICS</h5>\n\t\t\t<p>Sailors can be a rough lot, but the responsibilities of life on a ship make them generally reliable as well. Life aboard a ship shapes their outlook and forms their most important attachments.</p>\n\t\t\t<div element=\"ID_WOTC_PHB_BACKGROUND_VARIANT_SAILOR_PIRATE\" />\n\t\t\t<div element=\"ID_WOCT_PHB_BACKGROUND_FEATURE_PIRATE_BAD_REPUTATION\" />",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_ATHLETICS",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_PERCEPTION",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_TOOL_PROFICIENCY_NAVIGATORS_TOOLS",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_TOOL_PROFICIENCY_VEHICLES_WATER",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_WOTC_PHB_BACKGROUND_FEATURE_SAILOR_SHIPS_PASSAGE",
        "requirements": "!ID_WOCT_PHB_BACKGROUND_FEATURE_PIRATE_BAD_REPUTATION,!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Background Variant",
        "name": "Variant Sailor",
        "supports": "Background Variant, Sailor",
        "choices": [
          {
            "id": "1",
            "value": "My friends know they can rely on me, no matter what."
          },
          {
            "id": "2",
            "value": "I work hard so that I can play hard when the work is done."
          },
          {
            "id": "3",
            "value": "I enjoy sailing into new ports and making new friends over a flagon of ale."
          },
          {
            "id": "4",
            "value": "I stretch the truth for the sake of a good story."
          },
          {
            "id": "5",
            "value": "To me, a tavern brawl is a nice way to get to know a new city."
          },
          {
            "id": "6",
            "value": "I never pass up a friendly wager."
          },
          {
            "id": "7",
            "value": "My language is as foul as an otyugh nest."
          },
          {
            "id": "8",
            "value": "I like a job well done, especially if I can convince someone else to do it."
          }
        ],
        "optional": true,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Respect. The thing that keeps a ship together is mutual respect between captain and crew. (Good)"
          },
          {
            "id": "2",
            "value": "Fairness. We all do the work, so we all share in the rewards. (Lawful)"
          },
          {
            "id": "3",
            "value": "Freedom. The sea is freedom—the freedom to go anywhere and do anything. (Chaotic)"
          },
          {
            "id": "4",
            "value": "Mastery. I’m a predator, and the other ships on the sea are my prey. (Evil)"
          },
          {
            "id": "5",
            "value": "People. I’m committed to my crewmates, not to ideals. (Neutral)"
          },
          {
            "id": "6",
            "value": "Aspiration. Someday I’ll own my own ship and chart my own destiny. (Any)"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "I’m loyal to my captain first, everything else second."
          },
          {
            "id": "2",
            "value": "The ship is most important—crewmates and captains come and go."
          },
          {
            "id": "3",
            "value": "I’ll always remember my first ship."
          },
          {
            "id": "4",
            "value": "In a harbor town, I have a paramour whose eyes nearly stole me from the sea."
          },
          {
            "id": "5",
            "value": "I was cheated out of my fair share of the profits, and I want to get my due."
          },
          {
            "id": "6",
            "value": "Ruthless pirates murdered my captain and crewmates, plundered our ship, and left me to die. Vengeance will be mine."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "I follow orders, even if I think they’re wrong."
          },
          {
            "id": "2",
            "value": "I’ll say anything to avoid having to do extra work."
          },
          {
            "id": "3",
            "value": "Once someone questions my courage, I never back down no matter how dangerous the situation."
          },
          {
            "id": "4",
            "value": "Once I start drinking, it’s hard for me to stop."
          },
          {
            "id": "5",
            "value": "I can’t help but pocket loose coins and other trinkets I come across."
          },
          {
            "id": "6",
            "value": "My pride will probably lead to my destruction."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "Athletics, Perception, Navigator’s Tools, Vehicles (Water)"
      }
    ]
  },
  {
    "id": "ID_WOTC_PHB_BACKGROUND_FEATURE_SAILOR_SHIPS_PASSAGE",
    "type": "Background Feature",
    "name": "Feature: Ship’s Passage",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-sailer.xml",
    "supports": [
      "Background Feature"
    ],
    "description": "When you need to, you can secure free passage on a sailing ship for yourself and your adventuring companions. You might sail on the ship you served on, or another ship you have good relations with (perhaps one captained by a former crewmate). Because you’re calling in a favor, you can’t be certain of a schedule or route that will meet your every need. Your Dungeon Master will determine how long it takes to get where you need to go. In return for your free passage, you and your companions are expected to assist the crew during the voyage.",
    "descriptionHtml": "<p>When you need to, you can secure free passage on a sailing ship for yourself and your adventuring companions. You might sail on the ship you served on, or another ship you have good relations with (perhaps one captained by a former crewmate). Because you’re calling in a favor, you can’t be certain of a schedule or route that will meet your every need. Your Dungeon Master will determine how long it takes to get where you need to go. In return for your free passage, you and your companions are expected to assist the crew during the voyage.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_WOTC_PHB_BACKGROUND_VARIANT_SAILOR_PIRATE",
    "type": "Background Variant",
    "name": "Variant Sailor: Pirate",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-sailer.xml",
    "supports": [
      "Background Variant",
      "Sailor"
    ],
    "description": "You spent your youth under the sway of a dread pirate, a ruthless cutthroat who taught you how to survive in a world of sharks and savages. You’ve indulged in larceny on the high seas and sent more than one deserving soul to a briny grave. Fear and bloodshed are no strangers to you, and you’ve garnered a somewhat unsavory reputation in many a port town. If you decide that your sailing career involved piracy, you can choose the Bad Reputation feature instead of the Ship’s Passage feature.",
    "descriptionHtml": "<p>You spent your youth under the sway of a dread pirate, a ruthless cutthroat who taught you how to survive in a world of sharks and savages. You’ve indulged in larceny on the high seas and sent more than one deserving soul to a briny grave. Fear and bloodshed are no strangers to you, and you’ve garnered a somewhat unsavory reputation in many a port town.</p>\n\t\t\t<p class=\"indent\">If you decide that your sailing career involved piracy, you can choose the Bad Reputation feature instead of the Ship’s Passage feature.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_WOCT_PHB_BACKGROUND_FEATURE_PIRATE_BAD_REPUTATION",
    "type": "Background Feature",
    "name": "Variant Feature: Bad Reputation",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-sailer.xml",
    "supports": [
      "Background Feature",
      "Sailor"
    ],
    "description": "If your character has a sailor background, you may select Ihis background feature instead of Ship’s Passage. No matter where you go, people are afraid of you due to your reputation. When you are in a civilized settlement, you can get away with minor criminal offenses, such as refusing to pay for food at a tavern or breaking down doors at a local shop, since most people will not report your activity to the authorities.",
    "descriptionHtml": "<p>If your character has a sailor background, you may select Ihis background feature instead of Ship’s Passage.</p>\n\t\t\t<p class=\"indent\">No matter where you go, people are afraid of you due to your reputation. When you are in a civilized settlement, you can get away with minor criminal offenses, such as refusing to pay for food at a tavern or breaking down doors at a local shop, since most people will not report your activity to the authorities.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_SOLDIER",
    "type": "Background",
    "name": "Soldier",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-soldier.xml",
    "supports": [],
    "description": "War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, including how to stay alive on the battlefield. You might have been part of a standing national army or a mercenary company, or perhaps a member of a local militia who rose to prominence during a recent war. When you choose this background, work with your DM to determine which military organization you were a part of, how far through its ranks you progressed, and what kind of experiences you had during your military career. Was it a standing army, a town guard, or a village militia? Or it might have been a noble’s or merchant’s private army, or a mercenary company. Skill Proficiencies: Athletics, Intimidation Tool Proficiencies: One type of gaming set, vehicles (land) Equipment: An insignia of rank, a trophy taken from a fallen enemy (a dagger, broken blade, or piece of a banner), a set of bone dice or deck of cards, a set of common clothes, and a belt pouch containing 10 gp SPECIALTY During your time as a soldier, you had a specific role to play in your unit or army. Roll a d8 or choose from the options in the table below to determine your role: d8 Specialty 1 Officer 2 Scout 3 Infantry 4 Cavalry 5 Healer 6 Quartermaster 7 Standard bearer 8 Support staff (cook, blacksmith, or the like) SUGGESTED CHARACTERISTICS The horrors of war combined with the rigid discipline of military service leave their mark on all soldiers, shaping their ideals, creating strong bonds, and often leaving them scarred and vulnerable to fear, shame, and hatred.",
    "descriptionHtml": "<p>War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, including how to stay alive on the battlefield. You might have been part of a standing national army or a mercenary company, or perhaps a member of a local militia who rose to prominence during a recent war.</p>\n\t\t\t<p class=\"indent\">When you choose this background, work with your DM to determine which military organization you were a part of, how far through its ranks you progressed, and what kind of experiences you had during your military career. Was it a standing army, a town guard, or a village militia? Or it might have been a noble’s or merchant’s private army, or a mercenary company.</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li><strong>Skill Proficiencies:</strong> Athletics, Intimidation</li>\n\t\t\t\t<li><strong>Tool Proficiencies:</strong> One type of gaming set, vehicles (land)</li>\n\t\t\t\t<li><strong>Equipment:</strong> An insignia of rank, a trophy taken from a fallen enemy (a dagger, broken blade, or piece of a banner), a set of bone dice or deck of cards, a set of common clothes, and a belt pouch containing 10 gp</li>\n\t\t\t</ul>\n\t\t\t<h5>SPECIALTY</h5>\n\t\t\t<p>During your time as a soldier, you had a specific role to play in your unit or army. Roll a d8 or choose from the options in the table below to determine your role:</p>\n\t\t\t<table>\n\t\t\t\t<thead>\n\t\t\t\t\t<tr><td class=\"col-10\">d8</td><td>Specialty</td></tr>\n\t\t\t\t</thead>\n\t\t\t\t<tr><td>1</td><td>Officer</td></tr>\n\t\t\t\t<tr><td>2</td><td>Scout</td></tr>\n\t\t\t\t<tr><td>3</td><td>Infantry</td></tr>\n\t\t\t\t<tr><td>4</td><td>Cavalry</td></tr>\n\t\t\t\t<tr><td>5</td><td>Healer</td></tr>\n\t\t\t\t<tr><td>6</td><td>Quartermaster</td></tr>\n\t\t\t\t<tr><td>7</td><td>Standard bearer</td></tr>\n\t\t\t\t<tr><td>8</td><td>Support staff (cook, blacksmith, or the like)</td></tr>\n\t\t\t</table>\n\t\t\t<div element=\"ID_BACKGROUND_FEATURE_MILITARY_RANK\" />\n\t\t\t<h5>SUGGESTED CHARACTERISTICS</h5>\n\t\t\t<p>The horrors of war combined with the rigid discipline of military service leave their mark on all soldiers, shaping their ideals, creating strong bonds, and often leaving them scarred and vulnerable to fear, shame, and hatred.</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_ATHLETICS",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_INTIMIDATION",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_TOOL_PROFICIENCY_VEHICLES_LAND",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_BACKGROUND_FEATURE_MILITARY_RANK",
        "requirements": "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Proficiency",
        "name": "Gaming Set",
        "supports": "Gaming Set",
        "choices": [
          {
            "id": "1",
            "value": "Officer"
          },
          {
            "id": "2",
            "value": "Scout"
          },
          {
            "id": "3",
            "value": "Infantry"
          },
          {
            "id": "4",
            "value": "Cavalry"
          },
          {
            "id": "5",
            "value": "Healer"
          },
          {
            "id": "6",
            "value": "Quartermaster"
          },
          {
            "id": "7",
            "value": "Standard bearer"
          },
          {
            "id": "8",
            "value": "Support staff (cook, blacksmith, or the like)"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Personality Trait",
        "choices": [
          {
            "id": "1",
            "value": "I’m always polite and respectful."
          },
          {
            "id": "2",
            "value": "I’m haunted by memories of war. I can’t get the images of violence out of my mind."
          },
          {
            "id": "3",
            "value": "I’ve lost too many friends, and I’m slow to make new ones."
          },
          {
            "id": "4",
            "value": "I’m full of inspiring and cautionary tales from my military experience relevant to almost every combat situation"
          },
          {
            "id": "5",
            "value": "I can stare down a hell hound without flinching."
          },
          {
            "id": "6",
            "value": "I enjoy being strong and like breaking things."
          },
          {
            "id": "7",
            "value": "I have a crude sense of humor."
          },
          {
            "id": "8",
            "value": "I face problems head-on. A simple, direct solution is the best path to success."
          }
        ],
        "number": 2,
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Greater Good. Our lot is to lay down our lives in defense of others. (Good)"
          },
          {
            "id": "2",
            "value": "Responsibility. I do what I must and obey just authority. (Lawful)"
          },
          {
            "id": "3",
            "value": "Independence. When people follow orders blindly, they embrace a kind of tyranny. (Chaotic)"
          },
          {
            "id": "4",
            "value": "Might. In life as in war, the stronger force wins. (Evil)"
          },
          {
            "id": "5",
            "value": "Live and Let Live. Ideals aren’t worth killing over or going to war for. (Neutral)"
          },
          {
            "id": "6",
            "value": "Nation. My city, nation, or people are all that matter. (Any)"
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "I would still lay down my life for the people I served with."
          },
          {
            "id": "2",
            "value": "Someone saved my life on the battlefield. To this day, I will never leave a friend behind."
          },
          {
            "id": "3",
            "value": "My honor is my life."
          },
          {
            "id": "4",
            "value": "I’ll never forget the crushing defeat my company suffered or the enemies who dealt it."
          },
          {
            "id": "5",
            "value": "Those who fight beside me are those worth dying for."
          },
          {
            "id": "6",
            "value": "I fight for those who cannot fight for themselves."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "The monstrous enemy we faced in battle still leaves me quivering with fear."
          },
          {
            "id": "2",
            "value": "I have little respect for anyone who is not a proven warrior."
          },
          {
            "id": "3",
            "value": "I made a terrible mistake in battle cost many lives— and I would do anything to keep that mistake secret."
          },
          {
            "id": "4",
            "value": "My hatred of my enemies is blind and unreasoning."
          },
          {
            "id": "5",
            "value": "I obey the law, even if the law causes misery."
          },
          {
            "id": "6",
            "value": "I’d rather eat my armor than admit when I’m wrong."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "Athletics, Intimidation, Gaming Set, Vehicles (Land)"
      }
    ]
  },
  {
    "id": "ID_BACKGROUND_FEATURE_MILITARY_RANK",
    "type": "Background Feature",
    "name": "Feature: Military Rank",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-soldier.xml",
    "supports": [
      "Background Feature"
    ],
    "description": "You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use. You can also usually gain access to friendly military encampments and fortresses where your rank is recognized.",
    "descriptionHtml": "<p>You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use. You can also usually gain access to friendly military encampments and fortresses where your rank is recognized.</p>",
    "rules": [],
    "setters": []
  },
  {
    "id": "ID_BACKGROUND_URCHIN",
    "type": "Background",
    "name": "Urchin",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-urchin.xml",
    "supports": [],
    "description": "You grew up on the streets alone, orphaned, and poor. You had no one to watch over you or to provide for you, so you learned to provide for yourself. You fought fiercely over food and kept a constant watch out for other desperate souls who might steal from you. You slept on rooftops and in alleyways, exposed to the elements, and endured sickness without the advantage of medicine or a place to recuperate. You’ve survived despite all odds, and did so through cunning, strength, speed, or some combination of each. You begin your adventuring career with enough money to live modestly but securely for at least ten days. How did you come by that money? What allowed you to break free of your desperate circumstances and embark on a better life? Skill Proficiencies: Sleight of Hand, Stealth Tool Proficiencies: Disguise kit, thieves’ tools Equipment: A small knife, a map of the city you grew up in, a pet mouse, a token to remember your parents by, a set of common clothes, and a belt pouch containing 10 gp SUGGESTED CHARACTERISTICS Urchins are shaped by lives of desperate poverty, for good and for ill. They tend to be driven either by a commitment to the people with whom they shared life on the street or by a burning desire to find a better life— and maybe get some payback on all the rich people who treated them badly.",
    "descriptionHtml": "<p>You grew up on the streets alone, orphaned, and poor. You had no one to watch over you or to provide for you, so you learned to provide for yourself. You fought fiercely over food and kept a constant watch out for other desperate souls who might steal from you. You slept on rooftops and in alleyways, exposed to the elements, and endured sickness without the advantage of medicine or a place to recuperate. You’ve survived despite all odds, and did so through cunning, strength, speed, or some combination of each.</p>\n\t\t\t<p class=\"indent\">You begin your adventuring career with enough money to live modestly but securely for at least ten days. How did you come by that money? What allowed you to break free of your desperate circumstances and embark on a better life?</p>\n\t\t\t<ul class=\"unstyled\">\n\t\t\t\t<li><strong>Skill Proficiencies:</strong> Sleight of Hand, Stealth</li>\n\t\t\t\t<li><strong>Tool Proficiencies:</strong> Disguise kit, thieves’ tools</li>\n\t\t\t\t<li><strong>Equipment:</strong> A small knife, a map of the city you grew up in, a pet mouse, a token to remember your parents by, a set of common clothes, and a belt pouch containing 10 gp</li>\n\t\t\t</ul>\n\t\t\t<div element=\"ID_BACKGROUND_FEATURE_CITY_SECRETS\" />\n\t\t\t<h5>SUGGESTED CHARACTERISTICS</h5>\n\t\t\t<p>Urchins are shaped by lives of desperate poverty, for good and for ill. They tend to be driven either by a commitment to the people with whom they shared life on the street or by a burning desire to find a better life— and maybe get some payback on all the rich people who treated them badly.</p>",
    "rules": [
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_SLEIGHTOFHAND",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_SKILL_STEALTH",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_TOOL_PROFICIENCY_DISGUISE_KIT",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Proficiency",
        "id": "ID_PROFICIENCY_TOOL_PROFICIENCY_THIEVES_TOOLS",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "grant",
        "type": "Background Feature",
        "id": "ID_BACKGROUND_FEATURE_CITY_SECRETS",
        "requirements": "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "Background Feature",
        "name": "Variant Feature",
        "supports": "Optional Background Feature",
        "choices": [
          {
            "id": "1",
            "value": "I hide scraps of food and trinkets away in my pockets."
          },
          {
            "id": "2",
            "value": "I ask a lot of questions."
          },
          {
            "id": "3",
            "value": "I like to squeeze into small places where no one else can get to me."
          },
          {
            "id": "4",
            "value": "I sleep with my back to a wall or tree, with everything I own wrapped in a bundle in my arms."
          },
          {
            "id": "5",
            "value": "I eat like a pig and have bad manners."
          },
          {
            "id": "6",
            "value": "I think anyone who’s nice to me is hiding evil intent."
          },
          {
            "id": "7",
            "value": "I don’t like to bathe."
          },
          {
            "id": "8",
            "value": "I bluntly say what other people are hinting at or hiding."
          }
        ],
        "optional": true,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Ideal",
        "choices": [
          {
            "id": "1",
            "value": "Respect. All people, rich or poor, deserve respect. (Good)"
          },
          {
            "id": "2",
            "value": "Community. We have to take care of each other, because no one else is going to do it. (Lawful)"
          },
          {
            "id": "3",
            "value": "Change. The low are lifted up, and the high and mighty are brought down. Change is the nature of things. (Chaotic)"
          },
          {
            "id": "4",
            "value": "Retribution. The rich need to be shown what life and death are like in the gutters. (Evil)"
          },
          {
            "id": "5",
            "value": "People. I help the people who help me—that’s what keeps us alive. (Neutral)"
          },
          {
            "id": "6",
            "value": "Aspiration. I’m going to prove that I’m worthy of a better life."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Bond",
        "choices": [
          {
            "id": "1",
            "value": "My town or city is my home, and I’ll fight to defend it."
          },
          {
            "id": "2",
            "value": "I sponsor an orphanage to keep others from enduring what I was forced to endure."
          },
          {
            "id": "3",
            "value": "I owe my survival to another urchin who taught me to live on the streets."
          },
          {
            "id": "4",
            "value": "I owe a debt I can never repay to the person who took pity on me."
          },
          {
            "id": "5",
            "value": "I escaped my life of poverty by robbing an important person, and I’m wanted for it."
          },
          {
            "id": "6",
            "value": "No one else should have to endure the hardships I’ve been through."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      },
      {
        "kind": "select",
        "type": "List",
        "name": "Flaw",
        "choices": [
          {
            "id": "1",
            "value": "If I’m outnumbered, I will run away from a fight."
          },
          {
            "id": "2",
            "value": "Gold seems like a lot of money to me, and I’ll do just about anything for more of it."
          },
          {
            "id": "3",
            "value": "I will never fully trust anyone other than myself."
          },
          {
            "id": "4",
            "value": "I’d rather kill someone in their sleep then fight fair."
          },
          {
            "id": "5",
            "value": "It’s not stealing if I need it more than someone else."
          },
          {
            "id": "6",
            "value": "People who can’t take care of themselves get what they deserve."
          }
        ],
        "optional": false,
        "prepared": false,
        "equipped": false
      }
    ],
    "setters": [
      {
        "name": "short",
        "value": "Sleight of Hand, Stealth, Disguise Kit, Thieves’ Tools"
      }
    ]
  },
  {
    "id": "ID_BACKGROUND_FEATURE_CITY_SECRETS",
    "type": "Background Feature",
    "name": "Feature: City Secrets",
    "source": "Player’s Handbook",
    "source_url": "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-urchin.xml",
    "supports": [
      "Background Feature"
    ],
    "description": "You know the secret patterns and flow to cities and can find passages through the urban sprawl that others would miss. When you are not in combat, you (and companions you lead) can travel between any two locations in the city twice as fast as your speed would normally allow.",
    "descriptionHtml": "<p>You know the secret patterns and flow to cities and can find passages through the urban sprawl that others would miss. When you are not in combat, you (and companions you lead) can travel between any two locations in the city twice as fast as your speed would normally allow.</p>",
    "rules": [],
    "setters": []
  }
];
