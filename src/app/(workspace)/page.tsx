import KpiCard from "@/components/ui/kpi-card";

const groups = [
  {
    title: "계약",
    items: [
      { href: "/contracts", label: "신규 계약", note: "집계 전" },
      { href: "/plots", label: "예약", note: "집계 전" },
      { href: "/contracts", label: "계약 현황", note: "집계 전" },
    ],
  },
  {
    title: "수납",
    items: [
      { href: "/billing", label: "납부 확인", note: "집계 전" },
      { href: "/billing", label: "청구 예정", note: "집계 전" },
      { href: "/billing", label: "미납", note: "집계 전" },
      { href: "/billing", label: "장기 미납", note: "집계 전" },
      { href: "/billing", label: "수납 현황", note: "집계 전" },
    ],
  },
  {
    title: "운영",
    items: [
      { href: "/consultations", label: "상담·민원", note: "집계 전" },
      { href: "/terminations", label: "이장 예정", note: "집계 전" },
      { href: "/terminations", label: "해약", note: "집계 전" },
      { href: "/plots", label: "묘역 현황", note: "집계 전" },
    ],
  },
];

export default function DashboardPage() {
  const today = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "full",
    timeZone: "Asia/Seoul",
  }).format(new Date());

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-forest px-6 py-5 text-white">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-mist">운영 현황</p>
            <h1 className="mt-1 text-2xl font-semibold">묘원에이전트</h1>
            <p className="mt-1 text-sm text-white/70">지표는 묘원 데이터가 연결된 뒤 계산됩니다.</p>
          </div>
          <p className="text-sm text-white/80">{today}</p>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.title}>
          <h2 className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            {group.title}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {group.items.map((item) => (
              <KpiCard key={item.label} href={item.href} label={item.label} note={item.note} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
