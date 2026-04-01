"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { modules } from "@/lib/modules";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Notella
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((mod) => {
                const isActive =
                  mod.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(mod.href);
                return (
                  <SidebarMenuItem key={mod.id}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={mod.href}>
                        <mod.icon className="size-4" />
                        <span>{mod.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-8",
            },
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
