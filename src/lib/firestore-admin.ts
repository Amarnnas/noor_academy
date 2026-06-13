import { adminDb, adminAuthIsConfigured } from "@/lib/firebase-admin";
import { hashPassword } from "@/lib/password";
import { logger } from "@/lib/logger";
import type { Admin } from "@/types/admin";
import type { Course } from "@/types/course";
import type { Testimonial } from "@/types/testimonial";
import type { ContactMessage, Order } from "@/types/user";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

function docToData<T>(snap: { id: string; data: () => Record<string, unknown> }): T {
  return { id: snap.id, ...snap.data() } as T;
}

function checkConfigured(): boolean {
  if (!adminDb || !adminAuthIsConfigured()) {
    logger.error("firestore-admin: Firebase Admin not configured");
    return false;
  }
  return true;
}

// ─── Admins ──────────────────────────────────────────────
export async function getAllAdmins(): Promise<Admin[]> {
  if (!checkConfigured()) return [];
  const snap = await adminDb!.collection("admins").get();
  return snap.docs.map((d) => docToData<Admin>(d));
}

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  if (!checkConfigured()) return null;
  const snap = await adminDb!.collection("admins").where("email", "==", email).limit(1).get();
  if (snap.empty) return null;
  return docToData<Admin>(snap.docs[0]);
}

export async function createAdmin(data: Omit<Admin, "id"> & { password: string }): Promise<string> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  const hashed = await hashPassword(data.password);
  const ref = adminDb!.collection("admins").doc();
  await ref.set({ ...data, password: hashed, createdAt: FieldValue.serverTimestamp() });
  logger.info("firestore-admin: admin created", { id: ref.id, email: data.email });
  return ref.id;
}

export async function updateAdmin(id: string, data: Partial<Admin> & { password?: string }): Promise<void> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  const updateData: Record<string, unknown> = { ...data };
  if (data.password) updateData.password = await hashPassword(data.password);
  await adminDb!.collection("admins").doc(id).update(updateData);
  logger.info("firestore-admin: admin updated", { id });
}

export async function deleteAdmin(id: string): Promise<void> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  await adminDb!.collection("admins").doc(id).delete();
  logger.info("firestore-admin: admin deleted", { id });
}

// ─── Teachers ────────────────────────────────────────────
type TeacherData = { id: string; name: string; email: string; password?: string; role?: string; permissions?: string[]; createdAt?: Timestamp };

export async function getAllTeachers(): Promise<TeacherData[]> {
  if (!checkConfigured()) return [];
  const snap = await adminDb!.collection("teachers").get();
  return snap.docs.map((d) => docToData<TeacherData>(d));
}

export async function getTeacherByEmail(email: string): Promise<TeacherData | null> {
  if (!checkConfigured()) return null;
  const snap = await adminDb!.collection("teachers").where("email", "==", email).limit(1).get();
  if (snap.empty) return null;
  return docToData<TeacherData>(snap.docs[0]);
}

export async function createTeacher(data: { name: string; email: string; password: string }): Promise<string> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  const hashed = await hashPassword(data.password);
  const ref = adminDb!.collection("teachers").doc();
  await ref.set({ name: data.name, email: data.email, password: hashed, role: "teacher", createdAt: FieldValue.serverTimestamp() });
  logger.info("firestore-admin: teacher created", { id: ref.id, email: data.email });
  return ref.id;
}

export async function updateTeacher(id: string, data: { name?: string; email?: string; password?: string }): Promise<void> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  const updateData: Record<string, unknown> = {};
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.password) updateData.password = await hashPassword(data.password);
  await adminDb!.collection("teachers").doc(id).update(updateData);
  logger.info("firestore-admin: teacher updated", { id });
}

export async function deleteTeacher(id: string): Promise<void> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  await adminDb!.collection("teachers").doc(id).delete();
  logger.info("firestore-admin: teacher deleted", { id });
}

// ─── Students ────────────────────────────────────────────
export async function getStudentByEmail(email: string): Promise<{ id: string; name: string; email: string; password?: string; role: string; createdAt?: Timestamp } | null> {
  if (!checkConfigured()) return null;
  const snap = await adminDb!.collection("students").where("email", "==", email).limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as any;
}

export async function createStudent(data: { name: string; email: string; password: string; phone?: string }): Promise<string> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  const hashed = await hashPassword(data.password);
  const ref = adminDb!.collection("students").doc();
  await ref.set({
    name: data.name,
    email: data.email,
    password: hashed,
    phone: data.phone || "",
    role: "student",
    createdAt: FieldValue.serverTimestamp(),
  });
  logger.info("firestore-admin: student created", { id: ref.id, email: data.email });
  return ref.id;
}

export async function updateStudentPassword(email: string, newHashedPassword: string): Promise<void> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  const snap = await adminDb!.collection("students").where("email", "==", email).limit(1).get();
  if (snap.empty) throw new Error("Student not found");
  await snap.docs[0].ref.update({ password: newHashedPassword });
  logger.info("firestore-admin: student password updated", { email });
}

