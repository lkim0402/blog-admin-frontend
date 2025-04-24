import { useNavigate } from "react-router-dom";

import "../index.css";
// import Button from "../../components/button";
import PostEditor from "../../components/PostEditor";

import { useState } from "react";
import { Post } from "../types/types";
import { Sidebar } from "../../components/Sidebar";

export default function CreatePost() {
  // utilities
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [post, setPost] = useState<Post>({
    _id: "",
    title: "",
    content: "",
    body: "",
    category: "Draft",
    date: new Date().toISOString(),
    updated_date: "",
    tags: [],
  });

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
  const categories = ["All", "Workshop", "Journal", "Draft", "Published"];
  function handleClick(cat: string) {
    if (window.confirm("Do you want to exit the post without saving?")) {
      navigate(`/dashboard?category=${encodeURIComponent(cat)}`);
    }
    return;
  }

  return (
    <div className="flex">
      <div className="hidden lg:block ">
        <Sidebar categories={categories} onClick={(cat) => handleClick(cat)} />
      </div>
      {/* <div className="lg:ml-58 flex flex-col space-y-3 max-w-4xl mx-auto p-4"> */}
      <div className="w-full lg:ml-48 px-10 md:px-20  py-6 space-y-3">
        <PostEditor
          post={post}
          setPost={setPost}
          onSubmit={handleSubmit}
          onPrevious={handlePrevious}
        />
        {error && <div className="text-red-300">{error}</div>}
      </div>
    </div>
  );
}
