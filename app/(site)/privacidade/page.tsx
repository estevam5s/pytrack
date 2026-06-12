import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a PyTrack coleta, usa, armazena e protege seus dados pessoais — em conformidade com a LGPD.",
};

const UPDATED = "7 de junho de 2026";

export default function PrivacidadePage() {
  return (
    <>
      <PageHero badge="Privacidade" title="Política de" highlight="Privacidade"
        description={`Última atualização: ${UPDATED}. Como tratamos seus dados na PyTrack, em conformidade com a LGPD (Lei 13.709/2018).`}
      />
      <article className="markdown container max-w-3xl py-14">
        <h2>1. Quem somos</h2>
        <p>A PyTrack é uma plataforma de educação em Python (www.pytrack.com.br). Esta política explica como tratamos seus dados pessoais.</p>

        <h2>2. Dados que coletamos</h2>
        <ul>
          <li><strong>Cadastro:</strong> nome, e-mail e senha (a senha é armazenada com hash, nunca em texto puro).</li>
          <li><strong>Pagamento:</strong> processado pela Stripe. Não armazenamos números de cartão — apenas o identificador do cliente/assinatura.</li>
          <li><strong>Uso:</strong> progresso de estudo, XP, exercícios, projetos e interações na comunidade.</li>
          <li><strong>Login social:</strong> se conectar o GitHub, recebemos seu nome de usuário público.</li>
          <li><strong>Técnicos:</strong> cookies de sessão e dados básicos de acesso para segurança.</li>
        </ul>

        <h2>3. Como usamos seus dados</h2>
        <ul>
          <li>Fornecer e personalizar a plataforma e o acompanhamento de evolução.</li>
          <li>Processar assinaturas, pagamentos e reembolsos.</li>
          <li>Comunicar sobre sua conta, suporte e novidades.</li>
          <li>Garantir segurança (prevenção a fraude, spam e abuso).</li>
        </ul>

        <h2>4. Bases legais (LGPD)</h2>
        <p>Tratamos dados com base em: execução de contrato (prestação do serviço), consentimento (quando aplicável), cumprimento de obrigação legal e legítimo interesse (segurança e melhoria do produto).</p>

        <h2>5. Compartilhamento</h2>
        <p>Compartilhamos dados apenas com operadores necessários ao funcionamento: <strong>Supabase</strong> (banco/autenticação/armazenamento), <strong>Stripe</strong> (pagamentos), <strong>Vercel</strong> (hospedagem) e provedores de IA (para correção de exercícios). Não vendemos seus dados.</p>

        <h2>6. Armazenamento e segurança</h2>
        <p>Os dados ficam protegidos com criptografia em trânsito, Row Level Security no banco e controle de acesso. Adotamos rate limiting e verificação em duas etapas (2FA) opcional.</p>

        <h2>7. Seus direitos (LGPD)</h2>
        <p>Você pode, a qualquer momento, em <strong>Configurações → Dados e privacidade</strong>:</p>
        <ul>
          <li><strong>Exportar</strong> seus dados pessoais.</li>
          <li><strong>Excluir</strong> sua conta e os dados associados.</li>
          <li>Corrigir/atualizar suas informações.</li>
          <li>Revogar consentimentos.</li>
        </ul>

        <h2>8. Política de retenção</h2>
        <p>Mantemos seus dados apenas pelo tempo necessário a cada finalidade:</p>
        <ul>
          <li><strong>Conta, perfil, progresso e anotações:</strong> enquanto a conta existir.</li>
          <li><strong>Registros fiscais de pagamento:</strong> 5 anos (obrigação legal).</li>
          <li><strong>Logs de erro e segurança:</strong> 90 dias.</li>
          <li><strong>Dados de visitas/analytics:</strong> até 12 meses.</li>
          <li><strong>Newsletter:</strong> até o cancelamento (opt-out).</li>
          <li><strong>Após exclusão da conta:</strong> dados pessoais eliminados em até 30 dias (salvo retenções legais acima).</li>
        </ul>

        <h2>9. Cookies</h2>
        <p>Usamos cookies essenciais para login e funcionamento. Não usamos cookies de rastreamento publicitário de terceiros.</p>

        <h2>10. Operadores (sub-processadores)</h2>
        <p>Para operar a plataforma, contamos com: <strong>Supabase</strong> (banco/auth), <strong>Vercel</strong> (hospedagem), <strong>Stripe</strong> (pagamentos — não armazenamos números de cartão), <strong>Resend</strong> (e-mails) e provedores de <strong>IA</strong> (correção de exercícios). Transferências internacionais seguem as garantias do art. 33 da LGPD.</p>

        <h2>11. Contato do Encarregado (DPO)</h2>
        <p>Dúvidas ou solicitações de privacidade? Fale com nosso Encarregado de Proteção de Dados:</p>
        <ul>
          <li><strong>E-mail:</strong> <a href="mailto:privacidade@pytrack.com.br">privacidade@pytrack.com.br</a></li>
          <li><strong>Prazo de resposta:</strong> até 15 dias.</li>
        </ul>
        <p>Você pode exercer todos os direitos do art. 18 da LGPD (acesso, correção, eliminação, portabilidade, revogação de consentimento e informações sobre compartilhamento).</p>

        <p className="mt-8 text-sm text-text-secondary">Este documento é um modelo informativo e não substitui aconselhamento jurídico.</p>
      </article>
    </>
  );
}
