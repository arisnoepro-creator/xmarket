import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  const page = Number(new URL(req.url).searchParams.get("page")||"0");
  const take = 24; const skip = page*take;
  const rows = await prisma.listing.findMany({
    where:{ status:"ACTIVE" }, include:{ photos:true }, orderBy:{ createdAt:"desc" }, take, skip
  });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { title, description, price, category, images } = await req.json();
  const slug = slugify(`${title}-${Date.now()}`, { lower: true, strict:true });
  const listing = await prisma.listing.create({
    data: {
      title, description, category, priceCents: Math.round(Number(price)*100),
      seller: { connect: { email: process.env.SEED_USER_EMAIL || "seller@example.com" } },
      photos: { create: (images||[]).map((url:string, i:number)=>({ url, order:i })) },
      condition: "VERY_GOOD", status: "ACTIVE", currency: "EUR", slug
    }, include: { photos: true }
  });
  return NextResponse.json({ slug: listing.slug }, { status: 201 });
}