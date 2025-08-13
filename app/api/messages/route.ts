import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  const { conversationId, body } = await req.json();
  const msg = await prisma.message.create({ data: { conversationId, body, authorId: "TEMP" }});
  // pusherServer est un no-op si les clés ne sont pas configurées
  await pusherServer.trigger?.(`chat-${conversationId}`, "new-message", msg);
  return NextResponse.json(msg);
}