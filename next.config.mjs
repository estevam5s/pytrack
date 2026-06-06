/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Garante que as lições em markdown (lidas do disco em runtime) sejam
  // incluídas no bundle das funções serverless na Vercel.
  outputFileTracingIncludes: {
    "/conteudos/[modulo]/[licao]": ["./doc/Conteudos/**/*.md"],
    "/conteudos/[modulo]": ["./doc/Conteudos/**/*.md"],
  },
};

export default nextConfig;
