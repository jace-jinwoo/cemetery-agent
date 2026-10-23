import PendingPage from "@/components/layout/pending-page";

export const metadata = { title: "묘역관리" };

export default function PlotsPage() {
  return (
    <PendingPage
      title="묘역관리"
      description="단지, 구역, 위치, 상태와 연결된 계약을 조회합니다."
      empty="묘역 현황과 도면은 묘역 데이터 연결 후 표시됩니다. 좌표가 없는 지도 테이블은 만들지 않습니다."
    />
  );
}
