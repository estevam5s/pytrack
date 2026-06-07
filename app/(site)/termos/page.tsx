import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso da plataforma PyTrack.",
};

const UPDATED = "7 de junho de 2026";

export default function TermosPage() {
  return (
    <>
      <PageHero badge="Termos" title="Termos de" highlight="Uso"
        description={`Última atualização: ${UPDATED}. Ao usar a PyTrack, você concorda com estes termos.`}
      />
      <article className="markdown container max-w-3xl py-14">
        <h2>1. Aceitação</h2>
        <p>Ao criar uma conta ou usar a PyTrack, você concorda com estes Termos de Uso e com a Política de Privacidade.</p>

        <h2>2. A plataforma</h2>
        <p>A PyTrack oferece conteúdos, trilhas, exercícios, IDE, projetos e ferramentas de carreira para aprender Python, mediante planos gratuitos e pagos.</p>

        <h2>3. Conta</h2>
        <ul>
          <li>Você é responsável por manter a confidencialidade da sua senha.</li>
          <li>Recomendamos ativar a verificação em duas etapas (2FA).</li>
          <li>Você deve fornecer informações verdadeiras no cadastro.</li>
        </ul>

        <h2>4. Planos, pagamentos e trial</h2>
        <ul>
          <li>O plano gratuito dá acesso por 7 dias; depois, é necessário assinar para continuar.</li>
          <li>Planos pagos (mensal, anual e vitalício) são cobrados via Stripe.</li>
          <li>Upgrades/downgrades têm cobrança proporcional (proration).</li>
          <li><strong>Garantia de reembolso de 7 dias</strong>: você pode solicitar reembolso integral em Configurações → Plano.</li>
        </ul>

        <h2>5. Uso aceitável</h2>
        <p>Você concorda em não: (a) compartilhar sua conta; (b) copiar/redistribuir o conteúdo; (c) abusar de recursos (spam, automação maliciosa); (d) violar leis ou direitos de terceiros; (e) tentar comprometer a segurança da plataforma.</p>

        <h2>6. Comunidade</h2>
        <p>Conteúdos publicados na comunidade são de responsabilidade de quem publica. Podemos moderar, ocultar ou remover conteúdo, e bloquear usuários que violem estas regras.</p>

        <h2>7. Propriedade intelectual</h2>
        <p>Todo o conteúdo da plataforma (textos, exercícios, projetos, marca) é protegido. O acesso é pessoal e intransferível, sob licença de uso, não de propriedade.</p>

        <h2>8. Aplicativos</h2>
        <p>Os aplicativos (Android/Desktop), quando disponíveis, seguem estes termos e ficam disponíveis conforme o plano contratado.</p>

        <h2>9. Limitação de responsabilidade</h2>
        <p>A plataforma é fornecida "como está". Empenhamo-nos pela disponibilidade, mas não garantimos operação ininterrupta. Não nos responsabilizamos por resultados de carreira específicos.</p>

        <h2>10. Cancelamento e encerramento</h2>
        <p>Você pode cancelar a assinatura ou excluir a conta a qualquer momento. Podemos suspender contas que violem estes termos.</p>

        <h2>11. Alterações</h2>
        <p>Podemos atualizar estes termos. Mudanças relevantes serão comunicadas. O uso contínuo implica concordância.</p>

        <h2>12. Contato</h2>
        <p>Dúvidas? Fale com o suporte na plataforma.</p>

        <p className="mt-8 text-sm text-text-secondary">Este documento é um modelo informativo e não substitui aconselhamento jurídico.</p>
      </article>
    </>
  );
}
