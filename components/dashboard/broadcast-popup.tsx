"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, X, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Notif {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  type: string;
}

// Mostra como POPUP o aviso (broadcast) ainda não visto. Marca popup_seen ao fechar.
export function BroadcastPopup() {
  const [notif, setNotif] = useState<Notif | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("notifications")
        .select("id, title, body, link, type")
        .eq("user_id", user.id)
        .eq("is_broadcast", true)
        .eq("popup_seen", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setNotif(data as Notif);
    })();
  }, []);

  async function dismiss() {
    if (notif) {
      const supabase = createClient();
      await supabase.from("notifications").update({ popup_seen: true }).eq("id", notif.id);
    }
    setNotif(null);
  }

  if (!notif) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-primary/30 bg-card shadow-2xl">
        <div className="bg-gradient-to-r from-primary to-primary-light p-5 text-white">
          <div className="flex items-start justify-between">
            <Megaphone className="h-7 w-7" />
            <button onClick={dismiss} aria-label="Fechar"><X className="h-5 w-5 opacity-80 hover:opacity-100" /></button>
          </div>
          <h2 className="mt-3 text-lg font-bold">{notif.title}</h2>
        </div>
        <div className="p-5">
          {notif.body && <p className="text-sm text-text-secondary">{notif.body}</p>}
          <div className="mt-4 flex items-center gap-2">
            {notif.link && (
              <Link href={notif.link} onClick={dismiss} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white">
                Ver agora <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <button onClick={dismiss} className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-foreground">
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
