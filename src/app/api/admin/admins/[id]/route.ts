import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllAdmins, updateAdmin, deleteAdmin } from "@/lib/firestore-admin";
import { hasSpecificPermission } from "@/lib/permissions";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission(session.user?.permissions, "manage_admins")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, password, permissions } = body;
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      if (password.length < 6) return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
      updateData.password = password;
    }
    if (permissions) updateData.permissions = permissions;
    await updateAdmin(id, updateData);
    logger.info("API: admin updated", { id });
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("API: update admin failed", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission(session.user?.permissions, "manage_admins")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  try {
    const { id } = await params;
    const admins = await getAllAdmins();
    const target = admins.find((a) => a.id === id);
    if (!target) return NextResponse.json({ error: "المشرف غير موجود" }, { status: 404 });
    if (target.email === session.user?.email) {
      return NextResponse.json({ error: "لا يمكنك حذف نفسك" }, { status: 400 });
    }
    const remaining = admins.filter((a) => a.id !== id);
    const hasSupervisor = remaining.some((a) => a.permissions?.includes("manage_admins"));
    if (!hasSupervisor) {
      return NextResponse.json({ error: "لا يمكن حذف آخر مشرف يملك صلاحية إدارة المشرفين" }, { status: 400 });
    }
    await deleteAdmin(id);
    logger.info("API: admin deleted", { id, email: target.email });
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("API: delete admin failed", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
