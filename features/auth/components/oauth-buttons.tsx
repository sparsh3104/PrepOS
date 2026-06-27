"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { startOAuthSignIn } from "@/services/auth.service";

function GoogleGlyph() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.3 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3c-2.1 1.6-4.7 2.5-7.3 2.5-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.5 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.6-2.5 4.7-4.9 6.1l.1-.1 6.3 5.3C36.3 39.7 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function GithubGlyph() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function OAuthButtons() {
  const [error, setError] = useState<string | null>(null);
  const [pendingProvider, setPendingProvider] = useState<"google" | "github" | null>(null);
  const [isPending, startTransition] = useTransition();

  const startOAuth = (provider: "google" | "github") => {
    setError(null);
    setPendingProvider(provider);

    if (!hasSupabaseEnv) {
      setError(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.",
      );
      setPendingProvider(null);
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const baseUrl = window.location.origin;
        const result = await startOAuthSignIn(
          supabase,
          provider,
          `${baseUrl}/auth/callback?next=/dashboard`,
        );

        if (!result.success || !result.data?.url) {
          setError(result.error ?? result.message);
          setPendingProvider(null);
          return;
        }

        window.location.assign(result.data.url);
      } catch {
        setError("Unable to start OAuth sign in. Please try again.");
        setPendingProvider(null);
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => startOAuth("google")}
          disabled={isPending || !hasSupabaseEnv}
        >
          <GoogleGlyph />
          {pendingProvider === "google" ? "Connecting..." : "Google"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => startOAuth("github")}
          disabled={isPending || !hasSupabaseEnv}
        >
          <GithubGlyph />
          {pendingProvider === "github" ? "Connecting..." : "GitHub"}
        </Button>
      </div>
      {error ? <p className="text-center text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
