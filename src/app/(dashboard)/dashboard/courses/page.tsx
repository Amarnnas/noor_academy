"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { courses as initialCourses } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { logger } from "@/lib/logger";
import { type Course } from "@/types/course";

interface CourseForm {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  price: string;
}

const emptyForm: CourseForm = { title: "", description: "", category: "", level: "", duration: "", price: "" };

export default function DashboardCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [formError, setFormError] = useState("");

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setFormError(""); setShowModal(true); };
  const openEdit = (c: Course) => { setEditingId(c.id); setForm({ title: c.title, description: c.description, category: c.category, level: c.level, duration: c.duration, price: String(c.price) }); setFormError(""); setShowModal(true); };

  const handleSave = () => {
    if (!form.title || !form.category || !form.duration || !form.price) { setFormError("يرجى ملء جميع الحقول المطلوبة"); return; }
    if (editingId) {
      setCourses(courses.map((c) => c.id === editingId ? { ...c, title: form.title, description: form.description, category: form.category, level: form.level as Course["level"], duration: form.duration, price: Number(form.price) } : c));
      logger.info("Course updated", { id: editingId, title: form.title });
    } else {
      const newCourse: Course = { id: String(Date.now()), slug: form.title.replace(/\s+/g, "-").toLowerCase(), title: form.title, description: form.description, fullDescription: form.description, image: "/images/logo.png", category: form.category, level: form.level as Course["level"], duration: form.duration, studentsCount: 0, rating: 0, reviewsCount: 0, price: Number(form.price), objectives: [], curriculum: [], instructorId: "1" };
      setCourses([...courses, newCourse]);
      logger.info("Course added", { title: form.title });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string, title: string) => {
    setCourses(courses.filter((c) => c.id !== id));
    logger.info("Course deleted", { id, title });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة الدورات</h1>
        <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />إضافة دورة</Button>
      </div>
      <div className="rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(var(--muted))]/50">
                <th className="text-right p-4 font-medium">الدورة</th>
                <th className="text-right p-4 font-medium">المستوى</th>
                <th className="text-right p-4 font-medium">المدة</th>
                <th className="text-right p-4 font-medium">الطلاب</th>
                <th className="text-right p-4 font-medium">التقييم</th>
                <th className="text-right p-4 font-medium">السعر</th>
                <th className="text-right p-4 font-medium w-24">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t hover:bg-[hsl(var(--muted))]/30 transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{course.title}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">{course.category}</div>
                  </td>
                  <td className="p-4 text-[hsl(var(--muted-foreground))]">{course.level}</td>
                  <td className="p-4 text-[hsl(var(--muted-foreground))]">{course.duration}</td>
                  <td className="p-4 text-[hsl(var(--muted-foreground))]">{course.studentsCount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs">{course.rating}</span>
                  </td>
                  <td className="p-4 font-medium">{course.price} ريال</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(course)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-teal-600" aria-label="تعديل"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(course.id, course.title)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-[hsl(var(--muted-foreground))] hover:text-red-600" aria-label="حذف"><Trash2 className="h-4 w-4" /></button>
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
              <h2 className="text-lg font-bold">{editingId ? "تعديل الدورة" : "إضافة دورة"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[hsl(var(--muted))]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>عنوان الدورة</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="عنوان الدورة" />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="وصف الدورة" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>التصنيف</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="مثل: الإنجليزية" />
                </div>
                <div className="space-y-2">
                  <Label>المستوى</Label>
                  <Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="مبتدئ / متوسط / متقدم" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المدة</Label>
                  <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="مثل: 40 ساعة" />
                </div>
                <div className="space-y-2">
                  <Label>السعر (ريال)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="السعر" />
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
