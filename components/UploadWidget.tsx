"use client";
/**
 * Démo : si aucune config Cloudinary n'est fournie,
 * on simule l'upload avec des URLs picsum.
 */
export default function UploadWidget({ onUploaded }: { onUploaded: (urls: string[])=>void }) {
  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

    if (!cloud || !preset) {
      // Fallback DEMO : simule des URLs
      const urls = files.map((_, i) => `https://picsum.photos/seed/xm${Date.now()}${i}/800/800`);
      onUploaded(urls);
      return;
    }

    const out: string[] = [];
    for (const f of files) {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("upload_preset", preset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/upload`,{ method:"POST", body: fd });
      const json = await res.json(); out.push(json.secure_url);
    }
    onUploaded(out);
  }
  return (
    <label className="block cursor-pointer rounded-xl border p-4 text-center">
      <input type="file" accept="image/*" multiple onChange={handle} className="hidden"/>
      <span>Ajouter des photos</span>
    </label>
  );
}