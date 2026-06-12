// Mapa código alpha-2 → ISO 3166-1 numérico (3 dígitos), usado para casar
// com os ids do topojson world-atlas (countries-110m). Cobre os principais países.
export const ALPHA2_TO_NUMERIC: Record<string, string> = {
  BR: "076", US: "840", PT: "620", GB: "826", DE: "276", FR: "250", ES: "724", IT: "380",
  NL: "528", BE: "056", CH: "756", AT: "040", SE: "752", NO: "578", DK: "208", FI: "246",
  IE: "372", PL: "616", CZ: "203", RO: "642", HU: "348", GR: "300", UA: "804", RU: "643",
  TR: "792", CA: "124", MX: "484", AR: "032", CL: "152", CO: "170", PE: "604", VE: "862",
  EC: "218", BO: "068", PY: "600", UY: "858", CR: "188", PA: "591", GT: "320", DO: "214",
  CU: "192", HN: "340", SV: "222", NI: "558", AU: "036", NZ: "554", IN: "356", CN: "156",
  JP: "392", KR: "410", KP: "408", TW: "158", HK: "344", SG: "702", MY: "458", ID: "360",
  TH: "764", VN: "704", PH: "608", PK: "586", BD: "050", LK: "144", NP: "524", IR: "364",
  IQ: "368", SA: "682", AE: "784", IL: "376", QA: "634", KW: "414", JO: "400", LB: "422",
  EG: "818", MA: "504", DZ: "012", TN: "788", LY: "434", NG: "566", ZA: "710", KE: "404",
  GH: "288", ET: "231", TZ: "834", UG: "800", AO: "024", MZ: "508", CM: "120", CI: "384",
  SN: "686", ZW: "716", ZM: "894", CD: "180", SD: "729", RS: "688", HR: "191", BG: "100",
  SK: "703", SI: "705", LT: "440", LV: "428", EE: "233", IS: "352", LU: "442", MT: "470",
  CY: "196", AL: "008", MK: "807", BA: "070", ME: "499", BY: "112", MD: "498", GE: "268",
  AM: "051", AZ: "031", KZ: "398", UZ: "860", KG: "417", TJ: "762", TM: "795", MN: "496",
  AF: "004", MM: "104", KH: "116", LA: "418", BN: "096", PG: "598", FJ: "242", OM: "512",
  YE: "887", SY: "760", BH: "048", PS: "275", AO_: "024", CV: "132", GW: "624", ST: "678",
  TL: "626", AD: "020", MC: "492", LI: "438", SM: "674", VA: "336", GI: "292", FO: "234",
  GL: "304", PR: "630",
};

export function alpha2ToNumeric(code: string | null): string | null {
  if (!code) return null;
  return ALPHA2_TO_NUMERIC[code.toUpperCase()] ?? null;
}
