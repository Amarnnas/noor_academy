import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";
import { logger } from "@/lib/logger";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map<string, { count: number; firstAttempt: number }>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const entry = attempts.get(email);
  if (!entry) { attempts.set(email, { count: 1, firstAttempt: now }); return true; }
  if (now - entry.firstAttempt > WINDOW_MS) { attempts.set(email, { count: 1, firstAttempt: now }); return true; }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const { email, code, type } = await req.json();
    if (!email || !code || !type) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    if (!checkRateLimit(email)) {
      logger.warn("OTP rate limit exceeded", { email });
      return NextResponse.json({ error: "لقد تجاوزت عدد المحاولات المسموح. يرجى المحاولة بعد 10 دقائق" }, { status: 429 });
    }
    const valid = await verifyOtp(email, code, type);
    if (!valid) {
      return NextResponse.json({ error: "كود التحقق غير صحيح أو منتهي الصلاحية" }, { status: 400 });
    }
    attempts.delete(email);
    return NextResponse.json({ success: true, message: "تم التحقق بنجاح" });
  } catch (err) {
    logger.error("OTP verify error", err);
    return NextResponse.json({ error: "حدث خطأ في التحقق" }, { status: 500 });
  }
}
