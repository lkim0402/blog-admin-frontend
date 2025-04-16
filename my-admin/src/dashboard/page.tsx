import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostBox from "../../components/postBox";
import Button from "../../components/button";
import { Sidebar } from "../../components/Sidebar";
import { Post } from "../types/post";

export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState(
    new URLSearchParams(window.location.search).get("category") || "All"
  );
  const categories = ["All", "Workshop", "Journal", "Draft", "Published"];

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

  // function onClick(category: string) {
  //   setCategory(category);
  //   // navigate(`/${link}`);
  // }

  return (
    <div className="flex">
      {/* <div className="fixed h-screen w-48 bg-blue-950 flex flex-col items-center justify-center">
        <div className="space-y-2 pl-4 text-white text-xl ">
          {categories.map((el) => {
            return (
              <div className="">
                <button onClick={() => onClick(el)}>{el}</button>
              </div>
            );
          })}
        </div>
      </div> */}
      <Sidebar categories={categories} onClick={(cat) => setCategory(cat)} />
      <div className="ml-58 mr-10 flex-1 mt-8 p-6  rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800  mb-6">Dashboard</h1>

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
              // sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5
              // sm:bg-emerald-500
              // md:bg-pink-400
              // lg:bg-amber-400
              // xl:bg-blue-300
              <div
                className="grid 
                gap-4 
               
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
