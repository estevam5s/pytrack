import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderResume } from "@/lib/resume/render";
import type { ResumeData } from "@/lib/resume/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data } = await admin.from("resumes").select("title, data, is_public").eq("id", id).maybeSingle();
  if (!data?.is_public) return { title: "Currículo · PyTrack" };
  const d = data.data as ResumeData;
  return {
    title: `${d.fullName || data.title} · Currículo`,
    description: d.headline || "Currículo profissional criado na PyTrack.",
    openGraph: { title: `${d.fullName || data.title}`, description: d.headline || "", images: d.photo ? [d.photo] : [] },
  };
}

export default async function PublicResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data } = await admin.from("resumes").select("template, data, is_public").eq("id", id).maybeSingle();
  if (!data || !data.is_public) notFound();

  const htmlDoc = renderResume(data.data as ResumeData, data.template as string);

  return (
    <div style={{ minHeight: "100vh", background: "#e5e7eb", padding: "24px 0" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", background: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,.15)" }}
        dangerouslySetInnerHTML={{ __html: extractBody(htmlDoc) }} />
      <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#6b7280" }}>
        Criado com <a href="https://www.pytrack.com.br" style={{ color: "#7c3aed" }}>PyTrack</a> 🐍
      </p>
    </div>
  );
}

// renderResume devolve um documento HTML completo; extraímos só o conteúdo do body.
function extractBody(doc: string): string {
  const m = doc.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return m ? m[1] : doc;
}
