interface OtpEntry {
  code: string;
  type: "register" | "reset";
  expiresAt: number;
}

const store = new Map<string, OtpEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.expiresAt < now) store.delete(key);
  }
}, 60000);

export function setOtp(email: string, code: string, type: "register" | "reset") {
  store.set(`${email}:${type}`, { code, type, expiresAt: Date.now() + 10 * 60 * 1000 });
}

export function getOtp(email: string, type: "register" | "reset"): string | null {
  const entry = store.get(`${email}:${type}`);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) { store.delete(`${email}:${type}`); return null; }
  return entry.code;
}

export function consumeOtp(email: string, code: string, type: "register" | "reset"): boolean {
  const entry = store.get(`${email}:${type}`);
  if (!entry) return false;
  if (entry.expiresAt < Date.now()) { store.delete(`${email}:${type}`); return false; }
  if (entry.code !== code) return false;
  store.delete(`${email}:${type}`);
  return true;
}
