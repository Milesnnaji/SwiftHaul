import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Package, Clock, CheckCircle2, Truck } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { ShipmentStatus } from "@/models/Shipment";

export default async function DriverDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "driver") redirect("/login");

  await connectDB();

  const [allDeliveries, activeDeliveries] = await Promise.all([
    Shipment.find({ driverId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Shipment.countDocuments({
      driverId: session.user.id,
      status: { $in: ["picked_up", "in_transit", "out_for_delivery"] },
    }),
  ]);

  const totalDelivered = await Shipment.countDocuments({
    driverId: session.user.id,
    status: "delivered",
  });

  const stats = [
    {
      label: "Active Deliveries",
      value: activeDeliveries,
      icon: Truck,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Delivered",
      value: totalDelivered,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      label: "Total Assigned",
      value: allDeliveries.length,
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <DashboardShell
      role="driver"
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Welcome, {session.user.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your delivery overview.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} mb-3`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Assignments</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/driver/deliveries">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {allDeliveries.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No deliveries assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allDeliveries.map((s) => (
                <Link
                  key={s._id.toString()}
                  href={`/driver/deliveries/${s._id.toString()}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-mono text-sm font-semibold">{s.trackingId}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      To: {s.recipientDetails.name} •{" "}
                      {s.recipientDetails.city} • {formatDateShort(s.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={s.status as ShipmentStatus} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
