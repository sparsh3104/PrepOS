import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-6 text-center shadow-card">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Button asChild className="w-full">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
