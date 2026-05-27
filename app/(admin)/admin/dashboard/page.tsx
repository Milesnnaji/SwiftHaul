import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import User from "@/models/User";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Package,
  Users,
  Truck,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { ShipmentStatus } from "@/models/Shipment";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  await connectDB();

  const [
    totalShipments,
    totalCustomers,
    totalDrivers,
    revenueAgg,
    recentShipments,
    pendingCount,
    deliveredCount,
  ] = await Promise.all([
    Shipment.countDocuments(),
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "driver", isActive: true }),
    Shipment.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$pricing.total" } } },
    ]),
    Shipment.find()
      .populate("customerId", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Shipment.countDocuments({
      status: { $in: ["pending", "picked_up", "in_transit", "out_for_delivery"] },
    }),
    Shipment.countDocuments({ status: "delivered" }),
  ]);

  const totalRevenue = revenueAgg[0]?.total ?? 0;

  const stats = [
    {
      label: "Total Shipments",
      value: totalShipments,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Active Shipments",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
    },
    {
      label: "Delivered",
      value: deliveredCount,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      label: "Customers",
      value: totalCustomers,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      label: "Active Drivers",
      value: totalDrivers,
      icon: Truck,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      label: "Total Revenue",
      value: `₦${(totalRevenue / 100).toLocaleString("en-NG", { minimumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
  ];

  return (
    <DashboardShell
      role="admin"
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and key metrics.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
            <Link href="/admin/shipments">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentShipments.map((s) => {
              const customer = s.customerId as { name?: string } | null;
              return (
                <Link
                  key={s._id.toString()}
                  href={`/admin/shipments`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-mono text-sm font-semibold">{s.trackingId}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {customer?.name} → {s.recipientDetails.city} •{" "}
                      {formatDateShort(s.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={s.status as ShipmentStatus} />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
