"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-danger/30 bg-danger/5 px-6 py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="text-lg font-semibold">Algo deu errado</h2>
      <p className="mt-1 max-w-md text-sm text-text-secondary">
        {error.message || "Não foi possível carregar esta página. Tente novamente."}
      </p>
      <Button onClick={reset} className="mt-5">
        Tentar novamente
      </Button>
    </div>
  );
}
