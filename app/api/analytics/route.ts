import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const [
    totalShipments,
    deliveredShipments,
    pendingShipments,
    totalCustomers,
    totalDrivers,
    revenueAgg,
    statusBreakdown,
    zoneBreakdown,
    last7Days,
  ] = await Promise.all([
    Shipment.countDocuments(),
    Shipment.countDocuments({ status: "delivered" }),
    Shipment.countDocuments({ status: { $in: ["pending", "picked_up", "in_transit", "out_for_delivery"] } }),
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "driver", isActive: true }),
    Shipment.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$pricing.total" } } },
    ]),
    Shipment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Shipment.aggregate([
      { $group: { _id: "$zone", count: { $sum: 1 } } },
    ]),
    Shipment.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: "$pricing.total" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const totalRevenue = revenueAgg[0]?.total ?? 0;

  return NextResponse.json({
    overview: {
      totalShipments,
      deliveredShipments,
      pendingShipments,
      totalCustomers,
      totalDrivers,
      totalRevenue,
    },
    statusBreakdown,
    zoneBreakdown,
    last7Days,
  });
}
