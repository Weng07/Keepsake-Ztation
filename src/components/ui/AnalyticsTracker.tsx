"use client";

import { useEffect } from "react";

export default function AnalyticsTracker({ targetType, targetSlug, eventType = "view" }: { targetType: "product" | "blog" | "messenger"; targetSlug: string; eventType?: "view" | "messenger_click" }) {
  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_type: targetType, target_slug: targetSlug, event_type: eventType }),
    }).catch(() => null);
  }, [targetType, targetSlug, eventType]);

  return null;
}
