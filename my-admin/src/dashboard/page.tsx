import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PostBox from "../../components/postBox";
import Button from "../../components/button";
import { Sidebar } from "../../components/Sidebar";
import { Menu, X } from "lucide-react";
import { Post, categories, Tag } from "../types/types";

export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("All");
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const categories = ["All", "Workshop", "Journal"];

  function handleCreate() {
    navigate("/create");
  }

  useEffect(() => {
    const callPost = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/posts`
        );

        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setPosts(data);
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
    callPost();
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("category", "All");
    setSearchParams(newSearchParams);
  }, []);

  async function onDelete(id: string, title: string) {
    if (window.confirm(`Are you sure you want to delete post "${title}"`)) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/delete/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        // Remove the deleted post from state
        setPosts(posts.filter((post) => post._id !== id));
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          console.log(error);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("cancel");
    }
  }

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    // Update the URL parameter without affecting other existing parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("category", cat);
    setSearchParams(newSearchParams);

    // close side bar
    setShowSidebar(false);
  };

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

  const handleSelectTag = (tag: string) => {
    const tags = [...selectedTags, tag];
    setSelectedTags(tags);
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="flex">
      <div className="hidden lg:block ">
        <Sidebar
          categories={categories}
          cur={category}
          // onClick={(cat) => setCategory(cat)
          onClick={handleCategoryChange}
        />
      </div>

      {/* sidebar */}
      <div>
        {showSidebar && (
          <div
            onClick={() => setShowSidebar(false)} // click to close sidebar
            className="fixed inset-0 bg-black/50 z-40"
          ></div>
        )}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#15182a] 
                p-6 z-50 
                
                shadow-lg flex flex-col gap-4 
                duration-300 ease-in-out 
                ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-between mb-5">
            <p className="font-bold text-white">Menu</p>
            <button
              onClick={() => setShowSidebar(false)} // click to close sidebar
              aria-label="exit button"
            >
              <X className="text-white" />
            </button>
          </div>
          {categories.map((el) => {
            return (
              <div key={el}>
                <button
                  onClick={() => handleCategoryChange(el)}
                  className={`transition-transform text-white
                  hover:scale-105 hover:text-blue-300
                  cursor-pointer
                  ${el === category && "scale-105 text-blue-300"}
                  `}
                >
                  {el}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:ml-58 lg:mr-10 mx-6 flex-1 lg:mt-8 p-6  rounded-lg">
        <div className="lg:hidden">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="mr-10 my-3"
            aria-label="side menu button"
          >
            <Menu size={30} />
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-800  mb-6">Dashboard</h1>
        <div>Welcome back!</div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="italic text-gray-500 text-center">Loading...</div>
        ) : (
          <div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Posts: {category}
                </h2>
                <div className="flex justify-between items-center ">
                  <Button text="Create Post" onClick={handleCreate} />
                </div>
              </div>
              <div>
                <span className="mr-2">Status:</span>
                <select
                  value={currentStatus ?? ""}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All</option>
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>

              {/* Available tags from database */}
              <div className="mt-2">
                <label className="text-sm">Available Tags</label>
                {isLoading ? (
                  <div className="text-sm text-gray-500">Loading tags...</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tagObj: Tag) => (
                      <div className={`text-sm rounded-md`}>
                        <button
                          key={tagObj._id}
                          onClick={() => handleSelectTag(tagObj.tag)}
                          disabled={selectedTags.includes(tagObj.tag)}
                          className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium"
                          title="add tag"
                        >
                          {tagObj.tag}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected tags */}
              <div className="mt-2 mb-10">
                <label className="text-sm">Selected Tags</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium
                      hover:scale-110 transition-transform "
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:cursor-pointer"
                        title="Remove select tag"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {(selectedTags || []).length === 0 && (
                    <div className="text-sm text-gray-500">
                      No tags selected
                    </div>
                  )}
                </div>
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="italic text-gray-500 text-center">
                No posts available.
              </div>
            ) : (
              <div
                className="grid 
                gap-4 
                
               place-items-center
              "
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                }}
              >
                {posts
                  .filter(
                    (el) =>
                      (category === "All" || el.category === category) &&
                      (currentStatus === "All" ||
                        el.status === currentStatus) &&
                      (selectedTags.length === 0 ||
                        selectedTags.some((tag) =>
                          (el.tags ?? []).some((tagObj) => tagObj.tag === tag)
                        ))
                  )
                  .map((el) => (
                    <PostBox {...el} key={el._id} onDelete={onDelete} />
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
