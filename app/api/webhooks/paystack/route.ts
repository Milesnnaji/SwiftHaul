import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const { reference, metadata } = event.data;

    await connectDB();

    if (metadata?.shipmentId) {
      await Shipment.findByIdAndUpdate(metadata.shipmentId, {
        $set: {
          paymentStatus: "paid",
          paymentRef: reference,
        },
      });
    } else {
      await Shipment.findOneAndUpdate(
        { paymentRef: reference },
        { $set: { paymentStatus: "paid" } }
      );
    }
  }

  return NextResponse.json({ received: true });
}
