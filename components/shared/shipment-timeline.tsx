"use client";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { ITimelineEntry } from "@/models/Shipment";
import {
  Clock,
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const STATUS_ICONS = {
  pending: Clock,
  picked_up: Package,
  in_transit: Truck,
  out_for_delivery: MapPin,
  delivered: CheckCircle2,
  failed: XCircle,
};

const STATUS_COLORS = {
  pending: "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30",
  picked_up: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
  in_transit: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
  out_for_delivery: "text-orange-500 bg-orange-50 dark:bg-orange-950/30",
  delivered: "text-green-500 bg-green-50 dark:bg-green-950/30",
  failed: "text-red-500 bg-red-50 dark:bg-red-950/30",
};

const STATUS_LABELS = {
  pending: "Pending",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  failed: "Failed",
};

interface ShipmentTimelineProps {
  timeline: ITimelineEntry[];
}

export function ShipmentTimeline({ timeline }: ShipmentTimelineProps) {
  return (
    <div className="space-y-0">
      {timeline.map((entry, index) => {
        const Icon = STATUS_ICONS[entry.status] ?? Clock;
        const isLast = index === timeline.length - 1;

        return (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  STATUS_COLORS[entry.status]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && (
                <div className="mt-1 w-px flex-1 bg-border min-h-[24px]" />
              )}
            </div>
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p className="font-semibold text-sm text-foreground">
                {STATUS_LABELS[entry.status] ?? entry.status}
              </p>
              {entry.note && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {entry.note}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(entry.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
