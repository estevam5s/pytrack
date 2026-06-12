// Templates de e-mail HTML profissionais da PyTrack.

const BASE = "https://www.pytrack.com.br";
const LOGO = `${BASE}/new-logo.png`;

function shell(title: string, bodyHtml: string, cta?: { label: string; url: string }, footerNote?: string): string {
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"></head>
<body style="margin:0;background:#0b0b0f;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#e6e6e8">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0f;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#141419;border:1px solid #26262e;border-radius:18px;overflow:hidden">
        <!-- header com gradiente -->
        <tr><td style="background:linear-gradient(135deg,#8234E9 0%,#9956F6 55%,#5F75F2 100%);padding:26px 32px">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
            <td><img src="${LOGO}" width="42" height="42" alt="PyTrack" style="border-radius:9px;vertical-align:middle"></td>
            <td style="padding-left:11px;font-size:20px;font-weight:800;color:#fff">PyTrack</td>
            <td align="right" style="font-size:11px;color:#f0e8ff">Sua jornada Python</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:30px 32px 8px">
          <h1 style="margin:0 0 14px;font-size:23px;line-height:1.25;color:#fff">${title}</h1>
          <div style="font-size:15px;line-height:1.65;color:#b8b8c0">${bodyHtml}</div>
        </td></tr>
        ${cta ? `<tr><td align="center" style="padding:10px 32px 28px">
          <a href="${cta.url}" style="display:inline-block;background:linear-gradient(90deg,#8234E9,#9956F6);color:#fff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 38px;border-radius:11px;box-shadow:0 8px 24px -8px rgba(130,52,233,.6)">${cta.label}</a>
        </td></tr>` : ""}
        <!-- redes -->
        <tr><td style="padding:6px 32px 20px" align="center">
          <a href="https://github.com/estevam5s" style="color:#6b6b75;text-decoration:none;font-size:12px;padding:0 8px">GitHub</a>
          <a href="https://www.linkedin.com/company/pytrack" style="color:#6b6b75;text-decoration:none;font-size:12px;padding:0 8px">LinkedIn</a>
          <a href="https://t.me/PyTrack_SaaS_Bot" style="color:#6b6b75;text-decoration:none;font-size:12px;padding:0 8px">Telegram</a>
        </td></tr>
        <tr><td style="padding:18px 32px;border-top:1px solid #26262e;background:#101015">
          <p style="margin:0;font-size:12px;color:#6b6b75">
            ${footerNote ?? "Você recebeu este e-mail porque tem uma conta na PyTrack."}<br>
            <a href="${BASE}" style="color:#9956F6;text-decoration:none">www.pytrack.com.br</a> · Plataforma para dominar todo o ecossistema Python.
          </p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#4b4b55">© ${new Date().getFullYear()} PyTrack — Feito com 💜 e Python</p>
    </td></tr>
  </table>
</body></html>`;
}

export function campaignEmailTemplate(subject: string, body: string): string {
  // body pode conter parágrafos separados por \n
  const html = body.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
  return shell(
    subject,
    html,
    { label: "Acessar a PyTrack", url: BASE },
    "Você recebeu este e-mail porque se inscreveu na newsletter da PyTrack.",
  );
}

export function newsletterWelcomeTemplate(): string {
  return shell(
    "Inscrição confirmada! 🐍",
    `<p>Você agora faz parte da <strong style="color:#fff">newsletter da PyTrack</strong>. Uma vez por mês, você recebe:</p>
     <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:14px 0">
       <tr><td style="padding:5px 0;font-size:14px;color:#c8c8d0">🐍 &nbsp;Novidades e recursos da linguagem Python</td></tr>
       <tr><td style="padding:5px 0;font-size:14px;color:#c8c8d0">🚀 &nbsp;Atualizações e novas features da plataforma</td></tr>
       <tr><td style="padding:5px 0;font-size:14px;color:#c8c8d0">💡 &nbsp;Dicas de carreira, projetos e tendências do mercado</td></tr>
     </table>
     <p>Enquanto isso, que tal começar a praticar?</p>`,
    { label: "Acessar a PyTrack", url: BASE },
    "Você recebeu este e-mail porque se inscreveu na newsletter da PyTrack. Para sair, responda este e-mail com 'sair'.",
  );
}

export function confirmEmailTemplate(confirmUrl: string): string {
  return shell(
    "Confirme seu e-mail 🐍",
    `<p>Bem-vindo(a) à <strong style="color:#fff">PyTrack</strong>! Estamos felizes em ter você por aqui.</p>
     <p>Para ativar sua conta e começar a dominar Python, confirme seu endereço de e-mail clicando no botão abaixo:</p>`,
    { label: "Confirmar meu e-mail", url: confirmUrl },
  ) + `<!-- fallback: ${confirmUrl} -->`;
}

export function cancellationEmailTemplate(name: string, planLabel: string): string {
  return shell(
    "Cancelamento confirmado",
    `<p>Olá${name ? `, <strong style="color:#fff">${name}</strong>` : ""}.</p>
     <p>Confirmamos o <strong style="color:#fff">cancelamento do seu plano ${planLabel}</strong> na PyTrack.</p>
     <p>O que isso significa:</p>
     <ul style="padding-left:18px;margin:8px 0;color:#b8b8c0">
       <li>Você <strong>não receberá mais cobranças</strong> deste plano.</li>
       <li>Seu acesso premium permanece até o fim do período já pago.</li>
       <li>Seus dados e progresso continuam salvos na sua conta.</li>
     </ul>
     <p>Mudou de ideia? Você pode reativar quando quiser — é só assinar novamente.</p>`,
    { label: "Voltar para a PyTrack", url: BASE },
  );
}

export function welcomeEmailTemplate(name: string): string {
  return shell(
    `Bem-vindo(a) à PyTrack${name ? `, ${name}` : ""}! 🐍`,
    `<p>Sua conta foi confirmada e está pronta. Que bom ter você aqui!</p>
     <p>Aqui vai o que você pode fazer agora mesmo:</p>
     <ul style="padding-left:18px;margin:8px 0;color:#b8b8c0">
       <li><strong style="color:#fff">Escolha uma trilha</strong> e comece do seu nível.</li>
       <li><strong style="color:#fff">Rode Python no navegador</strong> na IDE — sem instalar nada.</li>
       <li><strong style="color:#fff">Pratique com exercícios</strong> corrigidos por IA.</li>
       <li><strong style="color:#fff">Acompanhe sua evolução</strong> com XP e níveis.</li>
     </ul>
     <p>Você tem <strong style="color:#fff">7 dias grátis</strong> para explorar. Bons estudos!</p>`,
    { label: "Começar a estudar", url: `${BASE}/inicio` },
  );
}

export function trialEndingEmailTemplate(name: string, planLabel: string, value: string, date: string): string {
  return shell(
    "Seu período grátis está acabando ⏳",
    `<p>Olá${name ? `, <strong style="color:#fff">${name}</strong>` : ""}.</p>
     <p>Seu <strong style="color:#fff">teste grátis de 7 dias</strong> termina em <strong style="color:#fff">3 dias</strong>.</p>
     <p>A partir de <strong style="color:#fff">${date}</strong>, sua assinatura <strong>${planLabel}</strong> será cobrada
     em <strong style="color:#fff">${value}</strong> e você continua com acesso total — sem precisar fazer nada.</p>
     <p>Quer continuar? Ótimo, é automático. Prefere não continuar? Você pode cancelar a qualquer momento antes da cobrança,
     sem custo.</p>`,
    { label: "Gerenciar meu plano", url: `${BASE}/configuracoes/plano` },
  );
}

export function refundEmailTemplate(name: string): string {
  return shell(
    "Reembolso processado",
    `<p>Olá${name ? `, <strong style="color:#fff">${name}</strong>` : ""}.</p>
     <p>Seu <strong style="color:#fff">reembolso foi processado com sucesso</strong>. O valor retorna ao seu meio de pagamento em alguns dias úteis (o prazo depende do banco/operadora).</p>
     <p>Seu acesso premium foi encerrado e <strong>não haverá novas cobranças</strong>. Seus dados continuam salvos caso queira voltar.</p>`,
    { label: "Voltar para a PyTrack", url: BASE },
  );
}
