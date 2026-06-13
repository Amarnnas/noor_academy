import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateTestimonialAdmin, deleteTestimonialAdmin } from "@/lib/firestore-admin";
import { logger } from "@/lib/logger";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    await updateTestimonialAdmin(id, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Failed to update testimonial", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  try {
    await deleteTestimonialAdmin(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Failed to delete testimonial", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
