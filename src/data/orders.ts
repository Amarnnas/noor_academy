import { Order } from "@/types/user";

export const initialOrders: Order[] = [
  { id: "1", courseId: "1", courseTitle: "الإنجليزية للمبتدئين", studentName: "أحمد علي", studentEmail: "ahmed@test.com", phone: "+966501234567", status: "confirmed", paid: true, createdAt: "2026-05-30" },
  { id: "2", courseId: "3", courseTitle: "الألمانية من الصفر (A1-A2)", studentName: "نورة سعد", studentEmail: "noura@test.com", phone: "+966551234567", status: "confirmed", paid: false, createdAt: "2026-05-31" },
  { id: "3", courseId: "6", courseTitle: "العربية للناطقين بغيرها", studentName: "John Smith", studentEmail: "john@test.com", phone: "+966501112233", status: "pending", paid: false, createdAt: "2026-06-01" },
  { id: "4", courseId: "2", courseTitle: "الفرنسية للمستوى المتوسط", studentName: "سارة محمد", studentEmail: "sara@test.com", phone: "+966509998877", status: "cancelled", paid: false, createdAt: "2026-05-28" },
];
