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
        // const response = await fetch("http://localhost:5000/api/posts");
        const response = await fetch(`${import.meta.env.API_URL}/api/posts`);

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
        `${import.meta.env.API_URL}/api/delete/${id}`,
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
    <div>
      <p>Welcome to dashboard!</p>

      <div>
        <Button text={"Create Post"} onClick={handleCreate} />
      </div>
      {/* list of posts */}
      {isLoading && <div className="italic text-gray-500">Loading</div>}
      {error && <div className="italic text-red-300">{error}</div>}
      <div className="mt-10 spa">
        <p>All posts</p>
        {posts.length === 0 && !isLoading && !error && (
          <p className="italic text-gray-500">No posts available.</p>
        )}

        <div className="flex flex-col space-y-3">
          {posts.map((el) => (
            <PostBox {...el} key={el._id} onDelete={onDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
