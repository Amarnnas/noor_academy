import nodemailer from "nodemailer";
import { logger } from "@/lib/logger";
import { setOtp, consumeOtp } from "@/lib/otp-store";

export type OtpType = "register" | "reset";

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return null;
}

async function sendEmail(to: string, subject: string, html: string) {
  const transporter = createTransporter();
  if (!transporter) {
    logger.info("OTP email not sent (no SMTP config), would send to", { to, subject });
    return;
  }
  try {
    await transporter.sendMail({ from: process.env.SMTP_FROM || "noreply@nooracademy.com", to, subject, html });
    logger.info("OTP email sent", { to });
  } catch (err) {
    logger.error("Failed to send OTP email", err);
  }
}

export async function sendOtp(email: string, type: OtpType) {
  const code = generateCode();
  await setOtp(email, code, type);
  const subject = type === "register" ? "كود تأكيد التسجيل - أكاديمية نور" : "إعادة تعيين كلمة المرور - أكاديمية نور";
  const html = `<div style="font-family: sans-serif; max-width:480px; margin:0 auto; padding:24px; border:1px solid #e2e8f0; border-radius:12px; text-align:center; direction:rtl;"><h2 style="color:#0d9488;">أكاديمية نور</h2><p>كود التحقق الخاص بك هو:</p><div style="font-size:32px; letter-spacing:8px; font-weight:bold; color:#0d9488; padding:16px; background:#f0fdfa; border-radius:8px; margin:16px 0;">${code}</div><p style="color:#64748b; font-size:14px;">هذا الكود صالح لمدة 10 دقائق</p></div>`;
  await sendEmail(email, subject, html);
  logger.info("OTP sent", { email, type });
  return code;
}

export async function verifyOtp(email: string, code: string, type: OtpType): Promise<boolean> {
  return consumeOtp(email, code, type);
}
