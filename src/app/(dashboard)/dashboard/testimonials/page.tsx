"use client";

import { useState, useEffect } from "react";
import { Star, EyeOff, Trash2, Eye } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logger } from "@/lib/logger";

interface TestimonialData {
  id: string;
  name: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
  hidden?: boolean;
}

export default function DashboardTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then((data) => setTestimonials(data))
      .catch(() => logger.error("Failed to load testimonials"))
      .finally(() => setLoading(false));
  }, []);

  const toggleHide = async (id: string) => {
    const t = testimonials.find((x) => x.id === id);
    if (!t) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !t.hidden }),
      });
      if (!res.ok) return;
      setTestimonials(testimonials.map((x) => x.id === id ? { ...x, hidden: !x.hidden } : x));
      logger.info(t.hidden ? "Testimonial unhidden" : "Testimonial hidden", { id });
    } catch {
      logger.error("Failed to toggle testimonial");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setTestimonials(testimonials.filter((t) => t.id !== id));
      logger.info("Testimonial deleted", { id, name });
    } catch {
      logger.error("Failed to delete testimonial");
    }
  };

  if (loading) return <div className="p-8 text-center text-[hsl(var(--muted-foreground))]">جاري التحميل...</div>;

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
