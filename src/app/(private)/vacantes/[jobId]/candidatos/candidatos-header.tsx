"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function CandidatosHeader() {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/vacantes")}
          className="gap-2"
        >
          <ChevronLeft className="size-4" />
          Volver a vacantes
        </Button>
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Candidatos</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Aplicaciones para la vacante
        </p>
      </div>
    </div>
  );
}
