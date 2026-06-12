// Mapeia o país (ISO-2, do header geo da Vercel) para um dos idiomas suportados.
// Suportados: pt (padrão), en, es, zh-CN, ko.
export type GeoLang = "pt" | "en" | "es" | "zh-CN" | "ko";

const PT = new Set(["BR", "PT", "AO", "MZ", "CV", "GW", "ST", "TL"]);
const ES = new Set([
  "ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO",
  "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR",
]);
const KO = new Set(["KR", "KP"]);
const ZH = new Set(["CN", "TW", "HK", "MO", "SG"]);

export function langFromCountry(country: string | null | undefined): GeoLang {
  const c = (country ?? "").toUpperCase();
  if (!c) return "pt";
  if (PT.has(c)) return "pt";
  if (ES.has(c)) return "es";
  if (KO.has(c)) return "ko";
  if (ZH.has(c)) return "zh-CN";
  // demais países → inglês (idioma internacional padrão)
  return "en";
}
