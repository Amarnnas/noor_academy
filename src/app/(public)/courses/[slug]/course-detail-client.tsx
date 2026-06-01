"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Users, Clock, BarChart3, Check, ArrowLeft, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type Course } from "@/types/course";
import { getInstructorById } from "@/data/instructors";
import { logger } from "@/lib/logger";

const levelColors: Record<string, "teal" | "emerald" | "default"> = {
  "مبتدئ": "teal",
  "متوسط": "emerald",
  "متقدم": "default",
  "مبتدئ إلى متقدم": "emerald",
};

export function CourseDetailClient({ course }: { course: Course }) {
  const instructor = getInstructorById(course.instructorId);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    logger.info("Enrollment submitted", { course: course.slug, ...form });
    setSubmitted(true);
  };

  return (
    <>
      <section className="py-8 bg-[hsl(var(--muted))]/30">
        <div className="container">
          <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <ArrowLeft className="h-4 w-4" /> العودة إلى الدورات
          </Link>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="aspect-video rounded-2xl relative bg-[hsl(var(--muted))] mb-6 overflow-hidden">
                  <Image src={course.image} alt={course.title} fill className="object-contain p-8" />
                </div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant={levelColors[course.level]}>{course.level}</Badge>
                  <span className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]"><Star className="h-4 w-4 text-amber-500 fill-amber-500" /> {course.rating} ({course.reviewsCount} تقييم)</span>
                  <span className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]"><Users className="h-4 w-4" /> {course.studentsCount.toLocaleString()} طالب</span>
                  <span className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]"><Clock className="h-4 w-4" /> {course.duration}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">{course.fullDescription}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-xl font-semibold mb-4">أهداف الدورة</h2>
                <ul className="space-y-2">
                  {course.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />{obj}</li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-xl font-semibold mb-4">المنهج الدراسي</h2>
                <div className="space-y-3">
                  {course.curriculum.map((section, i) => (
                    <details key={i} className="group rounded-xl border">
                      <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-sm hover:bg-[hsl(var(--muted))]/50 rounded-xl transition-colors">
                        {section.title}
                        <BarChart3 className="h-4 w-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-4 pb-4 space-y-1.5">
                        {section.topics.map((topic, j) => (
                          <div key={j} className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] pr-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            {topic}
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </motion.div>

              {instructor && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border p-6">
                  <h2 className="text-xl font-semibold mb-4">المدرب</h2>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-teal-200 dark:border-teal-800">
                      <AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">{instructor.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{instructor.name}</h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">{instructor.title}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{instructor.bio}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="sticky top-24 rounded-2xl border bg-[hsl(var(--card))] p-6 space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">{course.price} ريال</div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">الدفع مرة واحدة</p>
                </div>

                {submitted ? (
                  <div className="text-center p-4 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800">
                    <p className="font-semibold text-teal-700 dark:text-teal-300">تم استلام طلب التسجيل!</p>
                    <p className="text-sm text-teal-600/80 dark:text-teal-400/80 mt-1">سن تواصل معك قريباً</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-semibold">التسجيل في الدورة</h3>
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل</Label>
                      <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الجوال</Label>
                      <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                    </div>
                    <Button type="submit" className="w-full gap-2"><Send className="h-4 w-4" />تسجيل الآن</Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
