import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";
import { getOtpAttempts, incrementOtpAttempt, clearOtpAttempts } from "@/lib/firestore-admin";
import { adminAuthIsConfigured } from "@/lib/firebase-admin";
import { logger } from "@/lib/logger";

const MAX_ATTEMPTS = 5;

export async function POST(req: Request) {
  try {
    const { email, code, type } = await req.json();
    if (!email || !code || !type) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    if (adminAuthIsConfigured()) {
      const attempts = await getOtpAttempts(email);
      if (attempts >= MAX_ATTEMPTS) {
        logger.warn("OTP rate limit exceeded (persistent)", { email });
        return NextResponse.json({ error: "لقد تجاوزت عدد المحاولات المسموح. يرجى المحاولة بعد 10 دقائق" }, { status: 429 });
      }
      await incrementOtpAttempt(email);
    }
    const valid = await verifyOtp(email, code, type);
    if (!valid) {
      return NextResponse.json({ error: "كود التحقق غير صحيح أو منتهي الصلاحية" }, { status: 400 });
    }
    if (adminAuthIsConfigured()) {
      await clearOtpAttempts(email);
    }
    return NextResponse.json({ success: true, message: "تم التحقق بنجاح" });
  } catch (err) {
    logger.error("OTP verify error", err);
    return NextResponse.json({ error: "حدث خطأ في التحقق" }, { status: 500 });
  }
}
