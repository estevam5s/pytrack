import type { Metadata } from "next";
import { AuthLanding } from "@/components/site/auth-landing";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse a plataforma PyTrack e continue sua jornada Python.",
};

export default function LoginPage() {
  return <AuthLanding mode="login" />;
}
