import React from "react";

interface SidebarProps {
  categories: string[];
  onClick: (category: string) => void;
  cur?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  onClick,
  cur,
}) => {
  return (
    <div className="fixed h-screen w-48 bg-blue-950 flex flex-col items-center justify-center">
      <div className="space-y-2 pl-4 text-white text-xl ">
        {categories.map((el) => {
          return (
            <div key={el}>
              <button
                onClick={() => onClick(el)}
                className={`transition-transform 
                hover:scale-105 hover:text-blue-300
                cursor-pointer
                ${el === cur && "scale-105 text-blue-300"}
                `}
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
