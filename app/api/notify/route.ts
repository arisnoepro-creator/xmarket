export async function POST(req: Request) {
  const { toUserId, type, payload } = await req.json();
  console.log("Notify", toUserId, type, payload);
  return Response.json({ ok:true });
}