import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { logger } from "@/lib/logger";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = "public/images/courses";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "الرجاء اختيار صورة" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "نوع الملف غير مدعوم. يرجى رفع JPG أو PNG أو WebP" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "حجم الملف كبير جداً. الحد الأقصى 5MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filepath = path.join(process.cwd(), UPLOAD_DIR, filename);

    await mkdir(path.dirname(filepath), { recursive: true });

    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const url = `/images/courses/${filename}`;
    logger.info("Image uploaded", { filename, size: file.size });

    return NextResponse.json({ url, filename });
  } catch (err) {
    logger.error("POST /api/upload failed", err);
    return NextResponse.json({ error: "فشل رفع الصورة" }, { status: 500 });
  }
}
