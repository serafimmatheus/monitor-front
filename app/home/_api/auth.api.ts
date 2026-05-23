import { api } from "@/lib/axios";
import type { User } from "@/contexts/auth-context";

interface BetterAuthSessionResponse {
  user?: {
    id: string;
    email: string;
    name?: string | null;
  };
}

export async function login(email: string, password: string) {
  const response = await api.post<BetterAuthSessionResponse>(
    "/api/auth/sign-in/email",
    { email, password },
  );

  const token = response.headers["set-auth-token"];

  if (!token || !response.data.user) {
    throw new Error("Falha ao autenticar");
  }

  return {
    token: String(token),
    user: {
      id: response.data.user.id,
      email: response.data.user.email,
      name: response.data.user.name ?? "",
    } satisfies User,
  };
}

export async function getMe() {
  const { data } = await api.get<BetterAuthSessionResponse>(
    "/api/auth/get-session",
  );

  if (!data.user) {
    throw new Error("Sessao invalida");
  }

  return {
    id: data.user.id,
    email: data.user.email,
    name: data.user.name ?? "",
  } satisfies User;
}

export async function logoutRequest() {
  await api.post("/api/auth/sign-out");
}
