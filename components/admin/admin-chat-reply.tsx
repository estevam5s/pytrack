"use client";

import { useRef } from "react";
import { Send, Bot } from "lucide-react";
import { adminReplyChat, setChatStatus } from "@/app/(dashboard)/admin/chat/actions";

export function AdminChatReply({
  conversationId,
  status,
}: {
  conversationId: string;
  status: string;
}) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <div className="border-t border-border p-3">
      <form
        ref={ref}
        action={async (fd) => {
          await adminReplyChat(fd);
          ref.current?.reset();
        }}
        className="flex items-end gap-2"
      >
        <input type="hidden" name="conversation_id" value={conversationId} />
        <input
          name="body"
          required
          placeholder="Responder como suporte…"
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
          <Send className="h-4 w-4" />
        </button>
      </form>
      {status === "human" && (
        <form action={setChatStatus} className="mt-2">
          <input type="hidden" name="conversation_id" value={conversationId} />
          <input type="hidden" name="status" value="bot" />
          <button className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary hover:text-foreground">
            <Bot className="h-3 w-3" /> Devolver para a IA
          </button>
        </form>
      )}
    </div>
  );
}
