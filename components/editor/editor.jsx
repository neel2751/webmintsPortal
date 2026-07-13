"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";

import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  StrikethroughIcon,
  UnderlineIcon,
  HighlighterIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import SaveEditor from "./saveEditor";

function MenuBar({ editor }) {
  //   const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }
  return (
    <div className="control-group">
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bg-white p-0.5 rounded-lg border border-gray-100 shadow-xl space-x-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`text-stone-800 font-semibold text-xs border-transparent border rounded-md gap-x-2 justify-center items-center inline-flex hover:bg-stone-200 p-1
            ${editor.isActive("bold") ? "bg-stone-200" : ""}
          `}
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`text-stone-800 font-semibold text-xs border-transparent border rounded-md gap-x-2 justify-center items-center inline-flex hover:bg-stone-200 p-1
            ${editor.isActive("italic") ? "bg-stone-200" : ""}
          `}
            >
              Italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`text-stone-800 font-semibold text-xs border-transparent border rounded-md gap-x-2 justify-center items-center inline-flex hover:bg-stone-200 p-1
            ${editor.isActive("strike") ? "bg-stone-200" : ""}
          `}
            >
              Strike
            </button>
          </div>
        </BubbleMenu>
      )}
      <div className="align-middle p-2 bg-white border-b border-gray-200 gap-x-0.5 flex top-0 sticky">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`text-stone-800 font-medium text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("paragraph") ? "bg-gray-200" : ""}
          `}
        >
          P
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("bold") ? "bg-gray-200" : ""}
          `}
        >
          <BoldIcon className="shrink-0 size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("italic") ? "bg-gray-200" : ""}
          `}
        >
          <ItalicIcon className="shrink-0 size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("strike") ? "bg-gray-200" : ""}
          `}
        >
          <StrikethroughIcon className="shrink-0 size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("underline") ? "bg-gray-200" : ""}
          `}
        >
          <UnderlineIcon className="shrink-0 size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("highlight") ? "bg-gray-200" : ""}
          `}
        >
          <HighlighterIcon className="shrink-0 size-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}
          `}
        >
          <Heading1Icon className="shrink-0 size-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}
          `}
        >
          <Heading2Icon className="shrink-0 size-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}
          `}
        >
          <Heading3Icon className="shrink-0 size-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("heading", { level: 4 }) ? "bg-gray-200" : ""}
          `}
        >
          <Heading4Icon className="shrink-0 size-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("heading", { level: 5 }) ? "bg-gray-200" : ""}
          `}
        >
          <Heading5Icon className="shrink-0 size-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("heading", { level: 6 }) ? "bg-gray-200" : ""}
          `}
        >
          <Heading6Icon className="shrink-0 size-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("bulletList") ? "bg-gray-200" : ""}
          `}
        >
          <ListIcon className="shrink-0 size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`text-stone-800 font-semibold text-sm border-transparent border rounded-full gap-x-2 justify-center items-center size-8 inline-flex
            ${editor.isActive("orderedList") ? "bg-gray-200" : ""}
          `}
        >
          <ListOrderedIcon className="shrink-0 size-4" />
        </button>
      </div>
    </div>
  );
}

const RichEditor = ({
  content = `<p> <b>Start</b> writing your content... </p>`,
  onSave,
  readOnly = false,
}) => {
  const CustomBulletList = BulletList.extend({
    renderHTML({ HTMLAttributes }) {
      return ["ul", { ...HTMLAttributes, class: "custom-ul-class" }, 0];
    },
  });

  const CustomListItem = ListItem.extend({
    renderHTML({ HTMLAttributes }) {
      return ["li", { ...HTMLAttributes, class: "custom-li-class" }, 0];
    },
  });
  const CustomOrderListItem = OrderedList.extend({
    renderHTML({ HTMLAttributes }) {
      return ["ol", { ...HTMLAttributes, class: "custom-ol-class" }, 0];
    },
  });

  const editor = useEditor({
    editable: !readOnly, // enable editable
    immediatelyRender: false,
    extensions: [
      Underline,
      Highlight.configure({ multicolor: true }),
      CustomBulletList,
      CustomListItem,
      CustomOrderListItem,
      StarterKit.configure({
        bulletList: false,
        listItem: false,
        orderedList: false,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },
  });

  const handleSave = () => {
    if (!editor) return;
    const content = editor.getHTML();
    if (onSave) {
      onSave(content);
    }
  };
  return (
    <>
      <div className="border bg-white border-gray-200 rounded-md overflow-hidden mt-2">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      {!readOnly && (
        <Button size="sm" onClick={handleSave} className="mt-4 bg-indigo-600">
          Save
        </Button>
      )}
    </>
    // <EditorProvider
    //   slotBefore={<MenuBar />}
    //   extensions={extensions}
    //   content={content}
    // />
  );
};

export default RichEditor;
