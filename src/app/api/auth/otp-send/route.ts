import { NextResponse } from "next/server";
import { sendOtp } from "@/lib/otp";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json();
    if (!email || !type) {
      return NextResponse.json({ error: "البريد الإلكتروني والنوع مطلوبان" }, { status: 400 });
    }
    const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER);
    if (!hasSmtp && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "خدمة البريد غير متاحة حالياً، يرجى المحاولة لاحقاً" }, { status: 503 });
    }
    const code = await sendOtp(email, type);
    logger.info("OTP send success", { email, type, hasSmtp });
    return NextResponse.json({ success: true, code: !hasSmtp && process.env.NODE_ENV === "development" ? code : undefined, message: "تم إرسال كود التحقق" });
  } catch (err) {
    logger.error("OTP send error", err);
    return NextResponse.json({ error: "حدث خطأ في إرسال كود التحقق" }, { status: 500 });
  }
}
