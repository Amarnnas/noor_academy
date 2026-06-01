"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("يرجى ملء جميع الحقول"); return; }
    if (form.password !== form.confirmPassword) { setError("كلمة المرور غير متطابقة"); return; }
    if (form.password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    setLoading(true);
    setError("");

    try {
      logger.info("Registration", { email: form.email, name: form.name });
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) {
        setError("حدث خطأ في إنشاء الحساب");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("حدث خطأ في التسجيل");
      logger.error("Registration error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16">
      <div className="container max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-[hsl(var(--card))] p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">انضم إلى آلاف المتعلمين وابدأ رحلتك التعليمية</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الجوال (واتساب)</Label>
              <Input id="phone" type="tel" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+9665XXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input id="confirmPassword" type="password" dir="ltr" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? "جاري إنشاء الحساب..." : <><UserPlus className="h-4 w-4" />إنشاء حساب</>}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-[hsl(var(--muted-foreground))]">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">تسجيل دخول</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
