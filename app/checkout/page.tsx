export default function Checkout({ searchParams }: { searchParams?: Record<string,string> }) {
  const amount = searchParams?.cs?.split("_").pop();
  return (
    <div className="card mx-auto max-w-md p-6">
      <h1 className="mb-2 text-xl font-bold">Paiement simulé</h1>
      <p className="text-muted">Client secret (démo) : <code className="rounded bg-gray-100 px-1 py-0.5">{searchParams?.cs || "—"}</code></p>
      <p className="mt-2">Montant simulé: {amount ? Number(amount)/100 + " €" : "—"}</p>
      <p className="mt-4 text-sm">En mode démo, aucun paiement réel n’est effectué.</p>
    </div>
  );
}