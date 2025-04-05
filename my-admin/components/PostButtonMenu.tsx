// import React from "react";
import { Editor } from "@tiptap/core";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Link,
  AlignLeft,
  AlignJustify,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { useCallback } from "react";

type PostButtonMenuProps = {
  editor: Editor;
};

// resources
// https://tiptap.dev/docs/editor/getting-started/install/react

const iconButtonStyle = (active: boolean) =>
  `p-2 border rounded-md hover:bg-gray-100 transition ${
    active ? "bg-gray-200 border-blue-500" : "border-gray-300"
  }`;

export default function PostButtonMenu({ editor }: PostButtonMenuProps) {
  // setting the link
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      alert((e as Error).message);
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-0.5 mb-4">
      {/* bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={iconButtonStyle(editor.isActive("bold"))}
        title="Ctrl + B"
      >
        <Bold size={16} />
      </button>

      {/* italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={iconButtonStyle(editor.isActive("italic"))}
        title="Ctrl + I"
      >
        <Italic size={16} />
      </button>

      {/* strikethrough */}
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={iconButtonStyle(editor.isActive("strike"))}
      >
        <Strikethrough size={16} />
      </button>

      {/* inline code */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={iconButtonStyle(editor.isActive("code"))}
        title="Ctrl + E"
      >
        <Code size={16} />
      </button>

      {/* code block */}
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={iconButtonStyle(editor.isActive("codeBlock"))}
      >
        <Code2 size={16} />
      </button>

      {/* list */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={iconButtonStyle(editor.isActive("bulletList"))}
      >
        <List size={16} />
      </button>

      {/* orderedList */}
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={iconButtonStyle(editor.isActive("orderedList"))}
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={iconButtonStyle(editor.isActive({ textAlign: "left" }))}
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={iconButtonStyle(editor.isActive({ textAlign: "center" }))}
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={iconButtonStyle(editor.isActive({ textAlign: "right" }))}
      >
        <AlignRight size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={iconButtonStyle(editor.isActive({ textAlign: "justify" }))}
      >
        <AlignJustify size={16} />
      </button>
      {/* quote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={iconButtonStyle(editor.isActive("blockquote"))}
      >
        <Quote size={16} />
      </button>

      {/* horizontal rule */}
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={iconButtonStyle(false)}
        title="Insert horizontal rule"
      >
        <Minus size={16} />
      </button>

      {/* link */}
      <button
        onClick={setLink}
        className={iconButtonStyle(editor.isActive("link"))}
        title="Add link"
      >
        <Link size={16} />
      </button>
    </div>
  );
}
