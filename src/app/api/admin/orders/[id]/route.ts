import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateOrderAdmin } from "@/lib/firestore-admin";
import { hasSpecificPermission } from "@/lib/permissions";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission(session.user?.permissions, "manage_orders")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const { status, paid } = body;
  await updateOrderAdmin(id, { status, paid });
  logger.info("API: order updated", { id, status, paid });
  return NextResponse.json({ success: true });
}
