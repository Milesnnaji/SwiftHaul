import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import { formatDate } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const filter: Record<string, unknown> = {};
  if (status && status !== "all") filter.status = status;
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) (filter.createdAt as Record<string, unknown>).$gte = new Date(dateFrom);
    if (dateTo) (filter.createdAt as Record<string, unknown>).$lte = new Date(dateTo);
  }

  const shipments = await Shipment.find(filter)
    .populate("customerId", "name email")
    .populate("driverId", "name")
    .sort({ createdAt: -1 })
    .limit(5000)
    .lean();

  const headers = [
    "Tracking ID",
    "Status",
    "Customer",
    "Customer Email",
    "Sender City",
    "Recipient Name",
    "Recipient City",
    "Zone",
    "Weight (kg)",
    "Category",
    "Total (NGN)",
    "Payment Status",
    "Driver",
    "Created At",
  ];

  const rows = shipments.map((s) => {
    const customer = s.customerId as { name?: string; email?: string } | null;
    const driver = s.driverId as { name?: string } | null;
    return [
      s.trackingId,
      s.status,
      customer?.name ?? "",
      customer?.email ?? "",
      s.senderDetails.city,
      s.recipientDetails.name,
      s.recipientDetails.city,
      s.zone,
      s.packageInfo.weightKg,
      s.packageInfo.category,
      (s.pricing.total / 100).toFixed(2),
      s.paymentStatus,
      driver?.name ?? "Unassigned",
      formatDate(s.createdAt),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="shipments-${Date.now()}.csv"`,
    },
  });
}
