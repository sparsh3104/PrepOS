"use client";

import { QueryProvider } from "@/providers/query-provider";
import { DevRuntimeGuard } from "@/providers/dev-runtime-guard";
import { ThemeProvider } from "@/providers/theme-provider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <DevRuntimeGuard />
        {children}
      </QueryProvider>
    </ThemeProvider>
  );
}
