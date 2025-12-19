import VacantesClient from "@/components/jobs/jobs-client";

export default function VacantesPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Vacantes</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gestiona y publica nuevas oportunidades laborales
          </p>
        </div>
        <VacantesClient />
      </div>
    </div>
  );
}
