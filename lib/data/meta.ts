// Util server-side para extrair metadados Open Graph de uma URL.
// Usado por /aulas-udemy e /livros para importar capa, título, etc.

export interface UrlMeta {
  title?: string;
  image?: string;
  description?: string;
  author?: string;
  error?: string;
}

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
};

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function stripHtml(s: string): string {
  return decode(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).trim();
}

function tag(html: string, prop: string): string | undefined {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return decode(m[1]);
  }
  return undefined;
}

async function viaMicrolink(url: string): Promise<UrlMeta | null> {
  try {
    const res = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      status?: string;
      data?: {
        title?: string;
        description?: string;
        author?: string;
        image?: { url?: string };
        logo?: { url?: string };
      };
    };
    if (json.status !== "success" || !json.data) return null;
    const d = json.data;
    if (!d.title && !d.image?.url) return null;
    return {
      title: d.title ? decode(d.title) : undefined,
      image: d.image?.url ?? d.logo?.url,
      description: d.description ? stripHtml(d.description).slice(0, 500) : undefined,
      author: d.author ? decode(d.author) : undefined,
    };
  } catch {
    return null;
  }
}

export async function fetchUrlMeta(url: string): Promise<UrlMeta> {
  if (!/^https?:\/\//i.test(url)) {
    return { error: "Informe uma URL válida (começando com http)." };
  }
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS, cache: "no-store" });
    if (!res.ok) {
      return (
        (await viaMicrolink(url)) ?? {
          error: `Não foi possível ler a página (HTTP ${res.status}). Preencha manualmente.`,
        }
      );
    }
    const html = (await res.text()).slice(0, 600_000);
    const title =
      tag(html, "og:title") ||
      decode(html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "");
    const image = tag(html, "og:image");
    const description =
      tag(html, "og:description") || tag(html, "description");
    const author =
      tag(html, "author") || tag(html, "book:author") || tag(html, "og:author");

    if (!title && !image) {
      return (
        (await viaMicrolink(url)) ?? {
          error: "A página não expôs metadados. Preencha manualmente.",
        }
      );
    }
    return {
      title: title || undefined,
      image,
      description: description?.slice(0, 500),
      author,
    };
  } catch {
    return {
      error: "Falha ao acessar a URL. Verifique o link ou preencha manualmente.",
    };
  }
}
