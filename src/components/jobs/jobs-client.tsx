"use client";

import { useState, Suspense, useCallback, lazy } from "react";
import { mutate } from "swr";
import { JobsTable } from "@/components/jobs/jobs-table";
import { JobsTableSkeleton } from "@/components/skeletons/jobs-skeleton";

// Lazy load JobWizard - solo se carga cuando se necesita
const JobWizard = lazy(
  () => import("@/components/jobs/job-wizard").then((mod) => ({ default: mod.JobWizard }))
);

export default function VacantesClient() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | undefined>();

  const handleEditJob = useCallback((id: string) => {
    setEditingJobId(id);
    setWizardOpen(true);
  }, []);

  const handleCreateJob = useCallback(() => {
    setEditingJobId(undefined);
    setWizardOpen(true);
  }, []);

  const handleWizardClose = useCallback(async (open: boolean) => {
    if (!open) {
      if (!editingJobId) {
        await mutate(
          (key) => typeof key === "string" && key.startsWith("/jobs")
        );
      }
      setEditingJobId(undefined);
    }
    setWizardOpen(open);
  }, [editingJobId]);

  return (
    <div className="space-y-6">
      <Suspense fallback={<JobsTableSkeleton />}>
        <JobsTable onEditJob={handleEditJob} onCreateJob={handleCreateJob} />
      </Suspense>

      {wizardOpen && (
        <Suspense fallback={null}>
          <JobWizard
            open={wizardOpen}
            onOpenChange={handleWizardClose}
            jobId={editingJobId}
          />
        </Suspense>
      )}
    </div>
  );
}
