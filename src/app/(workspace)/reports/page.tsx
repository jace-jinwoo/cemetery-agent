import PendingPage from "@/components/layout/pending-page";

export const metadata = { title: "리포트" };

export default function ReportsPage() {
  return (
    <PendingPage
      title="리포트"
      description="계약, 묘역, 수납, 관리비, 미납, 해약 현황을 기간으로 집계합니다."
      empty="Excel과 PDF는 집계 쿼리가 연결된 뒤 내려받습니다."
    />
  );
}
