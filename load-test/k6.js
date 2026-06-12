// Load testing da PyTrack com k6 (https://k6.io)
//
// Uso:
//   k6 run load-test/k6.js
//   k6 run -e BASE_URL=https://www.pytrack.com.br -e VUS=50 -e DURATION=2m load-test/k6.js
//
// Mede latência e erros nas rotas públicas (site, blog, lições SEO, status).
// NÃO testa rotas autenticadas (precisariam de sessão) — foque o gargalo no
// que escala primeiro: páginas públicas + assets.

import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "https://www.pytrack.com.br";
const VUS = Number(__ENV.VUS || 30);
const DURATION = __ENV.DURATION || "1m";

export const errorRate = new Rate("errors");
export const ttfb = new Trend("ttfb_ms");

export const options = {
  stages: [
    { duration: "30s", target: VUS },        // sobe
    { duration: DURATION, target: VUS },      // sustenta
    { duration: "20s", target: 0 },           // desce
  ],
  thresholds: {
    http_req_duration: ["p(95)<1500"], // 95% < 1.5s
    errors: ["rate<0.02"],             // < 2% de erro
  },
};

const PATHS = [
  "/",
  "/precos",
  "/trilhas",
  "/projetos",
  "/blog",
  "/blog/como-aprender-python-do-zero",
  "/aprender",
  "/status",
  "/sitemap.xml",
];

export default function () {
  const path = PATHS[Math.floor(Math.random() * PATHS.length)];
  const res = http.get(`${BASE_URL}${path}`);
  ttfb.add(res.timings.waiting);
  const ok = check(res, {
    "status 200": (r) => r.status === 200,
    "rápido (<2s)": (r) => r.timings.duration < 2000,
  });
  errorRate.add(!ok);
  sleep(Math.random() * 2 + 0.5);
}
