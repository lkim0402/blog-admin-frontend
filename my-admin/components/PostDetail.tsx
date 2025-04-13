import { Post } from "../src/types/post";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Link from "@tiptap/extension-link";
import ImageResize from "tiptap-extension-resize-image";

import "../src/index.css";
import PostEditor from "./PostEditor";
import Button from "./button";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
// import React from "react";

const lowlight = createLowlight(all);

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
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Getting the id
  const { id } = useParams();

  const viewEditor = useEditor({
    content: post.body || "",
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link,
      ImageResize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    editorProps: {
      attributes: {
        class: "tiptap-view-mode h-auto",
      },
    },
    editable: false,
  });

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
        cover_image: data.cover_image || "",
        tags: data.tags || [],
      });
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

  useEffect(() => {
    if (viewEditor && post.body) {
      viewEditor.commands.setContent(post.body);
    }
  }, [post.body, viewEditor]);

  function onBack() {
    navigate(`/dashboard`);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
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
            cover_image: post.cover_image,
            tags: post.tags,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }

      const updatedPost = await response.json();
      console.log("updatedpost: ", updatedPost);

      setPost({
        ...updatedPost,
        updated_date: updatedPost.updated_date || new Date().toISOString(),
      });

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

  return (
    <div className="flex flex-col space-y-3 max-w-4xl mx-auto p-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : isEditing ? (
        <PostEditor
          post={post}
          setPost={setPost}
          onSubmit={handleSave}
          onPrevious={handleCancel}
        />
      ) : (
        <div>
          <div className="flex flex-row gap-2 mb-3">
            <Button text={"Home"} onClick={onBack} />
            <Button text={"Edit"} onClick={handleEdit} />
          </div>

          {error && <div className="text-red-500">{error}</div>}
          <div>
            <div className="mb-8 space-y-2 ">
              <h1 className="text-3xl font-bold ">{post.title}</h1>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col space-y-2">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Category with badge style */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium  ${
                      post.category == "Journal"
                        ? "bg-blue-900 text-blue-200"
                        : post.category == "Workshop"
                        ? "bg-amber-500 text-amber-50"
                        : "bg-gray-600 text-gray-300"
                    } `}
                  >
                    {post.category}
                  </span>

                  {/* ID */}
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    Post #{id}
                  </span>

                  {/* Created date */}
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  {/* Updated date (if exists) */}
                  {post.updated_date && (
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Updated:{" "}
                      {new Date(post.updated_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <div>{post.cover_image}</div>
                <div className="flex flex-row gap-2">
                  {post.tags &&
                    post.tags.map((el, index) => (
                      <div
                        key={index}
                        className="text-sm px-2 py-1 rounded-md bg-blue-100 text-blue-800"
                      >
                        #{el.tag}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <hr className="h-px my-5 bg-gray-200 border-0" />
            {viewEditor && (
              <EditorContent editor={viewEditor} className="prose " />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
