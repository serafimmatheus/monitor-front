import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  ATIVA: {
    label: "ATIVO",
    className: "bg-emerald-50 text-emerald-700",
  },
  PENDENTE: {
    label: "PENDENTE",
    className: "bg-amber-50 text-amber-700",
  },
  INAPTA: {
    label: "INAPTO",
    className: "bg-red-50 text-red-700",
  },
  BAIXADA: {
    label: "BAIXADA",
    className: "bg-red-50 text-red-700",
  },
  SUSPENSA: {
    label: "SUSPENSA",
    className: "bg-orange-50 text-orange-700",
  },
  ERRO: {
    label: "ERRO",
    className: "bg-red-50 text-red-700",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_STYLES[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
