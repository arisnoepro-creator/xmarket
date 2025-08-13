import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  const { conversationId, body } = await req.json();
  const msg = await prisma.message.create({ data: { conversationId, body, authorId: "TEMP" }});
  return NextResponse.json(msg);
}