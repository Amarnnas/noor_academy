import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const { email, code, type } = await req.json();
    if (!email || !code || !type) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    const valid = await verifyOtp(email, code, type);
    if (!valid) {
      return NextResponse.json({ error: "كود التحقق غير صحيح أو منتهي الصلاحية" }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "تم التحقق بنجاح" });
  } catch (err) {
    logger.error("OTP verify error", err);
    return NextResponse.json({ error: "حدث خطأ في التحقق" }, { status: 500 });
  }
}
