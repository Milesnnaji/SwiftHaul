import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import Notification from "@/models/Notification";
import User from "@/models/User";
import {
  updateShipmentStatusSchema,
  assignDriverSchema,
} from "@/lib/validators/shipment";
import { sendEmail, APP_URL } from "@/lib/resend";
import StatusUpdateEmail from "@/emails/status-update";
import DeliveryCompletedEmail from "@/emails/delivery-completed";
import React from "react";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const shipment = await Shipment.findById(id)
    .populate("customerId", "name email phone")
    .populate("driverId", "name email phone")
    .lean();

  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  }

  const customerId =
    (shipment.customerId as { _id: { toString: () => string } })._id?.toString() ??
    shipment.customerId?.toString();

  if (session.user.role === "customer" && customerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ shipment });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const shipment = await Shipment.findById(id).populate("customerId", "name email");

  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  }

  const body = await req.json();

  // Driver or admin: update status
  if (body.status) {
    if (session.user.role === "customer") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsed = updateShipmentStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { status, note } = parsed.data;

    if (
      session.user.role === "driver" &&
      shipment.driverId?.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    shipment.status = status;
    shipment.timeline.push({
      status,
      note,
      timestamp: new Date(),
      updatedBy: session.user.id as unknown as import("mongoose").Types.ObjectId,
    });

    await shipment.save();

    const customer = shipment.customerId as unknown as { name: string; email: string };
    const trackingUrl = `${APP_URL}/track?id=${shipment.trackingId}`;

    if (status === "delivered") {
      await sendEmail({
        to: customer.email,
        subject: `Your shipment ${shipment.trackingId} has been delivered!`,
        template: React.createElement(DeliveryCompletedEmail, {
          customerName: customer.name,
          trackingId: shipment.trackingId,
          recipientName: shipment.recipientDetails.name,
          deliveredAt: new Date().toLocaleDateString("en-NG"),
          proofOfDeliveryUrl: shipment.proofOfDeliveryUrl,
          trackingUrl,
        }),
      });
    } else {
      await sendEmail({
        to: customer.email,
        subject: `Shipment ${shipment.trackingId} status update`,
        template: React.createElement(StatusUpdateEmail, {
          customerName: customer.name,
          trackingId: shipment.trackingId,
          status,
          note,
          trackingUrl,
        }),
      });
    }

    await Notification.create({
      userId: shipment.customerId,
      type: "status_update",
      title: "Shipment Status Updated",
      message: `Your shipment ${shipment.trackingId} is now: ${status.replace(/_/g, " ")}.`,
      metadata: { trackingId: shipment.trackingId, status },
    });

    return NextResponse.json({ shipment });
  }

  // Admin: assign driver
  if (body.driverId !== undefined) {
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsed = assignDriverSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const driver = await User.findById(parsed.data.driverId);
    if (!driver || driver.role !== "driver") {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    shipment.driverId = driver._id;
    await shipment.save();

    return NextResponse.json({ shipment });
  }

  // Driver: upload proof of delivery
  if (body.proofOfDeliveryUrl) {
    if (session.user.role !== "driver" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    shipment.proofOfDeliveryUrl = body.proofOfDeliveryUrl;
    await shipment.save();

    return NextResponse.json({ shipment });
  }

  return NextResponse.json(
    { error: "No valid update fields provided" },
    { status: 400 }
  );
}
