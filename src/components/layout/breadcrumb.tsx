"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { breadcrumbsFor } from "@/lib/navigation";

export default function Breadcrumb() {
  const crumbs = breadcrumbsFor(usePathname());

  return (
    <nav aria-label="breadcrumb" className="mb-4 text-xs text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-slate-800">
            묘원에이전트
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.label} className="flex items-center gap-1.5">
            <span aria-hidden="true">/</span>
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-slate-800">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-slate-700">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
