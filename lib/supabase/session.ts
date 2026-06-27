import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAuthenticatedUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getRequiredUser() {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Authenticated user required.");
  }

  return user;
}
