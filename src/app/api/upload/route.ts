import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadToStorage } from "@/lib/firebase-storage";
import { storageIsConfigured } from "@/lib/firebase-admin";
import { logger } from "@/lib/logger";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;
const UPLOAD_DIR = "public/images/courses";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "teacher"].includes((session.user as { role?: string })?.role || "")) {
      return NextResponse.json({ error: "غير مصرح لك برفع الملفات" }, { status: 403 });
    }
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
    const filename = `courses/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (storageIsConfigured()) {
      const url = await uploadToStorage(buffer, filename, file.type);
      if (url) {
        logger.info("Image uploaded to Firebase Storage", { filename, size: file.size });
        return NextResponse.json({ url, filename });
      }
    }

    const filepath = path.join(process.cwd(), UPLOAD_DIR, filename.replace("courses/", ""));
    await mkdir(path.dirname(filepath), { recursive: true });
    await writeFile(filepath, buffer);
    const localUrl = `/images/courses/${filename.replace("courses/", "")}`;
    logger.info("Image uploaded locally", { filename, size: file.size });

    return NextResponse.json({ url: localUrl, filename: filename.replace("courses/", "") });
  } catch (err) {
    logger.error("POST /api/upload failed", err);
    return NextResponse.json({ error: "فشل رفع الصورة" }, { status: 500 });
  }
}
