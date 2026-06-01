"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-600 dark:from-teal-800 dark:to-emerald-800 p-10 md:p-16 text-center text-white"
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ابدأ رحلتك التعليمية اليوم</h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              انضم إلى آلاف المتعلمين وابدأ في تطوير مهاراتك اللغوية مع أفضل المدربين المعتمدين
            </p>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="gap-2 bg-white text-teal-700 hover:bg-white/90 shadow-lg">
                سجل الآن مجاناً
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
