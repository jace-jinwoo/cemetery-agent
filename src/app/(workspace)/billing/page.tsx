import PendingPage from "@/components/layout/pending-page";

export const metadata = { title: "수납·청구" };

export default function BillingPage() {
  return (
    <PendingPage
      title="수납·청구"
      description="납부 내역, 청구, 관리비, 장기 미납을 다룹니다."
      empty="청구, 입금, 충당을 분리해 부분납부와 여러 차례 입금을 남깁니다. 저장은 데이터베이스 연결 후 동작합니다."
    />
  );
}
