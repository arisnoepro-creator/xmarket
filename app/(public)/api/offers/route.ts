import { NextRequest, NextResponse } from "next/server"; import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  const { listingId, amountCents, buyerId } = await req.json();
  const listing = await prisma.listing.findUnique({ where:{ id: listingId }});
  if (!listing || listing.status !== "ACTIVE") return NextResponse.json({ error:"Indisponible" }, { status:400 });
  const offer = await prisma.offer.create({ data: { listingId, amountCents, buyerId }});
  return NextResponse.json(offer, { status:201 });
}
export async function PATCH(req: NextRequest) {
  const { offerId, action } = await req.json();
  const offer = await prisma.offer.update({ where:{ id: offerId }, data: { status: action==="accept"?"ACCEPTED":"DECLINED" }});
  return NextResponse.json(offer);
}