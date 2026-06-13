"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Camera, Save, Upload, User, Mail, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";

export default function StudentProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "/images/placeholders/instructor.svg");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("profile_" + session?.user?.email);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.name) setName(data.name);
        if (data.image) setImage(data.image);
      } catch { /* ignore */ }
    }
  }, [session?.user?.email]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setImage(data.url);
      } else {
        setMessage({ type: "error", text: data.error || "فشل رفع الصورة" });
      }
    } catch {
      setMessage({ type: "error", text: "فشل رفع الصورة" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      localStorage.setItem("profile_" + session?.user?.email, JSON.stringify({ name, image }));
      logger.info("Student profile updated", { email: session?.user?.email, name });
      setMessage({ type: "success", text: "تم حفظ الملف الشخصي" });
    } catch {
      setMessage({ type: "error", text: "فشل حفظ الملف الشخصي" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] py-10">
      <div className="container max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            <h1 className="text-2xl font-bold">الملف الشخصي</h1>
          </div>

          <div className="rounded-2xl border bg-[hsl(var(--card))] p-6 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[hsl(var(--muted))] bg-[hsl(var(--muted))]">
                  <img src={image} alt={name} className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-1 right-1 p-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} ref={fileInputRef} hidden />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{uploading ? "جاري الرفع..." : "انقر على الكاميرا لتغيير الصورة"}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>الاسم</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(var(--muted))]/50 text-sm text-[hsl(var(--muted-foreground))]">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  {session?.user?.email || "—"}
                </div>
              </div>
            </div>

            {message && (
              <p className={`text-sm text-center ${message.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                {message.text}
              </p>
            )}

            <Button onClick={handleSave} className="w-full gap-2" disabled={saving}>
              <Save className="h-4 w-4" />{saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
