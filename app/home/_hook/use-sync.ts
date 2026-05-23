"use client";

import { useState } from "react";
import { syncClients } from "../_api/clients.api";

export function useSync(onSuccess?: (queued: number) => void) {
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
    } catch {
      setError("Nao foi possivel iniciar a sincronizacao.");
    } finally {
      setIsSyncing(false);
    }
  }

  return { sync, isSyncing, message, error, clearMessage: () => setMessage(null) };
}
