"use client";
import { useState } from "react";
export default function BuyNow({ listingId }: { listingId: string }) {
  const [busy,setBusy]=useState(false);
  async function buy() {
    try{
      setBusy(true);
      const r = await fetch("/api/checkout/buynow",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ listingId, shipMethod:"relais" })});
      const j = await r.json();
      if (j.url) window.location.href = j.url;
      else if (j.clientSecret) window.location.href = `/checkout?cs=${encodeURIComponent(j.clientSecret)}&listingId=${listingId}`;
      else alert(j.error || "Impossible de préparer le paiement");
    } finally { setBusy(false); }
  }
  return (
    <button onClick={buy} disabled={busy}
      className="w-full rounded-xl bg-[var(--brand-ink)] px-4 py-3 font-semibold text-white">
      {busy ? "Préparation…" : "Acheter maintenant"}
    </button>
  );
}