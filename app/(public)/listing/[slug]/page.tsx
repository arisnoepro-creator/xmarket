import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import Carousel from "@/components/Carousel";
import BuyNow from "@/components/BuyNow";
import MakeOffer from "@/components/MakeOffer";
import ProductCard from "@/components/ProductCard";
import SellerBadge from "@/components/SellerBadge";

export default async function ListingPage({ params }: { params: { slug: string }}) {
  const listing = await prisma.listing.findUnique({
    where: { slug: params.slug }, include: { photos: { orderBy: { order: "asc" } }, seller: true }
  });
  if (!listing) return <p>Introuvable</p>;

  const sellerMore = await prisma.listing.findMany({
    where:{ sellerId: listing.sellerId, status:"ACTIVE", NOT:{ id: listing.id } },
    include:{ photos:true }, take: 6, orderBy:{ createdAt:"desc" }
  });
  const similar = await prisma.listing.findMany({
    where:{ status:"ACTIVE", category: listing.category, brand: listing.brand || undefined, NOT:{ id: listing.id } },
    include:{ photos:true }, take: 6
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Carousel photos={listing.photos}/>
      <div className="card p-4">
        <h1 className="mb-1 text-2xl font-bold">{listing.title}</h1>
        <p className="text-muted flex items-center gap-2">
          {listing.category} · {listing.brand ?? "—"} · {listing.condition}
          <SellerBadge verified={!!listing.seller?.verifiedSeller} />
        </p>
        <b className="my-3 block text-2xl">{(listing.priceCents/100).toFixed(2)} €</b>
        <div className="space-y-2">
          <BuyNow listingId={listing.id} />
          <form action="/checkout">
            <input type="hidden" name="listingId" value={listing.id}/>
            <Button>Passer par le panier</Button>
          </form>
          <MakeOffer listingId={listing.id} priceCents={listing.priceCents} />
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm">{listing.description}</p>
      </div>

      <section className="md:col-span-2 mt-2 space-y-6">
        {!!sellerMore.length && (
          <div>
            <h2 className="mb-2 text-lg font-semibold">Plus de ce vendeur</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {sellerMore.map(l => <ProductCard key={l.id} item={l} />)}
            </div>
          </div>
        )}
        {!!similar.length && (
          <div>
            <h2 className="mb-2 text-lg font-semibold">Vous pourriez aussi aimer</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {similar.map(l => <ProductCard key={l.id} item={l} />)}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}