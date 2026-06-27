"use client";

import { useEffect } from "react";

export function DevRuntimeGuard() {
  useEffect(() => {
    // Avoid stale PWA cache/state when switching between build and dev runs.
    if (process.env.NODE_ENV === "production") {
      return;
    }

    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch(() => {
        // No-op: failing to unregister should not break app usage.
      });
  }, []);

  return null;
}
