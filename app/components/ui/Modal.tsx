"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#062f36]/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-[0_32px_80px_rgba(6,47,54,0.4)] animate-fadein overflow-hidden`}>
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#062f36] via-[#0f6b72] to-[#f4c400]" />
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dbe7e9]">
          <h2 className="text-lg font-black text-[#062f36]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#062f36] hover:bg-[#f5f8f8] transition-all"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
