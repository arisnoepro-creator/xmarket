"use client";
export default function UploadWidget({ onUploaded }: { onUploaded: (urls: string[])=>void }) {
  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const out: string[] = [];
    for (const f of files) {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD!}/upload`,{ method:"POST", body: fd });
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