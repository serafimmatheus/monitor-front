"use client";

import { useState } from "react";
import { syncClients } from "../_api/clients.api";

export function useSync(onSuccess?: () => void) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function sync() {
    setIsSyncing(true);
    setError(null);

    try {
      const result = await syncClients();
      setMessage(result.message);
      onSuccess?.();
    } catch {
      setError("Nao foi possivel iniciar a sincronizacao.");
    } finally {
      setIsSyncing(false);
    }
  }

  return { sync, isSyncing, message, error, clearMessage: () => setMessage(null) };
}
