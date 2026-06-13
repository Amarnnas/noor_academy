import { NextResponse } from "next/server";
import { getAllInstructorsAdmin } from "@/lib/firestore-admin";
import { adminAuthIsConfigured } from "@/lib/firebase-admin";
import { instructors as fallbackInstructors } from "@/data/instructors";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const result = adminAuthIsConfigured() ? await getAllInstructorsAdmin() : fallbackInstructors;
    return NextResponse.json({ instructors: result, total: result.length });
  } catch (err) {
    logger.error("GET /api/instructors failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
