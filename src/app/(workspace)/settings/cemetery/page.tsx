import EmptyState from "@/components/ui/empty-state";

export const metadata = { title: "공원정보" };

export default function CemeterySettingsPage() {
  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-slate-900">공원정보</h2>
      <EmptyState
      title="묘원 정보가 없습니다"
      description="묘원명, 주소, 연락처는 묘원 레코드가 생긴 뒤 수정합니다."
    />
    </div>
  );
}
