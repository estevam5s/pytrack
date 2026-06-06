"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { reportContent } from "@/lib/community/actions";
import type { CommunityReportReason } from "@/types/community";

const REASONS: { value: CommunityReportReason; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "abuse", label: "Abuso / assédio" },
  { value: "offensive", label: "Conteúdo ofensivo" },
  { value: "misinformation", label: "Informação falsa" },
  { value: "other", label: "Outro" },
];

export function ReportDialog({
  open,
  onClose,
  postId,
  commentId,
}: {
  open: boolean;
  onClose: () => void;
  postId?: string;
  commentId?: string;
}) {
  const [reason, setReason] = useState<CommunityReportReason>("spam");
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  const submit = () => {
    start(async () => {
      await reportContent({ postId, commentId, reason, description });
      setDone(true);
      setTimeout(() => {
        onClose();
        setDone(false);
        setDescription("");
      }, 1200);
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Denunciar conteúdo</h3>
              <button onClick={onClose} className="text-text-secondary hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {done ? (
              <p className="py-6 text-center text-sm text-secondary">
                Denúncia enviada. Obrigado por ajudar a comunidade! ✅
              </p>
            ) : (
              <>
                <div className="mt-4 space-y-2">
                  {REASONS.map((r) => (
                    <label
                      key={r.value}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border p-2.5 text-sm"
                    >
                      <input
                        type="radio"
                        name="reason"
                        checked={reason === r.value}
                        onChange={() => setReason(r.value)}
                        className="accent-primary"
                      />
                      {r.label}
                    </label>
                  ))}
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes (opcional)"
                  rows={2}
                  className="mt-3 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/40"
                />
                <button
                  onClick={submit}
                  disabled={pending}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger/90 disabled:opacity-50"
                >
                  {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Enviar denúncia
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
