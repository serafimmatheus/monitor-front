"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getClients,
  type Client,
  type ClientStatus,
  type ClientsPagination,
} from "../_api/clients.api";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

type UseClientsTableOptions = {
  refreshToken?: number;
};

export function useClientsTable({ refreshToken = 0 }: UseClientsTableOptions = {}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<ClientStatus[]>([]);
  const [page, setPage] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [pagination, setPagination] = useState<ClientsPagination>({
    page: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = search.trim();
      setDebouncedSearch((current) => {
        if (current !== trimmed) {
          setPage(1);
        }
        return trimmed;
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await getClients({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: statusFilters.length > 0 ? statusFilters : undefined,
      });

      setClients(result.data);
      setPagination(result.pagination);
      setError(null);

      if (
        result.pagination.totalPages > 0 &&
        page > result.pagination.totalPages
      ) {
        setPage(result.pagination.totalPages);
      }
    } catch {
      setError("Nao foi possivel carregar os clientes.");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilters]);

  const updateStatusFilters = useCallback((next: ClientStatus[]) => {
    setStatusFilters(next);
    setPage(1);
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients, refreshToken]);

  return {
    clients,
    pagination,
    isLoading,
    error,
    search,
    setSearch,
    statusFilters,
    setStatusFilters: updateStatusFilters,
    page,
    setPage,
    refetch: fetchClients,
  };
}
