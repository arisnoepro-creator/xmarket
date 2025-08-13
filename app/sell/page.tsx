"use client";
import { useForm } from "react-hook-form";
import UploadWidget from "@/components/UploadWidget";

export default function SellPage() {
  const { register, handleSubmit, setValue, formState:{errors} } = useForm({ defaultValues: { images: [] as string[] }});
  async function onSubmit(v:any) {
    const res = await fetch("/api/listings", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(v) });
    const j = await res.json(); if (res.ok) window.location.href = `/listing/${j.slug}`; else alert(j.error);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card mx-auto max-w-2xl space-y-3 p-4">
      <h1 className="text-xl font-bold">Vendre un article</h1>
      <input {...register("title", { required:true })} placeholder="Titre" className="rounded-xl border p-2 w-full"/>
      <textarea {...register("description")} rows={4} className="rounded-xl border p-2 w-full" placeholder="Description"/>
      <div className="grid grid-cols-2 gap-2">
        <input type="number" {...register("price", { valueAsNumber:true })} placeholder="Prix (€)" className="rounded-xl border p-2"/>
        <select {...register("category")} className="rounded-xl border p-2">
          <option>Vêtements</option><option>Chaussures</option><option>Accessoires</option>
        </select>
      </div>
      <UploadWidget onUploaded={(urls)=> setValue("images", urls)} />
      <button className="rounded-xl bg-[var(--brand-ink)] px-4 py-2 font-semibold text-white">Publier</button>
      {Object.keys(errors).length>0 && <p className="text-red-600 text-sm">Vérifie les champs.</p>}
    </form>
  );
}