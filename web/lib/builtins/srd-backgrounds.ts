import type { BuiltInElement } from "@/lib/builtins/types";

const SOURCE = "System Reference Document 5.1";

const SOURCE_URLS = {
  acolyte:
    "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-acolyte.xml",
  sage:
    "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-sage.xml",
  soldier:
    "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/backgrounds/background-soldier.xml",
} as const;

export const BUILT_IN_SRD_BACKGROUND_ELEMENTS: readonly BuiltInElement[] = [
  {
    id: "ID_BACKGROUND_ACOLYTE",
    type: "Background",
    name: "Acolyte",
    source: SOURCE,
    source_url: SOURCE_URLS.acolyte,
    supports: [],
    description:
      "A temple-raised servant of a faith with religious knowledge, insight, and broad language access.",
    setters: [{ name: "short", value: "Insight, Religion, 2 Languages" }],
    rules: [
      { kind: "grant", type: "Proficiency", id: "ID_PROFICIENCY_SKILL_INSIGHT" },
      { kind: "grant", type: "Proficiency", id: "ID_PROFICIENCY_SKILL_RELIGION" },
      {
        kind: "select",
        type: "Language",
        name: "Language (Acolyte)",
        number: 2,
        supports: "Standard||Exotic",
      },
      {
        kind: "grant",
        type: "Background Feature",
        id: "ID_BACKGROUND_FEATURE_SHELTER_OF_THE_FAITHFUL",
        requirements: "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
      },
      {
        kind: "select",
        type: "Background Feature",
        name: "Variant Feature",
        supports: "Optional Background Feature",
        optional: true,
      },
      {
        kind: "select",
        type: "List",
        name: "Personality Trait",
        number: 2,
        choices: [
          {
            id: "1",
            value:
              "I idolize a particular hero of my faith, and constantly refer to that person's deeds and example.",
          },
          {
            id: "2",
            value:
              "I can find common ground between the fiercest enemies and always work toward peace.",
          },
          { id: "3", value: "I see omens in every event and action." },
          { id: "4", value: "Nothing can shake my optimistic attitude." },
          {
            id: "5",
            value:
              "I quote or misquote sacred texts and proverbs in almost every situation.",
          },
          {
            id: "6",
            value:
              "I am tolerant or intolerant of other faiths and respect or condemn the worship of other gods.",
          },
          {
            id: "7",
            value:
              "I've enjoyed fine food, drink, and high society among my temple's elite. Rough living grates on me.",
          },
          {
            id: "8",
            value:
              "I've spent so long in the temple that I have little practical experience dealing with people in the outside world.",
          },
        ],
      },
      {
        kind: "select",
        type: "List",
        name: "Ideal",
        choices: [
          {
            id: "1",
            value:
              "Tradition. The ancient traditions of worship and sacrifice must be preserved and upheld. (Lawful)",
          },
          {
            id: "2",
            value:
              "Charity. I always try to help those in need, no matter the personal cost. (Good)",
          },
          {
            id: "3",
            value: "Change. The gods are constantly working change in the world. (Chaotic)",
          },
          {
            id: "4",
            value: "Power. I hope to one day rise to the top of my faith's hierarchy. (Lawful)",
          },
          {
            id: "5",
            value:
              "Faith. I trust that my deity will guide my actions if I work hard. (Lawful)",
          },
          {
            id: "6",
            value:
              "Aspiration. I seek to prove myself worthy of my god's favor. (Any)",
          },
        ],
      },
      {
        kind: "select",
        type: "List",
        name: "Bond",
        choices: [
          {
            id: "1",
            value: "I would die to recover an ancient relic of my faith.",
          },
          {
            id: "2",
            value: "Everything I do is for the common people.",
          },
          {
            id: "3",
            value: "I owe my life to the priest who took me in when my parents died.",
          },
          { id: "4", value: "I will do anything to protect the temple where I served." },
          {
            id: "5",
            value:
              "I seek to preserve a sacred text that my enemies consider heretical.",
          },
          {
            id: "6",
            value:
              "I will someday get revenge on the corrupt temple hierarchy who branded me a heretic.",
          },
        ],
      },
      {
        kind: "select",
        type: "List",
        name: "Flaw",
        choices: [
          { id: "1", value: "I judge others harshly, and myself even more severely." },
          {
            id: "2",
            value: "I put too much trust in those who wield power within my temple's hierarchy.",
          },
          {
            id: "3",
            value:
              "My piety sometimes leads me to blindly trust those that profess faith in my god.",
          },
          { id: "4", value: "I am inflexible in my thinking." },
          { id: "5", value: "I am suspicious of strangers and expect the worst of them." },
          {
            id: "6",
            value:
              "Once I pick a goal, I become obsessed with it to the detriment of everything else.",
          },
        ],
      },
    ],
  },
  {
    id: "ID_BACKGROUND_FEATURE_SHELTER_OF_THE_FAITHFUL",
    type: "Background Feature",
    name: "Feature: Shelter of the Faithful",
    source: SOURCE,
    source_url: SOURCE_URLS.acolyte,
    supports: ["Background Feature"],
    description:
      "Receive free healing and modest support from temples of your faith, and request nonhazardous help from clergy.",
    setters: [],
    rules: [],
  },
  {
    id: "ID_BACKGROUND_SAGE",
    type: "Background",
    name: "Sage",
    source: SOURCE,
    source_url: SOURCE_URLS.sage,
    supports: [],
    description:
      "A scholar of the multiverse with deep learning, broad languages, and a chosen specialty.",
    setters: [{ name: "short", value: "Arcana, History, 2 Languages" }],
    rules: [
      { kind: "grant", type: "Proficiency", id: "ID_PROFICIENCY_SKILL_ARCANA" },
      { kind: "grant", type: "Proficiency", id: "ID_PROFICIENCY_SKILL_HISTORY" },
      {
        kind: "select",
        type: "Language",
        name: "Language (Sage)",
        number: 2,
        supports: "Standard||Exotic",
      },
      {
        kind: "grant",
        type: "Background Feature",
        id: "ID_BACKGROUND_FEATURE_RESEARCHER",
        requirements: "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
      },
      {
        kind: "select",
        type: "Background Feature",
        name: "Variant Feature",
        supports: "Optional Background Feature",
        optional: true,
      },
      {
        kind: "select",
        type: "List",
        name: "Specialty",
        optional: true,
        choices: [
          { id: "1", value: "Alchemist" },
          { id: "2", value: "Astronomer" },
          { id: "3", value: "Discredited Academic" },
          { id: "4", value: "Librarian" },
          { id: "5", value: "Professor" },
          { id: "6", value: "Researcher" },
          { id: "7", value: "Wizard's Apprentice" },
          { id: "8", value: "Scribe" },
        ],
      },
      {
        kind: "select",
        type: "List",
        name: "Personality Trait",
        number: 2,
        choices: [
          {
            id: "1",
            value: "I use polysyllabic words that convey the impression of great erudition.",
          },
          {
            id: "2",
            value:
              "I've read every book in the world's greatest libraries or I like to boast that I have.",
          },
          {
            id: "3",
            value:
              "I'm used to helping out those who aren't as smart as I am and explain anything to others.",
          },
          { id: "4", value: "There is nothing I like more than a good mystery." },
          {
            id: "5",
            value:
              "I'm willing to listen to every side of an argument before I make my own judgment.",
          },
          {
            id: "6",
            value:
              "I speak slowly when talking to idiots, which is almost everyone compared to me.",
          },
          { id: "7", value: "I am horribly awkward in social situations." },
          { id: "8", value: "I'm convinced that people are always trying to steal my secrets." },
        ],
      },
      {
        kind: "select",
        type: "List",
        name: "Ideal",
        choices: [
          {
            id: "1",
            value: "Knowledge. The path to power and self-improvement is through knowledge. (Neutral)",
          },
          {
            id: "2",
            value: "Logic. Emotions must not cloud our logical thinking. (Lawful)",
          },
          {
            id: "3",
            value: "Beauty. What is beautiful points us beyond itself toward what is true. (Good)",
          },
          {
            id: "4",
            value:
              "No Limits. Nothing should fetter the infinite possibility inherent in existence. (Chaotic)",
          },
          {
            id: "5",
            value: "Power. Knowledge is the path to power and domination. (Evil)",
          },
          {
            id: "6",
            value: "Self-Improvement. The goal of study is the betterment of oneself. (Any)",
          },
        ],
      },
      {
        kind: "select",
        type: "List",
        name: "Bond",
        choices: [
          { id: "1", value: "It is my duty to protect my students." },
          {
            id: "2",
            value:
              "I have an ancient text that holds terrible secrets that must not fall into the wrong hands.",
          },
          {
            id: "3",
            value: "I work to preserve a library, university, scriptorium, or monastery.",
          },
          {
            id: "4",
            value: "My life's work is a series of tomes related to a specific field of lore.",
          },
          {
            id: "5",
            value: "I've been searching my whole life for the answer to a certain question.",
          },
          { id: "6", value: "I sold my soul for knowledge and hope to win it back." },
        ],
      },
      {
        kind: "select",
        type: "List",
        name: "Flaw",
        choices: [
          { id: "1", value: "I am easily distracted by the promise of information." },
          {
            id: "2",
            value:
              "Most people scream and run when they see a demon. I stop and take notes on its anatomy.",
          },
          {
            id: "3",
            value: "Unlocking an ancient mystery is worth the price of a civilization.",
          },
          { id: "4", value: "I overlook obvious solutions in favor of complicated ones." },
          {
            id: "5",
            value: "I speak without really thinking through my words, invariably insulting others.",
          },
          { id: "6", value: "I can't keep a secret to save my life, or anyone else's." },
        ],
      },
    ],
  },
  {
    id: "ID_BACKGROUND_FEATURE_RESEARCHER",
    type: "Background Feature",
    name: "Feature: Researcher",
    source: SOURCE,
    source_url: SOURCE_URLS.sage,
    supports: ["Background Feature"],
    description:
      "If you do not know a piece of lore, you often know where and from whom it can be obtained.",
    setters: [],
    rules: [],
  },
  {
    id: "ID_BACKGROUND_SOLDIER",
    type: "Background",
    name: "Soldier",
    source: SOURCE,
    source_url: SOURCE_URLS.soldier,
    supports: [],
    description:
      "A trained veteran with martial discipline, battlefield instincts, gaming familiarity, and land vehicle training.",
    setters: [
      {
        name: "short",
        value: "Athletics, Intimidation, Gaming Set, Vehicles (Land)",
      },
    ],
    rules: [
      { kind: "grant", type: "Proficiency", id: "ID_PROFICIENCY_SKILL_ATHLETICS" },
      { kind: "grant", type: "Proficiency", id: "ID_PROFICIENCY_SKILL_INTIMIDATION" },
      {
        kind: "select",
        type: "Proficiency",
        name: "Gaming Set",
        supports: "Gaming Set",
      },
      {
        kind: "grant",
        type: "Proficiency",
        id: "ID_PROFICIENCY_TOOL_PROFICIENCY_VEHICLES_LAND",
      },
      {
        kind: "grant",
        type: "Background Feature",
        id: "ID_BACKGROUND_FEATURE_MILITARY_RANK",
        requirements: "!ID_INTERNAL_GRANT_OPTIONAL_BACKGROUND_FEATURE",
      },
      {
        kind: "select",
        type: "Background Feature",
        name: "Variant Feature",
        supports: "Optional Background Feature",
        optional: true,
      },
      {
        kind: "select",
        type: "List",
        name: "Specialty",
        optional: true,
        choices: [
          { id: "1", value: "Officer" },
          { id: "2", value: "Scout" },
          { id: "3", value: "Infantry" },
          { id: "4", value: "Cavalry" },
          { id: "5", value: "Healer" },
          { id: "6", value: "Quartermaster" },
          { id: "7", value: "Standard bearer" },
          { id: "8", value: "Support staff (cook, blacksmith, or the like)" },
        ],
      },
      {
        kind: "select",
        type: "List",
        name: "Personality Trait",
        number: 2,
        choices: [
          { id: "1", value: "I'm always polite and respectful." },
          {
            id: "2",
            value:
              "I'm haunted by memories of war. I can't get the images of violence out of my mind.",
          },
          { id: "3", value: "I've lost too many friends, and I'm slow to make new ones." },
          {
            id: "4",
            value:
              "I'm full of inspiring and cautionary tales from my military experience relevant to almost every combat situation.",
          },
          { id: "5", value: "I can stare down a hell hound without flinching." },
          { id: "6", value: "I enjoy being strong and like breaking things." },
          { id: "7", value: "I have a crude sense of humor." },
          { id: "8", value: "I face problems head-on. A simple, direct solution works best." },
        ],
      },
      {
        kind: "select",
        type: "List",
        name: "Ideal",
        choices: [
          {
            id: "1",
            value:
              "Greater Good. Our lot is to lay down our lives in defense of others. (Good)",
          },
          {
            id: "2",
            value: "Responsibility. I do what I must and obey just authority. (Lawful)",
          },
          {
            id: "3",
            value:
              "Independence. When people follow orders blindly, they embrace a kind of tyranny. (Chaotic)",
          },
          {
            id: "4",
            value: "Might. In life as in war, the stronger force wins. (Evil)",
          },
          {
            id: "5",
            value: "Live and Let Live. Ideals are not worth killing over. (Neutral)",
          },
          { id: "6", value: "Nation. My city, nation, or people are all that matter. (Any)" },
        ],
      },
      {
        kind: "select",
        type: "List",
        name: "Bond",
        choices: [
          { id: "1", value: "I would still lay down my life for the people I served with." },
          {
            id: "2",
            value:
              "Someone saved my life on the battlefield. To this day, I will never leave a friend behind.",
          },
          { id: "3", value: "My honor is my life." },
          {
            id: "4",
            value:
              "I'll never forget the crushing defeat my company suffered or the enemies who dealt it.",
          },
          { id: "5", value: "Those who fight beside me are those worth dying for." },
          { id: "6", value: "I fight for those who cannot fight for themselves." },
        ],
      },
      {
        kind: "select",
        type: "List",
        name: "Flaw",
        choices: [
          {
            id: "1",
            value:
              "The monstrous enemy we faced in battle still leaves me quivering with fear.",
          },
          { id: "2", value: "I have little respect for anyone who is not a proven warrior." },
          {
            id: "3",
            value:
              "I made a terrible mistake in battle that cost many lives and would do anything to keep it secret.",
          },
          { id: "4", value: "My hatred of my enemies is blind and unreasoning." },
          { id: "5", value: "I obey the law, even if the law causes misery." },
          { id: "6", value: "I'd rather eat my armor than admit when I'm wrong." },
        ],
      },
    ],
  },
  {
    id: "ID_BACKGROUND_FEATURE_MILITARY_RANK",
    type: "Background Feature",
    name: "Feature: Military Rank",
    source: SOURCE,
    source_url: SOURCE_URLS.soldier,
    supports: ["Background Feature"],
    description:
      "Your rank still carries authority among soldiers and grants access to friendly military resources.",
    setters: [],
    rules: [],
  },
] as const;
