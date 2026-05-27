import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NewShipmentWizard } from "@/components/shipments/new-shipment-wizard";

export default async function NewShipmentPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") redirect("/login");

  return (
    <DashboardShell
      role="customer"
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Shipment</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details below to schedule your delivery.
        </p>
      </div>
      <NewShipmentWizard />
    </DashboardShell>
  );
}
