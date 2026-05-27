import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import User from "@/models/User";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminShipmentsTable } from "@/components/admin/shipments-table";

export default async function AdminShipmentsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  await connectDB();

  const [shipments, drivers] = await Promise.all([
    Shipment.find()
      .populate("customerId", "name email")
      .populate("driverId", "name")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean(),
    User.find({ role: "driver", isActive: true })
      .select("name _id")
      .lean(),
  ]);

  return (
    <DashboardShell
      role="admin"
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Shipments</h1>
        <p className="text-muted-foreground mt-1">
          Manage all shipments, assign drivers, and update statuses.
        </p>
      </div>
      <AdminShipmentsTable
        shipments={JSON.parse(JSON.stringify(shipments))}
        drivers={JSON.parse(JSON.stringify(drivers))}
      />
    </DashboardShell>
  );
}
