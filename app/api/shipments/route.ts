import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import Notification from "@/models/Notification";
import { createShipmentSchema } from "@/lib/validators/shipment";
import { calculatePricing } from "@/lib/pricing";
import { generateTrackingId } from "@/lib/tracking";
import { sendEmail, APP_URL } from "@/lib/resend";
import ShipmentConfirmedEmail from "@/emails/shipment-confirmed";
import { renderToBuffer } from "@react-pdf/renderer";
import { ShipmentReceipt } from "@/lib/pdf/receipt";
import React from "react";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const status = searchParams.get("status");
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (session.user.role === "customer") {
    filter.customerId = session.user.id;
  } else if (session.user.role === "driver") {
    filter.driverId = session.user.id;
  }

  if (status && status !== "all") filter.status = status;

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) (filter.createdAt as Record<string, unknown>).$gte = new Date(dateFrom);
    if (dateTo) (filter.createdAt as Record<string, unknown>).$lte = new Date(dateTo);
  }

  const [shipments, total] = await Promise.all([
    Shipment.find(filter)
      .populate("customerId", "name email")
      .populate("driverId", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Shipment.countDocuments(filter),
  ]);

  return NextResponse.json({
    shipments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createShipmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message, details: parsed.error.errors },
      { status: 400 }
    );
  }

  const { senderDetails, recipientDetails, packageInfo, zone, paymentRef } = parsed.data;

  await connectDB();

  const pricing = calculatePricing({
    weightKg: packageInfo.weightKg,
    zone,
    category: packageInfo.category,
  });

  const trackingId = generateTrackingId();

  const shipment = await Shipment.create({
    trackingId,
    customerId: session.user.id,
    status: "pending",
    senderDetails,
    recipientDetails,
    packageInfo,
    zone,
    pricing,
    paymentStatus: "pending",
    paymentRef,
    timeline: [
      {
        status: "pending",
        note: "Shipment created, awaiting payment confirmation",
        timestamp: new Date(),
      },
    ],
  });

  await Notification.create({
    userId: session.user.id,
    type: "shipment_created",
    title: "Shipment Created",
    message: `Your shipment ${trackingId} has been created successfully.`,
    metadata: { trackingId, shipmentId: shipment._id.toString() },
  });

  // Generate receipt PDF
  let pdfBuffer: Buffer | undefined;
  try {
    pdfBuffer = await renderToBuffer(
      React.createElement(ShipmentReceipt, {
        trackingId,
        createdAt: shipment.createdAt.toISOString(),
        customerName: session.user.name ?? "Customer",
        customerEmail: session.user.email ?? "",
        senderDetails,
        recipientDetails,
        packageInfo,
        zone,
        pricing,
        paymentRef,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any
    );
  } catch {
    // PDF generation failure shouldn't block shipment creation
  }

  const attachments = pdfBuffer
    ? [{ filename: `receipt-${trackingId}.pdf`, content: pdfBuffer }]
    : [];

  await sendEmail({
    to: session.user.email!,
    subject: `Shipment Confirmed — ${trackingId}`,
    template: React.createElement(ShipmentConfirmedEmail, {
      customerName: session.user.name ?? "Customer",
      trackingId,
      recipientName: recipientDetails.name,
      recipientCity: recipientDetails.city,
      recipientCountry: recipientDetails.country,
      packageCategory: packageInfo.category,
      weightKg: packageInfo.weightKg,
      totalAmount: `₦${(pricing.total / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
      zone,
      trackingUrl: `${APP_URL}/track?id=${trackingId}`,
    }),
    attachments,
  });

  return NextResponse.json({ shipment, trackingId }, { status: 201 });
}
