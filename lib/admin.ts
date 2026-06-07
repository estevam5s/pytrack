// Lista de administradores (acesso vitalício + painel de criação de usuários).
export const ADMIN_EMAILS = [
  "contato@estevamsouza.com.br",
  "estevamsouzalaureth@gmail.com",
];

export function isAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}
