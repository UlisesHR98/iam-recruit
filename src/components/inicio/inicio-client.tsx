"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/ui/stat-card";
import { Briefcase, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobsOnboarding } from "@/components/jobs/jobs-onboarding";
import { JobWizard } from "@/components/jobs/job-wizard";
import { PendingConfirmations } from "./pending-confirmations";
import { useAuthStore } from "@/stores/auth-store";
import { useJobs } from "@/hooks/use-jobs";

export default function InicioClient() {
  const router = useRouter();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const isNewAccount = useAuthStore((state) => state.isNewAccount);
  const { jobs, isLoading: isLoadingJobs } = useJobs();

  const hasCompletedOnboarding =
    typeof window !== "undefined" &&
    localStorage.getItem("iam-recruit-onboarding-completed") === "true";

  const showOnboardingAuto =
    !onboardingDismissed &&
    !onboardingOpen &&
    !isLoadingJobs &&
    jobs.length === 0 &&
    isNewAccount &&
    !hasCompletedOnboarding;

  const handleCreateJob = () => {
    setWizardOpen(true);
  };

  const handleWizardClose = async (open: boolean) => {
    if (!open) {
      router.refresh();
    }
    setWizardOpen(open);
  };

  const handleOnboardingDismiss = () => {
    setOnboardingDismissed(true);
    setOnboardingOpen(false);
  };

  const handleOpenOnboarding = () => {
    setOnboardingOpen(true);
    setOnboardingDismissed(false);
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl space-y-6 sm:space-y-8">
        {showOnboardingAuto || onboardingOpen ? (
          <JobsOnboarding
            onCreateJob={handleCreateJob}
            onDismiss={handleOnboardingDismiss}
            forceOpen={onboardingOpen}
          />
        ) : (
          <>
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

            <PendingConfirmations />

            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold">Guías</h2>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-1">
                      Guía de inicio rápido
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Aprende a usar IAM Recruit paso a paso. Descubre cómo
                      crear vacantes, gestionar candidatos y analizar
                      resultados.
                    </p>
                    <Button onClick={handleOpenOnboarding} size="sm">
                      Ver guía
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <JobWizard open={wizardOpen} onOpenChange={handleWizardClose} />
    </div>
  );
}
