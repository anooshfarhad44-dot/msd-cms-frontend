import { authService } from "@/app/services/authService";

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: "admin" | "editor";
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export function getAuth(): AuthState {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }
  const stored = localStorage.getItem("cms_auth");
  if (stored) {
    return JSON.parse(stored);
  }
  return { user: null, token: null };
}

export function setAuth(state: AuthState) {
  if (typeof window !== "undefined") {
    localStorage.setItem("cms_auth", JSON.stringify(state));
  }
}

export function clearAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cms_auth");
  }
}

export function isLoggedIn(): boolean {
  const auth = getAuth();
  return !!auth.token && !!auth.user;
}

export async function login(email: string, password: string): Promise<AuthState> {
  const authState = await authService.login({ email, password });
  setAuth(authState);
  return authState;
}
