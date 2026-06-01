"use client";

import { motion } from "framer-motion";
import { BookOpen, Eye, Target, Heart } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { SITE } from "@/lib/constants";

const values = [
  { icon: BookOpen, title: "الرؤية", description: "أن نكون المنصة الرائدة في تعليم اللغات في العالم العربي، ونصنع فارقاً حقيقياً في حياة متعلمينا." },
  { icon: Target, title: "الرسالة", description: "تمكين المتعلمين من إتقان اللغات من خلال مناهج مبتكرة ومدربين معتمدين، في بيئة تعليمية تفاعلية." },
  { icon: Eye, title: "الهدف", description: "تخريج أجيال تتقن لغات متعددة، قادرة على التواصل والمنافسة في سوق العمل العالمي." },
  { icon: Heart, title: "قيمنا", description: "الجودة، الالتزام، الابتكار، الاحترام، والتميز في كل ما نقدمه." },
];

export default function AboutPage() {
  return (
    <>
      <section className="py-16 bg-gradient-to-b from-teal-50 to-white dark:from-teal-950 dark:to-background">
        <div className="container">
          <SectionHeading title="من نحن" subtitle="تعرف على أكاديمية نور للغات" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-lg leading-relaxed text-[hsl(var(--muted-foreground))] mb-6">
              {SITE.name} هي منصة تعليمية رائدة متخصصة في تعليم اللغات عبر الإنترنت. تأسست بهدف توفير تعليم لغوي عالي الجودة
              للجميع، بغض النظر عن موقعهم أو جدولهم الزمني.
            </p>
            <p className="text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
              نؤمن في {SITE.name} بأن تعلم لغة جديدة هو مفتاح لفرص لا حصر لها. ولهذا نعمل جاهدين لتقديم أفضل تجربة تعليمية
              ممكنة، مع نخبة من المدربين المعتمدين ومناهج مطورة وفق أحدث المعايير العالمية.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl border bg-[hsl(var(--card))] hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
