import Link from "next/link";
import { Megaphone, ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/lib/data/site-settings";

const TONE: Record<string, { bg: string; text: string }> = {
  info: { bg: "from-primary to-primary-light", text: "text-white" },
  success: { bg: "from-green to-emerald-500", text: "text-black" },
  warning: { bg: "from-amber-500 to-orange-500", text: "text-black" },
};

/** Banner de aviso/anúncio no topo do site — controlado em /admin/site. */
export async function AnnouncementBanner() {
  const s = await getSiteSettings();
  if (!s.announcement) return null;
  const tone = TONE[s.announcement_type ?? "info"] ?? TONE.info;

  const inner = (
    <span className="flex items-center justify-center gap-2 text-sm font-medium">
      <Megaphone className="h-4 w-4 shrink-0" />
      <span>{s.announcement}</span>
      {s.announcement_link && <ArrowRight className="h-4 w-4 shrink-0" />}
    </span>
  );

  return (
    <div className={`bg-gradient-to-r ${tone.bg} ${tone.text} px-4 py-2`}>
      {s.announcement_link ? (
        <Link href={s.announcement_link} className="block hover:opacity-90">{inner}</Link>
      ) : (
        inner
      )}
    </div>
  );
}
