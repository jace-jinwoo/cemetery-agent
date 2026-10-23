import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";

export const metadata = { title: "계약관리" };

export default function ContractsPage() {
  return (
    <div>
      <PageHeader
        title="계약관리"
        description="회원번호, 계약자, 안치자, 묘역번호, 연락처로 찾습니다."
        action={<Button href="/contracts/new">신규 계약</Button>}
      />
      <EmptyState
        title="저장된 데이터가 없습니다"
        description="계약 목록의 검색, 필터, 정렬, 페이지네이션은 데이터베이스 연결 후 동작합니다."
      />
    </div>
  );
}