// ─── Courses ─────────────────────────────────────────────
export async function getAllCoursesAdmin(): Promise<Course[]> {
  if (!checkConfigured()) return [];
  const snap = await adminDb!.collection("courses").get();
  return snap.docs.map((d) => docToData<Course>(d));
}

export async function getCourseBySlugAdmin(slug: string): Promise<Course | null> {
  if (!checkConfigured()) return null;
  const snap = await adminDb!.collection("courses").where("slug", "==", slug).limit(1).get();
  if (snap.empty) return null;
  return docToData<Course>(snap.docs[0]);
}

export async function createCourseAdmin(data: Omit<Course, "id">): Promise<string> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  const ref = adminDb!.collection("courses").doc();
  await ref.set({ ...data, createdAt: FieldValue.serverTimestamp() });
  logger.info("firestore-admin: course created", { id: ref.id, title: data.title });
  return ref.id;
}

export async function updateCourseAdmin(id: string, data: Partial<Course>): Promise<void> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  await adminDb!.collection("courses").doc(id).update(data);
  logger.info("firestore-admin: course updated", { id });
}

export async function deleteCourseAdmin(id: string): Promise<void> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  await adminDb!.collection("courses").doc(id).delete();
  logger.info("firestore-admin: course deleted", { id });
}

// ─── Testimonials ────────────────────────────────────────
export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  if (!checkConfigured()) return [];
  const snap = await adminDb!.collection("testimonials").get();
  return snap.docs.map((d) => docToData<Testimonial>(d));
}

export async function createTestimonialAdmin(data: Omit<Testimonial, "id">): Promise<string> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  const ref = adminDb!.collection("testimonials").doc();
  await ref.set({ ...data, createdAt: FieldValue.serverTimestamp() });
  logger.info("firestore-admin: testimonial created", { id: ref.id, name: data.name });
  return ref.id;
}

export async function updateTestimonialAdmin(id: string, data: Partial<Testimonial>): Promise<void> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  await adminDb!.collection("testimonials").doc(id).update(data);
  logger.info("firestore-admin: testimonial updated", { id });
}

export async function deleteTestimonialAdmin(id: string): Promise<void> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  await adminDb!.collection("testimonials").doc(id).delete();
  logger.info("firestore-admin: testimonial deleted", { id });
}

// ─── Orders ──────────────────────────────────────────────
export async function getAllOrdersAdmin(): Promise<Order[]> {
  if (!checkConfigured()) return [];
  const snap = await adminDb!.collection("orders").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => docToData<Order>(d));
}

export async function updateOrderAdmin(id: string, data: Partial<Order>): Promise<void> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  await adminDb!.collection("orders").doc(id).update(data);
  logger.info("firestore-admin: order updated", { id });
}

// ─── Messages ────────────────────────────────────────────
export async function getAllMessagesAdmin(): Promise<ContactMessage[]> {
  if (!checkConfigured()) return [];
  const snap = await adminDb!.collection("messages").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => docToData<ContactMessage>(d));
}

export async function markMessageReadAdmin(id: string): Promise<void> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  await adminDb!.collection("messages").doc(id).update({ read: true });
  logger.info("firestore-admin: message marked read", { id });
}

export async function deleteMessageAdmin(id: string): Promise<void> {
  if (!checkConfigured()) throw new Error("Firebase Admin not configured");
  await adminDb!.collection("messages").doc(id).delete();
  logger.info("firestore-admin: message deleted", { id });
}

// ─── OTP ─────────────────────────────────────────────────
export async function setOtpAdmin(email: string, code: string, type: "register" | "reset"): Promise<void> {
  if (!checkConfigured()) return;
  const docId = `${email}_${type}`;
  await adminDb!.collection("otp_codes").doc(docId).set({
    email, code, type, expiresAt: Date.now() + 10 * 60 * 1000, createdAt: FieldValue.serverTimestamp(),
  });
}

export async function consumeOtpAdmin(email: string, code: string, type: "register" | "reset"): Promise<boolean> {
  if (!checkConfigured()) return false;
  const docId = `${email}_${type}`;
  const snap = await adminDb!.collection("otp_codes").doc(docId).get();
  if (!snap.exists) return false;
  const data = snap.data()!;
  if (data.expiresAt < Date.now()) { await snap.ref.delete(); return false; }
  if (data.code !== code) return false;
  await snap.ref.delete();
  return true;
}

export async function getOtpAttempts(email: string): Promise<number> {
  if (!checkConfigured()) return 0;
  const snap = await adminDb!.collection("otp_attempts").doc(email).get();
  if (!snap.exists) return 0;
  const data = snap.data()!;
  if (data.windowStart < Date.now() - 10 * 60 * 1000) { await snap.ref.delete(); return 0; }
  return data.count || 0;
}

export async function incrementOtpAttempt(email: string): Promise<void> {
  if (!checkConfigured()) return;
  const ref = adminDb!.collection("otp_attempts").doc(email);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({ count: 1, windowStart: Date.now() });
  } else {
    await ref.update({ count: FieldValue.increment(1) });
  }
}

export async function clearOtpAttempts(email: string): Promise<void> {
  if (!checkConfigured()) return;
  await adminDb!.collection("otp_attempts").doc(email).delete();
}
