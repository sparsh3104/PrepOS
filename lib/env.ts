function isNonEmpty(value: string | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

export const hasSupabaseEnv =
  isNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  isNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const hasSupabaseServiceRoleEnv = isNonEmpty(process.env.SUPABASE_SERVICE_ROLE_KEY);

export function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isNonEmpty(supabaseUrl) || !isNonEmpty(supabaseAnonKey)) {
    throw new Error(
      "Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function getSupabaseServiceRoleEnv() {
  const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseEnv();

  if (!isNonEmpty(supabaseServiceRoleKey)) {
    throw new Error(
      "Supabase service role environment variable is missing. Set SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
  };
}
