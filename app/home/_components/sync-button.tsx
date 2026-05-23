"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SyncButtonProps {
  onSync: () => void;
  isSyncing: boolean;
  isSyncActive: boolean;
  canSync: boolean;
  disabledReason?: string;
}

export function SyncButton({
  onSync,
  isSyncing,
  isSyncActive,
  canSync,
  disabledReason,
}: SyncButtonProps) {
  const isBusy = isSyncing || isSyncActive;
  const isDisabled = isBusy || !canSync;
  const tooltip = isBusy
    ? "Aguarde a sincronizacao em andamento."
    : disabledReason;

  const button = (
    <Button
      onClick={onSync}
      disabled={isDisabled}
      className="h-9 gap-2 rounded-lg bg-[#1a73e8] text-white hover:bg-[#1557b0] disabled:opacity-60"
    >
      <RefreshCw className={cn("size-4", isBusy && "animate-spin")} />
      {isBusy ? "Sincronizando..." : "Sincronizar"}
    </Button>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">{button}</span>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
