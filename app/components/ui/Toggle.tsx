"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}

export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${checked ? "bg-[#0f6b72]" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
      {label && <span className="text-sm font-bold text-[#062f36]">{label}</span>}
    </label>
  );
}
