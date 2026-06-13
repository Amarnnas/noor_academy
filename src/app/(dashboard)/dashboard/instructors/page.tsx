"use client";

import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { instructors as initialInstructors } from "@/data/instructors";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { logger } from "@/lib/logger";
import { type Instructor } from "@/types/instructor";

interface InstructorForm {
  name: string;
  title: string;
  bio: string;
  specialties: string;
  experience: string;
}

export default function DashboardInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<InstructorForm>({ name: "", title: "", bio: "", specialties: "", experience: "" });
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");

  const openEdit = (inst: Instructor) => {
    setEditingId(inst.id);
    setForm({ name: inst.name, title: inst.title, bio: inst.bio, specialties: inst.specialties.join("، "), experience: inst.experience });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.title) { setFormError("يرجى ملء الاسم والمنصب"); return; }
    setInstructors(instructors.map((i) => i.id === editingId ? { ...i, name: form.name, title: form.title, bio: form.bio, specialties: form.specialties.split("،").map((s) => s.trim()).filter(Boolean), experience: form.experience } : i));
    logger.info("Instructor updated", { id: editingId, name: form.name });
    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    setInstructors(instructors.filter((i) => i.id !== id));
    logger.info("Instructor deleted", { id, name });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">إدارة المدربين</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {instructors.map((instructor) => (
          <div key={instructor.id} className="rounded-2xl border bg-[hsl(var(--card))] p-5">
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14 border-2 border-teal-200 dark:border-teal-800">
                <AvatarImage src={instructor.image} alt={instructor.name} />
                <AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">{instructor.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{instructor.name}</h3>
                <p className="text-xs text-teal-600 dark:text-teal-400">{instructor.title}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">{instructor.bio}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {instructor.specialties.map((s) => (<Badge key={s} variant="teal" className="text-[10px] px-1.5 py-0">{s}</Badge>))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t">
              <button onClick={() => openEdit(instructor)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-teal-600" aria-label="تعديل"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(instructor.id, instructor.name)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-[hsl(var(--muted-foreground))] hover:text-red-600" aria-label="حذف"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="rounded-2xl border bg-[hsl(var(--card))] p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">تعديل بيانات المدرب</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[hsl(var(--muted))]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>الاسم</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>المنصب</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>السيرة الذاتية</Label>
                <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>التخصصات (مفصولة بـ "،")</Label>
                <Input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>الخبرة</Label>
                <Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
              </div>
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} className="flex-1">حفظ التغييرات</Button>
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">إلغاء</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
