import EmptyState from "@/components/ui/empty-state";

export const metadata = { title: "권한관리" };

export default function RolesPage() {
  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-slate-900">권한관리</h2>
      <EmptyState
      title="저장된 권한이 없습니다"
      description="기본 역할은 묘원 관리자, 계약 담당자, 수납 담당자, 현장 담당자입니다. 묘원별 조정과 복수 역할을 허용합니다. SaaS 운영자는 별도입니다."
    />
    </div>
  );
}
