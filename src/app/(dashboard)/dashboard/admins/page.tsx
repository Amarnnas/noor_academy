"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X, Shield } from "lucide-react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";
import { PERMISSION_LABELS, ALL_PERMISSIONS, hasSpecificPermission } from "@/lib/permissions";
import type { RolePermission } from "@/types/roles";
import type { Admin } from "@/types/admin";

export default function DashboardAdminsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<RolePermission[]>([]);
  const [formError, setFormError] = useState("");

  const userPermissions = ((session?.user as any)?.permissions || []) as string[];

  useEffect(() => {
    if (status === "loading") return;
    if (!hasSpecificPermission(userPermissions, "manage_admins")) {
      router.push("/dashboard");
      return;
    }
    loadAdmins();
  }, [session, status]);

  const loadAdmins = async () => {
    try {
      const snap = await getDocs(collection(db, "admins"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Admin));
      setAdmins(list);
    } catch (err) {
      logger.error("Failed to load admins", err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", email: "", password: "" });
    setSelectedPermissions([]);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (a: Admin) => {
    setEditingId(a.id);
    setForm({ name: a.name, email: a.email, password: "" });
    setSelectedPermissions(a.permissions);
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) { setFormError("يرجى ملء الاسم والبريد الإلكتروني"); return; }
    if (!editingId && !form.password) { setFormError("يرجى إدخال كلمة مرور"); return; }
    if (!editingId && form.password.length < 6) { setFormError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }

    try {
      if (editingId) {
        const updateData: Record<string, unknown> = { permissions: selectedPermissions };
        if (form.name) updateData.name = form.name;
        if (form.password) updateData.password = form.password;
        await updateDoc(doc(db, "admins", editingId), updateData);
        logger.info("Admin updated", { id: editingId });
      } else {
        await addDoc(collection(db, "admins"), {
          name: form.name,
          email: form.email,
          password: form.password,
          permissions: selectedPermissions,
          createdAt: new Date().toISOString(),
        });
        logger.info("Admin created", { email: form.email });
      }
      setShowModal(false);
      loadAdmins();
    } catch (err) {
      logger.error("Failed to save admin", err);
      setFormError("حدث خطأ أثناء الحفظ");
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (email === session?.user?.email) { setFormError("لا يمكنك حذف نفسك"); return; }
    const remaining = admins.filter((a) => a.id !== id);
    const hasSupervisor = remaining.some((a) => a.permissions.includes("manage_admins"));
    if (!hasSupervisor) { setFormError("لا يمكن حذف آخر مشرف"); return; }
    try {
      await deleteDoc(doc(db, "admins", id));
      logger.info("Admin deleted", { id, email });
      loadAdmins();
    } catch (err) {
      logger.error("Failed to delete admin", err);
    }
  };

  const togglePermission = (perm: RolePermission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  if (loading || status === "loading") return <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة المشرفين</h1>
        <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />إضافة مشرف</Button>
      </div>

      <div className="rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(var(--muted))]/50">
                <th className="text-right p-4 font-medium">الاسم</th>
                <th className="text-right p-4 font-medium">البريد الإلكتروني</th>
                <th className="text-right p-4 font-medium">الصلاحيات</th>
                <th className="text-right p-4 font-medium">تاريخ الإنشاء</th>
                <th className="text-right p-4 font-medium w-24">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-[hsl(var(--muted-foreground))]">لا يوجد مشرفون بعد</td></tr>
              )}
              {admins.map((admin) => (
                <tr key={admin.id} className="border-t hover:bg-[hsl(var(--muted))]/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-teal-600" />
                      <span className="font-medium">{admin.name}</span>
                      {admin.email === session?.user?.email && (
                        <span className="px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-[10px]">أنت</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-[hsl(var(--muted-foreground))]">{admin.email}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.map((p) => (
                        <span key={p} className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[11px]">
                          {PERMISSION_LABELS[p]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-[hsl(var(--muted-foreground))]">{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString("ar-SA") : "-"}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(admin)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-teal-600" aria-label="تعديل"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(admin.id, admin.email)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-[hsl(var(--muted-foreground))] hover:text-red-600" aria-label="حذف"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="rounded-2xl border bg-[hsl(var(--card))] p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editingId ? "تعديل المشرف" : "إضافة مشرف جديد"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[hsl(var(--muted))]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>الاسم الكامل</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسم المشرف" />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@example.com" />
              </div>
              <div className="space-y-2">
                <Label>{editingId ? "كلمة المرور الجديدة (اترك فارغاً بدون تغيير)" : "كلمة المرور"}</Label>
                <Input type="password" dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editingId ? "..." : "كلمة المرور"} />
              </div>
              <div className="space-y-2">
                <Label>الصلاحيات</Label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_PERMISSIONS.map((perm) => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[hsl(var(--muted))]">
                      <input type="checkbox" checked={selectedPermissions.includes(perm)} onChange={() => togglePermission(perm)} className="text-teal-600 focus:ring-teal-500 rounded" />
                      <span className="text-sm">{PERMISSION_LABELS[perm]}</span>
                    </label>
                  ))}
                </div>
              </div>
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} className="flex-1">{editingId ? "حفظ التغييرات" : "إضافة"}</Button>
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">إلغاء</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
