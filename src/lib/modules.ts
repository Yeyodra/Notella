import { LayoutDashboard, Kanban, Bookmark, StickyNote, Settings } from "lucide-react";

export const modules = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "kanban", name: "Kanban", icon: Kanban, href: "/kanban" },
  { id: "bookmarks", name: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
  { id: "notes", name: "Notes", icon: StickyNote, href: "/notes" },
  { id: "settings", name: "Settings", icon: Settings, href: "/settings" },
] as const;
