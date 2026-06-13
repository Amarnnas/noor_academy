import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllInstructorsAdmin, createInstructorAdmin } from "@/lib/firestore-admin";
import { logger } from "@/lib/logger";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "admin" && session.user.role !== "teacher")) {
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
  if (!session || session.user.role !== "admin") {
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
