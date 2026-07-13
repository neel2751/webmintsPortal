"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
// 1. IMPORT YOUR CSS (Very Important!)
import "../editor/tiptap/tiptap.css";

// BlogRendered.jsx
export default function BlogRendered({ content }) {
  const editor = useEditor({
    editable: false,
    content: content,
    extensions: [StarterKit],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // We keep the 'tiptap' class for your color/font logic
        class: "tiptap focus:outline-none",
      },
    },
  });

  return (
    <div className="public-blog-view w-full">
      <EditorContent editor={editor} />
    </div>
  );
}
