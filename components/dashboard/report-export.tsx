"use client";

import { useState } from "react";
import { FileText, FileJson, FileCode, FileType, Printer, FileDown, Loader2 } from "lucide-react";

interface Monthly { month: string; label: string; studyHours: number; activeDays: number; exercises: number }
interface AreaStat { area: string; pct: number }
interface Report {
  user: { name: string; email: string; memberSince: string; daysOnPlatform: number };
  activity: { streak: number; longestStreak: number; activeDays: number; studyHours: number; studySessions: number };
  practice: { exercisesCompleted: number; lastActivity: string | null };
  learning: { modulesStarted: number; modulesCompleted: number; avgProgress: number };
  badges: { total: number; names: string[] };
  monthly: Monthly[];
  aiSummary?: string;
  generatedAt: string;
}

function download(name: string, content: string | Blob, mime: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

// pares rótulo→valor (base de todos os formatos)
function rows(r: Report): [string, string | number][] {
  return [
    ["Nome", r.user.name],
    ["E-mail", r.user.email],
    ["Membro desde", r.user.memberSince],
    ["Dias na plataforma", r.user.daysOnPlatform],
    ["Sequência atual (streak)", `${r.activity.streak} dias`],
    ["Maior sequência", `${r.activity.longestStreak} dias`],
    ["Dias ativos", r.activity.activeDays],
    ["Horas de estudo", `${r.activity.studyHours}h`],
    ["Sessões de estudo", r.activity.studySessions],
    ["Exercícios concluídos", r.practice.exercisesCompleted],
    ["Última atividade", r.practice.lastActivity ?? "—"],
    ["Módulos iniciados", r.learning.modulesStarted],
    ["Módulos concluídos", r.learning.modulesCompleted],
    ["Progresso médio", `${r.learning.avgProgress}%`],
    ["Conquistas (badges)", r.badges.total],
  ];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// gráfico de barras em SVG puro (entra no PDF/print sem libs)
function svgBars(data: { label: string; value: number }[], color: string, unit = ""): string {
  const W = 640, H = 180, pad = 28, bw = data.length ? (W - pad * 2) / data.length : 0;
  const max = Math.max(1, ...data.map((d) => d.value));
  const bars = data.map((d, i) => {
    const h = Math.round((d.value / max) * (H - pad * 2));
    const x = pad + i * bw + bw * 0.18;
    const y = H - pad - h;
    const w = bw * 0.64;
    return `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="3" fill="${color}"/>
      <text x="${(x + w / 2).toFixed(1)}" y="${y - 4}" font-size="10" fill="#444" text-anchor="middle">${d.value}${unit}</text>
      <text x="${(x + w / 2).toFixed(1)}" y="${H - pad + 14}" font-size="10" fill="#888" text-anchor="middle">${esc(d.label)}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:640px"><line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="#e5e7eb"/>${bars}</svg>`;
}

// radar de proficiência por área (SVG puro p/ PDF)
function svgRadar(data: AreaStat[]): string {
  const filtered = data.slice(0, 8);
  if (filtered.length < 3) return svgBars(filtered.map((d) => ({ label: d.area, value: d.pct })), "#8234E9", "%");
  const size = 380, cx = size / 2, cy = size / 2, R = 120, n = filtered.length;
  const pt = (i: number, r: number): [number, number] => { const a = (i / n) * 2 * Math.PI - Math.PI / 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
  const rings = [0.25, 0.5, 0.75, 1].map((f) => `<polygon points="${filtered.map((_, i) => pt(i, R * f).join(",")).join(" ")}" fill="none" stroke="#e5e7eb"/>`).join("");
  const axes = filtered.map((d, i) => { const [x, y] = pt(i, R); const [lx, ly] = pt(i, R + 16); return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#eee"/><text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="9" fill="#555" text-anchor="middle">${esc(d.area.length > 14 ? d.area.slice(0, 13) + "…" : d.area)}</text>`; }).join("");
  const poly = filtered.map((d, i) => pt(i, R * Math.max(0, Math.min(1, d.pct / 100))).join(",")).join(" ");
  return `<svg viewBox="0 0 ${size} ${size}" width="360" style="display:block;margin:0 auto">${rings}${axes}<polygon points="${poly}" fill="rgba(130,52,233,0.30)" stroke="#8234E9" stroke-width="2"/></svg>`;
}

function toHtml(r: Report, areas: AreaStat[] = []): string {
  const tr = rows(r).map(([k, v]) => `<tr><td style="padding:8px 14px;border:1px solid #e5e7eb;color:#555">${esc(k)}</td><td style="padding:8px 14px;border:1px solid #e5e7eb;font-weight:600">${esc(String(v))}</td></tr>`).join("");
  const mtr = r.monthly.map((m) => `<tr><td style="padding:6px 12px;border:1px solid #e5e7eb">${esc(m.label)}</td><td style="padding:6px 12px;border:1px solid #e5e7eb;text-align:center">${m.studyHours}h</td><td style="padding:6px 12px;border:1px solid #e5e7eb;text-align:center">${m.activeDays}</td><td style="padding:6px 12px;border:1px solid #e5e7eb;text-align:center">${m.exercises}</td></tr>`).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Relatório de Evolução — PyTrack</title></head>
<body style="font-family:Arial,sans-serif;max-width:720px;margin:24px auto;color:#111">
  <div style="border-bottom:3px solid #8234E9;padding-bottom:12px;margin-bottom:20px">
    <h1 style="margin:0;color:#8234E9">🐍 Relatório de Evolução</h1>
    <p style="margin:4px 0 0;color:#666">PyTrack · gerado em ${new Date(r.generatedAt).toLocaleString("pt-BR")}</p>
  </div>
  ${r.aiSummary ? `<div style="background:#f5f3ff;border-left:4px solid #8234E9;padding:12px 16px;border-radius:6px;margin-bottom:18px"><p style="margin:0;font-size:11px;font-weight:700;color:#8234E9;text-transform:uppercase;letter-spacing:.5px">✨ Resumo da IA</p><p style="margin:6px 0 0;font-size:14px;line-height:1.55;color:#333">${esc(r.aiSummary)}</p></div>` : ""}
  <h2 style="font-size:16px">Resumo de ${esc(r.user.name)}</h2>
  <table style="border-collapse:collapse;width:100%">${tr}</table>

  <h2 style="font-size:16px;margin-top:24px">Evolução nos últimos 6 meses</h2>
  <p style="margin:0 0 4px;font-size:13px;color:#555">⏱️ Horas de estudo por mês</p>
  ${svgBars(r.monthly.map((m) => ({ label: m.label, value: m.studyHours })), "#8234E9", "h")}
  <p style="margin:14px 0 4px;font-size:13px;color:#555">✅ Exercícios concluídos por mês</p>
  ${svgBars(r.monthly.map((m) => ({ label: m.label, value: m.exercises })), "#10b981")}
  <table style="border-collapse:collapse;width:100%;margin-top:14px;font-size:13px">
    <tr style="background:#f5f3ff"><th style="padding:6px 12px;border:1px solid #e5e7eb;text-align:left">Mês</th><th style="padding:6px 12px;border:1px solid #e5e7eb">Estudo</th><th style="padding:6px 12px;border:1px solid #e5e7eb">Dias ativos</th><th style="padding:6px 12px;border:1px solid #e5e7eb">Exercícios</th></tr>
    ${mtr}
  </table>

  ${areas.length >= 3 ? `<h2 style="font-size:16px;margin-top:24px">Proficiência por área (ecossistema Python)</h2>${svgRadar(areas)}
  <table style="border-collapse:collapse;width:100%;margin-top:10px;font-size:13px">${areas.slice(0, 10).map((a) => `<tr><td style="padding:5px 12px;border:1px solid #e5e7eb">${esc(a.area)}</td><td style="padding:5px 12px;border:1px solid #e5e7eb;text-align:right;font-weight:600">${a.pct}%</td></tr>`).join("")}</table>` : ""}

  ${r.badges.names.length ? `<h2 style="font-size:16px;margin-top:20px">Conquistas</h2><p>${r.badges.names.map(esc).join(" · ")}</p>` : ""}
  <p style="margin-top:28px;font-size:12px;color:#888">Relatório gerado automaticamente pela PyTrack — www.pytrack.com.br</p>
</body></html>`;
}

function toTxt(r: Report, areas: AreaStat[] = []): string {
  const lines = ["RELATÓRIO DE EVOLUÇÃO — PyTrack", `Gerado em ${new Date(r.generatedAt).toLocaleString("pt-BR")}`, "=".repeat(44), ""];
  if (r.aiSummary) lines.push("RESUMO DA IA:", r.aiSummary, "");
  for (const [k, v] of rows(r)) lines.push(`${k}: ${v}`);
  lines.push("", "EVOLUÇÃO MÊS A MÊS", "Mês     | Estudo | Dias | Exercícios");
  for (const m of r.monthly) lines.push(`${m.label.padEnd(7)} | ${String(m.studyHours + "h").padEnd(6)} | ${String(m.activeDays).padEnd(4)} | ${m.exercises}`);
  if (areas.length) { lines.push("", "PROFICIÊNCIA POR ÁREA"); for (const a of areas) lines.push(`${a.area.padEnd(24)} ${a.pct}%`); }
  if (r.badges.names.length) lines.push("", "Conquistas: " + r.badges.names.join(", "));
  lines.push("", "PyTrack — www.pytrack.com.br");
  return lines.join("\n");
}

function toXml(r: Report, areas: AreaStat[] = []): string {
  const tag = (k: string, v: string | number) => `  <item label="${esc(k)}">${esc(String(v))}</item>`;
  const months = r.monthly.map((m) => `    <mes label="${esc(m.label)}" estudoHoras="${m.studyHours}" diasAtivos="${m.activeDays}" exercicios="${m.exercises}"/>`).join("\n");
  const areasXml = areas.map((a) => `    <area nome="${esc(a.area)}" proficiencia="${a.pct}"/>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<relatorioEvolucao geradoEm="${r.generatedAt}">\n${rows(r).map(([k, v]) => tag(k, v)).join("\n")}\n  <evolucaoMensal>\n${months}\n  </evolucaoMensal>\n  <proficienciaPorArea>\n${areasXml}\n  </proficienciaPorArea>\n  <conquistas>${r.badges.names.map((n) => `<badge>${esc(n)}</badge>`).join("")}</conquistas>\n</relatorioEvolucao>`;
}

const BTN = "inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary transition-colors hover:text-foreground hover:border-primary/40";

export function ReportExport({ report, areas = [] }: { report: Report; areas?: AreaStat[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const base = `relatorio-evolucao-${report.user.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  function pdf() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(toHtml(report, areas) + "<script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script>");
    w.document.close();
  }
  async function docx() {
    setBusy("docx");
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } = await import("docx");
      const tableRows = rows(report).map(([k, v]) => new TableRow({ children: [
        new TableCell({ children: [new Paragraph(String(k))], width: { size: 50, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(v), bold: true })] })], width: { size: 50, type: WidthType.PERCENTAGE } }),
      ] }));
      const cell = (t: string, bold = false) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t, bold })] })] });
      const monthlyRows = [
        new TableRow({ children: [cell("Mês", true), cell("Estudo", true), cell("Dias ativos", true), cell("Exercícios", true)] }),
        ...report.monthly.map((m) => new TableRow({ children: [cell(m.label), cell(`${m.studyHours}h`), cell(String(m.activeDays)), cell(String(m.exercises))] })),
      ];
      const doc = new Document({ sections: [{ children: [
        new Paragraph({ text: "Relatório de Evolução — PyTrack", heading: HeadingLevel.HEADING_1 }),
        new Paragraph(`Gerado em ${new Date(report.generatedAt).toLocaleString("pt-BR")}`),
        new Paragraph({ text: `Resumo de ${report.user.name}`, heading: HeadingLevel.HEADING_2 }),
        new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } }),
        new Paragraph({ text: "Evolução nos últimos 6 meses", heading: HeadingLevel.HEADING_2 }),
        new Table({ rows: monthlyRows, width: { size: 100, type: WidthType.PERCENTAGE } }),
      ] }] });
      const blob = await Packer.toBlob(doc);
      download(`${base}.docx`, blob, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    } catch { /* fallback */ }
    setBusy(null);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={pdf} className={BTN}><Printer className="h-4 w-4" /> PDF</button>
      <button onClick={() => download(`${base}.doc`, toHtml(report, areas), "application/msword")} className={BTN}><FileText className="h-4 w-4" /> DOC</button>
      <button onClick={docx} disabled={busy === "docx"} className={BTN}>{busy === "docx" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />} DOCX</button>
      <button onClick={() => download(`${base}.txt`, toTxt(report, areas), "text/plain;charset=utf-8")} className={BTN}><FileType className="h-4 w-4" /> TXT</button>
      <button onClick={() => download(`${base}.json`, JSON.stringify({ ...report, areas }, null, 2), "application/json")} className={BTN}><FileJson className="h-4 w-4" /> JSON</button>
      <button onClick={() => download(`${base}.xml`, toXml(report, areas), "application/xml")} className={BTN}><FileCode className="h-4 w-4" /> XML</button>
    </div>
  );
}
