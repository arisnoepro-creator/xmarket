"use client";
import Image from "next/image"; import { useState } from "react";
export default function Carousel({ photos }: { photos: {url:string}[] }) {
  const [i,setI]=useState(0);
  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-square">
        <Image src={photos[i]?.url || "/placeholder.jpg"} alt="" fill className="object-cover"/>
      </div>
      <div className="flex gap-2 overflow-x-auto p-2">
        {photos.map((p,idx)=>(
          <button key={idx} onClick={()=>setI(idx)}
            className={`relative h-16 w-16 overflow-hidden rounded ${i===idx?"ring-2 ring-[var(--brand-ink)]":""}`}>
            <Image src={p.url} alt="" fill className="object-cover"/>
          </button>
        ))}
      </div>
    </div>
  );
}