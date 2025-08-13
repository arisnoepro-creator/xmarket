export default function SellerBadge({ verified }: { verified?: boolean }) {
  return verified ? <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">✔ Vendeur vérifié</span> : null;
}