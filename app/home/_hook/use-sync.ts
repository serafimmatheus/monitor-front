"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { syncClients } from "../_api/clients.api";

function getSyncErrorMessage(error: unknown) {
  if (
    isAxiosError(error) &&
    error.response?.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return "Nao foi possivel iniciar a sincronizacao.";
}

export function useSync(
  onSuccess?: (queued: number) => void,
  onPlanChange?: () => void,
) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function sync() {
    setIsSyncing(true);
    setError(null);

    try {
      const result = await syncClients();
      setMessage(
        result.queued > 0
          ? `${result.message}: ${result.queued} CNPJ(s) enfileirado(s).`
          : "Nenhum CNPJ para sincronizar.",
      );
      onSuccess?.(result.queued);
      onPlanChange?.();
    } catch (syncError) {
      setError(getSyncErrorMessage(syncError));
    } finally {
      setIsSyncing(false);
    }
  }

  return {
    sync,
    isSyncing,
    message,
    error,
    clearMessage: () => {
      setMessage(null);
      setError(null);
    },
  };
}
