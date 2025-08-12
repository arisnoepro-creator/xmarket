"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="container flex items-center gap-3 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-xmarket.svg" alt="XMarket" width={28} height={28} />
          <span className="text-xl font-extrabold tracking-tight">Market</span>
        </Link>
        <input
          className="flex-1 rounded-xl border px-3 py-2"
          placeholder="Rechercher un article..."
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          onKeyDown={(e)=> e.key==="Enter" && router.push(`/?q=${encodeURIComponent(q)}`)}
        />
        <Link href="/sell" className="rounded-xl bg-[var(--brand-ink)] px-4 py-2 font-semibold text-white">Vendre</Link>
      </div>
    </header>
  );
}