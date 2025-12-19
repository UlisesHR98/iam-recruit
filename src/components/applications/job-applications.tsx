"use client";

import { useApplications } from "@/hooks/use-applications";
import { ApplicationCard } from "@/components/applications/application-card";
import { CardsSkeleton } from "@/components/skeletons/cards-skeleton";
import type { JobApplicationsProps } from "@/lib/types";

export function JobApplications({ jobId }: JobApplicationsProps) {
  const { applications, isLoading, isError } = useApplications({
    job_id: jobId,
    limit: 50,
  });

  if (isLoading) {
    return <CardsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">Error al cargar las aplicaciones</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">
          No hay aplicaciones para esta vacante
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          fromJobId={jobId}
        />
      ))}
    </div>
  );
}
