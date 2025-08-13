import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { listingId, shipMethod = "relais" } = await req.json();
  const listing = await prisma.listing.findUnique({ where:{ id: listingId }});
  if (!listing || listing.status!=="ACTIVE")
    return NextResponse.json({ error:"Indisponible" }, { status:400 });

  // Simulation paiement: on renvoie un client_secret fictif et une URL de pseudo-checkout
  const ship = shipMethod==="relais" ? 300 : 550;
  const cs = `cs_test_demo_${listing.priceCents + ship}`;
  return NextResponse.json({ clientSecret: cs, url: `/checkout?listingId=${listingId}&cs=${cs}` });
}