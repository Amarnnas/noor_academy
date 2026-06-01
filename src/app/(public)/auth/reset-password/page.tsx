"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    logger.info("Password reset requested", { email });
    setSent(true);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16">
      <div className="container max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-[hsl(var(--card))] p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">استعادة كلمة المرور</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <Send className="h-12 w-12 mx-auto text-teal-600 dark:text-teal-400" />
              <p className="text-sm">تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.</p>
              <Link href="/auth/login"><Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" />العودة لتسجيل الدخول</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full gap-2"><Send className="h-4 w-4" />إرسال رابط الاستعادة</Button>
              <div className="text-center">
                <Link href="/auth/login" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">تذكرت كلمة المرور؟ تسجيل دخول</Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
