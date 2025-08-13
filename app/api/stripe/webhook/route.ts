import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const raw = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  const stripe = getStripe();

  let event;
  try { event = stripe.webhooks.constructEvent(raw, sig, secret); }
  catch (e:any) { return NextResponse.json({ error: e.message }, { status: 400 }); }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as any;
    const order = await prisma.order.findFirst({ where: { paymentPI: pi.id } });
    if (order) {
      await prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } });
      await prisma.listing.update({ where: { id: order.listingId }, data: { status: "RESERVED" } });
    }
  }
  return NextResponse.json({ received: true });
}