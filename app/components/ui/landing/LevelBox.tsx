"use client";

import React from "react";
import { usePositions } from "../../../context/PositionContext";
import Modal from "../../modal";
import PositionNode from "./PositionNode";
import DeleteConfirmationModal from "../../DeleteConfirmationModal";
import PendingDropModal from "../../PendingDropModal";
import TreeConnector from "../../TreeConnector";

export default function LevelBox() {
  const nodeRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const {
    placed,
    moveLevelToLevel,
    moveLevelToSidebar,
    initiateDrop,
    pendingDrop,
    confirmPendingDrop,
    cancelPendingDrop,
    sidebarPositions,
    maxLevel,
    removeLevel,
    removePosition,
    deletePositionWithChildren,
  } = usePositions();

  const [hoveredNode, setHoveredNode] = React.useState<{
    level: number;
    id: string;
  } | null>(null);

  const [deleteConfirm, setDeleteConfirm] = React.useState<{
    nodeId: string;
    level: number;
    title: string;
    childCount: number;
  } | null>(null);

  const [selectedParent, setSelectedParent] = React.useState<string | null>(
    null
  );
  const [permissions, setPermissions] = React.useState<Record<string, boolean>>(
    {
      approveLeave: false,
      approveExpense: false,
      viewLeave: true,
      viewExpense: true,
    }
  );
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  function handleDragStartFromLevel(
    e: React.DragEvent,
    level: number,
    posId: string
  ) {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ source: "level", level, id: posId })
    );
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDropToLevel(e: React.DragEvent, level: number) {
    e.preventDefault();
    if (level !== 1 && (placed[level - 1] ?? []).length === 0) {
      setErrorMessage(
        `No parent node available in Level ${level}. There must be a node in Level ${
          level - 1
        } first.`
      );
      setShowError(true);
      return;
    }

    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;
    try {
      const payload = JSON.parse(raw) as {
        source: string;
        id: string;
        level?: number;
      };
      const res = initiateDrop(
        {
          source: payload.source as any,
          id: payload.id,
          fromLevel: payload.level as number,
        },
        level
      );
      if (!res.ok) {
        setErrorMessage(res.message || "An error occurred during drop.");
        setShowError(true);
      }
    } catch (err) {
      // ignore
    }
  }

  function allowDrop(e: React.DragEvent) {
    e.preventDefault();
  }

  function getPendingTitle(p: any) {
    if (!p) return "";
    if (p.source === "sidebar") {
      const pos = sidebarPositions.find((s) => s.id === p.id);
      return pos ? pos.title : p.id;
    }
    if (p.source === "level") {
      const arr = placed[p.fromLevel ?? 0] ?? [];
      const pos = arr.find((s) => s.id === p.id);
      return pos ? pos.title : p.id;
    }
    return p.id;
  }

  function getParentTitle(pos: any): string {
    if (!pos.parentId) return "No parent";
    for (let l = 1; l < maxLevel; l++) {
      const parent = placed[l]?.find((p) => p.id === pos.parentId);
      if (parent) return parent.title;
    }
    return "Unknown parent";
  }

  function getChildrenTitles(posId: string, level: number): string[] {
    const children: string[] = [];
    const nextLevel = placed[level + 1] ?? [];
    nextLevel.forEach((p) => {
      if (p.parentId === posId) {
        children.push(p.title);
      }
    });
    return children;
  }

  return (
    <div className="relative flex flex-col gap-5 p-4 mt-18 border-gray-200">
      <TreeConnector placed={placed} nodeRefs={nodeRefs} />
      <div>
        {Array.from({ length: maxLevel }).map((_, idx) => {
          const level = idx + 1;
          const nodes = placed[level] ?? [];
          return (
            <div
              key={level}
              className="border border-gray-200 rounded-md p-3 mb-3 bg-gray-50"
            >
              <div className="border-b-2 border-gray-200 pb-1 flex flex-row">
                <div className="font-semibold mb-2 text-pink-900">
                  Level {level}
                </div>
                <button
                  onClick={() => removeLevel(level)}
                  className="ml-auto text-gray-300 hover:text-gray-700 cursor-pointer text-[20px] mr-2 mb-2"
                  title="Delete level"
                >
                  x
                </button>
              </div>
              <div
                onDragOver={allowDrop}
                onDrop={(e) => handleDropToLevel(e, level)}
                className="min-h-17.5 p-2 rounded-md bg-white flex justify-center items-center flex-col"
              >
                {nodes.length === 0 && (
                  <div className="text-gray-400">ลากรายการมาวางที่นี่</div>
                )}

                {/* Pending drop modal */}
                {pendingDrop && pendingDrop.level === level && (
                  <PendingDropModal
                    pendingDropTitle={getPendingTitle(pendingDrop)}
                    level={level}
                    parentOptions={placed[level - 1] ?? []}
                    selectedParent={selectedParent}
                    permissions={permissions}
                    childrenByParent={Object.fromEntries(
                      (placed[level - 1] ?? []).map((parent) => [
                        parent.id,
                        (placed[level] ?? []).filter(
                          (p) => p.parentId === parent.id
                        ),
                      ])
                    )}
                    onSelectedParentChange={setSelectedParent}
                    onPermissionsChange={setPermissions}
                    onConfirm={(parentId, perms) => {
                      confirmPendingDrop(parentId, perms);
                      setSelectedParent(null);
                    }}
                    onCancel={() => {
                      cancelPendingDrop();
                      setSelectedParent(null);
                    }}
                  />
                )}

                {/* Position nodes */}
                <div className="flex gap-2 flex-wrap mt-2">
                  {nodes.map((p) => {
                    const isHovered =
                      hoveredNode?.level === level && hoveredNode?.id === p.id;
                    const parentTitle = getParentTitle(p);
                    const children = getChildrenTitles(p.id, level);

                    return (
                      <PositionNode
                        key={p.id}
                        ref={(el) => {
                          nodeRefs.current[p.id] = el;
                        }}
                        id={p.id}
                        title={p.title}
                        level={level}
                        isHovered={isHovered}
                        parentTitle={parentTitle}
                        children={children}
                        onMouseEnter={() => setHoveredNode({ level, id: p.id })}
                        onMouseLeave={() => setHoveredNode(null)}
                        onDelete={() => {
                          setDeleteConfirm({
                            nodeId: p.id,
                            level,
                            title: p.title,
                            childCount: children.length,
                          });
                          setHoveredNode(null);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <DeleteConfirmationModal
          nodeTitle={deleteConfirm.title}
          childCount={deleteConfirm.childCount}
          onConfirm={() => {
            if (deleteConfirm) {
              deletePositionWithChildren(
                deleteConfirm.nodeId,
                deleteConfirm.level,
                false // always move children to parent (never delete-all)
              );
              setDeleteConfirm(null);
            }
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {/* Error modal */}
      {showError && (
        <Modal
          open={showError}
          title="Error!"
          message={errorMessage ?? "An error occurred"}
          okLabel="OK"
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}
