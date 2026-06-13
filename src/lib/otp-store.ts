import { setOtpAdmin, checkOtpAdmin, consumeOtpAdmin } from "@/lib/firestore-admin";
import { adminAuthIsConfigured } from "@/lib/firebase-admin";

export async function setOtp(email: string, code: string, type: "register" | "reset") {
  await setOtpAdmin(email, code, type);
}

export async function checkOtp(email: string, code: string, type: "register" | "reset"): Promise<boolean> {
  if (!adminAuthIsConfigured()) return false;
  return checkOtpAdmin(email, code, type);
}

export async function consumeOtp(email: string, code: string, type: "register" | "reset"): Promise<boolean> {
  if (!adminAuthIsConfigured()) return false;
  return consumeOtpAdmin(email, code, type);
}
