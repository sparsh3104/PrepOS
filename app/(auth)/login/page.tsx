import { redirect } from "next/navigation";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  if (hasSupabaseEnv) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <AuthShell
      title="Welcome Back"
      description="Sign in to continue your preparation journey."
      footerLabel="New to PrepOS?"
      footerHref="/signup"
      footerCta="Create account"
    >
      <LoginForm />
    </AuthShell>
  );
}
