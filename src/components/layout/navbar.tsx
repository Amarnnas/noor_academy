"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { BRAND_ASSETS, NAV_LINKS, SITE } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    logger.info("Navbar symbol logo loaded", { src: BRAND_ASSETS.symbol });
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[hsl(var(--background))/0.95] backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))/0.6]">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src={BRAND_ASSETS.symbol} alt={SITE.name} width={48} height={48} className="h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950",
                pathname === link.href ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950" : "text-[hsl(var(--muted-foreground))]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}

          {session ? (
            <Link href="/dashboard" className="hidden md:block">
              <Button variant="ghost" size="sm">{session.user?.name || "لوحة التحكم"}</Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="hidden md:block">
                <Button variant="ghost" size="sm">تسجيل الدخول</Button>
              </Link>
              <Link href="/auth/register" className="hidden md:block">
                <Button size="sm">حساب جديد</Button>
              </Link>
            </>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors" aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t overflow-hidden"
          >
            <nav className="container py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950"
                      : "text-[hsl(var(--muted-foreground))] hover:text-teal-600 dark:hover:text-teal-400"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2 px-3">
                {session ? (
                  <Link href="/dashboard" className="flex-1"><Button size="sm" className="w-full">لوحة التحكم</Button></Link>
                ) : (
                  <>
                    <Link href="/auth/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">تسجيل الدخول</Button></Link>
                    <Link href="/auth/register" className="flex-1"><Button size="sm" className="w-full">حساب جديد</Button></Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
