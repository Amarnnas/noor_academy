import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export function adminAuthIsConfigured(): boolean {
  return !!(projectId && clientEmail && privateKey);
}

let adminApp: ReturnType<typeof initializeApp> | null = null;

if (adminAuthIsConfigured()) {
  const apps = getApps();
  adminApp = apps.length === 0
    ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
    : apps[0];
}

export function getAdminApp() {
  return adminApp;
}

export const adminDb = adminApp ? getFirestore(adminApp) : null;
