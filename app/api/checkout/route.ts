import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { listingId, shipMethod = "relais" } = await req.json();
  const listing = await prisma.listing.findUnique({ where: { id: listingId }, include: { seller: true }});
  if (!listing || listing.status !== "ACTIVE") return NextResponse.json({ error: "Listing unavailable" }, { status: 400 });
  if (!listing.seller?.stripeAccountId) return NextResponse.json({ error: "Seller payments not enabled" }, { status: 400 });

  const feeCents = Math.round(listing.priceCents * 0.05);
  const shipCents = shipMethod === "relais" ? 300 : 550;
  const amount = listing.priceCents + shipCents;

  const stripe = getStripe();
  const pi = await stripe.paymentIntents.create({
    amount, currency: "eur",
    automatic_payment_methods: { enabled: true },
    application_fee_amount: feeCents,
    transfer_data: { destination: listing.seller.stripeAccountId! },
    metadata: { listingId }
  });

  await prisma.order.create({
    data: {
      buyerId: "TEMP",
      listingId: listing.id,
      amountCents: listing.priceCents,
      feeCents, shipCents, shipMethod,
      paymentPI: pi.id,
      status: "PAYMENT_INTENT"
    }
  });

  return NextResponse.json({ clientSecret: pi.client_secret });
}