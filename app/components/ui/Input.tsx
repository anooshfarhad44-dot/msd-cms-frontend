import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-black text-[#062f36] uppercase tracking-wider">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full h-11 px-4 rounded-xl border bg-white text-[#062f36] text-sm font-medium placeholder-slate-400 transition-all duration-200 outline-none
            focus:ring-2 focus:ring-[#0f6b72]/20 focus:border-[#0f6b72]
            ${error ? "border-red-400 bg-red-50/30" : "border-[#dbe7e9] hover:border-[#0f6b72]/40"}
            ${className}`}
        />
        {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400 font-medium">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
