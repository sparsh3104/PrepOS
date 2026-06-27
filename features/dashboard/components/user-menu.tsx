"use client";

import { ChevronDown, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { signOut } from "@/services/auth.service";

interface UserMenuProps {
  email: string;
}

export function UserMenu({ email }: UserMenuProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const emailLabel = email || "No email available";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    setError(null);
    setSigningOut(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const result = await signOut(supabase);

      if (!result.success) {
        setError(result.error ?? result.message);
        setSigningOut(false);
        return;
      }

      window.location.assign("/login");
    } catch {
      setError("Unable to sign out. Please try again.");
      setSigningOut(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <Button type="button" variant="outline" className="gap-2" onClick={() => setIsOpen((prev) => !prev)}>
        <UserRound className="h-4 w-4" />
        <span className="hidden sm:inline">Account</span>
        <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen ? (
        <div className="absolute right-0 z-40 mt-2 w-64 rounded-lg border bg-popover p-2 shadow-card">
          <div className="border-b px-2 py-2">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Signed in as</p>
            <p className="truncate text-sm font-medium">{emailLabel}</p>
          </div>

          <nav className="py-2">
            <div
              aria-disabled="true"
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-muted-foreground/60"
            >
              <span>Profile</span>
              <span className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em]">
                Soon
              </span>
            </div>
            <div
              aria-disabled="true"
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-muted-foreground/60"
            >
              <span>Settings</span>
              <span className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em]">
                Soon
              </span>
            </div>
          </nav>

          <div className="border-t pt-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              Sign out
            </Button>
            {error ? <p className="px-2 text-xs text-destructive">{error}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
