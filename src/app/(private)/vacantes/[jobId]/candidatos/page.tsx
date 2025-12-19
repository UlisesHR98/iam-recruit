import { JobApplications } from "@/components/applications/job-applications";
import { CandidatosHeader } from "./candidatos-header";

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
        <CandidatosHeader />

        <JobApplications jobId={jobId} />
      </div>
    </div>
  );
}
