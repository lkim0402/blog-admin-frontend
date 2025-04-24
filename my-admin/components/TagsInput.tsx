import React, { useState, useEffect } from "react";
import { Post } from "../src/types/post";
import { Tag } from "../src/types/post";

interface TagsInputProps {
  post: Post;
  setPost: React.Dispatch<React.SetStateAction<Post>>;
}

export function TagsInput({ post, setPost }: TagsInputProps) {
  const [tagInput, setTagInput] = useState("");

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Available tags updated:", availableTags);
  }, [availableTags]);

  useEffect(() => {
    console.log("Post tags updated:", post.tags);
  }, [post.tags]);

  // Fetch available tags from database when component mounts
  useEffect(() => {
    async function fetchTags() {
      try {
        setIsLoading(true);
        // Replace this with your actual API call
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tags`
        );
        const data = await response.json();
        console.log("data when fetching: ", data);
        setAvailableTags(data.tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTags();
  }, []);

  // Handle tag input when user presses Enter
  const [isAddingTag, setIsAddingTag] = useState(false); // Prevent multiple submissions
  // Handle selecting an existing tag from the dropdown
  const handleTagKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const tagInputTrim = tagInput.trim();

    if (e.key === "Enter" && tagInputTrim && !isAddingTag) {
      e.preventDefault();
      setIsAddingTag(true); // Disable further submissions

      // Check if tag already exists (case-insensitive) in the post's tags
      if (
        post.tags &&
        post.tags.some(
          (tagObj) => tagObj.tag.toLowerCase() === tagInputTrim.toLowerCase()
        )
      ) {
        setTagInput("");
        setIsAddingTag(false); // Re-enable
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tagAdd`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tag: tagInputTrim,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to add tag:", errorData.message);
          setIsAddingTag(false); // Re-enable on error
          return;
        }

        const newTag = await response.json();
        console.log("New tag added:", newTag);

        setPost((prevPost) => ({
          ...prevPost,
          tags: [...(prevPost.tags || []), newTag],
        }));

        setAvailableTags((prevAvailableTags) => {
          if (!prevAvailableTags.some((tag) => tag._id === newTag._id)) {
            return [...prevAvailableTags, newTag];
          }
          return prevAvailableTags;
        });

        setTagInput("");
        setIsAddingTag(false); // Re-enable on success
      } catch (error) {
        console.error("Error adding tag:", error);
        setIsAddingTag(false); // Re-enable on error
      }
    }
    // setTagInput("");
  };

  const handleSelectTag = (tag: Tag) => {
    // Check if the tag is already in the post
    // if (post.tags?.includes(tag)) {
    //   return;
    // }
    if (post.tags?.some((t) => t._id === tag._id)) {
      return;
    }

    const newTags = [...(post.tags || []), tag];
    console.log("newTags: ", newTags);
    setPost({ ...post, tags: newTags });
  };

  // removing tag
  const removeTag = async (tagToRemove: Tag, isSelectedTags: boolean) => {
    if (
      window.confirm(
        `Are you sure you want to delete tag "${tagToRemove.tag}"?`
      )
    ) {
      try {
        // Remove from selected tags (post.tags) if it's there
        setPost((prevPost) => ({
          ...prevPost,
          tags: (prevPost.tags ?? []).filter(
            (tagObj) => tagObj._id !== tagToRemove._id
          ),
        }));

        // Remove from available tags list
        if (!isSelectedTags) {
          setAvailableTags((prevAvailable) =>
            prevAvailable.filter((tag) => tag._id !== tagToRemove._id)
          );
        }

        console.log("Removing", tagToRemove);

        if (isSelectedTags) {
          return; // If it's only from selected tags, skip DB delete
        }

        // Delete from the database
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tagDelete`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tagToRemove,
            }),
          }
        );

        if (!response.ok) {
          console.error("Failed to delete tag from database");
        }
      } catch (error) {
        console.error("Error deleting tag:", error);
      }
    } else {
      console.log("not deleting tag");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Tags</label>

      {/* Tag input field */}
      <div className="flex flex-col">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Add a new tag and press Enter"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Available tags from database */}
      <div className="mt-2">
        <label className="text-sm">Available Tags:</label>
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading tags...</div>
        ) : (
          <div className="flex flex-wrap gap-2 mt-1">
            {availableTags.map((tagObj) => (
              <div
                className={`text-sm px-2 py-1 rounded-md  ${
                  post.tags?.map((tagObj) => tagObj.tag).includes(tagObj.tag)
                    ? "bg-blue-100 text-blue-800 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <button
                  key={tagObj._id}
                  onClick={() => handleSelectTag(tagObj)}
                  disabled={post.tags
                    ?.map((tagObj) => tagObj.tag)
                    .includes(tagObj.tag)}
                  className="hover:cursor-pointer"
                  title="add tag"
                >
                  {tagObj.tag}
                </button>
                <button
                  onClick={() => removeTag(tagObj, false)}
                  className="ml-2 text-blue-500 hover:text-blue-700 hover:cursor-pointer"
                  title="delete tag"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected tags */}
      <div className="mt-2">
        <label className="text-sm">Selected Tags:</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {(post.tags || []).map((tagObj, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center"
            >
              <span>{tagObj.tag}</span>
              <button
                onClick={() => removeTag(tagObj, true)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                ×
              </button>
            </div>
          ))}
          {(post.tags || []).length === 0 && (
            <div className="text-sm text-gray-500">No tags selected</div>
          )}
        </div>
      </div>
    </div>
  );
}
