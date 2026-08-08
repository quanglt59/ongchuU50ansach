"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteContactMessage, getAllContactMessages } from "@/lib/contact";
import type { ContactMessage } from "@/lib/types";

export default function ContactMessageTable() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllContactMessages()
      .then(setMessages)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(message: ContactMessage) {
    if (!confirm(`Xoá liên hệ từ "${message.name}"?`)) return;
    await deleteContactMessage(message.id);
    setMessages((prev) => prev.filter((m) => m.id !== message.id));
  }

  if (loading) return <p className="text-brand-500">Đang tải...</p>;
  if (messages.length === 0) return <p className="text-brand-500">Chưa có liên hệ nào.</p>;

  return (
    <div className="flex flex-col gap-3">
      {messages.map((m) => (
        <div key={m.id} className="rounded-xl border border-brand-100 bg-cream-50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-brand-800">{m.name}</p>
              <p className="text-sm text-brand-500">
                {m.phone}
                {m.email && ` · ${m.email}`} · {new Date(m.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
            <button
              onClick={() => handleDelete(m)}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
              aria-label="Xoá"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <p className="mt-2 text-sm text-brand-700">{m.content}</p>
        </div>
      ))}
    </div>
  );
}
