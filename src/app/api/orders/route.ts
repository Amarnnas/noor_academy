import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

interface OrderBody {
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
  phone: string;
}

export async function POST(request: Request) {
  try {
    const body: OrderBody = await request.json();
    const { courseId, courseTitle, studentName, studentEmail, phone } = body;

    if (!courseId || !studentName || !studentEmail) {
      return NextResponse.json({ error: "الحقول المطلوبة: courseId, studentName, studentEmail" }, { status: 400 });
    }

    const order = { id: Date.now().toString(), ...body, status: "pending", createdAt: new Date().toISOString() };
    logger.info("Order created", order);
    return NextResponse.json({ success: true, order });
  } catch (err) {
    logger.error("POST /api/orders failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
