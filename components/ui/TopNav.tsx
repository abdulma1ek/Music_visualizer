"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type NavHref = '/' | '/player' | '/upload';

const navLinks: ReadonlyArray<{ href: NavHref; label: string }> = [
  { href: "/", label: "Overview" },
  { href: "/player", label: "Player" },
  { href: "/upload", label: "Upload" }
];

export function TopNav() {
  const pathname = usePathname();

  const activeHref = useMemo(() => {
    if (!pathname) return "/";
    const exact = navLinks.find((link) => link.href === pathname);
    if (exact) return exact.href;
    if (pathname.startsWith("/player")) return "/player";
    if (pathname.startsWith("/upload")) return "/upload";
    return "/";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 mx-auto mt-6 flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/50 px-6 py-3 backdrop-blur-xl transition hover:border-teal-400/30">
      <Link href="/" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/40">
          HV
        </span>
        Harmonic&nbsp;Vista
      </Link>
      <nav className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.4em] text-white/60">
        {navLinks.map((link) => {
          const isActive = link.href === activeHref;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 transition ${
                isActive
                  ? "bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/40"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
