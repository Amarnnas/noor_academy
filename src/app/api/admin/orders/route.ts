import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllOrdersAdmin } from "@/lib/firestore-admin";
import { hasSpecificPermission } from "@/lib/permissions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission(session.user?.permissions, "manage_orders")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const orders = await getAllOrdersAdmin();
  return NextResponse.json({ orders });
}
