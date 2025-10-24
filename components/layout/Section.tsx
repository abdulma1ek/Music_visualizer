import type { ReactNode } from "react";

export function Section({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="flex flex-col gap-2 text-left">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">{title}</h2>
        {subtitle ? <p className="max-w-2xl text-base text-slate-300">{subtitle}</p> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
