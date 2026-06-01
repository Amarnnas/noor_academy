import { NextResponse } from "next/server";
import { sendOtp } from "@/lib/otp";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json();
    if (!email || !type) {
      return NextResponse.json({ error: "البريد الإلكتروني والنوع مطلوبان" }, { status: 400 });
    }
    const code = await sendOtp(email, type);
    const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER);
    logger.info("OTP send success", { email, type, hasSmtp });
    return NextResponse.json({ success: true, code: hasSmtp ? undefined : code, message: "تم إرسال كود التحقق" });
  } catch (err) {
    logger.error("OTP send error", err);
    return NextResponse.json({ error: "حدث خطأ في إرسال كود التحقق" }, { status: 500 });
  }
}
