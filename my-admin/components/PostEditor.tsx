import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

import PostButtonMenu from "./PostButtonMenu";
import Button from "./button";
import { all, createLowlight } from "lowlight";
import React, {
  useCallback,
  // useEffect,
  useState,
} from "react";
import { Post } from "../src/types/post";
const lowlight = createLowlight(all);

type PostEditorProps = {
  post: Post; // initial Post
  setPost: React.Dispatch<React.SetStateAction<Post>>;
  //"setPost is a function that updates a state variable of type Post."
  onSubmit: () => void;
  onPrevious: () => void;
};

export default function PostEditor({
  post,
  setPost,
  onSubmit,
  onPrevious,
}: PostEditorProps) {
  const [showRaw, setShowRaw] = useState(false);
  // const [isEditing, setIsEditing] = useState(true);

  const editor = useEditor({
    content: post.body || "",
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link,
      Image,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    editorProps: {
      attributes: {
        class: "h-80",
      },
    },
    onUpdate({ editor }) {
      setPost((prevPost) => ({
        ...prevPost,
        body: editor.getHTML(),
      }));
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-row gap-2">
        {/* submitting the new/edited content */}
        <Button text={"Submit"} onClick={onSubmit} />
        {/* going back to home without saving*/}
        <Button text={"Go back"} onClick={onPrevious} />
      </div>

      {/* The menu */}
      <div className="">
        <label id="title">Title</label>
        <input
          type="text"
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          value={post.title ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label>Category</label>
        <select
          value={post.category ?? ""}
          onChange={(e) => setPost({ ...post, category: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Workshop</option>
          <option>Journal</option>
        </select>
      </div>
      <div></div>
      <div className="">
        <label>Content</label>
        <PostButtonMenu editor={editor} />
        <Button
          text={showRaw ? "Preview" : "Raw HTML"}
          onClick={() => setShowRaw((prev) => !prev)}
        />
        <Button text={"Set image"} onClick={addImage}></Button>

        {/* <EditorContent editor={editor} /> */}
        {showRaw ? (
          <textarea
            className="w-full h- border border-gray-300 rounded px-3 py-2 font-mono"
            value={editor.getHTML()}
            onChange={(e) => {
              editor.commands.setContent(e.target.value, false);
            }}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );
}
