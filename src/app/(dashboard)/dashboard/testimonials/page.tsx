"use client";

import { useState } from "react";
import { Star, EyeOff, Trash2, Eye } from "lucide-react";
import { testimonials as initialTestimonials } from "@/data/testimonials";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logger } from "@/lib/logger";

export default function DashboardTestimonialsPage() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  const toggleHide = (id: string) => {
    setTestimonials(testimonials.map((t) => t.id === id ? { ...t, hidden: !t.hidden } : t));
    const t = testimonials.find((x) => x.id === id);
    logger.info(t?.hidden ? "Testimonial unhidden" : "Testimonial hidden", { id });
  };

  const handleDelete = (id: string, name: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
    logger.info("Testimonial deleted", { id, name });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">آراء الطلاب</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className={`rounded-2xl border bg-[hsl(var(--card))] p-5 ${t.hidden ? "opacity-50" : ""}`}>
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs">{t.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{t.name}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{t.role}</div>
              </div>
              <div className="mr-auto flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "text-amber-500 fill-amber-500" : "text-[hsl(var(--muted))]"}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">&ldquo;{t.content}&rdquo;</p>
            <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t">
              <button onClick={() => toggleHide(t.id)} className={`p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] ${t.hidden ? "text-teal-600" : "hover:text-amber-600"}`} aria-label={t.hidden ? "إظهار" : "إخفاء"}>
                {t.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => handleDelete(t.id, t.name)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-[hsl(var(--muted-foreground))] hover:text-red-600" aria-label="حذف"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
