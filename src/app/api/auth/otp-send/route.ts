import { NextResponse } from "next/server";
import { sendOtp } from "@/lib/otp";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json();
    if (!email || !type) {
      return NextResponse.json({ error: "البريد الإلكتروني والنوع مطلوبان" }, { status: 400 });
    }
    await sendOtp(email, type);
    return NextResponse.json({ success: true, message: "تم إرسال كود التحقق" });
  } catch (err) {
    logger.error("OTP send error", err);
    return NextResponse.json({ error: "حدث خطأ في إرسال كود التحقق" }, { status: 500 });
  }
}
