import Link from "next/link";

export default function KpiCard({
  href,
  label,
  note,
}: {
  href: string;
  label: string;
  note: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sage/50 hover:shadow-sm"
    >
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-300">—</div>
      <div className="mt-1 text-xs text-slate-400">{note}</div>
    </Link>
  );
}
