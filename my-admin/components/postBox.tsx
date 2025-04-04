import { useNavigate } from "react-router-dom";
import { Post } from "../src/types/post";
import React from "react";

/*
 * Accepts all the normal Post properties PLUS a function called
 * onDelete that takes a post ID and doesn't return anything.
 * Tells typescript that when you use this component, you
 * have to pass a function to the onDelete prop and it should Accept
 * string parameter
 */
export default function PostBox({
  _id,
  title,
  category,
  date,
  updated_date,
  onDelete,
}: Post & { onDelete: (id: string) => void }) {
  const navigate = useNavigate();

  function onExpand() {
    navigate(`/post/${_id}`);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(_id);
  }

  return (
    <div
      className="border-2 
     justify-between border-gray-500 rounded flex flex-row "
    >
      <div>
        <p className="mr-20">Title: {title}</p>
        <p className="text-gray-500">Category: {category}</p>
        <p className="text-gray-500">
          date: {new Date(date).toLocaleDateString()}
        </p>
        {updated_date && (
          <p className="text-gray-500">
            updated_date: {new Date(updated_date).toLocaleDateString()}
          </p>
        )}
      </div>
      <div>
        <button
          className="rounded-lg bg-gray-100 w-[4rem] m-1 border-0"
          onClick={onExpand}
        >
          Expand
        </button>
        <button
          className="rounded-lg bg-red-100 w-[4rem] m-1 border-0"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
