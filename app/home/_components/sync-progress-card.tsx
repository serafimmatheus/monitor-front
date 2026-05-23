"use client";

import { RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Client } from "../_api/clients.api";

type SyncProgressCardProps = {
  clients: Client[];
  isSyncing: boolean;
  isSyncActive: boolean;
};

function computeProgress(
  clients: Client[],
  isSyncing: boolean,
  isSyncActive: boolean,
) {
  const cnpjClients = clients.filter((c) => c.documentType === "CNPJ");
  const total = cnpjClients.length;

  if (total === 0) return 100;

  const pending = cnpjClients.filter((c) => c.status === "PENDENTE").length;
  const processed = total - pending;

  if (isSyncing || isSyncActive) {
    return Math.round((processed / total) * 100);
  }

  return pending === 0 ? 100 : Math.round((processed / total) * 100);
}

export function SyncProgressCard({
  clients,
  isSyncing,
  isSyncActive,
}: SyncProgressCardProps) {
  const progress = computeProgress(clients, isSyncing, isSyncActive);
  const isActive = isSyncing || isSyncActive;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw
            className={`size-4 text-[#1a73e8] ${isActive ? "animate-spin" : ""}`}
          />
          <span className="text-sm font-semibold text-foreground">
            Sincronização em Tempo Real
          </span>
        </div>
        <span className="text-sm font-semibold text-foreground">{progress}%</span>
      </div>
      <Progress
        value={progress}
        className="h-2 bg-muted [&>[data-slot=progress-indicator]]:bg-[#1a73e8]"
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {isActive
          ? "Processando mensagens SQS do endpoint primário (sa-east-1)..."
          : progress === 100
            ? "Sincronização concluída. Todos os CNPJs estão atualizados."
            : "Aguardando sincronização de CNPJs pendentes."}
      </p>
    </div>
  );
}
