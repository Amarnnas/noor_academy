"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Trash2, Check, Mail } from "lucide-react";
import type { ContactMessage } from "@/types/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logger } from "@/lib/logger";

export default function DashboardMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      logger.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, { method: "PUT" });
      setMessages(messages.map((m) => m.id === id ? { ...m, read: true } : m));
    } catch (err) {
      logger.error("Failed to mark message read", err);
    }
  };

  const deleteMsg = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setMessages(messages.filter((m) => m.id !== id));
    } catch (err) {
      logger.error("Failed to delete message", err);
    }
  };

  if (loading) return <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الرسائل</h1>
      <div className="space-y-3">
        {messages.length === 0 && <p className="text-center py-12 text-[hsl(var(--muted-foreground))]">لا توجد رسائل</p>}
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
              <div className="flex items-center gap-1">
                <a href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 text-[hsl(var(--muted-foreground))] hover:text-green-600 transition-colors" aria-label="تواصل عبر واتساب">
                  <MessageSquare className="h-4 w-4" />
                </a>
                {!msg.read && (
                  <button onClick={() => markRead(msg.id)} className="p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/30 text-[hsl(var(--muted-foreground))] hover:text-teal-600 transition-colors" aria-label="تحديد كمقروء">
                    <Mail className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => deleteMsg(msg.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-[hsl(var(--muted-foreground))] hover:text-red-600 transition-colors" aria-label="حذف">
                  <Trash2 className="h-4 w-4" />
                </button>
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
