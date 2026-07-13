"use client";
import "./tiptap.css";
import { cn } from "@/lib/utils";
import { ImageExtension } from "./extensions/image";
import { ImagePlaceholder } from "./extensions/image-placeholder";
import SearchAndReplace from "./extensions/search-and-replace";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TipTapFloatingMenu } from "./extensions/floating-menu";
import { EditorToolbar } from "./toolbars/editor-toolbar";
import Placeholder from "@tiptap/extension-placeholder";
import { content } from "@/lib/content";
import { ToolbarProvider } from "./toolbars/toolbar-provider";
import { FloatingToolbar } from "./extensions/floating-toolbar";
import { AiProvider } from "./ai/ai-context";
import { AiMenu } from "./ai/ai-menu";
import React from "react";

const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
    },
  }),
  Placeholder.configure({
    emptyNodeClass: "is-editor-empty",
    placeholder: ({ node }) => {
      switch (node.type.name) {
        case "heading":
          return `Heading ${node.attrs.level}`;
        case "detailsSummary":
          return "Section title";
        case "codeBlock":
          // never show the placeholder when editing code
          return "";
        default:
          return "Write, type '/' for commands";
      }
    },
    includeChildren: false,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TextStyle,
  Subscript,
  Superscript,
  Underline,
  Link,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  ImageExtension,
  ImagePlaceholder,
  SearchAndReplace,
  Typography,
];

export function RichTextEditorDemo({ className, onUpdate, value }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: extensions,
    content: value || content,
    editorProps: {
      attributes: {
        class: "max-w-full focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate && onUpdate({ json: editor.getJSON(), html });
    },
    onCreate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate && onUpdate({ json: editor.getJSON(), html });
    },
  });

  const lastValueRef = React.useRef(null);

  React.useEffect(() => {
    if (!editor) return;

    // 1. Determine what the incoming HTML is.
    // If 'value' is an object {html, json}, take .html. If it's just a string, use it directly.
    const incomingHtml =
      typeof value === "object" && value !== null ? value.html : value;

    const safeHtml = incomingHtml ?? "";

    // 2. Only update if the content is actually different and the user isn't typing
    if (safeHtml !== lastValueRef.current && !editor.isFocused) {
      editor.commands.setContent(safeHtml);
      lastValueRef.current = safeHtml;
    }
  }, [value, editor]); // Watching 'value' ensures it updates when the form loads

  if (!editor) {
    return <div className="min-h-[600px] border bg-muted animate-pulse" />;
  }

  if (!editor) {
    return <div className="min-h-[600px] border bg-muted animate-pulse" />;
  }

  return (
    <AiProvider>
      <ToolbarProvider editor={editor}>
        <div
          className={cn(
            "relative max-h-[calc(100dvh-6rem)] w-full overflow-hidden overflow-y-scroll border bg-card pb-[60px] sm:pb-0",
            className
          )}
        >
          <EditorToolbar />
          <FloatingToolbar editor={editor} />
          <TipTapFloatingMenu editor={editor} />
          <EditorContent
            editor={editor}
            className="min-h-[600px] w-full min-w-full cursor-text sm:p-6"
          />
        </div>
        <AiMenu />
      </ToolbarProvider>
    </AiProvider>
  );
}
