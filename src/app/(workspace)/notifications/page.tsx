import PendingPage from "@/components/layout/pending-page";

export const metadata = { title: "알림" };

export default function NotificationsPage() {
  return (
    <PendingPage
      title="알림"
      description="미납, 청구, 민원, 관리기간 알림을 모읍니다."
      empty="알림 목록은 업무 데이터가 생긴 뒤 만듭니다. 문자와 메일 발송은 연동 사양이 없습니다."
    />
  );
}
