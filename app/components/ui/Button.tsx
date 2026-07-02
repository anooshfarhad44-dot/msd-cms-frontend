"use client";
import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary:   "bg-[#0f6b72] hover:bg-[#062f36] text-white shadow-[0_4px_14px_rgba(15,107,114,0.3)]",
  secondary: "bg-white hover:bg-[#f5f8f8] text-[#062f36] border border-[#dbe7e9]",
  danger:    "bg-red-500 hover:bg-red-600 text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)]",
  ghost:     "bg-transparent hover:bg-[#f5f8f8] text-[#062f36]",
  gold:      "bg-[#f4c400] hover:bg-[#e0b300] text-[#062f36] shadow-[0_4px_14px_rgba(244,196,0,0.3)]",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {children}
    </button>
  );
}
