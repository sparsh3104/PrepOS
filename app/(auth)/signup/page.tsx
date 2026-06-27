import { redirect } from "next/navigation";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { SignupForm } from "@/features/auth/components/signup-form";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SignupPage() {
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
      title="Create Your Account"
      description="Build your PrepOS workspace in minutes."
      footerLabel="Already have an account?"
      footerHref="/login"
      footerCta="Sign in"
    >
      <SignupForm />
    </AuthShell>
  );
}
