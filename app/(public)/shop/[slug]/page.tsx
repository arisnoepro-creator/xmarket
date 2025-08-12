import { prisma } from "@/lib/prisma"; import ProductCard from "@/components/ProductCard";
export default async function Shop({ params:{ slug } }: any) {
  const user = await prisma.user.findFirst({ where:{ shopSlug: slug }, include:{ listings:{ where:{ status:"ACTIVE" }, include:{ photos:true }}}});
  if(!user) return <p>Boutique introuvable</p>;
  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h1 className="text-2xl font-bold">{user.name || "Boutique"}</h1>
        <p className="text-muted">{user.shopBio}</p>
      </div>
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {user.listings.map((l:any) => <ProductCard key={l.id} item={l} />)}
      </section>
    </div>
  );
}