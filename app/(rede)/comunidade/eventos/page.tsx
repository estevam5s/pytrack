import { redirect } from "next/navigation";
import { Calendar, MapPin, Video, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CreateEventButton, AttendButton, DeleteEventButton } from "@/components/rede/events-client";

export const metadata = { title: "Eventos · PyTrack Rede" };
export const dynamic = "force-dynamic";

export default async function EventosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const admin = createAdminClient();
  const { data: events } = await admin
    .from("community_events")
    .select("*")
    .gte("starts_at", new Date(Date.now() - 86400000 * 2).toISOString())
    .order("starts_at", { ascending: true })
    .limit(40);

  const ids = (events ?? []).map((e) => e.id);
  const [{ data: att }, { data: mine }] = await Promise.all([
    ids.length ? admin.from("community_event_attendees").select("event_id").in("event_id", ids) : Promise.resolve({ data: [] }),
    ids.length ? admin.from("community_event_attendees").select("event_id").eq("user_id", user.id).in("event_id", ids) : Promise.resolve({ data: [] }),
  ]);
  const counts = new Map<string, number>();
  for (const a of att ?? []) counts.set(a.event_id as string, (counts.get(a.event_id as string) ?? 0) + 1);
  const attendingSet = new Set((mine ?? []).map((a) => a.event_id as string));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight"><Calendar className="h-6 w-6 text-primary-light" /> Eventos</h1>
          <p className="text-sm text-text-secondary">Encontros, lives e workshops da comunidade Python.</p>
        </div>
        <CreateEventButton />
      </div>

      {!events || events.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-text-secondary">Nenhum evento agendado. Crie o primeiro!</div>
      ) : (
        <div className="space-y-3">
          {events.map((e) => {
            const start = new Date(e.starts_at as string);
            return (
              <div key={e.id} className="overflow-hidden rounded-xl border border-border bg-card">
                {e.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.cover_url as string} alt="" className="h-36 w-full object-cover" />
                ) : null}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase text-primary-light">{start.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })} · {start.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
                      <h3 className="mt-0.5 text-lg font-bold">{e.title as string}</h3>
                    </div>
                    {e.creator_id === user.id && <DeleteEventButton eventId={e.id as string} />}
                  </div>
                  {e.description ? <p className="mt-1 whitespace-pre-line text-sm text-text-secondary">{e.description as string}</p> : null}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
                    {e.is_online ? <span className="inline-flex items-center gap-1"><Video className="h-3.5 w-3.5" /> Online{e.online_url ? "" : ""}</span> : null}
                    {e.location ? <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.location as string}</span> : null}
                    {e.ends_at ? <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> até {new Date(e.ends_at as string).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span> : null}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <AttendButton eventId={e.id as string} attending={attendingSet.has(e.id as string)} count={counts.get(e.id as string) ?? 0} />
                    {e.is_online && e.online_url ? <a href={e.online_url as string} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-primary/40">Entrar</a> : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
