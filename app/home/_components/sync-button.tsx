"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SyncButtonProps {
  onSync: () => void;
  isSyncing: boolean;
}

export function SyncButton({ onSync, isSyncing }: SyncButtonProps) {
  return (
    <Button onClick={onSync} disabled={isSyncing}>
      <RefreshCw className={isSyncing ? "animate-spin" : undefined} />
      {isSyncing ? "Sincronizando..." : "Sincronizar CNPJs"}
    </Button>
  );
}
