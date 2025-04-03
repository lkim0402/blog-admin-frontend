import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

import "../index.css";
import Button from "../../components/button";
import { useState } from "react";
import { Post } from "../types/post";

export default function CreatePost() {
  const navigate = useNavigate();

  // content
  // const [title, setTitle] = useState("");
  // const [category, setCategory] = useState("");
  // const [body, setBody] = useState("");
  const [post, setPost] = useState<Post>({
    _id: "",
    title: "",
    content: "",
    body: "",
    category: "",
    date: new Date().toISOString(),
    updated_date: "",
  });

  // utilities
  const [error, setError] = useState("");

  const editor = useEditor({
    content: "",
    extensions: [StarterKit],
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
    // console.log(editor?.getHTML());
    try {
      const response = await fetch(`${import.meta.env.API_URL}/api/submit`, {
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
        }),
      });

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
    <>
      <Button text={"Go back"} onClick={handlePrevious} />
      <Button text={"Submit"} onClick={handleSubmit} />

      <div className="flex flex-col space-y-3">
        {/* The editor */}
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
          <input
            type="category"
            onChange={(e) => setPost({ ...post, category: e.target.value })}
            value={post.category}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />{" "}
        </div>
        <div className="">
          <label>Content</label>
          <EditorContent editor={editor} />
        </div>
        {error && <div className="text-red-300">{error}</div>}
      </div>
    </>
  );
}
