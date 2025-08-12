import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ item }: { item: any }) {
  return (
    <Link href={`/listing/${item.slug}`} className="group card overflow-hidden transition hover:shadow-md">
      <div className="relative aspect-square">
        <Image
          src={item.photos?.[0]?.url || "/placeholder.jpg"}
          alt={item.title}
          fill
          className="object-cover transition group-hover:scale-[1.02]"
          placeholder="blur"
          blurDataURL={`${item.photos?.[0]?.url || "/placeholder.jpg"}?w=20&q=20&blur=50`}
        />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 font-semibold">{item.title}</h3>
        <p className="text-sm text-muted">{item.category}</p>
        <b className="mt-1 inline-block">{(item.priceCents/100).toFixed(2)} €</b>
      </div>
    </Link>
  );
}