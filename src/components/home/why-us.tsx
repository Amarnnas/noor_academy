"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, Clock, HeadphonesIcon, Users, BookOpen } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const features = [
  { icon: GraduationCap, title: "مدربون معتمدون", description: "نخبة من المدربين الحاصلين على أعلى الشهادات الدولية في تعليم اللغات" },
  { icon: Award, title: "شهادات معترف بها", description: "شهادات إتمام معتمدة ومعترف بها دولياً بعد إكمال كل دورة" },
  { icon: Clock, title: "تعلم مرن", description: "دورات مسجلة ومباشرة تناسب جدولك الزمني، تعلم في أي وقت ومن أي مكان" },
  { icon: HeadphonesIcon, title: "دعم مستمر", description: "فريق دعم متواجد 24/7 للإجابة على استفساراتك ومساعدتك في رحلتك التعليمية" },
  { icon: Users, title: "فصول تفاعلية", description: "فصول دراسية افتراضية تفاعلية مع أنشطة جماعية ومناقشات حية" },
  { icon: BookOpen, title: "مناهج حديثة", description: "مناهج تعليمية مطورة بأحدث الأساليب التربوية والتقنيات التفاعلية" },
];

export function WhyUs() {
  return (
    <section className="py-20">
      <div className="container">
        <SectionHeading
          title="لماذا أكاديمية نور؟"
          subtitle="نقدم تجربة تعليمية متكاملة تجمع بين الجودة والمرونة والدعم المستمر"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group p-6 rounded-2xl border bg-[hsl(var(--card))] hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-800 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
