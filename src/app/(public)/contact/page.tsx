"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/shared/section-heading";
import { SITE } from "@/lib/constants";
import { logger } from "@/lib/logger";

const contactInfo = [
  { icon: Phone, label: "الهاتف", value: SITE.phone },
  { icon: Mail, label: "البريد الإلكتروني", value: SITE.email },
  { icon: MapPin, label: "العنوان", value: SITE.address },
  { icon: MessageCircle, label: "واتساب", value: SITE.whatsapp },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    logger.info("Contact form submitted", form);
    setSubmitted(true);
  };

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-teal-50 to-white dark:from-teal-950 dark:to-background">
        <div className="container">
          <SectionHeading title="تواصل معنا" subtitle="نحن هنا للإجابة عن استفساراتك، لا تتردد في التواصل معنا" />
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              {submitted ? (
                <div className="rounded-2xl border bg-teal-50 dark:bg-teal-950 p-8 text-center">
                  <Send className="h-12 w-12 mx-auto mb-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-xl font-semibold mb-2">شكراً لتواصلك معنا!</h3>
                  <p className="text-[hsl(var(--muted-foreground))]">سنقوم بالرد على استفسارك في أقرب وقت ممكن.</p>
                  <Button variant="outline" className="mt-4" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}>
                    إرسال رسالة أخرى
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل</Label>
                      <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الجوال (اختياري)</Label>
                    <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">الرسالة</Label>
                    <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <Button type="submit" className="w-full gap-2"><Send className="h-4 w-4" />إرسال الرسالة</Button>
                </form>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl border bg-[hsl(var(--card))]">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">{item.label}</div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl overflow-hidden border h-[250px]">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(SITE.address)}&language=ar`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="موقع أكاديمية نور"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
