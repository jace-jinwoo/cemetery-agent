import PageHeader from "@/components/layout/page-header";
import EmptyState from "@/components/ui/empty-state";

export const metadata = { title: "계약 상세" };

const tabs = [
  "계약정보",
  "안치자",
  "묘역",
  "비용",
  "납부",
  "관리비",
  "상담·민원",
  "메모",
  "해약·이장",
  "문서",
];

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="계약 상세"
        description={`계약 ${id}의 관련 업무는 이 화면에서 이어서 처리합니다.`}
      />
      <ul className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <li
            key={tab}
            className="rounded-full bg-white px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200"
          >
            {tab}
          </li>
        ))}
      </ul>
      <EmptyState
        title="저장된 데이터가 없습니다"
        description="계약, 안치자, 묘역, 비용, 납부, 상담, 문서를 아직 조회할 수 없습니다."
      />
    </div>
  );
}
