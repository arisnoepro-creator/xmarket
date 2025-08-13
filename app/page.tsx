import InfiniteFeed from "@/components/InfiniteFeed";
import FilterBar from "@/components/FilterBar";
import { prisma } from "@/lib/prisma";

export default async function Home({ searchParams }: { searchParams?: Record<string,string> }) {
  const q = searchParams?.q; const brand = searchParams?.brand; const size = searchParams?.size;
  const cond = searchParams?.cond as any; const sort = searchParams?.sort;
  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      ...(q ? { OR:[{title:{contains:q,mode:"insensitive"}},{description:{contains:q,mode:"insensitive"}}]} : {}),
      ...(brand ? { brand } : {}), ...(size ? { size } : {}), ...(cond ? { condition: cond } : {})
    },
    orderBy: sort==="price_asc" ? { priceCents: "asc" } : sort==="price_desc" ? { priceCents: "desc" } : { createdAt:"desc" },
    include: { photos: { orderBy:{ order:"asc"} } },
    take: 24
  });
  return (<>
    <FilterBar />
    <InfiniteFeed initial={listings} />
  </>);
}