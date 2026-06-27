import Link from "next/link";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerLabel: string;
  footerHref: string;
  footerCta: string;
}

export function AuthShell({
  title,
  description,
  children,
  footerLabel,
  footerHref,
  footerCta,
}: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(218_100%_65%_/_0.18),transparent_45%),radial-gradient(circle_at_bottom,_hsl(220_22%_21%_/_0.55),transparent_42%)]" />
      <div className="relative w-full max-w-md animate-fade-in rounded-xl border border-border/80 bg-card/90 p-6 shadow-card backdrop-blur sm:p-8">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">PrepOS</p>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footerLabel}{" "}
          <Link className="font-medium text-primary hover:underline" href={footerHref}>
            {footerCta}
          </Link>
        </p>
      </div>
    </main>
  );
}
