import admin from "firebase-admin";
import bcrypt from "bcryptjs";
import { courses } from "../src/data/courses";
import { instructors } from "../src/data/instructors";
import { testimonials } from "../src/data/testimonials";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount as admin.ServiceAccount) });
}

const db = admin.firestore();

async function seedCollection<T extends { id: string }>(
  name: string,
  items: T[],
): Promise<void> {
  const batch = db.batch();
  for (const item of items) {
    const { id, ...data } = item;
    const ref = db.collection(name).doc(id);
    batch.set(ref, { ...data, createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${items.length} ${name}`);
}

async function seedAdmins() {
  const existing = await db.collection("admins").limit(1).get();
  if (!existing.empty) {
    console.log("Admins already seeded, skipping");
    return;
  }
  const hashed = await bcrypt.hash("Admin@123456", 10);
  await db.collection("admins").doc().set({
    name: "مدير النظام",
    email: "admin@nooracademy.com",
    password: hashed,
    role: "admin",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("Default admin created: admin@nooracademy.com / Admin@123456");
}

async function main() {
  if (!serviceAccount.projectId) {
    console.error("Missing FIREBASE_* env vars. Run with: npx tsx --env-file=.env.local scripts/seed-firestore.ts");
    process.exit(1);
  }
  console.log("Seeding Firestore...");
  await seedCollection("courses", courses);
  await seedCollection("instructors", instructors);
  await seedCollection("testimonials", testimonials);
  await seedAdmins();
  console.log("Done!");
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
