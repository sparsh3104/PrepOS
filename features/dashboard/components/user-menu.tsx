import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronDown, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions";

interface UserMenuProps {
  email: string;
}

export function UserMenu({ email }: UserMenuProps) {
  const emailLabel = email || "No email available";

  return (
    <details className="group relative">
      <summary className="list-none">
        <Button type="button" variant="outline" className="gap-2">
          <UserRound className="h-4 w-4" />
          <span className="hidden sm:inline">Account</span>
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        </Button>
      </summary>

      <div className="absolute right-0 z-40 mt-2 w-64 rounded-lg border bg-popover p-2 shadow-card">
        <div className="border-b px-2 py-2">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Signed in as</p>
          <p className="truncate text-sm font-medium">{emailLabel}</p>
        </div>

        <nav className="py-2">
          <Link className="block rounded-md px-2 py-2 text-sm hover:bg-accent" href="/profile">
            Profile
          </Link>
          <Link className="block rounded-md px-2 py-2 text-sm hover:bg-accent" href="/settings">
            Settings
          </Link>
        </nav>

        <form
          action={async () => {
            "use server";
            await signOutAction();
            redirect("/login");
          }}
          className="border-t pt-2"
        >
          <Button type="submit" variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
            Sign out
          </Button>
        </form>
      </div>
    </details>
  );
}
