import crypto from "crypto";

export function generateTrackingId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  const randomBytes = crypto.randomBytes(5);
  for (let i = 0; i < 5; i++) {
    suffix += chars[randomBytes[i] % chars.length];
  }
  return `SH-${year}${month}${day}-${suffix}`;
}
