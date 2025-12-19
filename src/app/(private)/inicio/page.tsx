import StatCard from "@/components/ui/stat-card";
import React from "react";
import { Briefcase, FileText, Clock } from "lucide-react";

const InicioPage = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Esto es lo que ha pasado con tus candidatos hoy
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            title="Vacantes activas"
            value={10}
            icon={<Briefcase className="size-5" />}
          />
          <StatCard
            title="CVs pendientes"
            value={10}
            icon={<FileText className="size-5" />}
          />
          <StatCard
            title="Tiempo promedio de contratación"
            value={10}
            icon={<Clock className="size-5" />}
          />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Decisiones rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="h-24 sm:h-32 rounded-lg border border-border bg-card " />
            <div className="h-24 sm:h-32 rounded-lg border border-border bg-card " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioPage;
