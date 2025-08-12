"use client";
import { useState } from "react";
export default function MakeOffer({ listingId, priceCents }: { listingId:string; priceCents:number }) {
  const [v,setV]=useState(Math.round(priceCents*0.9));
  async function submit(){
    const r = await fetch("/api/offers",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ listingId, amountCents:v, buyerId:"TEMP" })});
    if(r.ok) alert("Offre envoyée !");
  }
  return (
    <div className="mt-3 flex gap-2">
      <input type="number" value={(v/100).toFixed(2)} onChange={e=>setV(Math.round(+e.target.value*100))}
             className="w-28 rounded border p-2" />
      <button onClick={submit} className="rounded-xl bg-[var(--brand-ink)] px-3 py-2 text-white">Faire une offre</button>
    </div>
  );
}