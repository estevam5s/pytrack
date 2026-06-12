import { SectionHeader } from "@/components/site/section-header";
import { GradientText } from "@/components/site/gradient-text";

// tecnologias usadas para construir o site E a plataforma PyTrack
const STACK = [
  { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
  { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
  { name: "Supabase", icon: "https://cdn.simpleicons.org/supabase/3FCF8E" },
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
  { name: "Stripe", icon: "https://cdn.simpleicons.org/stripe/635BFF" },
  { name: "Vercel", icon: "https://cdn.simpleicons.org/vercel/FFFFFF" },
  { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
  { name: "Pyodide", icon: "https://cdn.simpleicons.org/webassembly/654FF0" },
  { name: "Framer Motion", icon: "https://cdn.simpleicons.org/framer/0055FF" },
  { name: "OpenAI", icon: "/tech/openai.svg" },
  { name: "NVIDIA", icon: "https://cdn.simpleicons.org/nvidia/76B900" },
  { name: "GitHub", icon: "https://cdn.simpleicons.org/github/FFFFFF" },
  { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
];

function Logo({ name, icon }: { name: string; icon: string }) {
  return (
    <div className="mx-5 flex shrink-0 items-center gap-2.5 opacity-70 transition-opacity hover:opacity-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt={name} width={28} height={28} className="h-7 w-7 object-contain" loading="lazy" />
      <span className="whitespace-nowrap text-sm font-medium text-text-secondary">{name}</span>
    </div>
  );
}

export function TechStackSection() {
  return (
    <section className="relative overflow-hidden py-20">
      {/* brilho de fundo (efeito sparkle sutil) */}
      <div className="pointer-events-none absolute inset-0 bg-grid radial-fade opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

      <div className="relative">
        <SectionHeader
          badge="Tecnologia"
          title={<>Construída com a <GradientText>melhor stack</GradientText> do mercado</>}
          description="O mesmo padrão de tecnologia usado por gigantes da indústria — performance, segurança e escala."
        />

        {/* marquee infinito de logos */}
        <div className="relative mt-12 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex animate-marquee">
            {[...STACK, ...STACK].map((t, i) => (
              <Logo key={`${t.name}-${i}`} {...t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
