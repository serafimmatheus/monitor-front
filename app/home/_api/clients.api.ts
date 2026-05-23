import { api } from "@/lib/axios";

export interface Client {
  id: string;
  name: string;
  cnpj: string;
  status: string;
  updatedAt: string;
}

export async function getClients() {
  const { data } = await api.get<Client[]>("/api/clients");
  return data;
}

export async function syncClients() {
  const { data } = await api.post<{ queued: number; message: string }>(
    "/api/sync",
  );
  return data;
}
