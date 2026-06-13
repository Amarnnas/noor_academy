import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { markMessageReadAdmin, deleteMessageAdmin } from "@/lib/firestore-admin";
import { hasSpecificPermission } from "@/lib/permissions";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission((session.user as any)?.permissions, "manage_messages")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const { id } = await params;
  await markMessageReadAdmin(id);
  logger.info("API: message marked read", { id });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission((session.user as any)?.permissions, "manage_messages")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const { id } = await params;
  await deleteMessageAdmin(id);
  logger.info("API: message deleted", { id });
  return NextResponse.json({ success: true });
}
