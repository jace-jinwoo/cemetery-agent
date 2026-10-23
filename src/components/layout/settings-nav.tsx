"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsItems } from "@/lib/navigation";

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 shrink-0 space-y-1" aria-label="설정 메뉴">
      {settingsItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`block rounded-xl px-4 py-3 ${active ? "bg-forest text-white" : "bg-white text-slate-700 hover:bg-slate-50"}`}
          >
            <div className="text-sm font-medium">{item.label}</div>
            <div className={`mt-0.5 text-xs ${active ? "text-white/70" : "text-slate-400"}`}>
              {item.description}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
