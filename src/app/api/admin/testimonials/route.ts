import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllTestimonialsAdmin, createTestimonialAdmin } from "@/lib/firestore-admin";
import { hasSpecificPermission } from "@/lib/permissions";
import { logger } from "@/lib/logger";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission(session.user?.permissions, "manage_testimonials")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const testimonials = await getAllTestimonialsAdmin();
    return NextResponse.json(testimonials);
  } catch (err) {
    logger.error("Failed to fetch testimonials", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !hasSpecificPermission(session.user?.permissions, "manage_testimonials")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const id = await createTestimonialAdmin(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    logger.error("Failed to create testimonial", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
