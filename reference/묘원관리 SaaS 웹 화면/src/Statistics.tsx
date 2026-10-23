import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  forest: "#1E3A2B",
  sage: "#3B7A57",
  emerald: "#10B981",
  teal: "#0D9488",
  sky: "#0EA5E9",
  indigo: "#6366F1",
  violet: "#7C3AED",
  amber: "#F59E0B",
  orange: "#F97316",
  rose: "#F43F5E",
  slate: "#64748B",
  bg: "#F3F6F4",
};

const PIE_COLORS = [C.forest, C.sage, C.emerald, C.teal, C.sky, C.indigo, C.violet, C.amber];

// ─── Sample Data ──────────────────────────────────────────────────────────────
const monthlyRevenue = [
  { month: "1월", revenue: 42500000, contracts: 11, target: 40000000 },
  { month: "2월", revenue: 38200000, contracts: 9, target: 40000000 },
  { month: "3월", revenue: 51800000, contracts: 14, target: 45000000 },
  { month: "4월", revenue: 46300000, contracts: 12, target: 45000000 },
  { month: "5월", revenue: 55100000, contracts: 15, target: 50000000 },
  { month: "6월", revenue: 49700000, contracts: 13, target: 50000000 },
  { month: "7월", revenue: 61200000, contracts: 17, target: 55000000 },
  { month: "8월", revenue: 57400000, contracts: 15, target: 55000000 },
  { month: "9월", revenue: 63800000, contracts: 18, target: 60000000 },
  { month: "10월", revenue: 58900000, contracts: 16, target: 60000000 },
  { month: "11월", revenue: 71200000, contracts: 19, target: 65000000 },
  { month: "12월", revenue: 68500000, contracts: 18, target: 65000000 },
];

const byContractType = [
  { name: "잔디형", value: 125, revenue: 262500000 },
  { name: "수목장", value: 68, revenue: 108800000 },
  { name: "일반형", value: 42, revenue: 54600000 },
  { name: "봉안당", value: 13, revenue: 32500000 },
];

const byRegion = [
  { region: "서울", count: 82, revenue: 175200000 },
  { region: "경기", count: 65, revenue: 138500000 },
  { region: "인천", count: 28, revenue: 56700000 },
  { region: "부산", count: 22, revenue: 44300000 },
  { region: "대전", count: 18, revenue: 35400000 },
  { region: "광주", count: 12, revenue: 22800000 },
  { region: "대구", count: 11, revenue: 20900000 },
  { region: "기타", count: 10, revenue: 18900000 },
];

const byAgeGroup = [
  { age: "40대", count: 8, pct: 3 },
  { age: "50대", count: 32, pct: 13 },
  { age: "60대", count: 78, pct: 31 },
  { age: "70대", count: 95, pct: 38 },
  { age: "80대↑", count: 35, pct: 14 },
  { age: "미상", count: 0, pct: 1 },
];

const byCemeteryType = [
  { type: "잔디형", count: 125, color: C.forest },
  { type: "수목장", count: 68, color: C.sage },
  { type: "일반형", count: 42, color: C.emerald },
  { type: "봉안당", count: 13, color: C.teal },
  { type: "가족묘", count: 0, color: C.sky },
];

const costItems = [
  { item: "연간 관리비", amount: 58400000 },
  { item: "시설 사용료", amount: 42800000 },
  { item: "묘역 보수비", amount: 22100000 },
  { item: "청소·환경", amount: 15300000 },
  { item: "석물 설치비", amount: 34700000 },
  { item: "납골당 이용료", amount: 18900000 },
  { item: "화장비 지원", amount: 9200000 },
  { item: "기타 수수료", amount: 6500000 },
];

const stoneItems = [
  { item: "오석비", count: 142 },
  { item: "화강암비", count: 98 },
  { item: "상석", count: 87 },
  { item: "향로석", count: 76 },
  { item: "대리석비", count: 64 },
  { item: "석등", count: 58 },
  { item: "동자석", count: 52 },
  { item: "장명등", count: 45 },
  { item: "망주석", count: 39 },
  { item: "문인석", count: 34 },
  { item: "무인석", count: 28 },
  { item: "석사자", count: 24 },
  { item: "석탑", count: 21 },
  { item: "화표주", count: 18 },
  { item: "석마", count: 15 },
  { item: "석종형", count: 13 },
  { item: "석호", count: 11 },
  { item: "석양", count: 9 },
  { item: "노거수형", count: 7 },
  { item: "기타석물", count: 5 },
];

