export function Button({ children, className = "", ...p }: any) {
  return (
    <button
      {...p}
      className={`rounded-xl px-4 py-2 font-semibold text-white transition hover:opacity-90 ${className}`}
      style={{ background: "var(--brand-ink)" }}
    >
      {children}
    </button>
  );
}