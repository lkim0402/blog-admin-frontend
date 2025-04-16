import React from "react";

interface SidebarProps {
  categories: string[];
  onClick: (category: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ categories, onClick }) => {
  return (
    <div className="fixed h-screen w-48 bg-blue-950 flex flex-col items-center justify-center">
      <div className="space-y-2 pl-4 text-white text-xl ">
        {categories.map((el) => {
          return (
            <div>
              <button
                onClick={() => onClick(el)}
                className="transition-transform hover:scale-105 cursor-pointer"
              >
                {el}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
