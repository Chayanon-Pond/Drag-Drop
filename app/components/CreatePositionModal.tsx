"use client";

import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
};

export default function CreatePositionModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [nameTh, setNameTh] = React.useState("");
  const [nameCn, setNameCn] = React.useState("");
  const [nameVn, setNameVn] = React.useState("");
  const [section, setSection] = React.useState("");
  const [salaryType, setSalaryType] = React.useState<"normal" | "commission">(
    "normal"
  );

  React.useEffect(() => {
    if (!open) {
      setNameTh("");
      setNameCn("");
      setNameVn("");
      setSection("");
      setSalaryType("normal");
    }
  }, [open]);

  if (!open) return null;

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    onCreate({ nameTh, nameCn, nameVn, section, salaryType });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="relative z-60 w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-pink-900">
            Create Position
          </div>
          <button onClick={onClose} className="text-gray-500 cursor-pointer">
            ✕
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Name (TH)
            </label>
            <input
              value={nameTh}
              onChange={(e) => setNameTh(e.target.value)}
              className="w-full border px-3 py-2 rounded text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Name (Chinese)
            </label>
            <input
              value={nameCn}
              onChange={(e) => setNameCn(e.target.value)}
              className="w-full border px-3 py-2 rounded text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Name (Vietnamese)
            </label>
            <input
              value={nameVn}
              onChange={(e) => setNameVn(e.target.value)}
              className="w-full border px-3 py-2 rounded text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Section
            </label>
            <input
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full border px-3 py-2 rounded text-black"
            />
          </div>
          <div>
            <div className="text-sm font-medium mb-1 text-black">
              Salary Type
            </div>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-black">
                <input
                  type="radio"
                  name="salary"
                  checked={salaryType === "normal"}
                  onChange={() => setSalaryType("normal")}
                />{" "}
                Normal
              </label>
              <label className="flex items-center gap-2 text-black">
                <input
                  type="radio"
                  name="salary"
                  checked={salaryType === "commission"}
                  onChange={() => setSalaryType("commission")}
                />{" "}
                Commission
              </label>
            </div>
          </div>
          <div className="flex justify-center gap-10 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border  text-pink-600 cursor-pointer rounded-3xl w-40 hover:bg-pink-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white  cursor-pointer rounded-3xl w-40 hover:bg-pink-700"
            >
              + Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
