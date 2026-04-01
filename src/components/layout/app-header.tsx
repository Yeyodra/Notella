"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function AppHeader({ title }: { title?: string }) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      {title && <h1 className="text-sm font-medium">{title}</h1>}
    </header>
  );
}
