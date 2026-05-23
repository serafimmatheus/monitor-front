export type ClientStatus =
  | "ATIVA"
  | "PENDENTE"
  | "BAIXADA"
  | "INAPTA"
  | "SUSPENSA"
  | "ERRO";

export const CLIENT_STATUS_OPTIONS: { value: ClientStatus; label: string }[] = [
  { value: "ATIVA", label: "Ativo" },
  { value: "PENDENTE", label: "Pendente" },
  { value: "BAIXADA", label: "Baixada" },
  { value: "INAPTA", label: "Inapto" },
  { value: "SUSPENSA", label: "Suspensa" },
  { value: "ERRO", label: "Erro" },
];
