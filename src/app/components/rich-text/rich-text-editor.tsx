"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Strikethrough } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { normalizeRichTextHtml } from "@/lib/rich-text";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  ariaLabel?: string;
  className?: string;
  editorClassName?: string;
  disabled?: boolean;
  showToolbar?: boolean;
};

function ToolbarButton({
  active,
  disabled,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon-sm"
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  name,
  ariaLabel = "",
  className,
  editorClassName,
  disabled = false,
  showToolbar = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "<p></p>",
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          "tiptap min-h-36 w-full px-3 py-2 text-sm leading-6 outline-none",
          disabled ? "cursor-not-allowed opacity-60" : "",
          editorClassName
        ),
        "aria-label": ariaLabel,
      },
    },
    onUpdate: ({ editor: nextEditor }) => {
      onChange(normalizeRichTextHtml(nextEditor.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) return;

    const nextValue = value || "<p></p>";
    if (editor.getHTML() !== nextValue) {
      editor.commands.setContent(nextValue, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div className={cn("space-y-2", className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <div
        className={cn(
          "rounded-md border border-input overflow-hidden",
          disabled && "opacity-60"
        )}
      >
        {showToolbar && (
          <div className="flex items-center border-b border-border px-2 py-1">
              <ToolbarButton
                label="Bold"
                active={editor?.isActive("bold")}
                disabled={disabled || !editor}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                <Bold className="h-3.5 w-3.5" />
              </ToolbarButton>

              <ToolbarButton
                label="Italic"
                active={editor?.isActive("italic")}
                disabled={disabled || !editor}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                <Italic className="h-3.5 w-3.5" />
              </ToolbarButton>

              <ToolbarButton
                label="Strikethrough"
                active={editor?.isActive("strike")}
                disabled={disabled || !editor}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
              >
                <Strikethrough className="h-3.5 w-3.5" />
              </ToolbarButton>

          </div>
        )}

        <div className="tiptap-editor-wrapper">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}