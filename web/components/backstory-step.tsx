"use client";

import { RichTextEditor } from "@/components/rich-text-editor";
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
};

const SMALL_FIELDS: BackstoryFieldConfig[] = [
  {
    key: "personalityTraits",
    label: "Personality Traits",
    description: "Short traits, habits, social tells, and recurring behaviors.",
    placeholder: "Write short personality bullets or a brief paragraph.",
    compact: true,
    layout: "small",
  },
  {
    key: "ideals",
    label: "Ideals",
    description: "Beliefs, principles, convictions, causes, and ambitions.",
    placeholder: "Write ideals, motives, and values that guide decisions.",
    compact: true,
    layout: "small",
  },
  {
    key: "bonds",
    label: "Bonds",
    description: "Ties, debts, loyalties, attachments, and obligations.",
    placeholder: "Write personal bonds, loyalties, debts, and attachments.",
    compact: true,
    layout: "small",
  },
  {
    key: "flaws",
    label: "Flaws",
    description: "Weak points, blind spots, temptations, fears, and liabilities.",
    placeholder: "Write flaws, emotional weak spots, or self-sabotaging tendencies.",
    compact: true,
    layout: "small",
  },
];

const MEDIUM_FIELDS: BackstoryFieldConfig[] = [
  {
    key: "alliesAndOrganizations",
    label: "Allies and Organizations",
    description: "Contacts, factions, mentors, rivals, patrons, and affiliations.",
    placeholder: "List allies, organizations, rivals, enemies, patrons, and faction ties.",
    layout: "medium",
  },
  {
    key: "additionalFeatures",
    label: "Additional Features",
    description: "Extra notes, hooks, quirks, obligations, appearance notes, and open threads.",
    placeholder: "Write additional hooks, quirks, rumors, obligations, and anything else worth tracking.",
    layout: "medium",
  },
];

const LARGE_FIELD: BackstoryFieldConfig = {
  key: "backstory",
  label: "Backstory",
  description: "The full story of where they came from, what shaped them, and why they adventure now.",
  placeholder: "Write the character's longer story, important turning points, and current direction.",
  layout: "large",
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
      <RichTextEditor
        compact={config.compact}
        onChange={onChange}
        placeholder={config.placeholder}
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
          These fields are optional and freeform. Use them for the parts of the character that should feel written by you,
          not rolled from a background table.
        </p>
      </div>

      <div className="builder-panel builder-panel--compact backstory-step__help">
        <span className="builder-panel__label">Editor help</span>
        <p className="builder-summary__meta">
          The editor supports headings, bold, italics, lists, and quotes. Use the toolbar or select text to get the floating formatting menu.
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
