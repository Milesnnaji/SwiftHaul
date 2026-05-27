import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadProofOfDelivery } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "driver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const trackingId = formData.get("trackingId") as string | null;

  if (!file || !trackingId) {
    return NextResponse.json(
      { error: "File and tracking ID required." },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are allowed." },
      { status: 400 }
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File size must be under 5MB." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadProofOfDelivery(buffer, trackingId);

  return NextResponse.json({ url });
}
