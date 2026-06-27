import { redirect } from "next/navigation";

import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { KnowledgeBasePage } from "@/features/knowledge-base/components/knowledge-base-page";
import { requireAuthenticatedUser } from "@/lib/auth/guard";
import { hasSupabaseEnv } from "@/lib/env";

export default async function KnowledgeBaseRoutePage() {
  if (!hasSupabaseEnv) {
    redirect("/login");
  }

  const user = await requireAuthenticatedUser();

  return (
    <DashboardShell userEmail={user.email ?? ""}>
      <KnowledgeBasePage />
    </DashboardShell>
  );
}