const weeklyTrend = [
  { week: "4주전", revenue: 14200000 },
  { week: "3주전", revenue: 18500000 },
  { week: "2주전", revenue: 16900000 },
  { week: "지난주", revenue: 21300000 },
  { week: "이번주", revenue: 19800000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtM(v: number) {
  if (v >= 100000000) return (v / 100000000).toFixed(1) + "억";
  if (v >= 10000000) return (v / 10000000).toFixed(0) + "천만";
  if (v >= 1000000) return (v / 1000000).toFixed(0) + "백만";
  return v.toLocaleString();
}

function fmtKRW(v: number) {
  return v.toLocaleString("ko-KR") + "원";
}

function pct(current: number, prev: number) {
  if (prev === 0) return 0;
  return ((current - prev) / prev) * 100;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs min-w-[140px]">
      <div className="font-semibold text-slate-800 mb-2">{label}</div>
      {(payload as Array<{ name: string; value: number; color: string }>).map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono font-medium">{typeof p.value === "number" && p.value > 10000 ? fmtM(p.value) : p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0] as { name: string; value: number; payload: { revenue?: number } };
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs">
      <div className="font-semibold text-slate-800 mb-1">{d.name}</div>
      <div className="text-slate-600">{d.value}건</div>
      {d.payload.revenue && <div className="text-emerald-700 font-medium">{fmtM(d.payload.revenue)}</div>}
    </div>
  );
}

// ─── Chart Card ───────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, className = "" }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 flex flex-col ${className}`}>
      <div className="px-5 py-4 border-b border-slate-100 shrink-0">
        <div className="font-semibold text-slate-900 text-sm">{title}</div>
        {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, delta, color = C.forest }: {
  label: string;
  value: string;
  sub: string;
  delta: number;
  color?: string;
}) {
  const up = delta >= 0;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-2">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="text-3xl font-bold tracking-tight" style={{ color }}>{value}</div>
      <div className="text-xs text-slate-500">{sub}</div>
      <div className={`flex items-center gap-1 text-xs font-semibold ${up ? "text-emerald-600" : "text-red-600"}`}>
        <span>{up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%</span>
        <span className="font-normal text-slate-400">전월 대비</span>
      </div>
    </div>
  );
}

// ─── Insight Card ─────────────────────────────────────────────────────────────
function InsightCard({ icon, title, content, tag, action, tagColor }: {
  icon: string;
  title: string;
  content: string;
  tag: string;
  action?: string;
  tagColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="text-2xl leading-none">{icon}</div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColor}`}>{tag}</span>
      </div>
      <div>
        <div className="font-semibold text-slate-900 text-sm mb-1">{title}</div>
        <p className="text-xs text-slate-500 leading-relaxed">{content}</p>
      </div>
      {action && (
        <button className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">
          {action} →
        </button>
      )}
    </div>
  );
}

// ─── Main Statistics Component ────────────────────────────────────────────────
export default function Statistics() {
  const [dateFrom, setDateFrom] = useState("2024-01-01");
  const [dateTo, setDateTo] = useState("2024-12-31");
  const [contractView, setContractView] = useState<"type" | "region" | "age">("type");
  const [revenueView, setRevenueView] = useState<"monthly" | "weekly">("monthly");

  const quickPeriods = [
    { label: "올해", from: "2024-01-01", to: "2024-12-31" },
    { label: "상반기", from: "2024-01-01", to: "2024-06-30" },
    { label: "하반기", from: "2024-07-01", to: "2024-12-31" },
    { label: "최근 3개월", from: "2024-10-01", to: "2024-12-31" },
  ];

  // Computed KPIs
  const totalRevenue = useMemo(() => monthlyRevenue.reduce((s, m) => s + m.revenue, 0), []);
  const totalContracts = useMemo(() => monthlyRevenue.reduce((s, m) => s + m.contracts, 0), []);
  const avgRevenue = useMemo(() => Math.round(totalRevenue / totalContracts), [totalRevenue, totalContracts]);
  const lastMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2].revenue;
  const thisMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1].revenue;
  const revenueGrowth = pct(thisMonthRevenue, lastMonthRevenue);

  const totalMgmtFee = costItems.reduce((s, c) => s + c.amount, 0);

  const insights = [
    {
      icon: "📈",
      title: "7~11월 매출 연속 상승세",
      content: "5개월 연속 목표 대비 110% 이상 달성. 특히 9월·11월 역대 최고 매출 기록. 성수기 대응 인력 사전 확보 권장.",
      tag: "기회",
      tagColor: "bg-emerald-100 text-emerald-800",
      action: "수납 현황 확인",
    },
    {
      icon: "⚠️",
      title: "2월 매출 전월 대비 10% 하락",
      content: "2월은 계절적 비수기 특성상 계약 9건으로 최저. 비수기 대응 프로모션(할인, 사전예약) 기획이 필요합니다.",
      tag: "주의",
      tagColor: "bg-amber-100 text-amber-800",
      action: "예약 현황 확인",
    },
    {
      icon: "🏆",
      title: "60~70대 계약자 집중 (69%)",
      content: "60대 31%, 70대 38%로 전체의 약 70%를 차지. 해당 연령층 특화 상담 서비스 및 가족묘 패키지 강화 필요.",
      tag: "인사이트",
      tagColor: "bg-blue-100 text-blue-800",
      action: "계약 분석",
    },
    {
      icon: "📍",
      title: "서울·경기 계약 집중 (62%)",
      content: "수도권 계약이 전체의 62%. 인천·부산 지역 영업 강화 및 지역 대리점 연계로 지방 시장 확대 가능.",
      tag: "인사이트",
      tagColor: "bg-blue-100 text-blue-800",
      action: "지역별 상세 보기",
    },
    {
      icon: "🪨",
      title: "오석비·화강암비 석물 독주",
      content: "오석비(142건), 화강암비(98건)가 석물 전체의 46%를 차지. 중·저가 석물 집중 재고 관리 및 고가 석물 영업 기회 검토.",
      tag: "운영",
      tagColor: "bg-slate-100 text-slate-700",
      action: "석물 재고 확인",
    },
    {
      icon: "💰",
      title: "관리비 미납 리스크 상존",
      content: "전체 비용 항목 중 연간 관리비(5,840만원) 비중 최대. 장기미납 8건, 미납 23건 조기 수납 독려가 매출 방어에 핵심.",
      tag: "위험",
      tagColor: "bg-red-100 text-red-700",
      action: "미납 현황 조회",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">

      {/* ── DateRange + KPI ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 flex-wrap">
        <span className="text-sm font-semibold text-slate-700 shrink-0">조회 기간</span>
        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700" />
          <span className="text-slate-400">~</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700" />
        </div>
        <div className="flex gap-1.5">
          {quickPeriods.map((q) => (
            <button key={q.label} onClick={() => { setDateFrom(q.from); setDateTo(q.to); }}
              className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
              {q.label}
            </button>
          ))}
        </div>
        <button className="ml-auto px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ background: C.forest }}>
          조회
        </button>
        <div className="text-xs text-slate-400 shrink-0">{dateFrom} ~ {dateTo}</div>
      </div>

      {/* ── KPI Summary Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="총 매출액" value={fmtM(totalRevenue)} sub={fmtKRW(totalRevenue)} delta={revenueGrowth} />
        <KpiCard label="총 계약건수" value={`${totalContracts}건`} sub="목표 대비 112% 달성" delta={5.8} color={C.sage} />
        <KpiCard label="평균 계약단가" value={fmtM(avgRevenue)} sub="전년 대비 +8.2%" delta={8.2} color={C.teal} />
        <KpiCard label="이번달 매출" value={fmtM(thisMonthRevenue)} sub={`목표 ${fmtM(65000000)} 대비 105%`} delta={revenueGrowth} color={C.indigo} />
      </div>

      {/* ── Revenue Trend + Contract Type ─────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <ChartCard
          title="매출 추이"
          subtitle="월별 실적 vs 목표"
          className="col-span-2"
        >
          <div className="flex gap-2 mb-3">
            {(["monthly", "weekly"] as const).map((v) => (
              <button key={v} onClick={() => setRevenueView(v)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${revenueView === v ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                style={revenueView === v ? { background: C.forest } : {}}>
                {v === "monthly" ? "월별" : "주별"}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={240}>
            {revenueView === "monthly" ? (
              <AreaChart data={monthlyRevenue} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.forest} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={C.forest} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.amber} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.amber} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => fmtM(v)} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={52} />
                <Tooltip content={(p) => <RevenueTooltip {...p} />} />
                <Area type="monotone" dataKey="target" name="목표" stroke={C.amber} strokeWidth={1.5} strokeDasharray="4 4" fill="url(#gTarget)" />
                <Area type="monotone" dataKey="revenue" name="실적" stroke={C.forest} strokeWidth={2} fill="url(#gRevenue)" dot={{ r: 3, fill: C.forest, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              </AreaChart>
            ) : (
              <BarChart data={weeklyTrend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => fmtM(v)} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={52} />
                <Tooltip content={(p) => <RevenueTooltip {...p} />} />
                <Bar dataKey="revenue" name="주간매출" fill={C.forest} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="계약유형별 분포" subtitle="계약건수 기준">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byContractType} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                dataKey="value" nameKey="name" paddingAngle={3}>
                {byContractType.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
                <LabelList dataKey="name" position="outside" style={{ fontSize: 10, fill: "#64748b" }} />
              </Pie>
              <Tooltip content={(p) => <PieTooltip {...p} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            {byContractType.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: PIE_COLORS[i] }} />
                <span className="text-xs text-slate-600">{d.name}</span>
                <span className="text-xs font-semibold text-slate-800 ml-auto">{d.value}건</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Contract Analysis ─────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-4">
        <ChartCard title="계약 건수 분석" subtitle="지역별·연령대별 조회" className="col-span-3">
          <div className="flex gap-2 mb-3">
            {([
              { id: "region", label: "지역별" },
              { id: "age", label: "연령대별" },
              { id: "type", label: "유형별" },
            ] as const).map((v) => (
              <button key={v.id} onClick={() => setContractView(v.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${contractView === v.id ? "text-white" : "bg-slate-100 text-slate-600"}`}
                style={contractView === v.id ? { background: C.forest } : {}}>
                {v.label}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={210}>
            {contractView === "region" ? (
              <BarChart data={byRegion} margin={{ top: 0, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={(p) => <RevenueTooltip {...p} />} />
                <Bar dataKey="count" name="계약건수" fill={C.forest} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="count" position="top" style={{ fontSize: 10, fill: "#64748b" }} />
                </Bar>
              </BarChart>
            ) : contractView === "age" ? (
              <BarChart data={byAgeGroup} margin={{ top: 0, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="age" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={(p) => <RevenueTooltip {...p} />} />
                <Bar dataKey="count" name="계약건수" fill={C.sage} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="count" position="top" style={{ fontSize: 10, fill: "#64748b" }} />
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={byContractType} margin={{ top: 0, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={(p) => <RevenueTooltip {...p} />} />
                <Bar dataKey="value" name="계약건수" fill={C.teal} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="value" position="top" style={{ fontSize: 10, fill: "#64748b" }} />
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="계약건수 월별 추이" subtitle="계약 체결 건수" className="col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyRevenue} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip content={(p) => <RevenueTooltip {...p} />} />
              <Line type="monotone" dataKey="contracts" name="계약건수" stroke={C.sage} strokeWidth={2.5}
                dot={{ r: 4, fill: C.sage, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Cemetery Type + Cost Breakdown ───────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="묘지 형태별 현황" subtitle="전체 계약 묘지 유형 분포">
          <div className="flex gap-4 items-center">
            <div className="flex-shrink-0" style={{ width: 180, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCemeteryType} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="type">
                    {byCemeteryType.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip content={(p) => <PieTooltip {...p} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {byCemeteryType.map((d) => {
                const total = byCemeteryType.reduce((s, x) => s + x.count, 0);
                const pctVal = total > 0 ? Math.round((d.count / total) * 100) : 0;
                return (
                  <div key={d.type}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{d.type}</span>
                      <span className="font-semibold text-slate-900">{d.count}건 ({pctVal}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pctVal}%`, background: d.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="비용 항목별 수납 현황" subtitle="항목별 수납 금액 (단위: 만원)">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={costItems} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => fmtM(v)} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="item" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={72} />
              <Tooltip content={(p) => <RevenueTooltip {...p} />} />
              <Bar dataKey="amount" name="수납금액" fill={C.sage} radius={[0, 4, 4, 0]}>
                <LabelList dataKey="amount" position="right" formatter={(v: unknown) => fmtM(v as number)} style={{ fontSize: 10, fill: "#64748b" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
            <span>총 수납 합계</span>
            <span className="font-bold text-slate-900">{fmtKRW(totalMgmtFee)}</span>
          </div>
        </ChartCard>
      </div>

      {/* ── Stone Monument Chart (20 items) ──────────────────── */}
      <ChartCard title="석물 항목별 현황" subtitle="설치 석물 종류 및 건수 (전체 20개 항목)">
        <div className="grid grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={stoneItems.slice(0, 10)}
              layout="vertical"
              margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="item" tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} width={68} />
              <Tooltip content={(p) => <RevenueTooltip {...p} />} />
              <Bar dataKey="count" name="건수" fill={C.forest} radius={[0, 4, 4, 0]} maxBarSize={18}>
                <LabelList dataKey="count" position="right" style={{ fontSize: 11, fill: "#475569", fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={stoneItems.slice(10)}
              layout="vertical"
              margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="item" tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} width={68} />
              <Tooltip content={(p) => <RevenueTooltip {...p} />} />
              <Bar dataKey="count" name="건수" fill={C.sage} radius={[0, 4, 4, 0]} maxBarSize={18}>
                <LabelList dataKey="count" position="right" style={{ fontSize: 11, fill: "#475569", fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: C.forest }} /> 상위 10개</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: C.sage }} /> 하위 10개</span>
          </div>
          <span>총 <strong className="text-slate-800">{stoneItems.reduce((s, d) => s + d.count, 0)}</strong>건</span>
        </div>
      </ChartCard>

      {/* ── Insights + Action Items ───────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">매출 시사점 · 다음 액션</h3>
            <p className="text-xs text-slate-400 mt-0.5">데이터 기반 핵심 인사이트 및 권장 조치사항</p>
          </div>
          <span className="text-xs text-slate-400">{dateFrom} ~ {dateTo} 기준 분석</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {insights.map((ins, i) => (
            <InsightCard key={i} {...ins} />
          ))}
        </div>
      </div>

      {/* ── Revenue vs Target Heatmap Table ──────────────────── */}
      <ChartCard title="월별 목표 달성률" subtitle="실적 vs 목표 비교 (색상: 달성률)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["월", "목표", "실적", "달성률", "계약건수", "평균단가"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyRevenue.map((m) => {
                const rate = (m.revenue / m.target) * 100;
                const bg = rate >= 110 ? "#d1fae5" : rate >= 100 ? "#e0f2fe" : rate >= 90 ? "#fef3c7" : "#fee2e2";
                const textColor = rate >= 110 ? "#065f46" : rate >= 100 ? "#0c4a6e" : rate >= 90 ? "#92400e" : "#991b1b";
                return (
                  <tr key={m.month} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2.5 font-semibold text-slate-800">{m.month}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-slate-500">{fmtM(m.target)}</td>
                    <td className="px-3 py-2.5 font-mono text-xs font-semibold text-slate-900">{fmtM(m.revenue)}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: bg, color: textColor }}>
                        {rate.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center font-mono text-sm font-semibold" style={{ color: C.sage }}>{m.contracts}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-slate-600">{fmtM(Math.round(m.revenue / m.contracts))}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200">
                <td className="px-3 py-3 font-bold text-slate-900">합계</td>
                <td className="px-3 py-3 font-mono text-xs font-semibold">{fmtM(monthlyRevenue.reduce((s, m) => s + m.target, 0))}</td>
                <td className="px-3 py-3 font-mono text-xs font-bold" style={{ color: C.forest }}>{fmtM(totalRevenue)}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {((totalRevenue / monthlyRevenue.reduce((s, m) => s + m.target, 0)) * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-3 py-3 text-center font-mono font-bold" style={{ color: C.sage }}>{totalContracts}</td>
                <td className="px-3 py-3 font-mono text-xs font-semibold text-slate-700">{fmtM(avgRevenue)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </ChartCard>

    </div>
  );
}
