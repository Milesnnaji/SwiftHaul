import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  const { trackingId } = await params;
  await connectDB();

  const shipment = await Shipment.findOne({
    trackingId: trackingId.toUpperCase(),
  })
    .select(
      "trackingId status timeline senderDetails.city senderDetails.country recipientDetails.city recipientDetails.country packageInfo.category packageInfo.weightKg zone createdAt updatedAt proofOfDeliveryUrl"
    )
    .lean();

  if (!shipment) {
    return NextResponse.json({ error: "Tracking ID not found." }, { status: 404 });
  }

  return NextResponse.json({ shipment });
}
