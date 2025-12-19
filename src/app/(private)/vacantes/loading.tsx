import { JobsTableSkeleton } from "@/components/skeletons/jobs-skeleton";

const VacantesLoading = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
                Vacantes
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Gestiona y publica nuevas oportunidades laborales
              </p>
            </div>
          </div>
        </div>
        <JobsTableSkeleton />
      </div>
    </div>
  );
};

export default VacantesLoading;
