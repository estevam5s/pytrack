// Novidades da plataforma (changelog + roadmap). Curado.
export interface PlatformNews {
  date: string;
  type: "novo" | "melhoria" | "correcao" | "em-breve";
  title: string;
  description: string;
}

export const PLATFORM_NEWS: PlatformNews[] = [
  { date: "2026-06-11", type: "novo", title: "Assistente IA completo (Suprema)", description: "Chat com IA estilo ChatGPT em /chat: histórico de conversas, criar/excluir, datas — tudo salvo. Exclusivo do plano Suprema." },
  { date: "2026-06-11", type: "novo", title: "Ofertas e promoções", description: "Sistema de ofertas por tempo limitado com cupons automáticos na Stripe, banner com contagem regressiva e desconto aplicado no checkout. Plano anual com ~20% de desconto." },
  { date: "2026-06-11", type: "novo", title: "Construa seu SaaS via terminal (CLI)", description: "Um comando no terminal gera toda a arquitetura inicial do seu SaaS (Next.js, FastAPI, Flask, Django ou Express). A partir do plano Completo." },
  { date: "2026-06-11", type: "novo", title: "Botão de feedback", description: "Envie sua opinião direto de qualquer página (estrelas + categoria + mensagem), com aviso ao time." },
  { date: "2026-06-11", type: "melhoria", title: "Tempo de estudo, anotações e streak", description: "Cronômetro de estudo por módulo (anti-trapaça), anotações salvas com rota própria, e badge de comprometimento ao manter a sequência." },
  { date: "2026-06-11", type: "melhoria", title: "Site mais rápido e futurista", description: "Cache de rotas (volta instantânea), fundo ambiente animado (aurora), barra de progresso e central de notificações redesenhada." },
  { date: "2026-06-11", type: "melhoria", title: "Newsletter, segurança e LGPD", description: "Newsletter com popup e painel admin, monitoramento de erros (Sentry + logs), alertas de webhook e documentos de LGPD (DPA, retenção, DPO)." },
  { date: "2026-06-10", type: "novo", title: "Painéis admin: Visitantes, Saúde e Ofertas", description: "Analytics de visitantes com mapa-múndi, painel de saúde da plataforma (status de serviços, capacidade, engajamento) e gestão de ofertas." },
  { date: "2026-06-10", type: "melhoria", title: "Planos de carreira e estudos com IA", description: "Plano de carreira personalizado por IA, plano de estudos e trilhas recomendadas conforme seu objetivo." },
  { date: "2026-06-09", type: "novo", title: "Assistente de IA no site", description: "Chat com IA (Py) no canto do site para tirar dúvidas sobre planos, trilhas e recursos, com escalonamento para o suporte humano." },
  { date: "2026-06-09", type: "novo", title: "Trilha: Construir um LLM do zero", description: "Nova trilha avançada que ensina a construir um modelo de linguagem (tokenização, attention, Transformer, treino, LoRA, RLHF e inferência)." },
  { date: "2026-06-09", type: "melhoria", title: "Tradução PT/EN e busca no site", description: "Tradução da página inteira para inglês e uma busca rápida (⌘K) na barra de navegação." },
  { date: "2026-06-08", type: "novo", title: "Apps Android e Desktop", description: "Rota de download dos aplicativos (Android e Desktop Win/Mac/Linux), com upload de releases pelo admin." },
  { date: "2026-06-08", type: "novo", title: "Perfil avançado estilo LinkedIn", description: "Foto de capa, headline, habilidades, conexões e seguir usuários na comunidade." },
  { date: "2026-06-07", type: "novo", title: "Plano Vitalício", description: "Pagamento único para acesso permanente a tudo, com garantia de reembolso de 7 dias." },
  { date: "2026-06-07", type: "melhoria", title: "Segurança reforçada", description: "Verificação em duas etapas (2FA), login com GitHub, rate limiting e conformidade com a LGPD." },
  { date: "2026-06-06", type: "novo", title: "Suporte e chat ao vivo", description: "Canal de suporte com presença do admin (online/offline), chamados e respostas por e-mail." },
  { date: "2026-06-05", type: "melhoria", title: "+1.300 projetos e correção por IA", description: "Biblioteca de projetos ampliada e exercícios com feedback de IA, agora com modelos da Nvidia." },
];

export const ROADMAP: { title: string; description: string; quarter: string }[] = [
  { quarter: "Em breve", title: "Mentorias ao vivo", description: "Sessões ao vivo com instrutores para tirar dúvidas e revisar projetos." },
  { quarter: "Em breve", title: "Aulas em vídeo", description: "Videoaulas curtas complementando as trilhas em texto." },
  { quarter: "Em breve", title: "Apps nas lojas", description: "Publicação oficial dos apps Android e Desktop nas lojas." },
  { quarter: "Planejado", title: "Programa de afiliados", description: "Ganhe comissão indicando a PyTrack para outras pessoas." },
  { quarter: "Planejado", title: "Internacionalização", description: "Conteúdo e preços em outros idiomas/moedas (EN/ES)." },
  { quarter: "Planejado", title: "Squads de estudo", description: "Estude em grupo, com metas compartilhadas e ligas." },
];
