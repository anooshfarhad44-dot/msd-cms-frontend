import { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-black text-[#062f36] uppercase tracking-wider">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          {...props}
          className={`w-full h-11 px-4 rounded-xl border bg-white text-[#062f36] text-sm font-medium transition-all duration-200 outline-none cursor-pointer
            focus:ring-2 focus:ring-[#0f6b72]/20 focus:border-[#0f6b72]
            ${error ? "border-red-400" : "border-[#dbe7e9] hover:border-[#0f6b72]/40"}
            ${className}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
