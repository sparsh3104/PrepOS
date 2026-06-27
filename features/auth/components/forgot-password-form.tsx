"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordAction } from "@/features/auth/actions";
import { type ForgotPasswordFormValues, forgotPasswordSchema } from "@/features/auth/schemas";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    setMessage(null);
    setServerError(null);

    startTransition(async () => {
      const result = await forgotPasswordAction(values);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      setMessage(result.message);
    });
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
      {message ? <p className="text-sm text-emerald-500">{message}</p> : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Sending reset link..." : "Send reset link"}
      </Button>
    </form>
  );
}
