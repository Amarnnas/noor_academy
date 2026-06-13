"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Clock, Award, User, ChevronLeft, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { courses } from "@/data/courses";
import { Button } from "@/components/ui/button";

export default function StudentPortalPage() {
  const { data: session } = useSession();

  const enrolledCourses = courses.filter((_, i) => i < 3);

  return (
    <section className="min-h-[calc(100vh-4rem)] py-10">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">بوابة الطالب</h1>
              <p className="text-[hsl(var(--muted-foreground))]">مرحباً {session?.user?.name || "طالب"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/portal/profile">
                <Button variant="ghost" size="icon" className="rounded-full" title="الملف الشخصي">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" className="gap-2"><BookOpen className="h-4 w-4" />تصفح الدورات</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-[hsl(var(--card))] p-5 space-y-2">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                <BookOpen className="h-5 w-5" />
                <span className="font-semibold">الدورات المسجلة</span>
              </div>
              <p className="text-2xl font-bold">{enrolledCourses.length}</p>
            </div>
            <div className="rounded-xl border bg-[hsl(var(--card))] p-5 space-y-2">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">ساعات التعلم</span>
              </div>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="rounded-xl border bg-[hsl(var(--card))] p-5 space-y-2">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                <Award className="h-5 w-5" />
                <span className="font-semibold">الشهادات</span>
              </div>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">دوراتي</h2>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-dashed">
                <User className="h-12 w-12 mx-auto text-[hsl(var(--muted-foreground))] mb-3" />
                <p className="text-[hsl(var(--muted-foreground))]">لم تسجل في أي دورة بعد</p>
                <Link href="/courses">
                  <Button className="mt-4 gap-2"><BookOpen className="h-4 w-4" />استعرض الدورات</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <Link key={course.id} href={`/courses/${course.slug}`} className="group block">
                    <div className="rounded-xl border bg-[hsl(var(--card))] overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video relative bg-[hsl(var(--muted))] flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-[hsl(var(--muted-foreground))]/40" />
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{course.title}</h3>
                        <div className="flex items-center justify-between text-sm text-[hsl(var(--muted-foreground))]">
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
                          <span className="flex items-center gap-1"><ChevronLeft className="h-3.5 w-3.5" /></span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
