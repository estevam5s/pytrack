import type { Metadata } from "next";
import Link from "next/link";
import { Code2, KeyRound, Zap, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "API — Documentação",
  description: "Documentação da API pública da PyTrack. Integre seu progresso a outros serviços. Disponível no plano Completo+.",
};

export default function ApiDocsPage() {
  return (
    <>
      <PageHero badge="Desenvolvedores" title="Documentação da" highlight="API PyTrack"
        description="Integre seu progresso de aprendizado a outros serviços, portfólios e automações."
      />
      <article className="markdown container max-w-3xl py-14">
        <div className="not-prose mb-8 grid gap-3 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "Plano Suprema", d: "Disponível a partir de R$46/mês." },
            { icon: Zap, t: "REST + JSON", d: "Simples, com CORS habilitado." },
            { icon: KeyRound, t: "Bearer token", d: "Autenticação por chave de API." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-surface p-4">
              <c.icon className="h-5 w-5 text-primary-light" />
              <p className="mt-2 text-sm font-semibold">{c.t}</p>
              <p className="text-xs text-text-secondary">{c.d}</p>
            </div>
          ))}
        </div>

        <h2>Autenticação</h2>
        <p>
          Gere uma chave em <Link href="/configuracoes/api">Configurações → API</Link> (plano <strong>Suprema</strong> ou superior).
          Lá também há um <strong>playground</strong> para testar a API ao vivo. Envie a chave no header <code>Authorization</code>:
        </p>
        <pre><code>{`Authorization: Bearer pytk_live_xxxxxxxxxxxx`}</code></pre>

        <h2>Base URL</h2>
        <pre><code>https://www.pytrack.com.br/api/v1</code></pre>

        <h2>Limites</h2>
        <p>60 requisições por minuto por chave. Acima disso, retorna <code>429</code>.</p>

        <h2>Endpoints</h2>

        <h3>GET /me — seu perfil de aprendizado</h3>
        <p>Retorna XP, nível, progresso e habilidades do dono da chave. Ideal para badges e portfólios.</p>
        <pre><code>{`curl https://www.pytrack.com.br/api/v1/me \\
  -H "Authorization: Bearer pytk_live_xxxxxxxxxxxx"`}</code></pre>

        <p><strong>Resposta:</strong></p>
        <pre><code>{`{
  "data": {
    "name": "Estevam",
    "headline": "Estudante de Backend Python",
    "level": "intermediario",
    "xp": 1240,
    "skills": ["Python", "FastAPI", "Pandas"],
    "github": "estevam5s",
    "modulesCompleted": 18,
    "profileUrl": "https://www.pytrack.com.br"
  }
}`}</code></pre>

        <h3>GET /progress — seu progresso de aprendizado</h3>
        <p>Retorna módulos concluídos, XP, nível e atividades recentes. Ideal para sistemas de gestão de curso e relatórios.</p>
        <pre><code>{`curl https://www.pytrack.com.br/api/v1/progress \\
  -H "Authorization: Bearer pytk_live_xxxxxxxxxxxx"`}</code></pre>
        <pre><code>{`{
  "data": {
    "student": "Estevam",
    "xp": 1240,
    "level": "intermediario",
    "modulesCompleted": 18,
    "recent": [{ "moduleId": "...", "completedAt": "2026-06-10T..." }]
  }
}`}</code></pre>

        <h3>GET /tracks — trilhas e cursos disponíveis</h3>
        <p>Lista as 17 trilhas da PyTrack com nível, plano, módulos, horas e tópicos. Ótimo para catálogos e integrações de LMS.</p>
        <pre><code>{`curl https://www.pytrack.com.br/api/v1/tracks \\
  -H "Authorization: Bearer pytk_live_xxxxxxxxxxxx"`}</code></pre>

        <h3>GET /ranking — ranking da comunidade</h3>
        <p>Top estudantes por XP. Use <code>?limit=10</code> (máx. 50).</p>
        <pre><code>{`curl "https://www.pytrack.com.br/api/v1/ranking?limit=10" \\
  -H "Authorization: Bearer pytk_live_xxxxxxxxxxxx"`}</code></pre>
        <pre><code>{`{
  "data": [
    { "position": 1, "name": "Ana", "level": "avancado", "xp": 5200 },
    { "position": 2, "name": "Bruno", "level": "intermediario", "xp": 3100 }
  ]
}`}</code></pre>

        <h2>Exemplo de uso (JavaScript)</h2>
        <pre><code>{`const res = await fetch("https://www.pytrack.com.br/api/v1/me", {
  headers: { Authorization: "Bearer pytk_live_xxxxxxxxxxxx" },
});
const { data } = await res.json();
console.log(\`\${data.name} — \${data.xp} XP, nível \${data.level}\`);`}</code></pre>

        <h2>Erros</h2>
        <ul>
          <li><code>401</code> — chave ausente, inválida ou revogada.</li>
          <li><code>429</code> — limite de requisições excedido.</li>
        </ul>

        <p className="mt-8 text-sm text-text-secondary">
          Precisa de um endpoint específico para sua integração? <Link href="/sobre">Fale com a gente</Link>.
        </p>
      </article>
    </>
  );
}
