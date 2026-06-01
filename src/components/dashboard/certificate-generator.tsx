"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, GraduationCap, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { initialOrders } from "@/data/orders";
import { logger } from "@/lib/logger";
import { SITE } from "@/lib/constants";

type Orientation = "p" | "l";
type Purpose = "print" | "social";

export function CertificateGenerator() {
  const certRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const [stamp, setStamp] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [studentId, setStudentId] = useState("");
  const [orientation, setOrientation] = useState<Orientation>("p");
  const [purpose, setPurpose] = useState<Purpose>("print");
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  const isPortrait = orientation === "p";
  const previewW = isPortrait ? 420 : 594;
  const previewH = isPortrait ? 594 : 420;
  const scale = purpose === "print" ? 4 : 1;

  const selectedOrder = studentId ? initialOrders.find((o) => o.id === studentId) : undefined;

  const handleImageUpload = (file: File, setter: (v: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleStudentSelect = (id: string) => {
    setStudentId(id);
    setError("");
    const order = initialOrders.find((o) => o.id === id);
    if (order) {
      setName(order.studentName);
      setCourse(order.courseTitle);
    }
  };

  const generatePDF = async () => {
    if (!certRef.current || !name || !course) return;
    const order = initialOrders.find((o) => o.id === studentId);
    if (!order) { setError("الطالب غير مسجل في النظام"); return; }
    if (order.status !== "confirmed") { setError("لم يتم تأكيد تسجيل الطالب بعد"); return; }
    if (!order.paid) { setError("الطالب لم يدفع الرسوم بعد"); return; }
    setError("");
    try {
      const canvas = await html2canvas(certRef.current, { scale, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF(orientation, "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`شهادة-${name}-${course}.pdf`);
      logger.info("Certificate downloaded", { name, course, orientation, purpose, scale });
      setGenerated(true);
    } catch (err) {
      logger.error("Certificate generation failed", err);
    }
  };

  return (
    <div className="space-y-6">
      {!generated ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">بيانات الشهادة</h3>
            <div className="space-y-2">
              <Label htmlFor="certStudent">اختر طالباً (مسجل ومدفوع)</Label>
              <select id="certStudent" value={studentId} onChange={(e) => handleStudentSelect(e.target.value)} className="flex h-11 w-full rounded-xl border border-[hsl(var(--input))] bg-transparent px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]">
                <option value="">-- اختر طالباً --</option>
                {initialOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.studentName} - {o.courseTitle} ({o.status === "confirmed" && o.paid ? "مؤكد ومدفوع" : o.status === "confirmed" ? "مؤكد فقط" : "غير مؤكد"})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="certName">الاسم الكامل</Label>
              <Input id="certName" value={name} onChange={(e) => setName(e.target.value)} placeholder="أدخل اسمك الكامل" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certCourse">اسم الدورة</Label>
              <Input id="certCourse" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="أدخل اسم الدورة" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certDesc">وصف (اختياري)</Label>
              <Textarea id="certDesc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="وصف يظهر تحت الاسم في الشهادة" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>اتجاه الشهادة</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="orientation" checked={orientation === "p"} onChange={() => setOrientation("p")} className="text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm">عمودي (Portrait)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="orientation" checked={orientation === "l"} onChange={() => setOrientation("l")} className="text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm">أفقي (Landscape)</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>الغرض من التصدير</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="purpose" checked={purpose === "print"} onChange={() => setPurpose("print")} className="text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm">طباعة (300 DPI)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="purpose" checked={purpose === "social"} onChange={() => setPurpose("social")} className="text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm">مشاركة على التواصل (72 DPI)</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>الختم (صورة)</Label>
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer hover:bg-[hsl(var(--muted))] text-sm">
                <Upload className="h-4 w-4" />
                {stamp ? "تغيير الختم" : "رفع الختم"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, setStamp); }} />
              </label>
            </div>
            <div className="space-y-2">
              <Label>التوقيع (صورة)</Label>
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer hover:bg-[hsl(var(--muted))] text-sm">
                <Upload className="h-4 w-4" />
                {signature ? "تغيير التوقيع" : "رفع التوقيع"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, setSignature); }} />
              </label>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button onClick={generatePDF} disabled={!name || !course || !studentId} className="gap-2">
              <Download className="h-4 w-4" /> تحميل الشهادة PDF
            </Button>
          </div>

          <div ref={certRef} className="rounded-none border-4 border-double border-teal-700 dark:border-teal-400 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 p-8 text-center relative overflow-hidden" style={{ width: previewW, height: previewH, fontFamily: "inherit" }}>
            <div className="absolute inset-2 border border-teal-300/50 dark:border-teal-700/50 rounded-sm pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.04]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] font-bold text-teal-600 whitespace-nowrap">نور</div>
            </div>
            <div className="relative h-full flex flex-col items-center justify-between py-6">
              <div className="flex flex-col items-center gap-2">
                <GraduationCap className="h-14 w-14 text-teal-600 dark:text-teal-400" />
                <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-300">{SITE.name}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">شهادة إتمام دورة تدريبية</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <p className="text-lg font-bold">يشهد المركز بأن</p>
                <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 border-b-2 border-teal-400 pb-1 px-8">{name || "........................"}</p>
                {description && <p className="text-sm text-[hsl(var(--muted-foreground))]">{description}</p>}
                <p className="text-base">قد أتم بنجاح دورة</p>
                <p className="text-xl font-semibold">{course || "........................"}</p>
              </div>
              <div className="flex items-end justify-between w-full px-4">
                <div className="text-center">
                  {signature && <img src={signature} alt="التوقيع" className="h-14 mx-auto mb-1 object-contain" />}
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">مدير الأكاديمية</p>
                </div>
                <div className="text-center">
                  {stamp && <img src={stamp} alt="الختم" className="h-20 mx-auto mb-1 object-contain" />}
                </div>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">بتاريخ {new Date().toLocaleDateString("ar-SA")}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 rounded-2xl border bg-teal-50 dark:bg-teal-950">
          <Check className="h-12 w-12 mx-auto mb-4 text-teal-600" />
          <h3 className="text-xl font-bold mb-2">تم إنشاء الشهادة بنجاح!</h3>
          <p className="text-[hsl(var(--muted-foreground))] mb-4">تم تحميل شهادة {course} باسم {name}</p>
          <Button variant="outline" onClick={() => { setGenerated(false); setName(""); setCourse(""); setDescription(""); setStamp(null); setSignature(null); setStudentId(""); setError(""); }}>إنشاء شهادة جديدة</Button>
        </div>
      )}
    </div>
  );
}
