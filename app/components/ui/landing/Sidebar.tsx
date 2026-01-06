"use client";
import React from "react";
import { usePositions } from "../../../context/PositionContext";
import CreatePositionModal from "../../CreatePositionModal";

const Sidebar: React.FC = () => {
  const { sidebarPositions, addPosition, moveLevelToSidebar } = usePositions();
  const [openModal, setOpenModal] = React.useState(false);

  function handleAdd() {
    setOpenModal(true);
  }

  function handleCreate(data: any) {
    addPosition(data);
  }

  function handleDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ source: "sidebar", id })
    );
    e.dataTransfer.effectAllowed = "move";
  }

  function allowDrop(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;
    try {
      const payload = JSON.parse(raw) as {
        source: string;
        id: string;
        level?: number;
      };
      if (payload.source === "level") {
        const fromLevel = payload.level as number;
        moveLevelToSidebar(payload.id, fromLevel);
      }
    } catch (err) {
      console.error("Invalid drop data", err);
    }
  }

  return (
    <div
      onDragOver={allowDrop}
      onDrop={handleDrop}
      className="bg-white w-60 h-175 shadow-md border-3 border-gray-200  p-4 rounded-xl  mt-20 "
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <a className="text-2xl text-pink-900">Positions</a>
        </div>
        <button
          onClick={handleAdd}
          title="Add position"
          className="px-4 py-2 text-[18px] bg-white text-pink-700 rounded cursor-pointer border-pink-700 border hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
        >
          +
        </button>
      </div>
      <div className="border-b-3 border-b-pink-700 mb-4"></div>
      <CreatePositionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={(d) => {
          handleCreate(d);
          setOpenModal(false);
        }}
      />
      <div>
        {(sidebarPositions ?? []).map((p) => (
          <div
            key={p.id}
            draggable
            onDragStart={(e) => handleDragStart(e, p.id)}
            className="mb-2 p-2 border rounded bg-white cursor-grab text-black border-gray-300"
          >
            {p.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
