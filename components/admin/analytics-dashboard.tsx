"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS: Record<string, string> = {
  pending: "#eab308",
  picked_up: "#3b82f6",
  in_transit: "#a855f7",
  out_for_delivery: "#f97316",
  delivered: "#22c55e",
  failed: "#ef4444",
};

const ZONE_COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b"];

interface AnalyticsData {
  overview: {
    totalShipments: number;
    deliveredShipments: number;
    pendingShipments: number;
    totalCustomers: number;
    totalDrivers: number;
    totalRevenue: number;
  };
  statusBreakdown: { _id: string; count: number }[];
  zoneBreakdown: { _id: string; count: number }[];
  last7Days: { _id: string; count: number; revenue: number }[];
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return <p className="text-muted-foreground">Failed to load analytics.</p>;

  const statusData = data.statusBreakdown.map((s) => ({
    name: s._id.replace(/_/g, " "),
    value: s.count,
    fill: STATUS_COLORS[s._id] ?? "#94a3b8",
  }));

  const zoneData = data.zoneBreakdown.map((z, i) => ({
    name: z._id,
    count: z.count,
    fill: ZONE_COLORS[i] ?? "#94a3b8",
  }));

  const dailyData = data.last7Days.map((d) => ({
    date: d._id.slice(5),
    shipments: d.count,
    revenue: Math.round(d.revenue / 100),
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Shipments", value: data.overview.totalShipments },
          { label: "Delivered", value: data.overview.deliveredShipments },
          { label: "In Progress", value: data.overview.pendingShipments },
          { label: "Customers", value: data.overview.totalCustomers },
          { label: "Active Drivers", value: data.overview.totalDrivers },
          {
            label: "Revenue (₦)",
            value: `${(data.overview.totalRevenue / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`,
          },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last 7 Days – Shipment Volume */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shipments — Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="shipments" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Last 7 Days – Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue — Last 7 Days (₦)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`₦${Number(v).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Breakdown – Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deliveries by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Zone Breakdown – Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shipments by Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={zoneData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} className="capitalize" />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {zoneData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
