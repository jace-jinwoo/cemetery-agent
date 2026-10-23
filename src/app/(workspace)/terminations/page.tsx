import PendingPage from "@/components/layout/pending-page";

export const metadata = { title: "해약·이장" };

export default function TerminationsPage() {
  return (
    <PendingPage
      title="해약·이장"
      description="해약과 이장 처리 상태, 이력, 묘역 상태를 함께 반영합니다."
      empty="환불은 담당자 산정과 관리자 승인으로 기록합니다. 산식은 없습니다. 이장은 내부 이동과 외부 이장을 모두 남기며, 완료돼도 묘역을 판매가능으로 바꾸지 않습니다. 저장은 데이터베이스 연결 후 동작합니다."
    />
  );
}
