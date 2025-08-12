import Chat from "@/components/Chat";
export default function MessagesPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card p-4">
        <h2 className="mb-2 text-lg font-bold">Conversations</h2>
        <p className="text-sm text-muted">Démo : conversation unique</p>
      </div>
      <Chat conversationId="demo" />
    </div>
  );
}