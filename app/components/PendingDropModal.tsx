"use client";

import React from "react";
import type { Position } from "../type/type";

type PendingDropModalProps = {
  pendingDropTitle: string;
  level: number;
  parentOptions: Position[];
  selectedParent: string | null;
  permissions: Record<string, boolean>;
  onSelectedParentChange: (id: string) => void;
  onPermissionsChange: (permissions: Record<string, boolean>) => void;
  onConfirm: (parentId: string, permissions: Record<string, boolean>) => void;
  onCancel: () => void;
  childrenByParent?: Record<string, Position[]>;
};

export default function PendingDropModal({
  pendingDropTitle,
  level,
  parentOptions,
  selectedParent,
  permissions,
  onSelectedParentChange,
  onPermissionsChange,
  onConfirm,
  onCancel,
  childrenByParent = {},
}: PendingDropModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-30"
        onClick={onCancel}
      />
      <div className="relative z-50 w-full max-w-lg bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-pink-900">
            Select Parent for "{pendingDropTitle}"
          </div>
          <button onClick={onCancel} className="text-gray-500 cursor-pointer">
            ✕
          </button>
        </div>
        <div className="mb-4 text-sm text-gray-600">
          Please select a parent node from Level {level - 1}
        </div>

        {/* Parent selection buttons */}
        <div className="mb-6 space-y-2 bg-gray-50 p-4 rounded border border-gray-200">
          <div className="text-xs font-medium text-gray-500 mb-3">Available Parents:</div>
          <div className="flex flex-wrap gap-2">
            {parentOptions.map((parent) => (
              <button
                key={parent.id}
                onClick={() => onSelectedParentChange(parent.id)}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  selectedParent === parent.id
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-pink-400"
                }`}
              >
                {parent.title}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-sm font-medium mb-3 text-black">Permissions</div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions.approveLeave}
                onChange={(e) =>
                  onPermissionsChange({
                    ...permissions,
                    approveLeave: e.target.checked,
                  })
                }
              />
              <span className="text-sm text-black">Approve Leave</span>
            </label>
            <label className="flex items-center gap-2 text-black">
              <input
                type="checkbox"
                checked={permissions.viewLeave}
                onChange={(e) =>
                  onPermissionsChange({
                    ...permissions,
                    viewLeave: e.target.checked,
                  })
                }
              />
              <span className="text-sm">View Leave</span>
            </label>
            <label className="flex items-center gap-2 text-black">
              <input
                type="checkbox"
                checked={permissions.approveExpense}
                onChange={(e) =>
                  onPermissionsChange({
                    ...permissions,
                    approveExpense: e.target.checked,
                  })
                }
              />
              <span className="text-sm">Approve Expense</span>
            </label>
            <label className="flex items-center gap-2 text-black">
              <input
                type="checkbox"
                checked={permissions.viewExpense}
                onChange={(e) =>
                  onPermissionsChange({
                    ...permissions,
                    viewExpense: e.target.checked,
                  })
                }
              />
              <span className="text-sm">View Expense</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-pink-600 text-pink-600 cursor-pointer rounded-full hover:bg-pink-50"
            >
              Cancel
            </button>
            <button
              disabled={!selectedParent}
              onClick={() => {
                if (selectedParent) {
                  onConfirm(selectedParent, permissions);
                }
              }}
              className="px-6 py-2 bg-pink-600 text-white cursor-pointer rounded-full hover:bg-pink-700 disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
