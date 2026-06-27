import { redirect } from "next/navigation";

import { PlannerPage } from "@/features/planner/components/planner-page";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { hasSupabaseEnv } from "@/lib/env";
import { requireAuthenticatedUser } from "@/lib/auth/guard";

export default async function PlannerRoutePage() {
  if (!hasSupabaseEnv) {
    redirect("/login");
  }

  const user = await requireAuthenticatedUser();

  return (
    <DashboardShell userEmail={user.email ?? ""}>
      <PlannerPage />
    </DashboardShell>
  );
}
