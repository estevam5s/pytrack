// Validação de uploads (puro — usável no client e no server).
// Whitelist por bucket: tamanho, extensão e MIME. Nomes de arquivo são
// sempre gerados de forma segura (nunca usamos o nome original direto).

export interface UploadRule {
  maxMB: number;
  ext: string[]; // extensões permitidas (whitelist). vazio = qualquer (menos bloqueadas)
  mimePrefixes: string[]; // prefixos de MIME aceitos. vazio = não checa MIME
}

// Extensões sempre bloqueadas (exceto onde explicitamente permitidas, ex.: apps)
const ALWAYS_BLOCKED = ["svg", "html", "htm", "xhtml", "js", "mjs", "php", "sh", "bat", "cmd", "scr", "com"];

export const UPLOAD_RULES: Record<string, UploadRule> = {
  avatars: { maxMB: 5, ext: ["png", "jpg", "jpeg", "gif", "webp"], mimePrefixes: ["image/"] },
  "book-covers": { maxMB: 5, ext: ["png", "jpg", "jpeg", "gif", "webp"], mimePrefixes: ["image/"] },
  "book-files": { maxMB: 60, ext: ["pdf", "epub"], mimePrefixes: ["application/pdf", "application/epub+zip"] },
  "material-files": {
    maxMB: 60,
    ext: ["pdf", "zip", "txt", "md", "csv", "ipynb", "png", "jpg", "jpeg", "webp", "gif"],
    mimePrefixes: [],
  },
  "app-releases": {
    maxMB: 300,
    ext: ["apk", "exe", "dmg", "appimage", "deb", "zip", "msi", "tar", "gz"],
    mimePrefixes: [],
  },
};

const DEFAULT_RULE: UploadRule = { maxMB: 25, ext: [], mimePrefixes: [] };

export function getExt(filename: string): string {
  const e = (filename.split(".").pop() ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return e || "bin";
}

/** Nome de arquivo seguro: pasta do usuário + timestamp + aleatório + extensão validada. */
export function safeStoragePath(userId: string, filename: string): string {
  const ext = getExt(filename);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${userId}/${Date.now()}-${rand}.${ext}`;
}

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

export function validateUpload(
  bucket: string,
  file: { name: string; size: number; type?: string },
): ValidationResult {
  const rule = UPLOAD_RULES[bucket] ?? DEFAULT_RULE;
  const ext = getExt(file.name);

  if (!file.size || file.size <= 0) return { ok: false, error: "Arquivo vazio." };
  if (file.size > rule.maxMB * 1024 * 1024) {
    return { ok: false, error: `Arquivo muito grande (máx. ${rule.maxMB} MB).` };
  }

  const allowsExt = rule.ext.length > 0;
  // bloqueia extensões perigosas, a menos que o bucket as permita explicitamente
  if (ALWAYS_BLOCKED.includes(ext) && !rule.ext.includes(ext)) {
    return { ok: false, error: `Tipo de arquivo não permitido (.${ext}).` };
  }
  if (allowsExt && !rule.ext.includes(ext)) {
    return { ok: false, error: `Extensão .${ext} não permitida aqui.` };
  }
  if (rule.mimePrefixes.length > 0 && file.type) {
    const okMime = rule.mimePrefixes.some((p) => file.type!.startsWith(p) || file.type === p);
    if (!okMime) return { ok: false, error: `Tipo de conteúdo inválido (${file.type}).` };
  }
  return { ok: true };
}
