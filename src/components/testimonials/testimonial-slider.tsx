"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote, Send } from "lucide-react";
import { testimonials as initialTestimonials } from "@/data/testimonials";
import { SectionHeading } from "@/components/shared/section-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { logger } from "@/lib/logger";
import { type Testimonial } from "@/types/testimonial";

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const { data: session } = useSession();
  const [reviewForm, setReviewForm] = useState({ content: "", rating: 5, phone: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const t = testimonials.filter((x) => !x.hidden);

  const next = () => setCurrent((c) => (c + 1) % t.length);
  const prev = () => setCurrent((c) => (c - 1 + t.length) % t.length);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.content || !reviewForm.phone) return;
    const newReview: Testimonial = {
      id: `review-${Date.now()}`,
      name: session?.user?.name || "طالب",
      avatar: "/images/logo.png",
      role: "طالب",
      content: reviewForm.content,
      rating: reviewForm.rating,
    };
    setTestimonials([...testimonials, newReview]);
    logger.info("Review submitted", { name: newReview.name, rating: reviewForm.rating, phone: reviewForm.phone });
    setReviewSubmitted(true);
  };

  return (
    <section className="py-20">
      <div className="container">
        <SectionHeading
          title="ماذا يقول طلابنا؟"
          subtitle="نفخر بما يحققه طلابنا من نتائج مبهرة، وهذه بعض آرائهم"
        />
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border bg-[hsl(var(--card))] p-8 md:p-10 text-center"
            >
              <Quote className="h-8 w-8 mx-auto mb-4 text-teal-400/50" />
              <p className="text-lg leading-relaxed mb-6">&ldquo;{t[current].content}&rdquo;</p>
              <div className="flex justify-center gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t[current].rating ? "text-amber-500 fill-amber-500" : "text-[hsl(var(--muted))]"}`} />
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-teal-200 dark:border-teal-800">
                  <AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-sm">
                    {t[current].name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <div className="font-semibold">{t[current].name}</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">{t[current].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-6">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={prev} className="p-2 rounded-full border hover:bg-[hsl(var(--accent))] transition-colors" aria-label="السابق">
              <ChevronRight className="h-5 w-5" />
            </motion.button>
            <div className="flex items-center gap-2">
              {t.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-teal-600 w-6" : "bg-[hsl(var(--muted))]"}`} aria-label={`الانتقال إلى الشهادة ${i + 1}`} />
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={next} className="p-2 rounded-full border hover:bg-[hsl(var(--accent))] transition-colors" aria-label="التالي">
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {session ? (
          reviewSubmitted ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto mt-10 p-6 rounded-2xl border bg-teal-50 dark:bg-teal-950 text-center">
              <p className="font-semibold text-teal-700 dark:text-teal-300">شكراً لك! تم إضافة تعليقك</p>
              <p className="text-sm text-teal-600/80 mt-1">سيتم مراجعة تعليقك من قبل الإدارة</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto mt-10 rounded-2xl border bg-[hsl(var(--card))] p-6">
              <h3 className="font-semibold mb-4">أضف تعليقك</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: i + 1 })} className="p-0.5">
                      <Star className={`h-6 w-6 ${i < reviewForm.rating ? "text-amber-500 fill-amber-500" : "text-[hsl(var(--muted))]"}`} />
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewContent">تعليقك</Label>
                  <Textarea id="reviewContent" value={reviewForm.content} onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })} placeholder="اكتب تجربتك مع الأكاديمية..." rows={3} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewPhone">رقم واتساب (للتواصل)</Label>
                  <Input id="reviewPhone" type="tel" value={reviewForm.phone} onChange={(e) => setReviewForm({ ...reviewForm, phone: e.target.value })} placeholder="+9665XXXXXXXX" required />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={!reviewForm.content || !reviewForm.phone}><Send className="h-4 w-4" />إرسال التعليق</Button>
              </form>
            </motion.div>
          )
        ) : (
          <div className="max-w-lg mx-auto mt-10 text-center p-6 rounded-2xl border bg-[hsl(var(--card))]">
            <p className="text-[hsl(var(--muted-foreground))]">يرجى <a href="/auth/login" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">تسجيل الدخول</a> لإضافة تعليق</p>
          </div>
        )}
      </div>
    </section>
  );
}
