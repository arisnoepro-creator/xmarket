"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

type Listing = any;

export default function InfiniteFeed({ initial = [] as Listing[] }) {
  const [items, setItems] = useState<Listing[]>(initial);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function loadMore() {
    if (loading || done) return;
    setLoading(true);
    const res = await fetch(`/api/listings?page=${page}`);
    const more = await res.json();
    if (!more.length) setDone(true);
    setItems((x) => [...x, ...more]);
    setPage((p) => p + 1);
    setLoading(false);
  }

  useEffect(() => {
    const onScroll = () => {
      if (done || loading) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) loadMore();
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading, done]);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((l: any) => (<ProductCard key={l.id} item={l} />))}
      {!done && (
        <button onClick={loadMore} className="col-span-full rounded-xl border py-3 text-sm">
          {loading ? "Chargement…" : "Charger plus"}
        </button>
      )}
    </div>
  );
}