"use client";

import { Crown } from "lucide-react";
import type { UserPlanInfo } from "../_api/plan.api";

type PlanInfoCardProps = {
  planInfo: UserPlanInfo | null;
  isLoading: boolean;
};

function formatPrice(priceCents: number) {
  if (priceCents === 0) {
    return "Gratuito";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}

export function PlanInfoCard({ planInfo, isLoading }: PlanInfoCardProps) {
  if (isLoading || !planInfo) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Carregando plano...</p>
      </div>
    );
  }

  const syncLabel =
    planInfo.maxSyncsPerMonth === 0
      ? "Sincronizacao bloqueada"
      : `${planInfo.syncsUsed}/${planInfo.maxSyncsPerMonth} sincronizacoes usadas este mes`;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="size-4 text-[#1a73e8]" />
            <span className="text-sm font-semibold text-foreground">
              Plano {planInfo.label}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatPrice(planInfo.priceCents)}
            {planInfo.priceCents > 0 ? "/mes" : ""}
          </p>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {syncLabel}
        </span>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {planInfo.allowImport
          ? "Importacao de planilhas disponivel no seu plano."
          : "Importacao em massa disponivel apenas no plano Pro (R$ 100/mes)."}
      </p>
    </div>
  );
}
