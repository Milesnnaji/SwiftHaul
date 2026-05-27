import { Badge } from "@/components/ui/badge";
import type { ShipmentStatus } from "@/models/Shipment";

const STATUS_CONFIG: Record<
  ShipmentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "purple" }
> = {
  pending: { label: "Pending", variant: "warning" },
  picked_up: { label: "Picked Up", variant: "info" },
  in_transit: { label: "In Transit", variant: "purple" },
  out_for_delivery: { label: "Out for Delivery", variant: "default" },
  delivered: { label: "Delivered", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
};

interface StatusBadgeProps {
  status: ShipmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
