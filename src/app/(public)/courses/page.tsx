"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Users, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatCoursePrice } from "@/lib/currency";
import { logger } from "@/lib/logger";
import type { Course } from "@/types/course";

const levelColors = {
  "مبتدئ": "teal" as const,
  "متوسط": "emerald" as const,
  "متقدم": "default" as const,
  "مبتدئ إلى متقدم": "emerald" as const,
};

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>(["الكل"]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        setAllCourses(data.courses || []);
        const cats = ["الكل", ...new Set<string>((data.courses || []).map((c: Course) => c.category))];
        setCategories(cats);
      })
      .catch(() => logger.error("Failed to load courses"));
  }, []);

  const filtered = useMemo(() => {
    let result = allCourses;
    if (category && category !== "الكل") result = result.filter((c) => c.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    return result;
  }, [search, category, allCourses]);

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-teal-50 to-white dark:from-teal-950 dark:to-background">
        <div className="container">
          <SectionHeading title="جميع الدورات" subtitle="اختر من بين مجموعتنا المتنوعة من الدورات اللغوية المصممة لتناسب جميع المستويات" />
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <Input placeholder="ابحث عن دورة..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {filtered.length === 0 ? (
            <p className="text-center text-[hsl(var(--muted-foreground))]">لا توجد دورات تطابق بحثك</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.05, duration: 0.4 }}
                >
                  <Link href={`/courses/${course.slug}`} className="group block">
                    <div className="rounded-2xl border bg-[hsl(var(--card))] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <div className="aspect-video relative bg-[hsl(var(--muted))]">
                        <Image src={course.image} alt={course.title} fill className="object-cover" />
                        <Badge variant={levelColors[course.level]} className="absolute top-3 right-3">{course.level}</Badge>
                      </div>
                      <div className="p-5 space-y-3">
                        <h3 className="font-semibold text-lg group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{course.title}</h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">{course.description}</p>
                        <div className="flex flex-wrap gap-3 pt-2 text-xs text-[hsl(var(--muted-foreground))]">
                          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />{course.rating}</span>
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.studentsCount.toLocaleString()} طالب</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
                        </div>
                        <div className="font-semibold text-teal-600 dark:text-teal-400">{formatCoursePrice(course.price)}</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
