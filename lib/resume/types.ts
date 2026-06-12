export interface ResumeExperience {
  role: string;
  company: string;
  period: string;
  description: string;
}
export interface ResumeEducation {
  course: string;
  institution: string;
  period: string;
}
export interface ResumeProject {
  name: string;
  description: string;
  url?: string;
}
export interface ResumeData {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  languages: string[];
  photo?: string; // URL da foto de perfil (opcional)
}

export const EMPTY_RESUME: ResumeData = {
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  github: "",
  linkedin: "",
  summary: "",
  skills: [],
  experiences: [],
  education: [],
  projects: [],
  languages: [],
  photo: "",
};

// layout = estrutura visual real (não só cor)
export type ResumeLayout = "classic" | "sidebar-left" | "sidebar-right" | "header-band" | "minimal" | "timeline" | "two-column";
export type ResumeFont = "sans" | "serif" | "mono";

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  suprema: boolean; // true = exclusivo do plano Suprema
  accent: string;
  layout: ResumeLayout;
  font: ResumeFont;
}

export const TEMPLATES: ResumeTemplate[] = [
  // Gratuitos (Completo)
  { id: "classic", name: "Clássico", description: "Coluna única, cabeçalho com borda. Atemporal.", suprema: false, accent: "#5F75F2", layout: "classic", font: "sans" },
  { id: "modern", name: "Moderno", description: "Barra lateral colorida com contatos e skills.", suprema: false, accent: "#9956F6", layout: "sidebar-left", font: "sans" },
  { id: "minimal", name: "Minimalista", description: "Centrado, muito respiro e linhas finas.", suprema: false, accent: "#111827", layout: "minimal", font: "sans" },
  { id: "compact", name: "Compacto", description: "Denso, tudo em uma página. Para enxutos.", suprema: false, accent: "#0ea5e9", layout: "two-column", font: "sans" },
  { id: "timeline", name: "Linha do Tempo", description: "Experiência em timeline vertical com marcos.", suprema: false, accent: "#10b981", layout: "timeline", font: "sans" },
  // Suprema
  { id: "tech", name: "Tech Pro", description: "Cabeçalho escuro, fonte mono, foco em projetos.", suprema: true, accent: "#22d3ee", layout: "header-band", font: "mono" },
  { id: "executive", name: "Executivo", description: "Faixa sólida no topo, serifado e formal.", suprema: true, accent: "#1f2937", layout: "header-band", font: "serif" },
  { id: "creative", name: "Criativo", description: "Sidebar à direita, cores vivas e blocos.", suprema: true, accent: "#f59e0b", layout: "sidebar-right", font: "sans" },
  { id: "elegant", name: "Elegante", description: "Serifado, centrado e refinado. Sênior.", suprema: true, accent: "#7c3aed", layout: "minimal", font: "serif" },
  { id: "corporate", name: "Corporativo", description: "Duas colunas equilibradas, sóbrio e claro.", suprema: true, accent: "#0369a1", layout: "two-column", font: "serif" },
  { id: "designer", name: "Designer", description: "Sidebar colorida à esquerda, blocos com cor.", suprema: true, accent: "#ec4899", layout: "sidebar-left", font: "sans" },
  { id: "academic", name: "Acadêmico", description: "Clássico serifado, ideal para pesquisa/ensino.", suprema: true, accent: "#475569", layout: "classic", font: "serif" },
  // +9 novos templates
  { id: "neon", name: "Neon Dev", description: "Faixa escura com destaque ciano, foco em código.", suprema: true, accent: "#06b6d4", layout: "header-band", font: "mono" },
  { id: "sunset", name: "Sunset", description: "Sidebar quente (rosa/laranja), vibrante e jovem.", suprema: true, accent: "#fb7185", layout: "sidebar-left", font: "sans" },
  { id: "forest", name: "Forest", description: "Verde sóbrio, duas colunas, ar corporativo.", suprema: true, accent: "#16a34a", layout: "two-column", font: "sans" },
  { id: "royal", name: "Royal", description: "Roxo profundo serifado, elegante e premium.", suprema: true, accent: "#6d28d9", layout: "header-band", font: "serif" },
  { id: "mono", name: "Monocromático", description: "Preto e branco minimalista, foco no conteúdo.", suprema: true, accent: "#0a0a0a", layout: "minimal", font: "sans" },
  { id: "ocean", name: "Ocean", description: "Azul-marinho com sidebar à direita, confiável.", suprema: true, accent: "#0284c7", layout: "sidebar-right", font: "sans" },
  { id: "coral", name: "Coral", description: "Timeline com acento coral, moderno e leve.", suprema: true, accent: "#f97316", layout: "timeline", font: "sans" },
  { id: "slate", name: "Slate", description: "Cinza-ardósia corporativo, duas colunas serifado.", suprema: true, accent: "#334155", layout: "two-column", font: "serif" },
  { id: "gradient", name: "Gradiente", description: "Cabeçalho com faixa vibrante, criativo e atual.", suprema: true, accent: "#8b5cf6", layout: "header-band", font: "sans" },
];
