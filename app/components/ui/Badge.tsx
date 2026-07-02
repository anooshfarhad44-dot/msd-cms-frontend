interface BadgeProps {
  children: React.ReactNode;
  color?: "teal" | "gold" | "orange" | "red" | "gray" | "green";
}

const colorMap = {
  teal:   "bg-[#0f6b72]/10 text-[#0f6b72] border-[#0f6b72]/20",
  gold:   "bg-[#f4c400]/15 text-[#7a5f00] border-[#f4c400]/30",
  orange: "bg-[#f47a2a]/10 text-[#c7510f] border-[#f47a2a]/20",
  red:    "bg-red-50 text-red-700 border-red-200",
  gray:   "bg-slate-100 text-slate-600 border-slate-200",
  green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function Badge({ children, color = "teal" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border ${colorMap[color]}`}>
      {children}
    </span>
  );
}
