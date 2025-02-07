'use client';
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react"; // Import the X icon from lucide-react

export const ToastRenderer = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[1000]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-violet-500 text-white px-12 py-3 rounded-md mb-3 flex items-center justify-between gap-3 transition-opacity ${
            toast.open ? "opacity-100" : "opacity-0"
          }`}
        >
          <div>
            <strong className="font-bold">{toast.title}</strong>
            <p className="text-sm">{toast.description}</p>
          </div>
          <button
            onClick={() => dismiss(toast.id)} // Dismiss the toast when the button is clicked
            className="bg-transparent border-none text-white cursor-pointer p-0 flex items-center"
          >
            <X size={20} /> {/* Render the X icon */}
          </button>
        </div>
      ))}
    </div>
  );
};