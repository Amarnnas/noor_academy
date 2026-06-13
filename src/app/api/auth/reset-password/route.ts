import { NextResponse } from "next/server";
import { getStudentByEmail, updateStudentPassword } from "@/lib/firestore-admin";
import { validateOtp, consumeOtp } from "@/lib/otp";
import { hashPassword } from "@/lib/password";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const { email, code, password } = await req.json();
    if (!email || !code || !password) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
    }
    const student = await getStudentByEmail(email);
    if (!student) {
      return NextResponse.json({ error: "البريد الإلكتروني غير مسجل" }, { status: 404 });
    }
    const valid = await validateOtp(email, code, "reset");
    if (!valid) {
      return NextResponse.json({ error: "كود التحقق غير صحيح أو منتهي الصلاحية" }, { status: 400 });
    }
    const hashed = await hashPassword(password);
    await updateStudentPassword(email, hashed);
    await consumeOtp(email, code, "reset");
    logger.info("Password reset completed", { email });
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Reset password error", err);
    return NextResponse.json({ error: "حدث خطأ في إعادة تعيين كلمة المرور" }, { status: 500 });
  }
}
