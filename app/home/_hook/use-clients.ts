"use client";

import { useCallback, useEffect, useState } from "react";
import { getClients, type Client } from "../_api/clients.api";
import { usePolling } from "./use-polling";

const SYNC_POLL_INTERVAL_MS = 3000;

export function useClients(isSyncActive: boolean) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      const data = await getClients();
      setClients(Array.isArray(data) ? data : []);
      setError(null);
    } catch {
      setError("Nao foi possivel carregar os clientes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  usePolling(fetchClients, isSyncActive ? SYNC_POLL_INTERVAL_MS : null);

  return { clients, isLoading, error, refetch: fetchClients };
}
