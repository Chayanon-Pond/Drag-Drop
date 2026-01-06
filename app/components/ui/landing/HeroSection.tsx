"use client";
import React from "react";
import LevelBox from "./LevelBox";
import Sidebar from "./Sidebar";
import { usePositions } from "../../../context/PositionContext";

function FooterControls() {
  const { addPosition, saveAll, addLevel } = usePositions();

  return (
    <div className="w-full mt-6 flex justify-center gap-4">
      <button
        onClick={() => addLevel()}
        className="px-4 py-2 w-24 rounded-full border-2 border-pink-700 text-pink-700 hover:bg-pink-200 cursor-pointer"
      >
        +
      </button>
      <button
        onClick={() => saveAll()}
        className="px-6 py-2 rounded-full bg-pink-700 text-white hover:bg-pink-800 cursor-pointer"
      >
        Save all
      </button>
    </div>
  );
}

const Landing = () => {
  return (
    <main className="w-full">
      <div className="flex flex-row justify-between items-start gap-4 w-full">
        <div className="flex-1">
          <LevelBox />
        </div>
        <div className="w-72">
          <Sidebar />
        </div>
      </div>

      <FooterControls />
    </main>
  );
};

export default Landing;
