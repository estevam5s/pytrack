"use client";

import { useEffect, useState } from "react";

/** Saudação baseada na hora LOCAL do usuário (evita bug de fuso do servidor UTC). */
export function Greeting({ name }: { name: string }) {
  // começa neutro e ajusta no cliente para não dar mismatch de hidratação
  const [greeting, setGreeting] = useState("Olá");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite");
  }, []);

  return (
    <>
      {greeting}, {name}! 👋
    </>
  );
}
