import EmptyState from "@/components/ui/empty-state";

export const metadata = { title: "단가관리" };

export default function PricesPage() {
  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-slate-900">단가관리</h2>
      <EmptyState
      title="등록된 단가가 없습니다"
      description="평당 사용료, 관리비 주기, 석물 단가는 묘원 설정 데이터가 연결된 뒤 수정합니다."
    />
    </div>
  );
}
