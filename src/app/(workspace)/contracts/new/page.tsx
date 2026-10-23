import PageHeader from "@/components/layout/page-header";
import EmptyState from "@/components/ui/empty-state";

export const metadata = { title: "신규 계약" };

const steps = ["계약자·신청인", "묘역 배정", "안치자", "비용", "관리기간"];

export default function NewContractPage() {
  return (
    <div>
      <PageHeader
        title="신규 계약"
        description="인물 역할, 묘역 배정, 번호 규칙을 저장하는 폼은 데이터베이스 연결 후 연다."
      />
      <ol className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
            <span className="text-xs text-slate-400">{index + 1}</span>
            <div className="font-medium text-slate-800">{step}</div>
          </li>
        ))}
      </ol>
      <EmptyState
        title="입력 폼이 아직 없습니다"
        description="저장은 데이터베이스 연결 후 동작합니다."
      />
    </div>
  );
}
