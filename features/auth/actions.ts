"use server";

import type { Provider } from "@supabase/supabase-js";
import { headers } from "next/headers";

import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  SignupFormValues,
} from "@/features/auth/schemas";
import { forgotPasswordSchema, loginSchema, signupSchema } from "@/features/auth/schemas";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  sendResetPassword,
  signInWithEmail,
  signOut,
  signUpWithEmail,
  startOAuthSignIn,
} from "@/services/auth.service";

interface ActionResult {
  success: boolean;
  message: string;
}

interface OAuthActionResult extends ActionResult {
  url?: string;
}

async function getBaseUrl() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function envMissingResult(): ActionResult {
  return {
    success: false,
    message: "Supabase environment variables are missing. Configure .env.local first.",
  };
}

export async function loginWithEmailAction(input: LoginFormValues): Promise<ActionResult> {
  if (!hasSupabaseEnv) {
    return envMissingResult();
  }

  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid login details.",
    };
  }

  const supabase = await createSupabaseServerClient({ sessionOnly: !parsed.data.rememberMe });
  const result = await signInWithEmail(supabase, parsed.data.email, parsed.data.password);

  return {
    success: result.success,
    message: result.success ? "Signed in successfully." : result.error ?? result.message,
  };
}

export async function signupWithEmailAction(input: SignupFormValues): Promise<ActionResult> {
  if (!hasSupabaseEnv) {
    return envMissingResult();
  }

  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid signup details.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const baseUrl = await getBaseUrl();
  const result = await signUpWithEmail(
    supabase,
    parsed.data.email,
    parsed.data.password,
    `${baseUrl}/auth/callback?next=/dashboard`,
  );

  return {
    success: result.success,
    message: result.success ? result.message : result.error ?? result.message,
  };
}

export async function forgotPasswordAction(
  input: ForgotPasswordFormValues,
): Promise<ActionResult> {
  if (!hasSupabaseEnv) {
    return envMissingResult();
  }

  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid email address.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const baseUrl = await getBaseUrl();
  const result = await sendResetPassword(
    supabase,
    parsed.data.email,
    `${baseUrl}/auth/callback?next=/login`,
  );

  return {
    success: result.success,
    message: result.success ? "Password reset link sent. Check your inbox." : result.error ?? result.message,
  };
}

export async function signInWithOAuthAction(
  provider: Extract<Provider, "google" | "github">,
): Promise<OAuthActionResult> {
  if (!hasSupabaseEnv) {
    return envMissingResult();
  }

  const supabase = await createSupabaseServerClient();
  const baseUrl = await getBaseUrl();
  const result = await startOAuthSignIn(supabase, provider, `${baseUrl}/auth/callback?next=/dashboard`);

  return {
    success: result.success,
    message: result.success ? result.message : result.error ?? result.message,
    url: result.data?.url,
  };
}

export async function signOutAction(): Promise<ActionResult> {
  if (!hasSupabaseEnv) {
    return {
      success: true,
      message: "Signed out.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const result = await signOut(supabase);

  return {
    success: result.success,
    message: result.success ? result.message : result.error ?? result.message,
  };
}
