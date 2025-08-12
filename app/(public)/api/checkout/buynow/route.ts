import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { listingId, shipMethod = "relais" } = await req.json();
  const listing = await prisma.listing.findUnique({ where:{ id: listingId }, include:{ seller:true }});
  if (!listing || listing.status!=="ACTIVE" || !listing.seller?.stripeAccountId)
    return NextResponse.json({ error:"Indisponible" }, { status:400 });
  const fee = Math.round(listing.priceCents*0.05);
  const ship = shipMethod==="relais" ? 300 : 550;
  const pi = await stripe.paymentIntents.create({
    amount: listing.priceCents + ship,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    application_fee_amount: fee,
    transfer_data: { destination: listing.seller.stripeAccountId! },
    metadata: { listingId },
    payment_method_options: { card: { setup_future_usage: "on_session" } }
  });
  return NextResponse.json({ clientSecret: pi.client_secret, url: `/checkout?listingId=${listingId}&cs=${pi.client_secret}` });
}