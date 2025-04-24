import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PostBox from "../../components/postBox";
import Button from "../../components/button";
import { Sidebar } from "../../components/Sidebar";
import { Post } from "../types/post";
import { Menu, X } from "lucide-react";
import { categories } from "../types/post";

export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [category, setCategory] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );

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

  const [showSidebar, setShowSidebar] = useState(false);

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
        <div className="flex justify-between items-center mb-6">
          <Button text="Create Post" onClick={handleCreate} />
        </div>

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
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Posts: {category}
            </h2>

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
                {category === "All" // all posts
                  ? posts.map((el) => (
                      <PostBox {...el} key={el._id} onDelete={onDelete} />
                    ))
                  : category === "Published" // only published posts
                  ? posts
                      .filter((el) => el.category !== "Draft")
                      .map((el) => (
                        <PostBox {...el} key={el._id} onDelete={onDelete} />
                      ))
                  : posts // else, filter by category
                      .filter((el) => el.category == category)
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
