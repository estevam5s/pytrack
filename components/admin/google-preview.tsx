import { Globe } from "lucide-react";

/** Mini-preview de como o site aparece nos resultados do Google (com sitelinks). */
export function GooglePreview({
  title,
  url,
  description,
}: {
  title: string;
  url: string;
  description: string;
}) {
  const sitelinks = [
    { name: "Trilhas", href: "/trilhas", desc: "16 trilhas de Python por objetivo." },
    { name: "Preços", href: "/precos", desc: "Planos a partir de R$10/mês, 7 dias grátis." },
    { name: "Projetos", href: "/projetos", desc: "Projetos reais para portfólio." },
    { name: "Blog", href: "/blog", desc: "Artigos sobre Python e carreira." },
  ];
  return (
    <div className="max-w-xl rounded-xl border border-border bg-white p-5 text-left">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
          <Globe className="h-3.5 w-3.5 text-gray-600" />
        </span>
        <div className="leading-tight">
          <p className="text-[13px] text-gray-800">PyTrack</p>
          <p className="text-xs text-gray-500">{url.replace("https://", "")}</p>
        </div>
      </div>
      <p className="mt-1.5 line-clamp-1 text-xl text-[#1a0dab] hover:underline">{title}</p>
      <p className="line-clamp-2 text-sm text-gray-600">{description}</p>

      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-gray-100 pt-3">
        {sitelinks.map((s) => (
          <div key={s.name}>
            <p className="text-[15px] text-[#1a0dab]">{s.name}</p>
            <p className="line-clamp-1 text-xs text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
