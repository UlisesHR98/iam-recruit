"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PendingConfirmations } from "./pending-confirmations";
import { useAuthStore } from "@/stores/auth-store";
import { useJobs } from "@/hooks/use-jobs";
import { Loading } from "@/components/ui/loading";

// Lazy load componentes pesados
const JobsOnboarding = lazy(() =>
  import("@/components/jobs/jobs-onboarding").then((mod) => ({
    default: mod.JobsOnboarding,
  }))
);
const JobWizard = lazy(() =>
  import("@/components/jobs/job-wizard").then((mod) => ({
    default: mod.JobWizard,
  }))
);

export default function InicioClient() {
  const router = useRouter();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const isNewAccount = useAuthStore((state) => state.isNewAccount);
  const setIsNewAccount = useAuthStore((state) => state.setIsNewAccount);
  const { jobs, isLoading: isLoadingJobs } = useJobs();

  // Verificar sessionStorage después del montaje para asegurar que el estado esté sincronizado
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("iam-recruit-is-new-account");
      if (stored === "true" && !isNewAccount) {
        setIsNewAccount(true);
      }
    }
  }, [isNewAccount, setIsNewAccount]);

  const hasCompletedOnboarding = useMemo(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("iam-recruit-onboarding-completed") === "true",
    []
  );

  const showOnboardingAuto = useMemo(
    () =>
      !onboardingDismissed &&
      !onboardingOpen &&
      !isLoadingJobs &&
      jobs.length === 0 &&
      isNewAccount &&
      !hasCompletedOnboarding,
    [
      onboardingDismissed,
      onboardingOpen,
      isLoadingJobs,
      jobs.length,
      isNewAccount,
      hasCompletedOnboarding,
    ]
  );

  const handleCreateJob = useCallback(() => {
    setWizardOpen(true);
  }, []);

  const handleWizardClose = useCallback(
    async (open: boolean) => {
      if (!open) {
        router.refresh();
      }
      setWizardOpen(open);
    },
    [router]
  );

  const handleOnboardingDismiss = useCallback(() => {
    setOnboardingDismissed(true);
    setOnboardingOpen(false);
  }, []);

  const handleOpenOnboarding = useCallback(() => {
    setOnboardingOpen(true);
    setOnboardingDismissed(false);
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl space-y-6 sm:space-y-8">
        {showOnboardingAuto || onboardingOpen ? (
          <Suspense
            fallback={<Loading message="Cargando guía..." variant="inline" />}
          >
            <JobsOnboarding
              onCreateJob={handleCreateJob}
              onDismiss={handleOnboardingDismiss}
              forceOpen={onboardingOpen}
            />
          </Suspense>
        ) : (
          <>
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

      {wizardOpen && (
        <Suspense fallback={null}>
          <JobWizard open={wizardOpen} onOpenChange={handleWizardClose} />
        </Suspense>
      )}
    </div>
  );
}
