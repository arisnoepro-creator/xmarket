"use client";
import { useRouter, useSearchParams } from "next/navigation";
export default function FilterBar() {
  const router = useRouter(); const sp = useSearchParams();
  const set = (k:string,v:string)=>{const p=new URLSearchParams(sp); v?p.set(k,v):p.delete(k); router.push("/?"+p.toString());};
  return (
    <form className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-6">
      <input defaultValue={sp.get("q")||""} onChange={e=>set("q",e.target.value)}
             placeholder="Rechercher…" className="col-span-2 rounded border p-2 md:col-span-2"/>
      <select defaultValue={sp.get("brand")||""} onChange={e=>set("brand",e.target.value)} className="rounded border p-2">
        <option value="">Marque</option><option>Nike</option><option>Zara</option><option>Adidas</option>
      </select>
      <select defaultValue={sp.get("size")||""} onChange={e=>set("size",e.target.value)} className="rounded border p-2">
        <option value="">Taille</option><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option>
      </select>
      <select defaultValue={sp.get("cond")||""} onChange={e=>set("cond",e.target.value)} className="rounded border p-2">
        <option value="">État</option>{["NEW","LIKE_NEW","VERY_GOOD","GOOD","FAIR"].map(x=><option key={x}>{x}</option>)}
      </select>
      <select defaultValue={sp.get("sort")||"new"} onChange={e=>set("sort",e.target.value)} className="rounded border p-2">
        <option value="new">Plus récents</option><option value="price_asc">Prix ↑</option><option value="price_desc">Prix ↓</option>
      </select>
    </form>
  );
}