"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserPlus, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("يرجى ملء جميع الحقول"); return; }
    if (form.password !== form.confirmPassword) { setError("كلمة المرور غير متطابقة"); return; }
    if (form.password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp-send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email, type: "register" }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "حدث خطأ"); setLoading(false); return; }
      setOtpCode(data.code || "");
      setStep("otp");
      logger.info("OTP sent for registration", { email: form.email });
    } catch (err) {
      setError("حدث خطأ في إرسال كود التحقق");
      logger.error("OTP send error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) { setError("يرجى إدخال كود التحقق"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp-verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email, code: otp, type: "register" }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "كود غير صحيح"); setLoading(false); return; }
      const regRes = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email, name: form.name, password: form.password }) });
      const regData = await regRes.json();
      if (!regRes.ok) { setError(regData.error || "حدث خطأ في إنشاء الحساب"); setLoading(false); return; }
      logger.info("Registration", { email: form.email, name: form.name });
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) {
        setError("حدث خطأ في تسجيل الدخول بعد إنشاء الحساب");
      } else {
        router.push("/portal");
      }
    } catch (err) {
      setError("حدث خطأ في التحقق");
      logger.error("OTP verify error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16">
      <div className="container max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-[hsl(var(--card))] p-8">
          {step === "form" ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">انضم إلى آلاف المتعلمين وابدأ رحلتك التعليمية</p>
              </div>
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                  {loading ? "جاري الإرسال..." : <><Send className="h-4 w-4" />إرسال كود التحقق</>}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">تأكيد البريد الإلكتروني</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  تم إرسال كود التحقق إلى <span className="font-medium text-teal-600 dark:text-teal-400">{form.email}</span>
                </p>
                {otpCode && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-center">
                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">كود التحقق (للاختبار)</p>
                    <p className="text-2xl font-bold tracking-widest text-amber-700 dark:text-amber-300">{otpCode}</p>
                  </div>
                )}
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">كود التحقق</Label>
                  <Input id="otp" dir="ltr" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="أدخل الكود المكون من 6 أرقام" className="text-center text-2xl tracking-widest" maxLength={6} required />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? "جاري التحقق..." : <><Check className="h-4 w-4" />تأكيد</>}
                </Button>
                <div className="text-center">
                  <button type="button" onClick={handleSendOtp} className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
                    إعادة إرسال الكود
                  </button>
                </div>
              </form>
            </>
          )}
          <div className="mt-4 text-center text-sm text-[hsl(var(--muted-foreground))]">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">تسجيل دخول</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
