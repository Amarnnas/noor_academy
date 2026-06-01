import { NextResponse } from "next/server";
import { courses } from "@/data/courses";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";

    let result = [...courses];
    if (category && category !== "الكل") result = result.filter((c) => c.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }

    return NextResponse.json({ courses: result, total: result.length });
  } catch (err) {
    logger.error("GET /api/courses failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
