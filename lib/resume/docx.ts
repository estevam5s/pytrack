import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import { TEMPLATES, type ResumeData } from "./types";

function hr(color: string) {
  return new Paragraph({
    border: { bottom: { color, space: 1, style: BorderStyle.SINGLE, size: 12 } },
    spacing: { after: 120 },
    children: [],
  });
}

function sectionTitle(text: string, color: string) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, color, size: 22, allCaps: true }),
    ],
    border: { bottom: { color, space: 1, style: BorderStyle.SINGLE, size: 8 } },
  });
}

const p = (children: TextRun[], opts: object = {}) => new Paragraph({ children, spacing: { after: 60 }, ...opts });

/** Gera um .docx NATIVO do Word a partir dos dados do currículo. Retorna Blob. */
export async function generateDocx(d: ResumeData, templateId: string): Promise<Blob> {
  const accent = (TEMPLATES.find((t) => t.id === templateId)?.accent ?? "#5F75F2").replace("#", "");
  const blocks: Paragraph[] = [];

  // cabeçalho
  blocks.push(
    new Paragraph({
      children: [new TextRun({ text: d.fullName || "Seu Nome", bold: true, size: 44 })],
      heading: HeadingLevel.TITLE,
    }),
  );
  if (d.headline) blocks.push(p([new TextRun({ text: d.headline, color: accent, bold: true, size: 26 })]));
  const contact = [d.email, d.phone, d.location, d.website, d.github, d.linkedin].filter(Boolean).join("  •  ");
  if (contact) blocks.push(p([new TextRun({ text: contact, size: 18, color: "555555" })]));
  blocks.push(hr(accent));

  if (d.summary) {
    blocks.push(sectionTitle("Resumo", accent));
    blocks.push(p([new TextRun({ text: d.summary, size: 20 })]));
  }
  if (d.skills.length) {
    blocks.push(sectionTitle("Habilidades", accent));
    blocks.push(p([new TextRun({ text: d.skills.join("  •  "), size: 20 })]));
  }
  if (d.experiences.length) {
    blocks.push(sectionTitle("Experiência", accent));
    for (const e of d.experiences) {
      blocks.push(
        new Paragraph({
          tabStops: [{ type: "right", position: 9000 }],
          children: [
            new TextRun({ text: e.role, bold: true, size: 21 }),
            new TextRun({ text: `\t${e.period}`, size: 18, color: "666666" }),
          ],
        }),
      );
      blocks.push(p([new TextRun({ text: e.company, italics: true, size: 19, color: "444444" })]));
      if (e.description) blocks.push(p([new TextRun({ text: e.description, size: 19 })]));
    }
  }
  if (d.education.length) {
    blocks.push(sectionTitle("Formação", accent));
    for (const e of d.education) {
      blocks.push(
        new Paragraph({
          tabStops: [{ type: "right", position: 9000 }],
          children: [
            new TextRun({ text: e.course, bold: true, size: 21 }),
            new TextRun({ text: `\t${e.period}`, size: 18, color: "666666" }),
          ],
        }),
      );
      blocks.push(p([new TextRun({ text: e.institution, italics: true, size: 19, color: "444444" })]));
    }
  }
  if (d.projects.length) {
    blocks.push(sectionTitle("Projetos", accent));
    for (const pr of d.projects) {
      blocks.push(p([new TextRun({ text: pr.name, bold: true, size: 20 }), ...(pr.url ? [new TextRun({ text: ` — ${pr.url}`, color: accent, size: 18 })] : [])]));
      if (pr.description) blocks.push(p([new TextRun({ text: pr.description, size: 19 })]));
    }
  }
  if (d.languages.length) {
    blocks.push(sectionTitle("Idiomas", accent));
    blocks.push(p([new TextRun({ text: d.languages.join("  •  "), size: 20 })]));
  }

  const doc = new Document({
    sections: [{ properties: {}, children: blocks }],
    styles: { default: { document: { run: { font: "Calibri" } } } },
  });
  return Packer.toBlob(doc);
}
