import { LucideIcon } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#0f6b72]/10 flex items-center justify-center mb-4">
        <Icon className="text-[#0f6b72]" size={28} />
      </div>
      <h3 className="text-lg font-black text-[#062f36] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#62777d] max-w-xs mb-5">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
