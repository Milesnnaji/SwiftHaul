import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminUsersTable } from "@/components/admin/users-table";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  await connectDB();

  const users = await User.find({ role: { $ne: "admin" } })
    .select("-passwordHash -verificationToken -resetToken")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return (
    <DashboardShell
      role="admin"
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage all customer and driver accounts.
        </p>
      </div>
      <AdminUsersTable users={JSON.parse(JSON.stringify(users))} />
    </DashboardShell>
  );
}
