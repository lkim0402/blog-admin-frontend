import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostBox from "../../components/postBox";
import Button from "../../components/button";
import { Post } from "../types/post";

export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  async function onDelete(id: string) {
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
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Dashboard
      </h1>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Welcome back! Manage your posts below.</p>
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
            All Posts
          </h2>

          {posts.length === 0 ? (
            <p className="italic text-gray-500 text-center">
              No posts available.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {posts.map((el) => (
                <PostBox {...el} key={el._id} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
