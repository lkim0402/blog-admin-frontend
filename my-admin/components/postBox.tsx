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
  tags, //obj of tags
  onDelete,
}: Post & { onDelete: (id: string, title: string) => void }) {
  const navigate = useNavigate();

  function onExpand() {
    navigate(`/post/${_id}`);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(_id, title);
  }

  return (
    <div
      className="border-2 
     justify-between border-gray-500 rounded flex flex-row p-4"
    >
      {/* description */}
      <section>
        <p className=" font-bold mb-2">{title}</p>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            category == "Journal"
              ? "bg-blue-900 text-blue-200"
              : category == "Workshop"
              ? "bg-amber-500 text-amber-50"
              : "bg-gray-600 text-gray-300"
          } `}
        >
          {category}
        </span>
        <div className="flex flex-row gap-2 my-2">
          {tags?.map((tagObj) => {
            return (
              <div
                className="text-sm px-2 py-1 rounded-md bg-blue-100 text-blue-800"
                key={tagObj._id}
              >
                #{tagObj.tag}
              </div>
            );
          })}
        </div>
        <p className="text-gray-500">
          Date: {new Date(date).toLocaleDateString()}
        </p>
        {updated_date && (
          <p className="text-gray-500">
            Updated date: {new Date(updated_date).toLocaleDateString()}
          </p>
        )}
      </section>

      {/* buttons */}
      <section className="flex flex-col">
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
      </section>
    </div>
  );
}
