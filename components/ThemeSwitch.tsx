"use client";
import { useEffect, useState } from "react";
export default function ThemeSwitch(){
  const [dark,setDark]=useState(false);
  useEffect(()=>{ document.documentElement.classList.toggle("dark", dark); },[dark]);
  return (
    <button onClick={()=>setDark(d=>!d)} className="rounded-xl border px-3 py-2 text-sm">
      {dark?"☾ Sombre":"☀ Clair"}
    </button>
  );
}