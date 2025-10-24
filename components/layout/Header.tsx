"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { classNames } from "@/lib/classNames";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/player", label: "Player" }
];

export function Header() {
  const pathname = usePathname();

  const activePath = useMemo(() => {
    if (!pathname) return "/";
    if (pathname.startsWith("/player")) return "/player";
    return "/";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10 lg:px-12">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-base font-bold text-slate-950 shadow-lg">
            MV
          </span>
          <span>Music Visualizer</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(
                "rounded-full px-4 py-2 transition",
                activePath === item.href
                  ? "bg-white text-slate-900"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
