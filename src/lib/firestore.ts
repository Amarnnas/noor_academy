import {
  collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { logger } from "@/lib/logger";
import type { Course } from "@/types/course";
import type { Instructor } from "@/types/instructor";
import type { Testimonial } from "@/types/testimonial";
import type { ContactMessage, Order } from "@/types/user";

// ─── Helpers ──────────────────────────────────────────────
function docToData<T>(snap: { id: string; data: () => Record<string, unknown> }): T {
  return { id: snap.id, ...snap.data() } as T;
}

function collectionRef(name: string) {
  return collection(db, name);
}

// ─── Courses ──────────────────────────────────────────────
export async function getAllCourses() {
  const snap = await getDocs(collectionRef("courses"));
  return snap.docs.map((d) => docToData<Course>(d));
}

export async function getCourseById(id: string) {
  const snap = await getDoc(doc(db, "courses", id));
  if (!snap.exists()) return null;
  return docToData<Course>(snap);
}

export async function getCourseBySlug(slug: string) {
  const q = query(collectionRef("courses"), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return docToData<Course>(snap.docs[0]);
}

export async function createCourse(data: Omit<Course, "id">) {
  const ref = await addDoc(collectionRef("courses"), { ...data, createdAt: serverTimestamp() });
  logger.info("Firestore: course created", { id: ref.id, title: data.title });
  return ref.id;
}

export async function updateCourse(id: string, data: Partial<Course>) {
  await updateDoc(doc(db, "courses", id), data);
  logger.info("Firestore: course updated", { id });
}

export async function deleteCourse(id: string) {
  await deleteDoc(doc(db, "courses", id));
  logger.info("Firestore: course deleted", { id });
}

// ─── Instructors ──────────────────────────────────────────
export async function getAllInstructors() {
  const snap = await getDocs(collectionRef("instructors"));
  return snap.docs.map((d) => docToData<Instructor>(d));
}

export async function getInstructorById(id: string) {
  const snap = await getDoc(doc(db, "instructors", id));
  if (!snap.exists()) return null;
  return docToData<Instructor>(snap);
}

export async function createInstructor(data: Omit<Instructor, "id">) {
  const ref = await addDoc(collectionRef("instructors"), { ...data, createdAt: serverTimestamp() });
  logger.info("Firestore: instructor created", { id: ref.id, name: data.name });
  return ref.id;
}

export async function updateInstructor(id: string, data: Partial<Instructor>) {
  await updateDoc(doc(db, "instructors", id), data);
  logger.info("Firestore: instructor updated", { id });
}

export async function deleteInstructor(id: string) {
  await deleteDoc(doc(db, "instructors", id));
  logger.info("Firestore: instructor deleted", { id });
}

// ─── Testimonials ─────────────────────────────────────────
export async function getAllTestimonials() {
  const snap = await getDocs(collectionRef("testimonials"));
  return snap.docs.map((d) => docToData<Testimonial>(d));
}

export async function getTestimonialById(id: string) {
  const snap = await getDoc(doc(db, "testimonials", id));
  if (!snap.exists()) return null;
  return docToData<Testimonial>(snap);
}

export async function createTestimonial(data: Omit<Testimonial, "id">) {
  const ref = await addDoc(collectionRef("testimonials"), { ...data, createdAt: serverTimestamp() });
  logger.info("Firestore: testimonial created", { id: ref.id, name: data.name });
  return ref.id;
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>) {
  await updateDoc(doc(db, "testimonials", id), data);
  logger.info("Firestore: testimonial updated", { id });
}

export async function deleteTestimonial(id: string) {
  await deleteDoc(doc(db, "testimonials", id));
  logger.info("Firestore: testimonial deleted", { id });
}

// ─── Orders ───────────────────────────────────────────────
export async function getAllOrders() {
  const snap = await getDocs(collectionRef("orders"));
  return snap.docs.map((d) => docToData<Order>(d));
}

export async function getOrderById(id: string) {
  const snap = await getDoc(doc(db, "orders", id));
  if (!snap.exists()) return null;
  return docToData<Order>(snap);
}

export async function createOrder(data: Omit<Order, "id">) {
  const ref = await addDoc(collectionRef("orders"), { ...data, createdAt: serverTimestamp() });
  logger.info("Firestore: order created", { id: ref.id, student: data.studentName });
  return ref.id;
}

export async function updateOrder(id: string, data: Partial<Order>) {
  await updateDoc(doc(db, "orders", id), data);
  logger.info("Firestore: order updated", { id });
}

export async function deleteOrder(id: string) {
  await deleteDoc(doc(db, "orders", id));
  logger.info("Firestore: order deleted", { id });
}

// ─── Messages (Contact) ───────────────────────────────────
export async function getAllMessages() {
  const snap = await getDocs(query(collectionRef("messages"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => docToData<ContactMessage>(d));
}

export async function getMessageById(id: string) {
  const snap = await getDoc(doc(db, "messages", id));
  if (!snap.exists()) return null;
  return docToData<ContactMessage>(snap);
}

export async function createMessage(data: Omit<ContactMessage, "id">) {
  const ref = await addDoc(collectionRef("messages"), { ...data, createdAt: serverTimestamp() });
  logger.info("Firestore: message created", { id: ref.id, from: data.name });
  return ref.id;
}

export async function markMessageRead(id: string) {
  await updateDoc(doc(db, "messages", id), { read: true });
  logger.info("Firestore: message marked read", { id });
}

export async function deleteMessage(id: string) {
  await deleteDoc(doc(db, "messages", id));
  logger.info("Firestore: message deleted", { id });
}

// ─── Admins ───────────────────────────────────────────────
export async function getAllAdmins() {
  const snap = await getDocs(collectionRef("admins"));
  return snap.docs.map((d) => docToData<import("@/types/admin").Admin>(d));
}

export async function getAdminById(id: string) {
  const snap = await getDoc(doc(db, "admins", id));
  if (!snap.exists()) return null;
  return docToData<import("@/types/admin").Admin>(snap);
}

export async function getAdminByEmail(email: string) {
  const q = query(collectionRef("admins"), where("email", "==", email), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return docToData<import("@/types/admin").Admin>(snap.docs[0]);
}

export async function createAdmin(data: import("@/types/admin").Admin) {
  await setDoc(doc(db, "admins", data.id), data);
  logger.info("Firestore: admin created", { id: data.id, email: data.email });
}

export async function updateAdmin(id: string, data: Partial<import("@/types/admin").Admin>) {
  await updateDoc(doc(db, "admins", id), data);
  logger.info("Firestore: admin updated", { id });
}

export async function deleteAdmin(id: string) {
  await deleteDoc(doc(db, "admins", id));
  logger.info("Firestore: admin deleted", { id });
}
