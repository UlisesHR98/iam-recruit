"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Users,
  BarChart3,
  Sparkles,
  GraduationCap,
  DollarSign,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

interface JobsOnboardingProps {
  onCreateJob: () => void;
  onDismiss?: () => void;
  forceOpen?: boolean;
}

const ONBOARDING_STORAGE_KEY = "iam-recruit-onboarding-completed";

export function JobsOnboarding({
  onCreateJob,
  onDismiss,
  forceOpen = false,
}: JobsOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const setIsNewAccount = useAuthStore((state) => state.setIsNewAccount);

  const steps: OnboardingStep[] = useMemo(
    () => [
      {
        id: "basic-info",
        title: "Información Básica",
        description:
          "Define el área, rol y ubicación de tu vacante para atraer a los candidatos correctos.",
        icon: <Briefcase className="size-5" />,
        details: [
          "Selecciona el área de trabajo",
          "Define el rol específico",
          "Configura tipo de ubicación (Remoto, Híbrido, Presencial)",
          "Establece el estado de la vacante",
        ],
      },
      {
        id: "requirements",
        title: "Requisitos",
        description:
          "Especifica la experiencia, educación y habilidades necesarias para el puesto.",
        icon: <GraduationCap className="size-5" />,
        details: [
          "Define años de experiencia mínima",
          "Establece nivel educativo requerido",
          "Agrega habilidades técnicas específicas",
          "La IA usará esto para evaluar candidatos",
        ],
      },
      {
        id: "salary",
        title: "Rango Salarial",
        description:
          "Configura el rango de compensación para atraer talento competitivo.",
        icon: <DollarSign className="size-5" />,
        details: [
          "Define salario mínimo (opcional)",
          "Establece salario máximo (opcional)",
          "Información visible para candidatos",
          "Ayuda a filtrar candidatos calificados",
        ],
      },
      {
        id: "review",
        title: "Revisar y Publicar",
        description:
          "Revisa toda la información y publica tu vacante para comenzar a recibir aplicaciones.",
        icon: <CheckCircle2 className="size-5" />,
        details: [
          "Revisa todos los detalles",
          "Agrega observaciones adicionales",
          "Publica la vacante",
          "Comienza a recibir candidatos",
        ],
      },
    ],
    []
  );

  useEffect(() => {
    if (!forceOpen) {
      const hasCompleted = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (hasCompleted === "true") {
        setIsVisible(false);
      }
    } else {
      setIsVisible(true);
    }
  }, [forceOpen]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setIsNewAccount(false);
    onDismiss?.();
  }, [setIsNewAccount, onDismiss]);

  const handleComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setIsNewAccount(false);
    onCreateJob();
  }, [setIsNewAccount, onCreateJob]);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const currentStepData = useMemo(
    () => steps[currentStep],
    [steps, currentStep]
  );
  const isLastStep = useMemo(
    () => currentStep === steps.length - 1,
    [currentStep, steps.length]
  );

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Sidebar */}
          <div className="lg:w-80 bg-muted/30 p-6 border-r">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Guía de Creación
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sigue estos pasos para crear tu primera vacante
                </p>
              </div>

              <div className="space-y-1">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    disabled={index > currentStep}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                      index === currentStep &&
                        "bg-primary text-primary-foreground shadow-sm",
                      index < currentStep &&
                        "hover:bg-muted cursor-pointer opacity-70",
                      index > currentStep && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center size-8 rounded-full shrink-0 font-semibold text-sm",
                        index === currentStep
                          ? "bg-primary-foreground text-primary"
                          : index < currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted-foreground/20 text-muted-foreground"
                      )}
                    >
                      {index < currentStep ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          index !== currentStep && "text-muted-foreground"
                        )}
                      >
                        {step.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {currentStep === 0 && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-900">
                  <div className="flex items-start gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        Consejo
                      </h4>
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        Nuestra IA evaluará automáticamente a los candidatos
                        basándose en los requisitos que definas aquí.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-8">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    PASO {currentStep + 1} DE {steps.length}
                  </p>
                  <h2 className="text-3xl font-bold mb-3">
                    {currentStepData.title}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {currentStepData.description}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/30 p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="shrink-0 rounded-lg bg-primary/10 p-3 text-primary">
                      {currentStepData.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">
                        Lo que configurarás:
                      </h3>
                      <ul className="space-y-2">
                        {currentStepData.details.map((detail, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-primary" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {isLastStep && (
                  <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 border border-green-200 dark:border-green-900">
                    <div className="flex items-start gap-3">
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                          ¡Listo para comenzar!
                        </h4>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Una vez que crees tu vacante, comenzarás a recibir
                          candidatos. Nuestra IA los evaluará automáticamente y
                          te mostrará los mejores perfiles.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-6 bg-muted/20">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-muted-foreground"
                >
                  Omitir guía
                </Button>

                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <Button variant="outline" onClick={handlePrevious}>
                      <ChevronLeft className="size-4 mr-1" />
                      Anterior
                    </Button>
                  )}

                  {isLastStep ? (
                    <Button onClick={handleComplete} className="gap-2">
                      Crear mi primera vacante
                      <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="gap-2">
                      Siguiente
                      <ChevronRight className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
