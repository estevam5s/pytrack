import type { Metadata } from "next";
import { AuthLanding } from "@/components/site/auth-landing";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta gratuita na PyTrack e comece a dominar Python.",
};

export default function CadastroPage() {
  return <AuthLanding mode="signup" />;
}
