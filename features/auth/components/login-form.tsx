"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginFormValues, loginSchema } from "@/features/auth/schemas";
import { OAuthButtons } from "@/features/auth/components/oauth-buttons";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { signInWithEmail } from "@/services/auth.service";

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setServerError(null);

    if (!hasSupabaseEnv) {
      setServerError(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.",
      );
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const result = await signInWithEmail(supabase, values.email, values.password);

        if (!result.success) {
          setServerError(result.error ?? result.message);
          return;
        }

        window.location.assign("/dashboard");
      } catch {
        setServerError("Unable to complete sign in. Please try again.");
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
          {form.formState.errors.password ? (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input bg-background"
            {...form.register("rememberMe")}
          />
          Remember me on this device
        </label>

        {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

        <Button type="submit" className="w-full" disabled={isPending || !hasSupabaseEnv}>
          {isPending ? "Signing in..." : "Sign in"}
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
