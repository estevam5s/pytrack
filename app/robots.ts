import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://plataforma-python.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/aprender", "/sobre", "/trilhas", "/recursos", "/projetos", "/carreira", "/precos"],
        disallow: [
          "/api/",
          "/inicio",
          "/configuracoes",
          "/comunidade",
          "/conteudos",
          "/exercicios",
          "/ide",
          "/evolucao",
          "/stack",
          "/perfil",
          "/meus-projetos",
          "/minha-carreira",
          "/vagas",
          "/aulas-udemy",
          "/aulas-youtube",
          "/material",
          "/livros",
          "/especializacoes",
          "/perguntas-carreira-python",
          "/consultor-ia",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
