"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Send, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";

type Step = "email" | "otp" | "newPassword" | "done";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("يرجى إدخال البريد الإلكتروني"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp-send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, type: "reset" }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "حدث خطأ"); setLoading(false); return; }
      setOtpCode(data.code || "");
      logger.info("OTP sent for password reset", { email });
      setStep("otp");
    } catch {
      setError("حدث خطأ في إرسال كود التحقق");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) { setError("يرجى إدخال كود التحقق"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp-verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code, type: "reset" }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "كود غير صحيح"); setLoading(false); return; }
      logger.info("Password reset OTP verified", { email });
      setStep("newPassword");
    } catch {
      setError("حدث خطأ في التحقق");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError("يرجى إدخال كلمة المرور الجديدة"); return; }
    if (password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    if (password !== confirmPassword) { setError("كلمة المرور غير متطابقة"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "حدث خطأ"); setLoading(false); return; }
      logger.info("Password reset completed", { email });
      setStep("done");
    } catch {
      setError("حدث خطأ في إعادة تعيين كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16">
      <div className="container max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-[hsl(var(--card))] p-8">
          {step === "done" ? (
            <div className="text-center space-y-4">
              <Check className="h-12 w-12 mx-auto text-teal-600 dark:text-teal-400" />
              <h2 className="text-lg font-bold">تم إعادة تعيين كلمة المرور</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.</p>
              <Link href="/auth/login"><Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" />تسجيل الدخول</Button></Link>
            </div>
          ) : step === "newPassword" ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">كلمة مرور جديدة</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">أدخل كلمة المرور الجديدة</p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور الجديدة</Label>
                  <Input id="password" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 أحرف على الأقل" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                  <Input id="confirmPassword" type="password" dir="ltr" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="أعد إدخال كلمة المرور" required />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? "جاري الحفظ..." : <><Lock className="h-4 w-4" />حفظ كلمة المرور الجديدة</>}
                </Button>
              </form>
            </>
          ) : step === "otp" ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">تأكيد الهوية</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  تم إرسال كود التحقق إلى <span className="font-medium text-teal-600 dark:text-teal-400">{email}</span>
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
                  <Label htmlFor="resetOtp">كود التحقق</Label>
                  <Input id="resetOtp" dir="ltr" value={code} onChange={(e) => setCode(e.target.value)} placeholder="أدخل الكود المكون من 6 أرقام" className="text-center text-2xl tracking-widest" maxLength={6} required />
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
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">استعادة كلمة المرور</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">أدخل بريدك الإلكتروني وسنرسل لك كود التحقق</p>
              </div>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? "جاري الإرسال..." : <><Send className="h-4 w-4" />إرسال كود التحقق</>}
                </Button>
              </form>
            </>
          )}
          {step !== "done" && (
            <div className="mt-4 text-center">
              <Link href="/auth/login" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">تذكرت كلمة المرور؟ تسجيل دخول</Link>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
