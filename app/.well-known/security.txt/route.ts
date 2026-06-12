import { NextResponse } from "next/server";

// Responsible disclosure (RFC 9116): /.well-known/security.txt
export function GET() {
  const body = `Contact: mailto:contato@estevamsouza.com.br
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: pt-BR, en
Canonical: https://www.pytrack.com.br/.well-known/security.txt
Policy: https://www.pytrack.com.br/termos
# Encontrou uma vulnerabilidade? Avise-nos com responsabilidade.
# Found a vulnerability? Please report it responsibly.
`;
  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
