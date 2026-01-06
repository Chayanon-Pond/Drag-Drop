"use client";

import React from "react";

type PositionNodeProps = {
  id: string;
  title: string;
  level: number;
  isHovered: boolean;
  parentTitle: string;
  children: string[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDelete: () => void;
};

const PositionNode = React.forwardRef<HTMLDivElement, PositionNodeProps>(
  function PositionNode(
    {
      title,
      isHovered,
      parentTitle,
      children,
      onMouseEnter,
      onMouseLeave,
      onDelete,
    },
    ref
  ) {
    return (
      <div
        ref={ref} // ⭐ จุดสำคัญ
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative px-3 py-1.5 border border-gray-300 rounded-md bg-white text-black duration-200 ease-in-out hover:shadow-md z-10"
        title={`Parent: ${parentTitle}${
          children.length > 0 ? ` | Children: ${children.join(", ")}` : ""
        }`}
      >
        {title}

        {isHovered && (
          <button
            onClick={onDelete}
            className="absolute top-0 right-0 -translate-y-1 translate-x-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm cursor-pointer hover:bg-red-700"
            title="Delete node"
          >
            x
          </button>
        )}

        {isHovered && (
          <div className="absolute bottom-full left-0 mb-2 bg-gray-900 text-white text-xs p-2 rounded whitespace-nowrap z-20">
            <div>Parent: {parentTitle}</div>
            {children.length > 0 && <div>Children: {children.join(", ")}</div>}
          </div>
        )}
      </div>
    );
  }
);

export default PositionNode;
