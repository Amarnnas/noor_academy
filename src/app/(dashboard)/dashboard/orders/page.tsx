"use client";

import { useState } from "react";
import { Plus, Pencil, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { courses } from "@/data/courses";
import { initialOrders } from "@/data/orders";
import { type Order } from "@/types/user";
import { logger } from "@/lib/logger";

const statusBadge: Record<string, "default" | "emerald" | "destructive"> = { pending: "default", confirmed: "emerald", cancelled: "destructive" };
const statusLabel = { pending: "قيد الانتظار", confirmed: "مؤكد", cancelled: "ملغي" };

interface StudentForm {
  studentName: string;
  studentEmail: string;
  phone: string;
  courseId: string;
  status: "pending" | "confirmed" | "cancelled";
  paid: boolean;
}

const emptyForm: StudentForm = { studentName: "", studentEmail: "", phone: "", courseId: "", status: "pending", paid: false };

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const [formError, setFormError] = useState("");

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setFormError(""); setShowModal(true); };
  const openEdit = (o: Order) => { setEditingId(o.id); setForm({ studentName: o.studentName, studentEmail: o.studentEmail, phone: o.phone, courseId: o.courseId, status: o.status, paid: o.paid }); setFormError(""); setShowModal(true); };

  const handleSave = () => {
    if (!form.studentName || !form.studentEmail || !form.phone || !form.courseId) { setFormError("يرجى ملء جميع الحقول"); return; }
    const course = courses.find((c) => c.id === form.courseId);
    if (editingId) {
      setOrders(orders.map((o) => o.id === editingId ? { ...o, studentName: form.studentName, studentEmail: form.studentEmail, phone: form.phone, courseId: form.courseId, courseTitle: course?.title || o.courseTitle, status: form.status, paid: form.paid } : o));
      logger.info("Order updated", { id: editingId, status: form.status, paid: form.paid });
    } else {
      const newOrder: Order = {
        id: `STU-${Date.now()}`,
        courseId: form.courseId,
        courseTitle: course?.title || "",
        studentName: form.studentName,
        studentEmail: form.studentEmail,
        phone: form.phone,
        status: form.status,
        paid: form.paid,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setOrders([newOrder, ...orders]);
      logger.info("Student registered", { id: newOrder.id, name: form.studentName, course: newOrder.courseTitle, status: newOrder.status, paid: newOrder.paid });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">طلبات التسجيل</h1>
        <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />تسجيل طالب جديد</Button>
      </div>
      <div className="rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(var(--muted))]/50">
                <th className="text-right p-4 font-medium">الطالب</th>
                <th className="text-right p-4 font-medium">الدورة</th>
                <th className="text-right p-4 font-medium">الجوال</th>
                <th className="text-right p-4 font-medium">التاريخ</th>
                <th className="text-right p-4 font-medium">الحالة</th>
                <th className="text-right p-4 font-medium">الدفع</th>
                <th className="text-right p-4 font-medium w-16">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-[hsl(var(--muted))]/30 transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{order.studentName}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">{order.studentEmail}</div>
                  </td>
                  <td className="p-4 text-[hsl(var(--muted-foreground))]">{order.courseTitle}</td>
                  <td className="p-4 text-[hsl(var(--muted-foreground))]" dir="ltr">{order.phone}</td>
                  <td className="p-4 text-[hsl(var(--muted-foreground))]">{order.createdAt}</td>
                  <td className="p-4"><Badge variant={statusBadge[order.status]} className="text-xs">{statusLabel[order.status]}</Badge></td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-md ${order.paid ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"}`}>
                      {order.paid ? "مدفوع" : "غير مدفوع"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => openEdit(order)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-teal-600" aria-label="تعديل"><Pencil className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="rounded-2xl border bg-[hsl(var(--card))] p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editingId ? "تعديل بيانات الطالب" : "تسجيل طالب جديد"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[hsl(var(--muted))]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regName">اسم الطالب</Label>
                <Input id="regName" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="الاسم الكامل" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regEmail">البريد الإلكتروني</Label>
                <Input id="regEmail" type="email" dir="ltr" value={form.studentEmail} onChange={(e) => setForm({ ...form, studentEmail: e.target.value })} placeholder="student@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regPhone">رقم الجوال</Label>
                <Input id="regPhone" type="tel" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+9665XXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regCourse">الدورة</Label>
                <select id="regCourse" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} className="flex h-11 w-full rounded-xl border border-[hsl(var(--input))] bg-transparent px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]">
                  <option value="">اختر دورة</option>
                  {courses.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="regStatus">حالة الطالب</Label>
                <select id="regStatus" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "pending" | "confirmed" | "cancelled" })} className="flex h-11 w-full rounded-xl border border-[hsl(var(--input))] bg-transparent px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]">
                  <option value="pending">قيد الانتظار</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="regPaid">تم الدفع</Label>
                <input id="regPaid" type="checkbox" checked={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.checked })} className="h-5 w-5 rounded border-[hsl(var(--input))] text-teal-600 focus:ring-teal-500" />
              </div>
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} className="flex-1">{editingId ? "حفظ التغييرات" : "تسجيل"}</Button>
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">إلغاء</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
