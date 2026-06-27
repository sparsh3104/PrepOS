import { redirect } from "next/navigation";

import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { hasSupabaseEnv } from "@/lib/env";
import { requireAuthenticatedUser } from "@/lib/auth/guard";

export default async function DashboardPage() {
  if (!hasSupabaseEnv) {
    redirect("/login");
  }

  const user = await requireAuthenticatedUser();

  return (
    <DashboardShell userEmail={user.email ?? ""}>
      <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="mt-2 text-sm text-muted-foreground">Empty state. Layout shell is ready.</p>
        </div>
      </section>
    </DashboardShell>
  );
}
