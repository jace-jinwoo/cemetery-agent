"use client";

import Button from "@/components/ui/button";

export default function WorkspaceError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-white px-6 py-12 text-center">
      <h1 className="text-base font-semibold text-slate-900">화면을 불러오지 못했습니다</h1>
      <p className="mt-2 text-sm text-slate-500">잠시 후 다시 시도해 주세요.</p>
      <div className="mt-5">
        <Button onClick={reset}>다시 시도</Button>
      </div>
    </div>
  );
}
