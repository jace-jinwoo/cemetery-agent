import SettingsNav from "@/components/layout/settings-nav";
import PageHeader from "@/components/layout/page-header";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <PageHeader title="설정" description="묘원 운영 기준과 계정. 저장은 아직 연결되지 않았습니다." />
      <div className="flex items-start gap-6">
        <SettingsNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
