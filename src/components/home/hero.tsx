"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <div ref={ref}>{count}{suffix}</div>;
}

const stats = [
  { end: 5000, suffix: "+", label: "طلاب" },
  { end: 50, suffix: "+", label: "دورة" },
  { end: 98, suffix: "%", label: "نسبة رضا" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-teal-950 dark:via-background dark:to-emerald-950 -z-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-sm font-medium mb-6"
            >
              <Play className="h-3.5 w-3.5" />
              منصة تعليمية معتمدة
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              طوّر مهاراتك اللغوية مع{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">
                أفضل المدربين المعتمدين
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] mb-8 leading-relaxed max-w-xl">
              انضم إلى أكثر من 5000 متعلم حول العالم. دورات تفاعلية، مدربون معتمدون، وشهادات معترف بها. رحلتك نحو إتقان اللغات تبدأ هنا.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/courses">
                <Button size="lg" className="gap-2">
                  ابدأ التعلم الآن
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  تصفح الدورات
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-teal-600 dark:text-teal-400">
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[hsl(var(--muted))] shadow-2xl shadow-teal-200/50 dark:shadow-teal-900/30">
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <Image src="/images/h.jpeg" alt="أكاديمية نور" fill className="object-contain p-12 opacity-20" />
                <div className="relative text-center">
                  <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-300 mb-2">تعلم أي لغة</h3>
                  <p className="text-[hsl(var(--muted-foreground))]">مع مدربين معتمدين من جميع أنحاء العالم</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
