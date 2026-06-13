import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllMessagesAdmin } from "@/lib/firestore-admin";
import { hasSpecificPermission } from "@/lib/permissions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission((session.user as any)?.permissions, "manage_messages")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const messages = await getAllMessagesAdmin();
  return NextResponse.json({ messages });
}
