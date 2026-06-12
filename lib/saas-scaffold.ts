// Gera um script bash que cria a arquitetura inicial de um SaaS conforme a stack.
// Executado pelo CLI (pytrack-saas.sh) após validar o plano do usuário.

type StackKey = "nextjs-supabase" | "fastapi-postgres" | "flask" | "django" | "express-prisma";

function detectStack(raw: string): StackKey {
  const s = raw.toLowerCase();
  if (s.includes("fastapi")) return "fastapi-postgres";
  if (s.includes("django")) return "django";
  if (s.includes("flask")) return "flask";
  if (s.includes("express") || s.includes("node")) return "express-prisma";
  return "nextjs-supabase";
}

const COMMON_README = (name: string, stack: string) => `# ${name}

> SaaS gerado pela PyTrack (construir-saas) · stack: ${stack}

## Estrutura
- Arquitetura inicial pronta: auth, billing (Stripe), banco e variáveis de ambiente.
- Preencha o \`.env\` com suas chaves e rode o projeto.

## Próximos passos
1. Configure o \`.env\` (copie de \`.env.example\`).
2. Crie sua conta Stripe e configure os produtos/preços.
3. Implemente as regras de negócio em \`src/\`.

Feito com 🐍 PyTrack — www.pytrack.com.br
`;

const ENV_EXAMPLE = `# Banco
DATABASE_URL=
# Auth
JWT_SECRET=troque-isto
# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
# App
APP_URL=http://localhost:3000
`;

function bashFile(path: string, content: string): string {
  const b64 = Buffer.from(content).toString("base64");
  return `mkdir -p "$(dirname '${path}')" && printf '%s' '${b64}' | base64 -d > '${path}'`;
}

