"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { getFeaturedCourses } from "@/data/courses";
import { formatCoursePrice } from "@/lib/currency";
import { logger } from "@/lib/logger";

const levelColors = {
  "مبتدئ": "teal" as const,
  "متوسط": "emerald" as const,
  "متقدم": "default" as const,
  "مبتدئ إلى متقدم": "emerald" as const,
};

export function CoursesPreview() {
  const featured = getFeaturedCourses();
  useEffect(() => {
    logger.info("Featured courses preview uses full-cover images and SDG prices", { count: featured.length });
  }, [featured.length]);

  return (
    <section className="py-20 bg-[hsl(var(--muted))]/30">
      <div className="container">
        <SectionHeading
          title="دوراتنا المميزة"
          subtitle="اختر من بين باقة متنوعة من الدورات اللغوية المصممة بعناية لتناسب جميع المستويات"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={`/courses/${course.slug}`} className="group block">
                <div className="rounded-2xl border bg-[hsl(var(--card))] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-video relative bg-[hsl(var(--muted))]">
                    <Image src={course.image} alt={course.title} fill className="object-cover" />
                    <Badge variant={levelColors[course.level]} className="absolute top-3 right-3">
                      {course.level}
                    </Badge>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-semibold text-lg group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{course.title}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">{course.description}</p>
                    <div className="flex flex-wrap gap-3 pt-2 text-xs text-[hsl(var(--muted-foreground))]">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        {course.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course.studentsCount.toLocaleString()} طالب
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration}
                      </span>
                    </div>
                    <div className="font-semibold text-teal-600 dark:text-teal-400">{formatCoursePrice(course.price)}</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/courses">
            <Button variant="outline" size="lg" className="gap-2">
              عرض جميع الدورات
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
