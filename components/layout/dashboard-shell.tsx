import { Sidebar } from "@/components/layout/sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  role: string;
  userName: string;
  userEmail: string;
}

export function DashboardShell({
  children,
  role,
  userName,
  userEmail,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} userName={userName} userEmail={userEmail} />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl py-8 px-4 md:px-8">{children}</div>
      </main>
    </div>
  );
}
