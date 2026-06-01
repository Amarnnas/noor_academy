import { NextResponse } from "next/server";
import { instructors } from "@/data/instructors";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    return NextResponse.json({ instructors, total: instructors.length });
  } catch (err) {
    logger.error("GET /api/instructors failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
