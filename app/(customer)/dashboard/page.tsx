import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import Notification from "@/models/Notification";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import Link from "next/link";
import {
  Package,
  Plus,
  Clock,
  CheckCircle2,
  TrendingUp,
  Bell,
} from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { ShipmentStatus } from "@/models/Shipment";

export default async function CustomerDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") redirect("/login");

  await connectDB();

  const [recentShipments, statusCounts, unreadNotifs] = await Promise.all([
    Shipment.find({ customerId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Shipment.aggregate([
      { $match: { customerId: { $eq: session.user.id } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Notification.countDocuments({
      userId: session.user.id,
      isRead: false,
    }),
  ]);

  const total = statusCounts.reduce((sum, s) => sum + s.count, 0);
  const delivered = statusCounts.find((s) => s._id === "delivered")?.count ?? 0;
  const inProgress = statusCounts
    .filter((s) => ["pending", "picked_up", "in_transit", "out_for_delivery"].includes(s._id))
    .reduce((sum, s) => sum + s.count, 0);

  const stats = [
    {
      label: "Total Shipments",
      value: total,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
    },
    {
      label: "Delivered",
      value: delivered,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      label: "Unread Notifications",
      value: unreadNotifs,
      icon: Bell,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <DashboardShell
      role="customer"
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {session.user.name?.split(" ")[0]}!</h1>
          <p className="text-muted-foreground mt-1">
            Manage your shipments and track deliveries.
          </p>
        </div>
        <Button asChild>
          <Link href="/shipments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          <CardTitle className="text-base">Recent Shipments</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/shipments">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentShipments.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No shipments yet.</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/shipments/new">Create your first shipment</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentShipments.map((s) => (
                <Link
                  key={s._id.toString()}
                  href={`/shipments/${s._id.toString()}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-mono text-sm font-semibold">{s.trackingId}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      To: {s.recipientDetails.name} • {formatDateShort(s.createdAt)}
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
