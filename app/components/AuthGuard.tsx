"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/app/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // Only runs on client where localStorage is available
    const loggedIn = isLoggedIn();
    setAuthed(loggedIn);
    setChecked(true);
    if (!loggedIn) {
      router.replace("/login");
    }
  }, [router]);

  // Wait for client-side check before rendering anything
  if (!checked) return null;
  if (!authed) return null;

  return <>{children}</>;
}
