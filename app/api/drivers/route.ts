import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createDriverSchema } from "@/lib/validators/driver";
import { sendEmail, APP_URL } from "@/lib/resend";
import WelcomeDriverEmail from "@/emails/welcome-driver";
import React from "react";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const isActive = searchParams.get("isActive");

  const filter: Record<string, unknown> = { role: "driver" };
  if (isActive !== null) filter.isActive = isActive === "true";

  const drivers = await User.find(filter)
    .select("-passwordHash -verificationToken -resetToken")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ drivers });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createDriverSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  await connectDB();

  const existing = await User.findOne({ email: parsed.data.email });
  if (existing) {
    return NextResponse.json(
      { error: "Email already in use." },
      { status: 409 }
    );
  }

  const tempPassword = crypto.randomBytes(8).toString("hex");
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const driver = await User.create({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
    role: "driver",
    isVerified: true,
    isActive: true,
    phone: parsed.data.phone,
    licenseNumber: parsed.data.licenseNumber,
    vehicleInfo: parsed.data.vehicleInfo,
  });

  await sendEmail({
    to: driver.email,
    subject: "Welcome to SwiftHaul — Your Driver Account",
    template: React.createElement(WelcomeDriverEmail, {
      name: driver.name,
      email: driver.email,
      tempPassword,
      loginUrl: `${APP_URL}/login`,
    }),
  });

  const { passwordHash: _, ...driverData } = driver.toObject();
  return NextResponse.json({ driver: driverData }, { status: 201 });
}
