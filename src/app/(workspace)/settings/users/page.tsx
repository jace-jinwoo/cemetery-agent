import EmptyState from "@/components/ui/empty-state";

export const metadata = { title: "사용자관리" };

export default function UsersPage() {
  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-slate-900">사용자관리</h2>
      <EmptyState
      title="로그인 계정이 없습니다"
      description="사용자와 묘원 소속은 인증 단계에서 데이터베이스와 연결합니다."
    />
    </div>
  );
}
