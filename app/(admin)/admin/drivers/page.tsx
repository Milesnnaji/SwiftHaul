import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminDriversPanel } from "@/components/admin/drivers-panel";

export default async function AdminDriversPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  await connectDB();

  const drivers = await User.find({ role: "driver" })
    .select("-passwordHash -verificationToken -resetToken")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <DashboardShell
      role="admin"
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Drivers</h1>
        <p className="text-muted-foreground mt-1">
          Manage driver accounts and assignments.
        </p>
      </div>
      <AdminDriversPanel drivers={JSON.parse(JSON.stringify(drivers))} />
    </DashboardShell>
  );
}
