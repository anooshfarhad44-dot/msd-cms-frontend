import { api } from "@/app/lib/api";
import type { AuthState } from "@/app/lib/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

// Backend login response interface
interface BackendAuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "editor";
  };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthState> => {
    const backendResponse = await api.post<BackendAuthResponse>("/auth/login", payload);
    // Map backend's _id to frontend's id
    return {
      token: backendResponse.token,
      user: {
        id: backendResponse.user._id,
        name: backendResponse.user.name,
        email: backendResponse.user.email,
        role: backendResponse.user.role,
      },
    };
  },
};
