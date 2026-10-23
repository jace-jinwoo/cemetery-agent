import Link from "next/link";

export default function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-6">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">통합 검색</span>
        <input
          disabled
          placeholder="검색은 계약 데이터 연결 후 사용할 수 있습니다"
          className="w-full max-w-xl cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
        />
      </label>
      <Link
        href="/notifications"
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
      >
        알림
      </Link>
    </header>
  );
}
