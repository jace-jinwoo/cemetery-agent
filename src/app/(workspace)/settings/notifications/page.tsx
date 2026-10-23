import EmptyState from "@/components/ui/empty-state";

export const metadata = { title: "알림 설정" };

export default function NotificationSettingsPage() {
  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-slate-900">알림 설정</h2>
      <EmptyState
      title="발송이 연결되지 않았습니다"
      description="알림 조건은 나중에 저장할 수 있습니다. 문자, 이메일, 전자서명 발송은 연동 사양이 없어 동작하지 않습니다."
    />
    </div>
  );
}
