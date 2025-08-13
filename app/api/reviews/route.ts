import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  const { orderId, aboutId, rating, comment, photoUrl } = await req.json();
  const review = await prisma.review.create({ data:{ orderId, aboutId, authorId:"TEMP", rating, comment, photoUrl }});
  return NextResponse.json(review, { status:201 });
}