import { NextResponse } from "next/server";
import { getStudentByEmail, createStudent } from "@/lib/firestore-admin";
import { adminAuthIsConfigured } from "@/lib/firebase-admin";
import { logger } from "@/lib/logger";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();
    if (!email || !name || !password) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "صيغة البريد الإلكتروني غير صحيحة" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
    }
    if (!adminAuthIsConfigured()) {
      return NextResponse.json({ error: "خدمة إنشاء الحسابات غير متاحة حالياً" }, { status: 503 });
    }
    const existing = await getStudentByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 });
    }
    const id = await createStudent({ name, email, password });
    logger.info("User registered via Admin SDK", { id, email, name });
    return NextResponse.json({ success: true, message: "تم إنشاء الحساب بنجاح" });
  } catch (err) {
    logger.error("Register error", err);
    return NextResponse.json({ error: "حدث خطأ في إنشاء الحساب" }, { status: 500 });
  }
}