export function generateScaffold(projectName: string, rawStack: string): string {
  const name = (projectName || "meu-saas").replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
  const stack = detectStack(rawStack);
  const files: Record<string, string> = { "README.md": COMMON_README(name, rawStack), ".env.example": ENV_EXAMPLE, ".gitignore": "node_modules\n.env\n__pycache__\n.venv\ndist\n.next\n" };

  if (stack === "nextjs-supabase") {
    files["package.json"] = JSON.stringify({
      name, version: "0.1.0", private: true,
      scripts: { dev: "next dev", build: "next build", start: "next start", lint: "next lint" },
      dependencies: { next: "^15.1.0", react: "^19", "react-dom": "^19", "@supabase/supabase-js": "^2.47.0", "@supabase/ssr": "^0.5.2", stripe: "^17.5.0", "lucide-react": "^0.468.0" },
      devDependencies: { typescript: "^5", "@types/node": "^22", "@types/react": "^19", "@types/react-dom": "^19", tailwindcss: "^3.4.1", postcss: "^8", autoprefixer: "^10" },
    }, null, 2);
    files["tsconfig.json"] = JSON.stringify({ compilerOptions: { target: "ES2022", lib: ["dom", "dom.iterable", "esnext"], allowJs: true, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: "esnext", moduleResolution: "bundler", resolveJsonModule: true, isolatedModules: true, jsx: "preserve", incremental: true, plugins: [{ name: "next" }], paths: { "@/*": ["./src/*"] } }, include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], exclude: ["node_modules"] }, null, 2);
    files["next.config.mjs"] = `/** @type {import('next').NextConfig} */\nconst nextConfig = { reactStrictMode: true };\nexport default nextConfig;\n`;
    files["postcss.config.mjs"] = `export default { plugins: { tailwindcss: {}, autoprefixer: {} } };\n`;
    files["tailwind.config.ts"] = `import type { Config } from "tailwindcss";\nexport default {\n  content: ["./src/**/*.{ts,tsx}"],\n  theme: { extend: { colors: { brand: { DEFAULT: "#6366f1", dark: "#4f46e5" } } } },\n  plugins: [],\n} satisfies Config;\n`;
    files["src/app/globals.css"] = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n:root { color-scheme: dark; }\nbody { background: #0a0a0f; color: #e5e7eb; }\n`;
    files["src/app/layout.tsx"] = `import "./globals.css";\nexport const metadata = { title: "${name}", description: "SaaS criado com PyTrack" };\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (<html lang="pt-BR"><body>{children}</body></html>);\n}\n`;
    files["src/app/page.tsx"] = `import Link from "next/link";\nimport { Rocket, Zap, Shield } from "lucide-react";\n\nexport default function Home() {\n  return (\n    <main className="min-h-screen">\n      <header className="flex items-center justify-between px-6 py-4">\n        <span className="text-xl font-bold">${name}</span>\n        <nav className="flex gap-4 text-sm">\n          <Link href="/precos" className="text-gray-300 hover:text-white">Preços</Link>\n          <Link href="/login" className="text-gray-300 hover:text-white">Entrar</Link>\n          <Link href="/registro" className="rounded-lg bg-brand px-4 py-2 font-medium text-white">Começar</Link>\n        </nav>\n      </header>\n      <section className="mx-auto max-w-3xl px-6 py-24 text-center">\n        <h1 className="text-5xl font-extrabold tracking-tight">O seu SaaS começa aqui 🚀</h1>\n        <p className="mt-4 text-lg text-gray-400">Landing, autenticação, planos e pagamentos já configurados. Foque no seu produto.</p>\n        <Link href="/registro" className="mt-8 inline-block rounded-xl bg-brand px-6 py-3 font-semibold text-white">Criar conta grátis</Link>\n      </section>\n      <section className="mx-auto grid max-w-4xl gap-4 px-6 pb-24 sm:grid-cols-3">\n        {[[Rocket,"Rápido","Stack moderna e pronta para deploy."],[Zap,"Pagamentos","Stripe + webhooks já integrados."],[Shield,"Seguro","Auth e RLS com Supabase."]].map(([I,t,d]:any,i)=>(\n          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6"><I className="h-6 w-6 text-brand"/><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-1 text-sm text-gray-400">{d}</p></div>\n        ))}\n      </section>\n    </main>\n  );\n}\n`;
    files["src/app/precos/page.tsx"] = `import { CheckoutButton } from "@/components/checkout-button";\n\nconst PLANS = [\n  { name: "Starter", price: 19, priceId: "price_xxx", features: ["Recurso A", "Recurso B", "Suporte por e-mail"] },\n  { name: "Pro", price: 49, priceId: "price_yyy", features: ["Tudo do Starter", "Recurso C", "Suporte prioritário"], highlight: true },\n];\n\nexport default function Pricing() {\n  return (\n    <main className="mx-auto max-w-3xl px-6 py-20">\n      <h1 className="text-center text-3xl font-bold">Planos</h1>\n      <div className="mt-10 grid gap-5 sm:grid-cols-2">\n        {PLANS.map((p) => (\n          <div key={p.name} className={"rounded-2xl border p-6 " + (p.highlight ? "border-brand" : "border-white/10")}>\n            <h2 className="font-semibold">{p.name}</h2>\n            <p className="mt-2 text-3xl font-bold">R$ {p.price}<span className="text-sm text-gray-400">/mês</span></p>\n            <ul className="mt-4 space-y-1 text-sm text-gray-300">{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>\n            <CheckoutButton priceId={p.priceId} />\n          </div>\n        ))}\n      </div>\n    </main>\n  );\n}\n`;
    files["src/components/checkout-button.tsx"] = `"use client";\nimport { useState } from "react";\nexport function CheckoutButton({ priceId }: { priceId: string }) {\n  const [loading, setLoading] = useState(false);\n  async function go() {\n    setLoading(true);\n    const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ priceId }) });\n    const { url } = await r.json();\n    if (url) window.location.href = url;\n    setLoading(false);\n  }\n  return <button onClick={go} disabled={loading} className="mt-5 w-full rounded-xl bg-brand py-2.5 font-semibold text-white disabled:opacity-60">{loading ? "..." : "Assinar"}</button>;\n}\n`;
    files["src/lib/supabase/client.ts"] = `import { createBrowserClient } from "@supabase/ssr";\nexport const createClient = () => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);\n`;
    files["src/lib/supabase/server.ts"] = `import { createServerClient } from "@supabase/ssr";\nimport { cookies } from "next/headers";\nexport async function createClient() {\n  const cookieStore = await cookies();\n  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {\n    cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) },\n  });\n}\n`;
    files["src/lib/stripe.ts"] = `import Stripe from "stripe";\nexport const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);\n`;
    files["src/app/api/checkout/route.ts"] = `import { NextResponse } from "next/server";\nimport { stripe } from "@/lib/stripe";\nexport async function POST(req: Request) {\n  const { priceId } = await req.json();\n  const session = await stripe.checkout.sessions.create({\n    mode: "subscription",\n    line_items: [{ price: priceId, quantity: 1 }],\n    success_url: (process.env.APP_URL || "http://localhost:3000") + "/dashboard?ok=1",\n    cancel_url: (process.env.APP_URL || "http://localhost:3000") + "/precos",\n  });\n  return NextResponse.json({ url: session.url });\n}\n`;
    files["src/app/api/stripe/webhook/route.ts"] = `import { stripe } from "@/lib/stripe";\nexport async function POST(req: Request) {\n  const sig = req.headers.get("stripe-signature")!;\n  const body = await req.text();\n  let event;\n  try { event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!); }\n  catch (e) { return new Response("bad sig", { status: 400 }); }\n  switch (event.type) {\n    case "checkout.session.completed": /* TODO: liberar acesso do usuário */ break;\n    case "customer.subscription.deleted": /* TODO: revogar acesso */ break;\n  }\n  return Response.json({ received: true });\n}\n`;
    files["src/app/login/page.tsx"] = `"use client";\nimport { useState } from "react";\nimport { createClient } from "@/lib/supabase/client";\nexport default function Login() {\n  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [err, setErr] = useState("");\n  async function submit(e: React.FormEvent) { e.preventDefault();\n    const { error } = await createClient().auth.signInWithPassword({ email, password });\n    if (error) setErr(error.message); else window.location.href = "/dashboard";\n  }\n  return (<main className="mx-auto max-w-sm px-6 py-24"><h1 className="text-2xl font-bold">Entrar</h1>\n    <form onSubmit={submit} className="mt-6 space-y-3">\n      <input className="w-full rounded-lg bg-white/5 p-3" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />\n      <input className="w-full rounded-lg bg-white/5 p-3" type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} />\n      {err && <p className="text-sm text-red-400">{err}</p>}\n      <button className="w-full rounded-lg bg-brand py-2.5 font-semibold text-white">Entrar</button>\n    </form></main>);\n}\n`;
    files["src/app/registro/page.tsx"] = `"use client";\nimport { useState } from "react";\nimport { createClient } from "@/lib/supabase/client";\nexport default function Register() {\n  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [msg, setMsg] = useState("");\n  async function submit(e: React.FormEvent) { e.preventDefault();\n    const { error } = await createClient().auth.signUp({ email, password });\n    setMsg(error ? error.message : "Verifique seu e-mail para confirmar a conta.");\n  }\n  return (<main className="mx-auto max-w-sm px-6 py-24"><h1 className="text-2xl font-bold">Criar conta</h1>\n    <form onSubmit={submit} className="mt-6 space-y-3">\n      <input className="w-full rounded-lg bg-white/5 p-3" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />\n      <input className="w-full rounded-lg bg-white/5 p-3" type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} />\n      {msg && <p className="text-sm text-gray-300">{msg}</p>}\n      <button className="w-full rounded-lg bg-brand py-2.5 font-semibold text-white">Cadastrar</button>\n    </form></main>);\n}\n`;
    files["src/app/dashboard/page.tsx"] = `import { redirect } from "next/navigation";\nimport { createClient } from "@/lib/supabase/server";\nexport default async function Dashboard() {\n  const supabase = await createClient();\n  const { data: { user } } = await supabase.auth.getUser();\n  if (!user) redirect("/login");\n  return (<main className="mx-auto max-w-3xl px-6 py-16"><h1 className="text-2xl font-bold">Olá, {user.email}</h1><p className="mt-2 text-gray-400">Seu painel. Construa seu produto aqui.</p></main>);\n}\n`;
    files["src/middleware.ts"] = `import { type NextRequest, NextResponse } from "next/server";\nimport { createServerClient } from "@supabase/ssr";\nexport async function middleware(req: NextRequest) {\n  const res = NextResponse.next();\n  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {\n    cookies: { getAll: () => req.cookies.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => res.cookies.set(name, value, options)) },\n  });\n  await supabase.auth.getUser();\n  return res;\n}\nexport const config = { matcher: ["/dashboard/:path*"] };\n`;
    files[".env.example"] = `NEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_ANON_KEY=\nSTRIPE_SECRET_KEY=\nSTRIPE_WEBHOOK_SECRET=\nAPP_URL=http://localhost:3000\n`;
    files["supabase/schema.sql"] = `-- Tabela de exemplo com Row Level Security\ncreate table if not exists public.profiles (\n  id uuid primary key references auth.users(id) on delete cascade,\n  plan text default 'free',\n  created_at timestamptz default now()\n);\nalter table public.profiles enable row level security;\ncreate policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);\n`;
  } else if (stack === "fastapi-postgres") {
    files["requirements.txt"] = "fastapi\nuvicorn[standard]\nsqlalchemy\npsycopg2-binary\npydantic\npython-jose\nstripe\npython-dotenv\n";
    files["app/main.py"] = `from fastapi import FastAPI\nfrom app.routers import auth, billing\n\napp = FastAPI(title="${name}")\napp.include_router(auth.router)\napp.include_router(billing.router)\n\n@app.get("/")\ndef root():\n    return {"app": "${name}", "status": "ok"}\n`;
    files["app/database.py"] = `import os\nfrom sqlalchemy import create_engine\nfrom sqlalchemy.orm import sessionmaker, declarative_base\n\nengine = create_engine(os.getenv("DATABASE_URL", "sqlite:///./dev.db"))\nSessionLocal = sessionmaker(bind=engine)\nBase = declarative_base()\n`;
    files["app/routers/auth.py"] = `from fastapi import APIRouter\nrouter = APIRouter(prefix="/auth", tags=["auth"])\n\n@router.post("/register")\ndef register():\n    return {"todo": "implementar cadastro"}\n`;
    files["app/routers/billing.py"] = `import os, stripe\nfrom fastapi import APIRouter, Request\nstripe.api_key = os.getenv("STRIPE_SECRET_KEY")\nrouter = APIRouter(prefix="/billing", tags=["billing"])\n\n@router.post("/webhook")\nasync def webhook(req: Request):\n    payload = await req.body()\n    sig = req.headers.get("stripe-signature")\n    event = stripe.Webhook.construct_event(payload, sig, os.getenv("STRIPE_WEBHOOK_SECRET"))\n    return {"received": True, "type": event["type"]}\n`;
    files["app/routers/__init__.py"] = "";
    files["app/__init__.py"] = "";
  } else if (stack === "flask") {
    files["requirements.txt"] = "flask\nflask-sqlalchemy\nstripe\npython-dotenv\n";
    files["app.py"] = `from flask import Flask, jsonify\napp = Flask(__name__)\n\n@app.route("/")\ndef home():\n    return jsonify(app="${name}", status="ok")\n\nif __name__ == "__main__":\n    app.run(debug=True)\n`;
  } else if (stack === "django") {
    files["requirements.txt"] = "django\ndjangorestframework\npsycopg2-binary\nstripe\npython-dotenv\n";
    files["manage.py"] = `#!/usr/bin/env python\nimport os, sys\nif __name__ == "__main__":\n    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")\n    from django.core.management import execute_from_command_line\n    execute_from_command_line(sys.argv)\n`;
    files["README-django.md"] = "Rode: django-admin startproject core . e configure apps de auth/billing.";
  } else {
    files["package.json"] = JSON.stringify({ name, version: "0.1.0", scripts: { dev: "node src/index.js" }, dependencies: { express: "^4", "@prisma/client": "^5", stripe: "^17" } }, null, 2);
    files["src/index.js"] = `const express = require("express");\nconst app = express();\napp.get("/", (_, res) => res.json({ app: "${name}", status: "ok" }));\napp.listen(3000, () => console.log("${name} on :3000"));`;
    files["prisma/schema.prisma"] = `generator client { provider = "prisma-client-js" }\ndatasource db { provider = "postgresql"; url = env("DATABASE_URL") }\n\nmodel User { id String @id @default(uuid()) email String @unique createdAt DateTime @default(now()) }`;
  }

  const lines = [
    `set -e`,
    `echo "🐍 PyTrack — criando '${name}' (stack: ${rawStack})..."`,
    `mkdir -p "${name}" && cd "${name}"`,
    ...Object.entries(files).map(([p, c]) => bashFile(p, c)),
    `echo ""`,
    `echo "✅ Projeto '${name}' criado com ${Object.keys(files).length} arquivos!"`,
    `echo "👉 cd ${name} && cp .env.example .env  (preencha suas chaves)"`,
  ];
  return lines.join("\n");
}
