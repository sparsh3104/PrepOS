import type { Provider, SupabaseClient } from "@supabase/supabase-js";

export interface ServiceResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  message: string;
}

export async function signInWithEmail(
  supabase: SupabaseClient,
  email: string,
  password: string,
): Promise<ServiceResult<null>> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      success: false,
      data: null,
      error: error.message,
      message: "Unable to sign in.",
    };
  }

  return {
    success: true,
    data: null,
    error: null,
    message: "Signed in successfully.",
  };
}

export async function signUpWithEmail(
  supabase: SupabaseClient,
  email: string,
  password: string,
  emailRedirectTo: string,
): Promise<ServiceResult<{ needsEmailVerification: boolean }>> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    return {
      success: false,
      data: null,
      error: error.message,
      message: "Unable to create your account.",
    };
  }

  return {
    success: true,
    data: { needsEmailVerification: !data.session },
    error: null,
    message: data.session
      ? "Account created and signed in."
      : "Account created. Please verify your email.",
  };
}

export async function sendResetPassword(
  supabase: SupabaseClient,
  email: string,
  redirectTo: string,
): Promise<ServiceResult<null>> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    return {
      success: false,
      data: null,
      error: error.message,
      message: "Unable to send reset email.",
    };
  }

  return {
    success: true,
    data: null,
    error: null,
    message: "Password reset email sent.",
  };
}

export async function startOAuthSignIn(
  supabase: SupabaseClient,
  provider: Provider,
  redirectTo: string,
): Promise<ServiceResult<{ url: string }>> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error || !data.url) {
    return {
      success: false,
      data: null,
      error: error?.message ?? "Unable to start OAuth flow.",
      message: "OAuth sign-in failed.",
    };
  }

  return {
    success: true,
    data: { url: data.url },
    error: null,
    message: "OAuth sign-in started.",
  };
}

export async function signOut(supabase: SupabaseClient): Promise<ServiceResult<null>> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      data: null,
      error: error.message,
      message: "Unable to sign out.",
    };
  }

  return {
    success: true,
    data: null,
    error: null,
    message: "Signed out successfully.",
  };
}
