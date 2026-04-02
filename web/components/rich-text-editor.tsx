"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  compact?: boolean;
};

function normalizeEditorHtml(value: string) {
  const trimmed = value.trim();

  if (!trimmed || trimmed === "<p></p>") {
    return "";
  }

  return value;
}

function RichTextToolbarButton({
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
      className={`button button--secondary button--compact rich-text-editor__toolbarButton${
        active ? " rich-text-editor__toolbarButton--active" : ""
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export function RichTextEditor({ value, onChange, placeholder, compact = false }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `rich-text-editor__content${compact ? " rich-text-editor__content--compact" : ""}`,
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
    <div className="rich-text-editor">
      {editor ? (
        <BubbleMenu className="rich-text-editor__bubbleMenu" editor={editor}>
          <RichTextToolbarButton
            active={editor.isActive("bold")}
            label="B"
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <RichTextToolbarButton
            active={editor.isActive("italic")}
            label="I"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <RichTextToolbarButton
            active={editor.isActive("bulletList")}
            label="• List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <RichTextToolbarButton
            active={editor.isActive("orderedList")}
            label="1. List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <RichTextToolbarButton
            active={editor.isActive("blockquote")}
            label="Quote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
        </BubbleMenu>
      ) : null}

      <div className="rich-text-editor__toolbar" role="toolbar" aria-label="Rich text editor tools">
        <RichTextToolbarButton
          active={editor?.isActive("bold")}
          disabled={!editor}
          label="B"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />
        <RichTextToolbarButton
          active={editor?.isActive("italic")}
          disabled={!editor}
          label="I"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
        <RichTextToolbarButton
          active={editor?.isActive("heading", { level: 2 })}
          disabled={!editor}
          label="H2"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <RichTextToolbarButton
          active={editor?.isActive("bulletList")}
          disabled={!editor}
          label="• List"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        />
        <RichTextToolbarButton
          active={editor?.isActive("orderedList")}
          disabled={!editor}
          label="1. List"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        />
        <RichTextToolbarButton
          active={editor?.isActive("blockquote")}
          disabled={!editor}
          label="Quote"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
