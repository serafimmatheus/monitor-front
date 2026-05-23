import { useEffect } from "react";

export function usePolling(callback: () => void, intervalMs: number | null) {
  useEffect(() => {
    if (intervalMs === null) return;

    const id = setInterval(callback, intervalMs);
    return () => clearInterval(id);
  }, [callback, intervalMs]);
}
