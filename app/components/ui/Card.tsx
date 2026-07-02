interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = "", accent, onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#dbe7e9] shadow-[0_4px_20px_rgba(6,47,54,0.05)] relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#062f36] via-[#0f6b72] to-[#f4c400]" />
      )}
      {children}
    </div>
  );
}
