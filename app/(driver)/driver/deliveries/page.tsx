import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import { DashboardShell } from "@/components/layout/dashboard-shell";
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
import { Package } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { ShipmentStatus } from "@/models/Shipment";

export default async function DriverDeliveriesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "driver") redirect("/login");

  await connectDB();

  const deliveries = await Shipment.find({ driverId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <DashboardShell
      role="driver"
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Deliveries</h1>
        <p className="text-muted-foreground mt-1">
          {deliveries.length} delivery assignment{deliveries.length !== 1 ? "s" : ""}
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {deliveries.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No deliveries assigned yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((d) => (
                  <TableRow key={d._id.toString()}>
                    <TableCell>
                      <Link
                        href={`/driver/deliveries/${d._id.toString()}`}
                        className="font-mono font-semibold text-primary hover:underline text-sm"
                      >
                        {d.trackingId}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{d.recipientDetails.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.recipientDetails.phone}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">{d.recipientDetails.city}</TableCell>
                    <TableCell>
                      <StatusBadge status={d.status as ShipmentStatus} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateShort(d.createdAt)}
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
