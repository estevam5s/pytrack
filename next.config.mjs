/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
  },
  // reduz o bundle (ícones/gráficos) → melhora LCP/INP (Core Web Vitals)
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  async headers() {
    // CSP só em produção (em dev, o HMR usa eval/ws://localhost).
    if (process.env.NODE_ENV !== "production") return [];

    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      // 'unsafe-eval' e jsdelivr são necessários para o Pyodide (Python no browser)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cdn.jsdelivr.net https://pypi.org https://files.pythonhosted.org https://api.stripe.com",
      "frame-src 'self' https://*.stripe.com https://js.stripe.com",
      "form-action 'self' https://*.supabase.co",
      "upgrade-insecure-requests",
    ].join("; ");

    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];

    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Garante que as lições em markdown (lidas do disco em runtime) sejam
  // incluídas no bundle das funções serverless na Vercel.
  outputFileTracingIncludes: {
    "/conteudos/[modulo]/[licao]": ["./doc/Conteudos/**/*.md"],
    "/conteudos/[modulo]": ["./doc/Conteudos/**/*.md"],
    "/aprender/[licao]": ["./doc/Conteudos/**/*.md"],
    "/aprender": ["./doc/Conteudos/**/*.md"],
  },
};

export default nextConfig;
