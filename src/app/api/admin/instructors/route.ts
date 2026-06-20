import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllInstructorsAdmin, createInstructorAdmin } from "@/lib/firestore-admin";
import { hasSpecificPermission } from "@/lib/permissions";
import { logger } from "@/lib/logger";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission(session.user?.permissions, "manage_instructors")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const instructors = await getAllInstructorsAdmin();
    return NextResponse.json(instructors);
  } catch (err) {
    logger.error("Failed to fetch instructors", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission(session.user?.permissions, "manage_instructors")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const id = await createInstructorAdmin(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    logger.error("Failed to create instructor", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
