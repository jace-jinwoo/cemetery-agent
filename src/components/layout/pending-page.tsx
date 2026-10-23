import EmptyState from "@/components/ui/empty-state";
import PageHeader from "@/components/layout/page-header";

export default function PendingPage({
  title,
  description,
  empty,
}: {
  title: string;
  description: string;
  empty: string;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <EmptyState title="저장된 데이터가 없습니다" description={empty} />
    </div>
  );
}
