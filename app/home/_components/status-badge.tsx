import { Badge } from "@/components/ui/badge";
import { mapStatusVariant } from "../_utils/status-variant";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={mapStatusVariant(status)}>{status}</Badge>;
}
