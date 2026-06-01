"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Star, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { courses } from "@/data/courses";
import { instructors } from "@/data/instructors";
import { testimonials } from "@/data/testimonials";

const statCards = [
  { icon: BookOpen, label: "إجمالي الدورات", value: courses.length, color: "from-teal-500 to-emerald-500", bg: "bg-teal-100 dark:bg-teal-900/50" },
  { icon: Users, label: "إجمالي المدربين", value: instructors.length, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-100 dark:bg-emerald-900/50" },
  { icon: Star, label: "آراء الطلاب", value: testimonials.length, color: "from-amber-500 to-orange-500", bg: "bg-amber-100 dark:bg-amber-900/50" },
  { icon: ShoppingCart, label: "طلبات التسجيل", value: 24, color: "from-violet-500 to-purple-500", bg: "bg-violet-100 dark:bg-violet-900/50" },
];

export default function DashboardPage() {
  const totalStudents = courses.reduce((sum, c) => sum + c.studentsCount, 0);
  const avgRating = (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-[hsl(var(--muted-foreground))]">مرحباً بك في لوحة إدارة أكاديمية نور</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border bg-[hsl(var(--card))] p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border bg-[hsl(var(--card))] p-6">
          <h3 className="font-semibold mb-4">نظرة سريعة</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-[hsl(var(--muted-foreground))]">إجمالي الطلاب</span>
              <span className="font-semibold">{totalStudents.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-[hsl(var(--muted-foreground))]">متوسط التقييم</span>
              <span className="font-semibold">{avgRating} / 5</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-[hsl(var(--muted-foreground))]">طلبات اليوم</span>
              <span className="font-semibold">5</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[hsl(var(--muted-foreground))]">الرسائل الجديدة</span>
              <span className="font-semibold">3</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border bg-[hsl(var(--card))] p-6">
          <h3 className="font-semibold mb-4">أحدث الدورات</h3>
          <div className="space-y-3">
            {courses.slice(0, 4).map((course) => (
              <div key={course.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <div className="text-sm font-medium">{course.title}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">{course.studentsCount.toLocaleString()} طالب</div>
                </div>
                <div className="text-sm font-semibold text-teal-600 dark:text-teal-400">{course.rating}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
