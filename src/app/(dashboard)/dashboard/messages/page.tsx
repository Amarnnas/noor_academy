"use client";

import { MessageSquare } from "lucide-react";
import { ContactMessage } from "@/types/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const messages: ContactMessage[] = [
  { id: "1", name: "فهد العنزي", email: "fahad@test.com", phone: "+966501234567", message: "أرغب في الاستفسار عن دورات اللغة الإنجليزية للأطفال، هل تتوفر لديكم؟", createdAt: "2026-06-01", read: false },
  { id: "2", name: "منيرة الدوسري", email: "muneera@test.com", phone: "+966551234567", message: "هل يوجد خصومات للتسجيل المبكر في دورات الصيف؟", createdAt: "2026-05-31", read: false },
  { id: "3", name: "خالد الزهراني", email: "khaled@test.com", phone: "+966509998877", message: "أود الاستفسار عن إمكانية الحصول على شهادة معتمدة بعد إتمام الدورة.", createdAt: "2026-05-30", read: true },
];

export default function DashboardMessagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الرسائل</h1>
      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`rounded-2xl border bg-[hsl(var(--card))] p-5 ${!msg.read ? "border-teal-300 dark:border-teal-700" : ""}`}>
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs">{msg.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">{msg.name}</h3>
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-teal-500" />}
                </div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{msg.email} - {msg.phone}</div>
              </div>
              <div className="flex items-center gap-2">
                <a href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 text-[hsl(var(--muted-foreground))] hover:text-green-600 transition-colors" aria-label="تواصل عبر واتساب">
                  <MessageSquare className="h-4 w-4" />
                </a>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{msg.createdAt}</span>
              </div>
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
