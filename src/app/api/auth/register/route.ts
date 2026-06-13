import { NextResponse } from "next/server";
import { registerUser } from "@/lib/user-store";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();
    if (!email || !name || !password) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    registerUser(email, name, password);
    logger.info("User registered", { email, name });
    return NextResponse.json({ success: true, message: "تم إنشاء الحساب بنجاح" });
  } catch (err) {
    logger.error("Register error", err);
    return NextResponse.json({ error: "حدث خطأ في إنشاء الحساب" }, { status: 500 });
  }
}
