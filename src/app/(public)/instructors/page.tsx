"use client";

import { motion } from "framer-motion";
import { Star, Users, BookOpen } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { instructors } from "@/data/instructors";

export default function InstructorsPage() {
  return (
    <>
      <section className="py-16 bg-gradient-to-b from-teal-50 to-white dark:from-teal-950 dark:to-background">
        <div className="container">
          <SectionHeading
            title="المدربون"
            subtitle="نخبة من أفضل المدربين المعتمدين من جميع أنحاء العالم"
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((instructor, i) => (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border bg-[hsl(var(--card))] p-6 hover:shadow-lg transition-all duration-300 text-center"
              >
                <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-teal-200 dark:border-teal-800">
                  <AvatarImage src={instructor.image} alt={instructor.name} />
                  <AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xl">
                    {instructor.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{instructor.name}</h3>
                <p className="text-sm text-teal-600 dark:text-teal-400 mb-3">{instructor.title}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">{instructor.bio}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {instructor.specialties.map((s) => (
                    <Badge key={s} variant="teal" className="text-xs">{s}</Badge>
                  ))}
                </div>
                <div className="flex justify-center gap-4 text-xs text-[hsl(var(--muted-foreground))] pt-3 border-t">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />{instructor.rating}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{instructor.studentsCount.toLocaleString()} طالب</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{instructor.experience}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
