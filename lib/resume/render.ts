import { TEMPLATES, type ResumeData, type ResumeFont } from "./types";

function esc(s: string) {
  return (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
const nl = (s: string) => esc(s).replace(/\n/g, "<br/>");

const FONT: Record<ResumeFont, string> = {
  sans: "Arial, Helvetica, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "'SF Mono', 'Courier New', monospace",
};

const contacts = (d: ResumeData) =>
  [d.email, d.phone, d.location, d.website, d.github, d.linkedin].filter(Boolean);

// ——— blocos reutilizáveis ———
function expBlock(d: ResumeData, accent: string) {
  return d.experiences
    .map(
      (e) =>
        `<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;align-items:baseline"><strong style="font-size:14px">${esc(e.role)}</strong><span style="color:#666;font-size:11px">${esc(e.period)}</span></div><div style="color:${accent};font-size:12.5px;font-weight:600">${esc(e.company)}</div>${e.description ? `<div style="font-size:12.5px;margin-top:2px;color:#333">${nl(e.description)}</div>` : ""}</div>`,
    )
    .join("");
}
function eduBlock(d: ResumeData) {
  return d.education
    .map(
      (e) =>
        `<div style="margin-bottom:7px"><div style="display:flex;justify-content:space-between"><strong style="font-size:13px">${esc(e.course)}</strong><span style="color:#666;font-size:11px">${esc(e.period)}</span></div><div style="color:#555;font-size:12.5px">${esc(e.institution)}</div></div>`,
    )
    .join("");
}
function projBlock(d: ResumeData, accent: string) {
  return d.projects
    .map(
      (p) =>
        `<div style="margin-bottom:7px"><strong style="font-size:13px">${esc(p.name)}</strong>${p.url ? ` — <a href="${esc(p.url)}" style="color:${accent}">${esc(p.url)}</a>` : ""}${p.description ? `<div style="font-size:12.5px;color:#333">${nl(p.description)}</div>` : ""}</div>`,
    )
    .join("");
}
function chips(items: string[], accent: string) {
  return `<div style="display:flex;flex-wrap:wrap;gap:5px">${items.map((s) => `<span style="background:${accent}1a;color:${accent};border:1px solid ${accent}44;border-radius:999px;padding:2px 9px;font-size:11px">${esc(s)}</span>`).join("")}</div>`;
}

function html(title: string, font: ResumeFont, inner: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title || "Currículo")}</title></head>
  <body style="margin:0;font-family:${FONT[font]};color:#222;background:#fff;line-height:1.45">${inner}</body></html>`;
}

/** Renderiza o currículo com LAYOUT distinto conforme o template (não só cor). */
export function renderResume(d: ResumeData, templateId: string): string {
  const t = TEMPLATES.find((x) => x.id === templateId) ?? TEMPLATES[0];
  const a = t.accent;
  const name = esc(d.fullName || "Seu Nome");
  const head = esc(d.headline);
  const photoUrl = (d.photo || "").trim();
  const photo = (size: number, border = "#fff") =>
    photoUrl ? `<img src="${esc(photoUrl)}" alt="${name}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;border:3px solid ${border};display:block" />` : "";

  const H = (txt: string, color = a) =>
    `<h2 style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:${color};margin:16px 0 7px;font-weight:700">${esc(txt)}</h2>`;
  const HR = (color = a) => `<div style="height:2px;background:${color};margin-bottom:8px"></div>`;

  const summary = d.summary ? `<p style="font-size:12.5px;margin:0;color:#333">${nl(d.summary)}</p>` : "";
  const exp = expBlock(d, a);
  const edu = eduBlock(d);
  const proj = projBlock(d, a);
  const langs = d.languages.length ? `<p style="font-size:12.5px;margin:0">${d.languages.map(esc).join(" · ")}</p>` : "";

  // ——— sidebar-left / sidebar-right ———
  if (t.layout === "sidebar-left" || t.layout === "sidebar-right") {
    const sidebar = `
      <div style="background:${a};color:#fff;padding:28px 20px;width:230px;box-sizing:border-box">
        ${photoUrl ? `<div style="margin:0 auto 14px;width:max-content">${photo(96, "rgba(255,255,255,.5)")}</div>` : ""}
        <h1 style="margin:0;font-size:22px;line-height:1.15">${name}</h1>
        ${head ? `<p style="margin:6px 0 0;font-size:13px;opacity:.92">${head}</p>` : ""}
        <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:22px 0 6px;opacity:.85">Contato</h3>
        ${contacts(d).map((c) => `<p style="margin:3px 0;font-size:11.5px;word-break:break-word;opacity:.95">${esc(c)}</p>`).join("")}
        ${d.skills.length ? `<h3 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:22px 0 6px;opacity:.85">Habilidades</h3>${d.skills.map((s) => `<p style="margin:3px 0;font-size:11.5px;opacity:.95">▹ ${esc(s)}</p>`).join("")}` : ""}
        ${d.languages.length ? `<h3 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:22px 0 6px;opacity:.85">Idiomas</h3>${d.languages.map((s) => `<p style="margin:3px 0;font-size:11.5px;opacity:.95">${esc(s)}</p>`).join("")}` : ""}
      </div>`;
    const main = `
      <div style="padding:28px 26px;flex:1;box-sizing:border-box">
        ${summary ? `${H("Resumo")}${summary}` : ""}
        ${exp ? `${H("Experiência")}${exp}` : ""}
        ${edu ? `${H("Formação")}${edu}` : ""}
        ${proj ? `${H("Projetos")}${proj}` : ""}
      </div>`;
    const order = t.layout === "sidebar-left" ? sidebar + main : main + sidebar;
    return html(d.fullName, t.font, `<div style="display:flex;max-width:780px;margin:0 auto;min-height:1000px">${order}</div>`);
  }

  // ——— header-band (faixa colorida no topo) ———
  if (t.layout === "header-band") {
    const dark = t.font === "mono";
    return html(d.fullName, t.font, `
      <div style="max-width:780px;margin:0 auto">
        <header style="background:${dark ? "#0f172a" : a};color:#fff;padding:32px 36px;display:flex;align-items:center;gap:22px">
          ${photoUrl ? `<div style="flex-shrink:0">${photo(88, "rgba(255,255,255,.4)")}</div>` : ""}
          <div>
            <h1 style="margin:0;font-size:28px">${name}</h1>
            ${head ? `<p style="margin:4px 0 0;font-size:15px;opacity:.9;color:${dark ? a : "#fff"}">${head}</p>` : ""}
            <p style="margin:12px 0 0;font-size:12px;opacity:.85">${contacts(d).map(esc).join("  ·  ")}</p>
          </div>
        </header>
        <div style="padding:26px 36px">
          ${summary ? `${H("Resumo")}${HR()}${summary}` : ""}
          ${d.skills.length ? `${H("Stack / Habilidades")}${HR()}${chips(d.skills, a)}` : ""}
          ${exp ? `${H("Experiência")}${HR()}${exp}` : ""}
          ${proj ? `${H("Projetos")}${HR()}${proj}` : ""}
          ${edu ? `${H("Formação")}${HR()}${edu}` : ""}
          ${langs ? `${H("Idiomas")}${HR()}${langs}` : ""}
        </div>
      </div>`);
  }

  // ——— two-column ———
  if (t.layout === "two-column") {
    return html(d.fullName, t.font, `
      <div style="max-width:790px;margin:0 auto;padding:30px 34px">
        <header style="text-align:center;border-bottom:3px solid ${a};padding-bottom:12px;margin-bottom:14px">
          <h1 style="margin:0;font-size:26px">${name}</h1>
          ${head ? `<p style="margin:3px 0 0;font-size:14px;color:${a};font-weight:600">${head}</p>` : ""}
          <p style="margin:7px 0 0;font-size:11.5px;color:#555">${contacts(d).map(esc).join("  ·  ")}</p>
        </header>
        ${summary ? `<div style="margin-bottom:12px">${summary}</div>` : ""}
        <div style="display:flex;gap:26px">
          <div style="flex:1.4">
            ${exp ? `${H("Experiência")}${exp}` : ""}
            ${proj ? `${H("Projetos")}${proj}` : ""}
          </div>
          <div style="flex:1">
            ${d.skills.length ? `${H("Habilidades")}${chips(d.skills, a)}` : ""}
            ${edu ? `${H("Formação")}${edu}` : ""}
            ${langs ? `${H("Idiomas")}${langs}` : ""}
          </div>
        </div>
      </div>`);
  }

  // ——— timeline ———
  if (t.layout === "timeline") {
    const timeline = d.experiences
      .map(
        (e) =>
          `<div style="position:relative;padding-left:22px;margin-bottom:13px">
            <span style="position:absolute;left:0;top:4px;width:10px;height:10px;border-radius:50%;background:${a};box-shadow:0 0 0 3px ${a}33"></span>
            <span style="position:absolute;left:4.5px;top:14px;bottom:-13px;width:1px;background:${a}55"></span>
            <div style="display:flex;justify-content:space-between"><strong style="font-size:14px">${esc(e.role)}</strong><span style="color:#666;font-size:11px">${esc(e.period)}</span></div>
            <div style="color:${a};font-size:12.5px;font-weight:600">${esc(e.company)}</div>
            ${e.description ? `<div style="font-size:12.5px;color:#333;margin-top:2px">${nl(e.description)}</div>` : ""}
          </div>`,
      )
      .join("");
    return html(d.fullName, t.font, `
      <div style="max-width:760px;margin:0 auto;padding:32px 36px">
        <header style="border-left:5px solid ${a};padding-left:14px;margin-bottom:16px">
          <h1 style="margin:0;font-size:27px">${name}</h1>
          ${head ? `<p style="margin:2px 0 0;font-size:14px;color:${a};font-weight:600">${head}</p>` : ""}
          <p style="margin:6px 0 0;font-size:11.5px;color:#555">${contacts(d).map(esc).join("  ·  ")}</p>
        </header>
        ${summary ? `${H("Resumo")}${summary}` : ""}
        ${timeline ? `${H("Trajetória")}${timeline}` : ""}
        ${d.skills.length ? `${H("Habilidades")}${chips(d.skills, a)}` : ""}
        ${edu ? `${H("Formação")}${edu}` : ""}
        ${proj ? `${H("Projetos")}${proj}` : ""}
        ${langs ? `${H("Idiomas")}${langs}` : ""}
      </div>`);
  }

  // ——— minimal ———
  if (t.layout === "minimal") {
    return html(d.fullName, t.font, `
      <div style="max-width:720px;margin:0 auto;padding:48px 50px">
        <header style="text-align:center;margin-bottom:26px">
          <h1 style="margin:0;font-size:30px;letter-spacing:1px;font-weight:400">${name}</h1>
          ${head ? `<p style="margin:6px 0 0;font-size:14px;color:#666;letter-spacing:2px;text-transform:uppercase">${head}</p>` : ""}
          <p style="margin:12px 0 0;font-size:11.5px;color:#888">${contacts(d).map(esc).join("   |   ")}</p>
        </header>
        ${summary ? `<p style="text-align:center;font-size:13px;color:#444;max-width:560px;margin:0 auto 24px">${nl(d.summary)}</p>` : ""}
        ${exp ? `<div style="text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${a};margin:20px 0 10px">Experiência</div>${exp}` : ""}
        ${edu ? `<div style="text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${a};margin:20px 0 10px">Formação</div>${edu}` : ""}
        ${d.skills.length ? `<div style="text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${a};margin:20px 0 10px">Habilidades</div><p style="text-align:center;font-size:12.5px;color:#444">${d.skills.map(esc).join("  ·  ")}</p>` : ""}
        ${proj ? `<div style="text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${a};margin:20px 0 10px">Projetos</div>${proj}` : ""}
      </div>`);
  }

  // ——— classic (padrão) ———
  return html(d.fullName, t.font, `
    <div style="max-width:760px;margin:0 auto;padding:34px 38px">
      <header style="border-bottom:3px solid ${a};padding-bottom:12px">
        <h1 style="margin:0;font-size:27px">${name}</h1>
        ${head ? `<p style="margin:2px 0 0;font-size:15px;color:${a};font-weight:600">${head}</p>` : ""}
        <p style="margin:7px 0 0;font-size:12px;color:#555">${contacts(d).map(esc).join("  ·  ")}</p>
      </header>
      ${summary ? `${H("Resumo")}${summary}` : ""}
      ${d.skills.length ? `${H("Habilidades")}${chips(d.skills, a)}` : ""}
      ${exp ? `${H("Experiência")}${exp}` : ""}
      ${edu ? `${H("Formação")}${edu}` : ""}
      ${proj ? `${H("Projetos")}${proj}` : ""}
      ${langs ? `${H("Idiomas")}${langs}` : ""}
    </div>`);
}

/** Versão texto puro (TXT). */
export function renderResumeText(d: ResumeData): string {
  const L: string[] = [];
  L.push(d.fullName || "Seu Nome");
  if (d.headline) L.push(d.headline);
  L.push([d.email, d.phone, d.location, d.website, d.github, d.linkedin].filter(Boolean).join(" | "));
  L.push("");
  if (d.summary) { L.push("RESUMO", d.summary, ""); }
  if (d.skills.length) { L.push("HABILIDADES", d.skills.join(", "), ""); }
  if (d.experiences.length) {
    L.push("EXPERIÊNCIA");
    d.experiences.forEach((e) => L.push(`- ${e.role} | ${e.company} (${e.period})`, `  ${e.description}`));
    L.push("");
  }
  if (d.education.length) {
    L.push("FORMAÇÃO");
    d.education.forEach((e) => L.push(`- ${e.course} | ${e.institution} (${e.period})`));
    L.push("");
  }
  if (d.projects.length) {
    L.push("PROJETOS");
    d.projects.forEach((p) => L.push(`- ${p.name}${p.url ? ` (${p.url})` : ""}`, `  ${p.description}`));
    L.push("");
  }
  if (d.languages.length) L.push("IDIOMAS", d.languages.join(", "));
  return L.join("\n");
}
