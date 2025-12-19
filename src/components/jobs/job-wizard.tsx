"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import useSWR from "swr";
import { mutate } from "swr";
import { toast } from "sonner";

import { jobSchema } from "@/schemas/job.schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth-store";
import { fetcher } from "@/lib/fetchers";
import type { JobDetails, JobSchema, JobWizardProps } from "@/lib/types";
import { useJobAreas } from "@/hooks/use-job-areas";
import {
  BasicInfoStep,
  RequirementsStep,
  SalaryStep,
  ReviewStep,
} from "./wizard/wizard-steps";

const TOTAL_STEPS = 4;

const DEFAULT_VALUES: JobSchema = {
  area: "",
  role: "",
  min_experience_years: 0,
  min_education: "",
  required_skills: [],
  location: "",
  salary_min: undefined,
  salary_max: undefined,
  observations: "",
  status: "draft",
};

const STEP_FIELDS: Record<number, (keyof JobSchema)[]> = {
  1: ["area", "role", "location", "status"],
  2: ["min_experience_years", "min_education", "required_skills"],
  3: ["salary_min", "salary_max"],
};

export function JobWizard({ open, onOpenChange, jobId }: JobWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(jobId);
  const shouldFetchJob = Boolean(jobId && open);

  const { data: jobData, isLoading: isLoadingJob } = useSWR<JobDetails>(
    shouldFetchJob ? `/jobs/${jobId}` : null,
    fetcher
  );

  const { areas } = useJobAreas({ activeOnly: true });

  const form = useForm<JobSchema>({
    resolver: zodResolver(jobSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;

    if (jobData) {
      form.reset({
        area: jobData.area,
        role: jobData.role,
        min_experience_years: jobData.min_experience_years,
        min_education: jobData.min_education,
        required_skills: jobData.required_skills,
        location: jobData.location,
        salary_min: jobData.salary_min ?? undefined,
        salary_max: jobData.salary_max ?? undefined,
        observations: jobData.observations ?? "",
        status: jobData.status,
      });
    } else if (!jobId) {
      form.reset(DEFAULT_VALUES);
    }

    setCurrentStep(1);
    setSkillInput("");
  }, [jobData, open, jobId, form]);

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    setCurrentStep(1);
    setSkillInput("");
    onOpenChange(false);
  };

  const handleNext = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    if (!fieldsToValidate) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      return;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    const currentSkills = form.getValues("required_skills");
    if (skill && !currentSkills.includes(skill)) {
      form.setValue("required_skills", [...currentSkills, skill]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const currentSkills = form.getValues("required_skills");
    form.setValue(
      "required_skills",
      currentSkills.filter((s) => s !== skill)
    );
  };

  const onSubmit = async (data: JobSchema) => {
    setIsSubmitting(true);
    const accessToken = useAuthStore.getState().accessToken;

    try {
      const url = isEditing ? `/api/jobs/${jobId}` : "/api/jobs";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const defaultMessage = isEditing
          ? "Error al actualizar la vacante"
          : "Error al crear la vacante";
        throw new Error(error.message || defaultMessage);
      }

      toast.success(
        isEditing
          ? "Vacante actualizada exitosamente"
          : "Vacante creada exitosamente"
      );

      await mutate("/jobs");
      if (isEditing) {
        await mutate(`/jobs/${jobId}`);
      }

      handleClose();
    } catch (err) {
      const defaultMessage = isEditing
        ? "Error al actualizar la vacante"
        : "Error al crear la vacante";
      toast.error(err instanceof Error ? err.message : defaultMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = isEditing ? "Editar vacante" : "Crear nueva vacante";
  const submitLabel = isSubmitting
    ? isEditing
      ? "Actualizando..."
      : "Creando..."
    : isEditing
    ? "Actualizar vacante"
    : "Crear vacante";

  if (isLoadingJob && isEditing) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="fixed! inset-0! z-50! flex flex-col max-w-none! w-screen! h-screen! rounded-none! p-0! translate-x-0! translate-y-0! top-0! left-0! grid-cols-none!"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="fixed! inset-0! z-50! flex flex-col max-w-none! w-screen! h-screen! rounded-none! p-0! translate-x-0! translate-y-0! top-0! left-0! grid-cols-none!"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex h-full flex-col">
          <WizardHeader
            title={title}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onClose={handleClose}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-6 py-8">
              {currentStep === 1 && <BasicInfoStep form={form} areas={areas} />}
              {currentStep === 2 && (
                <RequirementsStep
                  form={form}
                  skillInput={skillInput}
                  onSkillInputChange={setSkillInput}
                  onAddSkill={handleAddSkill}
                  onRemoveSkill={handleRemoveSkill}
                />
              )}
              {currentStep === 3 && <SalaryStep form={form} />}
              {currentStep === 4 && <ReviewStep form={form} areas={areas} />}
            </div>
          </div>

          <WizardFooter
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            isSubmitting={isSubmitting}
            isLoadingJob={isLoadingJob}
            submitLabel={submitLabel}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

type WizardHeaderProps = {
  title: string;
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
};

function WizardHeader({
  title,
  currentStep,
  totalSteps,
  onClose,
}: WizardHeaderProps) {
  return (
    <div className="border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Paso {currentStep} de {totalSteps}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>
      <div className="mt-4 flex gap-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`h-1 flex-1 rounded-full ${
              step <= currentStep ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

type WizardFooterProps = {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  isLoadingJob: boolean;
  submitLabel: string;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

function WizardFooter({
  currentStep,
  totalSteps,
  isSubmitting,
  isLoadingJob,
  submitLabel,
  onBack,
  onNext,
  onSubmit,
}: WizardFooterProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="border-t px-6 py-4">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="size-4 mr-2" />
          Anterior
        </Button>
        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || isLoadingJob}
          >
            {submitLabel}
          </Button>
        ) : (
          <Button type="button" onClick={onNext}>
            Siguiente
            <ChevronRight className="size-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
