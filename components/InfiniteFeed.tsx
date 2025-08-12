"use client";
import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";

export default function InfiniteFeed({ initial }: { initial:any[] }) {
  const [items,setItems]=useState(initial);
  const [page,setPage]=useState(1);
  const [done,setDone]=useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(()=> {
    const io = new IntersectionObserver(async (entries)=>{
      if (!entries[0].isIntersecting || done) return;
      const r = await fetch(`/api/listings?page=${page}`); const j = await r.json();
      if (j.length===0) setDone(true);
      setItems(prev=>[...prev, ...j]); setPage(p=>p+1);
    },{ rootMargin:"1000px" });
    if (ref.current) io.observe(ref.current);
    return ()=> io.disconnect();
  }, [page,done]);

  return (
    <>
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map(it => <ProductCard key={it.id} item={it} />)}
      </section>
      <div ref={ref} className="py-10 text-center text-muted">{done?"— Fin —":"Chargement…"}</div>
    </>
  );
}