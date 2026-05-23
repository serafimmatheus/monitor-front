import type { VariantProps } from "class-variance-authority";
import type { badgeVariants } from "@/components/ui/badge";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  ATIVA: "default",
  BAIXADA: "secondary",
  SUSPENSA: "outline",
  INAPTA: "outline",
  PENDENTE: "secondary",
  ERRO: "destructive",
};

export function mapStatusVariant(status: string): BadgeVariant {
  return STATUS_VARIANTS[status] ?? "outline";
}
