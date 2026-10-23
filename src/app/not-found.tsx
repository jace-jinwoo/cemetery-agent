import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-medium text-sage">404</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm text-slate-500">주소가 바뀌었거나 없는 화면입니다.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-sage px-4 py-2 text-sm font-medium text-white"
        >
          대시보드로
        </Link>
      </div>
    </main>
  );
}
