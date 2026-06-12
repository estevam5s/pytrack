import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PyTrack — Aprenda Python",
    short_name: "PyTrack",
    description:
      "Domine Python do básico à carreira: trilhas, exercícios com IA, IDE no navegador, projetos e comunidade.",
    start_url: "/inicio",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#09090B",
    theme_color: "#9956F6",
    lang: "pt-BR",
    categories: ["education", "productivity", "developer"],
    icons: [
      { src: "/icon.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "maskable" },
      { src: "/new-logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
