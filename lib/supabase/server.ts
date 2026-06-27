import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

interface CreateSupabaseServerClientOptions {
  sessionOnly?: boolean;
}

export async function createSupabaseServerClient(options?: CreateSupabaseServerClientOptions) {
  const cookieStore = await cookies();
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options: cookieOptions }) => {
        if (options?.sessionOnly) {
          cookieStore.set(name, value, {
            ...cookieOptions,
            maxAge: undefined,
            expires: undefined,
          });
          return;
        }

        cookieStore.set(name, value, cookieOptions);
      });
    },
  };

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: cookieMethods,
  });
}
