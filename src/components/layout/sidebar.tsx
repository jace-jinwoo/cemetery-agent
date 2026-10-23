"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavIcon from "@/components/layout/nav-icon";
import { isActive, navItems } from "@/lib/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-forest">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sage text-sm font-bold text-white">
          묘
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight text-white">묘원에이전트</div>
          <div className="text-[11px] leading-tight text-mist">공원묘원 운영</div>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="주 메뉴">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                active ? "bg-sage text-white" : "text-mist hover:bg-white/5 hover:text-white"
              }`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-4 py-4">
        <div className="text-xs font-medium text-white">세션 없음</div>
        <div className="mt-0.5 text-[11px] text-mist">인증은 다음 단계에서 연결</div>
      </div>
    </aside>
  );
}
