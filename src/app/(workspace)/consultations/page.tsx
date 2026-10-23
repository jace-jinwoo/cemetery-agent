import PendingPage from "@/components/layout/pending-page";

export const metadata = { title: "상담·민원" };

export default function ConsultationsPage() {
  return (
    <PendingPage
      title="상담·민원"
      description="상담, 민원, 조치와 처리 상태를 계약에 남깁니다."
      empty="상담 기록은 데이터베이스 연결 후 작성할 수 있습니다."
    />
  );
}
