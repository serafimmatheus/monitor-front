import { api } from "@/lib/axios";
import type { User } from "@/contexts/auth-context";

interface LoginResponse {
  token: string;
  user: User;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<LoginResponse>("/api/auth/login", {
    email,
    password,
  });
  return data;
}

export async function getMe() {
  const { data } = await api.get<User>("/api/auth/me");
  return data;
}
