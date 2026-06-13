import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllAdmins, createAdmin } from "@/lib/firestore-admin";
import { hasSpecificPermission } from "@/lib/permissions";
import { logger } from "@/lib/logger";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission((session.user as any)?.permissions, "manage_admins")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const admins = await getAllAdmins();
  return NextResponse.json({ admins });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission((session.user as any)?.permissions, "manage_admins")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { name, email, password, permissions } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ error: "الاسم والبريد الإلكتروني وكلمة المرور مطلوبة" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "صيغة البريد الإلكتروني غير صحيحة" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
    }
    const existing = await getAllAdmins();
    const emailExists = existing.some((a) => a.email === email);
    if (emailExists) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 });
    }
    const id = await createAdmin({ name, email, password, permissions: permissions || [] });
    logger.info("API: admin created", { id, email });
    return NextResponse.json({ success: true, id });
  } catch (err) {
    logger.error("API: create admin failed", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
