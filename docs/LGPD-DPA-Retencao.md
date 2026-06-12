# 🛡️ LGPD — DPA, Política de Retenção e Contato de Privacidade

> Documento de conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
> Plataforma PyTrack — www.pytrack.com.br · junho/2026.

---

## 1. Contato de Privacidade (Encarregado / DPO)

Conforme o art. 41 da LGPD, a PyTrack designa um canal para tratar de assuntos de privacidade e proteção de dados:

- **Encarregado (DPO):** Estevam Souza
- **E-mail de privacidade:** **privacidade@pytrack.com.br**
- **Prazo de resposta:** até 15 dias para solicitações de titulares.

O titular pode, a qualquer momento, solicitar: confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação e informações sobre compartilhamento dos seus dados.

---

## 2. Papéis (Controlador e Operadores)

- **Controladora dos dados:** PyTrack (Estevam Souza).
- **Operadores (sub-processadores) que tratam dados em nome da controladora:**

| Operador | Finalidade | Local |
|----------|------------|-------|
| **Supabase** | Banco de dados, autenticação e armazenamento | EUA/UE |
| **Vercel** | Hospedagem e entrega da aplicação | Global (CDN) |
| **Stripe** | Processamento de pagamentos | EUA/UE |
| **Resend** | Envio de e-mails transacionais | EUA |
| **Provedores de IA** (OpenAI/Anthropic/OpenRouter/NVIDIA) | Correção de exercícios e recursos de IA | EUA |

Transferências internacionais ocorrem com base nas hipóteses do art. 33 da LGPD (cláusulas contratuais e padrões adequados de proteção dos operadores).

---

## 3. Acordo de Tratamento de Dados (DPA) — termos essenciais

Este DPA rege o tratamento de dados pessoais entre a **Controladora (PyTrack)** e seus **Operadores**:

1. **Objeto e finalidade.** Os operadores tratam dados pessoais exclusivamente para prestar os serviços contratados (hospedagem, banco, pagamento, e-mail, IA), conforme instruções da controladora.
2. **Categorias de dados.** Dados cadastrais (nome, e-mail), dados de uso (progresso, atividade), dados de pagamento (tokenizados pela Stripe — a PyTrack **não armazena** números de cartão) e conteúdo gerado pelo usuário.
3. **Titulares.** Usuários da plataforma.
4. **Obrigações do operador.** Tratar dados apenas conforme instruções; garantir confidencialidade; aplicar medidas técnicas e organizacionais de segurança; auxiliar a controladora em solicitações de titulares e incidentes; não subcontratar sem garantias equivalentes.
5. **Segurança.** Criptografia em trânsito (TLS) e em repouso; controle de acesso; isolamento de dados por usuário (RLS); cabeçalhos de segurança; registro de eventos.
6. **Incidentes.** Notificação à controladora sem demora injustificada; a controladora notifica a ANPD e os titulares quando houver risco relevante (art. 48).
7. **Eliminação.** Ao término da relação, os dados são eliminados ou devolvidos, salvo obrigação legal de retenção.
8. **Auditoria.** A controladora pode auditar a conformidade dos operadores (relatórios de segurança/certificações).

---

## 4. Política de Retenção de Dados

A PyTrack retém dados pessoais apenas pelo tempo necessário às finalidades para as quais foram coletados:

| Dado | Retenção | Base / motivo |
|------|----------|---------------|
| Conta e perfil | Enquanto a conta existir | Execução do contrato |
| Progresso, XP, atividade, anotações | Enquanto a conta existir | Prestação do serviço |
| Dados de pagamento (na Stripe) | Conforme exigências fiscais/contábeis | Obrigação legal |
| Registros fiscais / notas | 5 anos | Obrigação legal/fiscal |
| Logs de erro e segurança | 90 dias | Legítimo interesse (segurança) |
| Registros de visitas/analytics | 12 meses | Legítimo interesse (melhoria do produto) |
| Inscrições de newsletter | Até o cancelamento (opt-out) | Consentimento |
| Dados após exclusão da conta | Eliminados em até 30 dias | Direito do titular (art. 18) |

**Exclusão da conta.** O usuário pode excluir a conta a qualquer momento (Configurações → Conta), o que dispara a eliminação dos dados associados (respeitadas as retenções legais acima). Há também a opção de **exportar os dados** (portabilidade).

---

## 5. Direitos do titular (art. 18)

O titular pode exercer, pelo e-mail de privacidade ou pela própria plataforma:

- Confirmação da existência de tratamento;
- Acesso aos dados;
- Correção de dados incompletos/desatualizados;
- Anonimização, bloqueio ou eliminação de dados desnecessários;
- Portabilidade (exportação);
- Eliminação dos dados tratados com consentimento;
- Informação sobre compartilhamento;
- Revogação do consentimento.

---

## 6. Bases legais utilizadas

- **Execução de contrato** (art. 7º, V): para prestar o serviço.
- **Consentimento** (art. 7º, I): newsletter e comunicações de marketing.
- **Obrigação legal** (art. 7º, II): dados fiscais.
- **Legítimo interesse** (art. 7º, IX): segurança, prevenção a fraude e melhoria do produto, com avaliação de impacto e sem sobrepor direitos do titular.

---

## 7. Medidas técnicas e organizacionais

- Row Level Security (RLS) em todas as tabelas do banco.
- Criptografia em trânsito (HTTPS/TLS) e segredos isolados no servidor.
- Autenticação com confirmação de e-mail e 2FA opcional.
- Cabeçalhos de segurança (CSP, HSTS, X-Frame-Options).
- Registro e monitoramento de erros e eventos (observabilidade) e alertas.
- Minimização: coletamos apenas o necessário; pagamentos são tokenizados (não armazenamos cartões).

---

> Este documento é um modelo de conformidade e deve ser revisado por um **advogado/DPO** antes da publicação definitiva, adaptando prazos e responsabilidades à operação real.
