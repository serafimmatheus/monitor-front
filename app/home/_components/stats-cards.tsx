"use client";

import { CheckCircle2, MoreHorizontal, XCircle } from "lucide-react";
import type { Client } from "../_api/clients.api";

type StatsCardsProps = {
  clients: Client[];
};

function countByStatus(clients: Client[]) {
  const cnpjClients = clients.filter((c) => c.documentType === "CNPJ");

  return {
    ativos: cnpjClients.filter((c) => c.status === "ATIVA").length,
    pendentes: cnpjClients.filter(
      (c) => c.status === "PENDENTE" || c.status === "ERRO",
    ).length,
    inaptos: cnpjClients.filter((c) =>
      ["INAPTA", "BAIXADA", "SUSPENSA"].includes(c.status),
    ).length,
  };
}

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

export function StatsCards({ clients }: StatsCardsProps) {
  const stats = countByStatus(clients);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="ATIVOS"
        value={stats.ativos}
        badge="+12% hoje"
        icon={<CheckCircle2 className="size-5 text-emerald-600" />}
        iconClassName="bg-emerald-50"
        badgeClassName="bg-emerald-50 text-emerald-700"
      />
      <StatCard
        label="PENDENTES"
        value={stats.pendentes}
        badge={`${stats.pendentes} aguardando`}
        icon={<MoreHorizontal className="size-5 text-amber-600" />}
        iconClassName="bg-amber-50"
        badgeClassName="bg-amber-50 text-amber-700"
      />
      <StatCard
        label="INAPTOS"
        value={stats.inaptos}
        badge="Crítico"
        icon={<XCircle className="size-5 text-red-600" />}
        iconClassName="bg-red-50"
        badgeClassName="bg-red-50 text-red-700"
      />
    </div>
  );
}
