import PendingPage from "@/components/layout/pending-page";

export const metadata = { title: "통계" };

export default function StatisticsPage() {
  return (
    <PendingPage
      title="통계"
      description="계약, 매출, 묘역, 수납을 기간별로 봅니다."
      empty="차트는 운영 데이터가 쌓인 뒤 계산합니다. 샘플 수치를 보여 주지 않습니다."
    />
  );
}
