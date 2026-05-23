"use client";

import {
  AlertCircle,
  Archive,
  CheckCircle2,
  MoreHorizontal,
  PauseCircle,
  XCircle,
} from "lucide-react";
import type { ClientsSummary } from "../_api/clients.api";

type StatsCardsProps = {
  summary: ClientsSummary;
};

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

type StatCardProps = {
  label: string;
  value: number;
  badge: string;
  icon: React.ReactNode;
  badgeClassName: string;
  iconClassName: string;
};

function StatCard({
  label,
  value,
  badge,
  icon,
  badgeClassName,
  iconClassName,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div
          className={`flex size-10 items-center justify-center rounded-full ${iconClassName}`}
        >
          {icon}
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClassName}`}
        >
          {badge}
        </span>
      </div>
      <p className="mt-4 text-xs font-semibold tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
        {formatNumber(value)}
      </p>
    </div>
  );
}

export function StatsCards({ summary }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        label="ATIVOS"
        value={summary.ativos}
        badge="+12% hoje"
        icon={<CheckCircle2 className="size-5 text-emerald-600" />}
        iconClassName="bg-emerald-50"
        badgeClassName="bg-emerald-50 text-emerald-700"
      />
      <StatCard
        label="PENDENTES"
        value={summary.pendentes}
        badge={
          summary.pendentes > 0
            ? `${summary.pendentes} aguardando`
            : "Nenhum"
        }
        icon={<MoreHorizontal className="size-5 text-amber-600" />}
        iconClassName="bg-amber-50"
        badgeClassName="bg-amber-50 text-amber-700"
      />
      <StatCard
        label="BAIXADAS"
        value={summary.baixadas}
        badge={summary.baixadas > 0 ? "Atenção" : "Nenhuma"}
        icon={<Archive className="size-5 text-rose-700" />}
        iconClassName="bg-rose-50"
        badgeClassName="bg-rose-50 text-rose-700"
      />
      <StatCard
        label="INAPTOS"
        value={summary.inaptos}
        badge={summary.inaptos > 0 ? "Crítico" : "Nenhum"}
        icon={<XCircle className="size-5 text-red-600" />}
        iconClassName="bg-red-50"
        badgeClassName="bg-red-50 text-red-700"
      />
      <StatCard
        label="SUSPENSAS"
        value={summary.suspensas}
        badge={summary.suspensas > 0 ? "Atenção" : "Nenhuma"}
        icon={<PauseCircle className="size-5 text-orange-600" />}
        iconClassName="bg-orange-50"
        badgeClassName="bg-orange-50 text-orange-700"
      />
      <StatCard
        label="ERROS"
        value={summary.erros}
        badge={summary.erros > 0 ? "Revisar" : "Nenhum"}
        icon={<AlertCircle className="size-5 text-red-600" />}
        iconClassName="bg-red-50"
        badgeClassName="bg-red-50 text-red-700"
      />
    </div>
  );
}
