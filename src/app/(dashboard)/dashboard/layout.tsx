"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BookOpen, Users, Star, ShoppingCart, MessageSquare, Award, Shield, Menu, X, LogOut, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/permissions";
import type { AdminPermission } from "@/types/admin";

interface SidebarLink {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  permission?: AdminPermission;
}

const sidebarLinks: SidebarLink[] = [
  { icon: LayoutDashboard, label: "الإحصائيات", href: "/dashboard" },
  { icon: BookOpen, label: "الدورات", href: "/dashboard/courses", permission: "manage_courses" },
  { icon: Users, label: "المدربون", href: "/dashboard/instructors", permission: "manage_instructors" },
  { icon: Star, label: "آراء الطلاب", href: "/dashboard/testimonials", permission: "manage_testimonials" },
  { icon: ShoppingCart, label: "الطلبات", href: "/dashboard/orders", permission: "manage_orders" },
  { icon: Award, label: "الشهادات", href: "/dashboard/certificates", permission: "manage_certificates" },
  { icon: MessageSquare, label: "الرسائل", href: "/dashboard/messages", permission: "manage_messages" },
  { icon: Shield, label: "المشرفون", href: "/dashboard/admins", permission: "manage_admins" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userPermissions = ((session?.user as any)?.permissions || []) as string[];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <aside className={cn(
        "fixed lg:sticky top-16 lg:top-16 z-40 h-[calc(100vh-4rem)] w-64 border-l bg-[hsl(var(--card))] transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.filter((link) => !link.permission || hasPermission(userPermissions, link.permission)).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300"
                      : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <button onClick={() => signOut({ callbackUrl: "/auth/login" })} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(var(--muted-foreground))] hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              <LogOut className="h-4 w-4" />
              تسجيل خروج
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-[hsl(var(--muted))]">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-400">
            <GraduationCap className="h-5 w-5" />
            لوحة التحكم
          </Link>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
