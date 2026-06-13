import { NextResponse } from "next/server";
import { getAllTestimonialsAdmin } from "@/lib/firestore-admin";
import { adminAuthIsConfigured } from "@/lib/firebase-admin";
import { testimonials as fallbackTestimonials } from "@/data/testimonials";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    let result = adminAuthIsConfigured() ? await getAllTestimonialsAdmin() : fallbackTestimonials;
    result = result.filter((t) => !t.hidden);
    return NextResponse.json({ testimonials: result, total: result.length });
  } catch (err) {
    logger.error("GET /api/testimonials failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
