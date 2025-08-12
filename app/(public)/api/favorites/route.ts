import { NextRequest, NextResponse } from "next/server"; import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  const { listingId, userId } = await req.json();
  await prisma.favorite.upsert({ where:{ userId_listingId:{ userId, listingId }}, update:{}, create:{ userId, listingId }});
  return NextResponse.json({ ok:true });
}
export async function DELETE(req: NextRequest) {
  const { listingId, userId } = await req.json();
  await prisma.favorite.delete({ where:{ userId_listingId:{ userId, listingId }}});
  return NextResponse.json({ ok:true });
}