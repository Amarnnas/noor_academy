import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "الحقول المطلوبة: name, email, message" }, { status: 400 });
    }

    logger.info("Contact message received", { name, email, phone });
    return NextResponse.json({ success: true, message: "تم استلام رسالتك بنجاح" });
  } catch (err) {
    logger.error("POST /api/contact failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
