import React from "react";
import { ToastType } from "./ToastContext";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  }[type];

  const icon = {
    success: "check_circle",
    error: "error",
    info: "info",
  }[type];

  const iconColor = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-blue-500",
  }[type];

  return (
    <div
      className={`flex items-center p-4 mb-4 text-sm rounded-lg border shadow-lg transition-all duration-300 transform translate-x-0 ${bgColor}`}
      role="alert"
    >
      <span className={`material-symbols-outlined flex-shrink-0 inline w-5 h-5 mr-3 ${iconColor}`}>
        {icon}
      </span>
      <span className="sr-only">{type}</span>
      <div className="font-medium mr-6">{message}</div>
      <button
        type="button"
        className={`ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 rounded-lg focus:ring-2 focus:ring-offset-2 ${
          type === "success"
            ? "text-green-500 hover:bg-green-200 focus:ring-green-400"
            : type === "error"
            ? "text-red-500 hover:bg-red-200 focus:ring-red-400"
            : "text-blue-500 hover:bg-blue-200 focus:ring-blue-400"
        }`}
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <span className="material-symbols-outlined w-5 h-5">close</span>
      </button>
    </div>
  );
}
