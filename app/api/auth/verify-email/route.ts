import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyEmailSchema } from "@/lib/validators/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = verifyEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid token." }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({
    verificationToken: parsed.data.token,
    verificationTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired verification link." },
      { status: 400 }
    );
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  return NextResponse.json({ message: "Email verified successfully." });
}
