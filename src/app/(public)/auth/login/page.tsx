"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LogIn, GraduationCap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams?.get("role");
  const [loginMode, setLoginMode] = useState<"student" | "admin">(
    roleParam === "admin" ? "admin" : "student"
  );
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (roleParam === "admin") setLoginMode("admin");
  }, [roleParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("يرجى ملء جميع الحقول"); return; }
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        logger.warn("Login failed", { email: form.email });
      } else {
        logger.info("Login successful", { email: form.email, role: loginMode });
        if (loginMode === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/portal");
        }
      }
    } catch (err) {
      setError("حدث خطأ في تسجيل الدخول");
      logger.error("Login error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: loginMode === "admin" ? "/dashboard" : "/portal" });
    } catch (err) {
      setError("تسجيل الدخول بقوقل غير متاح حالياً");
      logger.error("Google login error", err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16">
      <div className="container max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-[hsl(var(--card))] p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLoginMode("student")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                loginMode === "student"
                  ? "bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              بوابة الطالب
            </button>
            <button
              onClick={() => setLoginMode("admin")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                loginMode === "admin"
                  ? "bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
              }`}
            >
              <Shield className="h-4 w-4" />
              لوحة المشرف
            </button>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">
              {loginMode === "student" ? "تسجيل دخول الطالب" : "تسجيل دخول المشرف"}
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              {loginMode === "student"
                ? "أهلاً بك! سجل دخولك لمتابعة دوراتك"
                : "أهلاً بعودتك! دخول المسؤولين فقط"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? "جاري تسجيل الدخول..." : <><LogIn className="h-4 w-4" />دخول</>}
            </Button>

            <Button type="button" variant="outline" className="w-full gap-2" disabled={googleLoading} onClick={handleGoogleLogin}>
              {googleLoading ? "جاري الاتصال..." : "تسجيل الدخول بقوقل"}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            {loginMode === "student" && (
              <>
                <Link href="/auth/reset-password" className="block text-sm text-teal-600 dark:text-teal-400 hover:underline">نسيت كلمة المرور؟</Link>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                  ليس لديك حساب؟{" "}
                  <Link href="/auth/register" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">إنشاء حساب</Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
