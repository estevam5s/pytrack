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
