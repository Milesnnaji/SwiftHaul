import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  return (
    <DashboardShell
      role="admin"
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Platform performance and delivery metrics.
        </p>
      </div>
      <AnalyticsDashboard />
    </DashboardShell>
  );
}
