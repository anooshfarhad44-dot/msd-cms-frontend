"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { isLoggedIn, login } from "@/app/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn()) router.replace("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const authState = await login(email, password);
      toast.success(`Welcome back, ${authState.user!.name}!`);
      router.push("/dashboard");
    } catch {
      setError("Invalid credentials. Please use admin@example.com / admin123");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f5f8f8]">
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-gradient-to-br from-[#062f36] to-[#0a3d45] p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${(i + 1) * 150}px`,
                height: `${(i + 1) * 150}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-11 h-11 rounded-xl bg-[#f4c400] flex items-center justify-center shadow-[0_8px_24px_rgba(244,196,0,0.3)]">
              <span className="font-black text-[#062f36] text-xs">MSD</span>
            </div>
            <div>
              <p className="font-black text-white">MSD Solicitord CMS</p>
              <p className="text-white/50 text-xs">Content Management System</p>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white leading-tight mb-5">
            Manage your<br />
            <span className="text-[#f4c400]">solicitor website</span><br />
            from one place.
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            A polished CMS to manage MSD Solicitors content, enquiries, reviews,
            fees, team profiles and site settings.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[
            { label: "Services", value: "21" },
            { label: "Reviews", value: "10+" },
            { label: "Enquiries", value: "Live" },
          ].map((s) => (
            <div key={s.label} className="bg-white/8 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-[#f4c400]">{s.value}</p>
              <p className="text-[11px] text-white/50 font-bold mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px]">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-[#0f6b72] flex items-center justify-center">
              <span className="font-black text-white text-xs">MSD</span>
            </div>
            <div>
              <p className="font-black text-[#062f36]">MSD Solicitord CMS</p>
              <p className="text-xs text-[#62777d]">Content Management System</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#dbe7e9] shadow-[0_8px_40px_rgba(6,47,54,0.08)] overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#062f36] via-[#0f6b72] to-[#f4c400]" />

            <div className="p-8">
              <h2 className="text-2xl font-black text-[#062f36] mb-1">Sign in</h2>
              <p className="text-sm text-[#62777d] mb-7">Access your content management panel.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-[#062f36] uppercase tracking-wider">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    autoFocus
                    className="w-full h-11 px-4 rounded-xl border border-[#dbe7e9] bg-[#f5f8f8] text-[#062f36] text-sm font-medium placeholder-slate-400 outline-none transition-all focus:border-[#0f6b72] focus:ring-2 focus:ring-[#0f6b72]/15 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-[#062f36] uppercase tracking-wider">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full h-11 px-4 pr-11 rounded-xl border border-[#dbe7e9] bg-[#f5f8f8] text-[#062f36] text-sm font-medium placeholder-slate-400 outline-none transition-all focus:border-[#0f6b72] focus:ring-2 focus:ring-[#0f6b72]/15 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0f6b72] transition-colors"
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#0f6b72] hover:bg-[#062f36] text-white font-black text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(15,107,114,0.3)] disabled:opacity-60 disabled:pointer-events-none"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn size={17} /> Sign in to CMS
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5 font-medium">
            MSD Solicitord CMS Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}
