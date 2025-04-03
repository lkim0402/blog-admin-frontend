import { Post } from "../src/types/post";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import "../src/index.css";
// import React from "react";

export default function PostDetail() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [post, setPost] = useState<Post>({
    _id: "",
    title: "",
    content: "",
    body: "",
    category: "",
    date: new Date().toISOString(),
    updated_date: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Getting the id
  const { id } = useParams();

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }
      const data = await response.json();

      console.log(data);
      setPost({
        _id: data._id || "",
        title: data.title || "",
        content: data.content || "",
        body: data.body || "",
        category: data.category || "",
        date: data.date || new Date(),
        updated_date: data.updated_date || "",
      });

      if (editor) {
        editor.commands.setContent(data.body);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const editor = useEditor({
    content: post?.body || "",
    extensions: [StarterKit],
    onUpdate({ editor }) {
      setPost((prevPost) => ({
        ...prevPost,
        body: editor.getHTML(),
      }));
    },
  });
  useEffect(() => {
    if (editor && post.body && !editor.isDestroyed) {
      editor.commands.setContent(post.body);
    }
  }, [post.body, editor]);

  function onBack() {
    navigate(`/dashboard`);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    // Reset any changes
    // editor?.commands.setContent(post.body);
    fetchPost();
  }

  async function handleSave() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/editPost/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: post.title,
            category: post.category,
            body: post.body,
            date: post.date,
            updated_date: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }

      const updatedPost = await response.json();
      console.log("updatedpost: ", updatedPost);

      // setPost(updatedPost);
      setPost({
        ...updatedPost,
        updated_date: updatedPost.updated_date || new Date().toISOString(),
      });
      if (editor) {
        editor.commands.setContent(updatedPost.body);
      }

      setIsEditing(false);
      fetchPost();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.log(error);
      }
    }
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        className="rounded-lg border-2 border-gray-400 px-4 py-2 mb-4"
        onClick={onBack}
      >
        Back to home
      </button>

      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!isLoading && !isEditing ? (
        <div>
          <button
            className="rounded-lg border-2 border-gray-400 px-4 py-2 mb-4"
            onClick={handleEdit}
          >
            Edit
          </button>
          <div>
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <p className="text-lg text-gray-600 mb-2">
              Category: {post.category}
            </p>
            <p className="text-sm text-gray-500 mb-4">Post ID: {id}</p>
            <p className="text-sm text-gray-500">
              Created: {new Date(post.date).toLocaleDateString()}
            </p>
            {post.updated_date && (
              <p className="text-sm text-gray-500">
                Last updated: {new Date(post.updated_date).toLocaleDateString()}
              </p>
            )}
            <hr className="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex space-x-2 mb-4">
            <button
              className="rounded-lg border-2 border-gray-400 px-4 py-2"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="rounded-lg border-2 border-gray-400 px-4 py-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="title" className="block mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                value={post.title || ""}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="category" className="block mb-1">
                Category
              </label>
              <input
                id="category"
                type="text"
                onChange={(e) => setPost({ ...post, category: e.target.value })}
                value={post.category || ""}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1">Content</label>
              <EditorContent editor={editor} className=" " />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
