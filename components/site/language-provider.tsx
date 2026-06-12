"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "pt" | "en" | "es" | "zh-CN" | "ko";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "zh-CN", label: "中文", flag: "🇨🇳" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
];

const LanguageContext = createContext<Ctx>({ lang: "pt", setLang: () => {} });

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: { TranslateElement: new (opts: object, id: string) => void };
    };
  }
}

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function setGoogTrans(value: string | null) {
  const host = window.location.hostname;
  for (const d of ["", host, "." + host]) {
    const dom = d ? `; domain=${d}` : "";
    document.cookie = value
      ? `googtrans=${value}; path=/${dom}`
      : `googtrans=; path=/${dom}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    const c = getCookie("googtrans");
    const cur = c?.split("/").pop();
    const known = ["en", "es", "zh-CN", "ko"];
    setLangState(cur && known.includes(cur) ? (cur as Lang) : "pt");

    if (document.getElementById("google-translate-script")) return;
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "pt", includedLanguages: "en,es,zh-CN,ko,pt", autoDisplay: false },
          "google_translate_element",
        );
      }
    };
    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // dispara a tradução pelo <select> oculto do Google (método confiável)
  function triggerCombo(target: Lang): boolean {
    const sel = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (!sel) return false;
    sel.value = target;
    sel.dispatchEvent(new Event("change"));
    return true;
  }

  const setLang = (l: Lang) => {
    setLangState(l);
    setGoogTrans(l === "pt" ? null : `/pt/${l}`);
    if (l === "pt") {
      // voltar ao original: recarrega sem o cookie
      window.location.reload();
      return;
    }
    // tenta disparar o combo; se o widget ainda não montou, espera e recarrega
    let tries = 0;
    const attempt = () => {
      if (triggerCombo(l)) return;
      if (tries++ < 25) setTimeout(attempt, 200);
      else window.location.reload();
    };
    attempt();
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {/* widget do Google: precisa estar no DOM (sr-only, não display:none) */}
      <div id="google_translate_element" className="sr-only" aria-hidden />
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
