// MODE DEMO : prisma factice en mémoire (aucune DB)
const DEMO = process.env.DEMO === "1";

// types simples
type Photo = { id: string; url: string; order: number; listingId: string };
type Listing = {
  id: string; slug: string; title: string; description: string;
  priceCents: number; currency: string; condition: string;
  brand?: string | null; size?: string | null; category: string;
  sellerId: string; status: "ACTIVE" | "RESERVED" | "SOLD" | "HIDDEN";
  createdAt: Date; photos: Photo[];
};
type User = {
  id: string; email: string; name?: string | null; image?: string | null;
  role: "USER" | "MOD" | "ADMIN"; stripeAccountId?: string | null;
  verifiedSeller: boolean; shopSlug?: string | null; shopBio?: string | null;
  shopBanner?: string | null; rating: number; createdAt: Date;
};

const users: User[] = [{
  id: "u_demo", email: "seller@example.com", name: "Démo Seller", image: null,
  role: "USER", stripeAccountId: null, verifiedSeller: true, shopSlug: "demo-shop",
  shopBio: "Sélection soignée en super état ✨", shopBanner: null, rating: 4.8, createdAt: new Date()
}];

const mkListing = (i:number, cat:string, brand?:string, size?:string): Listing => ({
  id:`l_${i}`, slug:`demo-item-${i}`, title:`Article démo ${i}`,
  description:"Superbe état, prêt à porter. (données démo)",
  priceCents:2500+i*50, currency:"EUR", condition:["VERY_GOOD","LIKE_NEW","GOOD"][i%3],
  brand:brand||["Zara","Nike","Adidas","H&M"][i%4], size:size||["S","M","L","XL"][i%4],
  category:cat, sellerId:"u_demo", status:"ACTIVE", createdAt:new Date(Date.now()-i*86400000),
  photos:[
    { id:`p_${i}_1`, url:`https://picsum.photos/seed/xmarket${i}/800/800`, order:0, listingId:`l_${i}` },
    { id:`p_${i}_2`, url:`https://picsum.photos/seed/xmarket${i}b/800/800`, order:1, listingId:`l_${i}` }
  ]
});
const listings: Listing[] = [
  mkListing(1,"Vêtements","Nike","M"), mkListing(2,"Chaussures","Adidas","42"),
  mkListing(3,"Accessoires","Zara"), mkListing(4,"Vêtements","H&M","S"),
  mkListing(5,"Chaussures","Nike","43"), mkListing(6,"Vêtements","Adidas","L"),
  mkListing(7,"Accessoires","Zara"), mkListing(8,"Vêtements","H&M","M"), mkListing(9,"Chaussures","Nike","41")
];

const contains = (s:string,q:string)=> s.toLowerCase().includes(q.toLowerCase());

const prismaMock:any = {
  listing: {
    findMany: async (opts:any={})=>{
      let rows = listings.filter(l=>l.status==="ACTIVE");
      if (opts.where) {
        const { OR, brand, size, condition, category } = opts.where;
        if (brand) rows = rows.filter(r=>r.brand===brand);
        if (size) rows = rows.filter(r=>r.size===size);
        if (condition) rows = rows.filter(r=>r.condition===condition);
        if (category) rows = rows.filter(r=>r.category===category);
        if (OR && Array.isArray(OR)) {
          for (const clause of OR) {
            if (clause.title?.contains) rows = rows.filter(r=>contains(r.title, clause.title.contains));
            if (clause.description?.contains) rows = rows.filter(r=>contains(r.description, clause.description.contains));
          }
        }
      }
      if (opts.orderBy?.priceCents==="asc") rows.sort((a,b)=>a.priceCents-b.priceCents);
      else if (opts.orderBy?.priceCents==="desc") rows.sort((a,b)=>b.priceCents-a.priceCents);
      else if (opts.orderBy?.createdAt==="desc") rows.sort((a,b)=>b.createdAt.getTime()-a.createdAt.getTime());
      const skip = opts.skip||0; const take = opts.take||rows.length;
      const withPhotos = (l:Listing)=>({ ...l, photos: l.photos.sort((a,b)=>a.order-b.order) });
      return rows.slice(skip, skip+take).map(withPhotos);
    },
    findUnique: async ({ where, include }:any)=>{
      const l = listings.find(x=>x.slug===where.slug || x.id===where.id); if(!l) return null;
      const obj:any = { ...l };
      if (include?.photos) obj.photos = l.photos.sort((a,b)=>a.order-b.order);
      if (include?.seller) obj.seller = users.find(u=>u.id===l.sellerId) || null;
      return obj;
    },
    update: async ({ where, data }:any)=>{
      const i = listings.findIndex(x=>x.id===where.id); if(i===-1) throw new Error("Listing not found");
      listings[i] = { ...listings[i], ...data }; return listings[i];
    },
    create: async ({ data, include }:any)=>{
      const id = "l_"+(listings.length+1);
      const slug = data.slug || ("new-item-"+Date.now());
      const photos = (data.photos?.create||[]).map((p:any,i:number)=>({ id:`p_new_${i}`, url:p.url, order:p.order??i, listingId:id }));
      const row:Listing = {
        id, slug, title:data.title, description:data.description||"", priceCents:data.priceCents, currency:data.currency||"EUR",
        condition:data.condition||"VERY_GOOD", brand:data.brand||null, size:data.size||null, category:data.category||"Vêtements",
        sellerId:"u_demo", status:"ACTIVE", createdAt:new Date(), photos
      };
      listings.unshift(row);
      const out:any = { ...row }; if (include?.photos) out.photos = row.photos; return out;
    }
  },
  user: {
    findFirst: async ({ where, include }:any)=>{
      const u = users.find(x=>x.shopSlug===where.shopSlug)||null; if(!u) return null;
      const obj:any = { ...u };
      if (include?.listings) {
        const onlyActive = listings.filter(l=>l.sellerId===u.id && l.status==="ACTIVE");
        obj.listings = include.listings.include?.photos ? onlyActive.map(l=>({ ...l, photos:l.photos })) : onlyActive;
      }
      return obj;
    },
    update: async ({ where, data }:any)=>{ const u = users.find(x=>x.id===where.id)!; Object.assign(u,data); return u; }
  },
  offer: { create: async ({ data }:any)=>({ id:"off_"+Date.now(), ...data, status:"PENDING", createdAt:new Date() }),
           update: async ({ where, data }:any)=>({ id:where.id, ...data }) },
  favorite: { upsert: async ()=>({ ok:true }), delete: async ()=>({ ok:true }) },
  order: { create: async ({ data }:any)=>({ id:"ord_"+Date.now(), ...data, createdAt:new Date() }),
           findFirst: async ({ where }:any)=>({ id:"ord_demo", listingId: where.paymentPI ? "l_1":"l_2", paymentPI: where.paymentPI, status:"PAYMENT_INTENT" }),
           update: async ({ where, data }:any)=>({ id:where.id, ...data }) },
  review: { create: async ({ data }:any)=>({ id:"rev_"+Date.now(), ...data, createdAt:new Date() }) },
  message:{ create: async ({ data }:any)=>({ id:"msg_"+Date.now(), ...data, createdAt:new Date() }) }
};

export const prisma:any = prismaMock;