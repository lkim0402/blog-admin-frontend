import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

import "../index.css";
import Button from "../../components/button";
import PostButtonMenu from "../../components/PostButtonMenu";

import { useState } from "react";
import { Post } from "../types/post";

//
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);

export default function CreatePost() {
  const navigate = useNavigate();

  const [post, setPost] = useState<Post>({
    _id: "",
    title: "",
    content: "",
    body: "",
    category: "Workshop",
    date: new Date().toISOString(),
    updated_date: "",
    tags: [],
  });

  // utilities
  const [error, setError] = useState("");
  const [showRaw, setShowRaw] = useState(false);

  const editor = useEditor({
    content: "",
    extensions: [
      StarterKit,
      Link,
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

  if (!editor) {
    return null;
  }

  async function handleSubmit() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/submit`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: post.title,
            category: post.category,
            body: post.body,
            date: new Date().toISOString(),
            tags: post.tags,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Post submitted successfully:", result);
      navigate("/dashboard"); // Redirect after successful submission
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.log(error);
      }
    }
  }

  function handlePrevious() {
    navigate("/dashboard");
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-lg">
      <div className="flex flex-row gap-2">
        <Button text={"Go back"} onClick={handlePrevious} />
        <Button text={"Submit"} onClick={handleSubmit} />
      </div>

      <div className="flex flex-col space-y-3">
        {/* The menu */}

        <div>
          <label id="title">Title</label>
          <input
            type="text"
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            value={post.title}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label>Category</label>
          <select
            value={post.category}
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

          {/* <EditorContent editor={editor} /> */}
          {showRaw ? (
            <textarea
              className="w-full h-80 border border-gray-300 rounded px-3 py-2 font-mono"
              value={editor.getHTML()}
              onChange={(e) => {
                editor.commands.setContent(e.target.value, false);
              }}
            />
          ) : (
            <EditorContent editor={editor} />
          )}
        </div>
        {error && <div className="text-red-300">{error}</div>}
      </div>
    </div>
  );
}
