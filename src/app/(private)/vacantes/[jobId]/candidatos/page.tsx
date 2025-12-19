import { JobApplications } from "@/components/applications/job-applications";

type PageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export default async function CandidatosPage({ params }: PageProps) {
  const { jobId } = await params;

  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
            Candidatos
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Aplicaciones para la vacante
          </p>
        </div>

        <JobApplications jobId={jobId} />
      </div>
    </div>
  );
}
