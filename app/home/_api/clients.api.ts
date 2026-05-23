import { api } from "@/lib/axios";

export type DocumentType = "CNPJ" | "CPF";

export interface Client {
  id: string;
  name: string;
  email: string;
  document: string;
  documentType: DocumentType;
  status: string;
  updatedAt: string;
}

export interface CreateClientInput {
  name: string;
  email: string;
  document: string;
}

export interface UpdateClientInput {
  name?: string;
  email?: string;
  document?: string;
}

export interface ImportClientsResult {
  imported: number;
  skipped: number;
  errors: { row: number; message: string }[];
}

export interface ClientsPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ListClientsResult {
  data: Client[];
  pagination: ClientsPagination;
}

export interface ClientsSummary {
  ativos: number;
  pendentes: number;
  baixadas: number;
  inaptos: number;
  totalCnpj: number;
  pendingCnpj: number;
  hasPendingSync: boolean;
}

export type ClientStatus =
  | "ATIVA"
  | "PENDENTE"
  | "BAIXADA"
  | "INAPTA"
  | "SUSPENSA"
  | "ERRO";

export interface ListClientsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ClientStatus[];
}

export async function getClients(params: ListClientsParams = {}) {
  const { status, ...rest } = params;

  const { data } = await api.get<ListClientsResult>("/clients", {
    params: {
      ...rest,
      ...(status && status.length > 0 ? { status: status.join(",") } : {}),
    },
  });
  return data;
}

export async function getClientsSummary() {
  const { data } = await api.get<ClientsSummary>("/clients/summary");
  return data;
}

export async function createClient(input: CreateClientInput) {
  const { data } = await api.post<{ client: Client }>("/clients", input);
  return data.client;
}

export async function updateClient(clientId: string, input: UpdateClientInput) {
  const { data } = await api.patch<{ client: Client }>(
    `/clients/${clientId}`,
    input,
  );
  return data.client;
}

export async function deleteClient(clientId: string) {
  const { data } = await api.delete<{ ok: true }>(`/clients/${clientId}`);
  return data;
}

export async function importClients(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<ImportClientsResult>(
    "/clients/import",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
}

export async function syncClients() {
  const { data } = await api.post<{ queued: number; message: string }>(
    "/sync",
  );
  return data;
}
