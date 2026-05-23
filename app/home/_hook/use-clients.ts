"use client";

import { useCallback, useEffect, useState } from "react";
import { getClientsSummary, type ClientsSummary } from "../_api/clients.api";
import { usePolling } from "./use-polling";

const SYNC_POLL_INTERVAL_MS = 3000;

const EMPTY_SUMMARY: ClientsSummary = {
  ativos: 0,
  pendentes: 0,
  inaptos: 0,
  totalCnpj: 0,
  pendingCnpj: 0,
  hasPendingSync: false,
};

export function useClients() {
  const [summary, setSummary] = useState<ClientsSummary>(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const data = await getClientsSummary();
      setSummary(data);
      setError(null);
    } catch {
      setError("Nao foi possivel carregar os clientes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  usePolling(
    fetchSummary,
    summary.hasPendingSync ? SYNC_POLL_INTERVAL_MS : null,
  );

  return {
    summary,
    isLoading,
    error,
    hasPendingSync: summary.hasPendingSync,
    refetch: fetchSummary,
  };
}
