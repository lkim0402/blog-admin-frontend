import { useNavigate } from "react-router-dom";
import { Post } from "../src/types/types";
import React from "react";
import clsx from "clsx";
import { getCategoryStyle, getStatusStyle } from "../src/utils/getStyles";

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
  status,
  onDelete,
}: Post & { onDelete: (id: string, title: string) => void }) {
  const navigate = useNavigate();

  // Preserve current category in navigation
  function onExpand() {
    const currentCategory = location.search; // gets "?category=Draft" etc
    navigate(`/post/${_id}${currentCategory}`);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(_id, title);
  }

  return (
    <div
      className="
    bg-white border border-gray-200 rounded-lg 
    shadow-sm hover:shadow-md transition-shadow 
    duration-300 flex flex-col justify-between 
    h-[18rem]
    max-w-[290px]
    w-full 
    overflow-hidden
    "
    >
      {/* Card Header with Category and Status */}
      <div className="px-5 pt-5">
        <div className="flex justify-between mb-4">
          <span
            className={clsx(
              "px-3 py-1 rounded-full text-xs font-semibold",
              getCategoryStyle(category)
            )}
          >
            {category}
          </span>
          <span
            className={clsx(
              "px-3 py-1 rounded-full text-xs font-semibold",
              getStatusStyle(status)
            )}
          >
            {status}
          </span>
        </div>

        {/* Title */}
        <div
          className="font-bold text-[0.85rem] mb-3 
        text-gray-800 line-clamp-2
        h-10
        "
        >
          {title}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags?.map((tagObj) => (
            <div
              className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium"
              key={tagObj._id}
            >
              #{tagObj.tag}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="text-xs text-gray-500 mb-4">
          <div className="flex items-center mb-1">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              ></path>
            </svg>
            Created: {new Date(date).toLocaleDateString()}
          </div>
          {updated_date && (
            <div className="flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Updated: {new Date(updated_date).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-5 pt-2 border-t border-gray-100">
        <div className="flex space-x-2">
          <button
            className="flex-1 py-2 px-4 bg-blue-50 text-blue-700 rounded-md font-medium text-sm hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={onExpand}
          >
            View Post
          </button>
          <button
            className="py-2 px-4 bg-red-50 text-red-700 rounded-md font-medium text-sm hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
