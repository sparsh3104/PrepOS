import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { dashboardNavigation } from "@/features/dashboard/navigation";
import { UserMenu } from "@/features/dashboard/components/user-menu";

interface DashboardShellProps {
  userEmail: string;
  children: React.ReactNode;
}

export function DashboardShell({ userEmail, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border/80 bg-card/60 px-4 py-6 md:flex md:flex-col">
          <div className="px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">PrepOS</p>
            <h1 className="mt-2 text-lg font-semibold">Study OS</h1>
          </div>

          <nav className="mt-6 flex-1 space-y-1">
            {dashboardNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
              <details className="relative md:hidden">
                <summary className="list-none">
                  <Button type="button" variant="outline" size="icon" aria-label="Open navigation">
                    <Menu className="h-4 w-4" />
                  </Button>
                </summary>
                <div className="absolute left-0 top-12 z-50 w-72 rounded-lg border bg-popover p-2 shadow-card">
                  <nav className="space-y-1">
                    {dashboardNavigation.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </details>

              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="w-full rounded-full border-border/70 bg-card pl-9"
                  aria-label="Global search"
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </Button>
                <ThemeToggle />
                <UserMenu email={userEmail} />
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
