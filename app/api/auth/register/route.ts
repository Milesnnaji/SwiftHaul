import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validators/auth";
import { sendEmail, APP_URL } from "@/lib/resend";
import VerificationEmail from "@/emails/verification";
import { rateLimit } from "@/lib/rate-limiter";
import React from "react";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(`register:${ip}`);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: "customer",
    isVerified: false,
    verificationToken,
    verificationTokenExpiry,
  });

  const verificationUrl = `${APP_URL}/verify-email?token=${verificationToken}`;

  await sendEmail({
    to: email,
    subject: "Verify your SwiftHaul account",
    template: React.createElement(VerificationEmail, { name, verificationUrl }),
  });

  return NextResponse.json(
    {
      message: "Account created. Please check your email to verify your account.",
      userId: user._id.toString(),
    },
    { status: 201 }
  );
}
