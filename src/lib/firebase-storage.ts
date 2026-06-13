import { adminBucket, storageIsConfigured } from "@/lib/firebase-admin";
import { logger } from "@/lib/logger";

export async function uploadToStorage(
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<string | null> {
  if (!storageIsConfigured()) {
    logger.warn("Firebase Storage not configured, upload skipped");
    return null;
  }
  try {
    const file = adminBucket!.file(filename);
    await file.save(buffer, { metadata: { contentType: mimeType }, public: true });
    const publicUrl = `https://storage.googleapis.com/${adminBucket!.name}/${filename}`;
    logger.info("File uploaded to Firebase Storage", { filename, publicUrl });
    return publicUrl;
  } catch (err) {
    logger.error("Firebase Storage upload failed", err);
    return null;
  }
}

export async function deleteFromStorage(filename: string): Promise<boolean> {
  if (!storageIsConfigured()) return false;
  try {
    await adminBucket!.file(filename).delete();
    logger.info("File deleted from Firebase Storage", { filename });
    return true;
  } catch (err) {
    logger.error("Firebase Storage delete failed", err);
    return false;
  }
}
