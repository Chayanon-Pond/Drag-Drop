"use client";
import React from "react";
import { Menu, Expand, ChevronDown } from "lucide-react";
const Navber: React.FC = () => {
  return (
    <nav className="fixed flex flex-row justify-between items-center w-full  h-14 bg-linear-to-r from-purple-900 to-red-700">
      <div className="flex items-center gap-4 pl-4">
        <button className="text-white hover:bg-white/20 p-2 rounded cursor-pointer">
          <Menu size={24} />
        </button>
      </div>
      <div className="flex items-center gap-4 pr-6 ">
        <button className="text-white hover:bg-white/20 px-3 py-2 rounded flex items-center gap-2 cursor-pointer">
          <span className="text-xl">
            <ChevronDown size={16} className="text-white" />
          </span>
        </button>
        <button className="text-white hover:bg-white/20 p-2 rounded cursor-pointer">
          <Expand size={20} />
        </button>
      </div>
    </nav>
  );
};
export default Navber;
