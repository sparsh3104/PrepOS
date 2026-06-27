export const dashboardNavigation = [
  { label: "Dashboard", href: "/dashboard", available: true },
  { label: "Planner", href: "/planner", available: true },
  { label: "Knowledge Base", href: "/knowledge-base", available: true },
  { label: "Calendar", href: "/calendar", available: false },
  { label: "Progress", href: "/progress", available: false },
  { label: "Error Log", href: "/error-log", available: false },
  { label: "Mocks", href: "/mocks", available: false },
  { label: "Analytics", href: "/analytics", available: false },
  { label: "Notifications", href: "/notifications", available: false },
  { label: "Settings", href: "/settings", available: false },
  { label: "Profile", href: "/profile", available: false },
] as const;
