import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@swifthaul.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@123456";
const ADMIN_NAME = "SwiftHaul Admin";

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const User = mongoose.models.User ?? (await import("../models/User")).default;

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    passwordHash,
    role: "admin",
    isVerified: true,
    isActive: true,
  });

  console.log(`✅ Admin account created: ${ADMIN_EMAIL}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
