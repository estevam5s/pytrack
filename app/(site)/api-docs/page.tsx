import { redirect } from "next/navigation";

// Rota amigável "/api-docs" → documentação da API.
export default function ApiDocsAlias() {
  redirect("/docs/api");
}
