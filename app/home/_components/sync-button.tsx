"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SyncButtonProps {
  onSync: () => void;
  isSyncing: boolean;
}

export function SyncButton({ onSync, isSyncing }: SyncButtonProps) {
  return (
    <Button
      onClick={onSync}
      disabled={isSyncing}
      className="h-9 gap-2 rounded-lg bg-[#1a73e8] text-white hover:bg-[#1557b0]"
    >
      <RefreshCw className={cn("size-4", isSyncing && "animate-spin")} />
      {isSyncing ? "Sincronizando..." : "Sincronizar SQS"}
    </Button>
  );
}
