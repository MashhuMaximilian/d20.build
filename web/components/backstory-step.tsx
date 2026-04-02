"use client";

import { MarkdownEditor } from "@/components/markdown-editor";
import type { CharacterBackstory } from "@/lib/characters/types";

type BackstoryStepProps = {
  value: CharacterBackstory;
  onChange: (value: CharacterBackstory) => void;
};

type BackstoryFieldKey = keyof CharacterBackstory;

type BackstoryFieldConfig = {
  key: BackstoryFieldKey;
  label: string;
  description: string;
  placeholder: string;
  compact?: boolean;
  layout: "small" | "medium" | "large";
  slashContext: string;
};

const SMALL_FIELDS: BackstoryFieldConfig[] = [
  {
    key: "personalityTraits",
    label: "Personality Traits",
    description: "Short traits, habits, social tells, and recurring behaviors.",
    placeholder: "Write short personality bullets or a brief paragraph.",
    compact: true,
    layout: "small",
    slashContext: "Personality traits",
  },
  {
    key: "ideals",
    label: "Ideals",
    description: "Beliefs, principles, convictions, causes, and ambitions.",
    placeholder: "Write ideals, motives, and values that guide decisions.",
    compact: true,
    layout: "small",
    slashContext: "Ideals",
  },
  {
    key: "bonds",
    label: "Bonds",
    description: "Ties, debts, loyalties, attachments, and obligations.",
    placeholder: "Write personal bonds, loyalties, debts, and attachments.",
    compact: true,
    layout: "small",
    slashContext: "Bonds",
  },
  {
    key: "flaws",
    label: "Flaws",
    description: "Weak points, blind spots, temptations, fears, and liabilities.",
    placeholder: "Write flaws, emotional weak spots, or self-sabotaging tendencies.",
    compact: true,
    layout: "small",
    slashContext: "Flaws",
  },
];

const MEDIUM_FIELDS: BackstoryFieldConfig[] = [
  {
    key: "alliesAndOrganizations",
    label: "Allies and Organizations",
    description: "Contacts, factions, mentors, rivals, patrons, and affiliations.",
    placeholder: "List allies, organizations, rivals, enemies, patrons, and faction ties.",
    layout: "medium",
    slashContext: "Allies and organizations",
  },
  {
    key: "additionalFeatures",
    label: "Additional Features",
    description: "Extra notes, hooks, quirks, obligations, appearance notes, and open threads.",
    placeholder: "Write additional hooks, quirks, rumors, obligations, and anything else worth tracking.",
    layout: "medium",
    slashContext: "Additional features",
  },
];

const LARGE_FIELD: BackstoryFieldConfig = {
  key: "backstory",
  label: "Backstory",
  description: "The full story of where they came from, what shaped them, and why they adventure now.",
  placeholder: "Write the character's longer story, important turning points, and current direction.",
  layout: "large",
  slashContext: "Backstory",
};

function BackstoryField({
  config,
  value,
  onChange,
}: {
  config: BackstoryFieldConfig;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <article
      className={`builder-panel backstory-step__field backstory-step__field--${config.layout}`}
    >
      <div className="backstory-step__fieldHeader">
        <span className="builder-panel__label">{config.label}</span>
        <p className="builder-summary__meta">{config.description}</p>
      </div>
      <MarkdownEditor
        compact={config.compact}
        onChange={onChange}
        placeholder={config.placeholder}
        slashContext={config.slashContext}
        value={value}
      />
    </article>
  );
}

export function BackstoryStep({ value, onChange }: BackstoryStepProps) {
  return (
    <section className="builder-panel backstory-step">
      <div className="builder-stepPanel__intro">
        <span className="route-shell__tag">Backstory</span>
        <h2 className="route-shell__title">Write the roleplay notes in a real notebook space</h2>
        <p className="route-shell__copy">
          These notes are optional and freeform. Use Markdown shortcuts as you type, or press <code>/</code> for headings,
          lists, quotes, and character-note prompts.
        </p>
      </div>

      <div className="builder-panel builder-panel--compact backstory-step__help">
        <span className="builder-panel__label">Editor help</span>
        <p className="builder-summary__meta">
          This editor is meant to feel like a notebook, not a form. Keep short list-like notes in the small cards, use the side-by-side
          cards for relationships and extra hooks, and use the large backstory space for the longer narrative.
        </p>
        <p className="builder-summary__meta">
          Use Markdown shortcuts or type <code>/</code> for headings, lists, quotes, and D&amp;D note templates.
        </p>
      </div>

      <div className="backstory-step__smallGrid">
        {SMALL_FIELDS.map((field) => (
          <BackstoryField
            config={field}
            key={field.key}
            onChange={(nextValue) =>
              onChange({
                ...value,
                [field.key]: nextValue,
              })
            }
            value={value[field.key]}
          />
        ))}
      </div>

      <div className="backstory-step__mediumGrid">
        {MEDIUM_FIELDS.map((field) => (
          <BackstoryField
            config={field}
            key={field.key}
            onChange={(nextValue) =>
              onChange({
                ...value,
                [field.key]: nextValue,
              })
            }
            value={value[field.key]}
          />
        ))}
      </div>

      <BackstoryField
        config={LARGE_FIELD}
        onChange={(nextValue) =>
          onChange({
            ...value,
            backstory: nextValue,
          })
        }
        value={value.backstory}
      />
    </section>
  );
}
