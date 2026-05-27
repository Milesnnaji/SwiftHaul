import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Plus, Package } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { ShipmentStatus } from "@/models/Shipment";

export default async function CustomerShipmentsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") redirect("/login");

  await connectDB();

  const shipments = await Shipment.find({ customerId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return (
    <DashboardShell
      role="customer"
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Shipments</h1>
          <p className="text-muted-foreground mt-1">
            {shipments.length} shipment{shipments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/shipments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {shipments.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium mb-1">No shipments yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first shipment to get started.
              </p>
              <Button asChild size="sm">
                <Link href="/shipments/new">Create Shipment</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((s) => (
                  <TableRow
                    key={s._id.toString()}
                    className="cursor-pointer"
                    onClick={() => {}}
                  >
                    <TableCell>
                      <Link
                        href={`/shipments/${s._id.toString()}`}
                        className="font-mono font-semibold text-primary hover:underline text-sm"
                      >
                        {s.trackingId}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{s.recipientDetails.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.recipientDetails.city}, {s.recipientDetails.country}
                      </p>
                    </TableCell>
                    <TableCell className="capitalize text-sm">{s.zone}</TableCell>
                    <TableCell>
                      <StatusBadge status={s.status as ShipmentStatus} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateShort(s.createdAt)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold">
                      ₦{(s.pricing.total / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
