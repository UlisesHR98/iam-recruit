"use client";

import { useState, Suspense } from "react";
import { JobsTable } from "@/components/jobs/jobs-table";
import { JobsTableSkeleton } from "@/components/skeletons/jobs-skeleton";
import { JobWizard } from "@/components/jobs/job-wizard";

export default function VacantesClient() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | undefined>();

  const handleEditJob = (id: string) => {
    setEditingJobId(id);
    setWizardOpen(true);
  };

  const handleCreateJob = () => {
    setEditingJobId(undefined);
    setWizardOpen(true);
  };

  const handleWizardClose = (open: boolean) => {
    if (!open) {
      setEditingJobId(undefined);
    }
    setWizardOpen(open);
  };

  return (
    <>
      <Suspense fallback={<JobsTableSkeleton />}>
        <JobsTable onEditJob={handleEditJob} onCreateJob={handleCreateJob} />
      </Suspense>

      <JobWizard
        open={wizardOpen}
        onOpenChange={handleWizardClose}
        jobId={editingJobId}
      />
    </>
  );
}
