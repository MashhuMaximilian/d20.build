"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

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
  short?: boolean;
};

const BACKSTORY_FIELDS: BackstoryFieldConfig[] = [
  {
    key: "personalityTraits",
    label: "Personality Traits",
    description: "How they act, react, speak, or present themselves.",
    placeholder: "Write a few defining mannerisms, habits, or social tells.",
    short: true,
  },
  {
    key: "ideals",
    label: "Ideals",
    description: "What principles or causes this character believes in.",
    placeholder: "Write beliefs, convictions, ambitions, or moral lines.",
    short: true,
  },
  {
    key: "bonds",
    label: "Bonds",
    description: "Who or what they feel tied to, protect, or owe.",
    placeholder: "Write personal ties, debts, loyalties, or attachments.",
    short: true,
  },
  {
    key: "flaws",
    label: "Flaws",
    description: "Weak points, blind spots, temptations, or liabilities.",
    placeholder: "Write fears, bad habits, emotional weak spots, or limitations.",
    short: true,
  },
  {
    key: "alliesAndOrganizations",
    label: "Allies and Organizations",
    description: "Contacts, factions, mentors, rivals, or affiliations.",
    placeholder: "List allies, organizations, enemies, patrons, and faction ties.",
  },
  {
    key: "backstory",
    label: "Backstory",
    description: "The broad story of where they came from and why they adventure.",
    placeholder: "Write the character's history, turning points, and current trajectory.",
  },
  {
    key: "additionalFeatures",
    label: "Additional Features",
    description: "Anything else you want to note now for future roleplay or sheet work.",
    placeholder: "Write quirks, appearance notes, story hooks, obligations, or DM notes.",
  },
];

function normalizeEditorHtml(value: string) {
  const trimmed = value.trim();

  if (!trimmed || trimmed === "<p></p>") {
    return "";
  }

  return value;
}

function ToolbarButton({
  active,
  disabled,
  label,
  onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`button button--secondary button--compact backstory-step__toolbarButton${
        active ? " backstory-step__toolbarButton--active" : ""
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function BackstoryEditorField({
  config,
  value,
  onChange,
}: {
  config: BackstoryFieldConfig;
  value: string;
  onChange: (nextValue: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder: config.placeholder,
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `backstory-step__editor${config.short ? " backstory-step__editor--short" : ""}`,
      },
    },
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.isEmpty ? "" : normalizeEditorHtml(nextEditor.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const current = normalizeEditorHtml(editor.getHTML());
    const incoming = normalizeEditorHtml(value);

    if (current !== incoming) {
      editor.commands.setContent(incoming || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <article className="builder-panel backstory-step__field">
      <div className="backstory-step__fieldHeader">
        <div className="backstory-step__headingBlock">
          <span className="builder-panel__label">{config.label}</span>
          <p className="builder-summary__meta">{config.description}</p>
        </div>
        <div className="backstory-step__toolbar" role="toolbar" aria-label={`${config.label} editor tools`}>
          <ToolbarButton
            active={editor?.isActive("bold")}
            disabled={!editor}
            label="B"
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            active={editor?.isActive("italic")}
            disabled={!editor}
            label="I"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            active={editor?.isActive("bulletList")}
            disabled={!editor}
            label="• List"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            active={editor?.isActive("orderedList")}
            disabled={!editor}
            label="1. List"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            active={editor?.isActive("blockquote")}
            disabled={!editor}
            label="Quote"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          />
        </div>
      </div>
      <EditorContent editor={editor} />
    </article>
  );
}

export function BackstoryStep({ value, onChange }: BackstoryStepProps) {
  return (
    <section className="builder-panel backstory-step">
      <div className="builder-stepPanel__intro">
        <span className="route-shell__tag">Backstory</span>
        <h2 className="route-shell__title">Write the narrative details in your own words</h2>
        <p className="route-shell__copy">
          These notes are optional and freeform. Aurora&apos;s personality tables are useful prompts, but this step is meant to
          feel like your own notebook instead of a forced picker.
        </p>
      </div>

      <aside className="builder-panel builder-panel--compact backstory-step__help">
        <span className="builder-panel__label">Editor help</span>
        <ul className="route-shell__list">
          <li>Use the toolbar for bold, italics, bullet lists, numbered lists, and quotes.</li>
          <li>Keyboard shortcuts work too: `Ctrl/Cmd+B` for bold and `Ctrl/Cmd+I` for italics.</li>
          <li>None of these fields are required; use only the ones that help your table.</li>
        </ul>
      </aside>

      <div className="backstory-step__grid">
        {BACKSTORY_FIELDS.map((field) => (
          <BackstoryEditorField
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
    </section>
  );
}
