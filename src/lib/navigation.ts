export type NavIcon =
  | "dashboard"
  | "contracts"
  | "plots"
  | "billing"
  | "consultations"
  | "terminations"
  | "statistics"
  | "reports"
  | "settings";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
};

export type Crumb = {
  href?: string;
  label: string;
};

export const navItems: NavItem[] = [
  { href: "/", label: "대시보드", icon: "dashboard" },
  { href: "/contracts", label: "계약관리", icon: "contracts" },
  { href: "/plots", label: "묘역관리", icon: "plots" },
  { href: "/billing", label: "수납·청구", icon: "billing" },
  { href: "/consultations", label: "상담·민원", icon: "consultations" },
  { href: "/terminations", label: "해약·이장", icon: "terminations" },
  { href: "/statistics", label: "통계", icon: "statistics" },
  { href: "/reports", label: "리포트", icon: "reports" },
  { href: "/settings", label: "설정", icon: "settings" },
];

export const settingsItems = [
  {
    href: "/settings/prices",
    label: "단가관리",
    description: "묘역 사용료와 관리비 기준",
  },
  {
    href: "/settings/users",
    label: "사용자관리",
    description: "묘원 소속 계정",
  },
  {
    href: "/settings/roles",
    label: "권한관리",
    description: "역할별 접근",
  },
  {
    href: "/settings/cemetery",
    label: "공원정보",
    description: "묘원 기본 정보",
  },
  {
    href: "/settings/notifications",
    label: "알림 설정",
    description: "발송 조건. 외부 발송은 연동 전",
  },
];

const staticCrumbs: Record<string, Crumb[]> = {
  "/": [{ label: "대시보드" }],
  "/contracts": [
    { href: "/contracts", label: "계약관리" },
    { label: "계약 목록" },
  ],
  "/contracts/new": [
    { href: "/contracts", label: "계약관리" },
    { label: "신규 계약" },
  ],
  "/plots": [{ label: "묘역관리" }],
  "/billing": [{ label: "수납·청구" }],
  "/consultations": [{ label: "상담·민원" }],
  "/terminations": [{ label: "해약·이장" }],
  "/statistics": [{ label: "통계" }],
  "/reports": [{ label: "리포트" }],
  "/settings": [{ label: "설정" }],
  "/notifications": [{ label: "알림" }],
};

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function breadcrumbsFor(pathname: string): Crumb[] {
  const exact = staticCrumbs[pathname];
  if (exact) return exact;

  if (pathname.startsWith("/contracts/")) {
    return [
      { href: "/contracts", label: "계약관리" },
      { label: "계약 상세" },
    ];
  }

  if (pathname.startsWith("/settings/")) {
    const item = settingsItems.find((entry) => pathname.startsWith(entry.href));
    return [
      { href: "/settings", label: "설정" },
      { label: item?.label ?? "설정" },
    ];
  }

  return [{ label: "묘원에이전트" }];
}
