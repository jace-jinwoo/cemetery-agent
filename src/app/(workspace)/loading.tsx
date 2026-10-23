export default function Loading() {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
      <div className="h-40 animate-pulse rounded-xl bg-white" />
    </div>
  );
}
