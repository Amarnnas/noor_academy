import { NextResponse } from "next/server";
import { createOrderAdmin } from "@/lib/firestore-admin";
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

    const orderId = await createOrderAdmin({
      courseId,
      courseTitle: courseTitle || "",
      studentName,
      studentEmail,
      phone: phone || "",
      status: "pending",
      paid: false,
      createdAt: new Date().toISOString(),
    });
    logger.info("Order created", { orderId, studentName, courseTitle });
    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    logger.error("POST /api/orders failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
