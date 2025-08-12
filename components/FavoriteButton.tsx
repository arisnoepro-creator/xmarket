"use client";
import { useState } from "react";
export default function FavoriteButton({ listingId }: { listingId:string }) {
  const [on,setOn]=useState(false);
  const toggle = async ()=>{
    setOn(!on);
    await fetch("/api/favorites",{
      method: on?"DELETE":"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ listingId, userId:"TEMP" })
    });
  };
  return <button onClick={toggle} aria-pressed={on} title="Favori" className="text-2xl transition-transform" style={{ filter: on ? "drop-shadow(0 0 6px rgba(225,122,60,.4))" : "none" }}>{on?"💖":"🤍"}</button>;
}