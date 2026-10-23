import { useState, useRef, useEffect } from "react";
import Statistics from "./Statistics";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page =
  | "dashboard"
  | "contracts"
  | "contract-detail"
  | "plots"
  | "payments"
  | "consultations"
  | "termination"
  | "statistics"
  | "reports"
  | "settings"
  | "notifications";

type ContractStatus = "상담" | "예약" | "계약" | "해약";
type PaymentStatus = "납부완료" | "부분납부" | "미납" | "장기미납";
type PlotStatus = "판매가능" | "예약" | "계약" | "설묘" | "안치" | "이장" | "사용불가";
type SigningStatus = "생성" | "서명요청" | "서명완료" | "체결" | "반려" | "재요청" | "만료";

interface Contract {
  id: string;
  memberNo: string;
  contractorName: string;
  phone: string;
  plotNumber: string;
  plotType: string;
  deceasedName: string;
  contractDate: string;
  managementStart: string;
  managementEnd: string;
  contractAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  paymentStatus: PaymentStatus;
  contractStatus: ContractStatus;
  managementFee: number;
  address: string;
  email: string;
  applicant1: string;
  applicant2?: string;
  deceased2?: string;
  deathDate: string;
  deathCause: string;
  burialDate: string;
  plotSize: string;
  unitPrice: number;
  deposit: number;
  interim: number;
  balance: number;
  facilityFee: number;
  memo?: string;
  signingStatus: SigningStatus;
  rejectionReason?: string;
}

interface DeceasedPerson {
  id: string;
  name: string;
  deathDate: string;
  burialDate: string;
  deathCause: string;
  deathPlace: string;
  relation: string;
  memo?: string;
}

interface MemoEntry {
  id: string;
  content: string;
  createdAt: string;
  author: string;
}

interface UploadedDoc {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  category: string;
}

interface ManagementFeeRecord {
  id: string;
  period: string;
  amount: number;
  dueDate: string;
  billedDate: string;
  status: "청구완료" | "납부완료" | "미납";
  method: string;
}

interface Plot {
  id: string;
  number: string;
  status: PlotStatus;
  contractorName?: string;
  deceasedName?: string;
  contractDate?: string;
  burialDate?: string;
  managementEnd?: string;
  size: string;
  unitPrice: number;
  row: number;
  col: number;
}

interface ConsultationEntry {
  id: string;
  date: string;
  memberNo: string;
  contractorName: string;
  category: "상담" | "민원";
  type: string;
  content: string;
  action: string;
  handler: string;
  status: "처리완료" | "처리중" | "미처리";
}

interface PaymentRecord {
  id: string;
  memberNo: string;
  contractorName: string;
  deceasedName: string;
  period: string;
  targetAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  paymentDate?: string;
  paymentMethod?: string;
  status: PaymentStatus;
  billedDate?: string;
}

