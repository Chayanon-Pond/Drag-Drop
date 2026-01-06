"use client";

import React from "react";
import { Props } from "../type/type";

export default function Modal({
  open,
  title = "",
  message,
  okLabel = "OK",
  onClose,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-15 h-15   rounded-full bg-red-100">
              <div className="w-8 h-8 rounded-full absolute top-3.5 left-3.5 bg-red-600">
                <div className="text-white text-[15px] absolute top-1.5 left-2.5">
                  ✕
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            {title && <div className=" text-lg text-black">{title}</div>}
            {message && (
              <div className="text-sm text-gray-600 mt-2">{message}</div>
            )}
          </div>
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white w-19 h-12 cursor-pointer rounded-3xl "
          >
            {okLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
