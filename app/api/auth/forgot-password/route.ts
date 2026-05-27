import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { sendEmail, APP_URL } from "@/lib/resend";
import PasswordResetEmail from "@/emails/password-reset";
import { rateLimit } from "@/lib/rate-limiter";
import React from "react";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(`forgot-pw:${ip}`);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email: parsed.data.email });

  // Always return success to prevent email enumeration
  if (!user) {
    return NextResponse.json({
      message: "If an account exists, a reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;
  await user.save();

  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your SwiftHaul password",
    template: React.createElement(PasswordResetEmail, {
      name: user.name,
      resetUrl,
    }),
  });

  return NextResponse.json({
    message: "If an account exists, a reset link has been sent.",
  });
}