interface Notification {
  id: string;
  type: "미납" | "서명" | "민원" | "청구" | "만료" | "장기미납" | "신규";
  content: string;
  time: string;
  read: boolean;
  page: Page;
  filter?: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
const initialContracts: Contract[] = [
  {
    id: "c001", memberNo: "M2024-0001", contractorName: "김민준", phone: "010-3245-8876",
    plotNumber: "A-12-05", plotType: "평장묘", deceasedName: "김영철",
    contractDate: "2024-01-15", managementStart: "2024-01-15", managementEnd: "2034-01-14",
    contractAmount: 4500000, paidAmount: 4500000, unpaidAmount: 0,
    paymentStatus: "납부완료", contractStatus: "계약", managementFee: 150000,
    address: "서울시 강남구 논현동 123-45", email: "kim.minjun@email.com",
    applicant1: "김민준", applicant2: "이수진", deathDate: "2023-12-20", deathCause: "노환",
    burialDate: "2024-01-15", plotSize: "3평", unitPrice: 1200000,
    deposit: 1000000, interim: 2000000, balance: 1500000, facilityFee: 500000,
    memo: "가족묘 설치 예정. 향후 안치자 추가 가능성 있음.", signingStatus: "체결",
  },
  {
    id: "c002", memberNo: "M2024-0018", contractorName: "이서연", phone: "010-9912-3344",
    plotNumber: "B-03-12", plotType: "봉안묘", deceasedName: "이강호",
    contractDate: "2024-03-08", managementStart: "2024-03-08", managementEnd: "2034-03-07",
    contractAmount: 3200000, paidAmount: 1600000, unpaidAmount: 1600000,
    paymentStatus: "부분납부", contractStatus: "계약", managementFee: 120000,
    address: "경기도 성남시 분당구 정자동 88", email: "seo.yeon@naver.com",
    applicant1: "이서연", deathDate: "2024-02-28", deathCause: "심근경색",
    burialDate: "2024-03-08", plotSize: "2평", unitPrice: 1100000,
    deposit: 800000, interim: 800000, balance: 1600000, facilityFee: 300000,
    signingStatus: "서명요청",
  },
  {
    id: "c003", memberNo: "M2023-0142", contractorName: "박지호", phone: "010-5567-2289",
    plotNumber: "C-07-03", plotType: "매장묘", deceasedName: "박순자",
    contractDate: "2023-09-22", managementStart: "2023-09-22", managementEnd: "2033-09-21",
    contractAmount: 5800000, paidAmount: 5800000, unpaidAmount: 0,
    paymentStatus: "납부완료", contractStatus: "계약", managementFee: 180000,
    address: "부산시 해운대구 우동 456", email: "parkjiho@gmail.com",
    applicant1: "박지호", deceased2: "박완수", deathDate: "2023-09-10", deathCause: "폐암",
    burialDate: "2023-09-22", plotSize: "4평", unitPrice: 1300000,
    deposit: 1500000, interim: 2000000, balance: 2300000, facilityFee: 600000,
    signingStatus: "체결",
  },
  {
    id: "c004", memberNo: "M2022-0089", contractorName: "최수현", phone: "010-7788-4455",
    plotNumber: "A-05-18", plotType: "가족평장묘", deceasedName: "최광호",
    contractDate: "2022-06-14", managementStart: "2022-06-14", managementEnd: "2027-06-13",
    contractAmount: 3800000, paidAmount: 3800000, unpaidAmount: 0,
    paymentStatus: "납부완료", contractStatus: "계약", managementFee: 140000,
    address: "서울시 송파구 잠실동 234", email: "choi.suhyun@kakao.com",
    applicant1: "최수현", deathDate: "2022-06-05", deathCause: "뇌졸중",
    burialDate: "2022-06-14", plotSize: "3평", unitPrice: 1100000,
    deposit: 1000000, interim: 1500000, balance: 1300000, facilityFee: 400000,
    signingStatus: "체결",
  },
  {
    id: "c005", memberNo: "M2024-0033", contractorName: "정우진", phone: "010-2233-6677",
    plotNumber: "D-01-07", plotType: "사용지", deceasedName: "정현숙",
    contractDate: "2024-05-20", managementStart: "2024-05-20", managementEnd: "2034-05-19",
    contractAmount: 2900000, paidAmount: 0, unpaidAmount: 2900000,
    paymentStatus: "미납", contractStatus: "계약", managementFee: 110000,
    address: "인천시 남동구 구월동 789", email: "jung.wj@email.com",
    applicant1: "정우진", deathDate: "2024-05-10", deathCause: "교통사고",
    burialDate: "2024-05-20", plotSize: "2평", unitPrice: 1050000,
    deposit: 0, interim: 0, balance: 2900000, facilityFee: 250000,
    memo: "납부 독촉 2회 발송. 다음달 재청구 예정.", signingStatus: "반려",
    rejectionReason: "계약서 서명란 누락 및 인감 불일치로 반려되었습니다. 계약서를 수정하여 재발송해 주세요.",
  },
  {
    id: "c006", memberNo: "M2021-0055", contractorName: "한소희", phone: "010-8844-1122",
    plotNumber: "B-09-21", plotType: "예정지", deceasedName: "한영수",
    contractDate: "2021-11-03", managementStart: "2021-11-03", managementEnd: "2023-11-02",
    contractAmount: 4200000, paidAmount: 4200000, unpaidAmount: 0,
    paymentStatus: "미납", contractStatus: "계약", managementFee: 160000,
    address: "대전시 유성구 봉명동 321", email: "han.sohee@naver.com",
    applicant1: "한소희", deathDate: "2021-10-25", deathCause: "간암",
    burialDate: "2021-11-03", plotSize: "3평", unitPrice: 1200000,
    deposit: 1200000, interim: 1500000, balance: 1500000, facilityFee: 450000,
    memo: "관리기간 만료. 갱신 연락 필요.", signingStatus: "체결",
  },
  {
    id: "c007", memberNo: "M2024-0051", contractorName: "윤재원", phone: "010-6655-9988",
    plotNumber: "A-14-02", plotType: "평장묘", deceasedName: "윤명자",
    contractDate: "2024-07-01", managementStart: "2024-07-01", managementEnd: "2034-06-30",
    contractAmount: 5200000, paidAmount: 5200000, unpaidAmount: 0,
    paymentStatus: "납부완료", contractStatus: "예약", managementFee: 170000,
    address: "서울시 마포구 합정동 567", email: "yoon.jw@gmail.com",
    applicant1: "윤재원", applicant2: "윤승현", deathDate: "2024-06-22", deathCause: "노환",
    burialDate: "2024-07-01", plotSize: "4평", unitPrice: 1250000,
    deposit: 1500000, interim: 2000000, balance: 1700000, facilityFee: 550000,
    signingStatus: "서명요청",
  },
  {
    id: "c008", memberNo: "M2020-0011", contractorName: "신지아", phone: "010-1144-7766",
    plotNumber: "C-11-15", plotType: "일반형", deceasedName: "신병국",
    contractDate: "2020-04-18", managementStart: "2020-04-18", managementEnd: "2022-04-17",
    contractAmount: 3500000, paidAmount: 3500000, unpaidAmount: 0,
    paymentStatus: "장기미납", contractStatus: "계약", managementFee: 130000,
    address: "광주시 북구 운암동 890", email: "shin.jia@kakao.com",
    applicant1: "신지아", deathDate: "2020-04-05", deathCause: "심부전",
    burialDate: "2020-04-18", plotSize: "3평", unitPrice: 1100000,
    deposit: 1000000, interim: 1500000, balance: 1000000, facilityFee: 350000,
    memo: "관리비 3년 이상 미납. 법적 조치 검토 중.", signingStatus: "체결",
  },
];

const plotGrid: Plot[] = Array.from({ length: 48 }, (_, i) => {
  const row = Math.floor(i / 8) + 1;
  const col = (i % 8) + 1;
  const statuses: PlotStatus[] = ["안치", "계약", "설묘", "판매가능", "예약", "사용불가", "이장", "안치"];
  const status = statuses[i % statuses.length];
  const contractorNames = ["김민준", "이서연", "박지호", "최수현", "정우진", undefined, "윤재원", undefined];
  const deceased = ["김영철", "이강호", "박순자", "최광호", "정현숙", undefined, "윤명자", undefined];
  return {
    id: `plot-${i}`,
    number: `A-${String(row).padStart(2, "0")}-${String(col).padStart(2, "0")}`,
    status,
    contractorName: contractorNames[i % contractorNames.length] ?? undefined,
    deceasedName: deceased[i % deceased.length] ?? undefined,
    contractDate: status !== "판매가능" && status !== "사용불가" ? "2023-04-12" : undefined,
    burialDate: ["안치", "설묘"].includes(status) ? "2023-05-01" : undefined,
    managementEnd: ["안치", "계약", "설묘"].includes(status) ? "2033-04-11" : undefined,
    size: ["2평", "3평", "4평"][i % 3],
    unitPrice: [1050000, 1200000, 1350000][i % 3],
    row,
    col,
  } as Plot;
});

const initialConsultations: ConsultationEntry[] = [
  { id: "cs001", date: "2024-07-15 14:30", memberNo: "M2024-0033", contractorName: "정우진", category: "상담", type: "비용/결제", content: "관리비 납부 독촉 연락. 8월 말까지 납부 약속.", action: "8월 말 재확인 예정", handler: "김담당", status: "처리중" },
  { id: "cs002", date: "2024-07-12 10:15", memberNo: "M2021-0055", contractorName: "한소희", category: "상담", type: "재계약/갱신", content: "관리기간 갱신 가능 여부 문의. 갱신 절차 안내.", action: "갱신 안내서 우편 발송", handler: "이담당", status: "처리완료" },
  { id: "cs003", date: "2024-07-10 16:00", memberNo: "M2024-0001", contractorName: "김민준", category: "상담", type: "계약 변경", content: "계약자 주소 변경 요청. 새 주소: 서울시 강남구 역삼동 456.", action: "주소 변경 처리 완료", handler: "박담당", status: "처리완료" },
  { id: "cs004", date: "2024-07-08 09:30", memberNo: "M2020-0011", contractorName: "신지아", category: "민원", type: "시설/환경", content: "관리 상태 불량 민원. 주변 잡초 제거 요청.", action: "묘역 관리팀 현장 점검 지시", handler: "김담당", status: "처리중" },
  { id: "cs005", date: "2024-07-05 13:45", memberNo: "M2023-0142", contractorName: "박지호", category: "민원", type: "안치/묘역", content: "묘비 균열 발생으로 보수 요청. 현장 확인 필요.", action: "다음 주 현장 방문 예약", handler: "이담당", status: "미처리" },
  { id: "cs006", date: "2024-07-01 11:00", memberNo: "M2024-0051", contractorName: "윤재원", category: "상담", type: "신규계약", content: "신규 계약 상담. 수목장 구역 문의 및 가격 안내.", action: "안내 자료 이메일 발송", handler: "박담당", status: "처리완료" },
  { id: "cs007", date: "2024-06-28 15:20", memberNo: "M2022-0089", contractorName: "최수현", category: "민원", type: "계약/요금", content: "관리비 인상 관련 불만 접수.", action: "관리비 정책 안내서 발송", handler: "이담당", status: "미처리" },
];

const initialPayments: PaymentRecord[] = [
  { id: "p001", memberNo: "M2024-0001", contractorName: "김민준", deceasedName: "김영철", period: "2024.01 ~ 2025.01", targetAmount: 150000, paidAmount: 150000, unpaidAmount: 0, paymentDate: "2024-01-15", paymentMethod: "계좌이체", status: "납부완료", billedDate: "2024-01-01" },
  { id: "p002", memberNo: "M2024-0018", contractorName: "이서연", deceasedName: "이강호", period: "2024.03 ~ 2025.03", targetAmount: 120000, paidAmount: 60000, unpaidAmount: 60000, paymentDate: "2024-03-08", paymentMethod: "카드", status: "부분납부", billedDate: "2024-03-01" },
  { id: "p003", memberNo: "M2024-0033", contractorName: "정우진", deceasedName: "정현숙", period: "2024.05 ~ 2025.05", targetAmount: 110000, paidAmount: 0, unpaidAmount: 110000, status: "미납", billedDate: "2024-05-01" },
  { id: "p004", memberNo: "M2021-0055", contractorName: "한소희", deceasedName: "한영수", period: "2023.11 ~ 2024.11", targetAmount: 160000, paidAmount: 0, unpaidAmount: 160000, status: "장기미납", billedDate: "2023-11-01" },
  { id: "p005", memberNo: "M2020-0011", contractorName: "신지아", deceasedName: "신병국", period: "2022.04 ~ 2023.04", targetAmount: 130000, paidAmount: 0, unpaidAmount: 390000, status: "장기미납", billedDate: "2022-04-01" },
  { id: "p006", memberNo: "M2023-0142", contractorName: "박지호", deceasedName: "박순자", period: "2024.09 ~ 2025.09", targetAmount: 180000, paidAmount: 180000, unpaidAmount: 0, paymentDate: "2024-09-22", paymentMethod: "현금", status: "납부완료", billedDate: "2024-09-01" },
];

const sampleNotifications: Notification[] = [
  { id: "n1", type: "미납", content: "정우진 고객 관리비 2개월 연체 — 납부 독촉 조치 필요", time: "5분 전", read: false, page: "payments" },
  { id: "n2", type: "서명", content: "이서연 고객 계약서 서명 미완료 3일 경과 — 재발송 검토", time: "1시간 전", read: false, page: "contracts" },
  { id: "n3", type: "민원", content: "박지호 묘비 보수 요청 미처리 — 현장 점검 일정 필요", time: "2일 전", read: false, page: "consultations" },
  { id: "n4", type: "청구", content: "이번달 관리비 청구 대상 18건 — 이번주 내 발송 권장", time: "오늘 09:00", read: true, page: "payments" },
  { id: "n5", type: "만료", content: "한소희 관리기간 만료 (2023.11) — 갱신 안내 발송 필요", time: "어제", read: true, page: "contracts" },
  { id: "n6", type: "장기미납", content: "신지아 관리비 36개월 장기미납 — 법적 조치 검토 요청", time: "3일 전", read: true, page: "payments" },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
function formatKRW(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

function now() {
  return new Date().toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

// ─── Badge Components ─────────────────────────────────────────────────────────
function ContractStatusBadge({ status }: { status: ContractStatus }) {
  const map: Record<ContractStatus, string> = {
    상담: "bg-slate-100 text-slate-700",
    예약: "bg-amber-100 text-amber-800",
    계약: "bg-emerald-100 text-emerald-800",
    해약: "bg-red-100 text-red-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{status}</span>;
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, string> = {
    납부완료: "bg-emerald-100 text-emerald-800",
    부분납부: "bg-blue-100 text-blue-800",
    미납: "bg-red-100 text-red-700",
    장기미납: "bg-red-900 text-red-100",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{status}</span>;
}

function PlotStatusBadge({ status }: { status: PlotStatus }) {
  const map: Record<PlotStatus, string> = {
    판매가능: "bg-emerald-100 text-emerald-800",
    예약: "bg-amber-100 text-amber-800",
    계약: "bg-blue-100 text-blue-800",
    설묘: "bg-indigo-100 text-indigo-800",
    안치: "bg-indigo-900 text-indigo-100",
    이장: "bg-orange-100 text-orange-800",
    사용불가: "bg-slate-200 text-slate-600",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{status}</span>;
}

function SigningStatusBadge({ status }: { status: SigningStatus }) {
  const map: Record<SigningStatus, string> = {
    생성: "bg-slate-100 text-slate-700",
    서명요청: "bg-blue-100 text-blue-800",
    서명완료: "bg-cyan-100 text-cyan-800",
    체결: "bg-emerald-100 text-emerald-800",
    반려: "bg-red-100 text-red-700",
    재요청: "bg-orange-100 text-orange-800",
    만료: "bg-slate-200 text-slate-500",
  };
  const label: Record<SigningStatus, string> = {
    생성: "계약생성", 서명요청: "서명요청", 서명완료: "서명완료", 체결: "계약체결", 반려: "서명반려", 재요청: "재서명요청", 만료: "기한만료",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{label[status]}</span>;
}

function ConsultationStatusBadge({ status }: { status: ConsultationEntry["status"] }) {
  const map = {
    처리완료: "bg-emerald-100 text-emerald-800",
    처리중: "bg-amber-100 text-amber-800",
    미처리: "bg-red-100 text-red-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{status}</span>;
}

function NotifTypeBadge({ type }: { type: Notification["type"] }) {
  const map: Record<Notification["type"], string> = {
    미납: "bg-red-100 text-red-700",
    서명: "bg-blue-100 text-blue-800",
    민원: "bg-violet-100 text-violet-800",
    청구: "bg-amber-100 text-amber-800",
    만료: "bg-orange-100 text-orange-800",
    장기미납: "bg-red-900 text-red-100",
    신규: "bg-emerald-100 text-emerald-800",
  };
  return <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${map[type]}`}>{type}</span>;
}

// ─── Icon ─────────────────────────────────────────────────────────────────────
function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 13.5h7.5v-9H3v9zm0 6h7.5v-4.5H3V19.5zm9-6H21v-9h-9v9zm0 6h9v-4.5h-9V19.5z" />,
    contracts: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    plots: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />,
    payments: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    consultations: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    termination: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    reports: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    bell: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
    chevronRight: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
    alert: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    x: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    map: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />,
    send: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    file: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    refresh: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    document: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[18px] h-[18px]">
      {icons[name] ?? <circle cx="12" cy="12" r="9" />}
    </svg>
  );
}

// ─── Reusable Modal ───────────────────────────────────────────────────────────
function Modal({ title, onClose, children, footer, size = "md" }: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const widths = { sm: "w-[440px]", md: "w-[600px]", lg: "w-[780px]" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className={`bg-white rounded-2xl shadow-2xl flex flex-col max-h-[88vh] ${widths[size]}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 shrink-0">
          <h2 className="font-bold text-slate-900 text-base">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1"><Icon name="x" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "sm", disabled }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "xs" | "sm" | "md";
  disabled?: boolean;
}) {
  const base = "inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = { xs: "px-2.5 py-1 text-xs", sm: "px-4 py-2 text-sm", md: "px-5 py-2.5 text-sm" };
  const variants = {
    primary: "text-white hover:opacity-90",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-slate-600 hover:bg-slate-100",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]}`}
      style={variant === "primary" ? { background: "#1E3A2B" } : {}}
    >
      {children}
    </button>
  );
}

function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Input({ placeholder, defaultValue, disabled, value, onChange }: {
  placeholder?: string; defaultValue?: string; disabled?: boolean;
  value?: string; onChange?: (v: string) => void;
}) {
  return (
    <input
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:bg-slate-50 disabled:text-slate-400"
    />
  );
}

function Select({ options, value, onChange }: { options: string[]; value?: string; onChange?: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white"
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "대시보드", icon: "dashboard" },
  { id: "contracts", label: "계약관리", icon: "contracts" },
  { id: "plots", label: "묘역관리", icon: "plots" },
  { id: "payments", label: "수납·청구", icon: "payments" },
  { id: "consultations", label: "상담·민원", icon: "consultations" },
  { id: "termination", label: "해약·이장", icon: "termination" },
  { id: "statistics", label: "통계관리", icon: "reports" },
  { id: "reports", label: "리포트", icon: "reports" },
  { id: "settings", label: "설정", icon: "settings" },
];

function Sidebar({ current, onNav }: { current: Page; onNav: (p: Page) => void }) {
  return (
    <aside className="flex flex-col w-56 shrink-0 h-full" style={{ background: "#1E3A2B", borderRight: "1px solid #2d5940" }}>
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#3B7A57" }}>
          <span className="text-white text-xs font-bold">묘</span>
        </div>
        <div>
          <div className="text-white font-semibold text-sm leading-tight">묘원365</div>
          <div className="text-[10px] leading-tight" style={{ color: "#7aaa90" }}>공원묘원 관리 플랫폼</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = current === item.id || (current === "contract-detail" && item.id === "contracts");
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id as Page)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 text-left"
              style={active ? { background: "#3B7A57", color: "white" } : { color: "#A7C4B0" }}
            >
              <Icon name={item.icon} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: "#3B7A57" }}>관</div>
          <div>
            <div className="text-white text-xs font-medium">관리자</div>
            <div className="text-[10px]" style={{ color: "#7aaa90" }}>admin@myowon365.kr</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Notification Panel ───────────────────────────────────────────────────────
function NotificationPanel({ notifications, onClose, onNavigate, onViewAll }: {
  notifications: Notification[];
  onClose: () => void;
  onNavigate: (p: Page) => void;
  onViewAll: () => void;
}) {
  const [list, setList] = useState(notifications);
  const unread = list.filter((n) => !n.read).length;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-12 right-16 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl w-96 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 text-sm">알림</span>
          {unread > 0 && (
            <span className="text-xs font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: "#ef4444" }}>{unread}</span>
          )}
        </div>
        <button
          onClick={() => setList(list.map((n) => ({ ...n, read: true })))}
          className="text-xs text-slate-500 hover:text-slate-800 font-medium"
        >
          모두 읽음
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
        {list.map((n) => (
          <button
            key={n.id}
            onClick={() => {
              setList(list.map((x) => x.id === n.id ? { ...x, read: true } : x));
              onNavigate(n.page);
              onClose();
            }}
            className={`w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors ${n.read ? "opacity-60" : ""}`}
          >
            {!n.read && <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: "#ef4444" }} />}
            {n.read && <span className="mt-1.5 w-2 h-2 rounded-full shrink-0 bg-transparent" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <NotifTypeBadge type={n.type} />
              </div>
              <p className="text-xs text-slate-700 leading-snug">{n.content}</p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{n.time}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="border-t border-slate-100 px-4 py-2.5 text-center">
        <button onClick={() => { onViewAll(); onClose(); }} className="text-xs font-medium" style={{ color: "#1E3A2B" }}>전체 알림 보기</button>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({
  breadcrumb,
  onSearchSubmit,
  onNav,
  notifications,
}: {
  breadcrumb: string[];
  onSearchSubmit: (q: string) => void;
  onNav: (p: Page) => void;
  notifications: Notification[];
}) {
  const [q, setQ] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-14 shrink-0 bg-white border-b border-slate-200 flex items-center px-6 gap-4 relative">
      <div className="flex items-center gap-1.5 text-sm text-slate-500 mr-auto">
        {breadcrumb.map((b, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-slate-300"><Icon name="chevronRight" /></span>}
            <span className={i === breadcrumb.length - 1 ? "font-semibold text-slate-800" : ""}>{b}</span>
          </span>
        ))}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="search" /></span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) { onSearchSubmit(q.trim()); setQ(""); } }}
          placeholder="검색 후 Enter..."
          className="pl-9 pr-4 py-2 text-sm border-2 border-slate-200 rounded-lg w-72 focus:outline-none focus:ring-0 focus:border-[#1E3A2B] bg-slate-50 transition-colors duration-150"
        />
      </div>
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
        >
          <Icon name="bell" />
          {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />}
        </button>
        {notifOpen && (
          <NotificationPanel
            notifications={notifications}
            onClose={() => setNotifOpen(false)}
            onNavigate={(p) => { onNav(p); }}
            onViewAll={() => { onNav("notifications"); }}
          />
        )}
      </div>
    </header>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
interface DashboardFilter {
  page: Page;
  paymentStatus?: PaymentStatus;
  contractStatus?: ContractStatus;
  consultStatus?: ConsultationEntry["status"];
  paymentsTab?: string;
}

function Dashboard({ onNav, onFilter }: { onNav: (p: Page) => void; onFilter: (f: DashboardFilter) => void }) {
  const contractStateCards = [
    { label: "계약생성", value: "7", sub: "서명요청 발송 필요", color: "#475569", alert: false, filter: { page: "contracts" as Page } },
    { label: "서명요청", value: "4", sub: "만료 3일 이내 긴급", color: "#2563eb", alert: true, filter: { page: "contracts" as Page } },
    { label: "서명완료", value: "11", sub: "관리자 최종 검토 필요", color: "#0891b2", alert: false, filter: { page: "contracts" as Page } },
    { label: "서명반려", value: "3", sub: "반려 사유 확인 필요", color: "#dc2626", alert: true, filter: { page: "contracts" as Page } },
    { label: "기한만료", value: "2", sub: "계약 의사 재확인 필요", color: "#92400e", alert: true, filter: { page: "contracts" as Page } },
  ];

  const paymentCards = [
    { label: "미납", value: "23", sub: "총 38,200,000원", color: "#ef4444", alert: true, filter: { page: "payments" as Page, paymentsTab: "unpaid" } },
    { label: "부분납부", value: "11", sub: "잔액 확인 필요", color: "#d97706", alert: false, filter: { page: "payments" as Page, paymentsTab: "pending" } },
    { label: "수동입금", value: "6", sub: "오늘 확인 필요", color: "#1d4ed8", alert: false, filter: { page: "payments" as Page } },
  ];

  const opCards = [
    { label: "장기미납", value: "8", sub: "6개월 이상", color: "#991b1b", alert: true, filter: { page: "payments" as Page, paymentsTab: "longterm" } },
    { label: "민원·상담", value: "5", sub: "미처리 건", color: "#7c3aed", alert: false, filter: { page: "consultations" as Page, consultStatus: "미처리" as ConsultationEntry["status"] } },
    { label: "이장 예정", value: "3", sub: "이번달", color: "#ea580c", alert: false, filter: { page: "termination" as Page } },
    { label: "해약 처리", value: "2", sub: "진행 중", color: "#64748b", alert: false, filter: { page: "termination" as Page } },
  ];

  const plotStats = [
    { label: "안치", count: 187, color: "#312e81", pct: 65 },
    { label: "계약", count: 28, color: "#1d4ed8", pct: 10 },
    { label: "설묘", count: 15, color: "#4f46e5", pct: 5 },
    { label: "예약", count: 8, color: "#b45309", pct: 3 },
    { label: "판매가능", count: 42, color: "#065f46", pct: 15 },
    { label: "사용불가", count: 6, color: "#475569", pct: 2 },
  ];
  const totalPlots = plotStats.reduce((s, p) => s + p.count, 0);

  const alerts: Array<{ icon: string; msg: string; color: string; filter: DashboardFilter }> = [
    { icon: "alert", msg: "정우진 고객 관리비 미납 2개월 경과", color: "text-red-600", filter: { page: "payments", paymentStatus: "미납" } },
    { icon: "alert", msg: "한소희 고객 관리기간 만료 (2023.11)", color: "text-amber-600", filter: { page: "contracts", contractStatus: "계약" } },
    { icon: "alert", msg: "신지아 고객 관리비 장기미납 (36개월)", color: "text-red-700", filter: { page: "payments", paymentsTab: "longterm" } },
    { icon: "bell", msg: "박지호 고객 묘비 보수 요청 접수", color: "text-violet-600", filter: { page: "consultations", consultStatus: "미처리" } },
    { icon: "bell", msg: "윤재원 계약 서명 요청 대기 3일 경과", color: "text-blue-600", filter: { page: "contracts" } },
  ];
  const times = ["방금", "1시간 전", "오늘", "2일 전", "3일 전"];

  const urgentTasks = [
    { badge: "서명만료", badgeColor: "bg-orange-100 text-orange-800", name: "이서연", detail: "서명 기한 오늘 23:59 만료 예정", action: () => onFilter({ page: "contracts" }) },
    { badge: "이장예정", badgeColor: "bg-amber-100 text-amber-700", name: "박지호", detail: "오늘 오전 11시 이장 작업 예정 (A-12-05)", action: () => onFilter({ page: "termination" }) },
    { badge: "서명만료", badgeColor: "bg-orange-100 text-orange-800", name: "윤재원", detail: "서명 기한 오늘 23:59 만료 예정", action: () => onFilter({ page: "contracts" }) },
    { badge: "관리만료", badgeColor: "bg-red-100 text-red-800", name: "정우진", detail: "관리기간 오늘 만료 — 갱신 연락 필요", action: () => onFilter({ page: "contracts", contractStatus: "계약" }) },
    { badge: "납부확인", badgeColor: "bg-blue-100 text-blue-800", name: "한소희", detail: "수동입금 확인 대기 (예금주: 한소희)", action: () => onFilter({ page: "payments" }) },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* 계약 상태 */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">계약 상태</p>
        <div className="grid grid-cols-5 gap-3">
          {contractStateCards.map((s) => (
            <button key={s.label} onClick={() => onFilter(s.filter)}
              className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all text-left relative">
              {s.alert && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500" />}
              <div className="text-xs font-medium text-slate-500 mb-1.5">{s.label}</div>
              <div className="flex items-end gap-0.5 mb-1">
                <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
                <span className="text-xs font-medium pb-0.5 ml-0.5" style={{ color: s.color }}>건</span>
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">{s.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 납부 + 운영 */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">납부 관리</p>
          <div className="grid grid-cols-3 gap-3">
            {paymentCards.map((s) => (
              <button key={s.label} onClick={() => onFilter(s.filter)}
                className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all text-left relative">
                {s.alert && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500" />}
                <div className="text-xs font-medium text-slate-500 mb-1.5">{s.label}</div>
                <div className="flex items-end gap-0.5 mb-1">
                  <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
                  <span className="text-xs font-medium pb-0.5 ml-0.5" style={{ color: s.color }}>건</span>
                </div>
                <div className="text-[11px] text-slate-400">{s.sub}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">운영 현황</p>
          <div className="grid grid-cols-4 gap-3">
            {opCards.map((s) => (
              <button key={s.label} onClick={() => onFilter(s.filter)}
                className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all text-left relative">
                {s.alert && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500" />}
                <div className="text-xs font-medium text-slate-500 mb-1.5">{s.label}</div>
                <div className="flex items-end gap-0.5 mb-1">
                  <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
                  <span className="text-xs font-medium pb-0.5 ml-0.5" style={{ color: s.color }}>건</span>
                </div>
                <div className="text-[11px] text-slate-400">{s.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 긴급 업무 + 알림 + 묘역현황 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">오늘 처리가 임박한 긴급 업무</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">{urgentTasks.length}건</span>
          </div>
          <div className="divide-y divide-slate-50">
            {urgentTasks.map((t, i) => (
              <button key={i} onClick={t.action}
                className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-slate-50 transition-colors">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${t.badgeColor}`}>{t.badge}</span>
                <span className="font-semibold text-slate-800 text-sm shrink-0 w-16">{t.name}</span>
                <span className="text-xs text-slate-500 flex-1 truncate">{t.detail}</span>
                <span className="text-slate-300 shrink-0"><Icon name="chevronRight" /></span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">처리 필요 알림</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {alerts.map((a, i) => (
                <button key={i} onClick={() => onFilter(a.filter)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors">
                  <span className={`mt-0.5 ${a.color}`}><Icon name={a.icon} /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-snug">{a.msg}</p>
                    <span className="text-[10px] text-slate-400">{times[i]}</span>
                  </div>
                  <span className="text-slate-300 mt-0.5"><Icon name="chevronRight" /></span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 text-sm mb-3">묘역 현황</h3>
            <div className="space-y-2">
              {plotStats.map((ps) => {
                const pct = Math.round((ps.count / totalPlots) * 100);
                return (
                  <div key={ps.label} className="flex items-center gap-2">
                    <span className="text-xs font-medium w-14 shrink-0" style={{ color: ps.color }}>{ps.label}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-1 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${ps.pct}%`, background: ps.color }} />
                    </div>
                    <span className="text-xs font-mono text-slate-600 w-6 text-right shrink-0">{ps.count}</span>
                    <span className="text-[10px] text-slate-400 w-7 text-right shrink-0">{pct}%</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between">
              <span className="text-xs text-slate-500">총 묘역</span>
              <span className="text-xs font-semibold text-slate-800">{totalPlots}기</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">빠른 업무</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "신규 계약 등록", icon: "plus", page: "contracts" as Page, color: "#1E3A2B" },
            { label: "납부 처리", icon: "payments", page: "payments" as Page, color: "#1d4ed8" },
            { label: "상담 기록", icon: "consultations", page: "consultations" as Page, color: "#7c3aed" },
            { label: "봉안/안치 증명서 발급", icon: "document", page: "contracts" as Page, color: "#0891b2" },
          ].map((a) => (
            <button key={a.label} onClick={() => onNav(a.page)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-center">
              <span style={{ color: a.color }}><Icon name={a.icon} /></span>
              <span className="text-xs font-medium text-slate-700 leading-snug">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Contract List ────────────────────────────────────────────────────────────
function ContractList({
  onSelect,
  initialSearch,
  initialPaymentFilter,
  initialContractFilter,
}: {
  onSelect: (id: string) => void;
  initialSearch?: string;
  initialPaymentFilter?: PaymentStatus | "전체";
  initialContractFilter?: ContractStatus | "전체";
}) {
  const [search, setSearch] = useState(initialSearch ?? "");
  const [searchType, setSearchType] = useState("전체");
  const [filterStatus, setFilterStatus] = useState<SigningStatus | "전체">("전체");
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | "전체">(initialPaymentFilter ?? "전체");
  const [filterPlotType, setFilterPlotType] = useState("전체");
  const [showNewForm, setShowNewForm] = useState(false);
  const [sortKey, setSortKey] = useState("계약일 최신순");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setSearch(initialSearch ?? ""); setCurrentPage(1); }, [initialSearch]);
  useEffect(() => { setFilterPayment(initialPaymentFilter ?? "전체"); setCurrentPage(1); }, [initialPaymentFilter]);
  useEffect(() => { setFilterStatus("전체"); setCurrentPage(1); }, [initialContractFilter]);

  const searchTypes = ["전체", "묘적번호", "연고자", "망인명", "연락처"];
  const signingFilterOptions: Array<SigningStatus | "전체"> = ["전체", "생성", "서명요청", "서명완료", "체결", "반려", "만료"];
  const signingFilterLabels: Record<SigningStatus | "전체", string> = {
    전체: "전체", 생성: "계약생성", 서명요청: "서명요청", 서명완료: "서명완료",
    체결: "계약체결", 반려: "서명반려", 재요청: "재서명요청", 만료: "기한만료",
  };
  const plotTypes = ["전체", "평장묘", "가족평장묘", "매장묘", "봉안묘", "사용지", "예정지"];
  const sortOptions = ["계약일 최신순", "계약일 오래된순", "관리종료일 임박순", "연고자명 가나다순"];

  const filtered = initialContracts.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      c.plotNumber.toLowerCase().includes(q) ||
      c.contractorName.includes(q) ||
      c.deceasedName.includes(q) ||
      c.phone.includes(q) ||
      c.memberNo.toLowerCase().includes(q);
    const matchStatus = filterStatus === "전체" || c.signingStatus === filterStatus;
    const matchPayment = filterPayment === "전체" || c.paymentStatus === filterPayment;
    const matchPlotType = filterPlotType === "전체" || c.plotType === filterPlotType;
    return matchSearch && matchStatus && matchPayment && matchPlotType;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "계약일 최신순") return b.contractDate.localeCompare(a.contractDate);
    if (sortKey === "계약일 오래된순") return a.contractDate.localeCompare(b.contractDate);
    if (sortKey === "관리종료일 임박순") return a.managementEnd.localeCompare(b.managementEnd);
    if (sortKey === "연고자명 가나다순") return a.contractorName.localeCompare(b.contractorName);
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const goPage = (p: number) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));

  // 5-window page buttons
  const pageWindow = (() => {
    const half = 2;
    let start = Math.max(1, safePage - half);
    const end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  // Action button per signing status
  const ActionCell = ({ c }: { c: Contract }) => {
    const s = c.signingStatus;
    if (s === "생성") return (
      <button onClick={(e) => { e.stopPropagation(); }}
        className="text-xs px-2.5 py-1 rounded-md font-medium text-white whitespace-nowrap" style={{ background: "#1E3A2B" }}>
        계약서 발송
      </button>
    );
    if (s === "서명요청" || s === "재요청") return (
      <button onClick={(e) => { e.stopPropagation(); }}
        className="text-xs px-2.5 py-1 rounded-md font-medium border border-blue-300 text-blue-700 hover:bg-blue-50 whitespace-nowrap">
        SMS/알림톡
      </button>
    );
    if (s === "서명완료") return (
      <button onClick={(e) => { e.stopPropagation(); }}
        className="text-xs px-2.5 py-1 rounded-md font-medium border border-emerald-300 text-emerald-700 hover:bg-emerald-50 whitespace-nowrap">
        계약체결확정
      </button>
    );
    if (s === "반려") return (
      <button onClick={(e) => { e.stopPropagation(); }}
        className="text-xs px-2.5 py-1 rounded-md font-medium border border-red-200 text-red-600 hover:bg-red-50 whitespace-nowrap">
        반려사유 확인
      </button>
    );
    return <span className="text-xs text-slate-300">—</span>;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {initialSearch && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800">
          <Icon name="search" />
          <span>전체 검색: <strong>"{initialSearch}"</strong> — {filtered.length}건 검색됨</span>
        </div>
      )}

      {/* 필터바 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-0">
            {searchTypes.map((t) => (
              <button key={t} onClick={() => setSearchType(t)}
                className={`px-3 py-1.5 text-xs font-medium border first:rounded-l-md last:rounded-r-md transition-colors ${searchType === t ? "text-white border-transparent" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                style={searchType === t ? { background: "#1E3A2B" } : {}}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="search" /></span>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder={`${searchType}로 검색...`}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-0 focus:border-[#1E3A2B] transition-colors" />
          </div>
          <Btn onClick={() => setShowNewForm(true)}><Icon name="plus" /> 신규 계약</Btn>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs font-medium text-slate-500 shrink-0">계약상태</span>
          <div className="flex gap-1.5 flex-wrap">
            {signingFilterOptions.map((s) => (
              <button key={s} onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
                className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${filterStatus === s ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                style={filterStatus === s ? { background: "#1E3A2B" } : {}}>{signingFilterLabels[s]}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs font-medium text-slate-500 shrink-0">묘지형태</span>
          <div className="flex gap-1.5 flex-wrap">
            {plotTypes.map((t) => (
              <button key={t} onClick={() => { setFilterPlotType(t); setCurrentPage(1); }}
                className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${filterPlotType === t ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                style={filterPlotType === t ? { background: "#1E3A2B" } : {}}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* 테이블 헤더 툴바 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          총 <span className="font-bold" style={{ color: "#1E3A2B" }}>{filtered.length}</span>건
          {filtered.length !== sorted.length ? "" : ""}
        </span>
        <div className="flex items-center gap-3">
          <select value={sortKey} onChange={(e) => { setSortKey(e.target.value); setCurrentPage(1); }}
            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:border-[#1E3A2B] bg-white">
            {sortOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">페이지당</span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 focus:outline-none focus:border-[#1E3A2B] bg-white">
              {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}개</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {["묘적번호", "묘지형태", "기수", "망인명1", "망인명2", "묘역위치", "연고자1", "연고자2", "계약일", "관리종료일", "계약평수", "계약상태", "액션"].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id} onClick={() => onSelect(c.id)} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                <td className="px-3 py-2.5 font-mono text-xs font-semibold" style={{ color: "#1E3A2B" }}>{c.plotNumber}</td>
                <td className="px-3 py-2.5">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium whitespace-nowrap">{c.plotType}</span>
                </td>
                <td className="px-3 py-2.5 text-xs text-slate-500 font-mono">{c.memberNo.replace("M", "")}</td>
                <td className="px-3 py-2.5 font-semibold text-slate-800">{c.deceasedName}</td>
                <td className="px-3 py-2.5 text-slate-500 text-xs">{c.deceased2 ?? "—"}</td>
                <td className="px-3 py-2.5 text-xs text-slate-500 font-mono">{c.plotNumber.split("-").slice(0, 2).join("-")}</td>
                <td className="px-3 py-2.5 font-medium text-slate-800">{c.contractorName}</td>
                <td className="px-3 py-2.5 text-slate-500 text-xs">{c.applicant2 ?? "—"}</td>
                <td className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">{c.contractDate}</td>
                <td className="px-3 py-2.5 text-xs whitespace-nowrap font-medium" style={{ color: new Date(c.managementEnd) < new Date() ? "#dc2626" : "#475569" }}>{c.managementEnd}</td>
                <td className="px-3 py-2.5 text-xs text-slate-600">{c.plotSize}</td>
                <td className="px-3 py-2.5"><SigningStatusBadge status={c.signingStatus} /></td>
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}><ActionCell c={c} /></td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={13} className="py-16 text-center text-slate-400 text-sm">검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{safePage} / {totalPages} 페이지 · {filtered.length}건</span>
          <div className="flex items-center gap-1">
            <button onClick={() => goPage(1)} disabled={safePage === 1}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 font-medium">
              ≪
            </button>
            <button onClick={() => goPage(safePage - 1)} disabled={safePage === 1}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 font-medium">
              ‹ 이전
            </button>
            {pageWindow.map((p) => (
              <button key={p} onClick={() => goPage(p)}
                className="w-8 h-8 text-xs rounded-lg border font-medium transition-colors"
                style={p === safePage ? { background: "#1E3A2B", color: "white", borderColor: "#1E3A2B" } : { borderColor: "#e2e8f0", color: "#475569" }}>
                {p}
              </button>
            ))}
            <button onClick={() => goPage(safePage + 1)} disabled={safePage === totalPages}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 font-medium">
              다음 ›
            </button>
            <button onClick={() => goPage(totalPages)} disabled={safePage === totalPages}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 font-medium">
              ≫
            </button>
          </div>
        </div>
      )}

      {showNewForm && <NewContractModal onClose={() => setShowNewForm(false)} />}
    </div>
  );
}

// ─── New Contract Modal (with eFormSign flow) ─────────────────────────────────
function NewContractModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [sent, setSent] = useState(false);
  const steps = ["기본정보", "묘역·설묘", "안치자", "비용", "관리"];

  if (sent) {
    return (
      <Modal title="이폼사인 서명 발송 완료" onClose={onClose}>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#d1fae5" }}>
            <span style={{ color: "#059669" }}><Icon name="check" /></span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">서명 요청이 발송되었습니다</h3>
          <p className="text-sm text-slate-500 mb-1">계약자 이메일로 이폼사인 서명 요청이 발송되었습니다.</p>
          <p className="text-xs text-slate-400 mb-6">계약 상태: <strong className="text-blue-700">서명요청</strong> 으로 변경되었습니다.</p>
          <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2 max-w-xs mx-auto">
            <div className="flex justify-between"><span className="text-slate-500">회원번호</span><span className="font-medium">M2024-0067</span></div>
            <div className="flex justify-between"><span className="text-slate-500">계약자</span><span className="font-medium">신규계약자</span></div>
            <div className="flex justify-between"><span className="text-slate-500">발송일시</span><span className="font-medium">{now()}</span></div>
          </div>
          <div className="mt-6"><Btn onClick={onClose}>닫기</Btn></div>
        </div>
      </Modal>
    );
  }

  if (saved) {
    return (
      <Modal title="계약 저장 완료"
        onClose={onClose}
        footer={
          <>
            <Btn variant="secondary" onClick={onClose}>나중에 발송</Btn>
            <Btn onClick={() => setSent(true)}><Icon name="send" /> 이폼사인 서명 요청 발송</Btn>
          </>
        }
      >
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#d1fae5" }}>
            <span style={{ color: "#059669" }}><Icon name="check" /></span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">계약이 저장되었습니다</h3>
          <p className="text-sm text-slate-500 mb-6">이폼사인으로 계약서 서명을 요청하시겠습니까?<br />계약자 이메일로 서명 링크가 발송됩니다.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left text-sm space-y-2 max-w-xs mx-auto">
            <div className="flex justify-between"><span className="text-blue-600">회원번호</span><span className="font-medium">M2024-0067 (자동생성)</span></div>
            <div className="flex justify-between"><span className="text-blue-600">계약 상태</span><span className="font-medium">생성</span></div>
            <div className="flex justify-between"><span className="text-blue-600">서명 상태</span><span className="font-medium">생성 → <span className="text-blue-700">서명요청</span> (발송 시)</span></div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-[680px] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 shrink-0">
          <h2 className="font-bold text-slate-900 text-lg">신규 계약 등록</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1"><Icon name="x" /></button>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 pt-5 shrink-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <button
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{ background: i <= step ? "#1E3A2B" : "#e2e8f0", color: i <= step ? "white" : "#94a3b8" }}
                  onClick={() => setStep(i)}
                >
                  {i < step ? "✓" : i + 1}
                </button>
                <span className="text-[10px] mt-1 font-medium" style={{ color: i === step ? "#1E3A2B" : "#94a3b8" }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-px mx-1 mt-[-14px]" style={{ background: i < step ? "#1E3A2B" : "#e2e8f0" }} />}
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "회원번호", ph: "자동 생성", disabled: true },
                { label: "등록일", ph: new Date().toLocaleDateString("ko-KR"), disabled: true },
                { label: "계약자 *", ph: "계약자 성명" },
                { label: "연락처 *", ph: "010-0000-0000" },
                { label: "신청인1 *", ph: "신청인 성명" },
                { label: "신청인2", ph: "신청인2 성명 (선택)" },
                { label: "이메일", ph: "email@example.com" },
              ].map((f) => <Field key={f.label} label={f.label}><Input placeholder={f.ph} disabled={f.disabled} /></Field>)}
              <Field label="주소" span2><Input placeholder="주소 입력" /></Field>
            </div>
          )}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "묘역번호 *", ph: "예: A-12-05" },
                { label: "묘역 유형", ph: "잔디형 / 수목장 / 일반형" },
                { label: "계약 평수", ph: "예: 3평" },
                { label: "설묘 평수", ph: "예: 2.5평" },
                { label: "설묘일", ph: "YYYY-MM-DD" },
                { label: "단가 (원)", ph: "1,200,000" },
              ].map((f) => <Field key={f.label} label={f.label}><Input placeholder={f.ph} /></Field>)}
            </div>
          )}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "안치자1 *", ph: "안치자 성명" },
                { label: "안치자2", ph: "안치자2 (선택)" },
                { label: "사망일", ph: "YYYY-MM-DD" },
                { label: "설묘일", ph: "YYYY-MM-DD" },
                { label: "사망원인", ph: "예: 노환" },
                { label: "사망장소", ph: "예: 서울아산병원" },
                { label: "관계", ph: "예: 부, 모, 조부" },
              ].map((f) => <Field key={f.label} label={f.label}><Input placeholder={f.ph} /></Field>)}
              <Field label="메모" span2>
                <textarea rows={3} placeholder="특이사항 메모" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 resize-none" />
              </Field>
            </div>
          )}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "계약금 (원)", ph: "1,000,000" },
                { label: "중도금 (원)", ph: "2,000,000" },
                { label: "잔금 (원)", ph: "1,500,000" },
                { label: "시설비 (원)", ph: "500,000" },
                { label: "관리비 (원)", ph: "150,000" },
                { label: "기타 비용 (원)", ph: "0" },
              ].map((f) => <Field key={f.label} label={f.label}><Input placeholder={f.ph} /></Field>)}
              <div className="col-span-2 bg-slate-50 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">총 계약금액</span>
                  <span className="font-bold text-slate-900">5,150,000원</span>
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "관리 시작일", ph: "YYYY-MM-DD" },
                { label: "관리 종료일", ph: "YYYY-MM-DD" },
                { label: "관리기간", ph: "예: 10년" },
                { label: "연간 관리비 (원)", ph: "150,000" },
              ].map((f) => <Field key={f.label} label={f.label}><Input placeholder={f.ph} /></Field>)}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 shrink-0">
          <Btn variant="secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>이전</Btn>
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={onClose}>취소</Btn>
            {step < steps.length - 1
              ? <Btn onClick={() => setStep(step + 1)}>다음</Btn>
              : <Btn onClick={() => setSaved(true)}>계약 저장</Btn>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Signing Status Stepper ───────────────────────────────────────────────────
function SigningStatusStepper({ status, onAction }: { status: SigningStatus; onAction: (action: string) => void }) {
  const steps: SigningStatus[] = ["생성", "서명요청", "서명완료", "체결"];
  const isRejected = status === "반려" || status === "재요청";
  const currentIdx = isRejected ? 2 : steps.indexOf(status);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">이폼사인 서명 상태</span>
        <SigningStatusBadge status={status} />
      </div>
      <div className="flex items-center gap-0 mb-4">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isRejected && i === 2 ? "bg-red-100 border-2 border-red-500 text-red-700"
                  : i < currentIdx ? "text-white" : i === currentIdx ? "text-white border-2 border-white ring-2" : "bg-slate-100 text-slate-400"
              }`} style={!isRejected && i <= currentIdx ? { background: "#1E3A2B" } : {}}>
                {i < currentIdx && !isRejected ? "✓" : i + 1}
              </div>
              <span className="text-[9px] mt-1 font-medium" style={{ color: i <= currentIdx && !isRejected ? "#1E3A2B" : "#94a3b8" }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px mx-1 mt-[-12px]" style={{ background: i < currentIdx ? "#1E3A2B" : "#e2e8f0" }} />}
          </div>
        ))}
      </div>
      {status === "생성" && (
        <Btn size="xs" onClick={() => onAction("send")}><Icon name="send" /> 이폼사인 서명 요청 발송</Btn>
      )}
      {status === "서명요청" && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-600 font-medium">서명 대기 중 (3일 경과)</span>
          <Btn size="xs" variant="secondary" onClick={() => onAction("resend")}><Icon name="refresh" /> 재발송</Btn>
          <Btn size="xs" variant="secondary" onClick={() => onAction("cancel")}>취소</Btn>
        </div>
      )}
      {status === "체결" && (
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium">
          <Icon name="check" /> 계약서 서명이 완료되었습니다 (체결일: 2024-01-18)
        </div>
      )}
      {status === "반려" && (
        <div className="space-y-2">
          <Btn size="xs" variant="secondary" onClick={() => onAction("resubmit")}><Icon name="refresh" /> 계약서 수정 후 재발송</Btn>
        </div>
      )}
      {status === "재요청" && (
        <div className="flex items-center gap-2 text-orange-600 text-xs font-medium">
          <Icon name="refresh" /> 재서명 요청 발송됨 (오늘 {now().split(" ")[1]})
        </div>
      )}
    </div>
  );
}

// ─── Consultation Modal ───────────────────────────────────────────────────────
function ConsultationModal({ onClose, onSave }: { onClose: () => void; onSave: (c: ConsultationEntry) => void }) {
  const [category, setCategory] = useState<ConsultationEntry["category"]>("상담");
  const [type, setType] = useState("신규계약");
  const [content, setContent] = useState("");
  const [action, setAction] = useState("");
  const [handler, setHandler] = useState("김담당");
  const [status, setStatus] = useState<ConsultationEntry["status"]>("처리중");

  const types = category === "상담" ? CONSULT_TYPES.filter((t) => t !== "전체") : COMPLAINT_TYPES.filter((t) => t !== "전체");

  return (
    <Modal title="상담·민원 기록"
      onClose={onClose}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>취소</Btn>
          <Btn onClick={() => {
            onSave({
              id: `cs${Date.now()}`, date: now(), memberNo: "", contractorName: "",
              category, type, content, action, handler, status,
            });
            onClose();
          }}>저장</Btn>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="구분">
          <Select options={["상담", "민원"]} value={category} onChange={(v) => { setCategory(v as ConsultationEntry["category"]); setType(v === "상담" ? "신규계약" : "시설/환경"); }} />
        </Field>
        <Field label="종류">
          <Select options={types} value={type} onChange={setType} />
        </Field>
        <Field label="담당자">
          <Select options={["김담당", "이담당", "박담당", "최담당"]} value={handler} onChange={setHandler} />
        </Field>
        <Field label="처리상태">
          <Select options={["처리중", "미처리", "처리완료"]} value={status} onChange={(v) => setStatus(v as ConsultationEntry["status"])} />
        </Field>
        <Field label="상담일시">
          <Input defaultValue={now()} disabled />
        </Field>
        <Field label="상담 내용" span2>
          <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="상담 내용을 입력하세요..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 resize-none" />
        </Field>
        <Field label="조치 내용" span2>
          <textarea rows={3} value={action} onChange={(e) => setAction(e.target.value)}
            placeholder="처리 또는 조치 내용을 입력하세요..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 resize-none" />
        </Field>
      </div>
    </Modal>
  );
}

// ─── Contract Detail ──────────────────────────────────────────────────────────
function ContractDetail({ contractId, onBack }: { contractId: string; onBack: () => void }) {
  const contract = initialContracts.find((c) => c.id === contractId) ?? initialContracts[0];
  const [tab, setTab] = useState("overview");
  const [signingStatus, setSigningStatus] = useState<SigningStatus>(contract.signingStatus);

  // Deceased list
  const [deceasedList, setDeceasedList] = useState<DeceasedPerson[]>([
    { id: "d1", name: contract.deceasedName, deathDate: contract.deathDate, burialDate: contract.burialDate, deathCause: contract.deathCause, deathPlace: "서울아산병원", relation: "부", memo: "" },
    ...(contract.deceased2 ? [{ id: "d2", name: contract.deceased2, deathDate: "2022-03-14", burialDate: "2022-03-22", deathCause: "폐암", deathPlace: "분당서울대병원", relation: "모", memo: "" }] : []),
  ]);
  const [showDeceasedForm, setShowDeceasedForm] = useState(false);
  const [newDeceased, setNewDeceased] = useState<Partial<DeceasedPerson>>({});

  // Memos
  const [memos, setMemos] = useState<MemoEntry[]>(
    contract.memo ? [{ id: "m1", content: contract.memo, createdAt: contract.contractDate + " 09:00", author: "관리자" }] : []
  );
  const [newMemo, setNewMemo] = useState("");
  const [memoSaved, setMemoSaved] = useState(false);

  // Documents
  const [docs, setDocs] = useState<UploadedDoc[]>([
    { id: "doc1", name: "계약서_김민준_20240115.pdf", size: "2.3 MB", uploadedAt: "2024-01-15 09:30", category: "계약서" },
    { id: "doc2", name: "신분증_사본.jpg", size: "0.8 MB", uploadedAt: "2024-01-15 09:32", category: "신분증" },
  ]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Management fees
  const [mgmtFees, setMgmtFees] = useState<ManagementFeeRecord[]>([
    { id: "mf1", period: "2024.01 ~ 2025.01", amount: 150000, dueDate: "2024-02-01", billedDate: "2024-01-20", status: "납부완료", method: "계좌이체" },
  ]);
  const [showMgmtModal, setShowMgmtModal] = useState(false);

  // Consultations for this contract
  const [consultList, setConsultList] = useState<ConsultationEntry[]>(
    initialConsultations.filter((c) => c.memberNo === contract.memberNo)
  );
  const [showConsultModal, setShowConsultModal] = useState(false);

  // Rejection reason
  const [showRejection, setShowRejection] = useState(contract.signingStatus === "반려");

  const handleSigningAction = (action: string) => {
    if (action === "send" || action === "resend") setSigningStatus("서명요청");
    if (action === "cancel") setSigningStatus("생성");
    if (action === "resubmit") { setSigningStatus("재요청"); setShowRejection(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const cats = ["계약서", "신분증", "인감증명서", "기타"];
    const newDocs = files.map((f, i) => ({
      id: `doc${Date.now()}${i}`,
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(1) + " MB",
      uploadedAt: now(),
      category: cats[i % cats.length],
    }));
    setDocs((prev) => [...prev, ...newDocs]);
    e.target.value = "";
  };

  const saveMemo = () => {
    if (!newMemo.trim()) return;
    setMemos((prev) => [...prev, { id: `m${Date.now()}`, content: newMemo, createdAt: now(), author: "관리자" }]);
    setNewMemo("");
    setMemoSaved(true);
    setTimeout(() => setMemoSaved(false), 2500);
  };

  const tabs = [
    { id: "overview", label: "계약정보" },
    { id: "deceased", label: "안치자" },
    { id: "plot", label: "묘역" },
    { id: "cost", label: "비용" },
    { id: "payments", label: "납부" },
    { id: "mgmt", label: "관리비" },
    { id: "consult", label: "상담·민원" },
    { id: "memo", label: "메모" },
    { id: "term", label: "해약·이장" },
    { id: "docs", label: "문서" },
  ];

  const contractPayments = initialPayments.filter((p) => p.memberNo === contract.memberNo);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          목록으로
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-slate-900 text-lg">{contract.contractorName}</h2>
            <ContractStatusBadge status={contract.contractStatus} />
            <PaymentStatusBadge status={contract.paymentStatus} />
            <SigningStatusBadge status={signingStatus} />
            <span className="text-sm font-mono text-slate-500">{contract.memberNo}</span>
          </div>
          <div className="flex items-center gap-4 mt-0.5 text-xs text-slate-500">
            <span>묘역: <strong className="text-slate-700">{contract.plotNumber}</strong></span>
            <span>안치자: <strong className="text-slate-700">{contract.deceasedName}</strong></span>
            <span>계약일: {contract.contractDate}</span>
            <span>관리종료: {contract.managementEnd}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="secondary" size="xs"><Icon name="download" /> 계약서 다운로드</Btn>
          <Btn size="xs"><Icon name="edit" /> 수정</Btn>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-56 shrink-0 border-r border-slate-200 bg-white overflow-y-auto p-4 space-y-4">
          <InfoSection label="계약자 정보">
            <InfoRow label="성명" value={contract.contractorName} bold />
            <InfoRow label="연락처" value={contract.phone} />
            <InfoRow label="이메일" value={contract.email} small />
            <InfoRow label="주소" value={contract.address} small />
            <InfoRow label="신청인1" value={contract.applicant1} />
            {contract.applicant2 && <InfoRow label="신청인2" value={contract.applicant2} />}
          </InfoSection>
          <InfoSection label="계약 요약">
            <InfoRow label="계약금액" value={formatKRW(contract.contractAmount)} bold />
            <InfoRow label="납부금액" value={formatKRW(contract.paidAmount)} />
            <InfoRow label="미납금액" value={formatKRW(contract.unpaidAmount)} danger={contract.unpaidAmount > 0} />
            <InfoRow label="관리비" value={formatKRW(contract.managementFee) + "/년"} />
          </InfoSection>
          <InfoSection label="관리기간">
            <div className="text-xs text-slate-700 font-medium">{contract.managementStart}</div>
            <div className="text-[10px] text-slate-400">~</div>
            <div className="text-xs text-slate-700 font-medium">{contract.managementEnd}</div>
          </InfoSection>
        </div>

        {/* Tabs */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b border-slate-200 bg-white px-4 overflow-x-auto shrink-0">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.id ? "border-emerald-700 text-emerald-800" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-5">

            {/* ── 계약정보 ── */}
            {tab === "overview" && (
              <div className="space-y-4">
                {/* Signing status stepper */}
                <SigningStatusStepper status={signingStatus} onAction={handleSigningAction} />

                {/* Rejection alert */}
                {showRejection && contract.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5 shrink-0"><Icon name="alert" /></span>
                      <div>
                        <div className="text-sm font-semibold text-red-800 mb-1">서명 반려 사유</div>
                        <p className="text-xs text-red-700">{contract.rejectionReason}</p>
                        <Btn size="xs" variant="secondary" onClick={() => handleSigningAction("resubmit")} >
                          <Icon name="refresh" /> 수정 후 재발송
                        </Btn>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h4 className="font-semibold text-slate-800 mb-4 text-sm">기본 계약 정보</h4>
                    <div className="space-y-3">
                      <DetailRow label="회원번호" value={contract.memberNo} />
                      <DetailRow label="계약일" value={contract.contractDate} />
                      <DetailRow label="묘역번호" value={contract.plotNumber} />
                      <DetailRow label="묘역유형" value={contract.plotType} />
                      <DetailRow label="계약평수" value={contract.plotSize} />
                      <DetailRow label="단가" value={formatKRW(contract.unitPrice) + "/평"} />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h4 className="font-semibold text-slate-800 mb-4 text-sm">관리 정보</h4>
                    <div className="space-y-3">
                      <DetailRow label="관리 시작일" value={contract.managementStart} />
                      <DetailRow label="관리 종료일" value={contract.managementEnd} />
                      <DetailRow label="연간 관리비" value={formatKRW(contract.managementFee)} />
                      <DetailRow label="계약상태" value={<ContractStatusBadge status={contract.contractStatus} />} />
                      <DetailRow label="납부상태" value={<PaymentStatusBadge status={contract.paymentStatus} />} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 안치자 ── */}
            {tab === "deceased" && (
              <div className="space-y-3">
                {deceasedList.map((d, idx) => (
                  <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-slate-800 text-sm">안치자 {idx + 1}</h4>
                      <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">{d.relation}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <DetailRow label="성명" value={d.name} />
                      <DetailRow label="사망일" value={d.deathDate} />
                      <DetailRow label="설묘일" value={d.burialDate} />
                      <DetailRow label="사망원인" value={d.deathCause} />
                      <DetailRow label="사망장소" value={d.deathPlace} />
                    </div>
                    {d.memo && <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">메모: {d.memo}</p>}
                  </div>
                ))}

                {showDeceasedForm && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <h4 className="font-semibold text-blue-900 text-sm mb-4">안치자 추가</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: "name", label: "성명 *", ph: "안치자 성명" },
                        { key: "relation", label: "관계", ph: "예: 부, 모, 조부" },
                        { key: "deathDate", label: "사망일", ph: "YYYY-MM-DD" },
                        { key: "burialDate", label: "설묘일", ph: "YYYY-MM-DD" },
                        { key: "deathCause", label: "사망원인", ph: "예: 노환" },
                        { key: "deathPlace", label: "사망장소", ph: "예: 서울아산병원" },
                      ].map((f) => (
                        <div key={f.key}>
                          <label className="block text-xs font-medium text-blue-800 mb-1">{f.label}</label>
                          <input
                            placeholder={f.ph}
                            onChange={(e) => setNewDeceased((prev) => ({ ...prev, [f.key]: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                          />
                        </div>
                      ))}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-blue-800 mb-1">메모</label>
                        <textarea rows={2} placeholder="특이사항" onChange={(e) => setNewDeceased((p) => ({ ...p, memo: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none bg-white resize-none" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Btn size="xs" onClick={() => {
                        if (newDeceased.name) {
                          setDeceasedList((prev) => [...prev, { id: `d${Date.now()}`, name: newDeceased.name!, deathDate: newDeceased.deathDate ?? "", burialDate: newDeceased.burialDate ?? "", deathCause: newDeceased.deathCause ?? "", deathPlace: newDeceased.deathPlace ?? "", relation: newDeceased.relation ?? "기타", memo: newDeceased.memo }]);
                          setShowDeceasedForm(false);
                          setNewDeceased({});
                        }
                      }}>저장</Btn>
                      <Btn size="xs" variant="secondary" onClick={() => setShowDeceasedForm(false)}>취소</Btn>
                    </div>
                  </div>
                )}

                {!showDeceasedForm && (
                  <button
                    onClick={() => setShowDeceasedForm(true)}
                    className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 border-2 border-dashed border-slate-300 rounded-xl w-full justify-center hover:border-slate-400 hover:bg-slate-50 transition-colors text-slate-500"
                  >
                    <Icon name="plus" /> 안치자 추가
                  </button>
                )}
              </div>
            )}

            {/* ── 묘역 ── */}
            {tab === "plot" && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h4 className="font-semibold text-slate-800 mb-4 text-sm">묘역 정보</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="묘역번호" value={contract.plotNumber} />
                  <DetailRow label="묘역유형" value={contract.plotType} />
                  <DetailRow label="계약평수" value={contract.plotSize} />
                  <DetailRow label="단가" value={formatKRW(contract.unitPrice)} />
                  <DetailRow label="설묘일" value={contract.burialDate} />
                  <DetailRow label="묘역상태" value={<PlotStatusBadge status="안치" />} />
                </div>
              </div>
            )}

            {/* ── 비용 ── */}
            {tab === "cost" && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h4 className="font-semibold text-slate-800 mb-4 text-sm">비용 내역</h4>
                <div className="space-y-2">
                  {[
                    { label: "계약금", value: contract.deposit },
                    { label: "중도금", value: contract.interim },
                    { label: "잔금", value: contract.balance },
                    { label: "시설비", value: contract.facilityFee },
                    { label: "연간 관리비", value: contract.managementFee },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <span className="text-sm font-medium text-slate-900">{formatKRW(item.value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 bg-slate-50 rounded-lg px-3">
                    <span className="text-sm font-semibold text-slate-700">총 계약금액</span>
                    <span className="text-sm font-bold" style={{ color: "#1E3A2B" }}>{formatKRW(contract.contractAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── 납부 ── */}
            {tab === "payments" && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800 text-sm">납부 내역</h4>
                  <Btn size="xs"><Icon name="plus" /> 납부 처리</Btn>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      {["관리기간", "대상금액", "납부금액", "미납금액", "납부일", "납부수단", "상태"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contractPayments.map((p) => (
                      <tr key={p.id} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-xs text-slate-600">{p.period}</td>
                        <td className="px-4 py-3 text-xs font-mono">{formatKRW(p.targetAmount)}</td>
                        <td className="px-4 py-3 text-xs font-mono text-emerald-700">{formatKRW(p.paidAmount)}</td>
                        <td className="px-4 py-3 text-xs font-mono text-red-600">{p.unpaidAmount > 0 ? formatKRW(p.unpaidAmount) : "-"}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{p.paymentDate ?? "-"}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{p.paymentMethod ?? "-"}</td>
                        <td className="px-4 py-3"><PaymentStatusBadge status={p.status} /></td>
                      </tr>
                    ))}
                    {contractPayments.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-8 text-slate-400 text-xs">납부 내역이 없습니다.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── 관리비 ── */}
            {tab === "mgmt" && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Btn size="xs" onClick={() => setShowMgmtModal(true)}><Icon name="plus" /> 관리비 청구</Btn>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        {["관리기간", "청구금액", "납부마감일", "청구일", "납부수단", "상태"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mgmtFees.map((f) => (
                        <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3 text-xs text-slate-600">{f.period}</td>
                          <td className="px-4 py-3 text-xs font-mono font-medium">{formatKRW(f.amount)}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{f.dueDate}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{f.billedDate}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{f.method}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              f.status === "납부완료" ? "bg-emerald-100 text-emerald-800"
                                : f.status === "청구완료" ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-700"
                            }`}>{f.status}</span>
                          </td>
                        </tr>
                      ))}
                      {mgmtFees.length === 0 && (
                        <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-xs">등록된 관리비 청구 내역이 없습니다.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── 상담·민원 ── */}
            {tab === "consult" && (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <Btn size="xs" onClick={() => setShowConsultModal(true)}><Icon name="plus" /> 상담 기록</Btn>
                </div>
                {consultList.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 text-sm">등록된 상담 내역이 없습니다.</div>
                ) : (
                  consultList.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{c.type}</span>
                          <ConsultationStatusBadge status={c.status} />
                        </div>
                        <span className="text-xs text-slate-400">{c.date} · {c.handler}</span>
                      </div>
                      <p className="text-sm text-slate-700 mb-1">{c.content}</p>
                      <p className="text-xs text-slate-500">조치: {c.action}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── 메모 ── */}
            {tab === "memo" && (
              <div className="space-y-3">
                {memos.map((m) => (
                  <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500">{m.createdAt} · {m.author}</span>
                      <button onClick={() => setMemos((prev) => prev.filter((x) => x.id !== m.id))}
                        className="text-slate-300 hover:text-red-500 transition-colors"><Icon name="trash" /></button>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{m.content}</p>
                  </div>
                ))}

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <label className="block text-xs font-medium text-slate-600 mb-2">새 메모 작성</label>
                  <textarea
                    value={newMemo}
                    onChange={(e) => setNewMemo(e.target.value)}
                    rows={4}
                    placeholder="계약 관련 특이사항, 메모를 입력하세요..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 resize-none"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    {memoSaved && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                        <Icon name="check" /> 메모가 저장되었습니다
                      </span>
                    )}
                    {!memoSaved && <span />}
                    <Btn size="xs" onClick={saveMemo} disabled={!newMemo.trim()}>저장</Btn>
                  </div>
                </div>
              </div>
            )}

            {/* ── 해약·이장 ── */}
            {tab === "term" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-red-100 p-5">
                  <h4 className="font-semibold text-red-700 mb-4 text-sm">해약 처리</h4>
                  <div className="space-y-3">
                    <Field label="해약일"><Input placeholder="YYYY-MM-DD" /></Field>
                    <Field label="해약사유"><Input placeholder="해약사유 입력" /></Field>
                    <Field label="환불금액 (원)"><Input placeholder="0" /></Field>
                    <button className="w-full py-2 text-sm font-medium text-white rounded-lg bg-red-600 hover:bg-red-700">해약 처리</button>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-orange-100 p-5">
                  <h4 className="font-semibold text-orange-700 mb-4 text-sm">이장 처리</h4>
                  <div className="space-y-3">
                    <Field label="이장일"><Input placeholder="YYYY-MM-DD" /></Field>
                    <Field label="이장 사유"><Input placeholder="이장사유 입력" /></Field>
                    <Field label="이장 후 안치 장소"><Input placeholder="예: 타 묘원 이전" /></Field>
                    <button className="w-full py-2 text-sm font-medium text-white rounded-lg bg-orange-600 hover:bg-orange-700">이장 처리</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── 문서 ── */}
            {tab === "docs" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{docs.length}개 파일 업로드됨</span>
                  <div className="flex gap-2">
                    <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileChange} />
                    <Btn size="xs" onClick={() => fileRef.current?.click()}><Icon name="upload" /> 파일 업로드</Btn>
                  </div>
                </div>

                {/* Drop zone */}
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <div className="text-slate-400 mb-2 flex justify-center"><Icon name="upload" /></div>
                  <p className="text-sm text-slate-500">클릭하거나 파일을 드래그하여 업로드</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, DOCX 지원 · 최대 20MB</p>
                </div>

                {/* File list */}
                {docs.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          {["파일명", "분류", "크기", "업로드일시", ""].map((h) => (
                            <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {docs.map((d) => (
                          <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400"><Icon name="file" /></span>
                                <span className="text-sm text-slate-800">{d.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">{d.category}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500">{d.size}</td>
                            <td className="px-4 py-3 text-xs text-slate-500">{d.uploadedAt}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="text-xs text-slate-500 hover:text-slate-800"><Icon name="download" /></button>
                                <button onClick={() => setDocs((prev) => prev.filter((x) => x.id !== d.id))}
                                  className="text-xs text-slate-400 hover:text-red-500"><Icon name="trash" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Management fee modal */}
      {showMgmtModal && (
        <ManagementFeeModal
          onClose={() => setShowMgmtModal(false)}
          onSave={(fee) => { setMgmtFees((prev) => [...prev, fee]); setShowMgmtModal(false); }}
          annualFee={contract.managementFee}
        />
      )}

      {/* Consultation modal */}
      {showConsultModal && (
        <ConsultationModal
          onClose={() => setShowConsultModal(false)}
          onSave={(c) => setConsultList((prev) => [{ ...c, memberNo: contract.memberNo, contractorName: contract.contractorName }, ...prev])}
        />
      )}
    </div>
  );
}

function InfoSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, small, bold, danger }: { label: string; value: React.ReactNode; small?: boolean; bold?: boolean; danger?: boolean }) {
  return (
    <div>
      <div className="text-[10px] text-slate-400">{label}</div>
      <div className={`${small ? "text-[11px]" : "text-xs"} ${bold ? "font-bold" : "font-medium"} ${danger ? "text-red-600" : "text-slate-700"} leading-snug mt-0.5`}>{value}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-slate-50">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-medium text-slate-800">{value}</span>
    </div>
  );
}

// ─── Management Fee Modal ─────────────────────────────────────────────────────
function ManagementFeeModal({ onClose, onSave, annualFee }: {
  onClose: () => void;
  onSave: (f: ManagementFeeRecord) => void;
  annualFee: number;
}) {
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState(String(annualFee));
  const [dueDate, setDueDate] = useState("");
  const [method, setMethod] = useState("계좌이체");
  const [sendNotif, setSendNotif] = useState(true);

  return (
    <Modal title="관리비 청구 등록"
      onClose={onClose}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>취소</Btn>
          <Btn onClick={() => {
            onSave({
              id: `mf${Date.now()}`, period, amount: Number(amount.replace(/,/g, "")), dueDate,
              billedDate: new Date().toISOString().slice(0, 10), status: "청구완료", method,
            });
          }}>청구 생성{sendNotif ? " + 알림 발송" : ""}</Btn>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="관리기간 *" span2>
          <Input value={period} onChange={setPeriod} placeholder="예: 2025.01 ~ 2026.01" />
        </Field>
        <Field label="청구금액 (원) *">
          <Input value={amount} onChange={setAmount} placeholder="150,000" />
        </Field>
        <Field label="납부 마감일 *">
          <Input value={dueDate} onChange={setDueDate} placeholder="YYYY-MM-DD" />
        </Field>
        <Field label="납부 수단">
          <Select options={["계좌이체", "카드", "현금", "온라인결제"]} value={method} onChange={setMethod} />
        </Field>
        <Field label="청구일">
          <Input defaultValue={new Date().toISOString().slice(0, 10)} disabled />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input type="checkbox" id="notif" checked={sendNotif} onChange={(e) => setSendNotif(e.target.checked)} className="rounded" />
        <label htmlFor="notif" className="text-sm text-slate-600">계약자에게 청구 알림 발송 (문자/이메일)</label>
      </div>
    </Modal>
  );
}

// ─── Plot Management ──────────────────────────────────────────────────────────
function PlotManagement() {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [filterStatus, setFilterStatus] = useState<PlotStatus | "전체">("전체");
  const [zone, setZone] = useState("A지구");

  const plotStatuses: Array<PlotStatus | "전체"> = ["전체", "판매가능", "예약", "계약", "설묘", "안치", "이장", "사용불가"];
  const plotColorMap: Record<PlotStatus, string> = {
    판매가능: "#d1fae5", 예약: "#fef3c7", 계약: "#dbeafe", 설묘: "#e0e7ff",
    안치: "#312e81", 이장: "#fed7aa", 사용불가: "#f1f5f9",
  };
  const plotTextMap: Record<PlotStatus, string> = {
    판매가능: "#065f46", 예약: "#92400e", 계약: "#1e40af", 설묘: "#3730a3",
    안치: "#ffffff", 이장: "#9a3412", 사용불가: "#94a3b8",
  };

  const statusCount = plotStatuses.slice(1).map((s) => ({
    status: s as PlotStatus,
    count: plotGrid.filter((p) => p.status === s).length,
  }));

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 shrink-0">
        <div className="flex gap-2">
          {["A지구", "B지구", "C지구", "D지구"].map((z) => (
            <button key={z} onClick={() => setZone(z)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${zone === z ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              style={zone === z ? { background: "#1E3A2B" } : {}}>{z}</button>
          ))}
        </div>
        <div className="h-5 w-px bg-slate-200 mx-2" />
        <div className="flex gap-1.5 flex-wrap">
          {plotStatuses.map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${filterStatus === s ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              style={filterStatus === s ? { background: "#1E3A2B" } : {}}>{s}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-4 flex items-center gap-4 flex-wrap">
            {statusCount.map(({ status, count }) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm border border-slate-200" style={{ background: plotColorMap[status] }} />
                <span className="text-xs text-slate-600">{status} <strong>{count}</strong></span>
              </div>
            ))}
          </div>
          <div className="inline-block">
            <div className="mb-2 flex gap-2">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="w-16 text-center text-[10px] text-slate-400 font-mono">{String(i + 1).padStart(2, "0")}열</div>
              ))}
            </div>
            {Array.from({ length: 6 }, (_, rowIdx) => (
              <div key={rowIdx} className="flex gap-2 mb-2 items-center">
                <div className="w-8 text-[10px] text-slate-400 font-mono shrink-0">{String(rowIdx + 1).padStart(2, "0")}행</div>
                {Array.from({ length: 8 }, (_, colIdx) => {
                  const plot = plotGrid.find((p) => p.row === rowIdx + 1 && p.col === colIdx + 1);
                  if (!plot) return null;
                  const show = filterStatus === "전체" || plot.status === filterStatus;
                  return (
                    <button key={colIdx} onClick={() => setSelectedPlot(selectedPlot?.id === plot.id ? null : plot)}
                      title={`${plot.number} · ${plot.status}`}
                      className={`w-16 h-14 rounded-md text-center border transition-all ${selectedPlot?.id === plot.id ? "ring-2 ring-offset-1 ring-slate-600" : "hover:ring-2 hover:ring-offset-1 hover:ring-slate-400"} ${!show ? "opacity-25" : ""}`}
                      style={{ background: plotColorMap[plot.status], borderColor: plotTextMap[plot.status] + "40" }}>
                      <div className="text-[9px] font-mono font-bold leading-tight" style={{ color: plotTextMap[plot.status] }}>{plot.number}</div>
                      <div className="text-[9px] leading-tight mt-0.5" style={{ color: plotTextMap[plot.status] + "cc" }}>{plot.status}</div>
                      {plot.deceasedName && <div className="text-[8px] leading-tight truncate px-1" style={{ color: plotTextMap[plot.status] + "99" }}>{plot.deceasedName}</div>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        {selectedPlot && (
          <div className="w-64 shrink-0 bg-white border-l border-slate-200 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">{selectedPlot.number}</h3>
              <button onClick={() => setSelectedPlot(null)} className="text-slate-400 hover:text-slate-700"><Icon name="x" /></button>
            </div>
            <PlotStatusBadge status={selectedPlot.status} />
            <div className="mt-4 space-y-3">
              <DetailRow label="크기" value={selectedPlot.size} />
              <DetailRow label="단가" value={formatKRW(selectedPlot.unitPrice) + "/평"} />
              {selectedPlot.contractorName && <DetailRow label="계약자" value={selectedPlot.contractorName} />}
              {selectedPlot.deceasedName && <DetailRow label="안치자" value={selectedPlot.deceasedName} />}
              {selectedPlot.contractDate && <DetailRow label="계약일" value={selectedPlot.contractDate} />}
              {selectedPlot.burialDate && <DetailRow label="설묘일" value={selectedPlot.burialDate} />}
              {selectedPlot.managementEnd && <DetailRow label="관리종료" value={selectedPlot.managementEnd} />}
            </div>
            {selectedPlot.status === "판매가능" && (
              <Btn size="sm" onClick={() => {}} >계약 등록</Btn>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Billing Create Modal ─────────────────────────────────────────────────────
function BillingCreateModal({ onClose, onSave }: { onClose: () => void; onSave: (p: PaymentRecord) => void }) {
  const [contractorName, setContractorName] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [method, setMethod] = useState("계좌이체");
  const [sendNotif, setSendNotif] = useState(true);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <Modal title="청구 생성 완료" onClose={onClose}>
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#d1fae5" }}>
            <span style={{ color: "#059669" }}><Icon name="check" /></span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">청구가 생성되었습니다</h3>
          <p className="text-sm text-slate-500 mb-2">{sendNotif ? "계약자에게 청구 알림이 발송되었습니다." : "청구 알림은 발송되지 않았습니다."}</p>
          <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2 max-w-xs mx-auto mt-4">
            <div className="flex justify-between"><span className="text-slate-500">계약자</span><span className="font-medium">{contractorName || "미입력"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">기간</span><span className="font-medium">{period || "미입력"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">금액</span><span className="font-medium">{amount ? Number(amount.replace(/,/g, "")).toLocaleString() + "원" : "미입력"}</span></div>
          </div>
          <div className="mt-6"><Btn onClick={onClose}>닫기</Btn></div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="청구 생성"
      onClose={onClose}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>취소</Btn>
          <Btn onClick={() => {
            onSave({
              id: `p${Date.now()}`, memberNo: "M2024-NEW", contractorName, deceasedName: "-",
              period, targetAmount: Number(amount.replace(/,/g, "")), paidAmount: 0,
              unpaidAmount: Number(amount.replace(/,/g, "")), paymentMethod: method, status: "미납",
              billedDate: new Date().toISOString().slice(0, 10),
            });
            setSaved(true);
          }}>청구 생성{sendNotif ? " + 알림 발송" : ""}</Btn>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="계약자 선택" span2>
          <Select
            options={["선택하세요", ...initialContracts.map((c) => `${c.contractorName} (${c.memberNo})`)]}
            onChange={(v) => setContractorName(v.split(" (")[0])}
          />
        </Field>
        <Field label="청구 유형">
          <Select options={["관리비", "계약금", "중도금", "잔금", "기타"]} />
        </Field>
        <Field label="관리기간">
          <Input value={period} onChange={setPeriod} placeholder="예: 2025.01 ~ 2026.01" />
        </Field>
        <Field label="청구금액 (원) *">
          <Input value={amount} onChange={setAmount} placeholder="150,000" />
        </Field>
        <Field label="납부 마감일">
          <Input value={dueDate} onChange={setDueDate} placeholder="YYYY-MM-DD" />
        </Field>
        <Field label="납부 수단">
          <Select options={["계좌이체", "카드", "현금", "온라인결제"]} value={method} onChange={setMethod} />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input type="checkbox" id="bnotif" checked={sendNotif} onChange={(e) => setSendNotif(e.target.checked)} className="rounded" />
        <label htmlFor="bnotif" className="text-sm text-slate-600">청구 알림 발송 (문자/이메일)</label>
      </div>
    </Modal>
  );
}

// ─── Payment Process Modal ────────────────────────────────────────────────────
function PaymentProcessModal({ payment, onClose, onSave }: {
  payment: PaymentRecord;
  onClose: () => void;
  onSave: (p: PaymentRecord) => void;
}) {
  const [method, setMethod] = useState("계좌이체");
  const [amount, setAmount] = useState(String(payment.unpaidAmount));
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Modal title="납부 처리 완료" onClose={onClose}>
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#d1fae5" }}>
            <span style={{ color: "#059669" }}><Icon name="check" /></span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">납부 처리가 완료되었습니다</h3>
          <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2 max-w-xs mx-auto mt-4">
            <div className="flex justify-between"><span className="text-slate-500">계약자</span><span className="font-medium">{payment.contractorName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">납부금액</span><span className="font-medium text-emerald-700">{Number(amount).toLocaleString()}원</span></div>
            <div className="flex justify-between"><span className="text-slate-500">납부수단</span><span className="font-medium">{method}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">납부일</span><span className="font-medium">{date}</span></div>
          </div>
          <div className="mt-6"><Btn onClick={onClose}>닫기</Btn></div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="납부 처리"
      onClose={onClose}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>취소</Btn>
          <Btn onClick={() => {
            const paid = Number(amount);
            onSave({ ...payment, paidAmount: payment.paidAmount + paid, unpaidAmount: Math.max(0, payment.unpaidAmount - paid), paymentDate: date, paymentMethod: method, status: payment.unpaidAmount - paid <= 0 ? "납부완료" : "부분납부" });
            setDone(true);
          }}>납부 처리 완료</Btn>
        </>
      }
    >
      <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm space-y-1.5">
        <div className="flex justify-between"><span className="text-slate-500">계약자</span><span className="font-medium">{payment.contractorName}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">안치자</span><span className="font-medium">{payment.deceasedName}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">대상금액</span><span className="font-medium">{formatKRW(payment.targetAmount)}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">미납금액</span><span className="font-semibold text-red-600">{formatKRW(payment.unpaidAmount)}</span></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="납부금액 (원) *">
          <Input value={amount} onChange={setAmount} placeholder="납부금액 입력" />
        </Field>
        <Field label="납부 수단 *">
          <Select options={["계좌이체", "카드", "현금", "온라인결제"]} value={method} onChange={setMethod} />
        </Field>
        <Field label="납부일 *">
          <Input value={date} onChange={setDate} placeholder="YYYY-MM-DD" />
        </Field>
        <Field label="비고">
          <Input value={note} onChange={setNote} placeholder="영수증번호 등" />
        </Field>
      </div>
    </Modal>
  );
}

// ─── Billing Action Modal (청구 발송) ─────────────────────────────────────────
function BillingActionModal({ payment, onClose }: { payment: PaymentRecord; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [method, setMethod] = useState("문자+이메일");

  return (
    <Modal title="청구 발송"
      onClose={onClose}
      footer={
        sent ? <Btn onClick={onClose}>닫기</Btn> :
          <>
            <Btn variant="secondary" onClick={onClose}>취소</Btn>
            <Btn onClick={() => setSent(true)}><Icon name="send" /> 청구 발송</Btn>
          </>
      }
    >
      {sent ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "#d1fae5" }}>
            <span style={{ color: "#059669" }}><Icon name="check" /></span>
          </div>
          <p className="text-sm font-semibold text-slate-900 mb-1">청구가 발송되었습니다</p>
          <p className="text-xs text-slate-500">{payment.contractorName} 고객에게 {method}로 청구 알림이 전송되었습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-1.5">
            <div className="flex justify-between"><span className="text-slate-500">계약자</span><span className="font-medium">{payment.contractorName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">청구기간</span><span className="font-medium">{payment.period}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">청구금액</span><span className="font-semibold" style={{ color: "#1E3A2B" }}>{formatKRW(payment.targetAmount)}</span></div>
          </div>
          <Field label="발송 수단">
            <Select options={["문자+이메일", "문자", "이메일", "카카오알림"]} value={method} onChange={setMethod} />
          </Field>
          <Field label="발송 메시지 미리보기">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 leading-relaxed">
              [묘원365] {payment.contractorName} 고객님, {payment.period} 관리비 {formatKRW(payment.targetAmount)} 청구서가 발송되었습니다. 납부마감: 2025-02-28. 문의: 02-1234-5678
            </div>
          </Field>
        </div>
      )}
    </Modal>
  );
}

// ─── Payment Management ────────────────────────────────────────────────────────
function PaymentManagement({ initialTab }: { initialTab?: string }) {
  const [tab, setTab] = useState(initialTab ?? "all");
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [showBillingCreate, setShowBillingCreate] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<PaymentRecord | null>(null);
  const [billingTarget, setBillingTarget] = useState<PaymentRecord | null>(null);

  useEffect(() => { if (initialTab) setTab(initialTab); }, [initialTab]);

  const tabs = [
    { id: "all", label: "전체" },
    { id: "pending", label: "납부 대기" },
    { id: "unpaid", label: "미납" },
    { id: "longterm", label: "장기미납" },
    { id: "billing", label: "청구관리" },
  ];

  const filtered = payments.filter((p) => {
    if (tab === "pending") return p.status === "부분납부";
    if (tab === "unpaid") return p.status === "미납";
    if (tab === "longterm") return p.status === "장기미납";
    return true;
  });

  const handlePaymentSave = (updated: PaymentRecord) => {
    setPayments((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    setPaymentTarget(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "총 청구금액", value: "4,280,000", color: "#1E3A2B" },
          { label: "납부완료", value: "2,960,000", color: "#059669" },
          { label: "미납금액", value: "1,200,000", color: "#dc2626" },
          { label: "장기미납", value: "520,000", color: "#991b1b" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-xs text-slate-500 mb-2">{s.label}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}<span className="text-xs ml-1 font-medium">원</span></div>
          </div>
        ))}
      </div>

      {/* Filter bar (계약관리 스타일) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="search" /></span>
            <input placeholder="회원번호 · 계약자 검색..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700" />
          </div>
          <Btn size="xs" onClick={() => setShowBillingCreate(true)}><Icon name="plus" /> 청구 생성</Btn>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-500">납부상태</span>
          <div className="flex gap-1.5">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${tab === t.id ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                style={tab === t.id ? { background: "#1E3A2B" } : {}}>{t.label}</button>
            ))}
          </div>
          <span className="ml-auto text-xs text-slate-500 font-medium">{filtered.length}건</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {["회원번호", "계약자", "안치자", "관리기간", "대상금액", "납부금액", "미납금액", "납부일", "납부수단", "상태", "액션"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.memberNo}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{p.contractorName}</td>
                <td className="px-4 py-3 text-slate-700">{p.deceasedName}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{p.period}</td>
                <td className="px-4 py-3 text-xs font-mono">{formatKRW(p.targetAmount)}</td>
                <td className="px-4 py-3 text-xs font-mono text-emerald-700">{formatKRW(p.paidAmount)}</td>
                <td className="px-4 py-3 text-xs font-mono text-red-600">{p.unpaidAmount > 0 ? formatKRW(p.unpaidAmount) : "-"}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{p.paymentDate ?? "-"}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{p.paymentMethod ?? "-"}</td>
                <td className="px-4 py-3"><PaymentStatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {p.status !== "납부완료" && (
                      <>
                        <button onClick={() => setBillingTarget(p)}
                          className="text-xs px-2 py-1 border border-blue-200 rounded text-blue-600 hover:bg-blue-50 font-medium whitespace-nowrap">청구</button>
                        <button onClick={() => setPaymentTarget(p)}
                          className="text-xs px-2 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 whitespace-nowrap">납부처리</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-slate-400 text-sm">해당 조건의 납부 내역이 없습니다.</div>}
      </div>

      {showBillingCreate && (
        <BillingCreateModal
          onClose={() => setShowBillingCreate(false)}
          onSave={(p) => { setPayments((prev) => [...prev, p]); setShowBillingCreate(false); }}
        />
      )}
      {paymentTarget && (
        <PaymentProcessModal
          payment={paymentTarget}
          onClose={() => setPaymentTarget(null)}
          onSave={handlePaymentSave}
        />
      )}
      {billingTarget && (
        <BillingActionModal payment={billingTarget} onClose={() => setBillingTarget(null)} />
      )}
    </div>
  );
}

// ─── Consultations ────────────────────────────────────────────────────────────
const CONSULT_TYPES = ["전체", "신규계약", "재계약/갱신", "계약 변경", "비용/결제", "안치/공간", "이장", "해약", "기타"];
const COMPLAINT_TYPES = ["전체", "시설/환경", "안치/묘역", "계약/요금", "직원/서비스", "방문/이용", "기타"];

function ConsultTable({ rows, onSelect }: { rows: ConsultationEntry[]; onSelect: (c: ConsultationEntry) => void }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {["일시", "회원번호", "계약자", "종류", "내용", "조치내용", "담당자", "상태"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} onClick={() => onSelect(c)} className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
              <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{c.date}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.memberNo}</td>
              <td className="px-4 py-3 font-semibold text-slate-800">{c.contractorName}</td>
              <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">{c.type}</span></td>
              <td className="px-4 py-3 text-xs text-slate-700 max-w-xs truncate">{c.content}</td>
              <td className="px-4 py-3 text-xs text-slate-600 max-w-xs truncate">{c.action || "-"}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{c.handler}</td>
              <td className="px-4 py-3"><ConsultationStatusBadge status={c.status} /></td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={8} className="text-center py-10 text-slate-400 text-sm">해당 조건의 내역이 없습니다.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Consultations({ initialFilter }: { initialFilter?: ConsultationEntry["status"] }) {
  const [list, setList] = useState<ConsultationEntry[]>(initialConsultations);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<ConsultationEntry | null>(null);
  const [search, setSearch] = useState("");

  // 상담 filters
  const [consultType, setConsultType] = useState("전체");
  const [consultStatus, setConsultStatus] = useState<ConsultationEntry["status"] | "전체">(initialFilter ?? "전체");

  // 민원 filters
  const [complaintType, setComplaintType] = useState("전체");
  const [complaintStatus, setComplaintStatus] = useState<ConsultationEntry["status"] | "전체">("전체");

  useEffect(() => { if (initialFilter) setConsultStatus(initialFilter); }, [initialFilter]);

  const q = search.toLowerCase();
  const consultRows = list.filter((c) =>
    c.category === "상담" &&
    (consultType === "전체" || c.type === consultType) &&
    (consultStatus === "전체" || c.status === consultStatus) &&
    (!q || c.contractorName.includes(q) || c.memberNo.toLowerCase().includes(q) || c.content.includes(q))
  );
  const complaintRows = list.filter((c) =>
    c.category === "민원" &&
    (complaintType === "전체" || c.type === complaintType) &&
    (complaintStatus === "전체" || c.status === complaintStatus) &&
    (!q || c.contractorName.includes(q) || c.memberNo.toLowerCase().includes(q) || c.content.includes(q))
  );

  const FilterPills = ({ options, active, onChange }: { options: string[]; active: string; onChange: (v: string) => void }) => (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)}
          className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${active === o ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          style={active === o ? { background: "#1E3A2B" } : {}}>{o}</button>
      ))}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {/* 공통 검색 필터 바 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="search" /></span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="회원번호 · 계약자 · 내용 검색..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700" />
          </div>
          <Btn size="xs" onClick={() => setShowAdd(true)}><Icon name="plus" /> 상담·민원 기록</Btn>
          <span className="text-xs text-slate-400 font-medium">총 {consultRows.length + complaintRows.length}건</span>
        </div>
      </div>

      {/* 상담 섹션 */}
      <div className="space-y-2">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: "#1E3A2B" }} />
              <h3 className="font-semibold text-slate-800 text-sm">상담</h3>
              <span className="text-xs text-slate-400">{consultRows.length}건</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 shrink-0">상담종류</span>
            <FilterPills options={CONSULT_TYPES} active={consultType} onChange={setConsultType} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 shrink-0">상담상태</span>
            <FilterPills options={["전체", "미처리", "처리중", "처리완료"]} active={consultStatus} onChange={(v) => setConsultStatus(v as ConsultationEntry["status"] | "전체")} />
          </div>
        </div>
        <ConsultTable rows={consultRows} onSelect={setSelected} />
      </div>

      {/* 민원 섹션 */}
      <div className="space-y-2 pt-2">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              <h3 className="font-semibold text-slate-800 text-sm">민원</h3>
              <span className="text-xs text-slate-400">{complaintRows.length}건</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 shrink-0">민원종류</span>
            <FilterPills options={COMPLAINT_TYPES} active={complaintType} onChange={setComplaintType} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 shrink-0">처리상태</span>
            <FilterPills options={["전체", "미처리", "처리중", "처리완료"]} active={complaintStatus} onChange={(v) => setComplaintStatus(v as ConsultationEntry["status"] | "전체")} />
          </div>
        </div>
        <ConsultTable rows={complaintRows} onSelect={setSelected} />
      </div>

      {selected && (
        <ConsultationDetail consultation={selected} onClose={() => setSelected(null)}
          onStatusChange={(id, status) => {
            setList((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
            setSelected((prev) => prev ? { ...prev, status } : null);
          }}
        />
      )}
      {showAdd && (
        <ConsultationModal onClose={() => setShowAdd(false)} onSave={(c) => { setList((prev) => [c, ...prev]); }} />
      )}
    </div>
  );
}

// ─── Consultation Detail Drawer ───────────────────────────────────────────────
function ConsultationDetail({ consultation, onClose, onStatusChange }: {
  consultation: ConsultationEntry;
  onClose: () => void;
  onStatusChange: (id: string, status: ConsultationEntry["status"]) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="flex-1" onClick={onClose} />
      <div className="w-[480px] bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-900">상담 상세</h2>
            <ConsultationStatusBadge status={consultation.status} />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1"><Icon name="x" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">상담일시</p>
              <p className="text-sm text-slate-800 font-medium">{consultation.date}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">담당자</p>
              <p className="text-sm text-slate-800 font-medium">{consultation.handler}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">계약자</p>
              <p className="text-sm text-slate-800 font-medium">{consultation.contractorName}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">회원번호</p>
              <p className="text-sm font-mono text-slate-600">{consultation.memberNo}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">상담 종류</p>
              <span className="text-xs px-2.5 py-1 bg-slate-100 rounded-full text-slate-700 font-medium">{consultation.type}</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">상담 내용</p>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">{consultation.content}</div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">조치 내용</p>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">{consultation.action || "조치 내용 없음"}</div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">처리상태 변경</p>
            <div className="flex gap-2">
              {(["미처리", "처리중", "처리완료"] as const).map((s) => (
                <button key={s} onClick={() => onStatusChange(consultation.id, s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${consultation.status === s ? "text-white border-transparent" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  style={consultation.status === s ? { background: "#1E3A2B" } : {}}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">추가 메모</p>
            <textarea rows={3} placeholder="추가 조치 내용 또는 메모..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 shrink-0">
          <Btn variant="secondary" onClick={onClose}>닫기</Btn>
          <Btn onClick={onClose}>저장</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Termination ──────────────────────────────────────────────────────────────
// ─── All Notifications Page ───────────────────────────────────────────────────
function AllNotificationsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [list, setList] = useState(sampleNotifications);
  const [filter, setFilter] = useState<"전체" | "미읽음" | "읽음">("전체");
  const [typeFilter, setTypeFilter] = useState<string>("전체");

  const types = ["전체", "미납", "서명", "민원", "청구", "만료", "장기미납", "신규"];

  const markAllRead = () => setList(list.map((n) => ({ ...n, read: true })));
  const deleteRead = () => setList(list.filter((n) => !n.read));

  const filtered = list.filter((n) => {
    const matchRead = filter === "전체" || (filter === "미읽음" ? !n.read : n.read);
    const matchType = typeFilter === "전체" || n.type === typeFilter;
    return matchRead && matchType;
  });

  const unreadCount = list.filter((n) => !n.read).length;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {/* Header toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-slate-900">전체 알림</h2>
          {unreadCount > 0 && (
            <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full bg-red-500">{unreadCount}개 미읽음</span>
          )}
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" size="xs" onClick={markAllRead}>모두 읽음 처리</Btn>
          <Btn variant="secondary" size="xs" onClick={deleteRead}>읽은 알림 삭제</Btn>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-500 shrink-0">읽음 상태</span>
          <div className="flex gap-1.5">
            {(["전체", "미읽음", "읽음"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${filter === f ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                style={filter === f ? { background: "#1E3A2B" } : {}}>
                {f}
              </button>
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500 ml-4 shrink-0">알림 유형</span>
          <div className="flex gap-1.5 flex-wrap">
            {types.map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${typeFilter === t ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                style={typeFilter === t ? { background: "#1E3A2B" } : {}}>
                {t}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-slate-400">{filtered.length}건</span>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm">알림이 없습니다.</div>
        )}
        {filtered.map((n) => (
          <div key={n.id}
            className={`flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors ${n.read ? "opacity-60" : ""}`}>
            {/* Unread dot */}
            <div className="mt-1.5 shrink-0">
              {!n.read
                ? <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
                : <span className="w-2.5 h-2.5 rounded-full bg-slate-200 block" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <NotifTypeBadge type={n.type} />
                {!n.read && <span className="text-[10px] font-semibold text-red-600">NEW</span>}
              </div>
              <p className="text-sm text-slate-800 leading-snug">{n.content}</p>
              <span className="text-xs text-slate-400 mt-1 block">{n.time}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => { setList(list.map((x) => x.id === n.id ? { ...x, read: true } : x)); onNavigate(n.page); }}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium whitespace-nowrap">
                바로가기
              </button>
              <button
                onClick={() => setList(list.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 whitespace-nowrap">
                읽음
              </button>
              <button
                onClick={() => setList(list.filter((x) => x.id !== n.id))}
                className="text-slate-300 hover:text-red-500 p-1 transition-colors">
                <Icon name="x" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Termination (해약·이장) ─────────────────────────────────────────────────
interface CancellationRecord {
  id: string;
  memberNo: string;
  contractorName: string;
  phone: string;
  plotNumber: string;
  deceasedName: string;
  cancellationDate: string;
  reason: string;
  refundAmount: number;
  status: "접수" | "처리중" | "완료" | "반려";
  handler: string;
  note?: string;
}

interface TransferRecord {
  id: string;
  memberNo: string;
  contractorName: string;
  phone: string;
  fromPlot: string;
  deceasedName: string;
  transferDate: string;
  reason: string;
  destination: string;
  status: "접수" | "처리중" | "완료" | "반려";
  handler: string;
  note?: string;
}

const sampleCancellations: CancellationRecord[] = [
  { id: "ca001", memberNo: "M2022-0089", contractorName: "최수현", phone: "010-7788-4455", plotNumber: "A-05-18", deceasedName: "최광호", cancellationDate: "2024-06-20", reason: "가족 합의로 인한 계약 해지", refundAmount: 1900000, status: "완료", handler: "김담당", note: "계약금 50% 환불 완료" },
  { id: "ca002", memberNo: "M2024-0033", contractorName: "정우진", phone: "010-2233-6677", plotNumber: "D-01-07", deceasedName: "정현숙", cancellationDate: "2024-07-10", reason: "납부 불이행으로 인한 직권 해약", refundAmount: 0, status: "처리중", handler: "이담당" },
  { id: "ca003", memberNo: "M2021-0055", contractorName: "한소희", phone: "010-8844-1122", plotNumber: "B-09-21", deceasedName: "한영수", cancellationDate: "2024-07-14", reason: "관리기간 만료 후 갱신 포기", refundAmount: 320000, status: "접수", handler: "박담당" },
];

const sampleTransfers: TransferRecord[] = [
  { id: "tr001", memberNo: "M2023-0142", contractorName: "박지호", phone: "010-5567-2289", fromPlot: "C-07-03", deceasedName: "박순자", transferDate: "2024-05-15", reason: "가족묘 통합 이장", destination: "서울 망우묘지", status: "완료", handler: "김담당", note: "이장 완료 확인서 수령" },
  { id: "tr002", memberNo: "M2020-0011", contractorName: "신지아", phone: "010-1144-7766", fromPlot: "C-11-15", deceasedName: "신병국", transferDate: "2024-07-08", reason: "연고지 이전으로 인한 이장", destination: "경기 용인공원묘원", status: "처리중", handler: "이담당" },
];

function TermStatusBadge({ status }: { status: "접수" | "처리중" | "완료" | "반려" }) {
  const map = {
    접수: "bg-blue-100 text-blue-800",
    처리중: "bg-amber-100 text-amber-800",
    완료: "bg-emerald-100 text-emerald-800",
    반려: "bg-red-100 text-red-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{status}</span>;
}

// 해약 등록 모달
function CancellationModal({ onClose, onSave }: { onClose: () => void; onSave: (r: CancellationRecord) => void }) {
  const [step, setStep] = useState(0);
  const [contractorName, setContractorName] = useState("");
  const [memberNo, setMemberNo] = useState("");
  const [phone, setPhone] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [deceasedName, setDeceasedName] = useState("");
  const [cancellationDate, setCancellationDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [note, setNote] = useState("");
  const [handler, setHandler] = useState("김담당");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Modal title="해약 등록 완료" onClose={onClose}>
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#fee2e2" }}>
            <span className="text-red-600"><Icon name="check" /></span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">해약이 접수되었습니다</h3>
          <p className="text-sm text-slate-500 mb-6">담당자 확인 후 해약 처리가 진행됩니다.</p>
          <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2 max-w-xs mx-auto">
            <div className="flex justify-between"><span className="text-slate-500">계약자</span><span className="font-medium">{contractorName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">묘역번호</span><span className="font-medium">{plotNumber}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">환불금액</span><span className="font-medium text-red-600">{refundAmount ? Number(refundAmount).toLocaleString() + "원" : "0원"}</span></div>
          </div>
          <div className="mt-6"><Btn onClick={onClose}>닫기</Btn></div>
        </div>
      </Modal>
    );
  }

  const steps = ["계약 정보", "해약 정보"];
  return (
    <Modal title="해약 등록"
      onClose={onClose}
      size="md"
      footer={
        <>
          {step > 0 && <Btn variant="secondary" onClick={() => setStep(0)}>이전</Btn>}
          <Btn variant="secondary" onClick={onClose}>취소</Btn>
          {step === 0
            ? <Btn onClick={() => setStep(1)}>다음</Btn>
            : <Btn variant="danger" onClick={() => {
                onSave({ id: `ca${Date.now()}`, memberNo, contractorName, phone, plotNumber, deceasedName, cancellationDate, reason, refundAmount: Number(refundAmount) || 0, status: "접수", handler, note });
                setDone(true);
              }}>해약 접수</Btn>
          }
        </>
      }
    >
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-5">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: i <= step ? "#dc2626" : "#e2e8f0", color: i <= step ? "white" : "#94a3b8" }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="text-[10px] mt-1 font-medium" style={{ color: i === step ? "#dc2626" : "#94a3b8" }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px mx-1 mt-[-12px]" style={{ background: i < step ? "#dc2626" : "#e2e8f0" }} />}
          </div>
        ))}
      </div>
      {step === 0 && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="회원번호"><Input value={memberNo} onChange={setMemberNo} placeholder="예: M2024-0001" /></Field>
          <Field label="계약자 *"><Input value={contractorName} onChange={setContractorName} placeholder="계약자 성명" /></Field>
          <Field label="연락처"><Input value={phone} onChange={setPhone} placeholder="010-0000-0000" /></Field>
          <Field label="묘역번호 *"><Input value={plotNumber} onChange={setPlotNumber} placeholder="예: A-12-05" /></Field>
          <Field label="안치자 *" span2><Input value={deceasedName} onChange={setDeceasedName} placeholder="안치자 성명" /></Field>
        </div>
      )}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="해약일 *"><Input value={cancellationDate} onChange={setCancellationDate} placeholder="YYYY-MM-DD" /></Field>
          <Field label="담당자"><Select options={["김담당", "이담당", "박담당", "최담당"]} value={handler} onChange={setHandler} /></Field>
          <Field label="해약 사유 *" span2>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="해약 사유를 상세히 입력하세요..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none" />
          </Field>
          <Field label="환불금액 (원)"><Input value={refundAmount} onChange={setRefundAmount} placeholder="0" /></Field>
          <Field label="비고"><Input value={note} onChange={setNote} placeholder="특이사항" /></Field>
          <div className="col-span-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
            <strong>주의:</strong> 해약 접수 후 담당자 확인이 완료되면 계약 상태가 '해약'으로 변경됩니다. 환불금액은 관련 규정에 따라 검토 후 최종 확정됩니다.
          </div>
        </div>
      )}
    </Modal>
  );
}

// 이장 등록 모달
function TransferModal({ onClose, onSave }: { onClose: () => void; onSave: (r: TransferRecord) => void }) {
  const [contractorName, setContractorName] = useState("");
  const [memberNo, setMemberNo] = useState("");
  const [phone, setPhone] = useState("");
  const [fromPlot, setFromPlot] = useState("");
  const [deceasedName, setDeceasedName] = useState("");
  const [transferDate, setTransferDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState("");
  const [destination, setDestination] = useState("");
  const [note, setNote] = useState("");
  const [handler, setHandler] = useState("김담당");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Modal title="이장 등록 완료" onClose={onClose}>
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#fef3c7" }}>
            <span className="text-amber-600"><Icon name="check" /></span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">이장이 접수되었습니다</h3>
          <p className="text-sm text-slate-500 mb-6">담당자 확인 후 이장 처리가 진행됩니다.</p>
          <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2 max-w-xs mx-auto">
            <div className="flex justify-between"><span className="text-slate-500">계약자</span><span className="font-medium">{contractorName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">기존 묘역</span><span className="font-medium">{fromPlot}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">이장 예정지</span><span className="font-medium">{destination}</span></div>
          </div>
          <div className="mt-6"><Btn onClick={onClose}>닫기</Btn></div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="이장 등록"
      onClose={onClose}
      size="md"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>취소</Btn>
          <Btn onClick={() => {
            onSave({ id: `tr${Date.now()}`, memberNo, contractorName, phone, fromPlot, deceasedName, transferDate, reason, destination, status: "접수", handler, note });
            setDone(true);
          }} >이장 접수</Btn>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="회원번호"><Input value={memberNo} onChange={setMemberNo} placeholder="예: M2024-0001" /></Field>
        <Field label="계약자 *"><Input value={contractorName} onChange={setContractorName} placeholder="계약자 성명" /></Field>
        <Field label="연락처"><Input value={phone} onChange={setPhone} placeholder="010-0000-0000" /></Field>
        <Field label="기존 묘역번호 *"><Input value={fromPlot} onChange={setFromPlot} placeholder="예: A-12-05" /></Field>
        <Field label="안치자 *" span2><Input value={deceasedName} onChange={setDeceasedName} placeholder="안치자 성명" /></Field>
        <Field label="이장일 *"><Input value={transferDate} onChange={setTransferDate} placeholder="YYYY-MM-DD" /></Field>
        <Field label="담당자"><Select options={["김담당", "이담당", "박담당", "최담당"]} value={handler} onChange={setHandler} /></Field>
        <Field label="이장 사유 *" span2>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="이장 사유를 상세히 입력하세요..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 resize-none" />
        </Field>
        <Field label="이장 예정지 *"><Input value={destination} onChange={setDestination} placeholder="예: 서울 망우묘지" /></Field>
        <Field label="비고"><Input value={note} onChange={setNote} placeholder="특이사항" /></Field>
        <div className="col-span-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
          <strong>안내:</strong> 이장 신청 후 유관기관 협의 및 현장 확인이 필요합니다. 처리까지 최대 2주 소요될 수 있습니다.
        </div>
      </div>
    </Modal>
  );
}

// 해약 상세 드로어
function CancellationDetail({ record, onClose, onStatusChange }: {
  record: CancellationRecord;
  onClose: () => void;
  onStatusChange: (id: string, status: CancellationRecord["status"]) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="flex-1" onClick={onClose} />
      <div className="w-[460px] bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-900">해약 상세</h2>
            <TermStatusBadge status={record.status} />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1"><Icon name="x" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "회원번호", v: record.memberNo },
              { label: "계약자", v: record.contractorName },
              { label: "연락처", v: record.phone },
              { label: "묘역번호", v: record.plotNumber },
              { label: "안치자", v: record.deceasedName },
              { label: "해약일", v: record.cancellationDate },
              { label: "담당자", v: record.handler },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">{f.label}</p>
                <p className="text-sm text-slate-800 font-medium">{f.v}</p>
              </div>
            ))}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">환불금액</p>
              <p className="text-sm font-bold text-red-600">{record.refundAmount.toLocaleString()}원</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">해약 사유</p>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">{record.reason}</div>
          </div>
          {record.note && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">비고</p>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">{record.note}</div>
            </div>
          )}
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">처리상태 변경</p>
            <div className="flex gap-2">
              {(["접수", "처리중", "완료", "반려"] as const).map((s) => (
                <button key={s} onClick={() => onStatusChange(record.id, s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${record.status === s ? "text-white border-transparent" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  style={record.status === s ? { background: "#1E3A2B" } : {}}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">처리 메모</p>
            <textarea rows={3} placeholder="처리 내용 또는 메모..." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 shrink-0">
          <Btn variant="secondary" onClick={onClose}>닫기</Btn>
          <Btn onClick={onClose}>저장</Btn>
        </div>
      </div>
    </div>
  );
}

// 이장 상세 드로어
function TransferDetail({ record, onClose, onStatusChange }: {
  record: TransferRecord;
  onClose: () => void;
  onStatusChange: (id: string, status: TransferRecord["status"]) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="flex-1" onClick={onClose} />
      <div className="w-[460px] bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-900">이장 상세</h2>
            <TermStatusBadge status={record.status} />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1"><Icon name="x" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "회원번호", v: record.memberNo },
              { label: "계약자", v: record.contractorName },
              { label: "연락처", v: record.phone },
              { label: "기존 묘역", v: record.fromPlot },
              { label: "안치자", v: record.deceasedName },
              { label: "이장일", v: record.transferDate },
              { label: "이장 예정지", v: record.destination },
              { label: "담당자", v: record.handler },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">{f.label}</p>
                <p className="text-sm text-slate-800 font-medium">{f.v}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">이장 사유</p>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">{record.reason}</div>
          </div>
          {record.note && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">비고</p>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">{record.note}</div>
            </div>
          )}
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">처리상태 변경</p>
            <div className="flex gap-2">
              {(["접수", "처리중", "완료", "반려"] as const).map((s) => (
                <button key={s} onClick={() => onStatusChange(record.id, s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${record.status === s ? "text-white border-transparent" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  style={record.status === s ? { background: "#1E3A2B" } : {}}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">처리 메모</p>
            <textarea rows={3} placeholder="처리 내용 또는 메모..." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 shrink-0">
          <Btn variant="secondary" onClick={onClose}>닫기</Btn>
          <Btn onClick={onClose}>저장</Btn>
        </div>
      </div>
    </div>
  );
}

function Termination() {
  const [cancellations, setCancellations] = useState<CancellationRecord[]>(sampleCancellations);
  const [transfers, setTransfers] = useState<TransferRecord[]>(sampleTransfers);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedCancel, setSelectedCancel] = useState<CancellationRecord | null>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRecord | null>(null);
  const [cancelStatusFilter, setCancelStatusFilter] = useState<string>("전체");
  const [transferStatusFilter, setTransferStatusFilter] = useState<string>("전체");
  const [search, setSearch] = useState("");

  const statusOptions = ["전체", "접수", "처리중", "완료", "반려"];
  const q = search.toLowerCase();

  const filteredCancellations = cancellations.filter((c) =>
    (cancelStatusFilter === "전체" || c.status === cancelStatusFilter) &&
    (!q || c.contractorName.includes(q) || c.memberNo.toLowerCase().includes(q) || c.deceasedName.includes(q))
  );
  const filteredTransfers = transfers.filter((t) =>
    (transferStatusFilter === "전체" || t.status === transferStatusFilter) &&
    (!q || t.contractorName.includes(q) || t.memberNo.toLowerCase().includes(q) || t.deceasedName.includes(q))
  );

  const StatusPills = ({ active, onChange }: { active: string; onChange: (s: string) => void }) => (
    <div className="flex gap-1.5">
      {statusOptions.map((s) => (
        <button key={s} onClick={() => onChange(s)}
          className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${active === s ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          style={active === s ? { background: "#1E3A2B" } : {}}>{s}</button>
      ))}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {/* 공통 검색 필터 바 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="search" /></span>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="회원번호 · 계약자 · 안치자 검색..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700" />
          </div>
          <Btn size="xs" onClick={() => setShowCancelModal(true)}><Icon name="plus" /> 해약 등록</Btn>
          <Btn size="xs" variant="secondary" onClick={() => setShowTransferModal(true)}><Icon name="plus" /> 이장 등록</Btn>
        </div>
      </div>

      {/* 해약 관리 섹션 */}
      <div className="space-y-2">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <h3 className="font-semibold text-slate-800 text-sm">해약 관리</h3>
              <span className="text-xs text-slate-400">{filteredCancellations.length}건</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 shrink-0">처리상태</span>
            <StatusPills active={cancelStatusFilter} onChange={setCancelStatusFilter} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {["회원번호", "계약자", "연락처", "묘역번호", "안치자", "해약일", "해약사유", "환불금액", "담당자", "상태"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCancellations.map((c) => (
                <tr key={c.id} onClick={() => setSelectedCancel(c)}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.memberNo}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{c.contractorName}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{c.phone}</td>
                  <td className="px-4 py-3 font-mono text-sm font-medium" style={{ color: "#1E3A2B" }}>{c.plotNumber}</td>
                  <td className="px-4 py-3 text-slate-700">{c.deceasedName}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{c.cancellationDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[180px] truncate">{c.reason}</td>
                  <td className="px-4 py-3 text-xs font-mono text-red-600">{c.refundAmount > 0 ? c.refundAmount.toLocaleString() + "원" : "-"}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{c.handler}</td>
                  <td className="px-4 py-3"><TermStatusBadge status={c.status} /></td>
                </tr>
              ))}
              {filteredCancellations.length === 0 && (
                <tr><td colSpan={10} className="text-center py-10 text-slate-400 text-sm">해당 조건의 해약 내역이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 이장 관리 섹션 */}
      <div className="space-y-2 pt-2">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="font-semibold text-slate-800 text-sm">이장 관리</h3>
            <span className="text-xs text-slate-400">{filteredTransfers.length}건</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 shrink-0">처리상태</span>
            <StatusPills active={transferStatusFilter} onChange={setTransferStatusFilter} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {["회원번호", "계약자", "연락처", "기존 묘역", "안치자", "이장일", "이장사유", "이장 예정지", "담당자", "상태"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.map((t) => (
                <tr key={t.id} onClick={() => setSelectedTransfer(t)}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.memberNo}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{t.contractorName}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{t.phone}</td>
                  <td className="px-4 py-3 font-mono text-sm font-medium" style={{ color: "#1E3A2B" }}>{t.fromPlot}</td>
                  <td className="px-4 py-3 text-slate-700">{t.deceasedName}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{t.transferDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[180px] truncate">{t.reason}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[140px] truncate">{t.destination}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{t.handler}</td>
                  <td className="px-4 py-3"><TermStatusBadge status={t.status} /></td>
                </tr>
              ))}
              {filteredTransfers.length === 0 && (
                <tr><td colSpan={10} className="text-center py-10 text-slate-400 text-sm">해당 조건의 이장 내역이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals & Drawers */}
      {showCancelModal && <CancellationModal onClose={() => setShowCancelModal(false)} onSave={(r) => { setCancellations((prev) => [r, ...prev]); setShowCancelModal(false); }} />}
      {showTransferModal && <TransferModal onClose={() => setShowTransferModal(false)} onSave={(r) => { setTransfers((prev) => [r, ...prev]); setShowTransferModal(false); }} />}
      {selectedCancel && (
        <CancellationDetail record={selectedCancel} onClose={() => setSelectedCancel(null)}
          onStatusChange={(id, status) => {
            setCancellations((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
            setSelectedCancel((prev) => prev ? { ...prev, status } : null);
          }}
        />
      )}
      {selectedTransfer && (
        <TransferDetail record={selectedTransfer} onClose={() => setSelectedTransfer(null)}
          onStatusChange={(id, status) => {
            setTransfers((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
            setSelectedTransfer((prev) => prev ? { ...prev, status } : null);
          }}
        />
      )}
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function Reports() {
  const [dateFrom, setDateFrom] = useState("2024-01-01");
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10));
  const reportTypes = ["계약 현황", "묘역 현황", "수납 현황", "관리비 현황", "미납 현황", "해약 현황"];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* Date range */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600"><Icon name="calendar" /> 기간 설정</span>
        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20" />
          <span className="text-slate-400 text-sm">~</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20" />
        </div>
        <div className="flex gap-1.5">
          {["이번달", "3개월", "6개월", "1년"].map((q) => (
            <button key={q} className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">{q}</button>
          ))}
        </div>
        <Btn size="xs"><Icon name="search" /> 조회</Btn>
        <span className="text-xs text-slate-400 ml-auto">기간: {dateFrom} ~ {dateTo}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {reportTypes.map((r) => (
          <div key={r} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "#f0f6f2" }}>
              <span style={{ color: "#1E3A2B" }}><Icon name="reports" /></span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">{r}</h3>
            <p className="text-xs text-slate-500 mb-4">{dateFrom} ~ {dateTo} 기준</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 text-xs px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                <Icon name="download" /> Excel
              </button>
              <button className="flex items-center gap-1 text-xs px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                <Icon name="download" /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function Settings() {
  const [active, setActive] = useState<string | null>(null);

  const items = [
    { id: "price", label: "단가관리", desc: "묘역 유형별 단가 설정" },
    { id: "users", label: "사용자관리", desc: "시스템 사용자 계정 관리" },
    { id: "roles", label: "권한관리", desc: "역할별 메뉴 접근 권한 설정" },
    { id: "park", label: "공원정보", desc: "공원묘원 기본 정보 설정" },
    { id: "alerts", label: "알림 설정", desc: "자동 알림 및 발송 설정" },
  ];

  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Left menu */}
      <div className="w-64 bg-white border-r border-slate-200 p-4 space-y-1">
        {items.map((item) => (
          <button key={item.id} onClick={() => setActive(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${active === item.id ? "text-white" : "hover:bg-slate-50 text-slate-700"}`}
            style={active === item.id ? { background: "#1E3A2B" } : {}}>
            <div>
              <div className={`text-sm font-medium ${active === item.id ? "text-white" : ""}`}>{item.label}</div>
              <div className={`text-xs ${active === item.id ? "text-white/70" : "text-slate-400"}`}>{item.desc}</div>
            </div>
            <span className={active === item.id ? "text-white/60" : "text-slate-300"}><Icon name="chevronRight" /></span>
          </button>
        ))}
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto p-6">
        {!active && (
          <div className="text-center py-24 text-slate-400">
            <div className="text-4xl mb-3">⚙️</div>
            <p className="text-sm">좌측 메뉴에서 설정 항목을 선택하세요.</p>
          </div>
        )}

        {active === "price" && (
          <div className="space-y-4">
            <h2 className="font-bold text-slate-900 text-lg">단가관리</h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 border-b border-slate-200">{["묘역유형", "크기", "단가(원)", "적용일", ""].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    { type: "잔디형", size: "2평", price: "1,050,000", date: "2024-01-01" },
                    { type: "잔디형", size: "3평", price: "1,200,000", date: "2024-01-01" },
                    { type: "잔디형", size: "4평", price: "1,350,000", date: "2024-01-01" },
                    { type: "수목장", size: "2평", price: "1,100,000", date: "2024-01-01" },
                    { type: "수목장", size: "3평", price: "1,250,000", date: "2024-01-01" },
                    { type: "일반형", size: "2평", price: "980,000", date: "2024-01-01" },
                    { type: "일반형", size: "3평", price: "1,100,000", date: "2024-01-01" },
                    { type: "일반형", size: "4평", price: "1,300,000", date: "2024-01-01" },
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm">{r.type}</td>
                      <td className="px-4 py-3 text-sm">{r.size}</td>
                      <td className="px-4 py-3 font-mono font-medium">{r.price}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                      <td className="px-4 py-3"><button className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-50">수정</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Btn size="xs"><Icon name="plus" /> 단가 추가</Btn>
          </div>
        )}

        {active === "users" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">사용자관리</h2>
              <Btn size="xs"><Icon name="plus" /> 사용자 추가</Btn>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 border-b border-slate-200">{["이름", "이메일", "역할", "최종 로그인", "상태", ""].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    { name: "관리자", email: "admin@myowon365.kr", role: "시스템관리자", login: "2024-07-15 09:30", active: true },
                    { name: "김담당", email: "kim@myowon365.kr", role: "계약담당자", login: "2024-07-15 14:22", active: true },
                    { name: "이담당", email: "lee@myowon365.kr", role: "수납담당자", login: "2024-07-14 16:45", active: true },
                    { name: "박담당", email: "park@myowon365.kr", role: "묘역관리자", login: "2024-07-13 11:00", active: false },
                  ].map((u, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">{u.role}</span></td>
                      <td className="px-4 py-3 text-xs text-slate-500">{u.login}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded font-medium ${u.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>{u.active ? "활성" : "비활성"}</span></td>
                      <td className="px-4 py-3"><button className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-50">수정</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {active === "roles" && (
          <div className="space-y-4">
            <h2 className="font-bold text-slate-900 text-lg">권한관리</h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">메뉴</th>
                    {["시스템관리자", "계약담당자", "수납담당자", "묘역관리자"].map((r) => (
                      <th key={r} className="px-4 py-3 text-center text-xs font-semibold text-slate-600">{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { menu: "대시보드", perms: [true, true, true, true] },
                    { menu: "계약관리", perms: [true, true, false, false] },
                    { menu: "묘역관리", perms: [true, true, false, true] },
                    { menu: "수납·청구", perms: [true, false, true, false] },
                    { menu: "상담·민원", perms: [true, true, false, false] },
                    { menu: "리포트", perms: [true, true, true, false] },
                    { menu: "설정", perms: [true, false, false, false] },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-700">{row.menu}</td>
                      {row.perms.map((p, j) => (
                        <td key={j} className="px-4 py-3 text-center">
                          <input type="checkbox" defaultChecked={p} className="rounded" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end"><Btn size="xs">저장</Btn></div>
          </div>
        )}

        {active === "park" && (
          <div className="space-y-4 max-w-lg">
            <h2 className="font-bold text-slate-900 text-lg">공원정보</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              {[
                { label: "공원명", val: "묘원365 공원묘원" },
                { label: "사업자번호", val: "123-45-67890" },
                { label: "대표자", val: "홍길동" },
                { label: "전화번호", val: "02-1234-5678" },
                { label: "팩스번호", val: "02-1234-5679" },
                { label: "이메일", val: "info@myowon365.kr" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-4">
                  <label className="text-sm font-medium text-slate-600 w-28 shrink-0">{f.label}</label>
                  <Input defaultValue={f.val} />
                </div>
              ))}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-600 w-28 shrink-0">주소</label>
                <Input defaultValue="경기도 성남시 분당구 묘원로 123" />
              </div>
              <div className="flex justify-end pt-2"><Btn size="sm">저장</Btn></div>
            </div>
          </div>
        )}

        {active === "alerts" && (
          <div className="space-y-4 max-w-lg">
            <h2 className="font-bold text-slate-900 text-lg">알림 설정</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              {[
                { label: "미납 자동 알림", desc: "납부 마감일 경과 시 계약자 자동 알림 발송", on: true },
                { label: "관리비 청구 알림", desc: "청구 생성 시 계약자 문자/이메일 발송", on: true },
                { label: "장기미납 알림", desc: "6개월 이상 미납 시 관리자 알림", on: true },
                { label: "서명 요청 알림", desc: "이폼사인 서명 요청 발송 후 3일 경과 알림", on: true },
                { label: "관리기간 만료 알림", desc: "만료 30일 전 계약자 및 관리자 알림", on: false },
                { label: "신규 민원 알림", desc: "신규 민원/상담 접수 시 담당자 알림", on: true },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{a.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{a.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={a.on} className="sr-only peer" />
                    <div className="w-10 h-5 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all bg-slate-200 peer-checked:bg-emerald-600" />
                  </label>
                </div>
              ))}
              <div className="flex justify-end pt-2"><Btn size="sm">저장</Btn></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page Meta ────────────────────────────────────────────────────────────────
const pageMeta: Record<string, string[]> = {
  dashboard: ["묘원365", "대시보드"],
  contracts: ["묘원365", "계약관리", "계약 목록"],
  "contract-detail": ["묘원365", "계약관리", "계약 상세"],
  plots: ["묘원365", "묘역관리", "묘역 도면"],
  payments: ["묘원365", "수납·청구"],
  consultations: ["묘원365", "상담·민원"],
  termination: ["묘원365", "해약·이장"],
  statistics: ["묘원365", "통계관리"],
  notifications: ["묘원365", "전체 알림"],
  reports: ["묘원365", "리포트"],
  settings: ["묘원365", "설정"],
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [contractPreFilter, setContractPreFilter] = useState<{
    search?: string;
    paymentStatus?: PaymentStatus;
    contractStatus?: ContractStatus;
  }>({});
  const [paymentsTab, setPaymentsTab] = useState<string | undefined>(undefined);
  const [consultFilter, setConsultFilter] = useState<ConsultationEntry["status"] | undefined>(undefined);

  const handleNav = (p: Page) => {
    setPage(p);
    if (p !== "contract-detail") setSelectedContractId(null);
  };

  const handleFilter = (f: DashboardFilter) => {
    if (f.page === "contracts") {
      setContractPreFilter({
        paymentStatus: f.paymentStatus,
        contractStatus: f.contractStatus,
      });
      setPage("contracts");
    } else if (f.page === "payments") {
      setPaymentsTab(f.paymentsTab);
      setPage("payments");
    } else if (f.page === "consultations") {
      setConsultFilter(f.consultStatus);
      setPage("consultations");
    } else {
      setPage(f.page);
    }
  };

  const handleSearchSubmit = (q: string) => {
    setGlobalSearch(q);
    setContractPreFilter({ search: q });
    setPage("contracts");
  };

  const handleSelectContract = (id: string) => {
    setSelectedContractId(id);
    setPage("contract-detail");
  };

  const breadcrumb = pageMeta[page] ?? pageMeta["dashboard"];

  return (
    <div className="flex h-full" style={{ background: "#F3F6F4", fontFamily: "'Noto Sans KR', 'Inter', sans-serif" }}>
      <Sidebar current={page} onNav={handleNav} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          breadcrumb={breadcrumb}
          onSearchSubmit={handleSearchSubmit}
          onNav={handleNav}
          notifications={sampleNotifications}
        />
        {page === "dashboard" && <Dashboard onNav={handleNav} onFilter={handleFilter} />}
        {page === "contracts" && (
          <ContractList
            onSelect={handleSelectContract}
            initialSearch={contractPreFilter.search}
            initialPaymentFilter={contractPreFilter.paymentStatus}
            initialContractFilter={contractPreFilter.contractStatus}
          />
        )}
        {page === "contract-detail" && selectedContractId && (
          <ContractDetail contractId={selectedContractId} onBack={() => setPage("contracts")} />
        )}
        {page === "plots" && <PlotManagement />}
        {page === "payments" && <PaymentManagement initialTab={paymentsTab} />}
        {page === "consultations" && <Consultations initialFilter={consultFilter} />}
        {page === "termination" && <Termination />}
        {page === "notifications" && <AllNotificationsPage onNavigate={handleNav} />}
        {page === "statistics" && <Statistics />}
        {page === "reports" && <Reports />}
        {page === "settings" && <Settings />}
      </div>
    </div>
  );
}
