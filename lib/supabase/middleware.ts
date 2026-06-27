import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  if (!hasSupabaseEnv) {
    return { response, user: null as null | { id: string } };
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet, headers) {
      cookiesToSet.forEach(({ name, value }) => {
        request.cookies.set(name, value);
      });

      response = NextResponse.next({
        request,
      });

      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });

      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    },
  };

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: cookieMethods,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
