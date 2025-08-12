"use client";
import { useEffect, useRef, useState } from "react";
import { PusherClient } from "@/lib/pusher";

export default function Chat({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER! });
    const ch = p.subscribe(`chat-${conversationId}`);
    ch.bind("new-message", (m:any)=> setMessages((x)=>[...x, m]));
    return () => { p.unsubscribe(`chat-${conversationId}`); p.disconnect(); };
  }, [conversationId]);

  async function send() {
    const body = inputRef.current!.value.trim(); if (!body) return;
    inputRef.current!.value = "";
    await fetch("/api/messages", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ conversationId, body }) });
  }

  return (
    <div className="card flex h-80 flex-col">
      <div className="flex-1 space-y-1 overflow-auto p-3">
        {messages.map(m => <div key={m.id} className="rounded bg-gray-100 p-2">{m.body}</div>)}
      </div>
      <div className="flex gap-2 border-t p-2">
        <input ref={inputRef} className="flex-1 rounded-xl border px-3 py-2" placeholder="Écrire un message…"/>
        <button onClick={send} className="rounded-xl bg-[var(--brand-ink)] px-4 py-2 font-semibold text-white">Envoyer</button>
      </div>
    </div>
  );
}