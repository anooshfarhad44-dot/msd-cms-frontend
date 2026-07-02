"use client";
import { Menu, Bell, LogOut, User, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuth, getAuth } from "@/app/lib/auth";
import toast from "react-hot-toast";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (auth.user) setUser(auth.user);
  }, []);

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-[#dbe7e9] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 shadow-[0_2px_10px_rgba(6,47,54,0.06)]">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-[#dbe7e9] text-[#062f36] hover:bg-[#f5f8f8] transition-all"
        >
          <Menu size={18} />
        </button>
        {title && (
          <h1 className="text-lg font-black text-[#062f36] hidden sm:block">{title}</h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification bell placeholder */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#dbe7e9] text-[#62777d] hover:text-[#0f6b72] hover:bg-[#f5f8f8] transition-all relative">
          <Bell size={17} />
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-3 pr-2 h-10 rounded-xl border border-[#dbe7e9] bg-white hover:bg-[#f5f8f8] transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0f6b72] to-[#062f36] flex items-center justify-center shrink-0">
              <span className="text-white font-black text-[10px]">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
            <span className="text-sm font-bold text-[#062f36] hidden sm:block max-w-[120px] truncate">
              {user?.name || "Admin"}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#dbe7e9] shadow-[0_12px_32px_rgba(6,47,54,0.12)] z-20 overflow-hidden animate-fadein">
                <div className="px-4 py-3 border-b border-[#dbe7e9] bg-[#f5f8f8]">
                  <p className="font-black text-sm text-[#062f36] truncate">{user?.name}</p>
                  <p className="text-xs text-[#62777d] truncate">{user?.email}</p>
                  <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-[#0f6b72]/10 text-[#0f6b72] border border-[#0f6b72]/20 uppercase tracking-wider">
                    {user?.role || "admin"}
                  </span>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
