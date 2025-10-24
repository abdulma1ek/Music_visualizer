import type { ReactNode } from "react";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col md:flex-row">
        <Sidebar className="md:sticky md:top-24 md:h-[calc(100vh-6rem)] md:overflow-y-auto" />
        <div className="flex-1 px-6 pb-16 pt-6 md:px-10 lg:px-12">{children}</div>
      </div>
    </div>
  );
}
