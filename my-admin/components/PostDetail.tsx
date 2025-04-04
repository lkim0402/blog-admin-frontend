import { Post } from "../src/types/post";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { useEditor, EditorContent } from "@tiptap/react";
// import { StarterKit } from "@tiptap/starter-kit";
import "../src/index.css";
import PostEditor from "./PostEditor";
import Button from "./button";
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
      {!isLoading && !isEditing && (
        <div>
          <div className="flex flex-row gap-2">
            <Button text={"Home"} onClick={onBack} />
            <Button text={"Edit"} onClick={handleEdit} />
          </div>

          {isLoading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <h1 className="text-1xl font-bold mb-2">Title: {post.title}</h1>
            <p className="text-sm text-gray-500">Category: {post.category}</p>
            <p className="text-sm text-gray-500">Post ID: {id}</p>
            <p className="text-sm text-gray-500">
              Created: {new Date(post.date).toLocaleDateString()}
            </p>
            {post.updated_date && (
              <p className="text-sm text-gray-500">
                Last updated: {new Date(post.updated_date).toLocaleDateString()}
              </p>
            )}
            {/* <hr className="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />
            <div dangerouslySetInnerHTML={{ __html: post.body }} /> */}
          </div>
        </div>
      )}
      <PostEditor
        post={post}
        setPost={setPost}
        onSubmit={handleSave}
        onPrevious={handleCancel}
      />
    </div>
  );
}
