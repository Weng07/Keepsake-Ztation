"use client";

import { MessageCircle } from "lucide-react";

export default function MessengerOrderButton({ productSlug, productTitle, message, messengerUrl }: { productSlug: string; productTitle: string; message?: string; messengerUrl?: string }) {
  const text = encodeURIComponent(message || `Hi, I want to order ${productTitle}.`);
  const href = messengerUrl ? `${messengerUrl}${messengerUrl.includes("?") ? "&" : "?"}text=${text}` : `https://m.me/?text=${text}`;

  async function trackClick() {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_type: "messenger", target_slug: productSlug, event_type: "messenger_click" }),
    }).catch(() => null);
  }

  return (
    <a href={href} onClick={trackClick} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
      <MessageCircle size={16} /> Order on Messenger
    </a>
  );
}
