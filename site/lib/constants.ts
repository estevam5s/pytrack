// URL da plataforma (dashboard) — onde ficam login e cadastro reais.
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const LOGIN_URL = `${APP_URL}/auth/login`;
export const SIGNUP_URL = `${APP_URL}/auth/register`;

export const BRAND = {
  name: "PyTrack",
  tagline: "Python Learning Platform",
};

export const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Trilhas", href: "/trilhas" },
  { label: "Recursos", href: "/recursos" },
  { label: "Projetos", href: "/projetos" },
  { label: "Carreira", href: "/carreira" },
  { label: "Preços", href: "/precos" },
];
