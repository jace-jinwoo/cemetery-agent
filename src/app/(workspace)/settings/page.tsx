import EmptyState from "@/components/ui/empty-state";

export const metadata = { title: "설정" };

export default function SettingsIndexPage() {
  return (
    <EmptyState
      title="설정 항목을 선택하세요"
      description="단가, 사용자, 권한, 공원정보, 알림 조건을 왼쪽에서 고릅니다."
    />
  );
}
