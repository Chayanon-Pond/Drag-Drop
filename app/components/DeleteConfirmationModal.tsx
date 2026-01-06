"use client";

import React from "react";

type DeleteConfirmationModalProps = {
  nodeTitle: string;
  childCount: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmationModal({
  nodeTitle,
  childCount,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-30"
        onClick={onCancel}
      />
      <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="text-orange-500 text-2xl">⚠</div>
          <div className="flex-1">
            <div className="font-semibold text-lg text-pink-700">
              Delete {nodeTitle}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete {nodeTitle}
              {childCount > 0
                ? ` (and ${childCount} sub-item${childCount > 1 ? "s" : ""})`
                : ""}
              ? All related items will be moved back to Hire Positions.
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-6 py-2 border w-30 border-pink-700 text-pink-600 rounded-full hover:bg-pink-100 cursor-pointer"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-pink-900 w-30 text-white rounded-full hover:bg-pink-600 cursor-pointer"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
