"use client";

import { useCallback, useEffect, useState } from "react";
import { getMyPlan, type UserPlanInfo } from "../_api/plan.api";

export function usePlanLimits() {
  const [planInfo, setPlanInfo] = useState<UserPlanInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      const data = await getMyPlan();
      setPlanInfo(data);
      setError(null);
    } catch {
      setError("Nao foi possivel carregar informacoes do plano.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    planInfo,
    isLoading,
    error,
    refetch,
  };
}
