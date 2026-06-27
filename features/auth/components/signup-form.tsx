"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SignupFormValues, signupSchema } from "@/features/auth/schemas";
import { OAuthButtons } from "@/features/auth/components/oauth-buttons";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { signUpWithEmail } from "@/services/auth.service";

export function SignupForm() {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    setServerError(null);
    setServerMessage(null);

    if (!hasSupabaseEnv) {
      setServerError(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.",
      );
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const baseUrl = window.location.origin;
        const result = await signUpWithEmail(
          supabase,
          values.email,
          values.password,
          `${baseUrl}/auth/callback?next=/dashboard`,
        );

        if (!result.success) {
          setServerError(result.error ?? result.message);
          return;
        }

        setServerMessage(result.message);
        router.refresh();
      } catch {
        setServerError("Unable to complete sign up. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-5">
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
          {form.formState.errors.password ? (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Use 8+ characters with uppercase, lowercase, number, and special character.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword ? (
            <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
          ) : null}
        </div>

        {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
        {serverMessage ? <p className="text-sm text-emerald-500">{serverMessage}</p> : null}

        <Button type="submit" className="w-full" disabled={isPending || !hasSupabaseEnv}>
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">or continue with</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <OAuthButtons />
    </div>
  );
}
