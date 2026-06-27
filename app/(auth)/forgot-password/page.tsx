import { redirect } from "next/navigation";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ForgotPasswordPage() {
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
      title="Reset Password"
      description="We will send a secure reset link to your inbox."
      footerLabel="Remembered your password?"
      footerHref="/login"
      footerCta="Back to sign in"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
