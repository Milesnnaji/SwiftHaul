"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { ShipmentStatus } from "@/models/Shipment";

interface Driver {
  _id: string;
  name: string;
}

interface Shipment {
  _id: string;
  trackingId: string;
  status: string;
  zone: string;
  createdAt: string;
  customerId: { name?: string; email?: string } | string;
  driverId?: { name?: string } | string | null;
  recipientDetails: { name: string; city: string; country: string };
  pricing: { total: number };
  paymentStatus: string;
}

interface Props {
  shipments: Shipment[];
  drivers: Driver[];
}

export function AdminShipmentsTable({ shipments, drivers }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = shipments.filter((s) => {
    const matchesSearch =
      s.trackingId.includes(search.toUpperCase()) ||
      (typeof s.customerId === "object" && s.customerId?.name?.toLowerCase().includes(search.toLowerCase())) ||
      s.recipientDetails.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function assignDriver(shipmentId: string, driverId: string) {
    const res = await fetch(`/api/shipments/${shipmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driverId }),
    });

    if (!res.ok) {
      toast.error("Failed to assign driver.");
      return;
    }

    toast.success("Driver assigned.");
    startTransition(() => router.refresh());
  }

  async function updateStatus(shipmentId: string, status: string) {
    const res = await fetch(`/api/shipments/${shipmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      toast.error("Failed to update status.");
      return;
    }

    toast.success("Status updated.");
    startTransition(() => router.refresh());
  }

  function exportCSV() {
    const url = `/api/shipments/export?status=${statusFilter}`;
    window.open(url, "_blank");
  }

  const customerName = (s: Shipment) =>
    typeof s.customerId === "object" ? (s.customerId?.name ?? "—") : "—";
  const driverName = (s: Shipment) =>
    s.driverId
      ? typeof s.driverId === "object"
        ? (s.driverId as { name?: string })?.name ?? "—"
        : "—"
      : "Unassigned";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tracking ID, customer or recipient..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="picked_up">Picked Up</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s._id}>
                  <TableCell className="font-mono text-xs font-semibold">
                    {s.trackingId}
                  </TableCell>
                  <TableCell className="text-sm">{customerName(s)}</TableCell>
                  <TableCell>
                    <p className="text-sm">{s.recipientDetails.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.recipientDetails.city}
                    </p>
                  </TableCell>
                  <TableCell className="capitalize text-sm">{s.zone}</TableCell>
                  <TableCell>
                    <StatusBadge status={s.status as ShipmentStatus} />
                  </TableCell>
                  <TableCell className="text-sm">
                    <Select
                      defaultValue={
                        s.driverId
                          ? typeof s.driverId === "object"
                            ? (s.driverId as { _id?: string })._id
                            : (s.driverId as string)
                          : "__none"
                      }
                      onValueChange={(v) => assignDriver(s._id, v)}
                    >
                      <SelectTrigger className="h-8 w-36 text-xs">
                        <SelectValue placeholder="Assign driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none" disabled>
                          Unassigned
                        </SelectItem>
                        {drivers.map((d) => (
                          <SelectItem key={d._id} value={d._id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm font-semibold">
                    ₦{(s.pricing.total / 100).toLocaleString("en-NG", { minimumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateShort(s.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={s.status}
                      onValueChange={(v) => updateStatus(s._id, v)}
                    >
                      <SelectTrigger className="h-8 w-36 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "pending",
                          "picked_up",
                          "in_transit",
                          "out_for_delivery",
                          "delivered",
                          "failed",
                        ].map((st) => (
                          <SelectItem key={st} value={st} className="capitalize text-xs">
                            {st.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No shipments found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
