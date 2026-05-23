"use client";

import { useCallback, useEffect, useState } from "react";
import { getClients, type Client } from "../_api/clients.api";
import { usePolling } from "./use-polling";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      const data = await getClients();
      setClients(data);
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

  usePolling(fetchClients, 5000);

  return { clients, isLoading, error, refetch: fetchClients };
}
