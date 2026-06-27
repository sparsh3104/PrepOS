export const siteConfig = {
  name: "PrepOS",
  description: "Your complete study operating system.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
} as const;

export const protectedRoutePrefixes = [
  "/dashboard",
  "/planner",
  "/calendar",
  "/progress",
  "/knowledge-base",
  "/error-log",
  "/flashcards",
  "/mocks",
  "/analytics",
  "/notifications",
  "/settings",
  "/profile",
] as const;
